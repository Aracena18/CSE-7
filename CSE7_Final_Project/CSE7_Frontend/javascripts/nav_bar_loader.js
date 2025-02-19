function loader(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(content => {
            document.getElementById('content-wrapper').innerHTML = content;
            // Wait for DOM to update before initializing modal
            setTimeout(() => {
                if (typeof initializeModal === 'function') {
                    initializeModal();
                }
            }, 100);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.getElementById('content-wrapper').innerHTML = '<p>Error loading content. Please try again.</p>';
        });
}