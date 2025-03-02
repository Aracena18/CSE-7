<?php
header('Content-Type: application/json');
require_once '../db_connection.php'; // Adjust the path as necessary

// Retrieve POST data from the form submission
$itemName     = $_POST['itemName'] ?? '';
$category     = $_POST['category'] ?? '';
$currentStock = $_POST['currentStock'] ?? '';
$threshold    = $_POST['threshold'] ?? '';
$supplierID   = $_POST['supplier'] ?? ''; // Receiving Supplier_ID

// Validate required fields
if (empty($itemName) || empty($category) || empty($currentStock) || empty($threshold) || empty($supplierID)) {
    echo json_encode([
        "status"  => "error",
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    // Check if the item already exists in the database based solely on the item name
    $checkQuery = "SELECT COUNT(*) FROM Inventory_Items WHERE Item_Name = ?";
    $stmtCheck = $pdo->prepare($checkQuery);
    $stmtCheck->execute([$itemName]);
    $itemCount = $stmtCheck->fetchColumn();

    if ($itemCount > 0) {
        echo json_encode([
            "status"  => "error",
            "message" => "Item already exists."
        ]);
        exit;
    }

    // Set default status for the new item
    $status = 'Available';

    // Insert the new inventory item into Inventory_Items table
    $insertQuery = "INSERT INTO Inventory_Items (Item_Name, Category, Current_Stock, Threshold, Status, Supplier_ID) 
                    VALUES (?, ?, ?, ?, ?, ?)";
    $stmtInsert = $pdo->prepare($insertQuery);
    $stmtInsert->execute([$itemName, $category, $currentStock, $threshold, $status, $supplierID]);

    echo json_encode([
        "status"  => "success",
        "message" => "Item added successfully."
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status"  => "error",
        "message" => "Failed to add item: " . $e->getMessage()
    ]);
}
?>
