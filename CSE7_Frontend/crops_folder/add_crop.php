<?php
header("Content-Type: application/json"); // Set response type to JSON

require_once "db_config.php"; // Import database connection settings


// Retrieve form data from POST request
$cropName = $_POST["cropName"];
$cropType = $_POST["cropType"];
$plantingDate = $_POST["plantingDate"];
$location = $_POST["location"];
$expectedHarvestDate = $_POST["expectedHarvestDate"];
$variety = $_POST["variety"];
$quantity = intval($_POST["quantity"]);
$autoTask = isset($_POST["automateTask"]) ? 1 : 0; // Convert checkbox value to 1 or 0

// Insert data into database
$sql = "INSERT INTO crops (crop_name, crop_type, planting_date, location, expected_harvest_date, variety, quantity, auto_task)
        VALUES ('$cropName', '$cropType', '$plantingDate', '$location', '$expectedHarvestDate', '$variety', $quantity, '$autoTask')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Crop added successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
}

$conn->close();
?>
