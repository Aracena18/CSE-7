// Add this event listener
document.addEventListener('cropAdded', function() {
    fetchCrops();
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtn = document.getElementById('userDropdownBtn');
    const dropdownContent = document.getElementById('userDropdown');

    // Toggle dropdown when clicking the button
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownContent.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target)) {
            if (dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });

    // Add click handler for profile link
    const profileLink = document.querySelector('a[href="profile.php"]');
    if (profileLink) {
        profileLink.onclick = function(e) {
            e.preventDefault();
            loader('/CSE-7/CSE7_Frontend/contents/profile.php');
        };
    }
});

function loader(url) {
    fetch(url)
        .then(response => response.text())
        .then(content => {
            document.getElementById('content-wrapper').innerHTML = content;
            
            // Dispatch appropriate events based on the loaded content
            if (url.includes('Employee.php')) {
                console.log('Employee.php loaded, dispatching events...');
                // First dispatch contentLoaded
                document.dispatchEvent(new Event('contentLoaded'));
                // Then dispatch Employeeloaded after a small delay
                setTimeout(() => {
                    document.dispatchEvent(new Event('Employeeloaded'));
                }, 100);
            }
            console.log("Okeyy");
            // Reinitialize functionality based on loaded content
            if (url.includes('crops.php')) {
                fetchCrops();
                initializeModal()
                initializeEditModal();
            } else if (url.includes('schedulecontent.php')) {
                document.dispatchEvent(new CustomEvent('taskloaded'));
                
            } else if (url.includes('schedule.php')) {
                document.dispatchEvent(new CustomEvent('scheduleloaded'));
            } else if (url.includes('Attendance.php')) {
                document.dispatchEvent(new CustomEvent('AttendanceLoaded'));
                console.log("Attendance loaded");
            }
        })
        .catch(error => console.error('Error loading content:', error));
}

function fetchCrops() {
    fetch("/CSE-7/CSE7_Frontend/crops_folder/get_crops.php")  // Call the PHP script
        .then(response => response.json())  // Convert response to JSON
        .then(data => {
            const tbody = document.getElementById("cropTableBody");
            
            if (!tbody) {
                console.error("Table body element not found!");
                return;
            }
            tbody.innerHTML = ""; // Clear existing rows

            data.forEach(crop => {
                const row = document.createElement("tr"); // Create a new row
                row.innerHTML = `
                    <td>${crop.crop_name}</td>
                    <td>${crop.location}</td>
                    <td>${crop.crop_type}</td>
                    <td>${crop.planting_date}</td>
                    <td>${crop.expected_harvest_date}</td>
                    <td>${crop.variety}</td>
                    <td>${crop.quantity}</td>
                    <td> 
                        <div class="action-buttons">
                        <button class="edit-btn" onclick="editCrop(${crop.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteCrop(${crop.id})">Delete</button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row); // Add row to table
            });
        })
        .catch(error => console.error("Error fetching crops:", error));
}

function deleteCrop(id) {
    if (!confirm("Are you sure you want to delete this crop?")) return;

    fetch(`/CSE-7/CSE7_Frontend/crops_folder/delete_crops.php?id=${id}`, { 
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.success) fetchCrops(); // Reload crops
    })
    .catch(error => console.error("Error deleting crop:", error));
}

function editCrop(id) {
    fetch(`/CSE-7/CSE7_Frontend/crops_folder/get_single_crop.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch crop data');
            }
            populateEditForm(data.data);
            openEditModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching crop data: ' + error.message);
        });
}

function populateEditForm(crop) {
    const form = document.getElementById('editCropForm');
    if (!form) return;
    
    // Map crop data to form fields
    const fields = ['cropId', 'cropName', 'location', 'cropType', 'plantingDate', 
                   'expectedHarvestDate', 'variety', 'quantity'];
    
    fields.forEach(field => {
        const input = form[field];
        if (input) {
            const cropField = field === 'cropId' ? 'id' : 
                            field.replace(/([A-Z])/g, '_$1').toLowerCase();
            input.value = crop[cropField] || '';
        }
    });
}

function openEditModal() {
    const modal = document.getElementById("EditCropModal");
    if (!modal) return;
    
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
}

function closeEditModal() {
    const modal = document.getElementById("EditCropModal");
    if (!modal) return;
    
    modal.style.display = "none";
    document.getElementById('editCropForm')?.reset();
}

// Initialize edit modal functionality
function initializeEditModal() {
    const modal = document.getElementById("EditCropModal");
    const closeBtn = modal?.querySelector(".close");
    const cancelBtn = modal?.querySelector(".cancel");
    const form = document.getElementById("editCropForm");

    if (!modal || !form) return;

    // Close button handler
    closeBtn?.addEventListener('click', closeEditModal);
    
    // Cancel button handler
    cancelBtn?.addEventListener('click', closeEditModal);

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        fetch('/CSE-7/CSE7_Frontend/crops_folder/update_crop.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                closeEditModal();
                fetchCrops();
            } else {
                throw new Error(data.message || 'Update failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating crop: ' + error.message);
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditModal();
        }
    });
}

function showEditModal(){
    
    var modal = document.getElementById("EditCropModal");
    var btn = document.querySelector(".edit-btn");
    var closeBtn = document.querySelector(".close");
    var cancelBtn = document.querySelector(".cancel");
    var form = document.getElementById("editCropForm");

    if (modal && btn && closeBtn && form) {
        // Show modal when button is clicked
        btn.onclick = function () {
            console.log('Button clicked');
            modal.style.display= "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modal.style.opacity = 1;
            modal.style.visibility = "visible";
        };

        // Close modal when close button (X) is clicked
        closeBtn.onclick = function () {
            modal.style.display = "none";
            form.reset();
        };

        // Close modal when cancel button is clicked
        if (cancelBtn) {
            cancelBtn.onclick = function () {
                modal.style.display = "none";
                form.reset();
            };
        }
}
// Update the modal handlers
function showAddModal() {
    const form = document.getElementById('addCropForm');
    form.reset();
    document.getElementById('cropId').value = '';
    document.querySelector('.modal-header h2').textContent = 'Add Crop';
    document.getElementById('submitButton').textContent = 'Add Crop';
    document.getElementById('addCropModal').style.display = 'flex';
}


// Update the button click handlers
document.getElementById('addCropBtn').onclick = showAddModal;

// Add modal close handler to reset form
document.querySelector('#addCropModal .close').addEventListener('click', function() {
    document.getElementById('addCropForm').reset();
    document.querySelector('.modal-header h2').textContent = 'Add Crop';
    document.getElementById('submitButton').textContent = 'Add Crop';
    document.getElementById('addCropModal').style.display = 'none';
});

// Add event listener for edit form submission
document.getElementById('editCropForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    fetch('/CSE-7/CSE7_Frontend/crops_folder/update_crop.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById('EditCropModal').style.display = 'none';
            fetchCrops(); // Refresh the table
        } else {
            throw new Error(data.message || 'Update failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating crop: ' + error.message);
    });
});

// Add event listener for edit modal close button
document.querySelector('#EditCropModal .close').addEventListener('click', function() {
    document.getElementById('EditCropModal').style.display = 'none';
});


}