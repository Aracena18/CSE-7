document.addEventListener('Resourcesloaded', function() {
    loadDashboardData();
    loadInventoryData();
});

function showModal(modal) {
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.opacity = 1;
    modal.style.visibility = "visible";
}

document.addEventListener('Resourcesloaded', function() {
    // Reusable function to show a modal
    

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

let ItemData=[];
function loadInventoryData() {
    fetch('/CSE-7/CSE7_Frontend/resource_folder/get_items.php')
        .then(response => response.json())
        .then(data => {
            ItemData = data;
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
    // Conditionally add the Borrow button if the item is borrowable.
    let borrowButton = '';
    let returnButton = '';
    if (item.Borrowable == 1) {  // or use === if you're sure about the type
        borrowButton = `<a href="#" onclick="borrowItem('${item.Item_ID}','${item.Current_Stock}')"><i class="fas fa-hand-holding"></i> Borrow</a>`;
        returnButton= `<a href="#" onclick="showReturnItemModal('${item.Item_ID}')"><i class="fas fa-undo"></i> Return</a>`
    }

    let useButton = '';

    if (item.Borrowable == 0) {  // or use === if you're sure about the type
        useButton = `<a href="#" onclick="showUseItem('${item.Item_ID}','${item.Current_Stock}')"><i class="fas fa-box-open"></i> Use</a>`
    }



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

                    <a href="#" onclick="stockin('${item.Item_ID}','${item.Current_Stock}')"><i class="fas fa-plus"></i>Stock In</a>
                    ${useButton}
                    ${borrowButton}
                    ${returnButton}
                    <a href="#" onclick="editItem('${item.Item_ID}')"><i class="fas fa-edit"></i> Edit</a>
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


// Global variable to hold the current item ID being borrowed
let currentBorrowItemID = null;

// Called when an employee clicks "Borrow" for an item
function borrowItem(itemID, availableStock) { 
    // Store the itemID for later use in the modal form submission
    currentBorrowItemID = itemID;

    document.getElementById("stockAvailable").innerText = "Available: " + availableStock;
    // Optionally update the modal to show available stock if needed
    // e.g., document.getElementById("stockAvailable").innerText = "Available: " + availableStock;
    // Display the borrow item modal
    const modal = document.getElementById("borrowItemModal");
    if (modal) {
        showModal(modal);
    }
}

// Close modal functionality (for the close button and cancel button)
document.querySelectorAll("#borrowItemModal .close, #borrowItemModal .cancel").forEach(btn => {
    btn.addEventListener("click", function() {
        document.getElementById("borrowItemModal").style.display = "none";
        document.getElementById("borrowItemForm").reset();
    });
});

// Handle the submission of the borrow item form
document.getElementById("borrowItemForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Retrieve the values from the modal form
    const quantity = document.getElementById("borrowQuantity").value;
    const expectedReturnDate = document.getElementById("returnDate").value;
    const borrower = document.getElementById("borrower").value; // Get selected employee ID

    // Prepare data to send to the backend
    const requestData = {
        itemID: currentBorrowItemID,
        quantity: quantity,
        expectedReturnDate: expectedReturnDate,
        borrower: borrower  // Include the employee ID
    };

    try {
        const response = await fetch('/CSE-7/CSE7_Frontend/resource_folder/borrow_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("Server Response (Borrow Item):", data);
        if(data.status === "success"){
            alert("Item borrowed successfully!");
            loadInventoryData(); // Refresh the inventory data if needed
        } else {
            alert("Failed to borrow item: " + (data.message || "An error occurred"));
        }
    } catch (error) {
        console.error("Error borrowing item:", error);
        alert("An error occurred while processing your request. Please try again.");
    }

    // Hide the modal and reset the form
    document.getElementById("borrowItemModal").style.display = "none";
    document.getElementById("borrowItemForm").reset();
});


// Global variable to hold the current item ID being returned
let currentReturnItemID = null;

// Called when an employee clicks "Return" for an item
function showReturnItemModal(itemID) {
    // Store the itemID for later use in the modal form submission
    currentReturnItemID = itemID;
    
    // Display the return item modal
    const modal = document.getElementById("returnItemModal");
    if (modal) {
        showModal(modal);
    }
}

// Close modal functionality (for the close button and cancel button)
document.querySelectorAll("#returnItemModal .close, #returnItemModal .cancel").forEach(btn => {
    btn.addEventListener("click", function() {
        document.getElementById("returnItemModal").style.display = "none";
        document.getElementById("returnItemForm").reset();
    });
});

// Handle the submission of the return item form
document.getElementById("returnItemForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Retrieve the values from the modal form
    const quantity = document.getElementById("returnQuantity").value;
    const returner = document.getElementById("returner").value; // Selected employee name

    // Validate input fields
    if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }
    if (!returner) {
        alert("Please select the employee who is returning the item.");
        return;
    }

    // Prepare data to send to the backend
    const requestData = {
        itemID: currentReturnItemID,
        quantity: quantity,
        returnedBy: returner  // The name of the employee returning the item
    };

    try {
        const response = await fetch('/CSE-7/CSE7_Frontend/resource_folder/return_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("Server Response (Return Item):", data);
        if (data.status === "success") {
            alert("Item returned successfully!");
            loadInventoryData(); // Refresh the inventory data if needed
        } else {
            alert("Failed to return item: " + (data.message || "An error occurred"));
        }
    } catch (error) {
        console.error("Error returning item:", error);
        alert("An error occurred while processing your request. Please try again.");
    }

    // Hide the modal and reset the form
    document.getElementById("returnItemModal").style.display = "none";
    document.getElementById("returnItemForm").reset();
});

// Global variable to hold the current item ID being used
let currentUseItemID = null;

// Called when an employee clicks "Use" for an item
function showUseItem(itemID, availableStock) {
    // Store the itemID for later use in the modal form submission
    currentUseItemID = itemID;

    // Update the available stock display in the modal
    document.getElementById("stockAvailableUse").innerText = "Available: " + availableStock;

    // Display the use item modal
    const modal = document.getElementById("useItemModal");
    if (modal) {
        showModal(modal);
    }
}

// Close modal functionality (for the close button and cancel button)
document.querySelectorAll("#useItemModal .close, #useItemModal .cancel").forEach(btn => {
    btn.addEventListener("click", function() {
        document.getElementById("useItemModal").style.display = "none";
        document.getElementById("useItemForm").reset();
    });
});

// Handle the submission of the use item form
document.getElementById("useItemForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Retrieve the values from the modal form
    const quantity = document.getElementById("useQuantity").value;
    const employee = document.getElementById("useEmployee").value; // Selected employee

    // Validate input fields
    if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }
    if (!employee) {
        alert("Please select an employee.");
        return;
    }

    // Prepare data to send to the backend
    const requestData = {
        itemID: currentUseItemID,
        quantity: quantity,
        employee: employee
    };

    try {
        const response = await fetch('/CSE-7/CSE7_Frontend/resource_folder/use_item.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("Server Response (Use Item):", data);
        if (data.status === "success") {
            alert("Item used successfully!");
            loadInventoryData(); // Refresh the inventory data if needed
        } else {
            alert("Failed to use item: " + (data.message || "An error occurred"));
        }
    } catch (error) {
        console.error("Error using item:", error);
        alert("An error occurred while processing your request. Please try again.");
    }

    // Hide the modal and reset the form
    document.getElementById("useItemModal").style.display = "none";
    document.getElementById("useItemForm").reset();
});


let currentStockInItemID = null;

// Called when an employee clicks "Stock In" for an item
function stockin(itemID, currentStock) {
    console.log("Stock In Item ID: " + itemID);
    // Store the itemID for later use in the modal form submission
    currentStockInItemID = itemID;

    // Update the available stock display in the modal
    document.getElementById("stockInAvailable").innerText = "Available: " + currentStock;

    // Display the Stock In modal
    const modal = document.getElementById("StockInModal");
    if (modal) {
        showModal(modal);
    }
}

// Close modal functionality (for the close button and cancel button)
document.querySelectorAll("#StockInModal .close, #StockInModal .cancel").forEach(btn => {
    btn.addEventListener("click", function() {
        document.getElementById("StockInModal").style.display = "none";
        document.getElementById("stockInForm").reset();
    });
});

// Handle the submission of the stock in form
document.getElementById("stockInForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Retrieve the value from the modal form
    const quantity = document.getElementById("stockInQuantity").value;

    // Validate input field
    if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    // Prepare data to send to the backend
    const requestData = {
        itemID: currentStockInItemID,
        quantity: quantity
    };

    try {
        const response = await fetch('/CSE-7/CSE7_Frontend/resource_folder/stock_in.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log("Server Response (Stock In):", data);
        if (data.status === "success") {
            alert("Item stocked in successfully!");
            loadInventoryData(); // Refresh the inventory data if needed
        } else {
            alert("Failed to stock in item: " + (data.message || "An error occurred"));
        }
    } catch (error) {
        console.error("Error stocking in item:", error);
        alert("An error occurred while processing your request. Please try again.");
    }

    // Hide the modal and reset the form
    document.getElementById("StockInModal").style.display = "none";
    document.getElementById("stockInForm").reset();
});

