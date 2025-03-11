<?php
session_start();
header("Content-Type: application/json");
require_once "db_config_task.php";

// Check if employee is logged in
if (!isset($_SESSION['user_id']) || !isset($_SESSION['emp_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$userId = $_SESSION['user_id'];
$employeeId = $_SESSION['emp_id'];

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit();
}

// Validate required POST fields
if (!isset($_POST['task_id']) || !isset($_POST['taskNotes'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required parameters."]);
    exit();
}

$taskId = $_POST['task_id'];
$taskNotes = trim($_POST['taskNotes']);

// Define the physical upload directory (server path)
$uploadDir = "../uploads/task_proofs/";
// Define the relative path (to be stored in the DB)
$relativeDir = "/CSE-7/CSE7_Frontend/uploads/task_proofs/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

$uploadedFiles = [];

// Check if images were uploaded and process them
if (isset($_FILES['taskImages']) && !empty($_FILES['taskImages']['name'][0])) {
    $files = $_FILES['taskImages'];
    for ($i = 0; $i < count($files['name']); $i++) {
        // Generate a unique filename to avoid collisions
        $filename = time() . "_" . basename($files['name'][$i]);
        $targetFile = $uploadDir . $filename;
        
        if (move_uploaded_file($files['tmp_name'][$i], $targetFile)) {
            // Build the relative file path to store in the database
            $relativePath = $relativeDir . $filename;
            $uploadedFiles[] = $relativePath;
        }
    }
}

if (empty($uploadedFiles)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "No images were uploaded."]);
    exit();
}

// Convert the array of relative file paths to JSON (to store in the img_review column)
$imgReview = json_encode($uploadedFiles);

// Set the new task status
$newStatus = "for_review";

try {
    // Update the task with new status, proof image path(s), and comments.
    // Ensure the task belongs to the logged-in employee (using assigned_to).
    $stmt = $conn->prepare("UPDATE tasks SET status = ?, img_review = ?, Comments = ? WHERE id = ? AND assigned_to = ?");
    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }
    $stmt->bind_param("sssii", $newStatus, $imgReview, $taskNotes, $taskId, $employeeId);
    
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Task proof submitted successfully."
    ]);
} catch (Exception $e) {
    error_log("Error updating task proof: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Error updating task."
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
