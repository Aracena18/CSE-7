<?php
header('Content-Type: application/json');

$host     = 'localhost';
$dbname   = 'farm_management';
$username = 'root';
$password = '';

try {
    // Establish a connection using PDO.
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare the SQL query.
    $sql = "SELECT Borrowing_ID, Employee_ID, Item_ID, Borrow_Date, Expected_Return_Date, Actual_Return_Date, Status, Quantity 
            FROM equipment_borrowings 
            ORDER BY Borrowing_ID ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format the results to match the keys expected by the JavaScript.
    $formattedResults = array_map(function($row) {
        return [
            'Date'       => $row['Borrow_Date'],
            'Item_Name'  => $row['Item_ID'], // Replace with the actual item name if available.
            'Borrower'   => $row['Employee_ID'],
            'Quantity'   => $row['Quantity'],
            'Status'     => $row['Status'],
            'Return_Date'=> !empty($row['Actual_Return_Date']) ? $row['Actual_Return_Date'] : $row['Expected_Return_Date']
        ];
    }, $results);
    
    echo json_encode($formattedResults);

} catch (PDOException $e) {
    // Return error information in JSON format.
    echo json_encode(['error' => $e->getMessage()]);
}
?>
