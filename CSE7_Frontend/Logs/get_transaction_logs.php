<?php
$host = 'localhost';
$dbname = 'farm_management';
$username = 'root';
$password = '';

try {
    // Establish a connection using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Set error mode to exception for better error handling
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare your SQL query
    $sql = "SELECT 
                Item_ID, 
                Transaction_Type, 
                Quantity, 
                Transaction_ID, 
                Transaction_Date, 
                Performed_By, 
                Comments
            FROM 
                inventory_transactions
            ORDER BY 
                Transaction_ID ASC";
    
    // Execute the query
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    // Fetch all results as an associative array
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Optionally, output the results as JSON
    header('Content-Type: application/json');
    echo json_encode($results);

} catch(PDOException $e) {
    // Handle any errors
    echo "Error: " . $e->getMessage();
}
?>
