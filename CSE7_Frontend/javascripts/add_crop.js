function addNewCrop(formData) {
    fetch('/CSE-7/CSE7_Frontend/crops_folder/add_crop.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            document.getElementById('addCropModal').style.display = 'none';
            document.getElementById('addCropForm').reset();
            fetchCrops();
        } else {
            throw new Error(data.message || 'Failed to add crop');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding crop: ' + error.message);
    });
}

// Add this to homepage.php after the other script tags
// <script src="/CSE-7/CSE7_Frontend/javascripts/add_crop.js"></script>
