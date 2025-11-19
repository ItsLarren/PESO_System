// scripts/script.js - Complete Updated Version
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all modules
    initializeNavigation();
    initializeDashboard();
    initializeApplicantsModule();
    initializeEmployersModule();
    initializeVacanciesModule();
    initializeProgramsModule();
    initializeReportsModule();
    initializeAuth();
    
    console.log('🚀 CPESO System Initialized Successfully');
});

// Navigation Management
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            switchPage(targetPage);
        });
    });
}

function switchPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show target page and activate tab
    document.getElementById(`${pageId}-content`).classList.add('active');
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Load page-specific data
    loadPageData(pageId);
}

function loadPageData(pageId) {
    switch(pageId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'applicants':
            loadApplicantsData();
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

// Authentication Management
function initializeAuth() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Check authentication status
    checkAuthStatus();
}

function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }
    
    // Display current user
    const userElement = document.getElementById('current-user');
    if (userElement && currentUser) {
        userElement.textContent = currentUser;
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Dashboard Module
function initializeDashboard() {
    // Dashboard will be initialized when page loads
}

function loadDashboardData() {
    updateDashboardStats();
    loadRecentActivity();
}

function updateDashboardStats() {
    // Applicants count
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    document.getElementById('quick-applicants').textContent = applicants.length;
    document.getElementById('total-applicants').textContent = applicants.length;
    
    // Employers count
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    document.getElementById('quick-employers').textContent = employers.length;
    document.getElementById('total-employers').textContent = employers.length;
    
    // Vacancies count
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    const activeVacancies = vacancies.filter(v => v.STATUS === 'Active').length;
    document.getElementById('quick-vacancies').textContent = activeVacancies;
    document.getElementById('active-vacancies').textContent = activeVacancies;
    
    // Calculate additional stats
    calculateAdditionalStats(applicants, employers, vacancies);
}

function calculateAdditionalStats(applicants, employers, vacancies) {
    // Employment status
    const employed = applicants.filter(a => 
        a['EMPLOYMENT STATUS/TYPE'] && 
        a['EMPLOYMENT STATUS/TYPE'].toLowerCase().includes('employ') &&
        !a['EMPLOYMENT STATUS/TYPE'].toLowerCase().includes('unemploy')
    ).length;
    
    const unemployed = applicants.filter(a => 
        a['EMPLOYMENT STATUS/TYPE'] && 
        a['EMPLOYMENT STATUS/TYPE'].toLowerCase().includes('unemploy')
    ).length;
    
    document.getElementById('employed-applicants').textContent = employed;
    document.getElementById('unemployed-applicants').textContent = unemployed;
    
    // Monthly new applicants
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newThisMonth = applicants.filter(applicant => {
        const regDate = new Date(applicant['REG. DATE'] || applicant['DATE CREATED']);
        return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
    }).length;
    
    document.getElementById('new-applicants-month').textContent = newThisMonth;
    
    // Job matches (simplified calculation)
    const jobMatches = Math.min(applicants.length, vacancies.length * 3);
    document.getElementById('job-matches').textContent = jobMatches;
}

function loadRecentActivity() {
    const activities = [
        { action: 'New applicant registered', user: 'System', time: '2 minutes ago' },
        { action: 'Job vacancy posted', user: 'Admin', time: '1 hour ago' },
        { action: 'Employer account created', user: 'System', time: '3 hours ago' },
        { action: 'Program enrollment completed', user: 'Staff', time: '5 hours ago' }
    ];
    
    const activityList = document.getElementById('recent-activities');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-content">
                    <strong>${activity.action}</strong>
                    <span>by ${activity.user}</span>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `).join('');
    }
}

// Applicants Module
function initializeApplicantsModule() {
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => searchApplicants());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchApplicants();
        });
    }
    
    // Clear search
    const clearSearchBtn = document.getElementById('clear-search-btn');
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearApplicantSearch);
    }
    
    // Export functionality
    const exportBtn = document.getElementById('export-applicants-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportApplicantsToExcel);
    }
    
    // Clear all applicants
    const clearAllBtn = document.getElementById('clear-all-applicants-btn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', clearAllApplicants);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('#applicants-content .filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterApplicants(filter);
        });
    });
    
    // Zero Unemployment tab
    const zeroUnemploymentTab = document.getElementById('zero-unemployment-tab');
    if (zeroUnemploymentTab) {
        zeroUnemploymentTab.addEventListener('click', function(e) {
            e.preventDefault();
            filterApplicants('zero-unemployment');
        });
    }
}

function loadApplicantsData() {
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    displayApplicantsTable(applicants);
}

function displayApplicantsTable(applicants) {
    const tbody = document.querySelector('#main-applicant-table tbody');
    if (!tbody) return;
    
    if (applicants.length === 0) {
        tbody.innerHTML = '<tr><td colspan="44" class="no-results">No applicants found</td></tr>';
        return;
    }
    
    tbody.innerHTML = applicants.map((applicant, index) => `
        <tr>
            <td>${applicant['SRS ID'] || `APP-${index + 1}`}</td>
            <td>${applicant['LAST NAME'] || applicant['SURNAME'] || 'N/A'}</td>
            <td>${applicant['FIRST NAME'] || 'N/A'}</td>
            <td>${applicant['MIDDLE NAME'] || 'N/A'}</td>
            <td>${applicant['SUFFIX'] || 'N/A'}</td>
            <td>${applicant['DATE OF BIRTH'] || applicant['BDATE'] || 'N/A'}</td>
            <td>${applicant['PLACE OF BIRTH'] || 'N/A'}</td>
            <td>${applicant['HOUSE NO./STREET/VILLAGE'] || applicant['STREET ADDRESS'] || 'N/A'}</td>
            <td>${applicant['BARANGAY'] || 'N/A'}</td>
            <td>${applicant['MUNICIPALITY/CITY'] || applicant['CITY/MUNICIPALITY'] || 'N/A'}</td>
            <td>${applicant['PROVINCE'] || 'N/A'}</td>
            <td>${applicant['SEX'] || 'N/A'}</td>
            <td>${applicant['CIVIL STATUS'] || 'N/A'}</td>
            <td>${applicant['TIN'] || 'N/A'}</td>
            <td>${applicant['GSIS/SSS NO.'] || 'N/A'}</td>
            <td>${applicant['PAGIBIG NO.'] || 'N/A'}</td>
            <td>${applicant['PHILHEALTH NO.'] || 'N/A'}</td>
            <td>${applicant['HEIGHT'] || 'N/A'}</td>
            <td>${applicant['EMAIL ADDRESS'] || applicant['EMAIL'] || 'N/A'}</td>
            <td>${applicant['LANDLINE NUMBER'] || applicant['TELEPHONE'] || 'N/A'}</td>
            <td>${applicant['CELLPHONE NUMBER'] || applicant['CELLPHONE'] || 'N/A'}</td>
            <td>${applicant['DISABILITY'] || 'N/A'}</td>
            <td>${applicant['EMPLOYMENT STATUS/TYPE'] || applicant['EMP. STATUS'] || 'N/A'}</td>
            <td>${applicant['ARE YOU ACTIVELY LOOKING FOR WORK?'] || 'N/A'}</td>
            <td>${applicant['WILLING TO WORK IMMEDIATELY?'] || 'N/A'}</td>
            <td>${applicant['ARE YOU A 4PS BENEFICIARY?'] || applicant['4Ps'] || 'N/A'}</td>
            <td>${applicant['PREFERRED OCCUPATION'] || applicant['PREFERRED POSITION'] || 'N/A'}</td>
            <td>${applicant['PREFERRED WORK LOCATION'] || 'N/A'}</td>
            <td>${applicant['EXPECTED SALARY'] || 'N/A'}</td>
            <td>${applicant['PASSPORT NO.'] || 'N/A'}</td>
            <td>${applicant['PASSPORT EXPIRY DATE'] || 'N/A'}</td>
            <td>${applicant['LANGUAGE'] || 'N/A'}</td>
            <td>${applicant['ELEMENTARY'] || 'N/A'}</td>
            <td>${applicant['SECONDARY'] || 'N/A'}</td>
            <td>${applicant['TERTIARY'] || 'N/A'}</td>
            <td>${applicant['GRADUATE STUDIES'] || 'N/A'}</td>
            <td>${applicant['TECHNICAL/VOCATIONAL AND OTHER TRAINING'] || 'N/A'}</td>
            <td>${applicant['ELIGIBILITY'] || 'N/A'}</td>
            <td>${applicant['WORK EXPERIENCE'] || 'N/A'}</td>
            <td>${applicant['OTHER SKILLS'] || applicant['SKILLS'] || 'N/A'}</td>
            <td>${applicant['PROGRAM CATEGORY'] || 'N/A'}</td>
            <td>${applicant['SPECIFIC PROGRAM'] || 'N/A'}</td>
            <td>${applicant['PROGRAM STATUS'] || 'N/A'}</td>
            <td class="actions-cell">
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewApplicant('${applicant['SRS ID']}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="editApplicant('${applicant['SRS ID']}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="download-btn" onclick="downloadApplicantData(${index})" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteApplicant('${applicant['SRS ID']}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchApplicants() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    
    if (!searchTerm) {
        displayApplicantsTable(applicants);
        return;
    }
    
    const filtered = applicants.filter(applicant => 
        Object.values(applicant).some(value => 
            value && value.toString().toLowerCase().includes(searchTerm)
        )
    );
    
    displayApplicantsTable(filtered);
    showNotification(`Found ${filtered.length} matching applicant(s)`, 'success');
}

function clearApplicantSearch() {
    document.getElementById('search-input').value = '';
    loadApplicantsData();
}

function filterApplicants(filter) {
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    let filtered = [];
    
    switch(filter) {
        case 'employed':
            filtered = applicants.filter(a => 
                a['EMPLOYMENT STATUS/TYPE'] && 
                a['EMPLOYMENT STATUS/TYPE'].toLowerCase().includes('employ') &&
                !a['EMPLOYMENT STATUS/TYPE'].toLowerCase().includes('unemploy')
            );
            break;
        case 'unemployed':
            filtered = applicants.filter(a => 
                a['EMPLOYMENT STATUS/TYPE'] && 
                a['EMPLOYMENT STATUS/TYPE'].toLowerCase().includes('unemploy')
            );
            break;
        case 'zero-unemployment':
            filtered = applicants.filter(a => 
                a['PROGRAM CATEGORY'] === 'Zero Unemployment'
            );
            break;
        default:
            filtered = applicants;
    }
    
    displayApplicantsTable(filtered);
    
    // Update active filter tab
    document.querySelectorAll('#applicants-content .filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

function exportApplicantsToExcel() {
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    
    if (applicants.length === 0) {
        showNotification('No applicants to export', 'error');
        return;
    }
    
    try {
        // Simplified export - you can enhance this with SheetJS
        const csvContent = convertToCSV(applicants);
        downloadCSV(csvContent, 'applicants_export.csv');
        showNotification('Applicants exported successfully', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting applicants', 'error');
    }
}

function clearAllApplicants() {
    if (confirm('Are you sure you want to clear ALL applicants? This action cannot be undone.')) {
        localStorage.removeItem('mainApplicants');
        loadApplicantsData();
        showNotification('All applicants cleared successfully', 'success');
    }
}

// Employers Module
function initializeEmployersModule() {
    // Search functionality
    const searchBtn = document.getElementById('employer-search-btn');
    const searchInput = document.getElementById('employer-search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => searchEmployers());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchEmployers();
        });
    }
    
    // Export functionality
    const exportBtn = document.getElementById('export-employers-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportEmployersToExcel);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('#employers-content .filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterEmployers(filter);
        });
    });
}

function loadEmployersData() {
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    displayEmployersTable(employers);
}

function displayEmployersTable(employers) {
    const tbody = document.querySelector('#employers-table tbody');
    if (!tbody) return;
    
    if (employers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="21" class="no-results">No employers found</td></tr>';
        return;
    }
    
    tbody.innerHTML = employers.map((employer, index) => `
        <tr>
            <td>${employer['EMPLOYER ID'] || `EMP-${index + 1}`}</td>
            <td>${employer['COMPANY NAME'] || 'N/A'}</td>
            <td>${employer['COMPANY TYPE'] || 'N/A'}</td>
            <td>${employer['INDUSTRY'] || 'N/A'}</td>
            <td>${employer['CONTACT PERSON'] || 'N/A'}</td>
            <td>${employer['CONTACT POSITION'] || 'N/A'}</td>
            <td>${employer['EMAIL'] || 'N/A'}</td>
            <td>${employer['PHONE'] || 'N/A'}</td>
            <td>${employer['ADDRESS'] || 'N/A'}</td>
            <td>${employer['BARANGAY'] || 'N/A'}</td>
            <td>${employer['CITY/MUNICIPALITY'] || 'N/A'}</td>
            <td>${employer['PROVINCE'] || 'N/A'}</td>
            <td>${employer['BUSINESS PERMIT NO.'] || 'N/A'}</td>
            <td>${employer['BUSINESS PERMIT EXPIRY'] || 'N/A'}</td>
            <td>${employer['NUMBER OF EMPLOYEES'] || 'N/A'}</td>
            <td>${employer['YEAR ESTABLISHED'] || 'N/A'}</td>
            <td>${employer['WEBSITE'] || 'N/A'}</td>
            <td>${employer['STATUS'] || 'Active'}</td>
            <td>${employer['REGISTRATION DATE'] || 'N/A'}</td>
            <td>${employer['LAST ACTIVE'] || 'N/A'}</td>
            <td class="actions-cell">
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewEmployer('${employer['EMPLOYER ID']}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="editEmployer('${employer['EMPLOYER ID']}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteEmployer('${employer['EMPLOYER ID']}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchEmployers() {
    const searchTerm = document.getElementById('employer-search-input').value.toLowerCase();
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    
    if (!searchTerm) {
        displayEmployersTable(employers);
        return;
    }
    
    const filtered = employers.filter(employer => 
        Object.values(employer).some(value => 
            value && value.toString().toLowerCase().includes(searchTerm)
        )
    );
    
    displayEmployersTable(filtered);
    showNotification(`Found ${filtered.length} matching employer(s)`, 'success');
}

function filterEmployers(filter) {
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    let filtered = [];
    
    switch(filter) {
        case 'local':
            filtered = employers.filter(e => e['COMPANY TYPE'] === 'Local');
            break;
        case 'overseas':
            filtered = employers.filter(e => e['COMPANY TYPE'] === 'Overseas');
            break;
        case 'active':
            filtered = employers.filter(e => e['STATUS'] === 'Active');
            break;
        default:
            filtered = employers;
    }
    
    displayEmployersTable(filtered);
    
    // Update active filter tab
    document.querySelectorAll('#employers-content .filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

function exportEmployersToExcel() {
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    
    if (employers.length === 0) {
        showNotification('No employers to export', 'error');
        return;
    }
    
    try {
        const csvContent = convertToCSV(employers);
        downloadCSV(csvContent, 'employers_export.csv');
        showNotification('Employers exported successfully', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting employers', 'error');
    }
}

// Vacancies Module
function initializeVacanciesModule() {
    // Search functionality
    const searchBtn = document.getElementById('vacancy-search-btn');
    const searchInput = document.getElementById('vacancy-search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => searchVacancies());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchVacancies();
        });
    }
    
    // Export functionality
    const exportBtn = document.getElementById('export-vacancies-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportVacanciesToExcel);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('#vacancies-content .filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterVacancies(filter);
        });
    });
}

function loadVacanciesData() {
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    displayVacanciesTable(vacancies);
}

function displayVacanciesTable(vacancies) {
    const tbody = document.querySelector('#vacancies-table tbody');
    if (!tbody) return;
    
    if (vacancies.length === 0) {
        tbody.innerHTML = '<tr><td colspan="20" class="no-results">No vacancies found</td></tr>';
        return;
    }
    
    tbody.innerHTML = vacancies.map((vacancy, index) => `
        <tr>
            <td>${vacancy['VACANCY ID'] || `VAC-${index + 1}`}</td>
            <td>${vacancy['JOB TITLE'] || 'N/A'}</td>
            <td>${vacancy['EMPLOYER'] || 'N/A'}</td>
            <td>${vacancy['INDUSTRY'] || 'N/A'}</td>
            <td>${vacancy['JOB TYPE'] || 'N/A'}</td>
            <td>${vacancy['SALARY RANGE'] || 'N/A'}</td>
            <td>${vacancy['WORK LOCATION'] || 'N/A'}</td>
            <td>${vacancy['EDUCATION REQUIREMENT'] || 'N/A'}</td>
            <td>${vacancy['EXPERIENCE REQUIREMENT'] || 'N/A'}</td>
            <td>${vacancy['SKILLS REQUIRED'] || 'N/A'}</td>
            <td>${vacancy['JOB DESCRIPTION'] || 'N/A'}</td>
            <td>${vacancy['RESPONSIBILITIES'] || 'N/A'}</td>
            <td>${vacancy['BENEFITS'] || 'N/A'}</td>
            <td>${vacancy['VACANCY COUNT'] || '1'}</td>
            <td>${vacancy['APPLICATION DEADLINE'] || 'N/A'}</td>
            <td>${vacancy['DATE POSTED'] || 'N/A'}</td>
            <td>${vacancy['STATUS'] || 'Active'}</td>
            <td>${vacancy['APPLICATION COUNT'] || '0'}</td>
            <td>${vacancy['VIEWS'] || '0'}</td>
            <td class="actions-cell">
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewVacancy('${vacancy['VACANCY ID']}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="editVacancy('${vacancy['VACANCY ID']}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteVacancy('${vacancy['VACANCY ID']}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchVacancies() {
    const searchTerm = document.getElementById('vacancy-search-input').value.toLowerCase();
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    
    if (!searchTerm) {
        displayVacanciesTable(vacancies);
        return;
    }
    
    const filtered = vacancies.filter(vacancy => 
        Object.values(vacancy).some(value => 
            value && value.toString().toLowerCase().includes(searchTerm)
        )
    );
    
    displayVacanciesTable(filtered);
    showNotification(`Found ${filtered.length} matching vacancy(s)`, 'success');
}

function filterVacancies(filter) {
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    let filtered = [];
    
    switch(filter) {
        case 'active':
            filtered = vacancies.filter(v => v['STATUS'] === 'Active');
            break;
        case 'filled':
            filtered = vacancies.filter(v => v['STATUS'] === 'Filled');
            break;
        case 'expired':
            filtered = vacancies.filter(v => v['STATUS'] === 'Expired');
            break;
        default:
            filtered = vacancies;
    }
    
    displayVacanciesTable(filtered);
    
    // Update active filter tab
    document.querySelectorAll('#vacancies-content .filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

function exportVacanciesToExcel() {
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    
    if (vacancies.length === 0) {
        showNotification('No vacancies to export', 'error');
        return;
    }
    
    try {
        const csvContent = convertToCSV(vacancies);
        downloadCSV(csvContent, 'vacancies_export.csv');
        showNotification('Vacancies exported successfully', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting vacancies', 'error');
    }
}

// Programs Module
function initializeProgramsModule() {
    // Search functionality
    const searchBtn = document.getElementById('program-search-btn');
    const searchInput = document.getElementById('program-search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => searchPrograms());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchPrograms();
        });
    }
    
    // Export functionality
    const exportBtn = document.getElementById('export-programs-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportProgramsToExcel);
    }
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('#programs-content .filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterPrograms(filter);
        });
    });
}

function loadProgramsData() {
    const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
    displayProgramsTable(programs);
}

function displayProgramsTable(programs) {
    const tbody = document.querySelector('#programs-table tbody');
    if (!tbody) return;
    
    if (programs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="21" class="no-results">No programs found</td></tr>';
        return;
    }
    
    tbody.innerHTML = programs.map((program, index) => `
        <tr>
            <td>${program['PROGRAM ID'] || `PROG-${index + 1}`}</td>
            <td>${program['PROGRAM NAME'] || 'N/A'}</td>
            <td>${program['PROGRAM CATEGORY'] || 'N/A'}</td>
            <td>${program['PROGRAM TYPE'] || 'N/A'}</td>
            <td>${program['TARGET BENEFICIARIES'] || 'N/A'}</td>
            <td>${program['PROGRAM DESCRIPTION'] || 'N/A'}</td>
            <td>${program['OBJECTIVES'] || 'N/A'}</td>
            <td>${program['ELIGIBILITY CRITERIA'] || 'N/A'}</td>
            <td>${program['BENEFITS PROVIDED'] || 'N/A'}</td>
            <td>${program['DURATION'] || 'N/A'}</td>
            <td>${program['START DATE'] || 'N/A'}</td>
            <td>${program['END DATE'] || 'N/A'}</td>
            <td>${program['BUDGET ALLOCATED'] || 'N/A'}</td>
            <td>${program['BUDGET UTILIZED'] || 'N/A'}</td>
            <td>${program['PARTNER AGENCIES'] || 'N/A'}</td>
            <td>${program['PROGRAM COORDINATOR'] || 'N/A'}</td>
            <td>${program['CONTACT INFORMATION'] || 'N/A'}</td>
            <td>${program['STATUS'] || 'Active'}</td>
            <td>${program['PARTICIPANT COUNT'] || '0'}</td>
            <td>${program['SUCCESS RATE'] || 'N/A'}</td>
            <td class="actions-cell">
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewProgram('${program['PROGRAM ID']}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="editProgram('${program['PROGRAM ID']}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProgram('${program['PROGRAM ID']}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function searchPrograms() {
    const searchTerm = document.getElementById('program-search-input').value.toLowerCase();
    const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
    
    if (!searchTerm) {
        displayProgramsTable(programs);
        return;
    }
    
    const filtered = programs.filter(program => 
        Object.values(program).some(value => 
            value && value.toString().toLowerCase().includes(searchTerm)
        )
    );
    
    displayProgramsTable(filtered);
    showNotification(`Found ${filtered.length} matching program(s)`, 'success');
}

function filterPrograms(filter) {
    const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
    let filtered = [];
    
    switch(filter) {
        case 'active':
            filtered = programs.filter(p => p['STATUS'] === 'Active');
            break;
        case 'completed':
            filtered = programs.filter(p => p['STATUS'] === 'Completed');
            break;
        case 'upcoming':
            filtered = programs.filter(p => p['STATUS'] === 'Upcoming');
            break;
        default:
            filtered = programs;
    }
    
    displayProgramsTable(filtered);
    
    // Update active filter tab
    document.querySelectorAll('#programs-content .filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
}

function exportProgramsToExcel() {
    const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
    
    if (programs.length === 0) {
        showNotification('No programs to export', 'error');
        return;
    }
    
    try {
        const csvContent = convertToCSV(programs);
        downloadCSV(csvContent, 'programs_export.csv');
        showNotification('Programs exported successfully', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting programs', 'error');
    }
}

// Reports Module
function initializeReportsModule() {
    // Report period selector
    const reportPeriod = document.getElementById('report-period');
    if (reportPeriod) {
        reportPeriod.addEventListener('change', function() {
            const customRange = document.getElementById('custom-date-range');
            customRange.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }
    
    // Generate report button
    const generateReportBtn = document.getElementById('generate-comprehensive-report-btn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateComprehensiveReport);
    }
    
    // Export buttons
    const exportExcelBtn = document.getElementById('export-comprehensive-report-btn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', exportComprehensiveReportToExcel);
    }
    
    const exportPdfBtn = document.getElementById('export-pdf-report-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportComprehensiveReportToPDF);
    }
    
    // Report tabs
    const reportTabs = document.querySelectorAll('.report-tab');
    reportTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const reportType = this.getAttribute('data-report');
            switchReportTab(reportType);
        });
    });
}

function loadReportsData() {
    updateReportsDashboard();
    generateReportCharts();
}

function updateReportsDashboard() {
    // Applicants count
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    document.getElementById('report-total-applicants').textContent = applicants.length;
    
    // Employers count
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    document.getElementById('report-total-employers').textContent = employers.length;
    
    // Active vacancies count
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    const activeVacancies = vacancies.filter(v => v.STATUS === 'Active').length;
    document.getElementById('report-active-vacancies').textContent = activeVacancies;
    
    // Active programs count
    const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
    const activePrograms = programs.filter(p => p.STATUS === 'Active').length;
    document.getElementById('report-active-programs').textContent = activePrograms;
}

function generateReportCharts() {
    // This would typically use a charting library like Chart.js
    // For now, we'll create placeholder content
    
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    
    // Program category chart placeholder
    const programCategoryChart = document.getElementById('program-category-chart');
    if (programCategoryChart) {
        programCategoryChart.innerHTML = '<p>Program Category Distribution Chart</p><p><small>Would show applicants by program category</small></p>';
    }
    
    // Employment status chart placeholder
    const employmentStatusChart = document.getElementById('employment-status-chart');
    if (employmentStatusChart) {
        employmentStatusChart.innerHTML = '<p>Employment Status Distribution Chart</p><p><small>Would show employment status breakdown</small></p>';
    }
    
    // Registration trend chart placeholder
    const registrationTrendChart = document.getElementById('registration-trend-chart');
    if (registrationTrendChart) {
        registrationTrendChart.innerHTML = '<p>Monthly Registration Trend Chart</p><p><small>Would show registration trends over time</small></p>';
    }
    
    // Vacancies by industry chart placeholder
    const vacanciesIndustryChart = document.getElementById('vacancies-industry-chart');
    if (vacanciesIndustryChart) {
        vacanciesIndustryChart.innerHTML = '<p>Vacancies by Industry Chart</p><p><small>Would show vacancy distribution by industry</small></p>';
    }
}

function generateComprehensiveReport() {
    const reportType = document.getElementById('report-type').value;
    const reportPeriod = document.getElementById('report-period').value;
    
    showNotification(`Generating ${reportType} report for ${reportPeriod}...`, 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification('Report generated successfully!', 'success');
        updateReportsDashboard();
        generateReportCharts();
    }, 2000);
}

function exportComprehensiveReportToExcel() {
    // Collect data from all modules
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
    const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
    
    if (applicants.length === 0 && employers.length === 0 && vacancies.length === 0 && programs.length === 0) {
        showNotification('No data available to export', 'error');
        return;
    }
    
    try {
        // Create comprehensive report data
        const reportData = {
            summary: {
                totalApplicants: applicants.length,
                totalEmployers: employers.length,
                activeVacancies: vacancies.filter(v => v.STATUS === 'Active').length,
                activePrograms: programs.filter(p => p.STATUS === 'Active').length,
                generated: new Date().toLocaleString()
            },
            applicants: applicants,
            employers: employers,
            vacancies: vacancies,
            programs: programs
        };
        
        const csvContent = convertToCSV([reportData.summary]);
        downloadCSV(csvContent, 'comprehensive_report.csv');
        showNotification('Comprehensive report exported successfully', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('Error exporting comprehensive report', 'error');
    }
}

function exportComprehensiveReportToPDF() {
    showNotification('PDF export feature coming soon!', 'info');
    // This would typically use a PDF generation library like jsPDF
}

function switchReportTab(reportType) {
    // Hide all report sections
    document.querySelectorAll('.report-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.report-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show target report section and activate tab
    document.getElementById(`${reportType}-report`).classList.add('active');
    document.querySelector(`[data-report="${reportType}"]`).classList.add('active');
    
    // Load report data
    loadReportData(reportType);
}

function loadReportData(reportType) {
    switch(reportType) {
        case 'applicants':
            loadApplicantsReport();
            break;
        case 'employers':
            loadEmployersReport();
            break;
        case 'vacancies':
            loadVacanciesReport();
            break;
        case 'programs':
            loadProgramsReport();
            break;
        case 'matches':
            loadMatchesReport();
            break;
    }
}

function loadApplicantsReport() {
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    const reportSection = document.getElementById('applicants-report');
    
    if (reportSection) {
        reportSection.innerHTML = `
            <div class="report-summary">
                <h4>Applicants Summary</h4>
                <p>Total Applicants: <strong>${applicants.length}</strong></p>
                <p>New This Month: <strong>${calculateNewThisMonth(applicants)}</strong></p>
                <p>By Program Category:</p>
                <ul>
                    ${getProgramCategorySummary(applicants)}
                </ul>
            </div>
        `;
    }
}

function loadEmployersReport() {
    const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
    const reportSection = document.getElementById('employers-report');
    
    if (reportSection) {
        reportSection.innerHTML = `
            <div class="report-summary">
                <h4>Employers Summary</h4>
                <p>Total Employers: <strong>${employers.length}</strong></p>
                <p>Active Employers: <strong>${employers.filter(e => e.STATUS === 'Active').length}</strong></p>
                <p>By Industry:</p>
                <ul>
                    ${getIndustrySummary(employers)}
                </ul>
            </div>
        `;
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    notification.style.maxWidth = '300px';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function convertToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function calculateNewThisMonth(data) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return data.filter(item => {
        const date = new Date(item['REG. DATE'] || item['DATE CREATED'] || new Date());
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
}

function getProgramCategorySummary(applicants) {
    const categories = {};
    applicants.forEach(applicant => {
        const category = applicant['PROGRAM CATEGORY'] || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories)
        .map(([category, count]) => `<li>${category}: ${count}</li>`)
        .join('');
}

function getIndustrySummary(employers) {
    const industries = {};
    employers.forEach(employer => {
        const industry = employer['INDUSTRY'] || 'Uncategorized';
        industries[industry] = (industries[industry] || 0) + 1;
    });
    
    return Object.entries(industries)
        .map(([industry, count]) => `<li>${industry}: ${count}</li>`)
        .join('');
}

// Placeholder functions for view/edit/delete operations
function viewApplicant(id) {
    showNotification(`View applicant: ${id}`, 'info');
}

function editApplicant(id) {
    showNotification(`Edit applicant: ${id}`, 'info');
}

function deleteApplicant(id) {
    if (confirm('Are you sure you want to delete this applicant?')) {
        const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
        const updated = applicants.filter(a => a['SRS ID'] !== id);
        localStorage.setItem('mainApplicants', JSON.stringify(updated));
        loadApplicantsData();
        showNotification('Applicant deleted successfully', 'success');
    }
}

function viewEmployer(id) {
    showNotification(`View employer: ${id}`, 'info');
}

function editEmployer(id) {
    showNotification(`Edit employer: ${id}`, 'info');
}

function deleteEmployer(id) {
    if (confirm('Are you sure you want to delete this employer?')) {
        const employers = JSON.parse(localStorage.getItem('employersData') || '[]');
        const updated = employers.filter(e => e['EMPLOYER ID'] !== id);
        localStorage.setItem('employersData', JSON.stringify(updated));
        loadEmployersData();
        showNotification('Employer deleted successfully', 'success');
    }
}

function viewVacancy(id) {
    showNotification(`View vacancy: ${id}`, 'info');
}

function editVacancy(id) {
    showNotification(`Edit vacancy: ${id}`, 'info');
}

function deleteVacancy(id) {
    if (confirm('Are you sure you want to delete this vacancy?')) {
        const vacancies = JSON.parse(localStorage.getItem('vacanciesData') || '[]');
        const updated = vacancies.filter(v => v['VACANCY ID'] !== id);
        localStorage.setItem('vacanciesData', JSON.stringify(updated));
        loadVacanciesData();
        showNotification('Vacancy deleted successfully', 'success');
    }
}

function viewProgram(id) {
    showNotification(`View program: ${id}`, 'info');
}

function editProgram(id) {
    showNotification(`Edit program: ${id}`, 'info');
}

function deleteProgram(id) {
    if (confirm('Are you sure you want to delete this program?')) {
        const programs = JSON.parse(localStorage.getItem('programsData') || '[]');
        const updated = programs.filter(p => p['PROGRAM ID'] !== id);
        localStorage.setItem('programsData', JSON.stringify(updated));
        loadProgramsData();
        showNotification('Program deleted successfully', 'success');
    }
}

function downloadApplicantData(index) {
    const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
    const applicant = applicants[index];
    
    if (applicant) {
        const csvContent = convertToCSV([applicant]);
        downloadCSV(csvContent, `applicant_${applicant['SRS ID'] || 'data'}.csv`);
        showNotification('Applicant data downloaded', 'success');
    }
}

// Initialize sample data if none exists
function initializeSampleData() {
    if (!localStorage.getItem('mainApplicants')) {
        const sampleApplicants = [
            {
                'SRS ID': 'APP-001',
                'LAST NAME': 'Dela Cruz',
                'FIRST NAME': 'Juan',
                'MIDDLE NAME': 'Santos',
                'DATE OF BIRTH': '1990-05-15',
                'BARANGAY': 'Dolores',
                'CITY/MUNICIPALITY': 'San Fernando',
                'PROVINCE': 'Pampanga',
                'SEX': 'Male',
                'CELLPHONE': '09123456789',
                'EMAIL': 'juan.delacruz@email.com',
                'PROGRAM CATEGORY': 'Employment Assistance',
                'PROGRAM STATUS': 'Applied',
                'REG. DATE': new Date().toLocaleDateString()
            }
        ];
        localStorage.setItem('mainApplicants', JSON.stringify(sampleApplicants));
    }
    
    if (!localStorage.getItem('employersData')) {
        const sampleEmployers = [
            {
                'EMPLOYER ID': 'EMP-001',
                'COMPANY NAME': 'Sample Corporation',
                'INDUSTRY': 'Manufacturing',
                'CONTACT PERSON': 'Maria Santos',
                'EMAIL': 'hr@samplecorp.com',
                'PHONE': '(045) 123-4567',
                'ADDRESS': '123 Main Street',
                'BARANGAY': 'Dolores',
                'CITY/MUNICIPALITY': 'San Fernando',
                'PROVINCE': 'Pampanga',
                'STATUS': 'Active',
                'REGISTRATION DATE': new Date().toLocaleDateString()
            }
        ];
        localStorage.setItem('employersData', JSON.stringify(sampleEmployers));
    }
    
    if (!localStorage.getItem('vacanciesData')) {
        const sampleVacancies = [
            {
                'VACANCY ID': 'VAC-001',
                'JOB TITLE': 'Production Worker',
                'EMPLOYER': 'Sample Corporation',
                'INDUSTRY': 'Manufacturing',
                'SALARY RANGE': 'PHP 12,000 - 15,000',
                'WORK LOCATION': 'San Fernando, Pampanga',
                'STATUS': 'Active',
                'DATE POSTED': new Date().toLocaleDateString(),
                'APPLICATION DEADLINE': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
        ];
        localStorage.setItem('vacanciesData', JSON.stringify(sampleVacancies));
    }
    
    if (!localStorage.getItem('programsData')) {
        const samplePrograms = [
            {
                'PROGRAM ID': 'PROG-001',
                'PROGRAM NAME': 'Zero Unemployment Project',
                'PROGRAM CATEGORY': 'Zero Unemployment',
                'TARGET BENEFICIARIES': 'Unemployed residents',
                'STATUS': 'Active',
                'START DATE': new Date().toLocaleDateString(),
                'END DATE': new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
            }
        ];
        localStorage.setItem('programsData', JSON.stringify(samplePrograms));
    }
}

// Initialize sample data on first load
initializeSampleData();