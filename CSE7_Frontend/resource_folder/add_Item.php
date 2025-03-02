<?php
header('Content-Type: application/json');
require_once '../db_connection.php'; // Adjust the path as necessary

// Retrieve POST data from the form submission
$itemName     = $_POST['itemName'] ?? '';
$category     = $_POST['category'] ?? '';
$currentStock = $_POST['currentStock'] ?? '';  // This is the quantity being added
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

// List of non-borrowable categories (add more as needed)
// Use lowercase comparison for consistency
$nonBorrowableCategories = ["fertilizers", "pesticides", "seeds", "animal feed"];

// Determine borrowability (0 = Not Borrowable, 1 = Borrowable)
$borrowable = in_array(strtolower($category), $nonBorrowableCategories) ? 0 : 1;

try {
    // Check if the item already exists with the same supplier and category
    $checkQuery = "SELECT * FROM Inventory_Items 
                   WHERE Item_Name = ? AND Supplier_ID = ? AND Category = ?";
    $stmtCheck = $pdo->prepare($checkQuery);
    $stmtCheck->execute([$itemName, $supplierID, $category]);
    $existingItem = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    // Set status based on stock
    if ($existingItem) {
        // Update existing item: add the new quantity to the current stock
        $newStock = $existingItem['Current_Stock'] + $currentStock;
        $status = ($newStock == 0) ? 'Out of Stock' : 'Available';

        $updateQuery = "UPDATE Inventory_Items SET Current_Stock = ?, Status = ? 
                        WHERE Item_ID = ?";
        $stmtUpdate = $pdo->prepare($updateQuery);
        $stmtUpdate->execute([$newStock, $status, $existingItem['Item_ID']]);

        // Record transaction as Stock In (only the added quantity is recorded)
        $transactionType = 'Stock In';
        $transactionDate = date('Y-m-d H:i:s');
        $performedBy = "Admin";  // Change as needed (or retrieve from session)
        $comments = "Updated existing item quantity";

        $insertTransQuery = "INSERT INTO inventory_transactions 
                              (Item_ID, Transaction_Type, Quantity, Transaction_Date, Performed_By, Comments)
                              VALUES (?, ?, ?, ?, ?, ?)";
        $stmtInsertTrans = $pdo->prepare($insertTransQuery);
        $stmtInsertTrans->execute([$existingItem['Item_ID'], $transactionType, $currentStock, $transactionDate, $performedBy, $comments]);

        echo json_encode([
            "status"  => "success",
            "message" => "Item quantity updated successfully."
        ]);
    } else {
        // Item doesn't exist: add as a new item
        $status = ($currentStock == 0) ? 'Out of Stock' : 'Available';
        $insertQuery = "INSERT INTO Inventory_Items 
                        (Item_Name, Category, Current_Stock, Threshold, Status, Supplier_ID, Borrowable) 
                        VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmtInsert = $pdo->prepare($insertQuery);
        $stmtInsert->execute([$itemName, $category, $currentStock, $threshold, $status, $supplierID, $borrowable]);
        
        // Get the new item ID
        $newItemID = $pdo->lastInsertId();
        
        // Record transaction as Stock In for the new item
        $transactionType = 'Stock In';
        $transactionDate = date('Y-m-d H:i:s');
        $performedBy = "Admin";  // Change as needed
        $comments = "New item added";

        $insertTransQuery = "INSERT INTO inventory_transactions 
                              (Item_ID, Transaction_Type, Quantity, Transaction_Date, Performed_By, Comments)
                              VALUES (?, ?, ?, ?, ?, ?)";
        $stmtInsertTrans = $pdo->prepare($insertTransQuery);
        $stmtInsertTrans->execute([$newItemID, $transactionType, $currentStock, $transactionDate, $performedBy, $comments]);

        echo json_encode([
            "status"  => "success",
            "message" => "Item added successfully."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "status"  => "error",
        "message" => "Failed to add/update item: " . $e->getMessage()
    ]);
}
?>
