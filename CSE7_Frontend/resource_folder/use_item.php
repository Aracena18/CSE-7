<?php
header('Content-Type: application/json');
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

require_once '../db_connection.php'; // Adjust the path as needed

// Read JSON data from the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
    exit;
}

// Retrieve and validate required fields
$itemID   = $data['itemID']   ?? null;
$quantity = $data['quantity'] ?? null;
$employee = trim($data['employee'] ?? '');

if (!$itemID || !$quantity || $quantity <= 0 || empty($employee)) {
    echo json_encode(["status" => "error", "message" => "Missing or invalid required fields."]);
    exit;
}

try {
    // Begin transaction for atomicity
    $pdo->beginTransaction();

    // Check current stock from Inventory_Items
    $stmt = $pdo->prepare("SELECT Current_Stock FROM Inventory_Items WHERE Item_ID = ?");
    $stmt->execute([$itemID]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        $pdo->rollBack();
        echo json_encode(["status" => "error", "message" => "Item not found."]);
        exit;
    }

    if ($item['Current_Stock'] < $quantity) {
        $pdo->rollBack();
        echo json_encode(["status" => "error", "message" => "Insufficient stock."]);
        exit;
    }

    // Update Inventory_Items: subtract the used quantity
    $newStock = $item['Current_Stock'] - $quantity;
    $stmtUpdate = $pdo->prepare("UPDATE Inventory_Items SET Current_Stock = ? WHERE Item_ID = ?");
    $stmtUpdate->execute([$newStock, $itemID]);

    // Prepare transaction details for inventory_transactions tables
    $transactionType = 'Stock Out';
    $transactionDate = date('Y-m-d H:i:s'); // current date/time
    $comments = ""; // No additional comments for use transactions

    // Insert a new transaction record
    $insertQuery = "INSERT INTO inventory_transactions 
                        (Item_ID, Transaction_Type, Quantity, Transaction_Date, Performed_By, Comments)
                    VALUES (?, ?, ?, ?, ?, ?)";
    $stmtInsert = $pdo->prepare($insertQuery);
    $stmtInsert->execute([$itemID, $transactionType, $quantity, $transactionDate, $employee, $comments]);

    // Commit the transaction
    $pdo->commit();

    echo json_encode(["status" => "success", "message" => "Item used successfully."]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => "Failed to use item: " . $e->getMessage()]);
}
?>
