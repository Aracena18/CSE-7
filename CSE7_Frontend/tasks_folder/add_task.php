<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

require_once "db_config_task.php";

try {
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
    $stmt = $conn->prepare("INSERT INTO tasks (description, assigned_to, start_date, end_date, priority, status, location, completed, created_at) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Bind parameters
    $stmt->bind_param("sssssssi", 
        $description,
        $assignedTo,
        $startDate,
        $endDate,
        $priority,
        $status,
        $location,
        $completed
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
    
    // Return error response
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
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