<?php
session_start();
header("Content-Type: application/json");
require_once "db_config_task.php";

// Check if employee is logged in
if (!isset($_SESSION['user_id_normal']) || !isset($_SESSION['emp_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

// Get the JSON input from the request body
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Validate input data
if (!isset($data['task_id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid request data."]);
    exit();
}

$taskId = $data['task_id'];
$newStatus = $data['status'];

// Optionally, you can validate $newStatus against allowed statuses
$allowedStatuses = ["pending", "in_progress", "for_review", "approved", "rejected"];
if (!in_array($newStatus, $allowedStatuses)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid status value."]);
    exit();
}

try {
    // Prepare statement to update the task status
    $stmt = $conn->prepare("UPDATE tasks SET status = ? WHERE id = ?");
    if (!$stmt) {
        throw new Exception("Failed to prepare statement");
    }
    $stmt->bind_param("si", $newStatus, $taskId);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to update task status");
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Task status updated successfully."
    ]);
} catch (Exception $e) {
    error_log("Error updating task status: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error updating task status."
    ]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
