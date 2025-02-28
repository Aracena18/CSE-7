<?php
// Prevent any PHP errors or notices from being output
ob_clean(); // Clear any previous output
error_reporting(0);
ini_set('display_errors', 0);

// Set header first, before any output
header('Content-Type: application/json');

try {
    require_once "db_config.php";
    
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $id = isset($data['id']) ? intval($data['id']) : 0;
    
    if ($id <= 0) {
        throw new Exception('Invalid employee ID');
    }

    // Check if employee exists
    $check = $conn->prepare("SELECT COUNT(*) FROM tasks WHERE assigned_to = ?");
    $check->bind_param("i", $id);
    $check->execute();
    $result = $check->get_result();
    $taskCount = $result->fetch_row()[0];
    $check->close();

    if ($taskCount > 0) {
        throw new Exception('Cannot delete employee because they have assigned tasks');
    }

    // If no tasks, proceed with deletion
    $stmt = $conn->prepare("DELETE FROM employees WHERE emp_id = ?");
    $stmt->bind_param("i", $id);
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    if ($stmt->affected_rows === 0) {
        throw new Exception('Employee not found or already deleted');
    }

    $stmt->close();
    $conn->close();

    echo json_encode([
        'success' => true,
        'message' => 'Employee deleted successfully'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
exit;
?>
