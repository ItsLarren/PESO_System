// Home Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDashboard();
    initializeFilterTabs();
});

// Navigation System
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const pageContents = document.querySelectorAll('.page-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pageContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetPage}-content`) {
                    content.classList.add('active');
                }
            });
            
            // Load data for the page if needed
            loadPageData(targetPage);
        });
    });
}

// Dashboard initialization
function initializeDashboard() {
    loadDashboardStats();
    loadRecentActivity();
}

// Load dashboard statistics
function loadDashboardStats() {
    // Load quick stats
    const applicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
    const employers = JSON.parse(localStorage.getItem('employers')) || [];
    const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
    
    // Update quick stats
    document.getElementById('quick-applicants').textContent = applicants.length;
    document.getElementById('quick-employers').textContent = employers.length;
    document.getElementById('quick-vacancies').textContent = vacancies.length;
    
    // Update local stats
    document.getElementById('total-applicants').textContent = applicants.length;
    document.getElementById('total-employers').textContent = employers.length;
    document.getElementById('active-vacancies').textContent = vacancies.length;
    document.getElementById('job-matches').textContent = '0'; // You can calculate this
    
    // Calculate additional stats
    const employedApplicants = applicants.filter(app => 
        app['EMP. STATUS'] && app['EMP. STATUS'].toLowerCase().includes('employed')
    ).length;
    
    const unemployedApplicants = applicants.filter(app => 
        app['EMP. STATUS'] && app['EMP. STATUS'].toLowerCase().includes('unemployed')
    ).length;
    
    document.getElementById('employed-applicants').textContent = employedApplicants;
    document.getElementById('unemployed-applicants').textContent = unemployedApplicants;
    document.getElementById('new-applicants-month').textContent = calculateNewThisMonth(applicants);
}

// Calculate new applicants this month
function calculateNewThisMonth(applicants) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return applicants.filter(applicant => {
        if (!applicant['DATE CREATED']) return false;
        
        const createdDate = new Date(applicant['DATE CREATED']);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
    }).length;
}

// Load recent activity
function loadRecentActivity() {
    const activities = [
        { action: 'New applicant registered', time: '2 hours ago', user: 'System' },
        { action: 'Employer account created', time: '4 hours ago', user: 'Admin' },
        { action: 'Job vacancy posted', time: '1 day ago', user: 'Employer' },
        { action: 'Program completed', time: '2 days ago', user: 'System' }
    ];
    
    const activityList = document.getElementById('recent-activities');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-content">
                    <strong>${activity.action}</strong>
                    <span class="activity-time">${activity.time}</span>
                </div>
                <div class="activity-user">by ${activity.user}</div>
            </div>
        `).join('');
    }
}

// Initialize filter tabs
function initializeFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const container = this.closest('.card');
            const tabs = container.querySelectorAll('.filter-tab');
            const filter = this.getAttribute('data-filter');
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Apply filter to table
            filterTable(container, filter);
        });
    });
}

// Filter table based on selected tab
function filterTable(container, filter) {
    const table = container.querySelector('table');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        if (filter === 'employed') {
            // Filter for employed applicants
            const statusCell = row.querySelector('td:nth-child(23)'); // Adjust index based on your table structure
            if (statusCell && !statusCell.textContent.toLowerCase().includes('employed')) {
                showRow = false;
            }
        } else if (filter === 'unemployed') {
            // Filter for unemployed applicants
            const statusCell = row.querySelector('td:nth-child(23)');
            if (statusCell && !statusCell.textContent.toLowerCase().includes('unemployed')) {
                showRow = false;
            }
        }
        // Add more filter conditions as needed
        
        row.style.display = showRow ? '' : 'none';
    });
}

// Load page-specific data
function loadPageData(page) {
    switch(page) {
        case 'applicants':
            // Your existing applicant loading logic
            break;
        case 'employers':
            loadEmployersData();
            break;
        case 'vacancies':
            loadVacanciesData();
            break;
        case 'programs':
            loadProgramsData();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

// Navigation function for quick actions
function navigateToPage(page) {
    const tab = document.querySelector(`.nav-tab[data-page="${page}"]`);
    if (tab) {
        tab.click();
    }
}

// Zero Unemployment Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    const zeroUnemploymentTab = document.getElementById('zero-unemployment-tab');
    if (zeroUnemploymentTab) {
        zeroUnemploymentTab.addEventListener('click', function() {
            // Implement zero unemployment filtering logic
            filterZeroUnemploymentApplicants();
        });
    }
});

function filterZeroUnemploymentApplicants() {
    // Implement your zero unemployment filtering logic here
    const applicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
    
    // Example: Filter applicants who are part of zero unemployment programs
    const zeroUnemploymentApplicants = applicants.filter(applicant => 
        applicant['PROGRAM CATEGORY'] && 
        applicant['PROGRAM CATEGORY'].includes('Zero Unemployment')
    );
    
    // Update the table display
    displayFilteredApplicants(zeroUnemploymentApplicants);
}

// Load employers data
function loadEmployersData() {
    const employers = JSON.parse(localStorage.getItem('employers')) || [];
    displayEmployersTable(employers);
}

// Load vacancies data
function loadVacanciesData() {
    const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
    displayVacanciesTable(vacancies);
}

// Load programs data
function loadProgramsData() {
    const programs = JSON.parse(localStorage.getItem('programs')) || [];
    displayProgramsTable(programs);
}

// Display functions for each module (you'll need to implement these)
function displayEmployersTable(employers) {
    const tbody = document.querySelector('#employers-table tbody');
    if (!tbody) return;
    
    // Implementation similar to your applicant table display
}

function displayVacanciesTable(vacancies) {
    const tbody = document.querySelector('#vacancies-table tbody');
    if (!tbody) return;
    
    // Implementation similar to your applicant table display
}

function displayProgramsTable(programs) {
    const tbody = document.querySelector('#programs-table tbody');
    if (!tbody) return;
    
    // Implementation similar to your applicant table display
}