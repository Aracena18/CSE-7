<?php
session_start();
header('Content-Type: application/json');
require_once "db_config_task.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    // Get form data
    $taskId = $_POST['taskId'] ?? null;
    
    if (!$taskId) {
        throw new Exception("Task ID is required");
    }

    $description = $_POST['taskDescription'] ?? '';
    $assignedTo = $_POST['assignedTo'] ?? '';
    $startDate = $_POST['startDate'] ?? '';
    $endDate = $_POST['endDate'] ?? '';
    $priority = $_POST['priority'] ?? '';
    $status = $_POST['status'] ?? '';
    $location = $_POST['taskLocation'] ?? '';
    $userId = $_SESSION['user_id'];

    // First verify the task exists and belongs to the user
    $checkStmt = $conn->prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?");
    $checkStmt->bind_param("ii", $taskId, $userId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Task not found or unauthorized to edit');
    }
    $checkStmt->close();

    $stmt = $conn->prepare("UPDATE tasks SET 
        description = ?,
        assigned_to = ?,
        start_date = ?,
        end_date = ?,
        priority = ?,
        status = ?,
        location = ?
        WHERE id = ? AND user_id = ?");

    $stmt->bind_param("sssssssii", 
        $description, 
        $assignedTo, 
        $startDate, 
        $endDate, 
        $priority, 
        $status, 
        $location, 
        $taskId, 
        $userId
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update task");
    }

    if ($stmt->affected_rows === 0) {
        throw new Exception("No task was updated");
    }

    echo json_encode([
        "success" => true,
        "message" => "Task updated successfully"
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($conn)) $conn->close();
}
