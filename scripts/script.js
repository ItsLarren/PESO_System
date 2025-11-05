// script.js - Complete Fixed Version
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

    // Enhanced Sync Manager
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

            initializeZeroUnemploymentNavigation();
            
            // Restore backup if needed
            if (syncManager.restoreBackupIfNeeded()) {
                console.log('✅ Data restored from backup');
            }

            // Initialize all components
            const initSteps = [
                { name: 'Manual Form', fn: initializeManualForm },
                { name: 'Camera', fn: initializeCamera },
                { name: 'Search', fn: initializeSearch },
                { name: 'Edit Modal', fn: initializeEditModal },
                { name: 'File Uploads', fn: initializeFileUploads },
                { name: 'Advanced Filters', fn: initializeAdvancedFilters },
                { name: 'Reporting', fn: initializeReporting },
                { name: 'View Modal', fn: initializeViewModal }
            ];

            initSteps.forEach(step => {
                try {
                    step.fn();
                    console.log(`✅ ${step.name} initialized`);
                } catch (error) {
                    console.error(`❌ Error initializing ${step.name}:`, error);
                }
            });
            
            // Load data
            loadApplicantsDataWithRetry();
            loadImportedData();
            displayCurrentUser();

            console.log('🎉 Application initialized successfully');
            
        } catch (error) {
            console.error('💥 Fatal error during initialization:', error);
            showNotification('Application initialization failed. Please refresh the page.', 'error');
        }
    }

    // Manual Form Functions
    function initializeManualForm() {
        if (!elements.manualModal) return;

        // Event listeners for manual modal
        if (elements.addManualBtn) {
            elements.addManualBtn.addEventListener('click', openManualModal);
        }

        if (elements.closeManual) {
            elements.closeManual.addEventListener('click', closeManualModal);
        }

        if (elements.cancelManual) {
            elements.cancelManual.addEventListener('click', closeManualModal);
        }

        elements.manualModal.addEventListener('click', function(event) {
            if (event.target === elements.manualModal) {
                closeManualModal();
            }
        });

        // Form submission
        if (elements.manualApplicantForm) {
            elements.manualApplicantForm.addEventListener('submit', function(event) {
                event.preventDefault();
                if (validateManualForm(false)) {
                    addManualApplicant();
                }
            });
        }

        // Initialize controls
        initializeManualFormControls();
    }

    function initializeManualFormControls() {
        try {
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

    function handleManualPhotoUpload(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const photoData = e.target.result;
                elements.manualPhotoPreview.src = photoData;
                elements.manualPhotoPreview.style.display = 'block';
                elements.manualPhotoPlaceholder.style.display = 'none';
                elements.manualRemovePhotoBtn.style.display = 'block';
                localStorage.setItem('tempManualPhoto', photoData);
            };
            reader.readAsDataURL(file);
        } else {
            showNotification('Please select a valid image file (JPEG, PNG, etc.).', 'error', elements.manualNotification);
        }
    }

    function initializeDynamicFormElements() {
        // Disability others
        const disabilityOthers = document.getElementById('manual-disability-others');
        const disabilitySpecify = document.getElementById('manual-disability-specify');
        if (disabilityOthers && disabilitySpecify) {
            disabilityOthers.addEventListener('change', function() {
                disabilitySpecify.style.display = this.checked ? 'block' : 'none';
            });
        }

        // Employment status
        const empStatus = document.getElementById('manual-emp-status');
        const empStatusSpecify = document.getElementById('manual-emp-status-specify');
        if (empStatus && empStatusSpecify) {
            empStatus.addEventListener('change', function() {
                empStatusSpecify.style.display = this.value === 'Other' ? 'block' : 'none';
            });
        }

        // Add more dynamic elements as needed...
    }

    function initializeAddEntryButtons() {
        const addTrainingBtn = document.getElementById('add-training-btn');
        if (addTrainingBtn) {
            addTrainingBtn.addEventListener('click', function() {
                addTableEntry('training-entries', 'training');
            });
        }
        
        const addEligibilityBtn = document.getElementById('add-eligibility-btn');
        if (addEligibilityBtn) {
            addEligibilityBtn.addEventListener('click', function() {
                addTableEntry('eligibility-entries', 'eligibility');
            });
        }
        
        const addWorkBtn = document.getElementById('add-work-btn');
        if (addWorkBtn) {
            addWorkBtn.addEventListener('click', function() {
                addTableEntry('work-entries', 'work');
            });
        }
    }

    function addTableEntry(tableId, type) {
        const tableBody = document.getElementById(tableId);
        if (!tableBody) return;
        
        const rowCount = tableBody.children.length + 1;
        let newRow;

        if (type === 'training') {
            newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" name="manual-training-course${rowCount}"></td>
                <td><input type="text" name="manual-training-duration${rowCount}"></td>
                <td><input type="text" name="manual-training-institution${rowCount}"></td>
                <td><input type="text" name="manual-training-certificate${rowCount}"></td>
            `;
        } else if (type === 'eligibility') {
            newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" name="manual-eligibility${rowCount}"></td>
                <td><input type="text" name="manual-eligibility-rating${rowCount}"></td>
                <td><input type="date" name="manual-eligibility-date${rowCount}" class="date-input"></td>
                <td><input type="text" name="manual-license${rowCount}"></td>
                <td><input type="date" name="manual-license-valid${rowCount}" class="date-input"></td>
            `;
        } else if (type === 'work') {
            newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" name="manual-work-company${rowCount}"></td>
                <td><input type="text" name="manual-work-address${rowCount}"></td>
                <td><input type="text" name="manual-work-position${rowCount}"></td>
                <td><input type="text" name="manual-work-dates${rowCount}"></td>
                <td>
                    <select name="manual-work-status${rowCount}">
                        <option value="">Select Status</option>
                        <option value="Permanent">Permanent</option>
                        <option value="Contractual">Contractual</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Probationary">Probationary</option>
                    </select>
                </td>
            `;
        }
        
        tableBody.appendChild(newRow);
    }

    function openManualModal() {
        if (!elements.manualModal) return;
        
        // Reset form
        elements.manualApplicantForm.reset();
        elements.manualPhotoPreview.src = '';
        elements.manualPhotoPreview.style.display = 'none';
        elements.manualPhotoPlaceholder.style.display = 'flex';
        elements.manualRemovePhotoBtn.style.display = 'none';
        elements.manualPhotoInput.value = '';
        
        // Set default values
        setDefaultManualFormValues();
        
        elements.manualModal.style.display = 'block';
    }

    function closeManualModal() {
        if (!elements.manualModal) return;
        
        elements.manualModal.style.display = 'none';
        elements.manualModal.classList.remove('manual-form-edit-mode');
        
        // Reset modal header
        const modalHeader = elements.manualModal.querySelector('.modal-header h2');
        if (modalHeader) {
            modalHeader.textContent = 'Add New Applicant';
        }
        
        localStorage.removeItem('tempManualPhoto');
    }

    function setDefaultManualFormValues() {
        if (elements.manualModal.classList.contains('manual-form-edit-mode')) return;

        const defaultDropdowns = {
            'manual-4ps': 'No',
            'manual-pwd': 'No',
            'manual-ofw': 'No',
            'manual-former-ofw': 'No'
        };
        
        Object.keys(defaultDropdowns).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = defaultDropdowns[fieldId];
            }
        });
    }

    function validateManualForm(isEditMode = false) {
        const requiredFields = [
            'manual-surname',
            'manual-first-name',
            'manual-bdate',
            'manual-barangay',
            'manual-city-municipality',
            'manual-province',
            'manual-sex'
        ];
        
        let isValid = true;
        let firstInvalidField = null;
        
        for (const fieldId of requiredFields) {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                isValid = false;
                if (!firstInvalidField) firstInvalidField = field;
                
                field.style.borderColor = '#f44336';
                setTimeout(() => {
                    if (field) field.style.borderColor = '';
                }, 3000);
            }
        }
        
        if (!isValid && firstInvalidField) {
            showNotification('Please fill in all required fields.', 'error', elements.manualNotification);
            firstInvalidField.focus();
        }
        
        return isValid;
    }

    function addManualApplicant() {
        try {
            console.log('Starting manual applicant addition...');
            
            const formData = new FormData(elements.manualApplicantForm);
            const applicantData = {};
            
            // Get basic name information
            const lastName = document.getElementById('manual-surname')?.value.trim() || '';
            const firstName = document.getElementById('manual-first-name')?.value.trim() || '';
            const middleName = document.getElementById('manual-middle-name')?.value.trim() || '';
            const suffix = document.getElementById('manual-suffix')?.value.trim() || ''; // ADD THIS
            
            // Build full name
            if (lastName && firstName) {
                let fullName = `${lastName}, ${firstName}`;
                if (middleName) {
                    fullName += ` ${middleName}`;
                }
                if (suffix) { // ADD SUFFIX TO FULL NAME
                    fullName += ` ${suffix}`;
                }
                applicantData['NAME'] = fullName;
            } else {
                applicantData['NAME'] = 'N/A';
            }
            
            applicantData['LAST NAME'] = lastName || 'N/A';
            applicantData['FIRST NAME'] = firstName || 'N/A';
            applicantData['MIDDLE NAME'] = middleName || 'N/A';
            applicantData['SUFFIX'] = suffix || 'N/A'; // ADD THIS LINE
            
            // Process all form fields systematically
            applicantData['SRS ID'] = generateUniqueId();
            
            // Personal Information
            applicantData['DATE OF BIRTH'] = document.getElementById('manual-bdate')?.value || 'N/A';
            applicantData['PLACE OF BIRTH'] = document.getElementById('manual-place-birth')?.value.trim() || 'N/A';
            applicantData['SEX'] = document.getElementById('manual-sex')?.value || 'N/A';
            applicantData['CIVIL STATUS'] = document.getElementById('manual-civil-status')?.value || 'N/A';
            applicantData['TIN'] = document.getElementById('manual-tin')?.value.trim() || 'N/A';
            applicantData['GSIS/SSS NO.'] = document.getElementById('manual-gsis-sss')?.value.trim() || 'N/A';
            applicantData['PAGIBIG NO.'] = document.getElementById('manual-pagibig')?.value.trim() || 'N/A';
            applicantData['PHILHEALTH NO.'] = document.getElementById('manual-philhealth')?.value.trim() || 'N/A';
            applicantData['HEIGHT'] = document.getElementById('manual-height')?.value || 'N/A';
            
            // Address Information
            applicantData['HOUSE NO./STREET/VILLAGE'] = document.getElementById('manual-house-street')?.value.trim() || 'N/A';
            applicantData['BARANGAY'] = document.getElementById('manual-barangay')?.value.trim() || 'N/A';
            applicantData['MUNICIPALITY/CITY'] = document.getElementById('manual-city-municipality')?.value.trim() || 'N/A';
            applicantData['PROVINCE'] = document.getElementById('manual-province')?.value.trim() || 'N/A';
            
            // Contact Information
            applicantData['EMAIL ADDRESS'] = document.getElementById('manual-email')?.value.trim() || 'N/A';
            applicantData['LANDLINE NUMBER'] = document.getElementById('manual-landline')?.value.trim() || 'N/A';
            applicantData['CELLPHONE NUMBER'] = document.getElementById('manual-cellphone')?.value.trim() || 'N/A';
            
            // Disability Information
            const disabilityCheckboxes = document.querySelectorAll('input[name="manual-disability"]:checked');
            const disabilities = Array.from(disabilityCheckboxes).map(cb => cb.value);
            applicantData['DISABILITY'] = disabilities.length > 0 ? disabilities.join(', ') : 'N/A';
            
            // Employment Information
            applicantData['EMPLOYMENT STATUS/TYPE'] = document.getElementById('manual-emp-status')?.value || 'N/A';
            
            // Actively looking for work
            const lookingWorkRadio = document.querySelector('input[name="manual-looking-work"]:checked');
            applicantData['ARE YOU ACTIVELY LOOKING FOR WORK?'] = lookingWorkRadio?.value || 'N/A';
            if (lookingWorkRadio?.value === 'Yes') {
                applicantData['ARE YOU ACTIVELY LOOKING FOR WORK?'] += ` - ${document.getElementById('manual-looking-work-duration')?.value || ''}`;
            }
            
            // Willing to work immediately
            const workImmediatelyRadio = document.querySelector('input[name="manual-work-immediately"]:checked');
            applicantData['WILLING TO WORK IMMEDIATELY?'] = workImmediatelyRadio?.value || 'N/A';
            if (workImmediatelyRadio?.value === 'No') {
                applicantData['WILLING TO WORK IMMEDIATELY?'] += ` - ${document.getElementById('manual-work-immediately-when')?.value || ''}`;
            }
            
            // 4Ps Beneficiary
            const fourPsRadio = document.querySelector('input[name="manual-4ps"]:checked');
            applicantData['ARE YOU A 4PS BENEFICIARY?'] = fourPsRadio?.value || 'N/A';
            if (fourPsRadio?.value === 'Yes') {
                applicantData['ARE YOU A 4PS BENEFICIARY?'] += ` - ID: ${document.getElementById('manual-4ps-id')?.value || ''}`;
            }
            
            // Job Preference
            applicantData['PREFERRED OCCUPATION'] = document.getElementById('manual-pref-occupation1')?.value.trim() || 'N/A';
            
            // Preferred Work Location
            const workLocationRadio = document.querySelector('input[name="manual-work-location"]:checked');
            if (workLocationRadio?.value === 'Local') {
                const locations = [
                    document.getElementById('manual-work-location-local1')?.value,
                    document.getElementById('manual-work-location-local2')?.value,
                    document.getElementById('manual-work-location-local3')?.value
                ].filter(loc => loc).join(', ');
                applicantData['PREFERRED WORK LOCATION'] = locations || 'N/A';
            } else if (workLocationRadio?.value === 'Overseas') {
                const locations = [
                    document.getElementById('manual-work-location-overseas1')?.value,
                    document.getElementById('manual-work-location-overseas2')?.value,
                    document.getElementById('manual-work-location-overseas3')?.value
                ].filter(loc => loc).join(', ');
                applicantData['PREFERRED WORK LOCATION'] = locations || 'N/A';
            } else {
                applicantData['PREFERRED WORK LOCATION'] = 'N/A';
            }
            
            applicantData['EXPECTED SALARY'] = document.getElementById('manual-expected-salary')?.value.trim() || 'N/A';
            applicantData['PASSPORT NO.'] = document.getElementById('manual-passport')?.value.trim() || 'N/A';
            applicantData['PASSPORT EXPIRY DATE'] = document.getElementById('manual-passport-expiry')?.value || 'N/A';
            
            // Language Proficiency
            const languages = [];
            if (document.getElementById('manual-lang-english-read')?.checked) languages.push('English');
            if (document.getElementById('manual-lang-filipino-read')?.checked) languages.push('Filipino');
            const otherLang = document.getElementById('manual-lang-other-name')?.value;
            if (otherLang) languages.push(otherLang);
            applicantData['LANGUAGE'] = languages.length > 0 ? languages.join(', ') : 'N/A';
            
            // Educational Background
            applicantData['ELEMENTARY'] = document.getElementById('manual-edu-elem-school')?.value.trim() || 'N/A';
            applicantData['SECONDARY'] = document.getElementById('manual-edu-secondary-school')?.value.trim() || 'N/A';
            applicantData['TERTIARY'] = document.getElementById('manual-edu-tertiary-school')?.value.trim() || 'N/A';
            applicantData['GRADUATE STUDIES'] = document.getElementById('manual-edu-graduate-school')?.value.trim() || 'N/A';
            
            // Technical/Vocational Training
            applicantData['TECHNICAL/VOCATIONAL AND OTHER TRAINING'] = document.getElementById('manual-training-course1')?.value.trim() || 'N/A';
            
            // Eligibility
            applicantData['ELIGIBILITY'] = document.getElementById('manual-eligibility1')?.value.trim() || 'N/A';
            
            // Work Experience
            applicantData['WORK EXPERIENCE'] = document.getElementById('manual-work-company1')?.value.trim() || 'N/A';
            
            // Other Skills
            const skillCheckboxes = document.querySelectorAll('input[name="manual-skill"]:checked');
            const skills = Array.from(skillCheckboxes).map(cb => cb.value);
            applicantData['OTHER SKILLS'] = skills.length > 0 ? skills.join(', ') : 'N/A';
            
            // Program Information
            applicantData['PROGRAM CATEGORY'] = document.getElementById('manual-program-category')?.value || 'N/A';
            applicantData['SPECIFIC PROGRAM'] = document.getElementById('manual-specific-program')?.value.trim() || 'N/A';
            applicantData['PROGRAM STATUS'] = document.getElementById('manual-program-status')?.value || 'N/A';
            
            // System Information
            applicantData['REG. DATE'] = new Date().toLocaleDateString();
            applicantData['DATE CREATED'] = new Date().toLocaleString();
            applicantData['DATE LAST MODIFIED'] = new Date().toLocaleString();
            applicantData['CREATED BY'] = localStorage.getItem('currentUser') || 'Manual Entry';

            console.log('📝 New applicant data:', applicantData);

            const duplicateCheck = checkApplicantDuplicate(applicantData);
            
            if (duplicateCheck.hasMatches) {
                console.log('🟡 Potential duplicate found, showing confirmation');
                highlightMatchingApplicants(duplicateCheck.matches);
                
                showDuplicateConfirmation(applicantData, duplicateCheck.matches)
                    .then(shouldProceed => {
                        if (!shouldProceed) {
                            removeHighlights();
                            console.log('❌ User cancelled duplicate addition');
                            return;
                        }
                        
                        console.log('✅ User confirmed to add anyway');
                        proceedWithAddingApplicant(applicantData);
                    });
            } else {
                console.log('✅ No duplicates found, proceeding with addition');
                proceedWithAddingApplicant(applicantData);
            }
        } catch (error) {
            console.error('Error in addManualApplicant:', error);
            showNotification('Error adding applicant: ' + error.message, 'error', elements.manualNotification);
        }
    }

    function collectManualFormData() {
        const applicantData = {};
        
        // Personal Information
        const lastName = document.getElementById('manual-surname').value.trim();
        const firstName = document.getElementById('manual-first-name').value.trim();
        const middleName = document.getElementById('manual-middle-name').value.trim();
        
        // Build full name
        if (lastName && firstName) {
            let fullName = `${lastName}, ${firstName}`;
            if (middleName) fullName += ` ${middleName}`;
            applicantData['NAME'] = fullName;
        }
        
        applicantData['LAST NAME'] = lastName || 'N/A';
        applicantData['FIRST NAME'] = firstName || 'N/A';
        applicantData['MIDDLE NAME'] = middleName || 'N/A';
        
        // System Information
        applicantData['SRS ID'] = generateUniqueId();
        applicantData['DATE CREATED'] = new Date().toLocaleString();
        applicantData['DATE LAST MODIFIED'] = new Date().toLocaleString();
        applicantData['CREATED BY'] = localStorage.getItem('currentUser') || 'Manual Entry';
        
        // Collect other fields...
        applicantData['DATE OF BIRTH'] = document.getElementById('manual-bdate').value || 'N/A';
        applicantData['SEX'] = document.getElementById('manual-sex').value || 'N/A';
        applicantData['BARANGAY'] = document.getElementById('manual-barangay').value.trim() || 'N/A';
        applicantData['MUNICIPALITY/CITY'] = document.getElementById('manual-city-municipality').value.trim() || 'N/A';
        applicantData['PROVINCE'] = document.getElementById('manual-province').value.trim() || 'N/A';
        applicantData['CELLPHONE NUMBER'] = document.getElementById('manual-cellphone').value.trim() || 'N/A';
        applicantData['EMAIL ADDRESS'] = document.getElementById('manual-email').value.trim() || 'N/A';
        applicantData['PROGRAM CATEGORY'] = document.getElementById('manual-program-category').value || 'N/A';
        applicantData['SPECIFIC PROGRAM'] = document.getElementById('manual-specific-program').value.trim() || 'N/A';
        applicantData['PROGRAM STATUS'] = document.getElementById('manual-program-status').value || 'N/A';
        
        return applicantData;
    }

    function proceedWithAddingApplicant(applicantData) {
        try {
            // Add photo if exists
            const tempPhoto = localStorage.getItem('tempManualPhoto');
            if (tempPhoto) {
                const photoId = applicantData['SRS ID'];
                localStorage.setItem(`photo_${photoId}`, tempPhoto);
                localStorage.removeItem('tempManualPhoto');
            }
            
            // Save to localStorage
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            savedApplicants.push(applicantData);
            saveMainApplicants(savedApplicants);
            
            // Display updated list
            displayMainApplicants(savedApplicants);
            removeHighlights();
            
            // Sync if online
            if (!syncManager.isOnline) {
                syncManager.addPendingChange({
                    type: 'add_applicant',
                    data: applicantData
                });
            } else {
                syncManager.syncAddApplicant(applicantData);
            }
            
            // Close modal and show success
            closeManualModal();
            showProgramSuccessPrompt(applicantData);
            
        } catch (error) {
            console.error('Error adding applicant:', error);
            showNotification('Error adding applicant: ' + error.message, 'error', elements.manualNotification);
        }
    }

    // Camera Functions
    function initializeCamera() {
        if (elements.takePhotoBtn) {
            elements.takePhotoBtn.addEventListener('click', openCamera);
        }

        if (elements.closeCamera) {
            elements.closeCamera.addEventListener('click', closeCamera);
        }

        elements.cameraModal.addEventListener('click', function(event) {
            if (event.target === elements.cameraModal) {
                closeCamera();
            }
        });

        if (elements.captureBtn) {
            elements.captureBtn.addEventListener('click', capturePhoto);
        }

        if (elements.retakeBtn) {
            elements.retakeBtn.addEventListener('click', retakePhoto);
        }

        if (elements.usePhotoBtn) {
            elements.usePhotoBtn.addEventListener('click', usePhoto);
        }
    }

    function openCamera() {
        // Hide other modals
        if (elements.manualModal) elements.manualModal.style.display = 'none';
        if (elements.editModal) elements.editModal.style.display = 'none';
        
        // Show camera modal
        elements.cameraModal.style.display = 'block';
        elements.cameraError.style.display = 'none';
        elements.cameraVideo.style.display = 'block';
        elements.cameraCanvas.style.display = 'none';
        elements.captureBtn.style.display = 'block';
        elements.retakeBtn.style.display = 'none';
        elements.usePhotoBtn.style.display = 'none';
        capturedPhoto = null;
        
        // Access camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                } 
            })
            .then(function(videoStream) {
                stream = videoStream;
                elements.cameraVideo.srcObject = stream;
            })
            .catch(function(error) {
                console.error('Camera error:', error);
                elements.cameraError.textContent = 'Cannot access camera: ' + error.message;
                elements.cameraError.style.display = 'block';
            });
        } else {
            elements.cameraError.textContent = 'Camera not supported on this device';
            elements.cameraError.style.display = 'block';
        }
    }

    function closeCamera() {
        elements.cameraModal.style.display = 'none';
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
    }

    function capturePhoto() {
        const video = elements.cameraVideo;
        const canvas = elements.cameraCanvas;
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        video.style.display = 'none';
        canvas.style.display = 'block';
        elements.captureBtn.style.display = 'none';
        elements.retakeBtn.style.display = 'block';
        elements.usePhotoBtn.style.display = 'block';
        
        capturedPhoto = canvas.toDataURL('image/jpeg', 0.8);
    }

    function retakePhoto() {
        elements.cameraVideo.style.display = 'block';
        elements.cameraCanvas.style.display = 'none';
        elements.captureBtn.style.display = 'block';
        elements.retakeBtn.style.display = 'none';
        elements.usePhotoBtn.style.display = 'none';
        capturedPhoto = null;
    }

    function usePhoto() {
        if (capturedPhoto) {
            if (currentEditId && currentEditId.startsWith('manual_')) {
                localStorage.setItem('tempManualPhoto', capturedPhoto);
                elements.manualPhotoPreview.src = capturedPhoto;
                elements.manualPhotoPreview.style.display = 'block';
                elements.manualPhotoPlaceholder.style.display = 'none';
                elements.manualRemovePhotoBtn.style.display = 'block';
            } else {
                localStorage.setItem(`tempPhoto_${currentEditId}`, capturedPhoto);
                elements.editPhotoPreview.src = capturedPhoto;
                elements.editPhotoPreview.style.display = 'block';
                elements.photoPlaceholder.style.display = 'none';
                elements.removePhotoBtn.style.display = 'block';
            }
            
            closeCamera();
            showNotification('Photo captured successfully!', 'success');
        }
    }

    // Search and Filter Functions
    function initializeSearch() {
        if (elements.searchBtn) {
            elements.searchBtn.addEventListener('click', searchApplicants);
        }

        if (elements.clearSearchBtn) {
            elements.clearSearchBtn.addEventListener('click', clearSearch);
        }

        if (elements.searchInput) {
            elements.searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    searchApplicants();
                }
            });
        }
    }

    function searchApplicants() {
        if (!elements.searchInput || !elements.mainApplicantTable) return;
        
        const searchTerm = elements.searchInput.value.toLowerCase().trim();
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        let foundCount = 0;
        
        if (!searchTerm) {
            clearSearch();
            return;
        }
        
        rows.forEach(row => {
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
        
        // Show no results message
        const noResultsRow = tbody.querySelector('.no-results-row');
        if (foundCount === 0) {
            if (!noResultsRow) {
                const row = document.createElement('tr');
                row.className = 'no-results-row';
                const cell = document.createElement('td');
                cell.colSpan = elements.mainApplicantTable.querySelectorAll('th').length;
                cell.className = 'no-results';
                cell.textContent = 'No matching applicants found';
                row.appendChild(cell);
                tbody.appendChild(row);
            }
        } else if (noResultsRow) {
            noResultsRow.remove();
        }
        
        showNotification(`Found ${foundCount} matching applicant(s)`, 'success');
    }

    function clearSearch() {
        if (!elements.searchInput || !elements.mainApplicantTable) return;
        
        elements.searchInput.value = '';
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        const rows = tbody.querySelectorAll('tr');
        const noResultsRow = tbody.querySelector('.no-results-row');
        
        rows.forEach(row => {
            row.style.display = '';
        });
        
        if (noResultsRow) {
            noResultsRow.remove();
        }
    }

    // Edit Modal Functions
    function initializeEditModal() {
        if (!elements.editModal) return;

        // Close events
        if (elements.closeModal) {
            elements.closeModal.addEventListener('click', function() {
                elements.editModal.style.display = 'none';
            });
        }

        if (elements.cancelEdit) {
            elements.cancelEdit.addEventListener('click', function() {
                elements.editModal.style.display = 'none';
            });
        }

        elements.editModal.addEventListener('click', function(event) {
            if (event.target === elements.editModal) {
                elements.editModal.style.display = 'none';
            }
        });

        // Form submission
        if (elements.editApplicantForm) {
            elements.editApplicantForm.addEventListener('submit', function(event) {
                event.preventDefault();
                updateApplicant(currentEditId);
            });
        }

        // Photo controls
        if (elements.uploadPhotoBtn && elements.editPhotoInput) {
            elements.uploadPhotoBtn.addEventListener('click', function() {
                elements.editPhotoInput.click();
            });
        }

        if (elements.editPhotoInput) {
            elements.editPhotoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photoData = e.target.result;
                        localStorage.setItem(`tempPhoto_${currentEditId}`, photoData);
                        elements.editPhotoPreview.src = photoData;
                        elements.editPhotoPreview.style.display = 'block';
                        elements.photoPlaceholder.style.display = 'none';
                        elements.removePhotoBtn.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                } else {
                    showNotification('Please select a valid image file.', 'error');
                }
            });
        }

        if (elements.removePhotoBtn) {
            elements.removePhotoBtn.addEventListener('click', function() {
                elements.editPhotoPreview.src = '';
                elements.editPhotoPreview.style.display = 'none';
                elements.photoPlaceholder.style.display = 'flex';
                elements.removePhotoBtn.style.display = 'none';
                elements.editPhotoInput.value = '';
                localStorage.removeItem(`tempPhoto_${currentEditId}`);
                localStorage.removeItem(`photo_${currentEditId}`);
            });
        }
    }

    function openEditModal(applicant) {
        if (!elements.editModal) return;
        
        // Reset form
        const formInputs = elements.editModal.querySelectorAll('input');
        formInputs.forEach(input => {
            input.value = '';
        });
        
        // Populate form with applicant data
        const fieldToIdMap = {
            'SRS ID': 'edit-srs-id',
            'LAST NAME': 'edit-last-name',
            'FIRST NAME': 'edit-first-name',
            'MIDDLE NAME': 'edit-middle-name',
            'NAME': 'edit-name',
            'BDATE': 'edit-bdate',
            'AGE': 'edit-age',
            'SEX': 'edit-sex',
            'CIVIL STATUS': 'edit-civil-status',
            'STREET ADDRESS': 'edit-street-address',
            'BARANGAY': 'edit-barangay',
            'CITY/MUNICIPALITY': 'edit-city-municipality',
            'PROVINCE': 'edit-province',
            'EMAIL': 'edit-email',
            'CELLPHONE': 'edit-cellphone',
            'EMP. STATUS': 'edit-emp-status',
            'EDUC LEVEL': 'edit-educ-level',
            'COURSE': 'edit-course',
            '4Ps': 'edit-4ps',
            'PWD': 'edit-pwd',
            'DISABILITY': 'edit-disability',
            'PREFERRED POSITION': 'edit-preferred-position',
            'SKILLS': 'edit-skills',
            'WORK EXPERIENCE': 'edit-work-experience',
            'OFW': 'edit-ofw',
            'REMARKS': 'edit-remarks',
            'REG. DATE': 'edit-reg-date',
            'PROGRAM CATEGORY': 'edit-program-category',
            'SPECIFIC PROGRAM': 'edit-specific-program',
            'PROGRAM STATUS': 'edit-program-status'
        };
        
        for (const field in applicant) {
            if (fieldToIdMap[field]) {
                const input = document.getElementById(fieldToIdMap[field]);
                if (input) {
                    input.value = applicant[field] || '';
                }
            }
        }
        
        // Set current edit ID
        currentEditId = applicant['SRS ID'] || applicant.ID;
        
        // Load photo
        const savedPhoto = localStorage.getItem(`photo_${currentEditId}`);
        if (savedPhoto) {
            elements.editPhotoPreview.src = savedPhoto;
            elements.editPhotoPreview.style.display = 'block';
            elements.photoPlaceholder.style.display = 'none';
            elements.removePhotoBtn.style.display = 'block';
        } else {
            elements.editPhotoPreview.src = '';
            elements.editPhotoPreview.style.display = 'none';
            elements.photoPlaceholder.style.display = 'flex';
            elements.removePhotoBtn.style.display = 'none';
        }

        // Show modal
        elements.editModal.style.display = 'block';
    }

    function updateApplicant(id) {
        try {
            if (!id) {
                showNotification('Error: No applicant ID found for update', 'error');
                return;
            }

            const formData = new FormData(document.getElementById('editApplicantForm'));
            const updatedApplicant = {};

            // Update name fields
            const lastName = document.getElementById('edit-last-name').value.trim();
            const firstName = document.getElementById('edit-first-name').value.trim();
            const middleName = document.getElementById('edit-middle-name').value.trim();
            
            if (lastName && firstName) {
                let fullName = `${lastName}, ${firstName}`;
                if (middleName) fullName += ` ${middleName}`;
                updatedApplicant['NAME'] = fullName;
            }
            
            updatedApplicant['LAST NAME'] = lastName || 'N/A';
            updatedApplicant['FIRST NAME'] = firstName || 'N/A';
            updatedApplicant['MIDDLE NAME'] = middleName || 'N/A';
            
            // Update other fields
            formData.forEach((value, key) => {
                if (!key.startsWith('edit-last-name') && !key.startsWith('edit-first-name') && 
                    !key.startsWith('edit-middle-name') && !key.startsWith('edit-name')) {
                    const originalFieldName = key.replace('edit-', '').replace(/-/g, ' ').toUpperCase();
                    updatedApplicant[originalFieldName] = value || 'N/A';
                }
            });
            
            // Handle photo
            const tempPhoto = localStorage.getItem(`tempPhoto_${id}`);
            if (tempPhoto) {
                localStorage.setItem(`photo_${id}`, tempPhoto);
                localStorage.removeItem(`tempPhoto_${id}`);
            }
                
            // Update timestamps
            updatedApplicant['DATE LAST MODIFIED'] = new Date().toLocaleString();
            updatedApplicant['LAST MODIFIED BY'] = localStorage.getItem('currentUser') || 'System';
            
            // Sync changes
            if (!syncManager.isOnline) {
                syncManager.addPendingChange({
                    type: 'update_applicant',
                    data: updatedApplicant
                });
            } else {
                syncManager.syncUpdateApplicant(updatedApplicant);
            }
            
            // Update local storage
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            const updatedApplicants = savedApplicants.map(applicant => {
                if (applicant['SRS ID'] === id || applicant.ID === id) {
                    return { ...applicant, ...updatedApplicant };
                }
                return applicant;
            });
            
            saveMainApplicants(updatedApplicants);
            displayMainApplicants(updatedApplicants);
            
            // Close modal
            elements.editModal.style.display = 'none';
            showNotification('Applicant updated successfully!', 'success');
            
        } catch (error) {
            console.error('Error updating applicant:', error);
            showNotification('Error updating applicant: ' + error.message, 'error');
        }
    }

    // File Upload Functions
    function initializeFileUploads() {
        // Import file handling
        if (elements.browsebtn && elements.fileInput) {
            elements.browsebtn.addEventListener('click', function() {
                elements.fileInput.click();
            });
        }
        
        if (elements.fileInput) {
            elements.fileInput.addEventListener('change', function() {
                if (elements.fileInput.files.length > 0 && elements.fileName) {
                    elements.fileName.value = elements.fileInput.files[0].name;
                    if (elements.importBtn) elements.importBtn.disabled = false;
                } else if (elements.fileName) {
                    elements.fileName.value = '';
                    if (elements.importBtn) elements.importBtn.disabled = true;
                }
            });
        }
        
        if (elements.importBtn) {
            elements.importBtn.addEventListener('click', handleImportFile);
        }
        
        // Upload file handling
        if (elements.uploadBrowseBtn && elements.uploadFileInput) {
            elements.uploadBrowseBtn.addEventListener('click', function() {
                elements.uploadFileInput.click();
            });
        }
        
        if (elements.uploadFileInput) {
            elements.uploadFileInput.addEventListener('change', function() {
                if (elements.uploadFileInput.files.length > 0 && elements.uploadFileName) {
                    elements.uploadFileName.value = elements.uploadFileInput.files[0].name;
                    if (elements.addBtn) elements.addBtn.disabled = false;
                } else if (elements.uploadFileName) {
                    elements.uploadFileName.value = '';
                    if (elements.addBtn) elements.addBtn.disabled = true;
                }
            });
        }
        
        if (elements.addBtn) {
            elements.addBtn.addEventListener('click', handleUploadFile);
        }
        
        // Reset buttons
        if (elements.resetDataBtn) {
            elements.resetDataBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear all imported data? This action cannot be undone.')) {
                    localStorage.removeItem('importedData');
                    if (elements.importedTable) {
                        const tbody = elements.importedTable.querySelector('tbody');
                        if (tbody) tbody.innerHTML = '';
                    }
                    showNotification('Imported data cleared successfully.', 'success');
                }
            });
        }
        
        if (elements.clearAllApplicantsBtn) {
            elements.clearAllApplicantsBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to clear ALL applicants? This action cannot be undone.')) {
                    localStorage.removeItem('mainApplicants');
                    if (elements.mainApplicantTable) {
                        const tbody = elements.mainApplicantTable.querySelector('tbody');
                        if (tbody) tbody.innerHTML = '';
                    }
                    showNotification('All applicants cleared successfully.', 'success');
                }
            });
        }

        // Export applicants
        if (elements.exportApplicantsBtn) {
            elements.exportApplicantsBtn.addEventListener('click', exportApplicantsToExcel);
        }
    }

    function handleImportFile() {
        if (!elements.fileInput || !elements.fileInput.files[0]) {
            showNotification('Please select a file first.', 'error');
            return;
        }
        
        const file = elements.fileInput.files[0];
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
        if (!elements.uploadFileInput || !elements.uploadFileInput.files[0]) {
            showUploadNotification('Please select a file first.', 'error');
            return;
        }
        
        const file = elements.uploadFileInput.files[0];
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

    function proceedWithImportToImportedData(newApplicants) {
        try {
            const existingImportedData = JSON.parse(localStorage.getItem('importedData')) || [];
            const mergedData = [...existingImportedData, ...newApplicants];
            
            localStorage.setItem('importedData', JSON.stringify(mergedData));
            displayImportedData(mergedData);
            
            showNotification(`Successfully imported ${newApplicants.length} applicant(s) to imported data table.`, 'success');
            
            // Reset file input
            if (elements.fileName) elements.fileName.value = '';
            if (elements.importBtn) elements.importBtn.disabled = true;
            if (elements.fileInput) elements.fileInput.value = '';
            
        } catch (error) {
            console.error('Error importing data:', error);
            showNotification('Error importing data: ' + error.message, 'error');
        }
    }

    function proceedWithAddingToMainApplicants(newApplicants) {
        try {
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            const mergedData = [...savedApplicants, ...newApplicants];
            
            saveMainApplicants(mergedData);
            displayMainApplicants(mergedData);
            
            showUploadNotification(`Successfully added ${newApplicants.length} applicant(s) to main applicant table.`, 'success');
            
            // Reset file input
            if (elements.uploadFileName) elements.uploadFileName.value = '';
            if (elements.addBtn) elements.addBtn.disabled = true;
            if (elements.uploadFileInput) elements.uploadFileInput.value = '';
            
        } catch (error) {
            console.error('Error adding applicants:', error);
            showUploadNotification('Error adding applicants: ' + error.message, 'error');
        }
    }

    // Advanced Filters Functions
    function initializeAdvancedFilters() {
        if (!elements.advancedFiltersBtn || !elements.advancedFiltersPanel) return;

        elements.advancedFiltersBtn.addEventListener('click', function() {
            elements.advancedFiltersPanel.style.display = 
                elements.advancedFiltersPanel.style.display === 'none' ? 'block' : 'none';
        });

        if (elements.applyFiltersBtn) {
            elements.applyFiltersBtn.addEventListener('click', applyAdvancedFilters);
        }

        if (elements.clearFiltersBtn) {
            elements.clearFiltersBtn.addEventListener('click', clearAdvancedFilters);
        }

        if (elements.sortSelect) {
            elements.sortSelect.addEventListener('change', applySorting);
        }
    }

    function applyAdvancedFilters() {
        activeFilters = {
            programCategory: document.getElementById('filter-program-category')?.value || '',
            programStatus: document.getElementById('filter-program-status')?.value || '',
            employmentStatus: document.getElementById('filter-employment-status')?.value || '',
            ageMin: document.getElementById('filter-age-min')?.value || '',
            ageMax: document.getElementById('filter-age-max')?.value || '',
            barangay: document.getElementById('filter-barangay')?.value || '',
            regDate: document.getElementById('filter-reg-date')?.value || ''
        };
        
        filterAndDisplayApplicants();
        updateActiveFiltersDisplay();
    }

    function clearAdvancedFilters() {
        const filterInputs = document.querySelectorAll('.filter-select, .filter-input');
        filterInputs.forEach(input => {
            input.value = '';
        });
        
        activeFilters = {};
        filterAndDisplayApplicants();
        updateActiveFiltersDisplay();
    }

    function applySorting() {
        filterAndDisplayApplicants();
    }

    function filterAndDisplayApplicants() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        const searchTerm = elements.searchInput?.value.toLowerCase().trim() || '';
        
        let filteredApplicants = savedApplicants.filter(applicant => {
            // Search filter
            if (searchTerm) {
                const searchableFields = [
                    applicant.NAME, 
                    applicant.CELLPHONE, 
                    applicant.EMAIL, 
                    applicant.BARANGAY,
                    applicant['SPECIFIC PROGRAM'] || ''
                ].join(' ').toLowerCase();
                
                if (!searchableFields.includes(searchTerm)) {
                    return false;
                }
            }
            
            // Advanced filters
            if (activeFilters.programCategory && applicant['PROGRAM CATEGORY'] !== activeFilters.programCategory) {
                return false;
            }
            if (activeFilters.programStatus && applicant['PROGRAM STATUS'] !== activeFilters.programStatus) {
                return false;
            }
            if (activeFilters.employmentStatus && applicant['EMP. STATUS'] !== activeFilters.employmentStatus) {
                return false;
            }
            
            const applicantAge = parseInt(applicant.AGE) || 0;
            if (activeFilters.ageMin && applicantAge < parseInt(activeFilters.ageMin)) {
                return false;
            }
            if (activeFilters.ageMax && applicantAge > parseInt(activeFilters.ageMax)) {
                return false;
            }
            
            if (activeFilters.barangay) {
                const applicantBarangay = (applicant.BARANGAY || '').toLowerCase();
                const filterBarangay = activeFilters.barangay.toLowerCase();
                if (!applicantBarangay.includes(filterBarangay)) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Apply sorting
        filteredApplicants = applySortingToData(filteredApplicants);
        
        // Display results
        displayMainApplicants(filteredApplicants);
        showNotification(`Found ${filteredApplicants.length} applicant(s) matching your criteria`, 'success');
    }

    function applySortingToData(data) {
        const sortValue = elements.sortSelect?.value || 'name';
        
        return data.sort((a, b) => {
            switch (sortValue) {
                case 'name':
                    return (a.NAME || '').localeCompare(b.NAME || '');
                case 'name-desc':
                    return (b.NAME || '').localeCompare(a.NAME || '');
                case 'date':
                    return new Date(b['REG. DATE'] || 0) - new Date(a['REG. DATE'] || 0);
                case 'date-oldest':
                    return new Date(a['REG. DATE'] || 0) - new Date(b['REG. DATE'] || 0);
                case 'age':
                    return (parseInt(a.AGE) || 0) - (parseInt(b.AGE) || 0);
                case 'age-desc':
                    return (parseInt(b.AGE) || 0) - (parseInt(a.AGE) || 0);
                default:
                    return 0;
            }
        });
    }

    function updateActiveFiltersDisplay() {
        const activeCount = Object.values(activeFilters).filter(val => val !== '').length;
        const countElement = document.getElementById('active-filters-count');
        
        if (countElement) {
            if (activeCount > 0) {
                countElement.textContent = `${activeCount} active filter(s)`;
                countElement.style.color = '#ff9800';
                countElement.style.fontWeight = 'bold';
            } else {
                countElement.textContent = 'No active filters';
                countElement.style.color = '#666';
                countElement.style.fontWeight = 'normal';
            }
        }
    }

    // View Modal Functions
    function initializeViewModal() {
        if (!elements.viewModal) return;

        if (elements.closeView) {
            elements.closeView.addEventListener('click', function() {
                elements.viewModal.style.display = 'none';
            });
        }
        
        elements.viewModal.addEventListener('click', function(event) {
            if (event.target === elements.viewModal) {
                elements.viewModal.style.display = 'none';
            }
        });
    }

    function openViewModal(applicant) {
        if (!elements.viewModal) return;
        
        // Map applicant data to view fields
        const fieldToIdMap = {
            'SRS ID': 'view-srs-id',
            'LAST NAME': 'view-last-name',
            'FIRST NAME': 'view-first-name',
            'MIDDLE NAME': 'view-middle-name',
            'NAME': 'view-name',
            'BDATE': 'view-bdate',
            'AGE': 'view-age',
            'SEX': 'view-sex',
            'CIVIL STATUS': 'view-civil-status',
            'STREET ADDRESS': 'view-street-address',
            'BARANGAY': 'view-barangay',
            'CITY/MUNICIPALITY': 'view-city-municipality',
            'PROVINCE': 'view-province',
            'EMAIL': 'view-email',
            'CELLPHONE': 'view-cellphone',
            'EMP. STATUS': 'view-emp-status',
            'EDUC LEVEL': 'view-educ-level',
            'COURSE': 'view-course',
            'SKILLS': 'view-skills',
            'WORK EXPERIENCE': 'view-work-experience',
            'PROGRAM CATEGORY': 'view-program-category',
            'SPECIFIC PROGRAM': 'view-specific-program',
            'PROGRAM STATUS': 'view-program-status',
            'REG. DATE': 'view-reg-date',
            'REMARKS': 'view-remarks'
        };
        
        for (const field in applicant) {
            if (fieldToIdMap[field]) {
                const element = document.getElementById(fieldToIdMap[field]);
                if (element) {
                    element.textContent = applicant[field] || 'N/A';
                }
            }
        }
        
        // Load photo
        const photoId = applicant['SRS ID'] || applicant.ID;
        const viewPhotoPreview = document.getElementById('view-photo-preview');
        const viewPhotoPlaceholder = document.getElementById('view-photo-placeholder');
        
        if (viewPhotoPreview && viewPhotoPlaceholder) {
            const savedPhoto = localStorage.getItem(`photo_${photoId}`);
            if (savedPhoto) {
                viewPhotoPreview.src = savedPhoto;
                viewPhotoPreview.style.display = 'block';
                viewPhotoPlaceholder.style.display = 'none';
            } else {
                viewPhotoPreview.src = '';
                viewPhotoPreview.style.display = 'none';
                viewPhotoPlaceholder.style.display = 'flex';
            }
        }
        
        // Set up action buttons
        const editFullBtn = document.getElementById('edit-full-applicant-btn');
        if (editFullBtn) {
            editFullBtn.onclick = function() {
                elements.viewModal.style.display = 'none';
                openEditModal(applicant);
            };
        }
        
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        if (downloadPdfBtn) {
            downloadPdfBtn.onclick = function() {
                downloadApplicantAsPDF(applicant);
            };
        }
        
        const downloadExcelBtn = document.getElementById('download-excel-btn');
        if (downloadExcelBtn) {
            downloadExcelBtn.onclick = function() {
                downloadApplicantData(applicant);
            };
        }
        
        // Show modal
        elements.viewModal.style.display = 'block';
    }

    // Reporting Functions
    function initializeReporting() {
        if (elements.generateReportBtn) {
            elements.generateReportBtn.addEventListener('click', generateProgramReports);
        }
        
        if (elements.exportReportBtn) {
            elements.exportReportBtn.addEventListener('click', exportReportsToExcel);
        }
    }

    function generateProgramReports() {
        const reportsContainer = document.getElementById('program-reports');
        if (!reportsContainer) return;
        
        // Toggle display
        if (reportsContainer.style.display === 'block') {
            reportsContainer.style.display = 'none';
            return;
        }
        
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        
        if (savedApplicants.length === 0) {
            reportsContainer.innerHTML = '<p class="no-results">No applicant data available for reporting.</p>';
            reportsContainer.style.display = 'block';
            return;
        }
        
        // Generate reports
        const programStats = calculateProgramStatistics(savedApplicants);
        const employmentStats = calculateEmploymentStatistics(savedApplicants);
        const demographicStats = calculateDemographicStatistics(savedApplicants);
        
        reportsContainer.innerHTML = `
            <div class="visual-report-section">
                <h3><i class="fas fa-chart-line"></i> Executive Summary</h3>
                ${generateEnhancedStatistics(programStats, employmentStats, demographicStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-users"></i> Program Enrollment Overview</h3>
                ${generateProgramPictograph(programStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-user-friends"></i> Gender Distribution</h3>
                ${generateGenderFigures(demographicStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-briefcase"></i> Employment Status</h3>
                ${generateEmploymentComparison(employmentStats)}
            </div>
            
            <div class="report-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button id="export-pdf-btn" class="pdf-export-btn">
                    <i class="fas fa-file-pdf"></i> Export Comprehensive PDF Report
                </button>
                <button id="export-summary-btn" class="action-btn" style="background: #4caf50;">
                    <i class="fas fa-file-excel"></i> Export Summary Report
                </button>
            </div>
        `;
        
        // Add event listeners for export buttons
        document.getElementById('export-pdf-btn').addEventListener('click', generateComprehensivePDFReport);
        document.getElementById('export-summary-btn').addEventListener('click', exportSummaryReport);
        
        reportsContainer.style.display = 'block';
    }

    // Core Data Management Functions
    function loadApplicantsDataWithRetry() {
        let retries = 3;
        
        function attemptLoad() {
            try {
                const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants') || '[]');
                const importedData = JSON.parse(localStorage.getItem('importedData') || '[]');
                
                if (savedApplicants.length === 0 && retries > 0) {
                    if (syncManager.restoreBackupIfNeeded()) {
                        setTimeout(attemptLoad, 100);
                    }
                } else {
                    displayMainApplicants(savedApplicants);
                    displayImportedData(importedData);
                }
                
            } catch (error) {
                console.error('Error loading data:', error);
                if (retries > 0) {
                    retries--;
                    setTimeout(attemptLoad, 500);
                } else {
                    showNotification('Failed to load data after multiple attempts', 'error');
                }
            }
        }
        
        attemptLoad();
    }

    function displayMainApplicants(applicants) {
        if (!elements.mainApplicantTable) return;
        
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (applicants.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 43;
            cell.className = 'no-results';
            cell.textContent = 'No applicants found';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        applicants.forEach((applicant, index) => {
            const row = document.createElement('tr');

            // Debug: Check what suffix data we have
            console.log('Applicant suffix data:', {
                name: applicant.NAME,
                suffix: applicant['SUFFIX'],
                suffixRaw: applicant.SUFFIX,
                allKeys: Object.keys(applicant)
            });
            
            // Add cells for each column
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
                
                // Style specific columns
                if (colIndex === 0) {
                    cell.style.fontFamily = 'monospace';
                    cell.style.fontSize = '10px';
                }
                if (colIndex === 5) {
                    cell.style.fontSize = '10px';
                }
                if (colIndex === 11) {
                    cell.style.textAlign = 'center';
                }
                
                row.appendChild(cell);
            });
            
            // Actions cell
            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';
            
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';

            // View button
            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'View Applicant Details';
            viewBtn.addEventListener('click', function() {
                openViewModal(applicant);
            });
            
            // Edit button
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Edit Applicant';
            editBtn.addEventListener('click', function() {
                openEditModal(applicant);
            });
            
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete Applicant';
            deleteBtn.addEventListener('click', function() {
                const applicantId = applicant['SRS ID'] || applicant.ID;
                if (confirm('Are you sure you want to delete this applicant?')) {
                    deleteApplicant(applicantId);
                }
            });
            
            // Download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.title = 'Download Data';
            downloadBtn.addEventListener('click', function() {
                downloadApplicantData(applicant);
            });
            
            actionButtons.appendChild(viewBtn);
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(downloadBtn);
            actionButtons.appendChild(deleteBtn);
            actionsCell.appendChild(actionButtons);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });
    }

    function getSuffixValue(applicant) {
        // Check multiple possible field names for suffix
        const suffix = applicant['SUFFIX'] || applicant.SUFFIX || applicant.suffix || '';
        
        if (suffix && suffix.toString().trim() !== '' && suffix !== 'N/A' && suffix !== 'null') {
            return suffix.toString().trim();
        }
        
        return 'N/A';
    }

    function displayImportedData(data) {
        if (!elements.importedTable) return;
        
        const tbody = elements.importedTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = elements.importedTable.querySelectorAll('th').length;
            cell.className = 'no-results';
            cell.textContent = 'No imported data';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        data.forEach((record, index) => {
            const row = document.createElement('tr');
            
            // Add basic information cells
            const basicInfo = [
                record['SRS ID'] || `IMP-${index + 1}`,
                record['LAST NAME'] || 'N/A',
                record['FIRST NAME'] || 'N/A',
                record['MIDDLE NAME'] || 'N/A',
                record['NAME'] || 'N/A',
                record['DATE OF BIRTH'] || record['BDATE'] || 'N/A',
                record['AGE'] || 'N/A',
                record['SEX'] || 'N/A',
                record['CIVIL STATUS'] || 'N/A',
                record['STREET ADDRESS'] || 'N/A',
                record['BARANGAY'] || 'N/A',
                record['CITY/MUNICIPALITY'] || 'N/A',
                record['PROVINCE'] || 'N/A',
                record['CELLPHONE'] || 'N/A'
            ];
            
            basicInfo.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                cell.className = 'compact-cell';
                row.appendChild(cell);
            });
            
            // Add remaining cells...
            const remainingInfo = [
                record['EMP. STATUS'] || 'N/A',
                record['If Employed/Self Employment'] || 'N/A',
                record['EDUC LEVEL'] || 'N/A',
                record['COURSE'] || 'N/A',
                record['SKILLS'] || 'N/A',
                record['WORK EXPERIENCE'] || 'N/A',
                record['SECTOR'] || 'N/A',
                record['SPECIFIC PROGRAM'] || 'N/A',
                record['REMARKS'] || 'N/A',
                record['REG. DATE'] || 'N/A'
            ];
            
            remainingInfo.forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                cell.className = 'compact-cell';
                row.appendChild(cell);
            });
            
            // Actions cell
            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';
            actionsCell.innerHTML = `
                <div class="action-buttons">
                    <button class="download-btn" title="Download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="delete-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add event listeners to action buttons
            const downloadBtn = actionsCell.querySelector('.download-btn');
            const deleteBtn = actionsCell.querySelector('.delete-btn');
            
            downloadBtn.addEventListener('click', function() {
                downloadApplicantData(record);
            });
            
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this imported record?')) {
                    deleteImportedRecord(index);
                }
            });
            
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
    }

    function saveMainApplicants(applicants) {
        try {
            localStorage.setItem('mainApplicants', JSON.stringify(applicants));
            console.log('✅ Saved', applicants.length, 'applicants');
        } catch (error) {
            console.error('❌ Error saving applicants:', error);
            showNotification('Error saving applicant data: ' + error.message, 'error');
        }
    }

    function loadImportedData() {
        try {
            const importedData = JSON.parse(localStorage.getItem('importedData')) || [];
            if (importedData.length > 0) {
                displayImportedData(importedData);
            }
        } catch (error) {
            console.error('Error loading imported data:', error);
        }
    }

    // Utility Functions
    function generateUniqueId() {
        return 'SRS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function showNotification(message, type, notificationElement = null) {
        const targetElement = notificationElement || elements.notification;
        if (!targetElement) {
            console.warn('Notification element not found');
            return;
        }

        targetElement.textContent = message;
        targetElement.className = 'notification';
        targetElement.classList.add(type);
        targetElement.style.display = 'block';
        
        setTimeout(() => {
            targetElement.style.display = 'none';
        }, 5000);
    }

    function showUploadNotification(message, type) {
        showNotification(message, type, elements.uploadNotification);
    }

    function displayCurrentUser() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const header = document.querySelector('header .header-content');
            if (header) {
                const userInfo = document.createElement('div');
                userInfo.className = 'user-info';
                userInfo.innerHTML = `
                    <span>Welcome, ${currentUser}</span>
                    <button id="logout-btn" class="logout-btn">Logout</button>
                `;
                header.appendChild(userInfo);

                document.getElementById('logout-btn').addEventListener('click', function() {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('currentUser');
                    window.location.href = 'login.html';
                });
            }
        }
    }

    function deleteApplicant(id) {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        const updatedApplicants = savedApplicants.filter(applicant => {
            const applicantId = applicant['SRS ID'] || applicant.ID;
            return applicantId !== id;
        });
        
        if (updatedApplicants.length === savedApplicants.length) {
            showNotification('Applicant not found. Delete operation cancelled.', 'error');
            return;
        }
        
        saveMainApplicants(updatedApplicants);
        displayMainApplicants(updatedApplicants);
        
        // Remove photo
        localStorage.removeItem(`photo_${id}`);
        
        // Sync deletion
        if (!syncManager.isOnline) {
            syncManager.addPendingChange({
                type: 'delete_applicant',
                data: id
            });
        } else {
            syncManager.syncDeleteApplicant(id);
        }
        
        showNotification('Applicant deleted successfully!', 'success');
    }

        function deleteImportedRecord(index) {
        const importedData = JSON.parse(localStorage.getItem('importedData')) || [];
        importedData.splice(index, 1);
        localStorage.setItem('importedData', JSON.stringify(importedData));
        displayImportedData(importedData);
        showNotification('Imported record deleted successfully!', 'success');
    }

    function checkApplicantDuplicate(applicantData) {
        try {
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            
            if (savedApplicants.length === 0) {
                return { hasMatches: false, matches: [] };
            }

            const matches = [];
            const newName = (applicantData.NAME || '').toString().trim();
            const newBdate = (applicantData.BDATE || applicantData['DATE OF BIRTH'] || '').toString().trim();

            if (!newName || newName === 'N/A' || newName === '' || newName === 'null') {
                return { hasMatches: false, matches: [] };
            }

            // Parse the new applicant's name components
            const newNameParts = parseFullName(newName);
            const newLastName = (applicantData['LAST NAME'] || newNameParts.lastName || '').toString().trim().toLowerCase();
            const newFirstName = (applicantData['FIRST NAME'] || newNameParts.firstName || '').toString().trim().toLowerCase();
            const newMiddleName = (applicantData['MIDDLE NAME'] || newNameParts.middleName || '').toString().trim().toLowerCase();
            const newSuffix = (applicantData.SUFFIX || newNameParts.suffix || '').toString().trim().toLowerCase();

            for (const existingApp of savedApplicants) {
                const existingName = (existingApp.NAME || '').toString().trim();
                const existingBdate = (existingApp.BDATE || existingApp['DATE OF BIRTH'] || '').toString().trim();

                if (!existingName || existingName === 'N/A' || existingName === '' || existingName === 'null') {
                    continue;
                }

                // Parse the existing applicant's name components
                const existingNameParts = parseFullName(existingName);
                const existingLastName = (existingApp['LAST NAME'] || existingNameParts.lastName || '').toString().trim().toLowerCase();
                const existingFirstName = (existingApp['FIRST NAME'] || existingNameParts.firstName || '').toString().trim().toLowerCase();
                const existingMiddleName = (existingApp['MIDDLE NAME'] || existingNameParts.middleName || '').toString().trim().toLowerCase();
                const existingSuffix = (existingApp.SUFFIX || existingNameParts.suffix || '').toString().trim().toLowerCase();

                // Check for name match (considering all components)
                const nameMatch = checkNameMatch(
                    newLastName, newFirstName, newMiddleName, newSuffix,
                    existingLastName, existingFirstName, existingMiddleName, existingSuffix
                );

                // Check birthday match (normalize dates first)
                const newBdateNormalized = normalizeDate(newBdate);
                const existingBdateNormalized = normalizeDate(existingBdate);
                const bdateMatch = newBdateNormalized && existingBdateNormalized && 
                                newBdateNormalized === existingBdateNormalized;

                if (nameMatch) {
                    matches.push({
                        existingApplicant: existingApp,
                        matchingFields: getMatchingFields(
                            newLastName, newFirstName, newMiddleName, newSuffix, newBdateNormalized,
                            existingLastName, existingFirstName, existingMiddleName, existingSuffix, existingBdateNormalized
                        ),
                        differences: getDifferences(
                            newLastName, newFirstName, newMiddleName, newSuffix, newBdateNormalized,
                            existingLastName, existingFirstName, existingMiddleName, existingSuffix, existingBdateNormalized
                        ),
                        sameNameDifferentBday: nameMatch && !bdateMatch,
                        nameMatch: nameMatch,
                        bdateMatch: bdateMatch
                    });
                }
            }

            return {
                hasMatches: matches.length > 0,
                matches: matches
            };
        } catch (error) {
            console.error('Error in duplicate check:', error);
            return { hasMatches: false, matches: [] };
        }
    }

    function parseFullName(fullName) {
        if (!fullName) return { lastName: '', firstName: '', middleName: '', suffix: '' };
        
        let name = fullName.toString().trim();
        let suffix = '';
        
        // Extract suffix (Sr., Jr., III, etc.)
        const suffixRegex = /\s+(Sr\.|Jr\.|I{1,3}|IV|V|VI{0,3}|IX|X{1,3})$/i;
        const suffixMatch = name.match(suffixRegex);
        if (suffixMatch) {
            suffix = suffixMatch[1];
            name = name.replace(suffixRegex, '').trim();
        }
        
        // Split by comma for "Last, First Middle" format
        let parts = [];
        if (name.includes(',')) {
            const commaParts = name.split(',');
            const lastName = commaParts[0].trim();
            const rest = commaParts.slice(1).join(',').trim();
            parts = [lastName, ...rest.split(/\s+/)];
        } else {
            // Split by spaces for "First Middle Last" format
            parts = name.split(/\s+/);
        }
        
        let lastName = '';
        let firstName = '';
        let middleName = '';
        
        if (parts.length >= 2) {
            if (name.includes(',')) {
                // "Last, First Middle" format
                lastName = parts[0];
                firstName = parts[1] || '';
                middleName = parts.slice(2).join(' ') || '';
            } else {
                // "First Middle Last" format
                firstName = parts[0] || '';
                lastName = parts[parts.length - 1] || '';
                middleName = parts.slice(1, parts.length - 1).join(' ') || '';
            }
        } else if (parts.length === 1) {
            firstName = parts[0];
        }
        
        return {
            lastName: lastName,
            firstName: firstName,
            middleName: middleName,
            suffix: suffix
        };
    }

    function checkNameMatch(newLast, newFirst, newMiddle, newSuffix, existingLast, existingFirst, existingMiddle, existingSuffix) {
        // If any name component is empty, be more lenient
        if (!newLast || !existingLast || !newFirst || !existingFirst) {
            return false;
        }
        
        // Check last name and first name match (most important)
        const lastAndFirstMatch = newLast === existingLast && newFirst === existingFirst;
        
        if (!lastAndFirstMatch) {
            return false;
        }
        
        // Check middle name (be more lenient with middle names)
        const middleNameMatch = !newMiddle || !existingMiddle || 
                            newMiddle === existingMiddle || 
                            (newMiddle.charAt(0) === existingMiddle.charAt(0) && newMiddle.charAt(0) !== '');
        
        // Check suffix (be more lenient with suffixes)
        const suffixMatch = !newSuffix || !existingSuffix || 
                        newSuffix === existingSuffix;
        
        return lastAndFirstMatch && middleNameMatch && suffixMatch;
    }

    function getMatchingFields(newLast, newFirst, newMiddle, newSuffix, newBdate, existingLast, existingFirst, existingMiddle, existingSuffix, existingBdate) {
        const matchingFields = [];
        
        if (newLast === existingLast) matchingFields.push('Last Name');
        if (newFirst === existingFirst) matchingFields.push('First Name');
        if (newMiddle && existingMiddle && newMiddle === existingMiddle) matchingFields.push('Middle Name');
        if (newSuffix && existingSuffix && newSuffix === existingSuffix) matchingFields.push('Suffix');
        if (newBdate && existingBdate && newBdate === existingBdate) matchingFields.push('Birthday');
        
        return matchingFields;
    }

    function getDifferences(newLast, newFirst, newMiddle, newSuffix, newBdate, existingLast, existingFirst, existingMiddle, existingSuffix, existingBdate) {
        const differences = [];
        
        if (newLast !== existingLast) differences.push('Last Name');
        if (newFirst !== existingFirst) differences.push('First Name');
        if (newMiddle !== existingMiddle) differences.push('Middle Name');
        if (newSuffix !== existingSuffix) differences.push('Suffix');
        if (newBdate !== existingBdate) differences.push('Birthday');
        
        return differences;
    }

    function normalizeDate(dateString) {
        if (!dateString || dateString === 'N/A' || dateString === '' || dateString === 'null') return '';
        
        try {
            console.log('Normalizing date:', dateString);
            
            // Handle Excel serial numbers
            if (!isNaN(dateString) && dateString > 25569) {
                const excelEpoch = new Date(1900, 0, 1);
                const date = new Date(excelEpoch.getTime() + (dateString - 1) * 24 * 60 * 60 * 1000);
                const normalized = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                console.log('Excel date normalized:', normalized);
                return normalized;
            }
            
            let dateObj;
            
            // Try different date formats
            if (dateString.includes('/')) {
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    let month = parts[0];
                    let day = parts[1];
                    let year = parts[2];
                    
                    // Handle 2-digit years
                    if (year.length === 2) {
                        year = '20' + year; // Assuming 20xx
                    }
                    
                    dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                }
            } else if (dateString.includes('-')) {
                dateObj = new Date(dateString);
            } else {
                // Try parsing as ISO format or other formats
                dateObj = new Date(dateString);
            }
            
            if (isNaN(dateObj.getTime())) {
                console.log('Invalid date, returning original:', dateString);
                return dateString; // Return original if we can't parse it
            }
            
            // Return in consistent format: MM/DD/YYYY
            const normalized = `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
            console.log('Date normalized:', normalized);
            return normalized;
        } catch (error) {
            console.warn('Date normalization error:', error, 'for date:', dateString);
            return dateString; // Return original if error
        }
    }

    function showDuplicateConfirmation(applicantData, matches) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            
            let message = `<div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2 style="color: #ff9800;">
                        <i class="fas fa-exclamation-triangle"></i> Potential Duplicate Found
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <p><strong>The applicant you're adding matches existing applicant(s):</strong></p>`;
            
            matches.forEach((match, index) => {
                const existing = match.existingApplicant;
                const existingNameParts = parseFullName(existing.NAME || '');
                
                message += `
                    <div style="background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #ff9800;">
                        <h4 style="margin: 0 0 10px 0; color: #856404;">
                            <i class="fas fa-user"></i> 
                            Existing Applicant #${index + 1}
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div>
                                <strong>Name Details:</strong><br>
                                <table style="width: 100%; font-size: 12px; margin-top: 5px;">
                                    <tr><td><strong>Last:</strong></td><td>${existingNameParts.lastName || 'N/A'}</td></tr>
                                    <tr><td><strong>First:</strong></td><td>${existingNameParts.firstName || 'N/A'}</td></tr>
                                    <tr><td><strong>Middle:</strong></td><td>${existingNameParts.middleName || 'N/A'}</td></tr>
                                    <tr><td><strong>Suffix:</strong></td><td>${existingNameParts.suffix || 'N/A'}</td></tr>
                                </table>
                            </div>
                            <div>
                                <strong>Other Information:</strong><br>
                                <table style="width: 100%; font-size: 12px; margin-top: 5px;">
                                    <tr><td><strong>Birthday:</strong></td><td>${existing.BDATE || existing['DATE OF BIRTH'] || 'N/A'}</td></tr>
                                    <tr><td><strong>Program:</strong></td><td>${existing['PROGRAM CATEGORY'] || 'Not specified'}</td></tr>
                                    <tr><td><strong>Status:</strong></td><td>${existing['PROGRAM STATUS'] || 'No status'}</td></tr>
                                </table>
                            </div>
                        </div>
                        <div style="margin-top: 10px; font-size: 12px;">
                            <strong>Matching Fields:</strong> 
                            <span style="color: #d32f2f;">${match.matchingFields.join(', ')}</span>
                            ${match.differences.length > 0 ? 
                            `<br><strong>Differences:</strong> <span style="color: #2196f3;">${match.differences.join(', ')}</span>` : 
                            ''}
                        </div>
                    </div>`;
            });
            
            // Show new applicant details
            const newNameParts = parseFullName(applicantData.NAME || '');
            message += `
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 15px 0;">
                        <p><strong>New Applicant Details:</strong></p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div>
                                <strong>Name Details:</strong><br>
                                <table style="width: 100%; font-size: 12px; margin-top: 5px;">
                                    <tr><td><strong>Last:</strong></td><td>${newNameParts.lastName || 'N/A'}</td></tr>
                                    <tr><td><strong>First:</strong></td><td>${newNameParts.firstName || 'N/A'}</td></tr>
                                    <tr><td><strong>Middle:</strong></td><td>${newNameParts.middleName || 'N/A'}</td></tr>
                                    <tr><td><strong>Suffix:</strong></td><td>${newNameParts.suffix || 'N/A'}</td></tr>
                                </table>
                            </div>
                            <div>
                                <strong>Other Information:</strong><br>
                                <table style="width: 100%; font-size: 12px; margin-top: 5px;">
                                    <tr><td><strong>Birthday:</strong></td><td>${applicantData.BDATE || applicantData['DATE OF BIRTH'] || 'N/A'}</td></tr>
                                    <tr><td><strong>Program:</strong></td><td>${applicantData['PROGRAM CATEGORY'] || 'Not specified'}</td></tr>
                                    <tr><td><strong>Phone:</strong></td><td>${applicantData.CELLPHONE || 'Not provided'}</td></tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <p><strong>Do you want to proceed with adding this applicant?</strong></p>
                    <p style="font-size: 12px; color: #666;">
                        <i class="fas fa-info-circle"></i> 
                        Only proceed if this is definitely a different person.
                    </p>
                </div>
                <div class="modal-footer">
                    <button id="cancel-add" class="cancel-btn" style="margin-right: 10px;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button id="add-anyway" class="save-btn" style="background: #ff9800;">
                        <i class="fas fa-user-plus"></i> Add Anyway
                    </button>
                </div>
            </div>`;
            
            modal.innerHTML = message;
            document.body.appendChild(modal);
            
            document.getElementById('cancel-add').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(false);
            });
            
            document.getElementById('add-anyway').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve(true);
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    resolve(false);
                }
            });
        });
    }

    function highlightMatchingApplicants(matches) {
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        const existingHighlights = tbody.querySelectorAll('.duplicate-highlight');
        existingHighlights.forEach(row => {
            row.classList.remove('duplicate-highlight');
        });
        
        matches.forEach(match => {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const nameCell = row.querySelector('td:nth-child(2)'); 
                if (nameCell && nameCell.textContent.trim().toLowerCase() === match.existingApplicant.NAME.toLowerCase()) {
                    row.classList.add('duplicate-highlight');
                    
                    if (!hasScrolledToHighlight) {
                        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        hasScrolledToHighlight = true;
                    }
                }
            });
        });
    }

    function removeHighlights() {
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        const highlightedRows = tbody.querySelectorAll('.duplicate-highlight');
        highlightedRows.forEach(row => {
            row.classList.remove('duplicate-highlight');
        });
        
        hasScrolledToHighlight = false;
    }

    // Data Import and Processing Functions
    function smartImportData(jsonData) {
        if (jsonData.length === 0) {
            return [];
        }
        
        const processedData = jsonData.map((record, index) => {
            const processedRecord = {};
            
            const fieldMappings = getFormFieldMappings();
            
            Object.keys(fieldMappings).forEach(fieldKey => {
                const possibleLabels = fieldMappings[fieldKey];
                let value = findMatchingValue(record, possibleLabels);
                
                if (value) {
                    value = processFieldValue(fieldKey, value);
                }
                
                processedRecord[fieldKey] = value || 'N/A';
            });
            
            if (!processedRecord['NAME'] || processedRecord['NAME'] === 'N/A') {
                processedRecord['NAME'] = combineNameFromParts(record, processedRecord);
            }
            
            if (!processedRecord['SRS ID'] || processedRecord['SRS ID'] === 'N/A') {
                processedRecord['SRS ID'] = generateUniqueId();
            }
            
            processedRecord['DATE CREATED'] = new Date().toLocaleString();
            processedRecord['DATE LAST MODIFIED'] = new Date().toLocaleString();
            processedRecord['CREATED BY'] = 'System Import';
            processedRecord['LAST MODIFIED BY'] = 'System Import';
            
            return processedRecord;
        });
        
        return processedData;
    }

    function getFormFieldMappings() {
        return {
            'SRS ID': ['SRS ID', 'ID', 'Applicant ID', 'SRS_ID', 'srs id', 'id', 'applicant id', 'ApplicantID', 'SRSID'],
            'LAST NAME': ['LAST NAME', 'Last Name', 'LASTNAME', 'last name', 'Surname', 'Family Name', 'surname', 'lastname', 'Last_Name', 'LAST_NAME'],
            'FIRST NAME': ['FIRST NAME', 'First Name', 'FIRSTNAME', 'first name', 'Given Name', 'given name', 'firstname', 'First_Name', 'FIRST_NAME'],
            'MIDDLE NAME': ['MIDDLE NAME', 'Middle Name', 'MIDDLENAME', 'middle name', 'Middle Initial', 'middle initial', 'middlename', 'Middle_Name', 'MIDDLE_NAME'],
            'NAME': ['NAME', 'Full Name', 'FULL NAME', 'full name', 'Complete Name', 'Applicant Name', 'applicant name', 'Full_Name', 'FULL_NAME'],
            'BDATE': ['BDATE', 'Date of Birth', 'Birthday', 'BIRTH DATE', 'Birth Date', 'DOB', 'dob', 'birth date', 'Birthdate', 'BIRTHDATE'],
            'AGE': ['AGE', 'Age', 'age'],
            'SEX': ['SEX', 'Gender', 'SEX/GENDER', 'gender', 'GENDER', 'Sex'],
            'CIVIL STATUS': ['CIVIL STATUS', 'Civil Status', 'Status', 'Marital Status', 'civil status', 'Civil_Status', 'CIVIL_STATUS'],
            'STREET ADDRESS': ['STREET ADDRESS', 'Street Address', 'Address', 'STREET', 'Street', 'House No', 'House Number', 'Village', 'street address', 'Street_Address'],
            'BARANGAY': ['BARANGAY', 'Barangay', 'BRGY', 'Brgy', 'barangay', 'brgy', 'Barangay_Name'],
            'CITY/MUNICIPALITY': ['CITY/MUNICIPALITY', 'City/Municipality', 'City', 'Municipality', 'CITY', 'MUNICIPALITY', 'city', 'municipality', 'City_Municipality'],
            'PROVINCE': ['PROVINCE', 'Province', 'province'],
            'EMAIL': ['EMAIL', 'Email', 'Email Address', 'email', 'Email Address', 'E-mail', 'e-mail', 'email_address'],
            'CELLPHONE': ['CELLPHONE', 'Cellphone', 'Mobile', 'Mobile No', 'Contact No', 'Contact Number', 'Cellphone Number', 'Phone', 'phone', 'Mobile_Number', 'Contact_Number'],
            'EMP. STATUS': ['EMP. STATUS', 'Employment Status', 'EMP STATUS', 'Employment', 'employment status', 'Emp_Status', 'EMPLOYMENT_STATUS'],
            'EDUC LEVEL': ['EDUC LEVEL', 'Educational Level', 'Education', 'Educational Attainment', 'educ level', 'Education_Level'],
            'COURSE': ['COURSE', 'Course', 'Degree', 'College Course', 'course'],
            '4Ps': ['4Ps', '4PS', '4Ps Member', 'Pantawid Pamilya', '4ps', 'Four Ps'],
            'PWD': ['PWD', 'Person with Disability', 'PWD Status', 'pwd', 'Person_with_Disability'],
            'DISABILITY': ['DISABILITY', 'Disability', 'Type of Disability', 'disability'],
            'PREFERRED POSITION': ['PREFERRED POSITION', 'Preferred Position', 'Desired Position', 'Job Preference', 'preferred position', 'Preferred_Position'],
            'SKILLS': ['SKILLS', 'Skills', 'Competencies', 'skills'],
            'WORK EXPERIENCE': ['WORK EXPERIENCE', 'Work Experience', 'Experience', 'Employment History', 'work experience', 'Work_Experience'],
            'OFW': ['OFW', 'Overseas Filipino Worker', 'OFW Status', 'ofw', 'Overseas_Filipino_Worker'],
            'REG. DATE': ['REG. DATE', 'Registration Date', 'Date Registered', 'REG DATE', 'reg date', 'Registration_Date'],
            'REMARKS': ['REMARKS', 'Remarks', 'Notes', 'Comments', 'remarks'],
            'PROGRAM CATEGORY': ['PROGRAM CATEGORY', 'Program Category', 'Category', 'Sector', 'program category', 'Program_Category'],
            'SPECIFIC PROGRAM': ['SPECIFIC PROGRAM', 'Specific Program', 'Program', 'Service', 'specific program', 'Specific_Program'],
            'PROGRAM STATUS': ['PROGRAM STATUS', 'Program Status', 'Status', 'program status', 'Program_Status']
        };
    }

    function findMatchingValue(record, possibleLabels) {
        if (!record) return null;
        
        // First pass: exact match
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                if (recordKey.toLowerCase() === label.toLowerCase()) {
                    return record[recordKey];
                }
            }
        }
        
        // Second pass: contains match
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                const cleanRecordKey = recordKey.toLowerCase().replace(/[^a-z0-9]/g, '');
                const cleanLabel = label.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                if (cleanRecordKey.includes(cleanLabel) || cleanLabel.includes(cleanRecordKey)) {
                    return record[recordKey];
                }
            }
        }
        
        // Third pass: fuzzy match for common variations
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                const keyWords = recordKey.toLowerCase().split(/[\s_]+/);
                const labelWords = label.toLowerCase().split(/[\s_]+/);
                
                const matchCount = keyWords.filter(word => 
                    labelWords.some(lword => lword.includes(word) || word.includes(lword))
                ).length;
                
                if (matchCount >= Math.min(keyWords.length, labelWords.length)) {
                    return record[recordKey];
                }
            }
        }
        
        return null;
    }

    function processFieldValue(fieldKey, value) {
        if (!value && value !== 0) return 'N/A';
        
        value = String(value).trim();
        
        // Handle empty values
        if (value === '' || value === 'null' || value === 'undefined' || value === 'NaN' || value === 'NULL') {
            return 'N/A';
        }
        
        // Handle date fields
        if (fieldKey === 'BDATE' || fieldKey === 'REG. DATE') {
            return formatDateValue(value);
        }
        
        // Handle boolean fields
        const booleanFields = ['4Ps', 'PWD', 'OFW'];
        if (booleanFields.includes(fieldKey)) {
            return normalizeBooleanValue(value);
        }
        
        // Handle numeric fields
        const numericFields = ['AGE'];
        if (numericFields.includes(fieldKey) && !isNaN(value)) {
            return parseInt(value);
        }
        
        return value;
    }

    function normalizeBooleanValue(value) {
        if (!value) return 'No';
        
        const trueValues = ['yes', 'true', '1', 'y', 'check', 'checked', 'x', '✓', '✔', 'on'];
        const falseValues = ['no', 'false', '0', 'n', 'unchecked', '', 'off', 'null', 'undefined'];
        
        const lowerValue = value.toString().toLowerCase().trim();
        
        if (trueValues.includes(lowerValue)) return 'Yes';
        if (falseValues.includes(lowerValue)) return 'No';
        
        // If it's not clearly true/false, return the original value
        return value;
    }

    function formatDateValue(dateValue) {
        if (!dateValue) return 'N/A';
        
        try {
            if (!isNaN(dateValue) && dateValue > 25569) {
                const excelEpoch = new Date(1900, 0, 1);
                const date = new Date(excelEpoch.getTime() + (dateValue - 1) * 24 * 60 * 60 * 1000);
                return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            }
            
            let dateObj = new Date(dateValue);
            
            if (isNaN(dateObj.getTime())) {
                if (dateValue.includes('/')) {
                    const parts = dateValue.split('/');
                    if (parts.length === 3) {
                        const month = parts[0].padStart(2, '0');
                        const day = parts[1].padStart(2, '0');
                        const year = parts[2];
                        return `${month}/${day}/${year}`;
                    }
                }
                return dateValue;
            }
            
            return `${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getDate().toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
        } catch (error) {
            console.warn('Date parsing error:', error);
            return dateValue;
        }
    }

    function combineNameFromParts(record, processedRecord) {
        // Try to find name from various field combinations
        let lastName = processedRecord['LAST NAME'];
        let firstName = processedRecord['FIRST NAME'];
        let middleName = processedRecord['MIDDLE NAME'];
        
        // If we have partial name info, try to extract from other fields
        if ((lastName === 'N/A' || firstName === 'N/A') && processedRecord['NAME'] === 'N/A') {
            // Look for name fields in the original record
            for (const key in record) {
                const lowerKey = key.toLowerCase();
                if ((lowerKey.includes('name') || lowerKey.includes('full') || lowerKey.includes('complete')) && 
                    record[key] && record[key] !== 'N/A') {
                    
                    const fullName = record[key].toString().trim();
                    if (fullName && fullName !== 'N/A') {
                        return fullName;
                    }
                }
            }
        }
        
        // Build from parts if we have them
        lastName = (lastName && lastName !== 'N/A') ? lastName.trim() : '';
        firstName = (firstName && firstName !== 'N/A') ? firstName.trim() : '';
        middleName = (middleName && middleName !== 'N/A') ? middleName.trim() : '';
        
        if (lastName && firstName) {
            let fullName = `${lastName}, ${firstName}`;
            if (middleName) {
                fullName += ` ${middleName}`;
            }
            return fullName;
        }
        
        return 'N/A';
    }

    function validateImportedDataDuplicates(newApplicants) {
        console.log('🔄 Starting duplicate validation for file upload');
        
        const importedData = JSON.parse(localStorage.getItem('importedData')) || [];
        const mainApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];

        // Debug: Check what's happening
        debugDuplicateCheck(newApplicants);

        const duplicates = {
            inImported: [],
            inMain: [],
            unique: []
        };

        newApplicants.forEach((newApp) => {
            let isDuplicate = false;

            // Parse new applicant name components - handle different field names
            const newName = (newApp.NAME || newApp.name || newApp['Full Name'] || '').toString().trim();
            const newBdate = (newApp.BDATE || newApp.BDATE || newApp['DATE OF BIRTH'] || newApp['Date of Birth'] || newApp.birthday || '').toString().trim();
            
            console.log('Checking applicant:', newName, 'Birthday:', newBdate);

            if (!newName || newName === 'N/A' || newName === '' || newName === 'null') {
                duplicates.unique.push(newApp);
                return;
            }

            const newNameParts = parseFullName(newName);
            const newLastName = (newApp['LAST NAME'] || newApp['Last Name'] || newApp.lastName || newNameParts.lastName || '').toString().trim().toLowerCase();
            const newFirstName = (newApp['FIRST NAME'] || newApp['First Name'] || newApp.firstName || newNameParts.firstName || '').toString().trim().toLowerCase();
            const newMiddleName = (newApp['MIDDLE NAME'] || newApp['Middle Name'] || newApp.middleName || newNameParts.middleName || '').toString().trim().toLowerCase();
            const newSuffix = (newApp.SUFFIX || newApp.suffix || newNameParts.suffix || '').toString().trim().toLowerCase();
            const newBdateNormalized = normalizeDate(newBdate);

            console.log('Parsed name parts:', { newLastName, newFirstName, newMiddleName, newSuffix, newBdateNormalized });

            // Check imported data
            importedData.forEach((importedApp) => {
                if (isDetailedDuplicate(newApp, importedApp, newLastName, newFirstName, newMiddleName, newSuffix, newBdateNormalized)) {
                    console.log('✅ Duplicate found in imported data:', newName);
                    duplicates.inImported.push({
                        new: newApp,
                        existing: importedApp,
                        source: 'imported'
                    });
                    isDuplicate = true;
                }
            });

            // Check main applicants
            if (!isDuplicate) {
                mainApplicants.forEach((mainApp) => {
                    if (isDetailedDuplicate(newApp, mainApp, newLastName, newFirstName, newMiddleName, newSuffix, newBdateNormalized)) {
                        console.log('✅ Duplicate found in main applicants:', newName);
                        duplicates.inMain.push({
                            new: newApp,
                            existing: mainApp,
                            source: 'main'
                        });
                        isDuplicate = true;
                    }
                });
            }

            if (!isDuplicate) {
                console.log('✅ Unique applicant:', newName);
                duplicates.unique.push(newApp);
            }
        });

        console.log('Duplicate check results:', {
            total: newApplicants.length,
            inMain: duplicates.inMain.length,
            inImported: duplicates.inImported.length,
            unique: duplicates.unique.length
        });

        return duplicates;
    }

    function isDetailedDuplicate(newApp, existingApp, newLastName, newFirstName, newMiddleName, newSuffix, newBdateNormalized) {
        if (!newApp || !existingApp) return false;

        const existingName = (existingApp.NAME || existingApp.name || existingApp['Full Name'] || '').toString().trim();
        const existingBdate = (existingApp.BDATE || existingApp.BDATE || existingApp['DATE OF BIRTH'] || existingApp['Date of Birth'] || existingApp.birthday || '').toString().trim();

        console.log('Comparing:', {
            new: { name: newApp.NAME, bdate: newApp.BDATE },
            existing: { name: existingName, bdate: existingBdate }
        });

        if (!existingName || existingName === 'N/A' || existingName === '' || existingName === 'null') {
            return false;
        }

        // Parse existing applicant name components
        const existingNameParts = parseFullName(existingName);
        const existingLastName = (existingApp['LAST NAME'] || existingApp['Last Name'] || existingApp.lastName || existingNameParts.lastName || '').toString().trim().toLowerCase();
        const existingFirstName = (existingApp['FIRST NAME'] || existingApp['First Name'] || existingApp.firstName || existingNameParts.firstName || '').toString().trim().toLowerCase();
        const existingMiddleName = (existingApp['MIDDLE NAME'] || existingApp['Middle Name'] || existingApp.middleName || existingNameParts.middleName || '').toString().trim().toLowerCase();
        const existingSuffix = (existingApp.SUFFIX || existingApp.suffix || existingNameParts.suffix || '').toString().trim().toLowerCase();
        const existingBdateNormalized = normalizeDate(existingBdate);

        console.log('Name comparison:', {
            new: { last: newLastName, first: newFirstName, middle: newMiddleName, suffix: newSuffix },
            existing: { last: existingLastName, first: existingFirstName, middle: existingMiddleName, suffix: existingSuffix }
        });

        // Check name match using the same logic as manual entry
        const nameMatch = checkNameMatch(
            newLastName, newFirstName, newMiddleName, newSuffix,
            existingLastName, existingFirstName, existingMiddleName, existingSuffix
        );

        // Check birthday match
        const bdateMatch = newBdateNormalized && existingBdateNormalized && 
                        newBdateNormalized === existingBdateNormalized;

        console.log('Match results:', { nameMatch, bdateMatch, finalMatch: nameMatch && bdateMatch });

        return nameMatch && bdateMatch;
    }

    function isDuplicateByNameAndBirthday(app1, app2) {
        if (!app1 || !app2) return false;

        const name1 = (app1.NAME || app1.name || app1['Full Name'] || '').toString().trim();
        const name2 = (app2.NAME || app2.name || app2['Full Name'] || '').toString().trim();
        
        const bdate1 = (app1.BDATE || app1.bdate || app1['Date of Birth'] || '').toString().trim();
        const bdate2 = (app2.BDATE || app2.bdate || app2['Date of Birth'] || '').toString().trim();

        if (!name1 || name1 === 'N/A' || !name2 || name2 === 'N/A') {
            return false;
        }

        const nameMatch = name1.toLowerCase() === name2.toLowerCase();
        const bdateMatch = normalizeDate(bdate1) === normalizeDate(bdate2);

        return nameMatch && bdateMatch;
    }

    function showEnhancedImportValidationModal(validationResults, allApplicants) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            
            let message = `<div class="modal-content" style="max-width: 1000px; max-height: 85vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2 style="color: #ff9800;">
                        <i class="fas fa-search"></i> Import Data Validation
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                        <h3 style="margin: 0 0 10px 0; color: #1976d2;">
                            <i class="fas fa-chart-pie"></i> Validation Summary
                        </h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #2196f3;">${allApplicants.length}</div>
                                <div>Total Records</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #4caf50;">${validationResults.unique.length}</div>
                                <div>New Records</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #ff9800;">${validationResults.inImported.length}</div>
                                <div>In Imported Data</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #f44336;">${validationResults.inMain.length}</div>
                                <div>In Main Database</div>
                            </div>
                        </div>
                    </div>`;

            // Show duplicate details if any exist
            if (validationResults.inMain.length > 0 || validationResults.inImported.length > 0) {
                message += `
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #f44336; border-bottom: 2px solid #f44336; padding-bottom: 5px;">
                            <i class="fas fa-exclamation-triangle"></i> Duplicate Records Found
                        </h3>`;

                // Show main database duplicates
                if (validationResults.inMain.length > 0) {
                    message += `
                        <h4 style="color: #d32f2f; margin: 15px 0 10px 0;">
                            Duplicates in Main Database (${validationResults.inMain.length})
                        </h4>`;
                    
                    validationResults.inMain.slice(0, 3).forEach((dup, index) => {
                        const newNameParts = parseFullName(dup.new.NAME || '');
                        const existingNameParts = parseFullName(dup.existing.NAME || '');
                        
                        message += `
                            <div style="background: #ffebee; padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 4px solid #f44336;">
                                <div style="font-weight: bold; color: #c62828;">
                                    ${index + 1}. ${dup.new.NAME || 'N/A'}
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-top: 8px;">
                                    <div>
                                        <strong>New Record:</strong><br>
                                        Last: ${newNameParts.lastName || 'N/A'}<br>
                                        First: ${newNameParts.firstName || 'N/A'}<br>
                                        Birthday: ${dup.new.BDATE || dup.new['DATE OF BIRTH'] || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Existing Record:</strong><br>
                                        Last: ${existingNameParts.lastName || 'N/A'}<br>
                                        First: ${existingNameParts.firstName || 'N/A'}<br>
                                        Birthday: ${dup.existing.BDATE || dup.existing['DATE OF BIRTH'] || 'N/A'}
                                    </div>
                                </div>
                            </div>`;
                    });
                    
                    if (validationResults.inMain.length > 3) {
                        message += `<div style="text-align: center; color: #666; font-size: 12px; margin-top: 5px;">
                            ... and ${validationResults.inMain.length - 3} more duplicates
                        </div>`;
                    }
                }

                // Show imported data duplicates
                if (validationResults.inImported.length > 0) {
                    message += `
                        <h4 style="color: #ff9800; margin: 15px 0 10px 0;">
                            Duplicates in Imported Data (${validationResults.inImported.length})
                        </h4>`;
                    
                    validationResults.inImported.slice(0, 2).forEach((dup, index) => {
                        const newNameParts = parseFullName(dup.new.NAME || '');
                        const existingNameParts = parseFullName(dup.existing.NAME || '');
                        
                        message += `
                            <div style="background: #fff3e0; padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 4px solid #ff9800;">
                                <div style="font-weight: bold; color: #ef6c00;">
                                    ${index + 1}. ${dup.new.NAME || 'N/A'}
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; margin-top: 8px;">
                                    <div>
                                        <strong>New Record:</strong><br>
                                        Last: ${newNameParts.lastName || 'N/A'}<br>
                                        First: ${newNameParts.firstName || 'N/A'}<br>
                                        Birthday: ${dup.new.BDATE || 'N/A'}
                                    </div>
                                    <div>
                                        <strong>Existing in Imported:</strong><br>
                                        Last: ${existingNameParts.lastName || 'N/A'}<br>
                                        First: ${existingNameParts.firstName || 'N/A'}<br>
                                        Birthday: ${dup.existing.BDATE || 'N/A'}
                                    </div>
                                </div>
                            </div>`;
                    });
                }
                
                message += `</div>`;
            }

            // Show unique records preview
            if (validationResults.unique.length > 0) {
                message += `
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #4caf50; border-bottom: 2px solid #4caf50; padding-bottom: 5px;">
                            <i class="fas fa-user-check"></i> New Unique Records (${validationResults.unique.length})
                        </h3>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                            These records will be added as new entries.
                        </p>
                        <div style="max-height: 200px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 4px;">
                            <table style="width: 100%; font-size: 12px;">
                                <thead>
                                    <tr style="background: #e8f5e8;">
                                        <th style="padding: 8px; text-align: left;">Name</th>
                                        <th style="padding: 8px; text-align: left;">Birthday</th>
                                        <th style="padding: 8px; text-align: left;">Program</th>
                                    </tr>
                                </thead>
                                <tbody>`;
                
                validationResults.unique.slice(0, 10).forEach((applicant, index) => {
                    const nameParts = parseFullName(applicant.NAME || '');
                    message += `
                        <tr>
                            <td style="padding: 6px; border-bottom: 1px solid #eee;">
                                ${nameParts.lastName || ''}, ${nameParts.firstName || ''} 
                                ${nameParts.middleName ? nameParts.middleName.charAt(0) + '.' : ''}
                                ${nameParts.suffix ? ' ' + nameParts.suffix : ''}
                            </td>
                            <td style="padding: 6px; border-bottom: 1px solid #eee;">${applicant.BDATE || applicant['DATE OF BIRTH'] || 'N/A'}</td>
                            <td style="padding: 6px; border-bottom: 1px solid #eee;">${applicant['PROGRAM CATEGORY'] || 'Not specified'}</td>
                        </tr>`;
                });
                
                if (validationResults.unique.length > 10) {
                    message += `
                        <tr>
                            <td colspan="3" style="padding: 8px; text-align: center; color: #666; font-style: italic;">
                                ... and ${validationResults.unique.length - 10} more unique records
                            </td>
                        </tr>`;
                }
                
                message += `</tbody></table></div></div>`;
            }

            message += `
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 20px;">
                        <p><strong>Import Options:</strong></p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div style="background: #e8f5e8; padding: 15px; border-radius: 4px;">
                                <strong>Import Unique Only</strong><br>
                                <small>Add only ${validationResults.unique.length} new records (recommended)</small>
                            </div>
                            <div style="background: #fff3e0; padding: 15px; border-radius: 4px;">
                                <strong>Import All Records</strong><br>
                                <small>Add all ${allApplicants.length} records (including ${validationResults.inMain.length + validationResults.inImported.length} duplicates)</small>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; justify-content: space-between; padding: 15px 20px; border-top: 1px solid #e0e0e0;">
                    <button id="cancel-import" class="cancel-btn">
                        <i class="fas fa-times"></i> Cancel Import
                    </button>
                    <div style="display: flex; gap: 10px;">
                        <button id="import-unique" class="save-btn" style="background: #4caf50;" 
                            ${validationResults.unique.length === 0 ? 'disabled' : ''}>
                            <i class="fas fa-user-check"></i> 
                            Import Unique (${validationResults.unique.length})
                        </button>
                        <button id="import-all" class="save-btn" style="background: #ff9800;">
                            <i class="fas fa-users"></i> 
                            Import All (${allApplicants.length})
                        </button>
                    </div>
                </div>
            </div>`;

            modal.innerHTML = message;
            document.body.appendChild(modal);

            document.getElementById('cancel-import').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve({ action: 'cancel' });
            });

            document.getElementById('import-unique').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve({ action: 'unique', data: validationResults.unique });
            });

            document.getElementById('import-all').addEventListener('click', () => {
                document.body.removeChild(modal);
                resolve({ action: 'all', data: allApplicants });
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                    resolve({ action: 'cancel' });
                }
            });
        });
    }
    // Export Functions
    function exportApplicantsToExcel() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        if (savedApplicants.length === 0) {
            showNotification('No applicants to export', 'error');
            return;
        }
        
        try {
            const exportData = savedApplicants.map(applicant => {
                return {
                    'SRS ID': applicant['SRS ID'] || '',
                    'Last Name': applicant['LAST NAME'] || '',
                    'First Name': applicant['FIRST NAME'] || '',
                    'Middle Name': applicant['MIDDLE NAME'] || '',
                    'Suffix': applicant['SUFFIX'] || '',
                    'Full Name': applicant.NAME || '',
                    'Birth Date': applicant.BDATE || '',
                    'Age': applicant.AGE || '',
                    'Gender': applicant.SEX || '',
                    'Civil Status': applicant['CIVIL STATUS'] || '',
                    'Phone': applicant.CELLPHONE || '',
                    'Email': applicant.EMAIL || '',
                    'Barangay': applicant.BARANGAY || '',
                    'City/Municipality': applicant['CITY/MUNICIPALITY'] || '',
                    'Employment Status': applicant['EMP. STATUS'] || '',
                    'Education Level': applicant['EDUC LEVEL'] || '',
                    'Program Category': applicant['PROGRAM CATEGORY'] || '',
                    'Program Status': applicant['PROGRAM STATUS'] || '',
                    'Registration Date': applicant['REG. DATE'] || ''
                };
            });
            
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
            
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `applicants_${today}.xlsx`);
            
            showNotification('Applicants exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting applicants:', error);
            showNotification('Error exporting applicants: ' + error.message, 'error');
        }
    }

    function exportSummaryReport() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        if (savedApplicants.length === 0) {
            showNotification('No data available to export', 'error');
            return;
        }
        
        try {
            const summaryData = savedApplicants.map(applicant => ({
                'SRS ID': applicant['SRS ID'] || '',
                'Name': (applicant.NAME || '').substring(0, 100),
                'Age': applicant.AGE || '',
                'Sex': applicant.SEX || '',
                'Barangay': applicant.BARANGAY || '',
                'City/Municipality': applicant['CITY/MUNICIPALITY'] || '',
                'Employment Status': applicant['EMP. STATUS'] || '',
                'Program Category': applicant['PROGRAM CATEGORY'] || '',
                'Program Status': applicant['PROGRAM STATUS'] || '',
                'Registration Date': applicant['REG. DATE'] || '',
                'Contact Number': applicant.CELLPHONE || ''
            }));
            
            const worksheet = XLSX.utils.json_to_sheet(summaryData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants Summary");
            
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `applicants_summary_${today}.xlsx`);
            
            showNotification('Summary report exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting summary:', error);
            showNotification('Error exporting summary report: ' + error.message, 'error');
        }
    }

    function exportReportsToExcel() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        if (savedApplicants.length === 0) {
            showNotification('No data available to export', 'error');
            return;
        }
        
        try {
            const exportData = savedApplicants.map(applicant => {
                const cleanApplicant = {};
                
                Object.keys(applicant).forEach(key => {
                    let value = applicant[key];
                    
                    if (typeof value === 'string' && value.length > 1000) {
                        value = value.substring(0, 1000) + '... [truncated]';
                    }
                    
                    cleanApplicant[key] = value;
                });
                
                return cleanApplicant;
            });
            
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants Report");
            
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `applicants_report_${today}.xlsx`);
            
            showNotification('Report exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting report:', error);
            showNotification('Error exporting report: ' + error.message, 'error');
        }
    }

    function downloadApplicantData(applicant) {
        try {
            const exportApplicant = { ...applicant };
            
            if (!exportApplicant.NAME || exportApplicant.NAME === 'N/A') {
                const lastName = exportApplicant['LAST NAME'] || '';
                const firstName = exportApplicant['FIRST NAME'] || '';
                const middleName = exportApplicant['MIDDLE NAME'] || '';
                
                if (lastName && firstName) {
                    let fullName = `${lastName}, ${firstName}`;
                    if (middleName && middleName !== 'N/A') {
                        fullName += ` ${middleName}`;
                    }
                    exportApplicant.NAME = fullName;
                }
            }
            
            const worksheet = XLSX.utils.json_to_sheet([exportApplicant]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Applicant Data");
            
            const fileName = `applicant_${exportApplicant['SRS ID'] || exportApplicant.NAME || 'data'}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            showNotification('Applicant data downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading applicant data:', error);
            showNotification('Error downloading applicant data', 'error');
        }
    }

    function downloadApplicantAsPDF(applicant) {
        try {
            const printWindow = window.open('', 'CPESO Comprehensive Program Report');
            const applicantName = applicant.NAME || 'applicant';
            
            const photoId = applicant['SRS ID'] || applicant.ID;
            const savedPhoto = localStorage.getItem(`photo_${photoId}`);
            
            let photoHTML = '';
            if (savedPhoto) {
                photoHTML = `<img src="${savedPhoto}" style="max-width: 150px; max-height: 150px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 15px;">`;
            }
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Applicant Data - ${applicantName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .photo-section { text-align: center; margin-bottom: 20px; }
                        .section { margin-bottom: 25px; }
                        .section-title { background: #f5f5f5; padding: 8px 12px; font-weight: bold; border-left: 4px solid #1e88e5; margin-bottom: 10px; }
                        .field-row { display: flex; margin-bottom: 8px; }
                        .field-label { font-weight: bold; min-width: 200px; }
                        .field-value { flex: 1; }
                        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Applicant Information</h1>
                        <p>Generated on: ${new Date().toLocaleString()}</p>
                    </div>
                    
                    <div class="photo-section">
                        ${photoHTML}
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Personal Information</div>
                        <table>
                            <tr><td><strong>SRS ID:</strong></td><td>${applicant['SRS ID'] || 'N/A'}</td></tr>
                            <tr><td><strong>Full Name:</strong></td><td>${applicant.NAME || 'N/A'}</td></tr>
                            <tr><td><strong>Birth Date:</strong></td><td>${applicant.BDATE || 'N/A'}</td></tr>
                            <tr><td><strong>Age:</strong></td><td>${applicant.AGE || 'N/A'}</td></tr>
                            <tr><td><strong>Sex:</strong></td><td>${applicant.SEX || 'N/A'}</td></tr>
                            <tr><td><strong>Civil Status:</strong></td><td>${applicant['CIVIL STATUS'] || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Contact Information</div>
                        <table>
                            <tr><td><strong>Barangay:</strong></td><td>${applicant.BARANGAY || 'N/A'}</td></tr>
                            <tr><td><strong>City/Municipality:</strong></td><td>${applicant['CITY/MUNICIPALITY'] || 'N/A'}</td></tr>
                            <tr><td><strong>Province:</strong></td><td>${applicant.PROVINCE || 'N/A'}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>${applicant.EMAIL || 'N/A'}</td></tr>
                            <tr><td><strong>Cellphone:</strong></td><td>${applicant.CELLPHONE || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Employment & Education</div>
                        <table>
                            <tr><td><strong>Employment Status:</strong></td><td>${applicant['EMP. STATUS'] || 'N/A'}</td></tr>
                            <tr><td><strong>Education Level:</strong></td><td>${applicant['EDUC LEVEL'] || 'N/A'}</td></tr>
                            <tr><td><strong>Course:</strong></td><td>${applicant.COURSE || 'N/A'}</td></tr>
                            <tr><td><strong>Skills:</strong></td><td>${applicant.SKILLS || 'N/A'}</td></tr>
                            <tr><td><strong>Work Experience:</strong></td><td>${applicant['WORK EXPERIENCE'] || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Program Information</div>
                        <table>
                            <tr><td><strong>Program Category:</strong></td><td>${applicant['PROGRAM CATEGORY'] || 'N/A'}</td></tr>
                            <tr><td><strong>Specific Program:</strong></td><td>${applicant['SPECIFIC PROGRAM'] || 'N/A'}</td></tr>
                            <tr><td><strong>Program Status:</strong></td><td>${applicant['PROGRAM STATUS'] || 'N/A'}</td></tr>
                            <tr><td><strong>Registration Date:</strong></td><td>${applicant['REG. DATE'] || 'N/A'}</td></tr>
                            <tr><td><strong>Remarks:</strong></td><td>${applicant.REMARKS || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="no-print" style="margin-top: 30px; text-align: center;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #1e88e5; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Print Report
                        </button>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Error generating PDF report', 'error');
        }
    }

    function generateComprehensivePDFReport() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        if (savedApplicants.length === 0) {
            showNotification('No data available for report generation', 'error');
            return;
        }
        
        try {
            const printWindow = window.open('', 'CPESO Comprehensive Program Report');
            const today = new Date().toLocaleDateString();
            
            const programStats = calculateProgramStatistics(savedApplicants);
            const employmentStats = calculateEmploymentStatistics(savedApplicants);
            const demographicStats = calculateDemographicStatistics(savedApplicants);
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>CPESO Comprehensive Program Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 10px; }
                        .section { margin-bottom: 25px; }
                        .section-title { background: #f5f5f5; padding: 8px 12px; font-weight: bold; border-left: 4px solid #1e88e5; margin-bottom: 10px; }
                        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0; }
                        .stat-card { background: white; border: 1px solid #ddd; border-radius: 4px; padding: 15px; text-align: center; }
                        .stat-number { font-size: 24px; font-weight: bold; color: #1e88e5; }
                        .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
                        table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                        .chart-placeholder { background: #f9f9f9; border: 1px dashed #ccc; padding: 20px; text-align: center; margin: 10px 0; }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>CPESO Comprehensive Program Report</h1>
                        <p>Generated on: ${today}</p>
                        <p>Total Applicants: ${savedApplicants.length}</p>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Executive Summary</div>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-number">${savedApplicants.length}</div>
                                <div class="stat-label">Total Applicants</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${programStats.totalPrograms}</div>
                                <div class="stat-label">Active Programs</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${employmentStats.employed}</div>
                                <div class="stat-label">Employed</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">${employmentStats.unemployed}</div>
                                <div class="stat-label">Unemployed</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Program Enrollment</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Program Category</th>
                                    <th>Count</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>`);
            
            Object.keys(programStats.categories).forEach(category => {
                const count = programStats.categories[category];
                const percentage = ((count / savedApplicants.length) * 100).toFixed(1);
                printWindow.document.write(`
                    <tr>
                        <td>${category}</td>
                        <td>${count}</td>
                        <td>${percentage}%</td>
                    </tr>
                `);
            });
            
            printWindow.document.write(`
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Demographic Overview</div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div>
                                <h4>Gender Distribution</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Gender</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>`);
            
            Object.keys(demographicStats.gender).forEach(gender => {
                const count = demographicStats.gender[gender];
                printWindow.document.write(`
                    <tr>
                        <td>${gender}</td>
                        <td>${count}</td>
                    </tr>
                `);
            });
            
            printWindow.document.write(`
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h4>Age Distribution</h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Age Group</th>
                                            <th>Count</th>
                                        </tr>
                                    </thead>
                                    <tbody>`);
            
            Object.keys(demographicStats.ageGroups).forEach(ageGroup => {
                const count = demographicStats.ageGroups[ageGroup];
                printWindow.document.write(`
                    <tr>
                        <td>${ageGroup}</td>
                        <td>${count}</td>
                    </tr>
                `);
            });
            
            printWindow.document.write(`
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div class="no-print" style="margin-top: 30px; text-align: center;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #1e88e5; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Print Report
                        </button>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            setTimeout(() => {
                printWindow.print();
            }, 500);
            
        } catch (error) {
            console.error('Error generating comprehensive PDF:', error);
            showNotification('Error generating comprehensive report', 'error');
        }
    }

    // Statistics Calculation Functions
    function calculateProgramStatistics(applicants) {
        const stats = {
            totalPrograms: 0,
            categories: {},
            status: {},
            topPrograms: []
        };
        
        applicants.forEach(applicant => {
            const category = applicant['PROGRAM CATEGORY'] || 'Uncategorized';
            const status = applicant['PROGRAM STATUS'] || 'Unknown';
            
            stats.categories[category] = (stats.categories[category] || 0) + 1;
            stats.status[status] = (stats.status[status] || 0) + 1;
        });
        
        stats.totalPrograms = Object.keys(stats.categories).length;
        
        stats.topPrograms = Object.entries(stats.categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => ({ name, count }));
        
        return stats;
    }

    function calculateEmploymentStatistics(applicants) {
        const stats = {
            employed: 0,
            unemployed: 0,
            selfEmployed: 0,
            status: {}
        };
        
        applicants.forEach(applicant => {
            const empStatus = (applicant['EMP. STATUS'] || '').toString().toLowerCase();
            
            if (empStatus.includes('employ') && !empStatus.includes('unemploy')) {
                stats.employed++;
            } else if (empStatus.includes('unemploy')) {
                stats.unemployed++;
            } else if (empStatus.includes('self')) {
                selfEmployed++;
            }
            
            stats.status[empStatus] = (stats.status[empStatus] || 0) + 1;
        });
        
        return stats;
    }

    function calculateDemographicStatistics(applicants) {
        const stats = {
            gender: {},
            ageGroups: {},
            averageAge: 0,
            locations: {}
        };
        
        let totalAge = 0;
        let ageCount = 0;
        
        applicants.forEach(applicant => {
            const gender = applicant.SEX || 'Unknown';
            const age = parseInt(applicant.AGE) || 0;
            const location = applicant.BARANGAY || 'Unknown';
            
            stats.gender[gender] = (stats.gender[gender] || 0) + 1;
            stats.locations[location] = (stats.locations[location] || 0) + 1;
            
            if (age > 0) {
                totalAge += age;
                ageCount++;
                
                const ageGroup = getAgeGroup(age);
                stats.ageGroups[ageGroup] = (stats.ageGroups[ageGroup] || 0) + 1;
            }
        });
        
        stats.averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;
        
        return stats;
    }

    function getAgeGroup(age) {
        if (age < 18) return 'Under 18';
        if (age < 25) return '18-24';
        if (age < 35) return '25-34';
        if (age < 45) return '35-44';
        if (age < 55) return '45-54';
        if (age < 65) return '55-64';
        return '65+';
    }

    function generateEnhancedStatistics(programStats, employmentStats, demographicStats) {
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">${programStats.totalPrograms}</div>
                    <div class="stat-label">Active Programs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${employmentStats.employed}</div>
                    <div class="stat-label">Employed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${employmentStats.unemployed}</div>
                    <div class="stat-label">Unemployed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${demographicStats.averageAge}</div>
                    <div class="stat-label">Average Age</div>
                </div>
            </div>
        `;
    }

    function generateProgramPictograph(programStats) {
        const topPrograms = programStats.topPrograms;
        if (topPrograms.length === 0) return '<p>No program data available</p>';
        
        let html = '<div class="pictograph">';
        
        topPrograms.forEach(program => {
            const percentage = Math.round((program.count / Object.values(programStats.categories).reduce((a, b) => a + b, 0)) * 100);
            const barWidth = Math.max(10, percentage * 2);
            
            html += `
                <div class="pictograph-item">
                    <div class="program-name">${program.name}</div>
                    <div class="pictograph-bar" style="width: ${barWidth}px; background: #4caf50;"></div>
                    <div class="program-count">${program.count} (${percentage}%)</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    function generateGenderFigures(demographicStats) {
        const genderData = demographicStats.gender;
        if (Object.keys(genderData).length === 0) return '<p>No gender data available</p>';
        
        let html = '<div class="gender-figures">';
        let total = Object.values(genderData).reduce((a, b) => a + b, 0);
        
        Object.entries(genderData).forEach(([gender, count]) => {
            const percentage = Math.round((count / total) * 100);
            const icon = gender.toLowerCase().includes('female') ? '👩' : 
                        gender.toLowerCase().includes('male') ? '👨' : '👤';
            
            html += `
                <div class="gender-item">
                    <div class="gender-icon">${icon}</div>
                    <div class="gender-info">
                        <div class="gender-label">${gender}</div>
                        <div class="gender-count">${count} (${percentage}%)</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    function generateEmploymentComparison(employmentStats) {
        const total = employmentStats.employed + employmentStats.unemployed;
        if (total === 0) return '<p>No employment data available</p>';
        
        const employedPercent = Math.round((employmentStats.employed / total) * 100);
        const unemployedPercent = Math.round((employmentStats.unemployed / total) * 100);
        
        return `
            <div class="employment-comparison">
                <div class="employment-item employed">
                    <div class="employment-label">Employed</div>
                    <div class="employment-bar">
                        <div class="employment-fill" style="width: ${employedPercent}%"></div>
                    </div>
                    <div class="employment-percent">${employedPercent}%</div>
                </div>
                <div class="employment-item unemployed">
                    <div class="employment-label">Unemployed</div>
                    <div class="employment-bar">
                        <div class="employment-fill" style="width: ${unemployedPercent}%"></div>
                    </div>
                    <div class="employment-percent">${unemployedPercent}%</div>
                </div>
            </div>
        `;
    }

    function showProgramSuccessPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px; text-align: center;">
                <div class="modal-header">
                    <h2 style="color: #4caf50;">
                        <i class="fas fa-check-circle"></i> Success!
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <p><strong>Applicant "${applicantData.NAME}" has been successfully added!</strong></p>
                    <p style="color: #666; font-size: 14px;">
                        SRS ID: ${applicantData['SRS ID']}<br>
                        Program: ${applicantData['PROGRAM CATEGORY'] || 'Not specified'}
                    </p>
                </div>
                <div class="modal-footer">
                    <button id="add-another" class="save-btn" style="background: #2196f3; margin-right: 10px;">
                        <i class="fas fa-user-plus"></i> Add Another
                    </button>
                    <button id="view-applicant" class="save-btn" style="background: #4caf50;">
                        <i class="fas fa-list"></i> View All Applicants
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('add-another').addEventListener('click', function() {
            document.body.removeChild(modal);
            if (elements.addManualBtn) {
                elements.addManualBtn.click();
            }
        });
        
        document.getElementById('view-applicant').addEventListener('click', function() {
            document.body.removeChild(modal);
            if (elements.mainApplicantTable) {
                elements.mainApplicantTable.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function debugDuplicateCheck(newApplicants) {
        console.log('🔍 DEBUG: Starting duplicate check for file upload');
        
        const mainApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        console.log('Main applicants in database:', mainApplicants.length);
        
        if (mainApplicants.length > 0) {
            console.log('Sample main applicant:', mainApplicants[0]);
        }
        
        console.log('New applicants from file:', newApplicants.length);
        if (newApplicants.length > 0) {
            console.log('Sample new applicant:', newApplicants[0]);
        }
        
        // Check first new applicant against all main applicants
        if (newApplicants.length > 0 && mainApplicants.length > 0) {
            const testNewApp = newApplicants[0];
            console.log('Testing first new applicant:', testNewApp.NAME);
            
            mainApplicants.forEach((mainApp, index) => {
                const isDup = isDetailedDuplicate(testNewApp, mainApp, 
                    (testNewApp['LAST NAME'] || '').toLowerCase(),
                    (testNewApp['FIRST NAME'] || '').toLowerCase(),
                    (testNewApp['MIDDLE NAME'] || '').toLowerCase(),
                    (testNewApp.SUFFIX || '').toLowerCase(),
                    normalizeDate(testNewApp.BDATE || testNewApp['DATE OF BIRTH'])
                );
                
                if (isDup) {
                    console.log(`✅ DUPLICATE FOUND at index ${index}:`, mainApp.NAME);
                }
            });
        }
    }

    // Replace the current zero unemployment function with:
    function openZeroUnemploymentPage() {
        // Store current state if needed
        localStorage.setItem('lastPage', 'applicants');
        localStorage.setItem('currentProgramFilter', 'Zero Unemployment');
        
        // Redirect to dedicated page
        window.location.href = 'zero-unemployment.html';
    }

    // Update the event listener
    if (elements.zeroUnemploymentTab) {
        elements.zeroUnemploymentTab.addEventListener('click', function(e) {
            e.preventDefault();
            openZeroUnemploymentPage();
        });
    }

    // Modify the function that saves applicants
    function saveApplicantBasedOnCategory(applicantData) {
        const programCategory = applicantData['PROGRAM CATEGORY'];
        
        if (programCategory === 'Zero Unemployment') {
            // Save to Zero Unemployment storage
            const zeroApplicants = JSON.parse(localStorage.getItem('zeroUnemploymentApplicants')) || [];
            zeroApplicants.push(applicantData);
            localStorage.setItem('zeroUnemploymentApplicants', JSON.stringify(zeroApplicants));
        } else {
            // Save to main FEIS storage
            const mainApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            mainApplicants.push(applicantData);
            localStorage.setItem('mainApplicants', JSON.stringify(mainApplicants));
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const zeroUnemploymentTab = document.getElementById('zero-unemployment-tab');
        
        zeroUnemploymentTab.addEventListener('click', function() {
            // You can also pass parameters if needed
            const url = 'zero-unemployment.html';
            
            // Open in new tab
            window.open(url, '_blank');
            
            // Or if you want to track the click
            // trackAnalytics('zero_unemployment_click');
        });
        
        // For other filter tabs (if they filter data on same page)
        const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterRecords(filter);
            });
        });
    });

    function filterRecords(filter) {
        // Your existing filtering logic here
        console.log('Filtering by:', filter);
    }

    function initializeZeroUnemploymentNavigation() {
        const zeroUnemploymentTab = document.getElementById('zero-unemployment-tab');
        
        if (zeroUnemploymentTab) {
            zeroUnemploymentTab.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Zero Unemployment tab clicked');
                // Store current filter state
                localStorage.setItem('currentProgramFilter', 'Zero Unemployment');
                // Redirect to Zero Unemployment page
                window.location.href = 'zero-unemployment.html';
            });
        }
        
        // For other filter tabs (if they filter data on same page)
        const filterTabs = document.querySelectorAll('.filter-tab[data-filter]');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterRecords(filter);
            });
        });
    }

    function debugSuffixData() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        console.log('=== DEBUG SUFFIX DATA ===');
        savedApplicants.forEach((applicant, index) => {
            console.log(`Applicant ${index + 1}:`, {
                name: applicant.NAME,
                suffix: applicant['SUFFIX'],
                hasSuffix: applicant.hasOwnProperty('SUFFIX'),
                allFields: Object.keys(applicant).filter(key => key.toLowerCase().includes('suffix'))
            });
        });
    }

    class DataManager {
        constructor() {
            this.backupKey = 'cpeso_backup';
            this.maxBackups = 5;
        }
        
        createBackup() {
            const backup = {
                timestamp: new Date().toISOString(),
                applicants: JSON.parse(localStorage.getItem('mainApplicants') || '[]'),
                imported: JSON.parse(localStorage.getItem('importedData') || '[]')
            };
            
            const backups = JSON.parse(localStorage.getItem(this.backupKey) || '[]');
            backups.unshift(backup);
            
            // Keep only recent backups
            if (backups.length > this.maxBackups) {
                backups.splice(this.maxBackups);
            }
            
            localStorage.setItem(this.backupKey, JSON.stringify(backups));
        }
        
        restoreBackup(backupIndex = 0) {
            const backups = JSON.parse(localStorage.getItem(this.backupKey) || '[]');
            if (backups[backupIndex]) {
                localStorage.setItem('mainApplicants', JSON.stringify(backups[backupIndex].applicants));
                localStorage.setItem('importedData', JSON.stringify(backups[backupIndex].imported));
                return true;
            }
            return false;
        }
    }

    function getSuffixValue(applicant) {
        // Check multiple possible field names for suffix
        const suffixKeys = ['SUFFIX', 'Suffix', 'suffix', 'NAME_SUFFIX'];
        
        for (const key of suffixKeys) {
            if (applicant[key] && applicant[key].toString().trim() !== '' && 
                applicant[key] !== 'N/A' && applicant[key] !== 'null') {
                return applicant[key].toString().trim();
            }
        }
        
        return 'N/A';
    }

    // Ensure home dashboard initializes after DOM load
    document.addEventListener('DOMContentLoaded', function() {
        // Check authentication first
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }
        
        // Then initialize the dashboard
        initializeHomeDashboard();
    });

    

    // Initialize the application
    initializeApp();
});