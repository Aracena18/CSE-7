function initializeModal() {
    // Use a more robust way to wait for elements
    const checkElements = setInterval(() => {
        var modal = document.getElementById("addCropModal");
        var btn = document.getElementById("addCropBtn");
        var span = document.getElementsByClassName("close")[0];
        var form = document.getElementById("addCropForm");
        var cancelBtn = document.getElementsByClassName("cancel")[0];

        // Debug logging
        console.log("Checking modal elements...");

        if (modal && btn && span) {
            clearInterval(checkElements); // Stop checking once elements are found
            console.log("Modal elements found, initializing...");

            // When the user clicks the button, open the modal 
            btn.onclick = function() {
                modal.style.display = "block";
            }

            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }

            // When the user clicks on Cancel, close the modal
            if (cancelBtn) {
                cancelBtn.onclick = function() {
                    modal.style.display = "none";
                }
            }

            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }

            // Handle form submission if form exists
            if (form) {
                form.addEventListener("submit", function(event) {
                    event.preventDefault();
                    // Process form data here
                    modal.style.display = "none";
                });
            }
        }
    }, 100); // Check every 100ms

    // Stop checking after 5 seconds to prevent infinite checking
    setTimeout(() => {
        clearInterval(checkElements);
        console.log("Stopped checking for modal elements");
    }, 5000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeModal);

// Export for use in other scripts
window.initializeModal = initializeModal;