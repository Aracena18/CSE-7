<?php
header('Content-Type: application/json');
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

require_once '../db_connection.php'; // Adjust the path as necessary

// Read JSON data from the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
    exit;
}

// Extract required fields (note: 'borrower' now contains the employee's ID)
$itemID = $data['itemID'] ?? null;
$quantity = $data['quantity'] ?? null;
$expectedReturnDate = $data['expectedReturnDate'] ?? null;
$employeeID = $data['borrower'] ?? null;

// Validate required fields
if (!$itemID || !$quantity || !$expectedReturnDate || !$employeeID) {
    echo json_encode([
        "status"  => "error",
        "message" => "All fields are required."
    ]);
    exit;
}

try {
    // Fetch current stock and borrowable flag from Inventory_Items
    $stmt = $pdo->prepare("SELECT Current_Stock, Borrowable FROM Inventory_Items WHERE Item_ID = ?");
    $stmt->execute([$itemID]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        echo json_encode([
            "status"  => "error",
            "message" => "Item not found."
        ]);
        exit;
    }

    if ($item['Current_Stock'] < $quantity) {
        echo json_encode([
            "status"  => "error",
            "message" => "Insufficient stock."
        ]);
        exit;
    }

    // Begin a transaction for atomicity
    $pdo->beginTransaction();

    // Insert a new borrowing record into Equipment_Borrowings
    $insertQuery = "INSERT INTO Equipment_Borrowings (Employee_ID, Item_ID, Quantity, Expected_Return_Date, Status) 
                    VALUES (?, ?, ?, ?, ?)";
    $stmtInsert = $pdo->prepare($insertQuery);
    $stmtInsert->execute([$employeeID, $itemID, $quantity, $expectedReturnDate, 'Borrowed']);

    // Update Inventory_Items to deduct the borrowed quantity
    $updateQuery = "UPDATE Inventory_Items SET Current_Stock = Current_Stock - ? WHERE Item_ID = ?";
    $stmtUpdate = $pdo->prepare($updateQuery);
    $stmtUpdate->execute([$quantity, $itemID]);

    // Retrieve updated stock value
    $stmtSelect = $pdo->prepare("SELECT Current_Stock FROM Inventory_Items WHERE Item_ID = ?");
    $stmtSelect->execute([$itemID]);
    $updatedItem = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    $newStock = $updatedItem['Current_Stock'];

    // Update item status based on new stock and whether the item is borrowable.
    // For borrowable items, if stock > 0 then "Available", if stock == 0 then "Borrowed".
    // For non-borrowable items (e.g., fertilizer), you might use "Out of Stock" when stock is 0.
    if ($item['Borrowable']) {
        $newStatus = ($newStock > 0) ? 'Available' : 'Borrowed';
    } else {
        // If the item is not borrowable, you might choose a different status.
        // For example, if its stock reaches 0, you could set it as "Out of Stock".
        $newStatus = ($newStock > 0) ? 'In Stock' : 'Out of Stock';
    }
    
    $stmtStatus = $pdo->prepare("UPDATE Inventory_Items SET Status = ? WHERE Item_ID = ?");
    $stmtStatus->execute([$newStatus, $itemID]);

    // Commit the transaction
    $pdo->commit();

    echo json_encode([
        "status"  => "success",
        "message" => "Item borrowed successfully."
    ]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        "status"  => "error",
        "message" => "Failed to borrow item: " . $e->getMessage()
    ]);
}
?>
