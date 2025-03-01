<?php
header('Content-Type: application/json');
require_once 'db_attendance.php';

try {
    // Get today's date
    $today = date('Y-m-d');

    // Count present employees
    $presentQuery = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE DATE(time_in) = '$today' AND status = 'present'");
    $present = $presentQuery->fetch_assoc()['count'];

    // Count absent employees
    $absentQuery = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE DATE(time_in) = '$today' AND status = 'absent'");
    $absent = $absentQuery->fetch_assoc()['count'];

    // Count late employees
    $lateQuery = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE DATE(time_in) = '$today' AND status = 'late'");
    $late = $lateQuery->fetch_assoc()['count'];

    // Calculate total employees
    $total = $present + $absent + $late;
    $rate = $total > 0 ? round(($present / $total) * 100, 2) : 0;

    echo json_encode([
        'success' => true,
        'present' => (int)$present,
        'absent' => (int)$absent,
        'late' => (int)$late,
        'rate' => $rate
    ]);

} catch(Exception $e) {
    error_log("Database Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
