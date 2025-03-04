<?php
header('Content-Type: application/json');
require_once "db_config.php"; // Ensure this file establishes your database connection

try {
    // Ensure an employee_id is provided via GET parameter
    if (!isset($_GET['employee_id'])) {
        throw new Exception('Employee ID is required.');
    }

    $employee_id = intval($_GET['employee_id']);

    // Query to fetch employee details
    $employeeQuery = "SELECT emp_id, name, position, contact, daily_rate, days_worked, status, user_id, created_at, email 
                      FROM employees 
                      WHERE emp_id = ?";
    $empStmt = $conn->prepare($employeeQuery);
    if (!$empStmt) {
        throw new Exception("Failed to prepare employee query: " . $conn->error);
    }
    $empStmt->bind_param("i", $employee_id);
    $empStmt->execute();
    $employeeResult = $empStmt->get_result();

    if ($employeeResult->num_rows === 0) {
        throw new Exception("Employee not found.");
    }
    $employee = $employeeResult->fetch_assoc();

    // If no avatar is provided, generate one using the employee's name.
    if (!isset($employee['avatar']) || empty($employee['avatar'])) {
        $employee['avatar'] = "https://ui-avatars.com/api/?name=" . urlencode($employee['name']) . "&background=random";
    }

    // Query to fetch tasks assigned to this employee.
    // We assume the tasks are stored in a table named "tasks" where the "assigned_to" column references the employee id.
    $taskQuery = "SELECT id, description, assigned_to, start_date, end_date, priority, status, location, completed, created_at, updated_at, user_id, crops 
                  FROM tasks 
                  WHERE assigned_to = ?";
    $taskStmt = $conn->prepare($taskQuery);
    if (!$taskStmt) {
        throw new Exception("Failed to prepare task query: " . $conn->error);
    }
    $taskStmt->bind_param("i", $employee_id);
    $taskStmt->execute();
    $taskResult = $taskStmt->get_result();

    $tasks = [];
    while ($row = $taskResult->fetch_assoc()) {
        // If there's no title field, use the description as the title.
        if (!isset($row['title']) || empty($row['title'])) {
            $row['title'] = $row['description'];
        }
        // Convert snake_case dates to camelCase for front-end consistency.
        $row['startDate'] = $row['start_date'];
        $row['endDate'] = $row['end_date'];
        // Optionally, you could remove the original snake_case keys:
        // unset($row['start_date'], $row['end_date']);
        $tasks[] = $row;
    }

    // Return a JSON response with the employee details and tasks
    echo json_encode([
        "success"  => true,
        "employee" => $employee,
        "tasks"    => $tasks
    ]);

    $empStmt->close();
    $taskStmt->close();
    $conn->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
