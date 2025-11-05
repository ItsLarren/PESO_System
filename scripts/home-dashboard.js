// Home Dashboard Functionality
class HomeDashboard {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('Initializing Home Dashboard...');
        this.initializeNavigation();
        this.loadDashboardData();
        this.setupEventListeners();
        this.loadRecentActivities();
        this.displayCurrentUser();
        
        // Initialize applicants page if it's active
        if (document.getElementById('applicants-content')?.classList.contains('active')) {
            this.initializeApplicantsPage();
        }
        
        this.isInitialized = true;
    }

    initializeNavigation() {
        console.log('Initializing navigation...');
        
        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            // Remove any existing event listeners by cloning
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            // Add new event listener to the cloned tab
            newTab.addEventListener('click', () => {
                const page = newTab.getAttribute('data-page');
                console.log('Navigation tab clicked:', page);
                this.switchPage(page);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        console.log('Navigation initialized');
    }

    switchPage(page) {
        console.log('Switching to page:', page);
        
        // Remove active class from all tabs and pages
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.page-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and page
        const selectedTab = document.querySelector(`[data-page="${page}"]`);
        const selectedPage = document.getElementById(`${page}-content`);

        if (selectedTab && selectedPage) {
            selectedTab.classList.add('active');
            selectedPage.classList.add('active');

            // Load page-specific data
            this.loadPageData(page);
        }
    }

    loadPageData(page) {
        console.log('Loading data for page:', page);
        switch(page) {
            case 'applicants':
                this.initializeApplicantsPage();
                break;
            case 'employers':
                console.log('Employers page - coming soon');
                break;
            case 'vacancies':
                console.log('Vacancies page - coming soon');
                break;
            case 'programs':
                console.log('Programs page - coming soon');
                break;
            case 'reports':
                console.log('Reports page - coming soon');
                break;
            case 'tools':
                console.log('Tools page - coming soon');
                break;
            case 'admin':
                console.log('Admin page - coming soon');
                break;
        }
    }

    initializeApplicantsPage() {
        console.log('Initializing applicants page...');
        
        // Initialize Zero Unemployment tab
        this.initializeZeroUnemploymentTab();
        
        // Load applicants data
        this.loadApplicantsData();
        
        // Initialize other applicants functionality
        this.initializeApplicantsFunctionality();
    }

    initializeZeroUnemploymentTab() {
        const zeroUnemploymentTab = document.getElementById('zero-unemployment-tab');
        
        if (zeroUnemploymentTab) {
            console.log('Initializing Zero Unemployment tab...');
            
            // Clone to remove existing listeners
            const newTab = zeroUnemploymentTab.cloneNode(true);
            zeroUnemploymentTab.parentNode.replaceChild(newTab, zeroUnemploymentTab);
            
            // Get current reference
            const currentTab = document.getElementById('zero-unemployment-tab');
            
            currentTab.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Zero Unemployment tab clicked');
                
                // Filter applicants for Zero Unemployment
                this.filterApplicantsByProgram('Zero Unemployment');
                
                // Update active tab styling
                document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
                currentTab.classList.add('active');
                
                showNotification('Showing Zero Unemployment applicants', 'success');
            });
        }
    }

    filterApplicantsByProgram(program) {
        console.log(`Filtering by program: ${program}`);
        
        const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
        const filteredApplicants = applicants.filter(applicant => {
            const programCategory = applicant['PROGRAM CATEGORY'] || applicant['PROGRAM_CATEGORY'] || '';
            return programCategory === program;
        });
        
        console.log(`Found ${filteredApplicants.length} ${program} applicants`);
        this.safeDisplayMainApplicants(filteredApplicants);
    }

    loadApplicantsData() {
        try {
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
            console.log(`Loaded ${savedApplicants.length} applicants from storage`);
            
            if (savedApplicants.length === 0) {
                this.showNoApplicantsMessage();
            } else {
                this.safeDisplayMainApplicants(savedApplicants);
            }
            
        } catch (error) {
            console.error('Error loading applicants data:', error);
            this.showNoApplicantsMessage();
        }
    }

    safeDisplayMainApplicants(applicants) {
        try {
            const table = document.getElementById('main-applicant-table');
            if (!table) {
                console.error('Main applicant table not found');
                return;
            }
            
            const tbody = table.querySelector('tbody');
            if (!tbody) {
                console.error('Table body not found');
                return;
            }
            
            // Clear existing content
            tbody.innerHTML = '';
            
            if (!applicants || applicants.length === 0) {
                this.showNoApplicantsInTable(tbody);
                return;
            }
            
            console.log(`Displaying ${applicants.length} applicants`);
            
            // Create simplified table rows
            applicants.forEach((applicant, index) => {
                const row = document.createElement('tr');
                
                // Basic information columns
                const basicInfo = [
                    applicant['SRS ID'] || `APP-${index + 1}`,
                    applicant['LAST NAME'] || applicant['SURNAME'] || 'N/A',
                    applicant['FIRST NAME'] || 'N/A',
                    applicant['MIDDLE NAME'] || 'N/A',
                    applicant['SUFFIX'] || 'N/A',
                    applicant['DATE OF BIRTH'] || 'N/A',
                    applicant['AGE'] || 'N/A',
                    applicant['SEX'] || 'N/A'
                ];
                
                // Add basic info cells
                basicInfo.forEach(value => {
                    const cell = document.createElement('td');
                    cell.textContent = value;
                    row.appendChild(cell);
                });
                
                // Add placeholder cells for remaining columns
                const totalColumns = 43; // Based on your table header
                for (let i = basicInfo.length; i < totalColumns - 1; i++) {
                    const cell = document.createElement('td');
                    cell.textContent = 'N/A';
                    row.appendChild(cell);
                }
                
                // Actions cell (last column)
                const actionsCell = document.createElement('td');
                actionsCell.className = 'actions-cell';
                actionsCell.innerHTML = `
                    <div class="action-buttons">
                        <button class="view-btn" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="edit-btn" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="download-btn" title="Download">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="delete-btn" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                row.appendChild(actionsCell);
                tbody.appendChild(row);
            });
            
        } catch (error) {
            console.error('Error displaying applicants:', error);
            this.showNoApplicantsMessage();
        }
    }

    showNoApplicantsInTable(tbody) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 43;
        cell.className = 'no-results';
        cell.textContent = 'No applicants found';
        cell.style.padding = '20px';
        cell.style.textAlign = 'center';
        cell.style.color = '#666';
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    showNoApplicantsMessage() {
        const table = document.getElementById('main-applicant-table');
        if (table) {
            const tbody = table.querySelector('tbody');
            if (tbody) {
                this.showNoApplicantsInTable(tbody);
            }
        }
    }

    initializeApplicantsFunctionality() {
        console.log('Initializing applicants functionality...');
        
        // Initialize filter tabs
        this.initializeFilterTabs();
        
        // Initialize search
        this.initializeSearch();
        
        // Initialize other functionality
        this.initializeOtherFunctionality();
    }

    initializeFilterTabs() {
        console.log('Initializing filter tabs...');
        
        const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
        filterTabs.forEach(tab => {
            // Clone to remove existing listeners
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            newTab.addEventListener('click', () => {
                const filter = newTab.getAttribute('data-filter');
                console.log('Filter tab clicked:', filter);
                
                // Update active tab styling
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                newTab.classList.add('active');
                
                // Apply filter
                this.safeFilterRecords(filter);
            });
        });
    }

    safeFilterRecords(filter) {
        try {
            console.log('Filtering records by:', filter);
            
            const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
            let filteredApplicants = [];
            
            switch(filter) {
                case 'employed':
                    filteredApplicants = applicants.filter(applicant => {
                        const empStatus = (applicant['EMP. STATUS'] || applicant['EMPLOYMENT STATUS'] || '').toString().toLowerCase();
                        return empStatus.includes('employ') && !empStatus.includes('unemploy');
                    });
                    break;
                    
                case 'unemployed':
                    filteredApplicants = applicants.filter(applicant => {
                        const empStatus = (applicant['EMP. STATUS'] || applicant['EMPLOYMENT STATUS'] || '').toString().toLowerCase();
                        return empStatus.includes('unemploy');
                    });
                    break;
                    
                case 'all':
                default:
                    filteredApplicants = applicants;
                    break;
            }
            
            console.log(`Found ${filteredApplicants.length} ${filter} applicants`);
            this.safeDisplayMainApplicants(filteredApplicants);
            showNotification(`Showing ${filteredApplicants.length} ${filter} applicants`, 'success');
            
        } catch (error) {
            console.error('Error filtering records:', error);
            showNotification('Error filtering applicants', 'error');
        }
    }

    initializeSearch() {
        const searchBtn = document.getElementById('search-btn');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        const searchInput = document.getElementById('search-input');
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.safeSearchApplicants());
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => this.safeClearSearch());
        }
        
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.safeSearchApplicants();
                }
            });
        }
    }

    safeSearchApplicants() {
        try {
            const searchInput = document.getElementById('search-input');
            if (!searchInput) return;
            
            const searchTerm = searchInput.value.toLowerCase().trim();
            const table = document.getElementById('main-applicant-table');
            if (!table) return;
            
            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr');
            let foundCount = 0;
            
            if (!searchTerm) {
                this.safeClearSearch();
                return;
            }
            
            rows.forEach(row => {
                if (row.querySelector('.no-results')) {
                    row.style.display = 'none';
                    return;
                }
                
                const cells = row.querySelectorAll('td');
                let found = false;

                cells.forEach(cell => {
                    if (cell.textContent.toLowerCase().includes(searchTerm)) {
                        found = true;
                    }
                });
                
                if (found) {
                    row.style.display = '';
                    foundCount++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            showNotification(`Found ${foundCount} matching applicant(s)`, 'success');
            
        } catch (error) {
            console.error('Error searching applicants:', error);
            showNotification('Error searching applicants', 'error');
        }
    }

    safeClearSearch() {
        try {
            const searchInput = document.getElementById('search-input');
            const table = document.getElementById('main-applicant-table');
            
            if (searchInput) searchInput.value = '';
            if (!table) return;
            
            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                row.style.display = '';
            });
            
        } catch (error) {
            console.error('Error clearing search:', error);
        }
    }

    initializeOtherFunctionality() {
        // Initialize advanced filters button
        const advancedFiltersBtn = document.getElementById('advanced-filters-btn');
        if (advancedFiltersBtn) {
            advancedFiltersBtn.addEventListener('click', () => {
                const filtersPanel = document.getElementById('advanced-filters-panel');
                if (filtersPanel) {
                    filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
        
        // Initialize manual add button
        const addManualBtn = document.getElementById('add-manual-btn');
        if (addManualBtn) {
            addManualBtn.addEventListener('click', () => {
                console.log('Add manual button clicked');
                // Your manual add functionality here
            });
        }
    }

    loadDashboardData() {
        this.updateLocalStats();
        this.updateQuickStats();
    }

    updateLocalStats() {
        try {
            const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
            
            // Update stats elements if they exist
            const updateElement = (id, value) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            };
            
            updateElement('total-applicants', applicants.length);
            updateElement('quick-applicants', applicants.length);
            
            // Calculate other stats
            const employedCount = applicants.filter(app => {
                const empStatus = (app['EMP. STATUS'] || '').toString().toLowerCase();
                return empStatus.includes('employ') && !empStatus.includes('unemploy');
            }).length;
            
            const unemployedCount = applicants.filter(app => {
                const empStatus = (app['EMP. STATUS'] || '').toString().toLowerCase();
                return empStatus.includes('unemploy');
            }).length;
            
            updateElement('employed-applicants', employedCount);
            updateElement('unemployed-applicants', unemployedCount);
            
        } catch (error) {
            console.error('Error updating local stats:', error);
        }
    }

    updateQuickStats() {
        // Similar to updateLocalStats but for quick stats
        this.updateLocalStats(); // Reuse for now
    }

    loadRecentActivities() {
        const activitiesContainer = document.getElementById('recent-activities');
        if (activitiesContainer) {
            activitiesContainer.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon applicant">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">System Ready</div>
                        <div class="activity-description">CPESO System initialized successfully</div>
                        <div class="activity-time">Just now</div>
                    </div>
                </div>
            `;
        }
    }

    displayCurrentUser() {
        const currentUser = localStorage.getItem('currentUser') || 'Admin User';
        const userElement = document.getElementById('current-user');
        if (userElement) {
            userElement.textContent = currentUser;
        }
    }

    setupEventListeners() {
        // Additional event listeners can be added here
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Global navigation function
function navigateToPage(page) {
    if (window.homeDashboard) {
        window.homeDashboard.switchPage(page);
    }
}

// Global function to add test data
function addTestData() {
    const testApplicants = [
        {
            'SRS ID': 'TEST001',
            'LAST NAME': 'Dela Cruz',
            'FIRST NAME': 'Juan',
            'MIDDLE NAME': 'Santos',
            'SUFFIX': 'Jr.',
            'DATE OF BIRTH': '1990-05-15',
            'AGE': '33',
            'SEX': 'Male',
            'EMP. STATUS': 'Employed',
            'PROGRAM CATEGORY': 'Employment Assistance'
        },
        {
            'SRS ID': 'TEST002',
            'LAST NAME': 'Reyes',
            'FIRST NAME': 'Maria',
            'MIDDLE NAME': 'Garcia',
            'SUFFIX': '',
            'DATE OF BIRTH': '1985-08-20',
            'AGE': '38',
            'SEX': 'Female',
            'EMP. STATUS': 'Unemployed',
            'PROGRAM CATEGORY': 'Zero Unemployment'
        },
        {
            'SRS ID': 'TEST003',
            'LAST NAME': 'Santos',
            'FIRST NAME': 'Pedro',
            'MIDDLE NAME': 'Lopez',
            'SUFFIX': '',
            'DATE OF BIRTH': '1995-12-10',
            'AGE': '28',
            'SEX': 'Male',
            'EMP. STATUS': 'Self-Employed',
            'PROGRAM CATEGORY': 'Livelihood Program'
        }
    ];
    
    const existingApplicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    const newApplicants = [...existingApplicants, ...testApplicants];
    localStorage.setItem('mainApplicants', JSON.stringify(newApplicants));
    
    console.log('Test data added');
    showNotification('Test data added successfully', 'success');
    
    // Refresh display if on applicants page
    if (window.homeDashboard && document.getElementById('applicants-content')?.classList.contains('active')) {
        window.homeDashboard.loadApplicantsData();
        window.homeDashboard.updateLocalStats();
    }
}

// Initialize dashboard
let homeDashboardInitialized = false;

function initializeHomeDashboard() {
    if (!homeDashboardInitialized) {
        window.homeDashboard = new HomeDashboard();
        homeDashboardInitialized = true;
    }
    return window.homeDashboard;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing dashboard');
    initializeHomeDashboard();
});

// Utility function for notifications
function showNotification(message, type = 'info') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function lazyLoadTableData(applicants, chunkSize = 50) {
    let currentIndex = 0;
    
    function loadNextChunk() {
        const chunk = applicants.slice(currentIndex, currentIndex + chunkSize);
        displayApplicantsChunk(chunk);
        currentIndex += chunkSize;
        
        if (currentIndex < applicants.length) {
            setTimeout(loadNextChunk, 100);
        }
    }
    
    loadNextChunk();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Usage
elements.searchInput.addEventListener('input', debounce(searchApplicants, 300));

function withErrorHandling(fn, errorMessage) {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(`${errorMessage}:`, error);
            showNotification(errorMessage, 'error');
            return null;
        }
    };
}

// Usage
const safeAddApplicant = withErrorHandling(addManualApplicant, 'Failed to add applicant');