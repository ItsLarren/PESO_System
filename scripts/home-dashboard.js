// Home Dashboard Functionality - FIXED VERSION
class HomeDashboard {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('Initializing Home Dashboard...');
        
        try {
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
            console.log('Home Dashboard initialized successfully');
        } catch (error) {
            console.error('Error initializing Home Dashboard:', error);
            this.showFallbackNotification('Dashboard initialization failed, but core features should work');
        }
    }

    initializeNavigation() {
        console.log('Initializing navigation...');
        
        // Navigation tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            // Remove any existing event listeners by cloning
            const newTab = tab.cloneNode(true);
            if (tab.parentNode) {
                tab.parentNode.replaceChild(newTab, tab);
            }
            
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
            // Remove existing listeners
            const newLogoutBtn = logoutBtn.cloneNode(true);
            if (logoutBtn.parentNode) {
                logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
            }
            
            // Add new listener
            document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        }
        
        console.log('Navigation initialized');
    }

    switchPage(page) {
        console.log('Switching to page:', page);
        
        if (!page) {
            console.error('No page specified for navigation');
            return;
        }
        
        try {
            // Remove active class from all tabs and pages
            document.querySelectorAll('.nav-tab').forEach(tab => {
                if (tab.classList.contains('active')) {
                    tab.classList.remove('active');
                }
            });
            
            document.querySelectorAll('.page-content').forEach(content => {
                if (content.classList.contains('active')) {
                    content.classList.remove('active');
                }
            });

            // Add active class to selected tab and page
            const selectedTab = document.querySelector(`[data-page="${page}"]`);
            const selectedPage = document.getElementById(`${page}-content`);

            if (selectedTab) {
                selectedTab.classList.add('active');
            } else {
                console.warn(`Tab for page ${page} not found`);
            }

            if (selectedPage) {
                selectedPage.classList.add('active');
                // Load page-specific data
                this.loadPageData(page);
            } else {
                console.warn(`Content for page ${page} not found`);
                // Fallback to dashboard if page not found
                this.fallbackToDashboard();
            }
        } catch (error) {
            console.error('Error switching page:', error);
            this.fallbackToDashboard();
        }
    }

    fallbackToDashboard() {
        // Fallback to dashboard if there's an error
        const dashboardTab = document.querySelector('[data-page="dashboard"]');
        const dashboardContent = document.getElementById('dashboard-content');
        
        if (dashboardTab && dashboardContent) {
            dashboardTab.classList.add('active');
            dashboardContent.classList.add('active');
        }
    }

    loadPageData(page) {
        console.log('Loading data for page:', page);
        try {
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
                case 'dashboard':
                    // Refresh dashboard data
                    this.loadDashboardData();
                    break;
            }
        } catch (error) {
            console.error(`Error loading page data for ${page}:`, error);
        }
    }

    initializeApplicantsPage() {
        console.log('Initializing applicants page...');
        
        try {
            // Initialize Zero Unemployment tab
            this.initializeZeroUnemploymentTab();
            
            // Load applicants data
            this.loadApplicantsData();
            
            // Initialize other applicants functionality
            this.initializeApplicantsFunctionality();
        } catch (error) {
            console.error('Error initializing applicants page:', error);
        }
    }

    initializeZeroUnemploymentTab() {
        const zeroUnemploymentTab = document.getElementById('zero-unemployment-tab');
        
        if (zeroUnemploymentTab) {
            console.log('Initializing Zero Unemployment tab...');
            
            try {
                // Clone to remove existing listeners
                const newTab = zeroUnemploymentTab.cloneNode(true);
                if (zeroUnemploymentTab.parentNode) {
                    zeroUnemploymentTab.parentNode.replaceChild(newTab, zeroUnemploymentTab);
                }
                
                // Get current reference
                const currentTab = document.getElementById('zero-unemployment-tab');
                
                if (currentTab) {
                    currentTab.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log('Zero Unemployment tab clicked');
                        
                        // Filter applicants for Zero Unemployment
                        this.filterApplicantsByProgram('Zero Unemployment');
                        
                        // Update active tab styling
                        document.querySelectorAll('.filter-tab').forEach(tab => {
                            if (tab.classList.contains('active')) {
                                tab.classList.remove('active');
                            }
                        });
                        currentTab.classList.add('active');
                        
                        this.showNotification('Showing Zero Unemployment applicants', 'success');
                    });
                }
            } catch (error) {
                console.error('Error initializing Zero Unemployment tab:', error);
            }
        }
    }

    filterApplicantsByProgram(program) {
        console.log(`Filtering by program: ${program}`);
        
        try {
            const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
            const filteredApplicants = applicants.filter(applicant => {
                const programCategory = applicant['PROGRAM CATEGORY'] || applicant['PROGRAM_CATEGORY'] || '';
                return programCategory === program;
            });
            
            console.log(`Found ${filteredApplicants.length} ${program} applicants`);
            this.safeDisplayMainApplicants(filteredApplicants);
        } catch (error) {
            console.error('Error filtering applicants by program:', error);
            this.showNotification('Error filtering applicants', 'error');
        }
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
        
        try {
            // Initialize filter tabs
            this.initializeFilterTabs();
            
            // Initialize search
            this.initializeSearch();
            
            // Initialize other functionality
            this.initializeOtherFunctionality();
        } catch (error) {
            console.error('Error initializing applicants functionality:', error);
        }
    }

    initializeFilterTabs() {
        console.log('Initializing filter tabs...');
        
        const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
        filterTabs.forEach(tab => {
            try {
                // Clone to remove existing listeners
                const newTab = tab.cloneNode(true);
                if (tab.parentNode) {
                    tab.parentNode.replaceChild(newTab, tab);
                }
                
                if (newTab) {
                    newTab.addEventListener('click', () => {
                        const filter = newTab.getAttribute('data-filter');
                        console.log('Filter tab clicked:', filter);
                        
                        // Update active tab styling
                        document.querySelectorAll('.filter-tab').forEach(t => {
                            if (t.classList.contains('active')) {
                                t.classList.remove('active');
                            }
                        });
                        newTab.classList.add('active');
                        
                        // Apply filter
                        this.safeFilterRecords(filter);
                    });
                }
            } catch (error) {
                console.error('Error initializing filter tab:', error);
            }
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
            this.showNotification(`Showing ${filteredApplicants.length} ${filter} applicants`, 'success');
            
        } catch (error) {
            console.error('Error filtering records:', error);
            this.showNotification('Error filtering applicants', 'error');
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
            
            this.showNotification(`Found ${foundCount} matching applicant(s)`, 'success');
            
        } catch (error) {
            console.error('Error searching applicants:', error);
            this.showNotification('Error searching applicants', 'error');
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
        try {
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
        } catch (error) {
            console.error('Error initializing other functionality:', error);
        }
    }

    loadDashboardData() {
        try {
            this.updateLocalStats();
            this.updateQuickStats();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
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
        try {
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
        } catch (error) {
            console.error('Error loading recent activities:', error);
        }
    }

    displayCurrentUser() {
        try {
            const currentUser = localStorage.getItem('currentUser') || 'Admin User';
            const userElement = document.getElementById('current-user');
            if (userElement) {
                userElement.textContent = currentUser;
            }
        } catch (error) {
            console.error('Error displaying current user:', error);
        }
    }

    setupEventListeners() {
        // Additional event listeners can be added here
    }

    logout() {
        try {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error during logout:', error);
            // Fallback: redirect anyway
            window.location.href = 'login.html';
        }
    }

    showNotification(message, type = 'info') {
        try {
            if (typeof showNotification === 'function') {
                showNotification(message, type);
            } else {
                this.showFallbackNotification(message, type);
            }
        } catch (error) {
            console.error('Error showing notification:', error);
            this.showFallbackNotification(message);
        }
    }

    showFallbackNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : type === 'warning' ? '#ff9800' : '#2196F3'};
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
}

// Global navigation function
function navigateToPage(page) {
    if (window.homeDashboard && typeof window.homeDashboard.switchPage === 'function') {
        window.homeDashboard.switchPage(page);
    } else {
        console.error('Home dashboard not available');
        // Fallback navigation
        const targetPage = document.getElementById(`${page}-content`);
        if (targetPage) {
            document.querySelectorAll('.page-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            targetPage.classList.add('active');
            const tab = document.querySelector(`[data-page="${page}"]`);
            if (tab) tab.classList.add('active');
        }
    }
}

// Global function to add test data
function addTestData() {
    try {
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
            }
        ];
        
        const existingApplicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
        const newApplicants = [...existingApplicants, ...testApplicants];
        localStorage.setItem('mainApplicants', JSON.stringify(newApplicants));
        
        console.log('Test data added');
        
        // Use available notification system
        if (window.homeDashboard && typeof window.homeDashboard.showNotification === 'function') {
            window.homeDashboard.showNotification('Test data added successfully', 'success');
        } else if (typeof showNotification === 'function') {
            showNotification('Test data added successfully', 'success');
        }
        
        // Refresh display if on applicants page
        if (window.homeDashboard && document.getElementById('applicants-content')?.classList.contains('active')) {
            window.homeDashboard.loadApplicantsData();
            window.homeDashboard.updateLocalStats();
        }
    } catch (error) {
        console.error('Error adding test data:', error);
    }
}

// Initialize dashboard with error handling
let homeDashboardInitialized = false;

function initializeHomeDashboard() {
    if (!homeDashboardInitialized) {
        try {
            window.homeDashboard = new HomeDashboard();
            homeDashboardInitialized = true;
            console.log('Home Dashboard initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Home Dashboard:', error);
            // Set a flag to prevent repeated initialization attempts
            homeDashboardInitialized = true;
        }
    }
    return window.homeDashboard;
}

// Safe DOM ready initialization
function safeInitialize() {
    try {
        console.log('DOM loaded - initializing dashboard');
        
        // Check authentication first
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }
        
        initializeHomeDashboard();
    } catch (error) {
        console.error('Error during safe initialization:', error);
    }
}

// Multiple initialization strategies
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInitialize);
} else {
    safeInitialize();
}

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HomeDashboard, initializeHomeDashboard, navigateToPage };
}