<?php
session_start();
header("Content-Type: application/json");
require_once "db_config_task.php";

// Check if supervisor is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Read raw JSON input
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit();
}

// Validate required fields
if (!isset($data['task_id']) || !isset($data['action']) || !isset($data['taskComments'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required parameters."]);
    exit();
}

$taskId = $data['task_id'];
$action = strtolower(trim($data['action']));
$comments = trim($data['taskComments']);

// Allowed actions for supervisor update
if (!in_array($action, ['approve', 'reject'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid action."]);
    exit();
}

// Map action to new status
$newStatus = ($action === 'approve') ? 'approved' : 'rejected';

// Allowed statuses for tasks (for reference)
$allowedStatuses = ["pending", "in_progress", "for_review", "approved", "rejected"];
if (!in_array($newStatus, $allowedStatuses)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid status update."]);
    exit();
}

// Prepare update query to update status and comments only if the task is still "for_review"
$stmt = $conn->prepare("UPDATE tasks SET status = ?, Comments = ? WHERE id = ? AND status = 'for_review'");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("ssi", $newStatus, $comments, $taskId);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to update task: " . $stmt->error]);
    exit();
}

// Check if any rows were updated (if not, the task might not be in "for_review" status)
if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "message" => "Task updated successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Task not updated. It may have already been reviewed."]);
}

$stmt->close();
$conn->close();
?>
