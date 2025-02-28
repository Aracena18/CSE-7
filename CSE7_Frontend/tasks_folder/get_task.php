<?php
session_start();
header('Content-Type: application/json');
require_once "db_config_task.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        throw new Exception("Task ID is required");
    }

    $taskId = intval($_GET['id']);
    if ($taskId <= 0) {
        throw new Exception("Invalid Task ID");
    }

    $userId = $_SESSION['user_id'];

    // Modified query to join with employees table
    $stmt = $conn->prepare("
        SELECT t.*, e.name as assigned_to_name 
        FROM tasks t 
        LEFT JOIN employees e ON t.assigned_to = e.emp_id 
        WHERE t.id = ? AND t.user_id = ?
    ");
    $stmt->bind_param("ii", $taskId, $userId);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to fetch task");
    }

    $result = $stmt->get_result();
    $task = $result->fetch_assoc();

    if (!$task) {
        throw new Exception("Task not found");
    }

    // Replace the numeric assigned_to with the employee name
    $task['assigned_to'] = $task['assigned_to_name'];
    unset($task['assigned_to_name']); // Remove the temporary name field

    echo json_encode([
        "success" => true,
        "task" => $task,
        "message" => "Task found successfully"
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
