<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
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
        throw new Exception("Invalid user ID");
    }
    
    // Get employee ID from name
    $employeeName = $_POST["assignedTo"];
    $stmt = $conn->prepare("SELECT emp_id FROM employees WHERE name = ? AND user_id = ?");
    $stmt->bind_param("si", $employeeName, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception("Employee not found");
    }
    
    $employee = $result->fetch_assoc();
    $employeeId = $employee['emp_id'];
    
    // Verify crop exists and belongs to user
    $cropId = $_POST["cropSelect"];
    if (!empty($cropId)) {
        $check_crop = $conn->prepare("SELECT id FROM crops WHERE id = ? AND user_id = ?");
        $check_crop->bind_param("ii", $cropId, $user_id);
        $check_crop->execute();
        if ($check_crop->get_result()->num_rows === 0) {
            throw new Exception("Invalid crop selection");
        }
    }
    
    // Retrieve other form data
    $description = $_POST["taskDescription"];
    $startDate = $_POST["startDate"];
    $endDate = $_POST["endDate"];
    $priority = $_POST["priority"];
    $status = $_POST["status"];
    $location = $_POST["taskLocation"];
    $completed = 0;

    // Updated SQL to include crops column
    $stmt = $conn->prepare("INSERT INTO tasks (description, assigned_to, start_date, end_date, priority, status, 
                           location, completed, user_id, crops) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Bind parameters including crop_id
    $stmt->bind_param("sisssssiii", 
        $description,
        $employeeId,
        $startDate,
        $endDate,
        $priority,
        $status,
        $location,
        $completed,
        $user_id,
        $cropId
    );

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
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($check_user)) $check_user->close();
    if (isset($check_crop)) $check_crop->close();
    if (isset($conn)) $conn->close();
}
?>