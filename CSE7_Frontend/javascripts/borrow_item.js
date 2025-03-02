document.addEventListener('Resourcesloaded', function() {
    const borrowerSelect = document.getElementById('borrower');
    
    // Populate employees dropdown when the page loads (or modal is opened)
    fetch('/CSE-7/CSE7_Frontend/employee_folder/get_employees.php')
        .then(response => response.json())
        .then(result => {
            if(result.success) {
                result.data.forEach(employee => {
                    const option = document.createElement('option');
                    option.value = employee.emp_id; // Use the emp_id field
                    option.textContent = employee.name; // Use the name field
                    borrowerSelect.appendChild(option);
                });
            } else {
                console.error('Failed to load employees: ' + result.message);
            }
        })
        .catch(error => console.error('Error loading employees:', error));
});
