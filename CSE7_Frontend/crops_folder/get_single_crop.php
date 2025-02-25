<?php
session_start();
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db_config.php';

try {
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Unauthorized');
    }

    if (!isset($_GET['id'])) {
        throw new Exception('No ID provided');
    }

    $id = intval($_GET['id']);
    $userId = $_SESSION['user_id'];

    // Using mysqli prepared statement
    $stmt = $conn->prepare("SELECT * FROM crops WHERE id = ? AND user_id = ?");
    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("ii", $id, $userId);
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $result = $stmt->get_result();
    $crop = $result->fetch_assoc();

    if (!$crop) {
        throw new Exception('Crop not found');
    }

    echo json_encode([
        'success' => true,
        'data' => $crop
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>