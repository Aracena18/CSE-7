<?php
session_start();
header('Content-Type: application/json');

require_once "db_config_employee.php";

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('User not authenticated');
    }

    $searchTerm = $_GET['term'] ?? '';
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT emp_id, name FROM employees WHERE user_id = ? AND name LIKE ? AND status = 'active'");
    $searchPattern = "%$searchTerm%";
    $stmt->bind_param("is", $user_id, $searchPattern);
    $stmt->execute();
    $result = $stmt->get_result();

    $employees = [];
    while ($row = $result->fetch_assoc()) {
        $employees[] = $row;
    }

    echo json_encode($employees);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
