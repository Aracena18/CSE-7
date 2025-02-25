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
    // Prepare SQL query to get all tasks
    $sql = "SELECT id, description, assigned_to, location, start_date, end_date, 
            priority, status, completed, created_at, updated_at 
            FROM tasks WHERE user_id = ?
            ORDER BY created_at DESC";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $tasks = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Format dates for consistency
            $row['start_date'] = date('Y-m-d', strtotime($row['start_date']));
            $row['end_date'] = date('Y-m-d', strtotime($row['end_date']));
            $row['created_at'] = date('Y-m-d H:i:s', strtotime($row['created_at']));
            $row['updated_at'] = date('Y-m-d H:i:s', strtotime($row['updated_at']));
            
            // Convert completed to boolean for JavaScript
            $row['completed'] = (bool)$row['completed'];
            
            $tasks[] = $row;
        }
    }

    // Return success response with tasks
    echo json_encode([
        "success" => true,
        "data" => $tasks,
        "count" => count($tasks)
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
