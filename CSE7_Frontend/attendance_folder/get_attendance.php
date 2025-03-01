<?php
session_start();
require_once "db_attendance.php";

// Enable error logging
error_reporting(E_ALL);
ini_set('display_errors', 1);
error_log("=== Starting attendance fetch ===");

header('Content-Type: application/json');

// Debug session data
error_log("Session data: " . print_r($_SESSION, true));
error_log("Requested date: " . (isset($_GET['date']) ? $_GET['date'] : 'not set'));

if (!isset($_SESSION['user_id'])) {
    error_log("Error: No user_id in session");
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');

error_log("Fetching attendance for user_id: $user_id and date: $date");

try {
    $query = "SELECT 
                a.id,
                e.name as employee_name,
                TIME_FORMAT(a.time_in, '%h:%i %p') as time_in,
                TIME_FORMAT(a.time_out, '%h:%i %p') as time_out,
                a.status,
                CASE
                    WHEN a.time_in IS NOT NULL AND a.time_out IS NOT NULL
                    THEN ROUND(TIMESTAMPDIFF(MINUTE, a.time_in, a.time_out) / 60, 2)
                    ELSE NULL
                END as working_hours
              FROM attendance a
              JOIN employees e ON a.employee_id = e.emp_id
              WHERE DATE(a.date) = ? AND e.user_id = ?
              ORDER BY a.time_in DESC";

    error_log("Query: " . $query);
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param('si', $date, $user_id);
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    error_log("Number of rows found: " . $result->num_rows);
    
    $attendance_records = [];

    while ($row = $result->fetch_assoc()) {
        if ($row['working_hours'] !== null) {
            $row['working_hours'] = $row['working_hours'] . ' hrs';
        }
        $attendance_records[] = $row;
    }

    error_log("Attendance records: " . print_r($attendance_records, true));

    echo json_encode([
        'success' => true,
        'data' => $attendance_records
    ]);

} catch (Exception $e) {
    error_log("Error in get_attendance.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to fetch attendance records: ' . $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
    error_log("=== Ending attendance fetch ===");
}
?>
