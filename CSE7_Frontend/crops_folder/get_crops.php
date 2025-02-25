<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

header("Content-Type: application/json");

require_once "db_config.php";

$user_id = $_SESSION['user_id'];
$sql = "SELECT id, crop_name, location, crop_type, planting_date, expected_harvest_date, variety, quantity FROM crops WHERE user_id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$crops = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $crops[] = $row;
    }
}

echo json_encode($crops);

$stmt->close();
$conn->close();
?>
