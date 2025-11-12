// script.js - Fixed Version
document.addEventListener('DOMContentLoaded', function () {
    // Elements configuration
    const elements = {
        fileInput: document.getElementById('file-input'),
        fileName: document.getElementById('file-name'),
        browsebtn: document.getElementById('browse-btn'),
        importBtn: document.getElementById('import-btn'),
        notification: document.getElementById('notification'),
        importedTable: document.getElementById('imported-table'),
        resetDataBtn: document.getElementById('reset-data-btn'),
        uploadFileInput: document.getElementById('upload-file-input'),
        uploadFileName: document.getElementById('upload-file-name'),
        uploadBrowseBtn: document.getElementById('upload-browse-btn'),
        addBtn: document.getElementById('add-btn'),
        uploadNotification: document.getElementById('upload-notification'),
        mainApplicantTable: document.getElementById('main-applicant-table'),
        clearAllApplicantsBtn: document.getElementById('clear-all-applicants-btn'),
        editModal: document.getElementById('editModal'),
        closeModal: document.querySelector('.close'),
        cancelEdit: document.getElementById('cancel-edit'),
        editApplicantForm: document.getElementById('editApplicantForm'),
        duplicateWarning: document.getElementById('duplicate-warning'),
        searchInput: document.getElementById('search-input'),
        searchBtn: document.getElementById('search-btn'),
        clearSearchBtn: document.getElementById('clear-search-btn'),
        editPhotoInput: document.getElementById('edit-photo-input'),
        editPhotoPreview: document.getElementById('edit-photo-preview'),
        photoPlaceholder: document.getElementById('photo-placeholder'),
        uploadPhotoBtn: document.getElementById('upload-photo-btn'),
        removePhotoBtn: document.getElementById('remove-photo-btn'),
        takePhotoBtn: document.getElementById('take-photo-btn'),
        cameraModal: document.getElementById('cameraModal'),
        closeCamera: document.querySelector('.close-camera'),
        cameraVideo: document.getElementById('camera-video'),
        cameraCanvas: document.getElementById('camera-canvas'),
        captureBtn: document.getElementById('capture-btn'),
        retakeBtn: document.getElementById('retake-btn'),
        usePhotoBtn: document.getElementById('use-photo-btn'),
        cameraError: document.getElementById('camera-error'),
        addManualBtn: document.getElementById('add-manual-btn'),
        manualNotification: document.getElementById('manual-notification'),
        manualModal: document.getElementById('manualModal'),
        closeManual: document.querySelector('.close-manual'),
        cancelManual: document.getElementById('cancel-manual'),
        manualApplicantForm: document.getElementById('manualApplicantForm'),
        manualPhotoInput: document.getElementById('manual-photo-input'),
        manualPhotoPreview: document.getElementById('manual-photo-preview'),
        manualPhotoPlaceholder: document.getElementById('manual-photo-placeholder'),
        manualUploadPhotoBtn: document.getElementById('manual-upload-photo-btn'),
        manualTakePhotoBtn: document.getElementById('manual-take-photo-btn'),
        manualRemovePhotoBtn: document.getElementById('manual-remove-photo-btn'),
        advancedFiltersBtn: document.getElementById('advanced-filters-btn'),
        advancedFiltersPanel: document.getElementById('advanced-filters-panel'),
        applyFiltersBtn: document.getElementById('apply-filters-btn'),
        clearFiltersBtn: document.getElementById('clear-filters-btn'),
        sortSelect: document.getElementById('sort-select'),
        generateReportBtn: document.getElementById('generate-report-btn'),
        exportReportBtn: document.getElementById('export-report-btn'),
        viewModal: document.getElementById('viewModal'),
        closeView: document.querySelector('.close-view'),
        exportApplicantsBtn: document.getElementById('export-applicants-btn')
    };

    // Global variables
    let currentEditId = null;
    let stream = null;
    let capturedPhoto = null;
    let activeFilters = {};
    let hasScrolledToHighlight = false;
    let eventListenersInitialized = false; // Flag to prevent duplicate event listeners

    // Enhanced Sync Manager (keep your existing SyncManager class as is)
    class SyncManager {
        constructor() {
            this.isOnline = navigator.onLine;
            this.pendingChanges = JSON.parse(localStorage.getItem('pendingChanges') || '[]');
            this.init();
        }

        init() {
            this.backupData();
            window.addEventListener('online', () => this.handleOnline());
            window.addEventListener('offline', () => this.handleOffline());
            this.updateOnlineStatus();
            
            // Periodic backup every 5 minutes
            setInterval(() => this.backupData(), 300000);
        }

        backupData() {
            try {
                const applicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
                const imported = JSON.parse(localStorage.getItem('importedData') || '[]');
                
                localStorage.setItem('backup_mainApplicants', JSON.stringify(applicants));
                localStorage.setItem('backup_importedData', JSON.stringify(imported));
                
                console.log('📦 Data backed up:', {
                    applicants: applicants.length,
                    imported: imported.length
                });
            } catch (error) {
                console.error('Backup failed:', error);
            }
        }

        restoreBackupIfNeeded() {
            try {
                const currentApplicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
                const backupApplicants = JSON.parse(localStorage.getItem('backup_mainApplicants') || '[]');
                
                if (currentApplicants.length === 0 && backupApplicants.length > 0) {
                    console.warn('🔄 Restoring data from backup');
                    localStorage.setItem('mainApplicants', JSON.stringify(backupApplicants));
                    showNotification('Data restored from backup', 'warning');
                    return true;
                }
                
                return false;
            } catch (error) {
                console.error('Restore failed:', error);
                return false;
            }
        }

        updateOnlineStatus() {
            this.isOnline = navigator.onLine;
            const statusElement = document.getElementById('connection-status');
            
            if (statusElement) {
                if (this.isOnline) {
                    statusElement.innerHTML = '<i class="fas fa-wifi"></i> Online';
                    statusElement.className = 'connection-status';
                } else {
                    statusElement.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline';
                    statusElement.className = 'connection-status offline';
                }
            }
        }

        handleOnline() {
            console.log('Connection restored - syncing data...');
            this.updateOnlineStatus();
            this.syncPendingChanges();
            showNotification('Connection restored. Syncing offline changes...', 'success');
        }

        handleOffline() {
            console.log('Connection lost - working offline...');
            this.updateOnlineStatus();
            showNotification('Working offline. Changes will sync when connection is restored.', 'warning');
        }

        addPendingChange(change) {
            const pendingChange = {
                ...change,
                timestamp: new Date().toISOString(),
                id: Date.now() + Math.random()
            };
            
            this.pendingChanges.push(pendingChange);
            localStorage.setItem('pendingChanges', JSON.stringify(this.pendingChanges));
        }

        loadPendingChanges() {
            this.pendingChanges = JSON.parse(localStorage.getItem('pendingChanges') || '[]');
            return this.pendingChanges;
        }

        async syncPendingChanges() {
            if (!this.isOnline || this.pendingChanges.length === 0) {
                console.log('📱 No pending changes to sync');
                return;
            }

            const pendingChanges = [...this.pendingChanges];
            let successfulSyncs = 0;
            let failedSyncs = 0;
            
            console.log(`🔄 Syncing ${pendingChanges.length} pending changes...`);
            
            for (const change of pendingChanges) {
                try {
                    await this.processChange(change);
                    successfulSyncs++;
                    
                    // Remove from pending changes
                    this.pendingChanges = this.pendingChanges.filter(pc => pc.id !== change.id);
                    
                } catch (error) {
                    console.error(`❌ Failed to sync change:`, error);
                    failedSyncs++;
                }
            }

            // Update localStorage
            localStorage.setItem('pendingChanges', JSON.stringify(this.pendingChanges));

            // Show results
            if (successfulSyncs > 0) {
                showNotification(`${successfulSyncs} offline changes synchronized successfully`, 'success');
            }
            if (failedSyncs > 0) {
                showNotification(`${failedSyncs} changes failed to sync. They will retry later.`, 'warning');
            }
        }

        async processChange(change) {
            switch (change.type) {
                case 'add_applicant':
                    return await this.syncAddApplicant(change.data);
                case 'update_applicant':
                    return await this.syncUpdateApplicant(change.data);
                case 'delete_applicant':
                    return await this.syncDeleteApplicant(change.data);
                default:
                    console.warn('Unknown change type:', change.type);
                    return Promise.reject('Unknown change type');
            }
        }

        async syncAddApplicant(applicant) {
            if (!applicant || Object.keys(applicant).length === 0) {
                return Promise.reject('Empty applicant data');
            }
            
            console.log('🔄 Syncing new applicant:', applicant.NAME || applicant['SRS ID']);
            
            // Simulate API call - replace with actual backend integration
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('✅ Applicant synced to server:', applicant['SRS ID']);
                    resolve({ success: true, id: applicant['SRS ID'] });
                }, 1000);
            });
        }

        async syncUpdateApplicant(applicant) {
            if (!applicant || Object.keys(applicant).length === 0) {
                return Promise.reject('Empty applicant data');
            }
            
            console.log('🔄 Syncing updated applicant:', applicant.NAME || applicant['SRS ID']);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('✅ Applicant update synced to server:', applicant['SRS ID']);
                    resolve({ success: true, id: applicant['SRS ID'] });
                }, 1000);
            });
        }

        async syncDeleteApplicant(applicantId) {
            if (!applicantId) {
                return Promise.reject('No applicant ID provided');
            }
            
            console.log('🔄 Syncing deleted applicant:', applicantId);
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('✅ Applicant deletion synced to server:', applicantId);
                    resolve({ success: true, id: applicantId });
                }, 1000);
            });
        }
    }

    // Initialize Sync Manager
    const syncManager = new SyncManager();

    // Core Application Initialization
    function initializeApp() {
        try {
            console.log('🚀 Initializing CPESO Applicant Management System...');
            
            // Check authentication
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                window.location.href = 'login.html';
                return;
            }

            // Prevent duplicate initialization
            if (eventListenersInitialized) {
                console.log('⚠️ Event listeners already initialized, skipping...');
                return;
            }

            initializeZeroUnemploymentNavigation();

            // Initialize all components with better error handling
            const initSteps = [
                { name: 'File Uploads', fn: initializeFileUploads },
                { name: 'Manual Form', fn: initializeManualForm },
                { name: 'Camera', fn: initializeCamera },
                { name: 'Search', fn: initializeSearch },
                { name: 'Edit Modal', fn: initializeEditModal },
                { name: 'Advanced Filters', fn: initializeAdvancedFilters },
                { name: 'Reporting', fn: initializeReporting },
                { name: 'View Modal', fn: initializeViewModal }
            ];

            initSteps.forEach(step => {
                try {
                    step.fn();
                    console.log(`✅ ${step.name} initialized`);
                } catch (error) {
                    console.log(`⚠️ ${step.name} not available on this page:`, error.message);
                }
            });
            
            // Load data
            loadApplicantsDataWithRetry();
            displayCurrentUser();

            // Mark as initialized
            eventListenersInitialized = true;
            
            console.log('🎉 Application initialized successfully');
            
        } catch (error) {
            console.error('💥 Fatal error during initialization:', error);
            showNotification('Application initialization failed. Please refresh the page.', 'error');
        }
    }

    // FIXED: File Upload Functions with duplicate prevention
    function initializeFileUploads() {
        console.log('🔄 Initializing file uploads...');
        
        // Clear any existing event listeners first
        removeDuplicateEventListeners();
        
        // Import file handling
        if (elements.browsebtn && elements.fileInput) {
            elements.browsebtn.addEventListener('click', function() {
                console.log('Browse button clicked');
                elements.fileInput.click();
            });
        }
        
        if (elements.fileInput) {
            // Remove any existing event listeners
            elements.fileInput.replaceWith(elements.fileInput.cloneNode(true));
            // Re-get the element after clone
            elements.fileInput = document.getElementById('file-input');
            
            elements.fileInput.addEventListener('change', function() {
                console.log('File input changed:', this.files[0]?.name);
                if (this.files.length > 0 && elements.fileName) {
                    elements.fileName.value = this.files[0].name;
                    if (elements.importBtn) elements.importBtn.disabled = false;
                } else if (elements.fileName) {
                    elements.fileName.value = '';
                    if (elements.importBtn) elements.importBtn.disabled = true;
                }
            });
        }
        
        if (elements.importBtn) {
            // Remove any existing event listeners
            elements.importBtn.replaceWith(elements.importBtn.cloneNode(true));
            elements.importBtn = document.getElementById('import-btn');
            
            elements.importBtn.addEventListener('click', function(e) {
                console.log('Import button clicked');
                e.preventDefault();
                e.stopPropagation();
                handleImportFile();
            });
        }
        
        // Upload file handling
        if (elements.uploadBrowseBtn && elements.uploadFileInput) {
            elements.uploadBrowseBtn.addEventListener('click', function() {
                console.log('Upload browse button clicked');
                elements.uploadFileInput.click();
            });
        }
        
        if (elements.uploadFileInput) {
            // Remove any existing event listeners
            elements.uploadFileInput.replaceWith(elements.uploadFileInput.cloneNode(true));
            elements.uploadFileInput = document.getElementById('upload-file-input');
            
            elements.uploadFileInput.addEventListener('change', function() {
                console.log('Upload file input changed:', this.files[0]?.name);
                if (this.files.length > 0 && elements.uploadFileName) {
                    elements.uploadFileName.value = this.files[0].name;
                    if (elements.addBtn) elements.addBtn.disabled = false;
                } else if (elements.uploadFileName) {
                    elements.uploadFileName.value = '';
                    if (elements.addBtn) elements.addBtn.disabled = true;
                }
            });
        }
        
        if (elements.addBtn) {
            // Remove any existing event listeners
            elements.addBtn.replaceWith(elements.addBtn.cloneNode(true));
            elements.addBtn = document.getElementById('add-btn');
            
            elements.addBtn.addEventListener('click', function(e) {
                console.log('Add button clicked');
                e.preventDefault();
                e.stopPropagation();
                handleUploadFile();
            });
        }
        
        // Reset buttons with duplicate prevention
        if (elements.resetDataBtn) {
            // Remove any existing event listeners
            elements.resetDataBtn.replaceWith(elements.resetDataBtn.cloneNode(true));
            elements.resetDataBtn = document.getElementById('reset-data-btn');
            
            let resetDataHandler = function() {
                console.log('Reset data button clicked');
                if (confirm('Are you sure you want to clear all imported data? This action cannot be undone.')) {
                    localStorage.removeItem('importedData');
                    if (elements.importedTable) {
                        const tbody = elements.importedTable.querySelector('tbody');
                        if (tbody) tbody.innerHTML = '';
                    }
                    showNotification('Imported data cleared successfully.', 'success');
                }
            };
            
            elements.resetDataBtn.addEventListener('click', resetDataHandler);
        }
        
        if (elements.clearAllApplicantsBtn) {
            // Remove any existing event listeners
            elements.clearAllApplicantsBtn.replaceWith(elements.clearAllApplicantsBtn.cloneNode(true));
            elements.clearAllApplicantsBtn = document.getElementById('clear-all-applicants-btn');
            
            let clearAllHandler = function() {
                console.log('Clear all applicants button clicked');
                if (confirm('Are you sure you want to clear ALL applicants? This action cannot be undone.')) {
                    localStorage.removeItem('mainApplicants');
                    if (elements.mainApplicantTable) {
                        const tbody = elements.mainApplicantTable.querySelector('tbody');
                        if (tbody) tbody.innerHTML = '';
                    }
                    showNotification('All applicants cleared successfully.', 'success');
                }
            };
            
            elements.clearAllApplicantsBtn.addEventListener('click', clearAllHandler);
        }

        // Export applicants
        if (elements.exportApplicantsBtn) {
            elements.exportApplicantsBtn.addEventListener('click', exportApplicantsToExcel);
        }
    }

    // Helper function to remove duplicate event listeners
    function removeDuplicateEventListeners() {
        // Clone elements to remove all event listeners
        const elementsToReset = [
            'file-input', 'import-btn', 'upload-file-input', 'add-btn', 
            'reset-data-btn', 'clear-all-applicants-btn', 'add-manual-btn'
        ];
        
        elementsToReset.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.replaceWith(element.cloneNode(true));
            }
        });
        
        // Update elements object with new references
        elements.fileInput = document.getElementById('file-input');
        elements.importBtn = document.getElementById('import-btn');
        elements.uploadFileInput = document.getElementById('upload-file-input');
        elements.addBtn = document.getElementById('add-btn');
        elements.resetDataBtn = document.getElementById('reset-data-btn');
        elements.clearAllApplicantsBtn = document.getElementById('clear-all-applicants-btn');
        elements.addManualBtn = document.getElementById('add-manual-btn');
    }

    // FIXED: Manual Form Functions
    function initializeManualForm() {
        if (!elements.manualModal) return;

        console.log('🔄 Initializing manual form...');

        // Clear any existing event listeners first
        if (elements.addManualBtn) {
            elements.addManualBtn.replaceWith(elements.addManualBtn.cloneNode(true));
            elements.addManualBtn = document.getElementById('add-manual-btn');
            
            elements.addManualBtn.addEventListener('click', function(e) {
                console.log('Add manual button clicked');
                e.preventDefault();
                e.stopPropagation();
                openManualModal();
            });
        }

        // Event listeners for manual modal
        if (elements.closeManual) {
            elements.closeManual.addEventListener('click', closeManualModal);
        }

        if (elements.cancelManual) {
            elements.cancelManual.addEventListener('click', closeManualModal);
        }

        // Remove existing event listener and add new one
        elements.manualModal.removeEventListener('click', manualModalClickHandler);
        function manualModalClickHandler(event) {
            if (event.target === elements.manualModal) {
                closeManualModal();
            }
        }
        elements.manualModal.addEventListener('click', manualModalClickHandler);

        // Form submission
        if (elements.manualApplicantForm) {
            elements.manualApplicantForm.removeEventListener('submit', manualFormSubmitHandler);
            function manualFormSubmitHandler(event) {
                event.preventDefault();
                console.log('Manual form submitted');
                if (validateManualForm(false)) {
                    addManualApplicant();
                }
            }
            elements.manualApplicantForm.addEventListener('submit', manualFormSubmitHandler);
        }

        // Initialize controls
        initializeManualFormControls();
    }

    function initializeManualFormControls() {
        try {
            console.log('🔄 Initializing manual form controls...');
            
            // Photo controls
            if (elements.manualUploadPhotoBtn && elements.manualPhotoInput) {
                elements.manualUploadPhotoBtn.addEventListener('click', function() {
                    elements.manualPhotoInput.click();
                });
            }

            if (elements.manualPhotoInput) {
                elements.manualPhotoInput.addEventListener('change', handleManualPhotoUpload);
            }

            if (elements.manualRemovePhotoBtn) {
                elements.manualRemovePhotoBtn.addEventListener('click', function() {
                    elements.manualPhotoPreview.src = '';
                    elements.manualPhotoPreview.style.display = 'none';
                    elements.manualPhotoPlaceholder.style.display = 'flex';
                    elements.manualRemovePhotoBtn.style.display = 'none';
                    elements.manualPhotoInput.value = '';
                    localStorage.removeItem('tempManualPhoto');
                });
            }

            if (elements.manualTakePhotoBtn) {
                elements.manualTakePhotoBtn.addEventListener('click', function() {
                    currentEditId = 'manual_' + Date.now();
                    openCamera();
                });
            }

            // Dynamic form elements
            initializeDynamicFormElements();
            initializeAddEntryButtons();
            
        } catch (error) {
            console.error('Error initializing manual form controls:', error);
        }
    }

    // FIXED: Enhanced displayMainApplicants function with proper button event handling
    function displayMainApplicants(applicants) {
        if (!elements.mainApplicantTable) return;
        
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        // Clear table
        tbody.innerHTML = '';
        
        if (applicants.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 45; 
            cell.className = 'no-results';
            cell.textContent = 'No applicants found';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        applicants.forEach((applicant, index) => {
            const row = document.createElement('tr');

            const columns = [
                applicant['SRS ID'] || `APP-${index + 1}`,
                applicant['LAST NAME'] || applicant['SURNAME'] || 'N/A',
                applicant['FIRST NAME'] || 'N/A',
                applicant['MIDDLE NAME'] || 'N/A',
                getSuffixValue(applicant),
                applicant['DATE OF BIRTH'] || applicant['BDATE'] || 'N/A',
                applicant['PLACE OF BIRTH'] || 'N/A',
                applicant['HOUSE NO./STREET/VILLAGE'] || applicant['STREET ADDRESS'] || 'N/A',
                applicant['BARANGAY'] || 'N/A',
                applicant['MUNICIPALITY/CITY'] || applicant['CITY/MUNICIPALITY'] || 'N/A',
                applicant['PROVINCE'] || 'N/A',
                applicant['SEX'] || 'N/A',
                applicant['CIVIL STATUS'] || 'N/A',
                applicant['TIN'] || 'N/A',
                applicant['GSIS/SSS NO.'] || 'N/A',
                applicant['PAGIBIG NO.'] || 'N/A',
                applicant['PHILHEALTH NO.'] || 'N/A',
                applicant['HEIGHT'] || 'N/A',
                applicant['EMAIL ADDRESS'] || applicant['EMAIL'] || 'N/A',
                applicant['LANDLINE NUMBER'] || applicant['TELEPHONE'] || 'N/A',
                applicant['CELLPHONE NUMBER'] || applicant['CELLPHONE'] || 'N/A',
                applicant['DISABILITY'] || 'N/A',
                applicant['EMPLOYMENT STATUS/TYPE'] || applicant['EMP. STATUS'] || 'N/A',
                applicant['ARE YOU ACTIVELY LOOKING FOR WORK?'] || 'N/A',
                applicant['WILLING TO WORK IMMEDIATELY?'] || 'N/A',
                applicant['ARE YOU A 4PS BENEFICIARY?'] || applicant['4Ps'] || 'N/A',
                applicant['PREFERRED OCCUPATION'] || applicant['PREFERRED POSITION'] || 'N/A',
                applicant['PREFERRED WORK LOCATION'] || 'N/A',
                applicant['EXPECTED SALARY'] || 'N/A',
                applicant['PASSPORT NO.'] || 'N/A',
                applicant['PASSPORT EXPIRY DATE'] || 'N/A',
                applicant['LANGUAGE'] || 'N/A',
                applicant['ELEMENTARY'] || 'N/A',
                applicant['SECONDARY'] || 'N/A',
                applicant['TERTIARY'] || 'N/A',
                applicant['GRADUATE STUDIES'] || 'N/A',
                applicant['TECHNICAL/VOCATIONAL AND OTHER TRAINING'] || 'N/A',
                applicant['ELIGIBILITY'] || 'N/A',
                applicant['WORK EXPERIENCE'] || 'N/A',
                applicant['OTHER SKILLS'] || applicant['SKILLS'] || 'N/A',
                applicant['PROGRAM CATEGORY'] || 'N/A',
                applicant['SPECIFIC PROGRAM'] || 'N/A',
                applicant['PROGRAM STATUS'] || 'N/A'  
            ];
            
            columns.forEach((value, colIndex) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                cell.className = 'compact-cell';
                row.appendChild(cell);
            });
            
            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';

            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';
            
            // View button
            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'View Applicant Details';
            viewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('View button clicked for:', applicant.NAME);
                openViewModal(applicant);
            });

            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Edit Applicant';
            editBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Edit button clicked for:', applicant.NAME);
                openEditModal(applicant);
            });

            // Download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.title = 'Download Data';
            downloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Download button clicked for:', applicant.NAME);
                downloadApplicantData(applicant);
            });

            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete Applicant';
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delete button clicked for:', applicant.NAME);
                const applicantId = applicant['SRS ID'] || applicant.ID;
                if (confirm('Are you sure you want to delete this applicant?')) {
                    deleteApplicant(applicantId);
                }
            });

            actionButtons.appendChild(viewBtn);
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(downloadBtn);
            actionButtons.appendChild(deleteBtn);
            actionsCell.appendChild(actionButtons);
            row.appendChild(actionsCell);
                            
            tbody.appendChild(row);
        });
        
        console.log(`✅ Displayed ${applicants.length} applicants with functional action buttons`);
    }

    // FIXED: Enhanced file handling functions
    function handleImportFile() {
        console.log('🔄 Handling import file...');
        if (!elements.fileInput || !elements.fileInput.files[0]) {
            showNotification('Please select a file first.', 'error');
            return;
        }
        
        const file = elements.fileInput.files[0];
        console.log('Importing file:', file.name);
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    showNotification('The file does not contain any data.', 'error');
                    return;
                }
                
                console.log(`📊 Processing ${jsonData.length} records from import file`);
                const processedData = smartImportData(jsonData);
                const validationResults = validateImportedDataDuplicates(processedData);
                
                showEnhancedImportValidationModal(validationResults, processedData)
                    .then(result => {
                        switch (result.action) {
                            case 'unique':
                                proceedWithImportToImportedData(result.data);
                                break;
                            case 'all':
                                proceedWithImportToImportedData(result.data);
                                break;
                            case 'cancel':
                                showNotification('Import cancelled.', 'info');
                                break;
                        }
                    });
                
            } catch (error) {
                console.error('Error processing file:', error);
                showNotification('Error processing file: ' + error.message, 'error');
            }
        };
        
        reader.onerror = function() {
            showNotification('Error reading file.', 'error');
        };
        
        reader.readAsArrayBuffer(file);
    }

    function handleUploadFile() {
        console.log('🔄 Handling upload file...');
        if (!elements.uploadFileInput || !elements.uploadFileInput.files[0]) {
            showUploadNotification('Please select a file first.', 'error');
            return;
        }
        
        const file = elements.uploadFileInput.files[0];
        console.log('Uploading file:', file.name);
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                if (jsonData.length === 0) {
                    showUploadNotification('The file does not contain any data.', 'error');
                    return;
                }
                
                console.log(`📊 Processing ${jsonData.length} records from upload file`);
                const processedData = smartImportData(jsonData);
                const validationResults = validateImportedDataDuplicates(processedData);
                
                showEnhancedImportValidationModal(validationResults, processedData)
                    .then(result => {
                        switch (result.action) {
                            case 'unique':
                                proceedWithAddingToMainApplicants(result.data);
                                break;
                            case 'all':
                                proceedWithAddingToMainApplicants(result.data);
                                break;
                            case 'cancel':
                                showUploadNotification('Import cancelled.', 'info');
                                break;
                        }
                    });
                
            } catch (error) {
                console.error('Error processing file:', error);
                showUploadNotification('Error processing file: ' + error.message, 'error');
            }
        };
        
        reader.onerror = function() {
            showUploadNotification('Error reading file.', 'error');
        };
        
        reader.readAsArrayBuffer(file);
    }

    // Keep all your other existing functions (openEditModal, openViewModal, etc.) as they are
    // ... [rest of your existing functions remain unchanged]

    // Initialize the application
    initializeApp();
});