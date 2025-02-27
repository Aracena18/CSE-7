<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/debug.log');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");

require_once "db_config_employee.php";

try {
    // Log the raw input
    $input = file_get_contents('php://input');
    error_log("Received input: " . $input);

    // Decode JSON
    $data = json_decode($input, true);
    
    if (!$data) {
        throw new Exception("Invalid JSON: " . json_last_error_msg());
    }

    // Validate input
    if (!isset($data['id']) || !isset($data['type']) || !isset($data['value'])) {
        throw new Exception("Missing required parameters");
    }

    // Sanitize inputs
    $employeeId = mysqli_real_escape_string($conn, $data['id']);
    $type = mysqli_real_escape_string($conn, $data['type']);
    $value = mysqli_real_escape_string($conn, $data['value']);

    // Log the sanitized values
    error_log("Updating employee $employeeId status to $value");

    if ($type === 'status') {
        // Validate status value
        $allowedStatuses = ['active', 'onleave', 'inactive'];
        if (!in_array($value, $allowedStatuses)) {
            throw new Exception("Invalid status value");
        }

        // First, verify the employee exists
        $checkSql = "SELECT emp_id FROM employees WHERE emp_id = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("s", $employeeId);
        $checkStmt->execute();
        $result = $checkStmt->get_result();
        
        if ($result->num_rows === 0) {
            throw new Exception("Employee ID $employeeId not found");
        }

        // Prepare and execute query
        $sql = "UPDATE employees SET status = ? WHERE emp_id = ?";
        $stmt = $conn->prepare($sql);
        
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("ss", $value, $employeeId);
        
        // Log the query
        error_log("Executing query: UPDATE employees SET status = '$value' WHERE emp_id = '$employeeId'");
        
        if (!$stmt->execute()) {
            throw new Exception("Execute failed: " . $stmt->error);
        }

        // Verify the update
        $verifySQL = "SELECT status FROM employees WHERE emp_id = ?";
        $verifyStmt = $conn->prepare($verifySQL);
        $verifyStmt->bind_param("s", $employeeId);
        $verifyStmt->execute();
        $verifyResult = $verifyStmt->get_result();
        $updatedEmployee = $verifyResult->fetch_assoc();

        echo json_encode([
            "success" => true,
            "message" => "Employee status updated successfully",
            "debug" => [
                "employeeId" => $employeeId,
                "newStatus" => $value,
                "verifiedStatus" => $updatedEmployee['status'],
                "affectedRows" => $stmt->affected_rows
            ]
        ]);
    } else {
        throw new Exception("Invalid update type");
    }

} catch (Exception $e) {
    error_log("Error in update_employee.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "debug" => [
            "error" => $e->getMessage(),
            "trace" => $e->getTraceAsString()
        ]
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    if (isset($checkStmt)) $checkStmt->close();
    if (isset($verifyStmt)) $verifyStmt->close();
    if (isset($conn)) $conn->close();
}
?>
