<?php
header('Content-Type: application/json');
require_once '../db_connection.php'; // Adjust the path as needed

try {
    // Query to fetch inventory items along with their supplier names and the Borrowable column
    $query = "SELECT 
                ii.Item_ID, 
                ii.Item_Name, 
                ii.Category, 
                ii.Current_Stock, 
                ii.Threshold, 
                ii.Status,
                ii.Borrowable, 
                s.Supplier_Name 
              FROM Inventory_Items ii 
              LEFT JOIN Suppliers s ON ii.Supplier_ID = s.Supplier_ID
              ORDER BY ii.Item_Name ASC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to fetch items: " . $e->getMessage()
    ]);
}
?>
