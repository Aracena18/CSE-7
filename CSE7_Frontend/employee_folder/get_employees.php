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

// Debug session
error_log("Session data: " . print_r($_SESSION, true));

if (!isset($_SESSION['user_id'])) {
    error_log("User not authenticated - no user_id in session");
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'User not authenticated']);
    exit();
}

require_once "db_config_employee.php";

$user_id = $_SESSION['user_id'];

/**
 * Calculate payroll details based on daily rate and attendance data.
 * The function uses the effective days from attendance to calculate gross pay.
 * It then applies fixed deductions and computes the net pay.
 *
 * @param float $dailyRate The employee's daily rate.
 * @param array|null $attendance The attendance data, including effective_days.
 * @return array Payroll details including daysWorked, dailyRate, grossPay, deductions, and netPay.
 */
function calculatePayroll($dailyRate, $attendance) {
    // If attendance data is missing, assume 0 effective days.
    $effectiveDays = $attendance ? floatval($attendance['effective_days']) : 0;
    $grossPay = $dailyRate * $effectiveDays;
    
    // Define fixed deductions (modify these values as needed)
    $deductions = [
        "tax"        => 500,
        "sss"        => 300,
        "philhealth" => 200,
        "pagibig"    => 100
    ];
    $totalDeductions = array_sum($deductions);
    $netPay = $grossPay - $totalDeductions;
    
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
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $employees = [];

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

    // For each employee, fetch attendance data for the current week and calculate payroll details.
    foreach ($employees as &$employee) {
        $sqlAttendance = "
            SELECT 
                COUNT(date) AS days_present,
                SUM(
                  CASE 
                    WHEN time_in > '09:00:00' 
                    THEN TIME_TO_SEC(TIMEDIFF(time_in, '09:00:00'))/60 
                    ELSE 0 
                  END
                ) AS total_minutes_late,
                SUM(
                  CASE 
                    WHEN time_in > '09:00:00' 
                    THEN TIME_TO_SEC(TIMEDIFF(time_in, '09:00:00'))/3600 
                    ELSE 0 
                  END
                ) AS total_hours_late,
                (
                  COUNT(date) - 
                  (SUM(
                     CASE 
                       WHEN time_in > '09:00:00' 
                       THEN TIME_TO_SEC(TIMEDIFF(time_in, '09:00:00'))/60 
                       ELSE 0 
                     END
                  ) / 480)
                ) AS effective_days
            FROM attendance
            WHERE employee_id = ? AND date BETWEEN ? AND ?";
        
        $stmtAtt = $conn->prepare($sqlAttendance);
        $stmtAtt->bind_param("iss", $employee['emp_id'], $weekStart, $weekEnd);
        $stmtAtt->execute();
        $resultAtt = $stmtAtt->get_result();
        
        if ($resultAtt && $rowAtt = $resultAtt->fetch_assoc()) {
            $employee['attendance'] = $rowAtt;
        } else {
            $employee['attendance'] = null;
        }
        
        $stmtAtt->close();
        
        // Calculate payroll details based on the employee's daily rate and attendance data.
        $employee['payroll'] = calculatePayroll(floatval($employee['daily_rate']), $employee['attendance']);
    }

    echo json_encode([
        "success" => true,
        "data"    => $employees,
        "count"   => count($employees)
    ]);

} catch (Exception $e) {
    error_log("Error in get_employees.php: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch employees",
        "error"   => $e->getMessage()
    ]);

} finally {
    if (isset($result)) {
        $result->close();
    }
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>
