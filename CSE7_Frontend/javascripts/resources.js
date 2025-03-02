document.addEventListener('Resourcesloaded', function() {
    loadDashboardData();
    loadInventoryData();
});

document.addEventListener('Resourcesloaded', function() {
    // Reusable function to show a modal
    function showModal(modal) {
        modal.style.display = "flex";
        modal.style.justifyContent = "center";
        modal.style.alignItems = "center";
        modal.style.opacity = 1;
        modal.style.visibility = "visible";
    }

    // Add Item Modal Elements
    const addItemBtn = document.getElementById('addItemBtn');
    const addItemModal = document.getElementById('addItemModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.getElementById('closeBtn');

    // Add Item Modal Trigger
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            console.log('Button clicked');
            showModal(addItemModal);
        });
    }

    // Close modal when close button (X) is clicked
    if (closeBtn) {
        closeBtn.onclick = function () {
            addItemModal.style.display = "none";
            addItemForm.reset();
        };
    }

    // Close modal when cancel button is clicked
    if (cancelBtn) {
        cancelBtn.onclick = function () {
            addItemModal.style.display = "none";
            addItemForm.reset();
        };
    }

    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target === addItemModal) {
            addItemModal.style.display = "none";
            addItemForm.reset();
        }
    }

    // Add Item Form Submission
    const addItemForm = document.getElementById('addItemForm');
    if (addItemForm) {
        addItemForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(addItemForm);
            try {
                const response = await fetch('/CSE-7/CSE7_Frontend/resource_folder/add_Item.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    addItemModal.style.display = 'none';
                    addItemForm.reset();
                    // Refresh inventory table
                    loadInventoryData();
                } else {
                    showNotification(response.message || 'Failed to record attendance', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add item. Please try again.');
            }
        });
    }

    // Example: Showing another modal using the reusable function
    // const anotherModal = document.getElementById('anotherModal');
    // someOtherButton.addEventListener('click', () => showModal(anotherModal));

    loadSuppliers();
});


function loadDashboardData() {
    // Fetch and display dashboard metrics
    fetch('/api/dashboard-metrics')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalItems').textContent = data.totalItems;
            document.getElementById('lowStockCount').textContent = data.lowStockItems;
            displayRecentTransactions(data.recentTransactions);
        });
}

function loadInventoryData() {
    fetch('/CSE-7/CSE7_Frontend/resource_folder/get_items.php')
        .then(response => response.json())
        .then(data => {
            console.log('Received data:', data); // Debug log
            const tbody = document.getElementById('inventoryBody');
            tbody.innerHTML = '';

            data.forEach(item => {
                const row = createInventoryRow(item);
                tbody.appendChild(row);
            });
        });
}

function createInventoryRow(item) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.Item_Name}</td>
        <td>${item.Category}</td>
        <td>${item.Current_Stock}</td>
        <td>${item.Threshold}</td>
        <td>${item.Supplier_Name}</td>
        <td>${item.Status}</td>

        <td>
            <div class="dropdown">
                <button class="dropdown-btn" onclick="toggleDropdown(this)">
                    Actions
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-content">
                    <a href="#" onclick="useItem('${item.Item_Name}')"><i class="fas fa-box-open"></i> Use</a>
                    <a href="#" onclick="borrowItem('${item.Item_ID}')"><i class="fas fa-hand-holding"></i> Borrow</a>
                    <a href="#" onclick="returnItem('${item.Item_Name}')"><i class="fas fa-undo"></i> Return</a>
                    <a href="#" onclick="editItem('${item.Item_Name}')"><i class="fas fa-edit"></i> Edit</a>
                    <a href="#" class="delete-action" onclick="deleteItem('${item.Item_ID}')"><i class="fas fa-trash"></i> Delete</a>
                </div>
            </div>
        </td>
    `;
    return row;
}

function updateStock(itemId) {
    // Implement stock update modal and functionality
}

function viewHistory(itemId) {
    // Implement transaction history view
}

function toggleDropdown(button) {
    // Close all other dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (dropdown !== button.parentElement) {
            dropdown.classList.remove('show');
        }
    });

    // Toggle current dropdown
    button.parentElement.classList.toggle('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-btn')) {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        });
    }
});

// Prevent dropdown from closing when clicking inside
document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', event => {
        event.stopPropagation();
    });
});

function loadSuppliers() {
    const supplierSelect = document.getElementById('supplier');
    
    if (supplierSelect) {
        fetch('/CSE-7/CSE7_Frontend/resource_folder/get_suppliers.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Received data:', data); // Debug log
                if (data.status === 'success') {
                    // Clear existing options except the first one
                    supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
                    
                    // Add suppliers to dropdown
                    if (data.suppliers && Array.isArray(data.suppliers)) {
                        data.suppliers.forEach(supplier => {
                            const option = document.createElement('option');
                            option.value = supplier.Supplier_ID;
                            option.textContent = supplier.Supplier_Name;
                            supplierSelect.appendChild(option);
                        });
                    }
                } else {
                    console.error('Failed to load suppliers:', data.message);
                }
            })
            .catch(error => {
                console.error('Error loading suppliers:', error);
                supplierSelect.innerHTML = '<option value="">Error loading suppliers</option>';
            });
    }
}

function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const toast = document.createElement('div');
    toast.className = `notification-toast ${type}`;
    toast.style.display = 'block'; // Ensure visibility
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';

    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                          type === 'warning' ? 'fa-exclamation-triangle' : 
                          'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Append to body
    document.body.appendChild(toast);
    
    // Trigger reflow to ensure animation plays
    toast.offsetHeight;
    
    // Add fade-in effect
    toast.style.opacity = '1';
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.remove();
            }
        }, 500);
    }, 5000);
}


function borrowItem(itemName){
    console.log("Borrwed Item:" + itemName);
}