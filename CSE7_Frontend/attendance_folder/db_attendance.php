<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Change to 0 to prevent HTML errors from being sent

$host = "localhost";
$username = "root";
$password = "";
$database = "farm_management"; // Make sure this matches your actual database name

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    error_log("Connection failed: " . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to handle special characters
$conn->set_charset("utf8mb4");
?>
