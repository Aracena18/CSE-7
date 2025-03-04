<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Add proper CORS headers
header("Access-Control-Allow-Origin: http://localhost"); // Or your specific domain
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit();
}

require_once "db_config_employee.php";

$user_id = $_SESSION['user_id'];

/**
 * Calculate payroll details based on daily rate and attendance data.
 * Uses the effective days (worked_days minus lateness penalty) to calculate gross pay.
 *
 * @param float $dailyRate The employee's daily rate.
 * @param array|null $attendance The attendance data, including effective_days.
 * @return array Payroll details including daysWorked, dailyRate, grossPay, deductions, and netPay.
 */
function calculatePayroll($dailyRate, $attendance) {
    // If attendance data is missing, assume no work was done.
    if (!$attendance) {
        return [
            "daysWorked" => 0,
            "dailyRate"  => $dailyRate,
            "grossPay"   => 0,
            "deductions" => [
                "tax"        => 0,
                "sss"        => 0,
                "philhealth" => 0,
                "pagibig"    => 0
            ],
            "netPay"     => 0
        ];
    }
    
    // Use the precomputed effective_days value.
    $effectiveDays = max(0, floatval($attendance['effective_days']));
    $grossPay = $dailyRate * $effectiveDays;
    
    // Define fixed deductions (adjust as needed)
    $deductions = [
        "tax"        => 500,
        "sss"        => 300,
        "philhealth" => 200,
        "pagibig"    => 100
    ];
    $totalDeductions = array_sum($deductions);
    
    // Only deduct if gross pay exceeds the deductions.
    $netPay = ($grossPay > $totalDeductions) ? ($grossPay - $totalDeductions) : 0;
    
    return [
        "daysWorked" => round($effectiveDays, 2),
        "dailyRate"  => $dailyRate,
        "grossPay"   => round($grossPay, 2),
        "deductions" => $deductions,
        "netPay"     => round($netPay, 2)
    ];
}

try {
    // Fetch employees for the logged in user
    $sql = "SELECT emp_id, name, position, contact, daily_rate, status, created_at 
            FROM employees 
            WHERE user_id = ?
            ORDER BY created_at DESC";
            
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception("Failed to prepare employee query: " . $conn->error);
    }
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $employees = [];
    $totalPayroll = 0;
    $onLeaveCount = 0;

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Format created_at date
            $row['created_at'] = date('Y-m-d H:i:s', strtotime($row['created_at']));
            $employees[] = $row;
        }
    }
    
    // Determine the current week's start (Monday) and end (Sunday)
    $weekStart = isset($_GET['periodStart']) ? $_GET['periodStart'] : date('Y-m-d', strtotime('monday this week'));
    $weekEnd   = isset($_GET['periodEnd'])   ? $_GET['periodEnd']   : date('Y-m-d', strtotime('sunday this week'));

    // Process each employee
    foreach ($employees as &$employee) {
        // If the employee's status from the Employees table is "on leave",
        // override attendance and payroll to zero.
        if (strtolower($employee['status']) === 'onleave') {
            $employee['attendance'] = null;
            $employee['payroll'] = [
                "daysWorked" => 0,
                "dailyRate"  => floatval($employee['daily_rate']),
                "grossPay"   => 0,
                "deductions" => [
                    "tax"        => 0,
                    "sss"        => 0,
                    "philhealth" => 0,
                    "pagibig"    => 0
                ],
                "netPay"     => 0
            ];
            $onLeaveCount++;
            // Skip attendance query for employees on leave.
            continue;
        }
        
        // Updated attendance query for active employees:
        // - worked_days: Fraction of the day worked.
        //   If time_out is NULL, that day's work is counted as 0.
        //   If the employee worked 8 hours (28,800 seconds) or more, count as 1 full day.
        //   Otherwise, count the fraction of 8 hours.
        // - total_minutes_late: Sum lateness in minutes based on time_in after 09:00:00.
        $sqlAttendance = "
            SELECT 
                SUM(
                  CASE 
                    WHEN time_out IS NULL THEN 0
                    ELSE LEAST(TIMESTAMPDIFF(SECOND, time_in, time_out), 28800)/28800
                  END
                ) AS worked_days,
                SUM(
                  CASE 
                    WHEN time_in > '09:00:00' THEN TIME_TO_SEC(TIMEDIFF(time_in, '09:00:00'))/60 
                    ELSE 0 
                  END
                ) AS total_minutes_late
            FROM attendance
            WHERE employee_id = ? AND date BETWEEN ? AND ?";
        
        $stmtAtt = $conn->prepare($sqlAttendance);
        if (!$stmtAtt) {
            throw new Exception("Failed to prepare attendance query: " . $conn->error);
        }
        $stmtAtt->bind_param("iss", $employee['emp_id'], $weekStart, $weekEnd);
        $stmtAtt->execute();
        $resultAtt = $stmtAtt->get_result();
        
        if ($resultAtt && $rowAtt = $resultAtt->fetch_assoc()) {
            // Compute effective_days by subtracting a lateness penalty from the worked days.
            // Here, we assume that 480 minutes equals one full day's penalty.
            $worked_days = floatval($rowAtt['worked_days']);
            $total_minutes_late = floatval($rowAtt['total_minutes_late']);
            $rowAtt['effective_days'] = max(0, $worked_days - ($total_minutes_late / 480));
            $employee['attendance'] = $rowAtt;
        } else {
            $employee['attendance'] = null;
        }
        
        $stmtAtt->close();
        
        // Calculate payroll details for active employees.
        $employee['payroll'] = calculatePayroll(floatval($employee['daily_rate']), $employee['attendance']);
        $totalPayroll += $employee['payroll']['netPay'];
    }
    
    $stmt->close();

    // Get the count of active employees today (only for the logged in user's employees)
    $activeToday = 0;
    $sqlActive = "SELECT COUNT(DISTINCT employee_id) AS activeToday 
                  FROM attendance 
                  WHERE date = CURDATE() 
                  AND status = 'present' 
                  AND employee_id IN (SELECT emp_id FROM employees WHERE user_id = ?)";
    $stmtActive = $conn->prepare($sqlActive);
    if (!$stmtActive) {
        throw new Exception("Failed to prepare active employees query: " . $conn->error);
    }
    $stmtActive->bind_param("i", $user_id);
    $stmtActive->execute();
    $resultActive = $stmtActive->get_result();
    if ($resultActive && $rowActive = $resultActive->fetch_assoc()) {
        $activeToday = intval($rowActive['activeToday']);
    }
    $stmtActive->close();

    $totalEmployees = count($employees);

    // Prepare the stats data for the front end
    $stats = [
        "totalEmployees" => $totalEmployees,
        "activeToday"    => $activeToday,
        "onLeave"        => $onLeaveCount,
        "totalPayroll"   => "₱" . number_format($totalPayroll, 2)
    ];

    echo json_encode([
        "success" => true,
        "data"    => $employees,
        "count"   => $totalEmployees,
        "stats"   => $stats
    ]);

} catch (Exception $e) {
    error_log("Error in API: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch data",
        "error"   => $e->getMessage()
    ]);
} finally {
    if (isset($result) && $result) {
        $result->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
