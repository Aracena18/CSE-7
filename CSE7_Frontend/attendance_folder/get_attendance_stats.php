<?php
header('Content-Type: application/json');
require_once 'db_attendance.php';

try {
    // Get today's date in the proper format
    $today = date('Y-m-d');

    // Count present employees using the 'date' column
    $presentQuery = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE date = '$today' AND status = 'present'");
    $presentRow = $presentQuery->fetch_assoc();
    $present = isset($presentRow['count']) ? $presentRow['count'] : 0;

    // Count absent employees using the 'date' column
    $absentQuery = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE date = '$today' AND status = 'absent'");
    $absentRow = $absentQuery->fetch_assoc();
    $absent = isset($absentRow['count']) ? $absentRow['count'] : 0;

    // Count late employees using the 'date' column
    $lateQuery = $conn->query("SELECT COUNT(*) as count FROM attendance WHERE date = '$today' AND status = 'late'");
    $lateRow = $lateQuery->fetch_assoc();
    $late = isset($lateRow['count']) ? $lateRow['count'] : 0;

    // Calculate total employees and attendance rate
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
