<?php
session_start();
require_once "db_attendance.php";

header('Content-Type: application/json');

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
$logFile = __DIR__ . '/attendance_debug.log';

function writeLog($message) {
    global $logFile;
    $timestamp = date('[d-M-Y H:i:s e] ');
    file_put_contents($logFile, $timestamp . $message . "\n", FILE_APPEND);
}

writeLog("\n=== New Attendance Record Request ===");
writeLog("POST Data: " . print_r($_POST, true));
writeLog("Session Data: " . print_r($_SESSION, true));

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

try {
    if (empty($_POST)) {
        throw new Exception("No data received");
    }

    // Generate unique request ID and cache key
    $requestId = uniqid('att_', true);
    $cacheKey = 'attendance_submission_' . $requestId;

    // Validate and sanitize input
    if (!isset($_POST['employeeName'], $_POST['attendanceDate'], $_POST['status'])) {
        throw new Exception('Missing required fields');
    }

    $employeeName = trim($_POST['employeeName']);
    // Convert the attendance date into Y-m-d format
    $attendanceDate = date('Y-m-d', strtotime(str_replace(',', '', $_POST['attendanceDate'])));
    $timeIn = !empty($_POST['timeIn']) ? date('H:i:s', strtotime($_POST['timeIn'])) : null;
    $timeOut = !empty($_POST['timeOut']) ? date('H:i:s', strtotime($_POST['timeOut'])) : null;
    $status = strtolower(trim($_POST['status']));

    writeLog("Processed input data:");
    writeLog("Employee Name: $employeeName");
    writeLog("Date: $attendanceDate");
    writeLog("Time In: " . ($timeIn ?? 'null'));
    writeLog("Time Out: " . ($timeOut ?? 'null'));

    // Normalize the employee name by trimming excess spaces and converting to a standard case
    $employeeName = trim(preg_replace('/\s+/', ' ', $employeeName));

    // Get employee_id and status using the name column
    $stmt = $conn->prepare("SELECT emp_id, status FROM employees WHERE LOWER(TRIM(name)) = LOWER(?)");
    if (!$stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("s", $employeeName);
    if (!$stmt->execute()) {
        writeLog("Execute failed: " . $stmt->error);
        throw new Exception("Failed to search for employee");
    }
    
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        writeLog("No employee found with name: " . $employeeName);
        throw new Exception('Employee not found: ' . $employeeName);
    }
    
    $employee = $result->fetch_assoc();
    $employee_id = $employee['emp_id'];
    $employeeStatus = strtolower(trim($employee['status']));

    // Only allow attendance submission if the employee status is active.
    if ($employeeStatus !== 'active') {
        writeLog("Employee status is not active: " . $employee['status']);
        throw new Exception("Attendance cannot be recorded: Employee status is not active.");
    }

    // Calculate working hours if both timeIn and timeOut are present
    $regular_hours = 0;
    $overtime_hours = 0;
    
    if ($timeIn && $timeOut) {
        $time1 = strtotime($timeIn);
        $time2 = strtotime($timeOut);
        $difference = $time2 - $time1;
        
        $total_hours = $difference / 3600;
        $regular_hours = min($total_hours, 8);
        $overtime_hours = max(0, $total_hours - 8);
    }

    // Check for existing attendance record (only allow one record per day)
    $checkQuery = "SELECT id, time_in, time_out, status FROM attendance 
                   WHERE employee_id = ? AND `date` = ?";
    $check_stmt = $conn->prepare($checkQuery);
    if (!$check_stmt) {
        throw new Exception("Failed to prepare check statement: " . $conn->error);
    }
    
    writeLog("Checking for existing attendance record:");
    writeLog("Employee ID: " . $employee_id);
    writeLog("Date: " . $attendanceDate);
    
    $check_stmt->bind_param("is", $employee_id, $attendanceDate);
    $check_stmt->execute();
    $existing_record = $check_stmt->get_result();

    if ($existing_record->num_rows > 0) {
        $record = $existing_record->fetch_assoc();
        writeLog("Found existing record - ID: " . $record['id']);
        echo json_encode([
            "success" => false,
            "message" => "Cannot add attendance twice a day",
            "requestId" => $requestId,
            "data" => [
                "employee_id" => $employee_id,
                "date" => $attendanceDate,
                "time_in" => $record['time_in'],
                "time_out" => $record['time_out'],
                "status" => $record['status']
            ]
        ]);
        exit;
    } else {
        writeLog("No existing attendance record found - creating new record");
        // Create new record
        $stmt = $conn->prepare("INSERT INTO attendance (employee_id, `date`, time_in, time_out, status, regular_hours, overtime_hours) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issssdd", 
            $employee_id,
            $attendanceDate,
            $timeIn,
            $timeOut,
            $status,
            $regular_hours,
            $overtime_hours
        );
    }

    // Add debug logging before execute
    writeLog("About to execute with parameters:");
    writeLog("employee_id: " . $employee_id);
    writeLog("date: " . $attendanceDate);
    writeLog("time_in: " . ($timeIn ?? 'null'));
    writeLog("time_out: " . ($timeOut ?? 'null'));
    writeLog("status: " . $status);
    writeLog("regular_hours: " . $regular_hours);
    writeLog("overtime_hours: " . $overtime_hours);

    if (!$stmt->execute()) {
        writeLog("Execute failed: " . $stmt->error);
        throw new Exception("Failed to record attendance: " . $stmt->error);
    }

    writeLog("Attendance record successfully saved");

    // Store the successful submission in session
    $_SESSION[$cacheKey] = [
        "employee_id" => $employee_id,
        "date" => $attendanceDate,
        "time_in" => $timeIn,
        "time_out" => $timeOut,
        "status" => $status,
        "regular_hours" => $regular_hours,
        "overtime_hours" => $overtime_hours
    ];

    // Set expiration for the cache key (e.g., 5 minutes)
    $_SESSION["{$cacheKey}_expires"] = time() + 300;

    echo json_encode([
        "success" => true,
        "message" => "Attendance recorded successfully",
        "requestId" => $requestId,
        "data" => $_SESSION[$cacheKey]
    ]);

} catch (Exception $e) {
    writeLog("ERROR: " . $e->getMessage());
    writeLog("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
} finally {
    // Clean up expired cache entries
    foreach ($_SESSION as $key => $value) {
        if (strpos($key, 'attendance_submission_') === 0 && isset($_SESSION["{$key}_expires"])) {
            if ($_SESSION["{$key}_expires"] < time()) {
                unset($_SESSION[$key]);
                unset($_SESSION["{$key}_expires"]);
            }
        }
    }
    if (isset($stmt)) {
        writeLog("Closing prepared statement");
        $stmt->close();
    }
    if (isset($check_stmt)) {
        writeLog("Closing check statement");
        $check_stmt->close();
    }
    if (isset($conn)) {
        writeLog("Closing database connection");
        $conn->close();
    }
}
?>
