console.log('populate_crops.js loaded');

function populateCropDropdowns() {
    console.log('Attempting to populate crop dropdowns...'); // Debug log

    // Using the correct path to get_crops.php
    fetch('/CSE-7/CSE7_Frontend/crops_folder/get_crops.php')
        .then(response => {
            console.log('Response received:', response); // Debug log
            return response.json();
        })
        .then(crops => {
            console.log('Crops data:', crops); // Debug log
            
            const cropSelect = document.getElementById('cropSelect');
            const cropSelectEdit = document.getElementById('cropSelectEdit');
            
            if (cropSelect) {
                cropSelect.innerHTML = '<option value="">Select Crop</option>';
                crops.forEach(crop => {
                    cropSelect.innerHTML += `<option value="${crop.id}">${crop.crop_name}</option>`;
                });
            }

            if (cropSelectEdit) {
                cropSelectEdit.innerHTML = '<option value="">Select Crop</option>';
                crops.forEach(crop => {
                    cropSelectEdit.innerHTML += `<option value="${crop.id}">${crop.crop_name}</option>`;
                });
            }
        })
        .catch(error => {
            console.error('Error fetching crops:', error);
        });
}

// Add event listeners for both modals
document.addEventListener('DOMContentLoaded', function() {
    // For Add Task Modal
    const addTaskBtn = document.querySelector('.add_btn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            console.log('Add Task button clicked'); // Debug log
            setTimeout(populateCropDropdowns, 100); // Small delay to ensure modal is open
        });
    }

    // For Edit Task Modal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            console.log('Edit button clicked'); // Debug log
            setTimeout(populateCropDropdowns, 100); // Small delay to ensure modal is open
        }
    });
});

// Also populate when content is loaded
document.addEventListener('taskloaded', function() {
    console.log('Task content loaded'); // Debug log
    populateCropDropdowns();
});

// Additional event listener for when modals are shown
function initializeModalListeners() {
    const addTaskModal = document.getElementById('addTaskModal');
    const editTaskModal = document.getElementById('EditTaskModal');

    if (addTaskModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.style.display === 'flex') {
                    console.log('Add Task modal shown'); // Debug log
                    populateCropDropdowns();
                }
            });
        });

        observer.observe(addTaskModal, { attributes: true, attributeFilter: ['style'] });
    }

    if (editTaskModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.style.display === 'flex') {
                    console.log('Edit Task modal shown'); // Debug log
                    populateCropDropdowns();
                }
            });
        });

        observer.observe(editTaskModal, { attributes: true, attributeFilter: ['style'] });
    }
}

// Initialize modal listeners
document.addEventListener('DOMContentLoaded', initializeModalListeners);
