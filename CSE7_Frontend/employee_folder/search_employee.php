<?php
session_start();
header('Content-Type: application/json');

require_once "db_config_employee.php";

try {
    // Check if user is logged in
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Unauthorized access');
    }

    // Get the search query
    $query = isset($_GET['query']) ? trim($_GET['query']) : '';
    
    if (empty($query)) {
        throw new Exception('Search query is required');
    }

    // Prepare the search query with multiple conditions
    $sql = "SELECT emp_id, name, position, status 
            FROM employees 
            WHERE (name LIKE ? OR position LIKE ? OR email LIKE ?) 
            AND user_id = ? 
            LIMIT 10";
            
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // Add wildcards for LIKE query
    $searchTerm = "%{$query}%";
    $userId = $_SESSION['user_id'];
    
    $stmt->bind_param("sssi", $searchTerm, $searchTerm, $searchTerm, $userId);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $result = $stmt->get_result();
    $employees = [];

    while ($row = $result->fetch_assoc()) {
        $employees[] = [
            'emp_id' => $row['emp_id'],
            'name' => htmlspecialchars($row['name']),
            'position' => htmlspecialchars($row['position']),
            'status' => htmlspecialchars($row['status'])
        ];
    }

    echo json_encode([
        'success' => true,
        'employees' => $employees
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
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
