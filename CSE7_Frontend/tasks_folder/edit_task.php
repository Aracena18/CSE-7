<?php
session_start();
header('Content-Type: application/json');
require_once "db_config_task.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['taskId'])) {
        throw new Exception("Task ID is required");
    }

    $taskId = $data['taskId'];
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

    $completed = ($data['status'] === 'completed') ? 1 : 0;

    $sql = "UPDATE tasks SET 
            description = ?,
            assigned_to = ?,
            start_date = ?,
            end_date = ?,
            priority = ?,
            status = ?,
            location = ?,
            completed = ?
            WHERE id = ? AND user_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssiii", 
        $data['description'],
        $data['assignedTo'],
        $data['startDate'],
        $data['endDate'],
        $data['priority'],
        $data['status'],
        $data['location'],
        $completed,
        $taskId,
        $userId
    );

    if (!$stmt->execute()) {
        throw new Exception("Failed to update task: " . $stmt->error);
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
