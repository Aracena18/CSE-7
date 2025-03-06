<?php
session_start();
require_once "db_attendance.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);
error_log("=== Starting get_employees_with_attendance ===");

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    error_log("Error: Unauthorized. No user_id in session.");
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

// Validate date format (YYYY-MM-DD)
if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $date)) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid date format"
    ]);
    exit;
}

error_log("Fetching employees for user_id: $user_id and date: $date");

try {
    // Use LEFT JOIN so that employees without attendance records are still returned.
    $query = "SELECT 
                e.emp_id, 
                e.name, 
                e.position, 
                TIME_FORMAT(a.time_in, '%h:%i %p') as time_in,
                TIME_FORMAT(a.time_out, '%h:%i %p') as time_out,
                a.status
              FROM employees e
              LEFT JOIN attendance a ON e.emp_id = a.employee_id AND DATE(a.date) = ?
              WHERE e.user_id = ?
              ORDER BY e.name ASC";

    error_log("Query: " . $query);
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    
    // Note: user_id is assumed to be an integer.
    $stmt->bind_param("si", $date, $user_id);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $employees = [];
    
    while ($row = $result->fetch_assoc()) {
        // Build an attendance sub-object if at least one time value is available
        $attendance = null;
        if (!empty($row['time_in']) || !empty($row['time_out'])) {
            $attendance = [
                "time_in" => $row['time_in'] ? $row['time_in'] : null,
                "time_out" => $row['time_out'] ? $row['time_out'] : null,
                "status" => $row['status'] ? $row['status'] : null
            ];
        }
        $employees[] = [
            "emp_id" => $row['emp_id'],
            "name" => $row['name'],
            "position" => $row['position'],
            "attendance" => $attendance
        ];
    }
    
    error_log("Employees with attendance: " . print_r($employees, true));
    
    echo json_encode([
        "success" => true,
        "data" => $employees
    ]);
    
} catch (Exception $e) {
    error_log("Error in get_employees_with_attendance.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch data: " . $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
    error_log("=== Ending get_employees_with_attendance ===");
}
?>
