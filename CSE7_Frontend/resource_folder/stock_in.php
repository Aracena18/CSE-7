<?php
header('Content-Type: application/json');
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        "status"  => "error", 
        "message" => "Unauthorized"
    ]);
    exit();
}

require_once '../db_connection.php'; // Adjust the path as necessary

// Read JSON data from the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode([
        "status"  => "error", 
        "message" => "Invalid input."
    ]);
    exit;
}

// Retrieve and validate required fields
$itemID   = $data['itemID']   ?? null;
$quantity = $data['quantity'] ?? null;

if (!$itemID || !$quantity || $quantity <= 0) {
    echo json_encode([
        "status"  => "error", 
        "message" => "Invalid item ID or quantity."
    ]);
    exit;
}

try {
    // Begin transaction for atomicity
    $pdo->beginTransaction();

    // Fetch the current stock and borrowable flag from Inventory_Items
    $stmt = $pdo->prepare("SELECT Current_Stock, Borrowable FROM Inventory_Items WHERE Item_ID = ?");
    $stmt->execute([$itemID]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        $pdo->rollBack();
        echo json_encode([
            "status"  => "error", 
            "message" => "Item not found."
        ]);
        exit;
    }

    // Update the inventory: add the new quantity to the current stock
    $newStock = $item['Current_Stock'] + $quantity;

    // Determine the new status based on the borrowable flag
    if ($item['Borrowable'] == 1) {
        $newStatus = ($newStock > 0) ? 'Available' : 'Borrowed';
    } else {
        $newStatus = ($newStock > 0) ? 'In Stock' : 'Out of Stock';
    }

    $stmtUpdate = $pdo->prepare("UPDATE Inventory_Items SET Current_Stock = ?, Status = ? WHERE Item_ID = ?");
    $stmtUpdate->execute([$newStock, $newStatus, $itemID]);

    // Record the transaction as Stock In in inventory_transactions table
    $transactionType = 'Stock In';
    $transactionDate = date('Y-m-d H:i:s');
    // Performed_By can be set using session user ID (or name if available)
    $performedBy = $_SESSION['user_id'];  
    $comments = "Stock in of quantity: " . $quantity;

    $stmtInsertTrans = $pdo->prepare(
        "INSERT INTO inventory_transactions 
         (Item_ID, Transaction_Type, Quantity, Transaction_Date, Performed_By, Comments)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmtInsertTrans->execute([$itemID, $transactionType, $quantity, $transactionDate, $performedBy, $comments]);

    // Commit the transaction
    $pdo->commit();

    echo json_encode([
        "status"  => "success", 
        "message" => "Item stocked in successfully."
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        "status"  => "error", 
        "message" => "Failed to stock in item: " . $e->getMessage()
    ]);
}
?>
