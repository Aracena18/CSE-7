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
        .then(html => {
            document.getElementById('content-wrapper').innerHTML = html;
            console.log("Taskloade SUCCESSFully");
            document.dispatchEvent(new CustomEvent('taskloaded'));
            document.dispatchEvent(new CustomEvent('Employeeloaded'));
            console.log("Okeyy");
            // Reinitialize functionality based on loaded content
            if (url.includes('crops.php')) {
                fetchCrops();
                initializeModal()

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
        .then(async response => {
            if (!response.ok) {
                const text = await response.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || 'Server error');
                } catch (e) {
                    throw new Error(text || 'Server error');
                }
            }
            return response.json();
        })
        .then(data => {
            if (!data || !data.success) {
                throw new Error(data?.message || 'Failed to fetch crop data');
            }
            populateEditForm(data.data);
            document.getElementById('EditCropModal').style.display = 'flex';
        })
        .catch(error => {
            console.error('Error details:', error);
            alert('Error fetching crop data: ' + error.message);
        });
}

function populateEditForm(crop) {
    const form = document.getElementById('editCropForm');
    form.cropId.value = crop.id;
    form.cropName.value = crop.crop_name;
    form.location.value = crop.location;
    form.cropType.value = crop.crop_type;
    form.plantingDate.value = crop.planting_date;
    form.expectedHarvestDate.value = crop.expected_harvest_date;
    form.variety.value = crop.variety;
    form.quantity.value = crop.quantity;
}

// Split the form submit handler into two separate functions
document.getElementById('addCropForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const cropId = formData.get('cropId');
    
    if (cropId) {
        // This is an update operation
        updateCrop(formData);
    } else {
        // This is an add operation
        addCrop(formData);
    }
});

function updateCrop(formData) {
    fetch('/CSE-7/CSE7_Frontend/crops_folder/update_crop.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Reset form and close modal
            document.getElementById('addCropForm').reset();
            document.getElementById('addCropModal').style.display = 'none';
            // Refresh table
            fetchCrops();
        } else {
            throw new Error(data.message || 'Update failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error updating crop: ' + error.message);
    });
}

function addCrop(formData) {
    fetch('/CSE-7/CSE7_Frontend/crops_folder/add_crop.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById('addCropForm').reset();
            document.getElementById('addCropModal').style.display = 'none';
            fetchCrops();
        } else {
            throw new Error(data.message || 'Add failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding crop: ' + error.message);
    });
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

function showEditModal(cropData) {
    const form = document.getElementById('addCropForm');
    form.reset();
    populateForm(cropData);
    document.querySelector('.modal-header h2').textContent = 'Edit Crop';
    document.getElementById('submitButton').textContent = 'Update Crop';
    document.getElementById('addCropModal').style.display = 'flex';
}

function populateForm(crop) {
    document.getElementById('cropId').value = crop.id;
    document.getElementById('cropName').value = crop.crop_name;
    document.getElementById('location').value = crop.location;
    document.getElementById('cropType').value = crop.crop_type;
    document.getElementById('plantingDate').value = crop.planting_date;
    document.getElementById('expectedHarvestDate').value = crop.expected_harvest_date;
    document.getElementById('variety').value = crop.variety;
    document.getElementById('quantity').value = crop.quantity;
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



