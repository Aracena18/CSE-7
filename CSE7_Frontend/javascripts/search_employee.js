
let searchTimeout = null;
const searchDebounceTime = 300;

document.addEventListener('Employeeloaded', function() {
    const searchInput = document.getElementById('employeeSearch');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchResults) {
        console.error('Search elements not found');
        return;
    }

    // Clear any existing event listeners
    searchInput.removeEventListener('input', handleInput);
    searchInput.addEventListener('input', handleInput);

    // Close results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
});

function handleInput(e) {
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    const query = e.target.value.trim();
    const searchResults = document.getElementById('searchResults');

    if (query === '') {
        searchResults.style.display = 'none';
        return;
    }

    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, searchDebounceTime);
}

function performSearch(query) {
    fetch(`/CSE-7/CSE7_Frontend/employee_folder/search_employee.php?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('searchResults');
            
            if (!data.success) {
                throw new Error(data.message);
            }

            if (data.employees.length === 0) {
                searchResults.innerHTML = '<div class="no-results">No employees found</div>';
            } else {
                searchResults.innerHTML = data.employees.map(employee => `
                    <div class="search-result-item" onclick="selectEmployee('${employee.name}')">
                        <div class="employee-name">${employee.name}</div>
                        <div class="employee-details">
                            <span class="position">${employee.position}</span>
                            <span class="status ${employee.status.toLowerCase()}">${employee.status}</span>
                        </div>
                    </div>
                `).join('');
            }

            searchResults.style.display = 'block';
        })
        .catch(error => {
            console.error('Search error:', error);
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '<div class="search-error">Error performing search</div>';
            searchResults.style.display = 'block';
        });
}

function selectEmployee(employeeName) {
    const searchInput = document.getElementById('employeeSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchResults) {
        searchInput.value = employeeName;
        searchResults.style.display = 'none';
    }
}
