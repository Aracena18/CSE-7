function initializeModal() {
    var modal = document.getElementById("addCropModal");
    var btn = document.querySelector(".add_btn-crops");
    var closeBtn = document.querySelector(".close");
    var cancelBtn = document.querySelector(".cancel");
    var form = document.getElementById("addCropForm");


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

        // Close modal when clicking outside
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
                form.reset();
            }
        };

        // Form submission handler
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const formData = new FormData(form);

            fetch("/CSE-7/CSE7_Frontend/crops_folder/add_crop.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Crop added successfully!");
                    form.reset();
                    modal.style.display = "none";

                    document.dispatchEvent(new CustomEvent('cropAdded'));
                    
                } else {
                    alert("Error: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    } else {
        console.error('One or more required elements not found');
    }
}

// Add these functions to your existing modal.js
function changePriorityColor(select) {
    select.classList.remove('high', 'medium', 'low');
    select.classList.add(select.value);
}

function changeStatusColor(select) {
    select.classList.remove('todo', 'inprogress', 'completed', 'onhold');
    select.classList.add(select.value);
}

// Initialize dropdowns when modal is opened
document.addEventListener('DOMContentLoaded', function() {
    const prioritySelects = document.querySelectorAll('.priority-select');
    const statusSelects = document.querySelectorAll('.status-select');
    
    prioritySelects.forEach(select => changePriorityColor(select));
    statusSelects.forEach(select => changeStatusColor(select));
});

