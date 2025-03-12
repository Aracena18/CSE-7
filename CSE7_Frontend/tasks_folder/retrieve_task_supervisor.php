<?php
session_start();
header("Content-Type: application/json");
require_once "db_config_task.php";

// Check if supervisor is logged in
// (Adjust the session check as needed for your authentication system)
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

try {
    // Supervisor's user ID (if needed for further filtering)
    $userId = $_SESSION['user_id'];

    // Prepare query to fetch tasks that are for review.
    // This query joins tasks, users, and crops to retrieve additional details.
    $stmt = $conn->prepare("
        SELECT 
            tasks.id, 
            tasks.description, 
            crops.crop_name AS title,  -- Use crop name as the task title
            tasks.start_date, 
            tasks.end_date, 
            tasks.priority, 
            tasks.status, 
            tasks.location, 
            tasks.completed,
            tasks.img_review,
            crops.crop_name AS crops, 
            users.name AS assignedBy
        FROM tasks
        JOIN users ON tasks.user_id = users.id
        JOIN crops ON tasks.crops = crops.id
        WHERE tasks.status = 'for_review'
        ORDER BY tasks.start_date ASC
    ");

    if (!$stmt->execute()) {
        throw new Exception("Failed to fetch tasks");
    }

    $result = $stmt->get_result();
    $tasks = $result->fetch_all(MYSQLI_ASSOC);

    // Optionally, map 'end_date' to 'dueDate' for consistency with the frontend
    $mappedTasks = array_map(function($task) {
        $task['dueDate'] = $task['end_date'];
        return $task;
    }, $tasks);

    echo json_encode([
        "success" => true,
        "tasks" => $mappedTasks,
        "message" => count($mappedTasks) > 0 ? "Tasks retrieved successfully" : "No tasks for review"
    ]);

} catch (Exception $e) {
    error_log("Error fetching supervisor tasks: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "An error occurred while fetching tasks."
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
