<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection settings
$servername = "localhost";
$username = "root";  // Change if needed
$password = "";      // Change if needed
$dbname = "farm_management";  // Replace with your actual database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Process POST request
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data === null) {
        http_response_code(400);
        echo json_encode([
            "error" => "Invalid JSON",
            "received" => $json // Debugging output
        ]);
        exit();
    }

    // Extract incoming data
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? null; // For manual login; can be null for Google login
    $google_id = $data['google_id'] ?? null;
    $name = $data['name'] ?? '';

    if (empty($email)) {
        http_response_code(400);
        echo json_encode(["error" => "Email is required"]);
        exit();
    }

    // Check if the user exists by email
    $stmt = $conn->prepare("SELECT id, name, email, password, google_id, remember_token FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // User exists—fetch details
        $stmt->bind_result($user_id, $db_name, $db_email, $hashedPassword, $db_google_id, $remember_token);
        $stmt->fetch();

        if ($google_id) {
            // Google Login: No password verification, just check that the provided google_id matches
            if ($db_google_id === $google_id) {
                http_response_code(200);
                echo json_encode([
                    "login" => "success",
                    "user_id" => $user_id,
                    "name" => $db_name,
                    "email" => $db_email,
                    "google_id" => $db_google_id,
                    "remember_token" => $remember_token,
                    "redirect_url" => "/CSE-7/CSE7_Frontend/homepage.html"
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Google authentication failed"]);
            }
        } else {
            // Manual Login: Verify the password
            if ($password && password_verify($password, $hashedPassword)) {
                http_response_code(200);
                echo json_encode([
                    "login" => "success",
                    "user_id" => $user_id,
                    "name" => $db_name,
                    "email" => $db_email,
                    "remember_token" => $remember_token,
                    "redirect_url" => "/CSE-7/CSE7_Frontend/homepage.html"
                ]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Invalid credentials"]);
            }
        }
    } else {
        // User does not exist—register them
        if ($google_id) {
            // Google Registration: No password needed
            $insertStmt = $conn->prepare("INSERT INTO users (name, email, google_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
            $insertStmt->bind_param("sss", $name, $email, $google_id);
        } else {
            // Manual Registration: Password is required
            if (!$password) {
                http_response_code(400);
                echo json_encode(["error" => "Password is required for manual registration"]);
                exit();
            }
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            // Default the name to the part of the email before the "@" if not provided
            $name = empty($name) ? explode('@', $email)[0] : $name;
            $insertStmt = $conn->prepare("INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
            $insertStmt->bind_param("sss", $name, $email, $hashedPassword);
        }

        if ($insertStmt->execute()) {
            $newUserId = $insertStmt->insert_id;
            http_response_code(201);
            echo json_encode([
                "login" => "success",
                "user_id" => $newUserId,
                "name" => $name,
                "email" => $email,
                "google_id" => $google_id,
                "message" => "New user created"
            ]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Failed to create user"]);
        }
        $insertStmt->close();
    }

    $stmt->close();
    $conn->close();
    exit();
}

http_response_code(405);
echo json_encode(["error" => "Method Not Allowed"]);
exit();
?>
