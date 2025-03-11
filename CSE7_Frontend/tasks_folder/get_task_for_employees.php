<?php
session_start();
header("Content-Type: application/json");
require_once "db_config_task.php";

// Check if employee is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['emp_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

try {
    $userId = $_SESSION['user_id'];
    $employeeId = $_SESSION['emp_id']; // Employee's ID stored in session

    // Prepare query joining tasks, users, and crops to retrieve task details,
    // the crop name, and the user name.
    $stmt = $conn->prepare("
        SELECT 
            tasks.id, 
            tasks.description, 
            tasks.start_date, 
            tasks.end_date, 
            tasks.priority, 
            tasks.status, 
            tasks.location, 
            tasks.completed, 
            crops.crop_name AS crops, 
            users.name AS assignedBy
        FROM tasks
        JOIN users ON tasks.user_id = users.id
        JOIN crops ON tasks.crops = crops.id
        WHERE tasks.assigned_to = ? AND tasks.user_id = ?
        ORDER BY tasks.start_date ASC
    ");
    $stmt->bind_param("ii", $employeeId, $userId);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to fetch tasks");
    }

    $result = $stmt->get_result();
    $tasks = $result->fetch_all(MYSQLI_ASSOC);

    // Map 'end_date' to 'dueDate' for consistency with the frontend
    $mappedTasks = array_map(function($task) {
        $task['dueDate'] = $task['end_date'];
        return $task;
    }, $tasks);

    echo json_encode([
        "success" => true,
        "tasks" => $mappedTasks,
        "message" => count($mappedTasks) > 0 ? "Tasks retrieved successfully" : "No tasks assigned"
    ]);

} catch (Exception $e) {
    error_log("Error fetching employee tasks: " . $e->getMessage());
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
