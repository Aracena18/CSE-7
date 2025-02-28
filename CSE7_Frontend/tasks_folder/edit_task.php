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
    $task_id = $_POST["taskId"];
    
    // Verify task exists and belongs to user
    $check_task = $conn->prepare("SELECT id FROM tasks WHERE id = ? AND user_id = ?");
    $check_task->bind_param("ii", $task_id, $user_id);
    $check_task->execute();
    if ($check_task->get_result()->num_rows === 0) {
        throw new Exception("Task not found or unauthorized");
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

    // Update task
    $stmt = $conn->prepare("UPDATE tasks SET 
        description = ?,
        assigned_to = ?,
        start_date = ?,
        end_date = ?,
        priority = ?,
        status = ?,
        location = ?,
        crops = ?
        WHERE id = ? AND user_id = ?");

    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sisssssiis", 
        $_POST["taskDescription"],
        $employeeId,
        $_POST["startDate"],
        $_POST["endDate"],
        $_POST["priority"],
        $_POST["status"],
        $_POST["taskLocation"],
        $cropId,
        $task_id,
        $user_id
    );

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Task updated successfully"
        ]);
    } else {
        throw new Exception("Failed to update task: " . $stmt->error);
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($check_task)) $check_task->close();
    if (isset($check_crop)) $check_crop->close();
    if (isset($conn)) $conn->close();
}
?>
