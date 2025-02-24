
// Add this event listener
document.addEventListener('cropAdded', function() {
    fetchCrops();
});


function loader(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content-wrapper').innerHTML = html;
            console.log("Taskloade SUCCESSFully");
            document.dispatchEvent(new CustomEvent('taskloaded'));
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



