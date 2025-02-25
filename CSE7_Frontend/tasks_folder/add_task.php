<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized - No user session found']);
    exit();
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once "db_config_task.php";

try {
    $user_id = $_SESSION["user_id"];
    
    // First verify the user exists
    $check_user = $conn->prepare("SELECT id FROM users WHERE id = ?");
    $check_user->bind_param("i", $user_id);
    $check_user->execute();
    $result = $check_user->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Invalid user ID - User does not exist in database");
    }
    
    // Retrieve form data from POST request
    $description = $_POST["taskDescription"];
    $assignedTo = $_POST["assignedTo"];
    $startDate = $_POST["startDate"];
    $endDate = $_POST["endDate"];
    $priority = $_POST["priority"];
    $status = $_POST["status"];
    $location = $_POST["taskLocation"];
    $completed = 0; // Default value for checkbox

    // Prepare SQL statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO tasks (description, assigned_to, start_date, end_date, priority, status, location, completed, user_id)  
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param("sssssssii", 
        $description,
        $assignedTo,
        $startDate,
        $endDate,
        $priority,
        $status,
        $location,
        $completed,
        $user_id
    );

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Task added successfully",
            "taskId" => $conn->insert_id
        ]);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

} catch (Exception $e) {
    // Log error for debugging
    error_log("Error in add_task.php: " . $e->getMessage());
    
    $error_message = $e->getMessage();
    if (strpos($error_message, "foreign key constraint fails") !== false) {
        $error_message = "Invalid user ID - Please log in again";
    }
    
    // Return error response
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $error_message
    ]);
} finally {
    // Clean up
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>