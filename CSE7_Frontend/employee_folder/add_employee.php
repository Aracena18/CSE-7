<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once "db_config_employee.php";

function generateEmployeeEmail($firstName, $lastName, $employeeId) {
    // Take first letter of first name + . + last name + id number
    $cleanFirstName = preg_replace('/[^a-zA-Z0-9]/', '', $firstName);
    $cleanLastName = preg_replace('/[^a-zA-Z0-9]/', '', $lastName);
    return strtolower(substr($cleanFirstName, 0, 1) . '.' . $cleanLastName . $employeeId . '@arcriculture.com');
}

function generateEmployeePassword($firstName, $employeeId) {
    // Use full first name followed by id number
    $cleanFirstName = preg_replace('/[^a-zA-Z0-9]/', '', $firstName);
    return strtolower($cleanFirstName . $employeeId);
}

try {
    // Check session
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('User not authenticated');
    }
    $user_id = $_SESSION['user_id'];

    // Debug incoming data
    error_log("POST data received: " . print_r($_POST, true));
    error_log("Session user_id: " . $user_id);

    // Validate required fields
    $required_fields = ['firstName', 'lastName', 'position', 'dailyRate', 'daysWorked', 'contact', 'employeeStatus'];
    $missing_fields = [];
    
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || trim($_POST[$field]) === '') {
            $missing_fields[] = $field;
        }
    }
    
    if (!empty($missing_fields)) {
        throw new Exception("Missing required fields: " . implode(", ", $missing_fields));
    }

    // Construct full name
    $firstName = trim($_POST["firstName"]);
    $lastName = trim($_POST["lastName"]);
    $name = $firstName . " " . $lastName;
    
    // Sanitize inputs
    $position = filter_var(trim($_POST["position"]), FILTER_SANITIZE_STRING);
    $dailyRate = filter_var($_POST["dailyRate"], FILTER_VALIDATE_FLOAT);
    $daysWorked = filter_var($_POST["daysWorked"], FILTER_VALIDATE_INT);
    $contact = filter_var(trim($_POST["contact"]), FILTER_SANITIZE_STRING);
    $status = filter_var(trim($_POST["employeeStatus"]), FILTER_SANITIZE_STRING);
    
    // Additional validation
    if (!$dailyRate || $dailyRate <= 0) {
        throw new Exception("Invalid daily rate");
    }

    if (!$daysWorked || $daysWorked < 0) {
        throw new Exception("Invalid days worked");
    }

    // First insert without email and password to get the ID
    $stmt = $conn->prepare("INSERT INTO employees (name, position, daily_rate, days_worked, contact, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }

    $stmt->bind_param("ssdissi", $name, $position, $dailyRate, $daysWorked, $contact, $status, $user_id);

    if (!$stmt->execute()) {
        throw new Exception("Database execute failed: " . $stmt->error);
    }

    $employee_id = $stmt->insert_id;

    // Generate email and password
    $email = generateEmployeeEmail($firstName, $lastName, $employee_id);
    $password = generateEmployeePassword($firstName, $employee_id);
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Update the employee record with email and password
    $stmt = $conn->prepare("UPDATE employees SET email = ?, password = ? WHERE emp_id = ?");
    $stmt->bind_param("ssi", $email, $hashed_password, $employee_id);
    
    if (!$stmt->execute()) {
        throw new Exception("Failed to update employee credentials");
    }

    echo json_encode([
        "success" => true,
        "message" => "Employee added successfully",
        "employeeId" => $employee_id,
        "email" => $email,
        "password" => $password, // Only sending for initial setup
        "debug" => [
            "session_user_id" => $user_id,
            "name" => $name
        ]
    ]);

} catch (Exception $e) {
    error_log("Error in add_employee.php: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "debug" => [
            "post_data" => $_POST,
            "session" => $_SESSION
        ]
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
