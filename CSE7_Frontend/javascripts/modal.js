function initializeModal() {
    var modal = document.getElementById("addCropModal");
    var btn = document.querySelector(".add_btn");
    var closeBtn = document.querySelector(".close");
    var cancelBtn = document.querySelector(".cancel");
    var form = document.getElementById("addCropForm");

    // Debug logs to check elements
    console.log('Modal:', modal);
    console.log('Button:', btn);
    console.log('Close button:', closeBtn);
    console.log('Form:', form);

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

            fetch("/CSE-7/CSE7_Frontend/add_crop.php", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Crop added successfully!");
                    form.reset();
                    modal.style.display = "none";
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

// Initialize modal after the content is loaded
window.addEventListener('load', initializeModal);
