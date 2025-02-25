<?php
session_start();
header('Content-Type: application/json');
require_once 'db_config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

try {
    // Validate that we have a crop ID
    if (!isset($_POST['cropId']) || empty($_POST['cropId'])) {
        throw new Exception('No crop ID provided for update');
    }

    $cropId = $_POST['cropId'];
    $userId = $_SESSION['user_id'];

    // First verify the crop exists and belongs to the user
    $checkStmt = $conn->prepare("SELECT id FROM crops WHERE id = ? AND user_id = ?");
    $checkStmt->bind_param("ii", $cropId, $userId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Crop not found or unauthorized to edit');
    }
    $checkStmt->close();

    // Proceed with update
    $cropName = $_POST['cropName'];
    $location = $_POST['location'];
    $cropType = $_POST['cropType'];
    $plantingDate = $_POST['plantingDate'];
    $expectedHarvestDate = $_POST['expectedHarvestDate'];
    $variety = $_POST['variety'];
    $quantity = $_POST['quantity'];

    $sql = "UPDATE crops SET 
            crop_name = ?, 
            location = ?, 
            crop_type = ?, 
            planting_date = ?, 
            expected_harvest_date = ?, 
            variety = ?, 
            quantity = ? 
            WHERE id = ? AND user_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssii", 
        $cropName, 
        $location, 
        $cropType, 
        $plantingDate, 
        $expectedHarvestDate, 
        $variety, 
        $quantity, 
        $cropId,
        $userId
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Crop updated successfully']);
    } else {
        throw new Exception('Error updating crop: ' . $stmt->error);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
