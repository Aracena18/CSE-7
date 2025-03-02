<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

// Correct path to database connection file
require_once '../db_connection.php';

try {
    // Test database connection
    if (!$pdo) {
        throw new Exception("Database connection failed");
    }

    $stmt = $pdo->prepare("SELECT Supplier_ID, Supplier_Name, Contact_Info FROM Suppliers ORDER BY Supplier_Name");
    $stmt->execute();
    $suppliers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($suppliers)) {
        echo json_encode([
            "status" => "success",
            "suppliers" => [],
            "message" => "No suppliers found"
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "suppliers" => $suppliers
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>
