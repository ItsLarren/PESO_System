document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeDashboard();
    initializeFilterTabs();
});

function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const pageContents = document.querySelectorAll('.page-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetPage = this.getAttribute('data-page');
            
            navTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            pageContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetPage}-content`) {
                    content.classList.add('active');
                }
            });
            
            loadPageData(targetPage);
        });
    });
}

function initializeDashboard() {
    loadDashboardStats();
    loadRecentActivity();
}

function loadDashboardStats() {
    const applicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
    const employers = JSON.parse(localStorage.getItem('employers')) || [];
    const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
    const programs = JSON.parse(localStorage.getItem('programs')) || [];
    
    document.getElementById('quick-applicants').textContent = applicants.length;
    document.getElementById('quick-employers').textContent = employers.length;
    document.getElementById('quick-vacancies').textContent = vacancies.length;
    
    document.getElementById('total-applicants').textContent = applicants.length;
    document.getElementById('total-employers').textContent = employers.length;
    document.getElementById('active-vacancies').textContent = vacancies.length;
    document.getElementById('job-matches').textContent = calculateJobMatches(applicants, vacancies);
    
    updateDetailedStats(applicants, employers);
}

function calculateJobMatches(applicants, vacancies) {
    return Math.min(applicants.length, vacancies.length);
}

function updateDetailedStats(applicants, employers) {
    const employedCount = applicants.filter(app => 
        app['EMP. STATUS'] && app['EMP. STATUS'].toLowerCase().includes('employed')
    ).length;
    
    const unemployedCount = applicants.filter(app => 
        app['EMP. STATUS'] && app['EMP. STATUS'].toLowerCase().includes('unemployed')
    ).length;
    
    const newThisMonth = applicants.filter(app => {
        const regDate = app['REG. DATE'];
        if (!regDate) return false;
        const regMonth = new Date(regDate).getMonth();
        const currentMonth = new Date().getMonth();
        return regMonth === currentMonth;
    }).length;
    
    document.getElementById('new-applicants-month').textContent = newThisMonth;
    document.getElementById('employed-applicants').textContent = employedCount;
    document.getElementById('unemployed-applicants').textContent = unemployedCount;
    

}

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

function initializeFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const container = this.closest('.card');
            const tabs = container.querySelectorAll('.filter-tab');
            const filter = this.getAttribute('data-filter');
            
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            filterTable(container, filter);
        });
    });
}

function filterTable(container, filter) {
    const table = container.querySelector('table');
    if (!table) return;
    
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        if (filter === 'employed') {
            const statusCell = row.querySelector('td:nth-child(23)'); 
            if (statusCell && !statusCell.textContent.toLowerCase().includes('employed')) {
                showRow = false;
            }
        } else if (filter === 'unemployed') {
            const statusCell = row.querySelector('td:nth-child(23)');
            if (statusCell && !statusCell.textContent.toLowerCase().includes('unemployed')) {
                showRow = false;
            }
        }        
        row.style.display = showRow ? '' : 'none';
    });
}

function loadPageData(page) {
    switch(page) {
        case 'applicants':
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

function navigateToPage(page) {
    const tab = document.querySelector(`.nav-tab[data-page="${page}"]`);
    if (tab) {
        tab.click();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const zeroUnemploymentTab = document.getElementById('zero-unemployment-tab');
    if (zeroUnemploymentTab) {
        zeroUnemploymentTab.addEventListener('click', function() {
            filterZeroUnemploymentApplicants();
        });
    }
});

function filterZeroUnemploymentApplicants() {
    const applicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
    
    const zeroUnemploymentApplicants = applicants.filter(applicant => 
        applicant['PROGRAM CATEGORY'] && 
        applicant['PROGRAM CATEGORY'].includes('Zero Unemployment')
    );
    
    displayFilteredApplicants(zeroUnemploymentApplicants);
}

function loadEmployersData() {
    const employers = JSON.parse(localStorage.getItem('employers')) || [];
    displayEmployersTable(employers);
}

function loadVacanciesData() {
    const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
    displayVacanciesTable(vacancies);
}

function loadProgramsData() {
    const programs = JSON.parse(localStorage.getItem('programs')) || [];
    displayProgramsTable(programs);
}

function displayEmployersTable(employers) {
    const tbody = document.querySelector('#employers-table tbody');
    if (!tbody) return;
    
}

function displayVacanciesTable(vacancies) {
    const tbody = document.querySelector('#vacancies-table tbody');
    if (!tbody) return;
    
}

function displayProgramsTable(programs) {
    const tbody = document.querySelector('#programs-table tbody');
    if (!tbody) return;
    
}