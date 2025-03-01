<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
require_once 'db_attendance.php';

// Set headers for JSON response
header('Content-Type: application/json');

try {
    // Get attendance ID from request
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
    if (!$id) {
        throw new Exception('Invalid attendance ID');
    }

    // Get current time in correct format for MySQL TIME field (HH:mm:ss)
    date_default_timezone_set('Asia/Manila');
    $currentTime = date('H:i:s');

    // Check if time_out already exists
    $checkSql = "SELECT time_in, time_out FROM attendance WHERE id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param('i', $id);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $record = $result->fetch_assoc();

    if (!$record) {
        throw new Exception('Attendance record not found');
    }

    if ($record['time_out'] !== null) {
        throw new Exception('Time out already recorded for this attendance');
    }

    // Calculate working hours using TIME_TO_SEC function for accurate time difference
    $sql = "UPDATE attendance SET 
            time_out = ?, 
            regular_hours = ROUND(TIME_TO_SEC(TIMEDIFF(?, time_in)) / 3600, 2)
            WHERE id = ? AND time_out IS NULL";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssi', $currentTime, $currentTime, $id);
    
    if ($stmt->execute()) {
        // Get updated attendance record
        $select_sql = "SELECT * FROM attendance WHERE id = ?";
        $select_stmt = $conn->prepare($select_sql);
        $select_stmt->bind_param('i', $id);
        $select_stmt->execute();
        $result = $select_stmt->get_result();
        $attendance = $result->fetch_assoc();
        
        // Calculate overtime if working hours > 8
        $workingHours = $attendance['regular_hours'];
        $overtime = max(0, $workingHours - 8);
        
        if ($overtime > 0) {
            // Update overtime hours
            $update_overtime = "UPDATE attendance SET 
                              overtime_hours = ?,
                              regular_hours = 8
                              WHERE id = ?";
            $overtime_stmt = $conn->prepare($update_overtime);
            $overtime_stmt->bind_param('di', $overtime, $id);
            $overtime_stmt->execute();
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Attendance updated successfully',
            'data' => [
                'time_out' => $currentTime,
                'regular_hours' => min(8, $workingHours),
                'overtime_hours' => $overtime
            ]
        ]);
    } else {
        throw new Exception('Failed to update attendance');
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

$conn->close();