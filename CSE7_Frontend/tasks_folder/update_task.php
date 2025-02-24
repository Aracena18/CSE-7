<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db_config_task.php";

try {
    // Get JSON data from request body
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['id']) || !isset($data['type']) || !isset($data['value'])) {
        throw new Exception("Missing required parameters");
    }

    $taskId = $data['id'];
    $type = $data['type'];
    $value = $data['value'];

    // Determine which field to update based on type
    switch ($type) {
        case 'priority':
            $sql = "UPDATE tasks SET priority = ? WHERE id = ?";
            $types = "si"; // string and integer
            break;
    
        case 'status':
            if ($value === 'completed') {
                $sql = "UPDATE tasks SET status = ?, completed = 1 WHERE id = ?";
            } else {
                $sql = "UPDATE tasks SET status = ?, completed = 0 WHERE id = ?";
            }
            $types = "si";
            break;
    
        case 'completed':
            $value = $value ? 1 : 0; // Convert boolean to integer
            if ($value === 1) {
                $sql = "UPDATE tasks SET completed = ?, status = 'completed' WHERE id = ?";
            } else {
                $sql = "UPDATE tasks SET completed = ?, status = 'todo'  WHERE id = ?";
            }
            $types = "is"; // both integer
            break;
    
        default:
            throw new Exception("Invalid update type");
    }
    

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    $stmt->bind_param($types, $value, $taskId);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    echo json_encode([
        "success" => true,
        "message" => "Task updated successfully"
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
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