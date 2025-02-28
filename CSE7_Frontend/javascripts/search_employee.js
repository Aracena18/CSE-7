class EmployeeSearch {
    constructor(inputId, resultsId, onSelect) {
        this.searchInput = document.getElementById(inputId);
        this.searchResults = document.getElementById(resultsId);
        this.searchTimeout = null;
        this.searchDebounceTime = 300;
        this.onSelect = onSelect;
        this.instanceId = inputId; // Add instance ID for unique reference

        if (!this.searchInput || !this.searchResults) {
            console.error(`Elements not found for ${inputId}`);
            return;
        }

        this.init();
    }

    init() {
        console.log('Initializing search for:', this.searchInput.id);
        
        // Remove any existing event listeners first
        this.searchInput.removeEventListener('input', this.handleInput.bind(this));
        this.searchInput.addEventListener('input', this.handleInput.bind(this));

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchResults.contains(e.target)) {
                this.searchResults.style.display = 'none';
            }
        });

        // Add the results container if it doesn't exist
        if (!this.searchResults) {
            this.searchResults = document.createElement('div');
            this.searchResults.id = `${this.instanceId}Results`;
            this.searchResults.className = 'search-results';
            this.searchInput.parentNode.appendChild(this.searchResults);
        }

        // Debug info
        console.log('Search results element:', this.searchResults);
    }

    handleInput(e) {
        console.log('Input event triggered for:', this.searchInput.id);
        
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        const query = e.target.value.trim();
        console.log('Search query:', query);

        if (query === '') {
            this.searchResults.style.display = 'none';
            return;
        }

        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, this.searchDebounceTime);
    }

    performSearch(query) {
        console.log('Performing search with query:', query);
        
        fetch(`/CSE-7/CSE7_Frontend/employee_folder/search_employee.php?query=${encodeURIComponent(query)}`)
            .then(response => {
                console.log('Search response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Search results:', data);
                if (!data.success) {
                    throw new Error(data.message);
                }

                if (data.employees.length === 0) {
                    this.searchResults.innerHTML = '<div class="no-results">No employees found</div>';
                } else {
                    this.searchResults.innerHTML = data.employees.map(employee => `
                        <div class="search-result-item" data-name="${employee.name}">
                            <div class="employee-name">${employee.name}</div>
                            <div class="employee-details">
                                <span class="position">${employee.position}</span>
                                <span class="status ${employee.status.toLowerCase()}">${employee.status}</span>
                            </div>
                        </div>
                    `).join('');

                    // Add click handlers to all search result items
                    this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
                        item.addEventListener('click', () => {
                            this.selectEmployee(item.dataset.name);
                        });
                    });
                }

                this.searchResults.style.display = 'block';
            })
            .catch(error => {
                console.error('Search error:', error);
                this.searchResults.innerHTML = '<div class="search-error">Error performing search</div>';
                this.searchResults.style.display = 'block';
            });
    }

    selectEmployee(employeeName) {
        this.searchInput.value = employeeName;
        this.searchResults.style.display = 'none';
        if (this.onSelect) {
            this.onSelect(employeeName);
        }

        // If this is the main employee search, filter the table
        if (this.searchInput.id === 'employeeSearch') {
            this.filterEmployeeTable(employeeName);
        }
    }

    filterEmployeeTable(searchTerm) {
        const tableBody = document.getElementById('employeeTableBody');
        if (!tableBody) return;

        const rows = tableBody.getElementsByTagName('tr');
        searchTerm = searchTerm.toLowerCase();

        for (let row of rows) {
            const nameCell = row.cells[0];
            const name = nameCell.textContent.toLowerCase();
            row.style.display = name.includes(searchTerm) ? '' : 'none';
        }
    }
}

function initializeSearches() {
    console.log('Initializing searches...');
    
    // Initialize main employee search
    const mainEmployeeSearch = document.getElementById('employeeSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (mainEmployeeSearch && searchResults) {
        console.log('Found main search elements, initializing...', {
            searchInput: mainEmployeeSearch,
            searchResults: searchResults
        });
        
        // Remove existing instance if it exists
        if (window.employeeSearch) {
            delete window.employeeSearch;
        }
        
        // Create new instance
        window.employeeSearch = new EmployeeSearch('employeeSearch', 'searchResults');
        
        // Debug: Add test input event
        mainEmployeeSearch.dispatchEvent(new Event('input'));
    } else {
        console.warn('Main search elements not found:', {
            searchInput: !!mainEmployeeSearch,
            searchResults: !!searchResults
        });
    }

    // Initialize assigned to search in task modal
    const assignedToSearch = document.getElementById('assignedTo');
    const assignedToResults = document.getElementById('assignedToResults');
    
    if (assignedToSearch && assignedToResults) {

        if (!window.assignedToSearch) {
            window.assignedToSearch = new EmployeeSearch('assignedTo', 'assignedToResults');
        }
    }
}

// Add event listener for both events
['DOMContentLoaded', 'Employeeloaded', 'contentLoaded'].forEach(eventName => {
    document.addEventListener(eventName, function(e) {

        initializeSearches();
    });
});
