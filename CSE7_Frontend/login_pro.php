<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection settings
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "farm_management";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data === null) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON"]);
        exit();
    }

    // Extract Google sign-in data
    $email = $data['email'] ?? '';
    $google_id = $data['google_id'] ?? null;
    $name = $data['name'] ?? '';

    if (empty($email) || empty($google_id)) {
        http_response_code(400);
        echo json_encode(["error" => "Email and Google ID are required"]);
        exit();
    }

    // Check if user exists
    $stmt = $conn->prepare("SELECT id, name, email, google_id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        // User exists - verify Google ID
        $stmt->bind_result($user_id, $db_name, $db_email, $db_google_id);
        $stmt->fetch();

        if ($db_google_id === $google_id) {
            // Set session variables
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_name'] = $db_name;
            $_SESSION['user_email'] = $db_email;
            $_SESSION['logged_in'] = true;

            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user_id,
                    "name" => $db_name,
                    "email" => $db_email
                ],
                "redirect_url" => "/CSE-7/CSE7_Frontend/homepage.php"
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Google authentication failed"]);
        }
    } else {
        // New user - register with Google
        $insertStmt = $conn->prepare("INSERT INTO users (name, email, google_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())");
        $insertStmt->bind_param("sss", $name, $email, $google_id);

        if ($insertStmt->execute()) {
            $newUserId = $insertStmt->insert_id;
            
            // Set session variables for new user
            $_SESSION['user_id'] = $newUserId;
            $_SESSION['user_name'] = $name;
            $_SESSION['user_email'] = $email;
            $_SESSION['logged_in'] = true;

            echo json_encode([
                "success" => true,
                "message" => "New user created",
                "user" => [
                    "id" => $newUserId,
                    "name" => $name,
                    "email" => $email
                ],
                "redirect_url" => "/CSE-7/CSE7_Frontend/homepage.php"
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
