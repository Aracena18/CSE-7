<?php
header('Content-Type: application/json');
require_once 'db_attendance.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $employeeId = $data['employee_id'];
    $currentDate = date('Y-m-d');
    
    // Strict check for existing attendance
    $checkQuery = "SELECT id, time_in FROM attendance 
                  WHERE employee_id = ? 
                  AND DATE(time_in) = ?";
    
    $stmt = $conn->prepare($checkQuery);
    $stmt->bind_param("ss", $employeeId, $currentDate);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $record = $result->fetch_assoc();
        $recordTime = date('h:i A', strtotime($record['time_in']));
        
        echo json_encode([
            'success' => false,
            'message' => "You have already recorded attendance today at {$recordTime}. You can only record attendance once per day.",
            'type' => 'duplicate_entry'
        ]);
        exit();
    }

    // Only proceed if no existing record found
    $status = $data['status'];
    $insertQuery = "INSERT INTO attendance (employee_id, time_in, status) VALUES (?, NOW(), ?)";
    
    $stmt = $conn->prepare($insertQuery);
    $stmt->bind_param("ss", $employeeId, $status);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Attendance recorded successfully',
            'type' => 'success'
        ]);
    } else {
        throw new Exception($stmt->error);
    }

} catch(Exception $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'type' => 'error'
    ]);
}
?>
