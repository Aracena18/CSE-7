<?php
session_start();
header('Content-Type: application/json');

// Require your attendance database connection
require_once "db_attendance.php";

// Set timezone if needed
date_default_timezone_set('Asia/Manila');

try {
    // Ensure the request method is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
        exit();
    }
    
    // Verify required parameters are provided
    if (!isset($_POST['employee_id'], $_POST['attendance_date'], $_POST['action'])) {
        throw new Exception("Missing required parameters.");
    }
    
    $employee_id = intval($_POST['employee_id']);
    // Convert submitted date to Y-m-d format
    $attendance_date = date('Y-m-d', strtotime($_POST['attendance_date']));
    $action = strtolower(trim($_POST['action'])); // "time_in" or "time_out"
    
    // Check if the attendance date is the current date
    $currentDate = date('Y-m-d');
    if ($attendance_date !== $currentDate) {
        throw new Exception("Attendance can only be recorded for the current date.");
    }
    
    // Get the current time (HH:mm:ss)
    $currentTime = date('H:i:s');
    
    // Prepare a statement to check for an existing attendance record for the employee on that date
    $checkStmt = $conn->prepare("SELECT id, time_in, time_out FROM attendance WHERE employee_id = ? AND date = ?");
    if (!$checkStmt) {
        throw new Exception("Database prepare failed: " . $conn->error);
    }
    $checkStmt->bind_param("is", $employee_id, $attendance_date);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    // Determine if an attendance record exists
    $recordExists = ($result->num_rows > 0);
    
    // For time_in action:
    if ($action === "time_in") {
        if ($recordExists) {
            // If record exists, update only if time_in is not yet set
            $row = $result->fetch_assoc();
            if ($row['time_in'] === null) {
                $updateStmt = $conn->prepare("UPDATE attendance SET time_in = ?, status = 'present' WHERE id = ? AND time_in IS NULL");
                $updateStmt->bind_param("si", $currentTime, $row['id']);
                if (!$updateStmt->execute()) {
                    throw new Exception("Failed to update Time In: " . $updateStmt->error);
                }
                $updateStmt->close();
                echo json_encode([
                    "success" => true,
                    "message" => "Time In updated successfully",
                    "data" => [
                        "time_in" => $currentTime,
                        "attendance_date" => $attendance_date
                    ]
                ]);
                exit();
            } else {
                // Time In is already recorded – do nothing
                echo json_encode([
                    "success" => false,
                    "message" => "Time In already recorded for this employee on this date."
                ]);
                exit();
            }
        } else {
            // If no record exists, insert a new record with time_in
            $insertStmt = $conn->prepare("INSERT INTO attendance (employee_id, date, time_in, status) VALUES (?, ?, ?, 'present')");
            $insertStmt->bind_param("iss", $employee_id, $attendance_date, $currentTime);
            if (!$insertStmt->execute()) {
                throw new Exception("Failed to insert attendance record: " . $insertStmt->error);
            }
            $insertStmt->close();
            echo json_encode([
                "success" => true,
                "message" => "Attendance record created with Time In",
                "data" => [
                    "time_in" => $currentTime,
                    "attendance_date" => $attendance_date
                ]
            ]);
            exit();
        }
    }
    // For time_out action:
    else if ($action === "time_out") {
        if ($recordExists) {
            $row = $result->fetch_assoc();
            if ($row['time_out'] === null) {
                // Ensure that time_in is present
                if ($row['time_in'] === null) {
                    throw new Exception("Cannot record Time Out without Time In.");
                }
                // Calculate working hours
                $time_in_ts = strtotime($row['time_in']);
                $time_out_ts = strtotime($currentTime);
                if ($time_out_ts <= $time_in_ts) {
                    throw new Exception("Time Out must be after Time In.");
                }
                $total_hours = ($time_out_ts - $time_in_ts) / 3600;
                $regular_hours = min($total_hours, 8);
                $overtime_hours = max(0, $total_hours - 8);
                
                // Update the record with time_out and calculated hours
                $updateStmt = $conn->prepare("UPDATE attendance SET time_out = ?, regular_hours = ?, overtime_hours = ?, status = ? WHERE id = ? AND time_out IS NULL");
                $status = "present"; // or update to another status as needed
                $updateStmt->bind_param("sddsi", $currentTime, $regular_hours, $overtime_hours, $status, $row['id']);
                if (!$updateStmt->execute()) {
                    throw new Exception("Failed to update Time Out: " . $updateStmt->error);
                }
                $updateStmt->close();
                echo json_encode([
                    "success" => true,
                    "message" => "Time Out updated successfully",
                    "data" => [
                        "time_out" => $currentTime,
                        "regular_hours" => $regular_hours,
                        "overtime_hours" => $overtime_hours,
                        "attendance_date" => $attendance_date
                    ]
                ]);
                exit();
            } else {
                // Time Out is already recorded
                echo json_encode([
                    "success" => false,
                    "message" => "Time Out already recorded for this employee on this date."
                ]);
                exit();
            }
        } else {
            // No record exists to update Time Out – cannot update
            throw new Exception("No attendance record exists to update Time Out.");
        }
    }
    else {
        throw new Exception("Invalid action parameter. Must be 'time_in' or 'time_out'.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
} finally {
    if (isset($checkStmt)) {
        $checkStmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
