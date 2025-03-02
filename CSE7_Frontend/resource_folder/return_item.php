<?php
header('Content-Type: application/json');
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

require_once '../db_connection.php'; // Adjust path as needed

// Read JSON data from the request body
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
    exit;
}

$itemID = $data['itemID'] ?? null;
$returnQuantity = $data['quantity'] ?? null;
// We'll still read returnedBy for logging purposes or future use
$returnedBy = trim($data['returnedBy'] ?? '');

if (!$itemID || !$returnQuantity || $returnQuantity <= 0 || empty($returnedBy)) {
    echo json_encode(["status" => "error", "message" => "Invalid item ID, quantity, or return name."]);
    exit;
}

try {
    // Begin transaction for atomicity
    $pdo->beginTransaction();

    // Retrieve all active borrowing records for the employee (using returnedBy as the identifier) and item
    $query = "SELECT * FROM Equipment_Borrowings 
              WHERE Employee_ID = ? 
                AND Item_ID = ? 
                AND Status = 'Borrowed'
              ORDER BY Borrow_Date ASC";
    $stmt = $pdo->prepare($query);
    // Make sure that the value in returnedBy matches what is stored in Employee_ID.
    $stmt->execute([$returnedBy, $itemID]);
    $borrowRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$borrowRecords || count($borrowRecords) === 0) {
        $pdo->rollBack();
        echo json_encode(["status" => "error", "message" => "No active borrowing record found for this item and employee."]);
        exit;
    }

    // Calculate total borrowed quantity for this item by this employee
    $totalBorrowed = 0;
    foreach ($borrowRecords as $record) {
        $totalBorrowed += $record['Quantity'];
    }

    if ($returnQuantity > $totalBorrowed) {
        $pdo->rollBack();
        echo json_encode(["status" => "error", "message" => "Return quantity exceeds total borrowed quantity."]);
        exit;
    }

    // Process the return across multiple borrow records (oldest first)
    $remainingReturn = $returnQuantity;
    foreach ($borrowRecords as $record) {
        if ($remainingReturn <= 0) break;

        $recordQuantity = $record['Quantity'];
        if ($recordQuantity <= $remainingReturn) {
            // Full return of this record: update record with return info
            $updateQuery = "UPDATE Equipment_Borrowings 
                            SET Actual_Return_Date = NOW(), Status = 'Returned'
                            WHERE Borrowing_ID = ?";
            $stmtUpdate = $pdo->prepare($updateQuery);
            $stmtUpdate->execute([$record['Borrowing_ID']]);
            $remainingReturn -= $recordQuantity;
        } else {
            // Partial return: reduce the borrowed quantity in this record
            $newQuantity = $recordQuantity - $remainingReturn;
            $updateQuery = "UPDATE Equipment_Borrowings 
                            SET Quantity = ? 
                            WHERE Borrowing_ID = ?";
            $stmtUpdate = $pdo->prepare($updateQuery);
            $stmtUpdate->execute([$newQuantity, $record['Borrowing_ID']]);
            $remainingReturn = 0;
        }
    }

    // Update the inventory: Increase Current_Stock by the total returned quantity
    $updateInventoryQuery = "UPDATE Inventory_Items 
                             SET Current_Stock = Current_Stock + ? 
                             WHERE Item_ID = ?";
    $stmtUpdateInventory = $pdo->prepare($updateInventoryQuery);
    $stmtUpdateInventory->execute([$returnQuantity, $itemID]);

    // Retrieve updated inventory details
    $stmtSelectItem = $pdo->prepare("SELECT Current_Stock, Borrowable FROM Inventory_Items WHERE Item_ID = ?");
    $stmtSelectItem->execute([$itemID]);
    $item = $stmtSelectItem->fetch(PDO::FETCH_ASSOC);
    $newStock = $item['Current_Stock'];
    $borrowable = $item['Borrowable'];

    // Update the item's status based on its new stock level and borrowable flag
    if ($borrowable == 1) {
        $newStatus = ($newStock > 0) ? 'Available' : 'Borrowed';
    } else {
        $newStatus = ($newStock > 0) ? 'In Stock' : 'Out of Stock';
    }
    $stmtUpdateStatus = $pdo->prepare("UPDATE Inventory_Items SET Status = ? WHERE Item_ID = ?");
    $stmtUpdateStatus->execute([$newStatus, $itemID]);

    // Commit transaction
    $pdo->commit();
    echo json_encode(["status" => "success", "message" => "Item returned successfully."]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["status" => "error", "message" => "Failed to return item: " . $e->getMessage()]);
}
?>
