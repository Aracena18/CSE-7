<?php
session_start();
header('Content-Type: application/json');
require_once "db_config_task.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    if (!isset($_GET['id'])) {
        throw new Exception("Task ID is required");
    }

    $taskId = $_GET['id'];
    $userId = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $taskId, $userId);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to fetch task");
    }

    $result = $stmt->get_result();
    $task = $result->fetch_assoc();

    if (!$task) {
        throw new Exception("Task not found");
    }

    echo json_encode([
        "success" => true,
        "task" => $task
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
