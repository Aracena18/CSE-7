<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

require_once "db_config_task.php";

$user_id= $_SESSION['user_id'];
try {
    // Use the view we created for better performance
    $query = "SELECT 
        t.*,
        e.name as employee_name,
        e.position as employee_position
    FROM tasks t
    LEFT JOIN employees e ON t.assigned_to = e.emp_id
    WHERE t.user_id = ?";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        // Format the output to maintain compatibility
        $task = [
            'id' => $row['id'],
            'description' => $row['description'],
            'assigned_to' => $row['employee_name'], // Use employee name for display
            'start_date' => $row['start_date'],
            'end_date' => $row['end_date'],
            'priority' => $row['priority'],
            'status' => $row['status'],
            'location' => $row['location'],
            'completed' => (bool)$row['completed'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
        $tasks[] = $task;
    }

    echo json_encode([
        "success" => true,
        "data" => $tasks
    ]);

} catch (Exception $e) {
    // Log error for debugging
    error_log("Error in get_tasks.php: " . $e->getMessage());
    
    // Return error response
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch tasks",
        "error" => $e->getMessage()
    ]);

} finally {
    // Clean up
    if (isset($result)) {
        $result->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
