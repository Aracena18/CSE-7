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

require_once "db_config_employee.php";

$user_id = $_SESSION['user_id'];

try {
    $sql = "SELECT emp_id, name, position, contact, daily_rate, status, created_at 
            FROM employees 
            WHERE user_id = ?
            ORDER BY created_at DESC";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $employees = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Format created_at date
            $row['created_at'] = date('Y-m-d H:i:s', strtotime($row['created_at']));
            $employees[] = $row;
        }
    }

    echo json_encode([
        "success" => true,
        "data" => $employees,
        "count" => count($employees)
    ]);

} catch (Exception $e) {
    error_log("Error in get_employees.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch employees",
        "error" => $e->getMessage()
    ]);

} finally {
    if (isset($result)) {
        $result->close();
    }
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
