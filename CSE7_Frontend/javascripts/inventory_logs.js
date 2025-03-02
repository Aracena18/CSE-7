document.addEventListener("logsLoaded", function() {

    console.log("Logs Loaded");
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));

            // Add active class to clicked tab
            this.classList.add('active');
            // Retrieve the target tab id from the data-tab attribute
            const target = this.getAttribute('data-tab');
            // Show the corresponding tab content by removing the "hidden" class
            document.getElementById(target).classList.remove('hidden');
            loadStockLogs()
            loadBorrowingLogs()
        });
    });
});



function createStockLogRow(log) {
    // Build a table row using template literals.
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${log.Transaction_Date}</td>
        <td>${log.Item_ID}</td>
        <td>${log.Transaction_Type}</td>
        <td>${log.Quantity}</td>
        <td>${log.Performed_By}</td>
        <td>${log.Comments}</td>
    `;
    return row;
}

function loadStockLogs() {
    // Optionally show a loading spinner while fetching data.
    const spinner = document.getElementById("loadingSpinner");
    spinner.classList.remove("hidden");

    // Fetch the data from your PHP backend. Adjust the URL if needed.
    fetch("/CSE-7/CSE7_Frontend/Logs/get_transaction_logs.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Hide the spinner after the data is loaded.
            spinner.classList.add("hidden");

            // Get the table body element for the Stock Logs table.
            const stockLogsBody = document.getElementById("stockLogs");
            stockLogsBody.innerHTML = ""; // Clear any existing content.

            // Iterate over each log entry and append a row to the table.
            data.forEach(log => {
                stockLogsBody.appendChild(createStockLogRow(log));
            });
        })
        .catch(error => {
            console.error("Error fetching stock logs:", error);
            spinner.classList.add("hidden");
        });
}

function createBorrowingLogRow(log) {
    // Build a table row using template literals for the Borrowing Logs.
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${log.Date}</td>
        <td>${log.Item_Name}</td>
        <td>${log.Borrower}</td>
        <td>${log.Quantity}</td>
        <td>${log.Status}</td>
        <td>${log.Return_Date}</td>
    `;
    return row;
}

function loadBorrowingLogs() {
    // Optionally show a loading spinner while fetching data.
    const spinner = document.getElementById("loadingSpinner");
    spinner.classList.remove("hidden");

    // Fetch the data from your PHP backend. Adjust the URL if needed.
    fetch("/CSE-7/CSE7_Frontend/Logs/get_borrowing.php")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            // Hide the spinner after the data is loaded.
            spinner.classList.add("hidden");

            // Get the table body element for the Borrowing Logs table.
            const borrowingLogsBody = document.getElementById("borrowingLogs");
            borrowingLogsBody.innerHTML = ""; // Clear any existing content.

            // Iterate over each log entry and append a row to the table.
            data.forEach(log => {
                borrowingLogsBody.appendChild(createBorrowingLogRow(log));
            });
        })
        .catch(error => {
            console.error("Error fetching borrowing logs:", error);
            spinner.classList.add("hidden");
        });
}
