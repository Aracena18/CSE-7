<?php
session_start();

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Only allow POST requests.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method Not Allowed"]);
    exit();
}

// Get input either from form data or from JSON.
if (!empty($_POST)) {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
} else {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
}

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Email and password are required"]);
    exit();
}

// Database connection settings
$servername = "localhost";
$username = "root";
$password_db = "";
$dbname = "farm_management";

$conn = new mysqli($servername, $username, $password_db, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// 1. Check if there is an employee record with the provided email.
$empStmt = $conn->prepare("SELECT emp_id, name, email, password, position, user_id FROM employees WHERE email = ?");
$empStmt->bind_param("s", $email);
$empStmt->execute();
$empStmt->store_result();

if ($empStmt->num_rows > 0) {
    $empStmt->bind_result($emp_id, $emp_name, $emp_email, $emp_hashed_password, $position, $emp_user_id);
    $empStmt->fetch();
    if (password_verify($password, $emp_hashed_password)) {
        // Employee login successful:
        // Update the session: set the session user_id to the employee's associated user_id.
        $_SESSION['user_id'] = $emp_user_id;
        $_SESSION['emp_id']  = $emp_id;
        $_SESSION['user_name'] = $emp_name;
        $_SESSION['user_email'] = $emp_email;
        $_SESSION['logged_in'] = true;
        
         // Determine redirect URL based on employee position
         $positionLower = strtolower(trim($position));
         if ($positionLower === "farm supervisor") {
             $redirectUrl = "/CSE-7/CSE7_Frontend/dashboard.php";

         } else {
             $redirectUrl = "/CSE-7/CSE7_Frontend/employee_dashboard.php";

         }

        echo json_encode([
            "success" => true,
            "user" => [
                "id"    => $_SESSION['user_id'],
                "name"  => $emp_name,
                "email" => $emp_email
            ],
            "employee" => [
                "emp_id"   => $emp_id,
                "position" => $position,
                "user_id"  => $emp_user_id
            ],
            "redirect_url" => $redirectUrl
        ]);
        $empStmt->close();
        $conn->close();
        exit();
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials for employee"]);
        $empStmt->close();
        $conn->close();
        exit();
    }
}
$empStmt->close();

// 2. If no matching employee record was found, check the users table.
$userStmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
$userStmt->bind_param("s", $email);
$userStmt->execute();
$userStmt->store_result();

if ($userStmt->num_rows > 0) {
    $userStmt->bind_result($user_id, $user_name, $user_email, $user_hashed_password);
    $userStmt->fetch();
    if (password_verify($password, $user_hashed_password)) {
        // User login successful:
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $user_name;
        $_SESSION['user_email'] = $user_email;
        $_SESSION['logged_in'] = true;
        
        echo json_encode([
            "success" => true,
            "user" => [
                "id"    => $user_id,
                "name"  => $user_name,
                "email" => $user_email
            ],
            "redirect_url" => "/CSE-7/CSE7_Frontend/homepage.php"
        ]);
        $userStmt->close();
        $conn->close();
        exit();
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials for user"]);
        $userStmt->close();
        $conn->close();
        exit();
    }
}
$userStmt->close();

// If neither table returns a valid record:
http_response_code(401);
echo json_encode(["error" => "No matching credentials found"]);
$conn->close();
exit();
?>
