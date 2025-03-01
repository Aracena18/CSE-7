<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/attendance_debug.log');

// Debug: Log all incoming data
error_log("\n\n=== New Attendance Record Request ===");
error_log("POST Data: " . print_r($_POST, true));
error_log("Session Data: " . print_r($_SESSION, true));

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

try {
    // Add request ID to prevent double processing
    $requestId = $_POST['requestId'] ?? uniqid();
    $cacheKey = "attendance_submission_{$requestId}";
    
    // Check if this request was already processed
    if (isset($_SESSION[$cacheKey])) {
        error_log("Duplicate submission detected with request ID: " . $requestId);
        echo json_encode([
            "success" => true,
            "message" => "Attendance already recorded",
            "duplicate" => true,
            "data" => $_SESSION[$cacheKey]
        ]);
        exit;
    }

    // Use the correct database config file path
    require_once __DIR__ . "/db_attendance.php";  // Changed from db_attendance.php

    // Immediate database connection check
    if (!isset($conn) || $conn->connect_error) {
        throw new Exception("Database connection failed: " . ($conn->connect_error ?? "Connection not established"));
    }

    // Validate POST data before processing
    if (empty($_POST)) {
        throw new Exception("No data received");
    }

    error_log("Received POST data: " . print_r($_POST, true));

    // Check if user is authenticated
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('User not authenticated');
    }

    // Validate and sanitize input
    if (!isset($_POST['employeeName'], $_POST['attendanceDate'], $_POST['status'])) {
        throw new Exception('Missing required fields');
    }

    $employeeName = trim($_POST['employeeName']);
    // Format date properly
    $attendanceDate = date('Y-m-d', strtotime(str_replace(',', '', $_POST['attendanceDate'])));
    $timeIn = !empty($_POST['timeIn']) ? date('H:i:s', strtotime($_POST['timeIn'])) : null;
    $timeOut = !empty($_POST['timeOut']) ? date('H:i:s', strtotime($_POST['timeOut'])) : null;
    $status = trim($_POST['status']);

    error_log("Processed input data:");
    error_log("Employee Name: " . $employeeName);
    error_log("Date: " . $attendanceDate);
    error_log("Time In: " . ($timeIn ?? 'null'));
    error_log("Time Out: " . ($timeOut ?? 'null'));

    // Get employee_id
    $stmt = $conn->prepare("SELECT emp_id FROM employees WHERE name = ?");
    if (!$stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }
    
    $stmt->bind_param("s", $employeeName);
    if (!$stmt->execute()) {
        error_log("Execute failed: " . $stmt->error);
        throw new Exception("Failed to search for employee");
    }
    
    $result = $stmt->get_result();
    if ($result->num_rows === 0) {
        error_log("No employee found with name: " . $employeeName);
        throw new Exception('Employee not found: ' . $employeeName);
    }
    
    $employee = $result->fetch_assoc();
    $employee_id = $employee['emp_id'];

    // Calculate working hours if both time_in and time_out are present
    $regular_hours = 0;
    $overtime_hours = 0;
    
    if ($timeIn && $timeOut) {
        $time1 = strtotime($timeIn);
        $time2 = strtotime($timeOut);
        $difference = $time2 - $time1;
        
        $total_hours = $difference / 3600; // Convert seconds to hours
        
        // Assuming 8 hours is regular working hours
        if ($total_hours <= 8) {
            $regular_hours = $total_hours;
        } else {
            $regular_hours = 8;
            $overtime_hours = $total_hours - 8;
        }
    }

    // Check if attendance record already exists for this employee on this date
    $check_stmt = $conn->prepare("SELECT id FROM attendance WHERE employee_id = ? AND date = ?");
    if (!$check_stmt) {
        throw new Exception("Failed to prepare check statement: " . $conn->error);
    }
    $check_stmt->bind_param("is", $employee_id, $attendanceDate);
    $check_stmt->execute();
    $existing_record = $check_stmt->get_result();

    // Debug: Log the final SQL operation
    error_log("Attempting to " . ($existing_record->num_rows > 0 ? "update" : "insert") . " attendance record");
    
    if ($existing_record->num_rows > 0) {
        // Update existing record - 7 parameters
        $stmt = $conn->prepare("UPDATE attendance SET time_in = ?, time_out = ?, status = ?, 
                               regular_hours = ?, overtime_hours = ? WHERE employee_id = ? AND date = ?");
        if (!$stmt) {
            throw new Exception("Prepare failed for update: " . $conn->error);
        }
        
        $stmt->bind_param("sssddis", 
            $timeIn,
            $timeOut,
            $status,
            $regular_hours,
            $overtime_hours,
            $employee_id,
            $attendanceDate
        );
    } else {
        // Insert new record - 7 parameters
        $stmt = $conn->prepare("INSERT INTO attendance (employee_id, date, time_in, time_out, status, 
                               regular_hours, overtime_hours) VALUES (?, ?, ?, ?, ?, ?, ?)");
        if (!$stmt) {
            throw new Exception("Prepare failed for insert: " . $conn->error);
        }
        
        $stmt->bind_param("isssddd", 
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
    error_log("About to execute with parameters:");
    error_log("employee_id: " . $employee_id);
    error_log("date: " . $attendanceDate);
    error_log("time_in: " . ($timeIn ?? 'null'));
    error_log("time_out: " . ($timeOut ?? 'null'));
    error_log("status: " . $status);
    error_log("regular_hours: " . $regular_hours);
    error_log("overtime_hours: " . $overtime_hours);

    if (!$stmt->execute()) {
        error_log("Execute failed: " . $stmt->error);
        throw new Exception("Failed to record attendance: " . $stmt->error);
    }

    error_log("Attendance record successfully saved");

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
    error_log("ERROR in record_attendance.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage(),
        "debug" => [
            "file" => __FILE__,
            "line" => __LINE__,
            "error" => $e->getMessage(),
            "trace" => $e->getTraceAsString()
        ]
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
        error_log("Closing prepared statement");
        $stmt->close();
    }
    if (isset($check_stmt)) {
        error_log("Closing check statement");
        $check_stmt->close();
    }
    if (isset($conn)) {
        error_log("Closing database connection");
        $conn->close();
    }
}
?>
