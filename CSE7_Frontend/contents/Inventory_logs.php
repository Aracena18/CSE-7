<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Logs</title>
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/inventory_logs.css">
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Inventory Logs</h1>
            <input type="text" class="search-input" placeholder="Search logs..." id="searchInput">
        </div>
        
        <div class="tabs" id="logTabs">
            <div class="tab active" data-tab="borrowing">Borrowing Logs</div>
            <div class="tab" data-tab="stock">Stock Logs</div>
        </div>

        <div class="tab-content" id="borrowing">
            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Item Name</th>
                                <th>Borrower</th>
                                <th>Quantity</th>
                                <th>Status</th>
                                <th>Return Date</th>
                            </tr>
                        </thead>
                        <tbody id="borrowingLogs"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="tab-content hidden" id="stock">
            <div class="card">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Item Name</th>
                                <th>Type</th>
                                <th>Quantity</th>
                                <th>Updated By</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody id="stockLogs"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="loadingSpinner" class="spinner hidden"></div>
    </div>

    <script src="/CSE-7/CSE7_Frontend/javascripts/inventory_logs.js"></script>
</body>
</html>

