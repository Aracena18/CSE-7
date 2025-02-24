<?php
header("Content-Type: application/json"); // Set response type to JSON

require_once "db_config.php"; // Import database connection settings

$sql = "SELECT id, crop_name, location, crop_type, planting_date, expected_harvest_date, variety, quantity FROM crops";
$result = $conn->query($sql);

$crops = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $crops[] = $row;
    }
}

// Return data as JSON
echo json_encode($crops);

$conn->close();
?>
