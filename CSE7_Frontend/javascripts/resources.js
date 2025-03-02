document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    loadInventoryData();
});

document.addEventListener('Resourcesloaded', function() {
    // Add Item Modal
    const addItemBtn = document.getElementById('addItemBtn');
    const addItemModal = document.getElementById('addItemModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeBtn = document.getElementById('closeBtn');

    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            console.log('Button clicked');
            addItemModal.style.display = "flex";
            addItemModal.style.justifyContent = "center";
            addItemModal.style.alignItems = "center";
            addItemModal.style.opacity = 1;
            addItemModal.style.visibility = "visible";
        });
    }

    // Close modal when close button (X) is clicked
    closeBtn.onclick = function () {
        addItemModal.style.display = "none";
        addItemForm.reset();
    };

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
                const response = await fetch('/api/inventory/add', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    addItemModal.style.display = 'none';
                    addItemForm.reset();
                    // Refresh inventory table
                    loadInventoryData();
                } else {
                    throw new Error('Failed to add item');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add item. Please try again.');
            }
        });
    }

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
    fetch('/api/inventory')
        .then(response => response.json())
        .then(data => {
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
        <td>${item.name}</td>
        <td>${item.category}</td>
        <td class="${item.stock < item.threshold ? 'low-stock' : ''}">${item.stock}</td>
        <td>${item.threshold}</td>
        <td>${item.supplier}</td>
        <td>
            <button onclick="updateStock(${item.id})" class="btn-secondary">Update</button>
            <button onclick="viewHistory(${item.id})" class="btn-info">History</button>
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
    // You can fetch suppliers from your database here
    // For now, we'll use the static list from the HTML
    const supplierSelect = document.getElementById('supplier');

    // Add a change event listener to handle supplier selection
    if (supplierSelect) {
        supplierSelect.addEventListener('change', function () {
            const selectedSupplier = this.value;
            console.log('Selected supplier:', selectedSupplier);
            // You can add additional logic here if needed
        });
    }
}
