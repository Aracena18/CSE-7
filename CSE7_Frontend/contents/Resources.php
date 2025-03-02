<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resource Management - Agricultural Inventory</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
    <link rel="stylesheet" href="/CSE-7/CSE7_Frontend/css/resources.css">
</head>
<body>
    <div class="inventory-dashboard">
        <div class="dashboard-header">
            <div class="header-content">
                <h1>Resource Management</h1>
                <p class="subtitle">Track and manage your agricultural inventory</p>
            </div>
            <div class="header-actions">
                <button id="addItemBtn" class="btn-primary">
                    <svg width="20" height="20" class="icon">
                        <path d="M10 1v18M1 10h18" stroke="currentColor" fill="none"/>
                    </svg>
                    Add New Item
                </button>
            </div>
        </div>

        <div class="dashboard-metrics">
            <div class="metric-card">
                <h3>Total Items</h3>
                <div class="metric-value" id="totalItems">Loading...</div>
                <div class="metric-trend">↑ 12% from last month</div>
            </div>
            <div class="metric-card">
                <h3>Low Stock Alerts</h3>
                <div class="metric-value alert" id="lowStockCount">Loading...</div>
                <div class="items-list" id="lowStockItems"></div>
            </div>
            <div class="metric-card">
                <h3>Recent Transactions</h3>
                <div class="transactions-list" id="recentTransactions">Loading...</div>
            </div>
        </div>

        <div class="inventory-content">
            <div class="inventory-list">
                <div class="list-header">
                    <h2>Current Inventory</h2>
                    <div class="list-actions">
                        <input type="search" id="searchInventory" placeholder="Search items..." class="search-input">
                        <select id="categoryFilter" class="filter-select">
                            <option value="">All Categories</option>
                            <option value="seeds">Seeds</option>
                            <option value="fertilizers">Fertilizers</option>
                            <option value="tools">Tools</option>
                        </select>
                    </div>
                </div>
                <div class="table-container-Resources">
                    <table id="inventoryTable">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>Threshold</th>
                            <th>Supplier</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody id="inventoryBody">
                        <tr>
                            <td>Tomato Seeds</td>
                            <td>Seeds</td>
                            <td>500</td>
                            <td>100</td>
                            <td>Agro Supplies Co.</td>
                            <td>Available</td>
                            <td>
                                <div class="dropdown">
                                    <button class="dropdown-btn" onclick="toggleDropdown(this)">
                                        Actions
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="dropdown-content">
                                        <a href="#" onclick="useItem('Tomato Seeds')"><i class="fas fa-box-open"></i> Use</a>
                                        <a href="#" onclick="borrowItem('Tomato Seeds')"><i class="fas fa-hand-holding"></i> Borrow</a>
                                        <a href="#" onclick="returnItem('Tomato Seeds')"><i class="fas fa-undo"></i> Return</a>
                                        <a href="#" onclick="editItem('Tomato Seeds')"><i class="fas fa-edit"></i> Edit</a>
                                        <a href="#" class="delete-action" onclick="deleteItem('Tomato Seeds')">
                                            <i class="fas fa-trash"></i> Delete
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Organic Fertilizer</td>
                            <td>Fertilizers</td>
                            <td>200</td>
                            <td>50</td>
                            <td>GreenGrow Ltd.</td>
                            <td>Available</td>
                            <td>
                                <div class="dropdown">
                                    <button class="dropdown-btn" onclick="toggleDropdown(this)">
                                        Actions
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="dropdown-content">
                                        <a href="#" onclick="useItem('Organic Fertilizer')"><i class="fas fa-box-open"></i> Use</a>
                                        <a href="#" onclick="editItem('Organic Fertilizer')"><i class="fas fa-edit"></i> Edit</a>
                                        <a href="#" class="delete-action" onclick="deleteItem('Organic Fertilizer')">
                                            <i class="fas fa-trash"></i> Delete
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>Tractor</td>
                            <td>Tools</td>
                            <td>2</td>
                            <td>1</td>
                            <td>Farm Equipments Inc.</td>
                            <td>Borrowed</td>
                            <td>
                                <div class="dropdown">
                                    <button class="dropdown-btn" onclick="toggleDropdown(this)">
                                        Actions
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="dropdown-content">
                                        <a href="#" onclick="borrowItem('Tractor')"><i class="fas fa-hand-holding"></i> Borrow</a>
                                        <a href="#" onclick="returnItem('Tractor')"><i class="fas fa-undo"></i> Return</a>
                                        <a href="#" onclick="editItem('Tractor')"><i class="fas fa-edit"></i> Edit</a>
                                        <a href="#" class="delete-action" onclick="deleteItem('Tractor')">
                                            <i class="fas fa-trash"></i> Delete
                                        </a>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="/CSE-7/CSE7_Frontend/javascripts/resources.js"></script>
</body>
</html>
