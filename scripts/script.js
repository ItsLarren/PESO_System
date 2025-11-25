document.addEventListener('DOMContentLoaded', function () {
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
    };

    function initializeManualFormControls() {
        initializeManualPhotoControls();
        
        initializeDynamicFormElements();
        
        initializeAddEntryButtons();
        
        if (elements.manualApplicantForm) {
            elements.manualApplicantForm.addEventListener('submit', function(event) {
                event.preventDefault();
                if (validateManualForm(false)) {
                    addManualApplicant();
                }
            });
        }
    }

    function initializeViewModal() {
        if (elements.viewModal) {
            const closeBtn = elements.viewModal.querySelector('.close-view');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    elements.viewModal.style.display = 'none';
                });
            }
            
            elements.viewModal.addEventListener('click', function(event) {
                if (event.target === elements.viewModal) {
                    elements.viewModal.style.display = 'none';
                }
            });
        }
    }

    function openViewModal(applicant) {
        if (!elements.viewModal) return;
        
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
            'REGION': 'view-region',
            'EMAIL': 'view-email',
            'TELEPHONE': 'view-telephone',
            'CELLPHONE': 'view-cellphone',
            'EMP. STATUS': 'view-emp-status',
            'EMP. TYPE': 'view-emp-type',
            'EDUC LEVEL': 'view-educ-level',
            'COURSE': 'view-course',
            '4Ps': 'view-4ps',
            'PWD': 'view-pwd',
            'DISABILITY': 'view-disability',
            'PREFERRED POSITION': 'view-preferred-position',
            'SKILLS': 'view-skills',
            'WORK EXPERIENCE': 'view-work-experience',
            'OFW': 'view-ofw',
            'COUNTRY': 'view-country',
            'FORMER OFW': 'view-former-ofw',
            'LATEST COUNTRY': 'view-latest-country',
            'REG. DATE': 'view-reg-date',
            'REMARKS': 'view-remarks',
            'CREATED BY': 'view-created-by',
            'DATE CREATED': 'view-date-created',
            'LAST MODIFIED BY': 'view-last-modified-by',
            'DATE LAST MODIFIED': 'view-date-last-modified',
            'PROGRAM CATEGORY': 'view-program-category',
            'SPECIFIC PROGRAM': 'view-specific-program',
            'PROGRAM STATUS': 'view-program-status'
        };
        
        for (const field in applicant) {
            if (fieldToIdMap[field]) {
                const element = document.getElementById(fieldToIdMap[field]);
                if (element) {
                    if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
                        element.value = applicant[field] || '';
                    } else {
                        element.textContent = applicant[field] || 'N/A';
                    }
                }
            }
        }
        
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
        
        const editFullBtn = document.getElementById('edit-full-applicant-btn');
        if (editFullBtn) {
            editFullBtn.onclick = function() {
                openManualFormWithData(applicant);
            };
        }
        
        const downloadPdfBtn = document.getElementById('download-pdf-btn');
        const downloadExcelBtn = document.getElementById('download-excel-btn');
        
        if (downloadPdfBtn) {
            downloadPdfBtn.onclick = function() {
                downloadApplicantAsPDF(applicant);
            };
        }
        
        if (downloadExcelBtn) {
            downloadExcelBtn.onclick = function() {
                downloadApplicantData(applicant);
            };
        }
        
        elements.viewModal.style.display = 'block';
    }

    function downloadApplicantAsPDF(applicant) {
        try {
            const printWindow = window.open('', 'CPESO Comprehensive Program Report');
            const applicantName = applicant.NAME || 'applicant';
            const fileName = `applicant_${applicantName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            
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
                            <tr><td><strong>Last Name:</strong></td><td>${applicant['LAST NAME'] || 'N/A'}</td></tr>
                            <tr><td><strong>First Name:</strong></td><td>${applicant['FIRST NAME'] || 'N/A'}</td></tr>
                            <tr><td><strong>Middle Name:</strong></td><td>${applicant['MIDDLE NAME'] || 'N/A'}</td></tr>
                            <tr><td><strong>Birth Date:</strong></td><td>${applicant.BDATE || 'N/A'}</td></tr>
                            <tr><td><strong>Age:</strong></td><td>${applicant.AGE || 'N/A'}</td></tr>
                            <tr><td><strong>Sex:</strong></td><td>${applicant.SEX || 'N/A'}</td></tr>
                            <tr><td><strong>Civil Status:</strong></td><td>${applicant['CIVIL STATUS'] || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Contact Information</div>
                        <table>
                            <tr><td><strong>Street Address:</strong></td><td>${applicant['STREET ADDRESS'] || 'N/A'}</td></tr>
                            <tr><td><strong>Barangay:</strong></td><td>${applicant.BARANGAY || 'N/A'}</td></tr>
                            <tr><td><strong>City/Municipality:</strong></td><td>${applicant['CITY/MUNICIPALITY'] || 'N/A'}</td></tr>
                            <tr><td><strong>Province:</strong></td><td>${applicant.PROVINCE || 'N/A'}</td></tr>
                            <tr><td><strong>Region:</strong></td><td>${applicant.REGION || 'N/A'}</td></tr>
                            <tr><td><strong>Email:</strong></td><td>${applicant.EMAIL || 'N/A'}</td></tr>
                            <tr><td><strong>Telephone:</strong></td><td>${applicant.TELEPHONE || 'N/A'}</td></tr>
                            <tr><td><strong>Cellphone:</strong></td><td>${applicant.CELLPHONE || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Employment & Education</div>
                        <table>
                            <tr><td><strong>Employment Status:</strong></td><td>${applicant['EMP. STATUS'] || 'N/A'}</td></tr>
                            <tr><td><strong>Employment Type:</strong></td><td>${applicant['EMP. TYPE'] || 'N/A'}</td></tr>
                            <tr><td><strong>Education Level:</strong></td><td>${applicant['EDUC LEVEL'] || 'N/A'}</td></tr>
                            <tr><td><strong>Course:</strong></td><td>${applicant.COURSE || 'N/A'}</td></tr>
                            <tr><td><strong>Skills:</strong></td><td>${applicant.SKILLS || 'N/A'}</td></tr>
                            <tr><td><strong>Work Experience:</strong></td><td>${applicant['WORK EXPERIENCE'] || 'N/A'}</td></tr>
                            <tr><td><strong>Preferred Position:</strong></td><td>${applicant['PREFERRED POSITION'] || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Program Information</div>
                        <table>
                            <tr><td><strong>Program Category:</strong></td><td>${applicant['PROGRAM CATEGORY'] || 'N/A'}</td></tr>
                            <tr><td><strong>Specific Program:</strong></td><td>${applicant['SPECIFIC PROGRAM'] || 'N/A'}</td></tr>
                            <tr><td><strong>Program Status:</strong></td><td>${applicant['PROGRAM STATUS'] || 'N/A'}</td></tr>
                            <tr><td><strong>Registration Date:</strong></td><td>${applicant['REG. DATE'] || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">Additional Information</div>
                        <table>
                            <tr><td><strong>4Ps Member:</strong></td><td>${applicant['4Ps'] || 'N/A'}</td></tr>
                            <tr><td><strong>PWD:</strong></td><td>${applicant.PWD || 'N/A'}</td></tr>
                            <tr><td><strong>Disability:</strong></td><td>${applicant.DISABILITY || 'N/A'}</td></tr>
                            <tr><td><strong>OFW:</strong></td><td>${applicant.OFW || 'N/A'}</td></tr>
                            <tr><td><strong>Country:</strong></td><td>${applicant.COUNTRY || 'N/A'}</td></tr>
                            <tr><td><strong>Former OFW:</strong></td><td>${applicant['FORMER OFW'] || 'N/A'}</td></tr>
                            <tr><td><strong>Latest Country:</strong></td><td>${applicant['LATEST COUNTRY'] || 'N/A'}</td></tr>
                            <tr><td><strong>Remarks:</strong></td><td>${applicant.REMARKS || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">System Information</div>
                        <table>
                            <tr><td><strong>Created By:</strong></td><td>${applicant['CREATED BY'] || 'System'}</td></tr>
                            <tr><td><strong>Date Created:</strong></td><td>${applicant['DATE CREATED'] || 'N/A'}</td></tr>
                            <tr><td><strong>Last Modified By:</strong></td><td>${applicant['LAST MODIFIED BY'] || 'System'}</td></tr>
                            <tr><td><strong>Date Last Modified:</strong></td><td>${applicant['DATE LAST MODIFIED'] || 'N/A'}</td></tr>
                        </table>
                    </div>
                    
                    <div class="no-print" style="margin-top: 30px; text-align: center;">
                        <button onclick="window.print()" style="padding: 10px 20px; background: #1e88e5; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Print as PDF
                        </button>
                        <button onclick="window.close()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
                            Close
                        </button>
                    </div>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
            showNotification('PDF document generated. Please use the print dialog to save as PDF.', 'success');
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            showNotification('Error generating PDF: ' + error.message, 'error');
        }
    }

    let currentEditId = null;
    let stream = null;
    let capturedPhoto = null;
    let activeFilters = {};
    
    function initializeApp() {
        try {
            console.log('Initializing application...');
            
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                window.location.href = 'login.html';
                return;
            }

            setTimeout(() => {
                initializeManualForm();
                initializeCamera();
                initializeSearch();
                initializeEditModal();
                initializeFileUploads();
                initializeAdvancedFilters();
                initializeReporting();
                initializeViewModal();
                loadMainApplicants();
                loadImportedData();
                initializeDynamicFormElements();
                initializeAddEntryButtons();
                displayCurrentUser();

                // NEW: Add these initializations
                initializeNavigation();
                initializeEmployers();
                initializeVacancies();
                initializePrograms();
                
                loadMainApplicants();
                loadImportedData();
                initializeDynamicFormElements();
                initializeAddEntryButtons();
                displayCurrentUser();

                // Initialize the currently active tab
                const activeTab = document.querySelector('.nav-tab.active');
                if (activeTab) {
                    const activePage = activeTab.getAttribute('data-page');
                    loadPageData(activePage);
                } else {
                    // Default to applicants tab if no active tab
                    loadPageData('applicants');
                }

                // Load initial data
                loadDashboardStats();

                console.log('Application initialized successfully');
            }, 100);
            
        } catch (error) {
            console.error('Error during application initialization:', error);
            showNotification('Error initializing application: ' + error.message, 'error');
        }

        // Force initialize all modules
        setTimeout(() => {
            initializeEmployers();
            initializeVacancies();
            initializePrograms();
        }, 500);
    }

    function initializeDynamicFormElements() {
        const disabilityOthers = document.getElementById('manual-disability-others');
        const disabilitySpecify = document.getElementById('manual-disability-specify');
        
        if (disabilityOthers && disabilitySpecify) {
            disabilityOthers.addEventListener('change', function() {
                disabilitySpecify.style.display = this.checked ? 'block' : 'none';
            });
        }
        
        const empStatus = document.getElementById('manual-emp-status');
        const empStatusSpecify = document.getElementById('manual-emp-status-specify');
        const empStatusCountry = document.getElementById('manual-emp-status-country');
        
        if (empStatus) {
            empStatus.addEventListener('change', function() {
                empStatusSpecify.style.display = this.value === 'Other' ? 'block' : 'none';
                empStatusCountry.style.display = this.value === 'Unemployed - Terminated/Laidoff (abroad)' ? 'block' : 'none';
            });
        }
        
        const lookingWorkYes = document.getElementById('manual-looking-work-yes');
        const lookingWorkDuration = document.getElementById('manual-looking-work-duration');
        
        if (lookingWorkYes && lookingWorkDuration) {
            lookingWorkYes.addEventListener('change', function() {
                lookingWorkDuration.style.display = this.checked ? 'block' : 'none';
            });
        }
        
        // Work immediately when
        const workImmediatelyNo = document.getElementById('manual-work-immediately-no');
        const workImmediatelyWhen = document.getElementById('manual-work-immediately-when');
        
        if (workImmediatelyNo && workImmediatelyWhen) {
            workImmediatelyNo.addEventListener('change', function() {
                workImmediatelyWhen.style.display = this.checked ? 'block' : 'none';
            });
        }
        
        // 4Ps beneficiary ID
        const fourPsYes = document.getElementById('manual-4ps-yes');
        const fourPsId = document.getElementById('manual-4ps-id');
        
        if (fourPsYes && fourPsId) {
            fourPsYes.addEventListener('change', function() {
                fourPsId.style.display = this.checked ? 'block' : 'none';
            });
        }
        
        // Work location inputs
        const workLocationLocal = document.querySelector('input[name="manual-work-location"][value="Local"]');
        const workLocationOverseas = document.querySelector('input[name="manual-work-location"][value="Overseas"]');
        
        if (workLocationLocal) {
            workLocationLocal.addEventListener('change', function() {
                document.getElementById('manual-work-location-local1').style.display = this.checked ? 'block' : 'none';
                document.getElementById('manual-work-location-local2').style.display = this.checked ? 'block' : 'none';
                document.getElementById('manual-work-location-local3').style.display = this.checked ? 'block' : 'none';
                
                // Hide overseas inputs
                document.getElementById('manual-work-location-overseas1').style.display = 'none';
                document.getElementById('manual-work-location-overseas2').style.display = 'none';
                document.getElementById('manual-work-location-overseas3').style.display = 'none';
            });
        }
        
        if (workLocationOverseas) {
            workLocationOverseas.addEventListener('change', function() {
                document.getElementById('manual-work-location-overseas1').style.display = this.checked ? 'block' : 'none';
                document.getElementById('manual-work-location-overseas2').style.display = this.checked ? 'block' : 'none';
                document.getElementById('manual-work-location-overseas3').style.display = this.checked ? 'block' : 'none';
                
                // Hide local inputs
                document.getElementById('manual-work-location-local1').style.display = 'none';
                document.getElementById('manual-work-location-local2').style.display = 'none';
                document.getElementById('manual-work-location-local3').style.display = 'none';
            });
        }
        
        // Skills "Others" specification
        const skillOthers = document.getElementById('manual-skill-others');
        const skillOthersSpecify = document.getElementById('manual-skill-others-specify');
        
        if (skillOthers && skillOthersSpecify) {
            skillOthers.addEventListener('change', function() {
                skillOthersSpecify.style.display = this.checked ? 'block' : 'none';
            });
        }
    }

    // Initialize add entry buttons for dynamic tables
    function initializeAddEntryButtons() {
        // Training entries
        const addTrainingBtn = document.getElementById('add-training-btn');
        if (addTrainingBtn) {
            addTrainingBtn.addEventListener('click', function() {
                addTableEntry('training-entries', 'training');
            });
        }
        
        // Eligibility entries
        const addEligibilityBtn = document.getElementById('add-eligibility-btn');
        if (addEligibilityBtn) {
            addEligibilityBtn.addEventListener('click', function() {
                addTableEntry('eligibility-entries', 'eligibility');
            });
        }
        
        // Work experience entries
        const addWorkBtn = document.getElementById('add-work-btn');
        if (addWorkBtn) {
            addWorkBtn.addEventListener('click', function() {
                addTableEntry('work-entries', 'work');
            });
        }
    }

    // Add new row to tables
    function addTableEntry(tableId, type) {
        const tableBody = document.getElementById(tableId);
        if (!tableBody) return;
        
        const rowCount = tableBody.children.length + 1;
        
        let newRow;
        if (type === 'training') {
            newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" id="manual-training-course${rowCount}" name="manual-training-course${rowCount}"></td>
                <td><input type="text" id="manual-training-duration${rowCount}" name="manual-training-duration${rowCount}"></td>
                <td><input type="text" id="manual-training-institution${rowCount}" name="manual-training-institution${rowCount}"></td>
                <td><input type="text" id="manual-training-certificate${rowCount}" name="manual-training-certificate${rowCount}"></td>
            `;
        } else if (type === 'eligibility') {
            newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" id="manual-eligibility${rowCount}" name="manual-eligibility${rowCount}"></td>
                <td><input type="text" id="manual-eligibility-rating${rowCount}" name="manual-eligibility-rating${rowCount}"></td>
                <td><input type="date" id="manual-eligibility-date${rowCount}" name="manual-eligibility-date${rowCount}" class="date-input"></td>
                <td><input type="text" id="manual-license${rowCount}" name="manual-license${rowCount}"></td>
                <td><input type="date" id="manual-license-valid${rowCount}" name="manual-license-valid${rowCount}" class="date-input"></td>
            `;
        } else if (type === 'work') {
            newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td><input type="text" id="manual-work-company${rowCount}" name="manual-work-company${rowCount}"></td>
                <td><input type="text" id="manual-work-address${rowCount}" name="manual-work-address${rowCount}"></td>
                <td><input type="text" id="manual-work-position${rowCount}" name="manual-work-position${rowCount}"></td>
                <td><input type="text" id="manual-work-dates${rowCount}" name="manual-work-dates${rowCount}"></td>
                <td>
                    <select id="manual-work-status${rowCount}" name="manual-work-status${rowCount}">
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
        
        // Scroll to the bottom of the table container to show the new row
        const tableContainer = tableBody.closest('.table-container-scroll');
        if (tableContainer) {
            tableContainer.scrollLeft = tableContainer.scrollWidth;
        }
    }

    // Update the manual form submission handler to include all new fields
    function handleManualFormSubmission(e) {
        e.preventDefault();
        
        // Get all form values
        const formData = {
            // Personal Information
            surname: document.getElementById('manual-surname').value,
            firstName: document.getElementById('manual-first-name').value,
            middleName: document.getElementById('manual-middle-name').value,
            suffix: document.getElementById('manual-suffix').value,
            birthDate: document.getElementById('manual-bdate').value,
            placeOfBirth: document.getElementById('manual-place-birth').value,
            sex: document.getElementById('manual-sex').value,
            civilStatus: document.getElementById('manual-civil-status').value,
            tin: document.getElementById('manual-tin').value,
            gsisSss: document.getElementById('manual-gsis-sss').value,
            pagibig: document.getElementById('manual-pagibig').value,
            philhealth: document.getElementById('manual-philhealth').value,
            height: document.getElementById('manual-height').value,
            email: document.getElementById('manual-email').value,
            landline: document.getElementById('manual-landline').value,
            cellphone: document.getElementById('manual-cellphone').value,
            // ... continue for all other fields
        };
        
        // Process the form data and add to applicants array
        // ... existing code ...
        
        // Close modal and reset form
        document.getElementById('manualModal').style.display = 'none';
        document.getElementById('manualApplicantForm').reset();
        
        // Update applicant list display
        displayApplicants();
    }

    function initializeManualForm() {
        if (elements.addManualBtn) {
            elements.addManualBtn.addEventListener('click', openManualModal);
        }

        if (elements.closeManual) {
            elements.closeManual.addEventListener('click', closeManualModal);
        }

        if (elements.cancelManual) {
            elements.cancelManual.addEventListener('click', closeManualModal);
        }

        if (elements.manualModal) {
            elements.manualModal.addEventListener('click', function(event) {
                if (event.target === elements.manualModal) {
                    closeManualModal();
                }
            });
        }

        if (elements.manualApplicantForm) {
            const optionalFields = [
                'manual-street-address', 'manual-course', 'manual-disability',
                'manual-preferred-position', 'manual-skills', 'manual-work-experience',
                'manual-country', 'manual-latest-country', 'manual-remarks'
            ];
            
            optionalFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field) {
                    field.value = 'N/A';
                }
            });
            
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
            
            elements.manualApplicantForm.addEventListener('submit', function(event) {
                event.preventDefault();
                addManualApplicant();
            });
        }

        if (elements.manualUploadPhotoBtn && elements.manualPhotoInput) {
            elements.manualUploadPhotoBtn.addEventListener('click', function() {
                elements.manualPhotoInput.click();
            });
        }

        if (elements.manualPhotoInput) {
            elements.manualPhotoInput.addEventListener('change', function(e) {
                handleManualPhotoUpload(e);
            });
        }

        if (elements.manualRemovePhotoBtn) {
            elements.manualRemovePhotoBtn.addEventListener('click', function() {
                elements.manualPhotoPreview.src = '';
                elements.manualPhotoPreview.style.display = 'none';
                elements.manualPhotoPlaceholder.style.display = 'flex';
                elements.manualRemovePhotoBtn.style.display = 'none';
                elements.manualPhotoInput.value = '';
            });
        }

        if (elements.manualTakePhotoBtn) {
            elements.manualTakePhotoBtn.addEventListener('click', function() {
                currentEditId = 'manual_' + Date.now();
                openCamera();
            });
        }

        initializeManualFormControls();
        setDefaultManualFormValues();
    }

    function openManualModal() {
        if (!elements.manualModal) return;
        
        elements.manualApplicantForm.reset();
        elements.manualPhotoPreview.src = '';
        elements.manualPhotoPreview.style.display = 'none';
        elements.manualPhotoPlaceholder.style.display = 'flex';
        elements.manualRemovePhotoBtn.style.display = 'none';
        elements.manualPhotoInput.value = '';
        
        elements.manualModal.style.display = 'block';
    }

    function closeManualModal() {
        if (!elements.manualModal) return;
        elements.manualModal.style.display = 'none';
        
        // Reset to add mode
        const modalHeader = elements.manualModal.querySelector('.modal-header h2');
        if (modalHeader) {
            modalHeader.textContent = 'Add New Applicant';
            modalHeader.style.color = '';
        }
        
        elements.manualModal.classList.remove('manual-form-edit-mode');
        
        // Always reset to add mode when closing
        setTimeout(() => {
            resetManualFormToAddMode();
        }, 100);
        
        // Clear any temporary photo
        localStorage.removeItem('tempManualPhoto');
    }

    function handleManualPhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoData = e.target.result;
                    
                    // Set the photo preview immediately
                    elements.manualPhotoPreview.src = photoData;
                    elements.manualPhotoPreview.style.display = 'block';
                    elements.manualPhotoPlaceholder.style.display = 'none';
                    elements.manualRemovePhotoBtn.style.display = 'block';
                    
                    // Store temporarily for form submission
                    localStorage.setItem('tempManualPhoto', photoData);
                };
                reader.readAsDataURL(file);
            } else {
                showNotification('Please select a valid image file (JPEG, PNG, etc.).', 'error', elements.manualNotification);
            }
        }
    }

    // Update the remove photo function
    if (elements.manualRemovePhotoBtn) {
        elements.manualRemovePhotoBtn.addEventListener('click', function() {
            elements.manualPhotoPreview.src = '';
            elements.manualPhotoPreview.style.display = 'none';
            elements.manualPhotoPlaceholder.style.display = 'flex';
            elements.manualRemovePhotoBtn.style.display = 'none';
            elements.manualPhotoInput.value = '';
            
            // Remove temporary photo
            localStorage.removeItem('tempManualPhoto');
        });
    }

    function checkApplicantDuplicate(applicantData) {
        try {
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            
            // If no existing applicants, no duplicates
            if (savedApplicants.length === 0) {
                return {
                    hasMatches: false,
                    matches: []
                };
            }

            const matches = [];
            const newName = (applicantData.NAME || '').toString().toLowerCase().trim();
            const newBdate = (applicantData.BDATE || '').toString().trim();

            // Skip if new applicant has no name
            if (!newName || newName === 'n/a') {
                return {
                    hasMatches: false,
                    matches: []
                };
            }

            for (const existingApp of savedApplicants) {
                const existingName = (existingApp.NAME || '').toString().toLowerCase().trim();
                const existingBdate = (existingApp.BDATE || '').toString().trim();

                // Skip if existing applicant has no name
                if (!existingName || existingName === 'n/a') {
                    continue;
                }

                // Only consider it a duplicate if:
                // 1. Names match EXACTLY (case insensitive)
                // 2. AND birthdates match EXACTLY
                // 3. AND both are not "N/A"
                const nameMatch = newName === existingName;
                const bdateMatch = newBdate && existingBdate && 
                                newBdate === existingBdate &&
                                newBdate !== 'N/A' && 
                                existingBdate !== 'N/A';

                // STRICT duplicate: must have both name AND birthday match
                if (nameMatch && bdateMatch) {
                    console.log('🔴 STRICT DUPLICATE FOUND:', {
                        newName,
                        newBdate,
                        existingName,
                        existingBdate
                    });
                    
                    matches.push({
                        existingApplicant: existingApp,
                        matchingFields: ['Name', 'Birthday'],
                        differences: [],
                        sameNameDifferentBday: false
                    });
                }
                // Only name match (different birthday) - just log for info
                else if (nameMatch) {
                    console.log('🟡 SAME NAME, DIFFERENT BIRTHDAY:', {
                        newName,
                        newBdate,
                        existingName,
                        existingBdate
                    });
                }
            }

            console.log('🔍 Duplicate check result:', {
                totalApplicants: savedApplicants.length,
                matchesFound: matches.length,
                newApplicant: { name: newName, bdate: newBdate }
            });

            return {
                hasMatches: matches.length > 0,
                matches: matches
            };
        } catch (error) {
            console.error('Error in duplicate check:', error);
            return {
                hasMatches: false,
                matches: []
            };
        }
    }

    function showDuplicateConfirmation(applicantData, matches) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.style.display = 'block';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            
            let message = `<div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2 style="color: #ff9800;">Potential Duplicate Found</h2>
                </div>
                <div style="padding: 20px;">
                    <p><strong>The applicant you're adding matches existing applicant(s):</strong></p>`;
            
            matches.forEach((match, index) => {
                const existing = match.existingApplicant;
                message += `
                    <div style="background: #fff3cd; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #ff9800;">
                        <h4 style="margin: 0 0 10px 0; color: #856404;">
                            <i class="fas fa-exclamation-triangle"></i> 
                            Existing Applicant: <span style="background: #ffeb3b; padding: 2px 5px;">${existing.NAME}</span>
                            ${match.sameNameDifferentBday ? '<span style="color: #d32f2f; margin-left: 10px;">(Same Name, Different Birthday)</span>' : ''}
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div>
                                <strong>Current Program:</strong><br>
                                ${existing['PROGRAM CATEGORY'] || 'Not specified'} - ${existing['PROGRAM STATUS'] || 'No status'}
                            </div>
                            <div>
                                <strong>Birthday:</strong><br>
                                ${existing.BDATE || 'Not provided'}
                            </div>
                            <div>
                                <strong>Matching Fields:</strong>
                                <ul style="margin: 5px 0; padding-left: 20px; color: #d32f2f;">`;
                match.matchingFields.forEach(field => {
                    message += `<li>${field}</li>`;
                });
                message += `</ul>
                            </div>`;
                
                if (match.differences.length > 0) {
                    message += `
                            <div style="grid-column: 1 / -1;">
                                <strong>Differences Found:</strong>
                                <ul style="margin: 5px 0; padding-left: 20px; color: #388e3c;">`;
                    match.differences.forEach(diff => {
                        message += `<li><strong>${diff.field}:</strong> New="${diff.newValue}" vs Existing="${diff.existingValue}"</li>`;
                    });
                    message += `</ul>
                            </div>`;
                }
                
                message += `
                        </div>
                    </div>`;
            });
            
            message += `
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 15px 0;">
                        <p><strong>New Applicant Details:</strong></p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Name:</strong> ${applicantData.NAME}</div>
                            <div><strong>Birth Date:</strong> ${applicantData.BDATE || 'Not provided'}</div>
                            <div><strong>Program:</strong> ${applicantData['PROGRAM CATEGORY'] || 'Not specified'}</div>
                            <div><strong>Phone:</strong> ${applicantData.CELLPHONE || 'Not provided'}</div>
                        </div>
                    </div>
                    
                    <p><strong>Do you want to proceed with adding this applicant?</strong></p>
                    <p style="font-size: 14px; color: #666;">
                        ${matches.some(m => m.sameNameDifferentBday) 
                            ? 'This applicant has the same name but different birthday from existing applicant(s). Please verify if this is a different person.' 
                            : 'If this is a different person, click "Add Anyway". If it\'s the same person, click "Cancel".'}
                    </p>
                </div>
                <div class="modal-footer">
                    <button id="cancel-add" class="cancel-btn" style="margin-right: 10px;">Cancel</button>
                    <button id="add-anyway" class="save-btn" style="background: #ff9800;">Add Anyway</button>
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
                const nameCell = row.querySelector('td:nth-child(2)'); // Now column 2 (was 5)
                const bdateCell = row.querySelector('td:nth-child(3)'); // Now column 3 (was 6)
                
                if (nameCell && nameCell.textContent.trim().toLowerCase() === match.existingApplicant.NAME.toLowerCase()) {
                    row.classList.add('duplicate-highlight');
                    
                    // Add special styling for same name different birthday cases
                    if (match.sameNameDifferentBday) {
                        row.classList.add('same-name-different-bday');
                    }
                    
                    if (!window.hasScrolledToHighlight) {
                        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        window.hasScrolledToHighlight = true;
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
            row.classList.remove('same-name-different-bday');
        });
        
        window.hasScrolledToHighlight = false;
    }

    function addManualApplicant() {
        try {
            console.log('Starting manual applicant addition...');
            
            const formData = new FormData(elements.manualApplicantForm);
            const applicantData = {};
            
            // Get individual name parts
            const lastName = document.getElementById('manual-surname')?.value.trim() || '';
            const firstName = document.getElementById('manual-first-name')?.value.trim() || '';
            const middleName = document.getElementById('manual-middle-name')?.value.trim() || '';
            
            // Combine into full name
            if (lastName && firstName) {
                let fullName = `${lastName}, ${firstName}`;
                if (middleName) {
                    fullName += ` ${middleName}`;
                }
                applicantData['NAME'] = fullName;
            } else {
                applicantData['NAME'] = 'N/A';
            }
            
            // Store individual name parts
            applicantData['LAST NAME'] = lastName || 'N/A';
            applicantData['FIRST NAME'] = firstName || 'N/A';
            applicantData['MIDDLE NAME'] = middleName || 'N/A';
            
            // Process other form data
            formData.forEach((value, key) => {
                if (!key.startsWith('manual-surname') && !key.startsWith('manual-first-name') && 
                    !key.startsWith('manual-middle-name') && !key.startsWith('manual-name')) {
                    const fieldName = key.replace('manual-', '').toUpperCase().replace(/-/g, ' ');
                    applicantData[fieldName] = value || 'N/A';
                }
            });
            
            // Generate unique ID
            applicantData['SRS ID'] = generateUniqueId();
            
            // Process date field
            if (applicantData['BDATE']) {
                try {
                    const date = new Date(applicantData['BDATE']);
                    if (!isNaN(date.getTime())) {
                        applicantData['BDATE'] = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                    }
                } catch (error) {
                    console.warn('Date parsing error:', error);
                    applicantData['BDATE'] = 'N/A';
                }
            } else {
                applicantData['BDATE'] = 'N/A';
            }
            
            // Add system fields
            applicantData['REG. DATE'] = new Date().toLocaleDateString();
            applicantData['DATE CREATED'] = new Date().toLocaleString();
            applicantData['DATE LAST MODIFIED'] = new Date().toLocaleString();
            applicantData['CREATED BY'] = localStorage.getItem('currentUser') || 'Manual Entry';
            
            // Address fields
            applicantData['STREET ADDRESS'] = document.getElementById('manual-house-street')?.value.trim() || 'N/A';
            applicantData['BARANGAY'] = document.getElementById('manual-barangay')?.value.trim() || 'N/A';
            applicantData['CITY/MUNICIPALITY'] = document.getElementById('manual-city-municipality')?.value.trim() || 'N/A';
            applicantData['PROVINCE'] = document.getElementById('manual-province')?.value.trim() || 'N/A';

            console.log('📝 New applicant data:', applicantData);

            // Check for duplicates (with strict matching)
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
            console.error('❌ Error in addManualApplicant:', error);
            showNotification('Error adding applicant: ' + error.message, 'error', elements.manualNotification);
        }
    }

    function proceedWithAddingApplicant(applicantData) {
        try {
            // Generate a unique ID for the new applicant
            applicantData['SRS ID'] = generateUniqueId();
            
            // Add timestamps
            applicantData['DATE CREATED'] = new Date().toLocaleString();
            applicantData['DATE LAST MODIFIED'] = new Date().toLocaleString();
            applicantData['CREATED BY'] = localStorage.getItem('currentUser') || 'Manual Entry';
            
            // Handle photo
            const tempPhoto = localStorage.getItem('tempManualPhoto');
            if (tempPhoto) {
                const photoId = applicantData['SRS ID'];
                localStorage.setItem(`photo_${photoId}`, tempPhoto);
                localStorage.removeItem('tempManualPhoto');
                applicantData['PHOTO'] = tempPhoto;
            }
            
            // Save to main applicants
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            savedApplicants.push(applicantData);
            saveMainApplicants(savedApplicants);
            
            // Update display
            displayMainApplicants(savedApplicants);
            removeHighlights();
            
            // Close modal and show success
            closeManualModal();
            
            // Show appropriate program prompt
            showProgramSuccessPrompt(applicantData);
            
        } catch (error) {
            console.error('Error adding applicant:', error);
            showNotification('Error adding applicant: ' + error.message, 'error', elements.manualNotification);
        }
    }

    // Helper function to show success message
    function showProgramSuccessPrompt(applicantData) {
        const programCategory = applicantData['PROGRAM CATEGORY'] || '';
        const programLower = programCategory.toLowerCase();
        
        if (programLower.includes('livelihood')) {
            showLivelihoodProgramPrompt(applicantData);
        } else if (programLower.includes('employment')) {
            showEmploymentProgramPrompt(applicantData);
        } else if (programLower.includes('educational') || programLower.includes('education')) {
            showEducationProgramPrompt(applicantData);
        } else if (programLower.includes('skills training') || programLower.includes('skills')) {
            showSkillsTrainingProgramPrompt(applicantData);
        } else if (programLower.includes('ofw') || programLower.includes('reintegration')) {
            showOFWProgramPrompt(applicantData);
        } else if (programLower.includes('pwd')) {
            showPWDProgramPrompt(applicantData);
        } else if (programLower.includes('4ps') || programLower.includes('monitoring')) {
            show4PsProgramPrompt(applicantData);
        } else {
            showNotification('Applicant added successfully!', 'success', elements.manualNotification);
        }
    }

    function showLivelihoodProgramPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const applicantName = applicantData.NAME || 'New Applicant';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #28a745;">
                        <i class="fas fa-seedling"></i> Livelihood Program Applicant Added
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #28a745; margin-bottom: 15px;"></i>
                        <h3 style="color: #28a745; margin: 10px 0;">Successfully Added to Livelihood Program!</h3>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Applicant Name:</strong></div>
                            <div>${applicantName}</div>
                            <div><strong>Program:</strong></div>
                            <div>${applicantData['PROGRAM CATEGORY'] || 'Livelihood Program'}</div>
                            <div><strong>Date Added:</strong></div>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
                        <h4 style="margin: 0 0 10px 0; color: #1e7e34;">
                            <i class="fas fa-info-circle"></i> Next Steps
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #1e7e34;">
                            <li>Schedule skills assessment</li>
                            <li>Arrange livelihood training</li>
                            <li>Coordinate with livelihood officer</li>
                            <li>Plan resource allocation</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-livelihood-prompt" class="save-btn" style="background: #28a745;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-livelihood-prompt').addEventListener('click', function() {
            document.body.removeChild(modal);
            showNotification('Livelihood program applicant added successfully!', 'success', elements.manualNotification);
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
                showNotification('Livelihood program applicant added successfully!', 'success', elements.manualNotification);
            }
        });
    }

    // Employment Assistance Program Prompt
    function showEmploymentProgramPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const applicantName = applicantData.NAME || 'New Applicant';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #007bff;">
                        <i class="fas fa-briefcase"></i> Employment Assistance Applicant Added
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #007bff; margin-bottom: 15px;"></i>
                        <h3 style="color: #007bff; margin: 10px 0;">Successfully Added to Employment Assistance!</h3>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Applicant Name:</strong></div>
                            <div>${applicantName}</div>
                            <div><strong>Program:</strong></div>
                            <div>${applicantData['PROGRAM CATEGORY'] || 'Employment Assistance'}</div>
                            <div><strong>Date Added:</strong></div>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div style="background: #e7f3ff; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
                        <h4 style="margin: 0 0 10px 0; color: #0056b3;">
                            <i class="fas fa-info-circle"></i> Next Steps
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #0056b3;">
                            <li>Schedule job interview</li>
                            <li>Conduct skills assessment</li>
                            <li>Match with job opportunities</li>
                            <li>Provide employment counseling</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-employment-prompt" class="save-btn" style="background: #007bff;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-employment-prompt').addEventListener('click', function() {
            document.body.removeChild(modal);
            showNotification('Employment assistance applicant added successfully!', 'success', elements.manualNotification);
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
                showNotification('Employment assistance applicant added successfully!', 'success', elements.manualNotification);
            }
        });
    }

    // Educational Assistance Program Prompt
    function showEducationProgramPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const applicantName = applicantData.NAME || 'New Applicant';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #6f42c1;">
                        <i class="fas fa-graduation-cap"></i> Educational Assistance Applicant Added
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #6f42c1; margin-bottom: 15px;"></i>
                        <h3 style="color: #6f42c1; margin: 10px 0;">Successfully Added to Educational Assistance!</h3>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Applicant Name:</strong></div>
                            <div>${applicantName}</div>
                            <div><strong>Program:</strong></div>
                            <div>${applicantData['PROGRAM CATEGORY'] || 'Educational Assistance'}</div>
                            <div><strong>Date Added:</strong></div>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div style="background: #f3e8ff; padding: 15px; border-radius: 8px; border-left: 4px solid #6f42c1;">
                        <h4 style="margin: 0 0 10px 0; color: #5a32a3;">
                            <i class="fas fa-info-circle"></i> Next Steps
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #5a32a3;">
                            <li>Process scholarship application</li>
                            <li>Schedule educational assessment</li>
                            <li>Coordinate with schools/universities</li>
                            <li>Arrange educational materials</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-education-prompt" class="save-btn" style="background: #6f42c1;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-education-prompt').addEventListener('click', function() {
            document.body.removeChild(modal);
            showNotification('Educational assistance applicant added successfully!', 'success', elements.manualNotification);
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
                showNotification('Educational assistance applicant added successfully!', 'success', elements.manualNotification);
            }
        });
    }

    // Skills Training Program Prompt
    function showSkillsTrainingProgramPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const applicantName = applicantData.NAME || 'New Applicant';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #fd7e14;">
                        <i class="fas fa-tools"></i> Skills Training Applicant Added
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #fd7e14; margin-bottom: 15px;"></i>
                        <h3 style="color: #fd7e14; margin: 10px 0;">Successfully Added to Skills Training!</h3>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Applicant Name:</strong></div>
                            <div>${applicantName}</div>
                            <div><strong>Program:</strong></div>
                            <div>${applicantData['PROGRAM CATEGORY'] || 'Skills Training'}</div>
                            <div><strong>Date Added:</strong></div>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; border-left: 4px solid #fd7e14;">
                        <h4 style="margin: 0 0 10px 0; color: #e65100;">
                            <i class="fas fa-info-circle"></i> Next Steps
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #e65100;">
                            <li>Schedule training orientation</li>
                            <li>Assign to appropriate skills course</li>
                            <li>Coordinate with training providers</li>
                            <li>Arrange training materials and venue</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-skills-prompt" class="save-btn" style="background: #fd7e14;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-skills-prompt').addEventListener('click', function() {
            document.body.removeChild(modal);
            showNotification('Skills training applicant added successfully!', 'success', elements.manualNotification);
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
                showNotification('Skills training applicant added successfully!', 'success', elements.manualNotification);
            }
        });
    }

    // OFW Reintegration Program Prompt
    function showOFWProgramPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const applicantName = applicantData.NAME || 'New Applicant';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #20c997;">
                        <i class="fas fa-plane"></i> OFW Reintegration Applicant Added
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #20c997; margin-bottom: 15px;"></i>
                        <h3 style="color: #20c997; margin: 10px 0;">Successfully Added to OFW Reintegration!</h3>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Applicant Name:</strong></div>
                            <div>${applicantName}</div>
                            <div><strong>Program:</strong></div>
                            <div>${applicantData['PROGRAM CATEGORY'] || 'OFW Reintegration'}</div>
                            <div><strong>Date Added:</strong></div>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div style="background: #e6f7f2; padding: 15px; border-radius: 8px; border-left: 4px solid #20c997;">
                        <h4 style="margin: 0 0 10px 0; color: #17a2b8;">
                            <i class="fas fa-info-circle"></i> Next Steps
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #17a2b8;">
                            <li>Schedule reintegration assessment</li>
                            <li>Provide livelihood counseling</li>
                            <li>Coordinate with OWWA services</li>
                            <li>Arrange family support services</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-ofw-prompt" class="save-btn" style="background: #20c997;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-ofw-prompt').addEventListener('click', function() {
            document.body.removeChild(modal);
            showNotification('OFW reintegration applicant added successfully!', 'success', elements.manualNotification);
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
                showNotification('OFW reintegration applicant added successfully!', 'success', elements.manualNotification);
            }
        });
    }

    // PWD Assistance Program Prompt
    function showPWDProgramPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const applicantName = applicantData.NAME || 'New Applicant';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #e83e8c;">
                        <i class="fas fa-wheelchair"></i> PWD Assistance Applicant Added
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #e83e8c; margin-bottom: 15px;"></i>
                        <h3 style="color: #e83e8c; margin: 10px 0;">Successfully Added to PWD Assistance!</h3>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Applicant Name:</strong></div>
                            <div>${applicantName}</div>
                            <div><strong>Program:</strong></div>
                            <div>${applicantData['PROGRAM CATEGORY'] || 'PWD Assistance'}</div>
                            <div><strong>Date Added:</strong></div>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div style="background: #fce4ec; padding: 15px; border-radius: 8px; border-left: 4px solid #e83e8c;">
                        <h4 style="margin: 0 0 10px 0; color: #d81b60;">
                            <i class="fas fa-info-circle"></i> Next Steps
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #d81b60;">
                            <li>Schedule disability assessment</li>
                            <li>Provide assistive devices if needed</li>
                            <li>Coordinate with PWD organizations</li>
                            <li>Arrange accessibility services</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-pwd-prompt" class="save-btn" style="background: #e83e8c;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-pwd-prompt').addEventListener('click', function() {
            document.body.removeChild(modal);
            showNotification('PWD assistance applicant added successfully!', 'success', elements.manualNotification);
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
                showNotification('PWD assistance applicant added successfully!', 'success', elements.manualNotification);
            }
        });
    }

    // 4Ps Monitoring Program Prompt
    function show4PsProgramPrompt(applicantData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const applicantName = applicantData.NAME || 'New Applicant';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2 style="color: #dc3545;">
                        <i class="fas fa-home"></i> 4Ps Monitoring Applicant Added
                    </h2>
                </div>
                <div style="padding: 20px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <i class="fas fa-check-circle" style="font-size: 48px; color: #dc3545; margin-bottom: 15px;"></i>
                        <h3 style="color: #dc3545; margin: 10px 0;">Successfully Added to 4Ps Monitoring!</h3>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                            <div><strong>Applicant Name:</strong></div>
                            <div>${applicantName}</div>
                            <div><strong>Program:</strong></div>
                            <div>${applicantData['PROGRAM CATEGORY'] || '4Ps Monitoring'}</div>
                            <div><strong>Date Added:</strong></div>
                            <div>${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
                        <h4 style="margin: 0 0 10px 0; color: #c82333;">
                            <i class="fas fa-info-circle"></i> Next Steps
                        </h4>
                        <ul style="margin: 0; padding-left: 20px; color: #c82333;">
                            <li>Schedule household visit</li>
                            <li>Verify 4Ps membership</li>
                            <li>Conduct compliance monitoring</li>
                            <li>Update family progress records</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="close-4ps-prompt" class="save-btn" style="background: #dc3545;">
                        <i class="fas fa-check"></i> Continue
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('close-4ps-prompt').addEventListener('click', function() {
            document.body.removeChild(modal);
            showNotification('4Ps monitoring applicant added successfully!', 'success', elements.manualNotification);
        });
        
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
                showNotification('4Ps monitoring applicant added successfully!', 'success', elements.manualNotification);
            }
        });
    }

    function initializeCamera() {
        if (elements.takePhotoBtn) {
            elements.takePhotoBtn.addEventListener('click', openCamera);
        }

        if (elements.closeCamera) {
            elements.closeCamera.addEventListener('click', closeCamera);
        }

        if (elements.cameraModal) {
            elements.cameraModal.addEventListener('click', function(event) {
                if (event.target === elements.cameraModal) {
                    closeCamera();
                }
            });
        }

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
        if (elements.manualModal) elements.manualModal.style.display = 'none';
        if (elements.editModal) elements.editModal.style.display = 'none';
        elements.cameraModal.style.display = 'block';
        elements.cameraModal.style.zIndex = '9999';
        elements.cameraError.style.display = 'none';
        elements.cameraVideo.style.display = 'block';
        elements.cameraCanvas.style.display = 'none';
        elements.captureBtn.style.display = 'block';
        elements.retakeBtn.style.display = 'none';
        elements.usePhotoBtn.style.display = 'none';
        capturedPhoto = null;
        
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
        elements.captureBtn.style.display = 'none';
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

    function initializeSearch() {
        if (elements.searchBtn && elements.clearSearchBtn && elements.searchInput) {
            elements.searchBtn.addEventListener('click', searchApplicants);
            elements.clearSearchBtn.addEventListener('click', clearSearch);
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
        
        if (!searchTerm) {
            clearSearch();
            return;
        }
        
        let foundCount = 0;
        
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

    function initializeEditModal() {
        if (elements.editModal) {
            const closeBtn = elements.editModal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    elements.editModal.style.display = 'none';
                });
            }
            
            const cancelBtn = document.getElementById('cancel-edit');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', function() {
                    elements.editModal.style.display = 'none';
                });
            }
            
            elements.editModal.addEventListener('click', function(event) {
                if (event.target === elements.editModal) {
                    elements.editModal.style.display = 'none';
                }
            });
            
            const editForm = document.getElementById('editApplicantForm');
            if (editForm) {
                editForm.addEventListener('submit', function(event) {
                    event.preventDefault();
                    updateApplicant(currentEditId);
                });
            }
        }

        if (elements.uploadPhotoBtn && elements.editPhotoInput) {
            elements.uploadPhotoBtn.addEventListener('click', function() {
                elements.editPhotoInput.click();
            });
        }

        if (elements.editPhotoInput) {
            elements.editPhotoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    if (file.type.startsWith('image/')) {
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
        
        const formInputs = elements.editModal.querySelectorAll('input');
        formInputs.forEach(input => {
            input.value = '';
        });
        
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
            'REGION': 'edit-region',
            'EMAIL': 'edit-email',
            'TELEPHONE': 'edit-telephone',
            'CELLPHONE': 'edit-cellphone',
            'EMP. STATUS': 'edit-emp-status',
            'EMP. TYPE': 'edit-emp-type',
            'EDUC LEVEL': 'edit-educ-level',
            'COURSE': 'edit-course',
            '4Ps': 'edit-4ps',
            'PWD': 'edit-pwd',
            'DISABILITY': 'edit-disability',
            'PREFERRED POSITION': 'edit-preferred-position',
            'SKILLS': 'edit-skills',
            'WORK EXPERIENCE': 'edit-work-experience',
            'OFW': 'edit-ofw',
            'COUNTRY': 'edit-country',
            'FORMER OFW': 'edit-former-ofw',
            'LATEST COUNTRY': 'edit-latest-country',
            'REG. DATE': 'edit-reg-date',
            'REMARKS': 'edit-remarks',
            'CREATED BY': 'edit-created-by',
            'DATE CREATED': 'edit-date-created',
            'LAST MODIFIED BY': 'edit-last-modified-by',
            'DATE LAST MODIFIED': 'edit-date-last-modified'
        };
        
        for (const field in applicant) {
            if (fieldToIdMap[field]) {
                const input = document.getElementById(fieldToIdMap[field]);
                if (input) {
                    input.value = applicant[field] || '';
                }
            }
        }
        
        const dateCreatedEl = document.getElementById('edit-date-created');
        const dateModifiedEl = document.getElementById('edit-date-last-modified');
        
        if (dateCreatedEl) {
            dateCreatedEl.textContent = applicant['DATE CREATED'] || 'Not available';
        }
        if (dateModifiedEl) {
            dateModifiedEl.textContent = applicant['DATE LAST MODIFIED'] || 'Not available';
        }
        
        const photoId = applicant['SRS ID'] || applicant.ID;
        currentEditId = photoId;
        const savedPhoto = localStorage.getItem(`photo_${photoId}`);
        
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

        elements.editModal.style.display = 'block';

        const bdateInput = document.getElementById('edit-bdate');
        if (bdateInput && applicant['BDATE']) {
            const dateValue = formatDateForInput(applicant['BDATE']);
            bdateInput.value = dateValue;
        }

        const dropdownFields = {
            'SEX': 'edit-sex',
            'CIVIL STATUS': 'edit-civil-status',
            '4Ps': 'edit-4ps',
            'PWD': 'edit-pwd',
            'OFW': 'edit-ofw',
            'FORMER OFW': 'edit-former-ofw'
        };
    
        for (const field in dropdownFields) {
            const selectElement = document.getElementById(dropdownFields[field]);
            if (selectElement && applicant[field]) {
                for (let i = 0; i < selectElement.options.length; i++) {
                    if (selectElement.options[i].value === applicant[field]) {
                        selectElement.selectedIndex = i;
                        break;
                    }
                }
            }
        }
    }

    function updateApplicant(id) {
        if (!id) {
            showNotification('Error: No applicant ID found for update', 'error');
            return;
        }

        const formData = new FormData(document.getElementById('editApplicantForm'));
        const updatedApplicant = {};

        const lastName = document.getElementById('edit-last-name').value.trim();
        const firstName = document.getElementById('edit-first-name').value.trim();
        const middleName = document.getElementById('edit-middle-name').value.trim();
        
        // Combine into full name
        if (lastName && firstName) {
            let fullName = `${lastName}, ${firstName}`;
            if (middleName) {
                fullName += ` ${middleName}`;
            }
            updatedApplicant['NAME'] = fullName;
        }
        
        // Store individual name parts
        updatedApplicant['LAST NAME'] = lastName || 'N/A';
        updatedApplicant['FIRST NAME'] = firstName || 'N/A';
        updatedApplicant['MIDDLE NAME'] = middleName || 'N/A';
        
        // Process other form data
        formData.forEach((value, key) => {
            if (!key.startsWith('edit-last-name') && !key.startsWith('edit-first-name') && 
                !key.startsWith('edit-middle-name') && !key.startsWith('edit-name')) {
                const originalFieldName = key.replace('edit-', '').replace(/-/g, ' ').toUpperCase();

                if (originalFieldName === 'BDATE' && value) {
                    const date = new Date(value);
                    updatedApplicant[originalFieldName] = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                } else {
                    updatedApplicant[originalFieldName] = value;
                }
            }
        });
        
        const tempPhoto = localStorage.getItem(`tempPhoto_${id}`);
        if (tempPhoto) {
            localStorage.setItem(`photo_${id}`, tempPhoto);
            localStorage.removeItem(`tempPhoto_${id}`);
            updatedApplicant['PHOTO'] = tempPhoto;
        }
            
        updatedApplicant['DATE LAST MODIFIED'] = new Date().toLocaleString();
        
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        const updatedApplicants = savedApplicants.map(applicant => {
            if (applicant['SRS ID'] === id || applicant.ID === id) {
                return { ...applicant, ...updatedApplicant };
            }
            return applicant;
        });
        
        saveMainApplicants(updatedApplicants);
        displayMainApplicants(updatedApplicants);
        
        elements.editModal.style.display = 'none';
        
        showNotification('Applicant updated successfully!', 'success');
    }
        
    // Replace the Excel Import section in initializeFileUploads function
    function initializeFileUploads() {
        // 1. FILE UPLOAD FOR IMPORTED DATA TABLE (Excel Import section)
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
        
        // Excel Import section - FIXED: Use proper duplicate validation
        if (elements.importBtn) {
            elements.importBtn.addEventListener('click', function() {
                if (!elements.fileInput) return;
                
                const file = elements.fileInput.files[0];
                if (!file) {
                    showNotification('Please select a file first.', 'error');
                    return;
                }
                
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
                        
                        console.log('📁 Raw imported data:', jsonData);
                        const processedData = smartImportData(jsonData);
                        console.log('🔄 Processed data:', processedData);
                        
                        // Use the same duplicate validation as the main flow
                        const validationResults = validateImportedDataDuplicates(processedData);
                        console.log('✅ Duplicate validation completed:', validationResults);
                        
                        // Show validation modal for imported data
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
            });
        }
        
        // 2. FILE UPLOAD FOR ADDING TO MAIN APPLICANTS (Upload New Applicant section)
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
            elements.addBtn.addEventListener('click', function() {
                if (!elements.uploadFileInput) return;
                
                const file = elements.uploadFileInput.files[0];
                if (!file) {
                    showUploadNotification('Please select a file first.', 'error');
                    return;
                }
                
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
                        
                        console.log('📁 Raw applicant data:', jsonData);
                        const processedData = smartImportData(jsonData);
                        console.log('🔄 Processed applicant data:', processedData);
                        
                        // Run validation for MAIN APPLICANTS
                        const validationResults = validateImportedDataDuplicates(processedData);
                        console.log('✅ Validation completed:', validationResults);
                        
                        // Show validation modal for main applicants - FIXED: Add proper promise handling
                        showEnhancedImportValidationModal(validationResults, processedData)
                            .then(result => {
                                console.log('Modal result:', result);
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
                                    default:
                                        console.log('Unknown action:', result.action);
                                }
                            })
                            .catch(error => {
                                console.error('Error in validation modal:', error);
                                showUploadNotification('Error during import validation.', 'error');
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
            });
        }
        
        // Reset buttons (keep existing functionality)
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
    } // FIXED: Added missing closing brace for initializeFileUploads function

    // Add these two new functions to handle the different destinations:

    function proceedWithImportToImportedData(newApplicants) {
        try {
            const existingImportedData = JSON.parse(localStorage.getItem('importedData')) || [];
            const mergedData = [...existingImportedData, ...newApplicants];
            
            // Save to imported data table
            localStorage.setItem('importedData', JSON.stringify(mergedData));
            displayImportedData([]); // This will reload all imported data
            
            // Show success message
            showNotification(`Successfully imported ${newApplicants.length} applicant(s) to imported data table.`, 'success');
            
            // Reset form
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
            
            // Save to main applicants
            saveMainApplicants(mergedData);
            displayMainApplicants(mergedData);
            
            // Show success message
            showUploadNotification(`Successfully added ${newApplicants.length} applicant(s) to main applicant table.`, 'success');
            
            // Reset form
            if (elements.uploadFileName) elements.uploadFileName.value = '';
            if (elements.addBtn) elements.addBtn.disabled = true;
            if (elements.uploadFileInput) elements.uploadFileInput.value = '';
            
        } catch (error) {
            console.error('Error adding applicants:', error);
            showUploadNotification('Error adding applicants: ' + error.message, 'error');
        }
    }

    function initializeAdvancedFilters() {
        if (!elements.advancedFiltersBtn || !elements.advancedFiltersPanel) {
            console.warn('Advanced filters elements not found');
            return;
        }

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
                
                if (applicantBarangay === 'n/a' || applicantBarangay === '' || 
                    !applicantBarangay.includes(filterBarangay)) {
                    return false;
                }
            }
            
            if (activeFilters.regDate) {
                const applicantRegDate = applicant['REG. DATE'];
                
                if (!applicantRegDate || applicantRegDate === 'N/A' || applicantRegDate === '') {
                    return false;
                }
                
                const filterDate = new Date(activeFilters.regDate);
                const applicantDate = new Date(applicantRegDate);
                
                if (isNaN(filterDate.getTime()) || isNaN(applicantDate.getTime())) {
                    return false;
                }
                
                if (filterDate.getFullYear() !== applicantDate.getFullYear() || 
                    filterDate.getMonth() !== applicantDate.getMonth()) {
                    return false;
                }
            }
            
            return true;
        });
        
        filteredApplicants = applySortingToData(filteredApplicants);
        
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
                <h3><i class="fas fa-graduation-cap"></i> Educational Attainment</h3>
                ${generateEducationTable(programStats)}
                ${generateExpandableCourseStats(programStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-user-friends"></i> Gender Distribution</h3>
                ${generateGenderFigures(demographicStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-chart-pie"></i> Program Category Breakdown</h3>
                ${generateProgramPieChart(programStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-briefcase"></i> Employment Status</h3>
                ${generateEmploymentComparison(employmentStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-chart-bar"></i> Age Demographics</h3>
                ${generateAgePyramid(programStats)}
            </div>
            
            <div class="visual-report-section">
                <h3><i class="fas fa-tasks"></i> Program Status Progress</h3>
                ${generateProgramProgress(programStats)}
            </div>
            
            <div class="report-actions" style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button id="export-pdf-btn" class="pdf-export-btn">
                    <i class="fas fa-file-pdf"></i> Export Comprehensive PDF Report
                </button>
                <button id="export-summary-btn" class="action-btn" style="background: #4caf50;">
                    <i class="fas fa-file-excel"></i> Export Summary Report
                </button>
                <button id="export-full-btn" class="action-btn" style="background: #2196f3;">
                    <i class="fas fa-file-excel"></i> Export Full Data
                </button>
            </div>
        `;
        
        // Add event listener for PDF export
        document.getElementById('export-pdf-btn').addEventListener('click', generateComprehensivePDFReport);
        document.getElementById('export-summary-btn').addEventListener('click', exportSummaryReport);
        document.getElementById('export-full-btn').addEventListener('click', exportReportsToExcel);
        
        initializeExpandableSections();
        debugDataIssues();
        reportsContainer.style.display = 'block';
    }

    function generateProgramPictograph(stats) {
        const topCategories = Object.entries(stats.byCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        let html = '<div class="pictograph-container">';
        
        const icons = ['fas fa-hands-helping', 'fas fa-briefcase', 'fas fa-graduation-cap', 'fas fa-tools', 'fas fa-globe-asia', 'fas fa-wheelchair', 'fas fa-home'];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        
        topCategories.forEach(([category, count], index) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            const icon = icons[index] || 'fas fa-chart-bar';
            const color = colors[index] || '#666';
            
            html += `
                <div class="pictograph-item">
                    <div class="pictograph-icon" style="color: ${color};">
                        <i class="${icon}"></i>
                    </div>
                    <div class="pictograph-content">
                        <div style="font-weight: 500; margin-bottom: 5px;">${category}</div>
                        <div class="pictograph-bar">
                            <div class="pictograph-fill" style="width: ${percentage}%; background: ${color};"></div>
                        </div>
                        <div class="pictograph-info">
                            <span>${count} applicants</span>
                            <span>${percentage}%</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    function generateEducationTable(stats) {
        const educationLevels = Object.entries(stats.byEducation)
            .sort((a, b) => b[1] - a[1]);
        
        let html = `
            <table class="education-table">
                <thead>
                    <tr>
                        <th>Educational Level</th>
                        <th>Number of Applicants</th>
                        <th>Percentage</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        educationLevels.forEach(([level, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            html += `
                <tr>
                    <td>${level}</td>
                    <td>${count}</td>
                    <td class="percentage">${percentage}%</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        `;
        
        return html;
    }

    function generateGenderFigures(stats) {
        const totalGender = stats.male + stats.female;
        const malePercentage = totalGender > 0 ? ((stats.male / totalGender) * 100).toFixed(1) : 0;
        const femalePercentage = totalGender > 0 ? ((stats.female / totalGender) * 100).toFixed(1) : 0;
        
        return `
            <div class="gender-figures">
                <div class="gender-figure gender-male">
                    <i class="fas fa-male gender-icon"></i>
                    <div class="gender-count">${stats.male}</div>
                    <div class="gender-label">Male</div>
                    <div class="gender-percentage">${malePercentage}%</div>
                </div>
                <div class="gender-figure gender-female">
                    <i class="fas fa-female gender-icon"></i>
                    <div class="gender-count">${stats.female}</div>
                    <div class="gender-label">Female</div>
                    <div class="gender-percentage">${femalePercentage}%</div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 15px; color: #666;">
                <i class="fas fa-info-circle"></i> Total counted: ${totalGender} | Average Age: ${stats.averageAge}
            </div>
        `;
    }

    function generateProgramPieChart(stats) {
        const topCategories = Object.entries(stats.byCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        let totalTopCategories = 0;
        topCategories.forEach(([_, count]) => {
            totalTopCategories += count;
        });
        
        let html = '<div class="pie-chart-container">';
        html += '<div class="pie-chart">';
        html += '<div class="pie-chart-center">' + stats.total + '</div>';
        html += '</div>';
        html += '<div class="pie-legend">';
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        topCategories.forEach(([category, count], index) => {
            const percentage = ((count / totalTopCategories) * 100).toFixed(1);
            html += `
                <div class="pie-legend-item">
                    <div class="pie-color" style="background: ${colors[index]};"></div>
                    <div class="pie-label">${category}</div>
                    <div class="pie-value">${percentage}%</div>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }

    function generateEmploymentComparison(stats) {
        const total = stats.employed + stats.unemployed + stats.selfEmployed;
        const employedPercentage = total > 0 ? ((stats.employed / total) * 100).toFixed(1) : 0;
        const unemployedPercentage = total > 0 ? ((stats.unemployed / total) * 100).toFixed(1) : 0;
        const selfEmployedPercentage = total > 0 ? ((stats.selfEmployed / total) * 100).toFixed(1) : 0;
        
        return `
            <div class="comparison-cards">
                <div class="comparison-card employed">
                    <div class="comparison-icon">
                        <i class="fas fa-briefcase" style="color: #4caf50;"></i>
                    </div>
                    <div class="comparison-count">${stats.employed}</div>
                    <div class="comparison-label">Employed</div>
                    <div style="color: #4caf50; font-weight: bold; margin-top: 5px;">${employedPercentage}%</div>
                </div>
                <div class="comparison-card unemployed">
                    <div class="comparison-icon">
                        <i class="fas fa-user-clock" style="color: #ff9800;"></i>
                    </div>
                    <div class="comparison-count">${stats.unemployed}</div>
                    <div class="comparison-label">Unemployed</div>
                    <div style="color: #ff9800; font-weight: bold; margin-top: 5px;">${unemployedPercentage}%</div>
                </div>
                <div class="comparison-card self-employed">
                    <div class="comparison-icon">
                        <i class="fas fa-user-tie" style="color: #9c27b0;"></i>
                    </div>
                    <div class="comparison-count">${stats.selfEmployed}</div>
                    <div class="comparison-label">Self-Employed</div>
                    <div style="color: #9c27b0; font-weight: bold; margin-top: 5px;">${selfEmployedPercentage}%</div>
                </div>
            </div>
        `;
    }

    function generateAgePyramid(stats) {
        const ageGroups = [
            'Below 20', '20-29', '30-39', '40-49', '50-59', '60 and above'
        ];

        let maxCount = 0;
        ageGroups.forEach(group => {
            const maleCount = stats.agePyramid[group].male;
            const femaleCount = stats.agePyramid[group].female;
            maxCount = Math.max(maxCount, maleCount, femaleCount);
        });

        if (maxCount === 0) {
            return '<div style="text-align: center; padding: 40px; color: #666;">No age and gender data available</div>';
        }

        let html = '<div class="age-pyramid">';
        
        ageGroups.forEach(ageGroup => {
            const maleCount = stats.agePyramid[ageGroup].male;
            const femaleCount = stats.agePyramid[ageGroup].female;
            const totalCount = maleCount + femaleCount;
            const maleHeight = (maleCount / maxCount) * 160;
            const femaleHeight = (femaleCount / maxCount) * 160;
            
            html += `
                <div class="pyramid-bar">
                    <div class="pyramid-male" style="height: ${maleHeight}px;" title="Male: ${maleCount}"></div>
                    <div class="pyramid-female" style="height: ${femaleHeight}px;" title="Female: ${femaleCount}"></div>
                    <div class="pyramid-label">
                        ${ageGroup.replace('Below ', '<')}<br>
                        ${totalCount}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        html += '<div style="text-align: center; margin-top: 10px; color: #666;">';
        html += '<span style="color: #2196f3;"><i class="fas fa-male"></i> Male</span> | ';
        html += '<span style="color: #e91e63;"><i class="fas fa-female"></i> Female</span>';
        html += '</div>';
        
        return html;
    }

    function generateProgramProgress(stats) {
        const statuses = Object.entries(stats.byStatus)
            .sort((a, b) => b[1] - a[1]);
        
        let html = '<div class="progress-bars">';
        
        statuses.forEach(([status, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            html += `
                <div class="progress-item">
                    <div class="progress-label">
                        <span>${status}</span>
                        <span>${count} (${percentage}%)</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    function generateEnhancedStatistics(programStats, employmentStats, demographicStats) {
        return `
            <div class="enhanced-stats-container">
                <div class="stats-grid-enhanced">
                    <div class="stat-card-enhanced total">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${programStats.total}</div>
                            <div class="stat-label">Total Applicants</div>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced male">
                        <div class="stat-icon">
                            <i class="fas fa-male"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${demographicStats.male}</div>
                            <div class="stat-label">Male</div>
                            <div class="stat-percentage">
                                ${programStats.total > 0 ? Math.round((demographicStats.male / programStats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced female">
                        <div class="stat-icon">
                            <i class="fas fa-female"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${demographicStats.female}</div>
                            <div class="stat-label">Female</div>
                            <div class="stat-percentage">
                                ${programStats.total > 0 ? Math.round((demographicStats.female / programStats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced employed">
                        <div class="stat-icon">
                            <i class="fas fa-briefcase"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${employmentStats.employed}</div>
                            <div class="stat-label">Employed</div>
                            <div class="stat-percentage">
                                ${programStats.total > 0 ? Math.round((employmentStats.employed / programStats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced unemployed">
                        <div class="stat-icon">
                            <i class="fas fa-user-clock"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${employmentStats.unemployed}</div>
                            <div class="stat-label">Unemployed</div>
                            <div class="stat-percentage">
                                ${programStats.total > 0 ? Math.round((employmentStats.unemployed / programStats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card-enhanced self-employed">
                        <div class="stat-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${employmentStats.selfEmployed}</div>
                            <div class="stat-label">Self-Employed</div>
                            <div class="stat-percentage">
                                ${programStats.total > 0 ? Math.round((employmentStats.selfEmployed / programStats.total) * 100) : 0}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function initializeExpandableSections() {
        document.querySelectorAll('.expandable-section').forEach(section => {
            const header = section.querySelector('.expandable-header');
            const content = section.querySelector('.expandable-content');
            const icon = header.querySelector('i');
            
            header.addEventListener('click', function() {
                const isExpanded = section.classList.contains('expanded');
                
                if (isExpanded) {
                    section.classList.remove('expanded');
                    content.style.display = 'none';
                    icon.className = 'fas fa-chevron-down';
                    icon.style.transform = 'rotate(0deg)';
                } else {
                    section.classList.add('expanded');
                    content.style.display = 'block';
                    icon.className = 'fas fa-chevron-up';
                    icon.style.transform = 'rotate(180deg)';
                }
            });
        });
    }

    function generateEducationStatsHTML(stats) {
        let html = '';
        const topEducation = Object.entries(stats.byEducation)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6);
        
        topEducation.forEach(([education, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            html += `
                <div class="stat-card">
                    <div class="stat-number">${count}</div>
                    <div class="stat-label">${education}</div>
                    <div class="stat-percentage">${percentage}%</div>
                </div>
            `;
        });
        
        return html;
    }

    function generateAgeStatsHTML(stats) {
        let html = '';
        Object.entries(stats.byAgeGroup).forEach(([ageGroup, count]) => {
            if (count > 0) {
                const percentage = ((count / stats.total) * 100).toFixed(1);
                html += `
                    <div class="stat-card">
                        <div class="stat-number">${count}</div>
                        <div class="stat-label">${ageGroup}</div>
                        <div class="stat-percentage">${percentage}%</div>
                    </div>
                `;
            }
        });
        
        return html;
    }

    function calculateProgramStatistics(applicants) {
        const stats = {
            total: applicants.length,
            byCategory: {},
            byStatus: {},
            bySpecificProgram: {},
            byEducation: {},
            byCourse: {},
            byAgeGroup: {
                'Below 20': 0,
                '20-29': 0,
                '30-39': 0,
                '40-49': 0,
                '50-59': 0,
                '60 and above': 0
            },
            agePyramid: {
                'Below 20': { male: 0, female: 0 },
                '20-29': { male: 0, female: 0 },
                '30-39': { male: 0, female: 0 },
                '40-49': { male: 0, female: 0 },
                '50-59': { male: 0, female: 0 },
                '60 and above': { male: 0, female: 0 }
            }
        };
        
        applicants.forEach((applicant, index) => {
            try {
                const category = applicant['PROGRAM CATEGORY'] || 'Uncategorized';
                const status = applicant['PROGRAM STATUS'] || 'Not Specified';
                const specificProgram = applicant['SPECIFIC PROGRAM'] || 'No Specific Program';
                const education = applicant['EDUC LEVEL'] || 'Not Specified';
                
                // SAFE course extraction with null checks
                let course = 'No Course Specified';
                if (applicant) {
                    course = applicant['COURSE'] || applicant['Course'] || applicant['course'] || 
                            applicant['COURSE/DEGREE'] || applicant['COLLEGE COURSE'] || 
                            applicant['DEGREE'] || 'No Course Specified';
                }
                
                // Safe course categorization
                const categorizedCourse = categorizeCourse(course);
                stats.byCourse[categorizedCourse] = (stats.byCourse[categorizedCourse] || 0) + 1;

                // Age processing with safety
                const age = parseInt(applicant.AGE) || 0;
                const gender = normalizeGender(applicant.SEX);

                // Age group classification
                if (age < 20) stats.byAgeGroup['Below 20']++;
                else if (age >= 20 && age <= 29) stats.byAgeGroup['20-29']++;
                else if (age >= 30 && age <= 39) stats.byAgeGroup['30-39']++;
                else if (age >= 40 && age <= 49) stats.byAgeGroup['40-49']++;
                else if (age >= 50 && age <= 59) stats.byAgeGroup['50-59']++;
                else if (age >= 60) stats.byAgeGroup['60 and above']++;

                // Age pyramid with safety
                let ageGroup;
                if (age < 20) ageGroup = 'Below 20';
                else if (age >= 20 && age <= 29) ageGroup = '20-29';
                else if (age >= 30 && age <= 39) ageGroup = '30-39';
                else if (age >= 40 && age <= 49) ageGroup = '40-49';
                else if (age >= 50 && age <= 59) ageGroup = '50-59';
                else if (age >= 60) ageGroup = '60 and above';
                
                if (ageGroup && gender) {
                    if (gender === 'male') {
                        stats.agePyramid[ageGroup].male++;
                    } else if (gender === 'female') {
                        stats.agePyramid[ageGroup].female++;
                    }
                }
                
                // Count categories
                stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
                stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
                stats.bySpecificProgram[specificProgram] = (stats.bySpecificProgram[specificProgram] || 0) + 1;
                stats.byEducation[education] = (stats.byEducation[education] || 0) + 1;
                
            } catch (error) {
                console.error(`Error processing applicant ${index}:`, error, applicant);
                // Continue with next applicant instead of breaking
            }
        });
        
        return stats;
    }

    function calculateEmploymentStatistics(applicants) {
        const stats = {
            employed: 0,
            unemployed: 0,
            selfEmployed: 0
        };
        
        applicants.forEach(applicant => {
            const status = (applicant['EMP. STATUS'] || '').toLowerCase();
            if (status.includes('employed') && !status.includes('unemployed')) {
                stats.employed++;
            } else if (status.includes('unemployed')) {
                stats.unemployed++;
            } else if (status.includes('self')) {
                stats.selfEmployed++;
            }
        });
        
        return stats;
    }

    function normalizeGender(genderValue) {
        try {
            if (!genderValue || genderValue === 'N/A' || genderValue === 'null' || genderValue === 'undefined') {
                return null;
            }
            
            const gender = String(genderValue).trim().toLowerCase();
            
            // Handle single letters
            if (gender === 'm' || gender === 'male') return 'male';
            if (gender === 'f' || gender === 'female') return 'female';
            
            // Handle full words and variations
            if (gender.includes('male') && !gender.includes('female')) return 'male';
            if (gender.includes('female')) return 'female';
            
            // Handle common abbreviations
            if (gender === 'm' || gender === 'm.') return 'male';
            if (gender === 'f' || gender === 'f.') return 'female';
            
            return null;
        } catch (error) {
            console.error('Error in normalizeGender:', error, 'for value:', genderValue);
            return null;
        }
    }


    function calculateDemographicStatistics(applicants) {
        const stats = {
            male: 0,
            female: 0,
            averageAge: 0,
            unknown: 0 // track unknown genders
        };
        
        let totalAge = 0;
        let ageCount = 0;
        
        applicants.forEach(applicant => {
            const gender = normalizeGender(applicant.SEX);
            
            if (gender === 'male') {
                stats.male++;
            } else if (gender === 'female') {
                stats.female++;
            } else {
                stats.unknown++;
                console.log('Unknown gender format:', applicant.SEX); // Debug logging
            }
            
            const age = parseInt(applicant.AGE);
            if (!isNaN(age)) {
                totalAge += age;
                ageCount++;
            }
        });
        
        stats.averageAge = ageCount > 0 ? Math.round(totalAge / ageCount) : 0;
        
        return stats;
    }

    function generateProgramStatsHTML(stats) {
        let html = `
            <div class="stat-card total">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Applicants</div>
            </div>
        `;
        
        const topCategories = Object.entries(stats.byCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4);
        
        topCategories.forEach(([category, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            html += `
                <div class="stat-card">
                    <div class="stat-number">${count}</div>
                    <div class="stat-label">${category}</div>
                    <div class="stat-percentage">${percentage}%</div>
                </div>
            `;
        });
        
        return html;
    }

    function generateEmploymentStatsHTML(stats) {
        const total = stats.employed + stats.unemployed + stats.selfEmployed;
        
        return `
            <div class="stat-card">
                <div class="stat-number">${stats.employed}</div>
                <div class="stat-label">Employed</div>
                <div class="stat-percentage">${total > 0 ? ((stats.employed / total) * 100).toFixed(1) : 0}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.unemployed}</div>
                <div class="stat-label">Unemployed</div>
                <div class="stat-percentage">${total > 0 ? ((stats.unemployed / total) * 100).toFixed(1) : 0}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.selfEmployed}</div>
                <div class="stat-label">Self-Employed</div>
                <div class="stat-percentage">${total > 0 ? ((stats.selfEmployed / total) * 100).toFixed(1) : 0}%</div>
            </div>
        `;
    }

    function generateDemographicStatsHTML(stats) {
        const totalGender = stats.male + stats.female;
        const malePercentage = totalGender > 0 ? ((stats.male / totalGender) * 100).toFixed(1) : 0;
        const femalePercentage = totalGender > 0 ? ((stats.female / totalGender) * 100).toFixed(1) : 0;
        
        return `
            <div class="gender-stats-section">
                <h3><i class="fas fa-user-friends"></i> Gender Distribution</h3>
                <div class="gender-figures">
                    <div class="gender-figure gender-male">
                        <i class="fas fa-male gender-icon"></i>
                        <div class="gender-count">${stats.male}</div>
                        <div class="gender-label">Male</div>
                        <div class="gender-percentage">${malePercentage}%</div>
                    </div>
                    <div class="gender-figure gender-female">
                        <i class="fas fa-female gender-icon"></i>
                        <div class="gender-count">${stats.female}</div>
                        <div class="gender-label">Female</div>
                        <div class="gender-percentage">${femalePercentage}%</div>
                    </div>
                </div>
                <div class="stats-grid" style="margin-top: 20px;">
                    <div class="stat-card">
                        <div class="stat-number">${stats.averageAge}</div>
                        <div class="stat-label">Average Age</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${totalGender}</div>
                        <div class="stat-label">Total Counted</div>
                    </div>
                </div>
            </div>
        `;
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
                    
                    if (typeof value === 'string' && value.length > 30000) {
                        value = '[Data too long for export]';
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
            
            if (error.message.includes('32767')) {
                showNotification('Error: Some data fields are too long for Excel export. Try exporting a summary report instead.', 'error');
            } else {
                showNotification('Error exporting report: ' + error.message, 'error');
            }
        }
    }

    function generateUniqueId() {
        return 'SRS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function formatDateForInput(dateString) {
        if (!dateString) return '';
        
        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const month = parts[0].padStart(2, '0');
                const day = parts[1].padStart(2, '0');
                const year = parts[2];
                return `${year}-${month}-${day}`;
            }
        }
        
        return dateString;
    }

    function processDateFields(data) {
        return data.map(record => {
            const processedRecord = { ...record };
            
            if (record['BDATE']) {
                const dateValue = record['BDATE'];
                if (dateValue instanceof Date) {
                    processedRecord['BDATE'] = `${(dateValue.getMonth() + 1).toString().padStart(2, '0')}/${dateValue.getDate().toString().padStart(2, '0')}/${dateValue.getFullYear()}`;
                } else if (typeof dateValue === 'string' && dateValue.includes('/')) {
                    const parts = dateValue.split('/');
                    if (parts.length === 3) {
                        const month = parts[0].padStart(2, '0');
                        const day = parts[1].padStart(2, '0');
                        const year = parts[2];
                        processedRecord['BDATE'] = `${month}/${day}/${year}`;
                    }
                }
            }
            
            return processedRecord;
        });
    }

    function checkForDuplicates(newApplicants, existingApplicants) {
        const duplicates = [];
        const uniqueNewApplicants = [];
        
        newApplicants.forEach(newApp => {
            let isDuplicate = false;
            
            existingApplicants.forEach(existingApp => {
                const nameMatch = newApp.NAME && existingApp.NAME && 
                                newApp.NAME.toLowerCase() === existingApp.NAME.toLowerCase();
                
                if (nameMatch) {
                    isDuplicate = true;
                    duplicates.push({
                        new: newApp,
                        existing: existingApp
                    });
                }
            });
            
            if (!isDuplicate) {
                uniqueNewApplicants.push(newApp);
            }
        });
        
        return { duplicates, uniqueNewApplicants };
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

    function loadMainApplicants() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        displayMainApplicants(savedApplicants);
    }

    function displayMainApplicants(applicants) {
        if (!elements.mainApplicantTable) {
            console.warn('Main applicant table not found');
            return;
        }
        
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
            
            // Create all table cells in the correct order
            const cells = [
                // SRS ID
                createTableCell(applicant['SRS ID'] || `APP-${index + 1}`, '', '10px', 'monospace'),
                
                // Personal Information
                createTableCell(applicant['SURNAME'] || 'N/A'),
                createTableCell(applicant['FIRST NAME'] || 'N/A'),
                createTableCell(applicant['MIDDLE NAME'] || 'N/A'),
                createTableCell(applicant['SUFFIX'] || 'N/A'),
                createTableCell(applicant['DATE OF BIRTH'] || 'N/A', '', '10px'),
                createTableCell(applicant['PLACE OF BIRTH'] || 'N/A'),
                createTableCell(applicant['HOUSE NO./STREET/VILLAGE'] || 'N/A'),
                createTableCell(applicant['BARANGAY'] || 'N/A'),
                createTableCell(applicant['MUNICIPALITY/CITY'] || 'N/A'),
                createTableCell(applicant['PROVINCE'] || 'N/A'),
                
                // Personal Details
                createTableCell(applicant['SEX'] || 'N/A', 'center'),
                createTableCell(applicant['CIVIL STATUS'] || 'N/A'),
                createTableCell(applicant['TIN'] || 'N/A'),
                createTableCell(applicant['GSIS/SSS No.'] || 'N/A'),
                createTableCell(applicant['PAGIBIG No.'] || 'N/A'),
                createTableCell(applicant['PHILHEALTH No.'] || 'N/A'),
                createTableCell(applicant['HEIGHT'] || 'N/A'),
                
                // Contact Information
                createTableCell(applicant['EMAIL ADDRESS'] || 'N/A'),
                createTableCell(applicant['LANDLINE NUMBER'] || 'N/A'),
                createTableCell(applicant['CELLPHONE NUMBER'] || 'N/A'),
                
                // Additional Information
                createTableCell(applicant['DISABILITY'] || 'N/A'),
                createTableCell(applicant['EMPLOYMENT STATUS/TYPE'] || 'N/A'),
                createTableCell(applicant['ARE YOU ACTIVELY LOOKING FOR WORK?'] || 'N/A'),
                createTableCell(applicant['WILLING TO WORK IMMEDIATELY?'] || 'N/A'),
                createTableCell(applicant['ARE YOU A 4PS BENEFICIARY?'] || 'N/A'),
                
                // Job Preference
                createTableCell(applicant['PREFERRED OCCUPATION'] || 'N/A'),
                createTableCell(applicant['PREFERRED WORK LOCATION'] || 'N/A'),
                createTableCell(applicant['EXPECTED SALARY'] || 'N/A'),
                createTableCell(applicant['PASSPORT NO.'] || 'N/A'),
                createTableCell(applicant['PASSPORT EXPIRY DATE'] || 'N/A', '', '10px'),
                createTableCell(applicant['LANGUAGE'] || 'N/A'),
                
                // Education
                createTableCell(applicant['ELEMENTARY'] || 'N/A'),
                createTableCell(applicant['SECONDARY'] || 'N/A'),
                createTableCell(applicant['TERTIARY'] || 'N/A'),
                createTableCell(applicant['GRADUATE STUDIES'] || 'N/A'),
                createTableCell(applicant['TECHNICAL/VOCATIONAL AND OTHER TRAINING'] || 'N/A'),
                createTableCell(applicant['ELIGIBILITY'] || 'N/A'),
                
                // Work & Skills
                createTableCell(applicant['WORK EXPERIENCE'] || 'N/A'),
                createTableCell(applicant['OTHER SKILLS'] || 'N/A'),
                
                // Program Information
                createTableCell(applicant['PROGRAM CATEGORY'] || 'N/A'),
                createTableCell(applicant['SPECIFIC PROGRAM'] || 'N/A'),
                createTableCell(applicant['PROGRAM STATUS'] || 'N/A'),
                
                // ACTIONS COLUMN - This is where the 4 buttons should be
                createActionsCell(applicant, index)
            ];
            
            // Append all cells to the row
            cells.forEach(cell => row.appendChild(cell));
            
            tbody.appendChild(row);
        });
    }

    // Helper function to create table cells
    function createTableCell(content, align = '', fontSize = '', fontFamily = '') {
        const cell = document.createElement('td');
        cell.textContent = content;
        
        if (align) cell.style.textAlign = align;
        if (fontSize) cell.style.fontSize = fontSize;
        if (fontFamily) cell.style.fontFamily = fontFamily;
        
        if (content.length > 20) {
            cell.className = 'compact-cell';
        }
        
        return cell;
    }

    // Helper function to create the actions cell with all 4 buttons
    function createActionsCell(applicant, index) {
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        // 1. View Button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-btn';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'View Applicant Details';
        viewBtn.addEventListener('click', function() {
            openViewModal(applicant);
        });
        
        // 2. Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit Applicant';
        editBtn.addEventListener('click', function() {
            openEditModal(applicant);
        });
        
        // 3. Download Button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.title = 'Download Data';
        downloadBtn.addEventListener('click', function() {
            downloadApplicantData(applicant);
        });
        
        // 4. Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete Applicant';
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this applicant?')) {
                deleteApplicant(applicant['SRS ID'] || applicant.ID);
            }
        });
        
        // Add all buttons to the actions container
        actionButtons.appendChild(viewBtn);
        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(downloadBtn);
        actionButtons.appendChild(deleteBtn);
        
        actionsCell.appendChild(actionButtons);
        return actionsCell;
    }

    function getStatusClass(status) {
        const statusLower = status.toLowerCase();
        if (statusLower.includes('complete') || statusLower.includes('approved')) {
            return 'completed';
        } else if (statusLower.includes('pending') || statusLower.includes('applied')) {
            return 'pending';
        } else {
            return 'active';
        }
    }

    function downloadApplicantData(applicant) {
        try {
            // Create a clean copy with properly formatted names
            const exportApplicant = { ...applicant };
            
            // Ensure full name is properly formatted
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
            
            // Ensure individual name parts are included
            if (!exportApplicant['LAST NAME'] || exportApplicant['LAST NAME'] === 'N/A') {
                exportApplicant['LAST NAME'] = extractLastName(exportApplicant.NAME);
            }
            if (!exportApplicant['FIRST NAME'] || exportApplicant['FIRST NAME'] === 'N/A') {
                exportApplicant['FIRST NAME'] = extractFirstName(exportApplicant.NAME);
            }
            if (!exportApplicant['MIDDLE NAME'] || exportApplicant['MIDDLE NAME'] === 'N/A') {
                exportApplicant['MIDDLE NAME'] = extractMiddleName(exportApplicant.NAME);
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

    function deleteApplicant(id) {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        const updatedApplicants = savedApplicants.filter(applicant => 
            applicant['SRS ID'] !== id && applicant.ID !== id
        );
        
        saveMainApplicants(updatedApplicants);
        displayMainApplicants(updatedApplicants);
        
        localStorage.removeItem(`photo_${id}`);
        
        showNotification('Applicant deleted successfully!', 'success');
    }

    function saveMainApplicants(applicants) {
        localStorage.setItem('mainApplicants', JSON.stringify(applicants));
    }

    function loadImportedData() {
        const importedData = JSON.parse(localStorage.getItem('importedData')) || [];
        if (importedData.length > 0) {
            displayImportedData(importedData);
        }
    }

    function displayImportedData(newData) {
        if (!elements.importedTable) return;
        
        // Load existing imported data and merge with new data
        const existingData = JSON.parse(localStorage.getItem('importedData')) || [];
        const mergedData = [...existingData, ...newData];
        
        const tbody = elements.importedTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (mergedData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = elements.importedTable.querySelectorAll('th').length;
            cell.className = 'no-results';
            cell.textContent = 'No imported data';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        mergedData.forEach((record, index) => {
            const row = document.createElement('tr');
            
            const columns = [
                'ID', 'Last Name', 'Given Name', 'Middle Name', 'Full Name',
                'Date of Birth', 'Age', 'Sex', 'Civil Status', 'Street',
                'Barangay', 'City', 'Province', 'Contact No.', 'Employment Status',
                'If Employed/Self Employment', 'Educational Attainment', 'Course',
                'Skills', 'Work Experience', 'Sector', 'Program/Services Provided',
                'Remarks', 'Registration Date', 'Actions'
            ];
            
            columns.forEach((column, colIndex) => {
                const cell = document.createElement('td');
                
                if (column === 'ID') {
                    cell.textContent = record['SRS ID'] || `IMP-${index + 1}`;
                } else if (column === 'Actions') {
                    cell.className = 'actions-cell';
                    cell.innerHTML = `
                        <div class="action-buttons">
                            <button class="download-btn" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="delete-btn" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    const downloadBtn = cell.querySelector('.download-btn');
                    const deleteBtn = cell.querySelector('.delete-btn');
                    
                    downloadBtn.addEventListener('click', function() {
                        downloadApplicantData(record);
                    });
                    
                    deleteBtn.addEventListener('click', function() {
                        if (confirm('Are you sure you want to delete this imported record?')) {
                            deleteImportedRecord(index);
                        }
                    });
                } else {
                    let value = 'N/A';
                    const fieldMap = {
                        'Last Name': record['Last Name'] || record['LAST NAME'] || record['last_name'] || record['LASTNAME'] || record['Surname'] || record['SURNAME'] || record['surname'],
                        'Given Name': record['Given Name'] || record['GIVEN NAME'] || record['given name'] || record['given_name'] || record['First Name'] || record['FIRST NAME'] || record['first name'] || record['FIRSTNAME'],
                        'Middle Name': record['Middle Name'] || record['MIDDLE NAME'] || record['middle_name'] || record['MIDDLENAME'],
                        'Full Name': record['Full Name'] || record['FULL NAME'] || record['full name'] || record['NAME'] || record['Name'] || record['name'] || record['Complete Name'] || record['COMPLETE NAME'] || record['complete name'] || record['Applicant Name'] || record['APPLICANT NAME'] || record['applicant name'],
                        'Date of Birth': record['Date of Birth'] || record['DATE OF BIRTH'] || record['date of birth'] || record['Birthday'] || record['BIRTHDAY'] || record['birthday'] || record['Bdate'] || record['BDATE'] || record['bdate'] || record['bDate'],
                        'Age': record['Age'] || record['AGE'] || record['age'],
                        'Sex': record['Sex'] || record['SEX'] || record['sex'] || record['Gender'] || record['GENDER'] || record['gender'],
                        'Civil Status': record['Civil Status'] || record['CIVIL STATUS'] || record['civil status'],
                        'Street': record['Street'] || record['STREET'] || record['street'] || record['Street Address'] || record['STREET ADDRESS'] || record['street address'] || record['House No./Street/Village'] || record['HOUSE NO./STREET/VILLAGE'] || record['house no./street/village'] || record['House No.'] || record['HOUSE NO.'] || record['house no.'] || record['Street'] || record['STREET'] || record['street'] || record['Village'] || record['VILLAGE'] || record['village'],
                        'Barangay': record['Barangay'] || record['BARANGAY'] || record['barangay'],
                        'City': record['City'] || record['CITY'] || record['city'] || record['City/Municipality'] || record['CITY/MUNICIPALITY'] || record['city/municipality'] || record['MUNICIPALITY'] || record['Municipality'] || record['municipality'],
                        'Province': record['Province'] || record['PROVINCE'] || record['province'],
                        'Contact No.': record['Contact No.'] || record['CONTACT NO.'] || record['contact no.'] || record['Cellphone'] || record['CELLPHONE'] || record['cellphone'] || record['Phone No.'] || record['PHONE NO.'] || record['phone no.'] || record['Cellphone Number'] || record['CELLPHONE NUMBER'] || record['cellphone number'],
                        'Employment Status': record['Employment Status'] || record['EMPLOYMENT STATUS'] || record['employment status'] || record['Emp. Status'] || record['EMP. STATUS'] || record['emp. status'],
                        'If Employed/Self Employment': record['If Employed/Self Employment'] || record['IF EMPLOYED/SELF EMPLOYMENT'] || record['if employed/self employment'] || record['If Employed'] || record['IF EMPLOYED'] || record['if employed'] || record['Self Employed'] || record['SELF EMPLOYED'] || record['self employed'],
                        'Educational Attainment': record['Educational Attainment'] || record['EDUCATIONAL ATTAINMENT'] || record['educational attainment'] || record['Educ Level'] || record['EDUC LEVEL'] || record['educ level'],
                        'Course': record['Course'] || record['COURSE'] || record['course'] || record['Graduate Studies'] || record['GRADUATE STUDIES'] || record['graduate studies'],
                        'Skills': record['Skills'] || record['SKILLS'] || record['skills'],
                        'Work Experience': record['Work Experience'] || record['WORK EXPERIENCE'] || record['work experience'],
                        'Sector': record['Sector'] || record['SECTOR'] || record['sector'],
                        'Program/Services Provided': record['Program/Services Provided'] || record['PROGRAM/SERVICES PROVIDED'] || record['program/services provided'] || record['Program'] || record['PROGRAM'] || record['program'] || record['Services Provided'] || record['SERVICES PROVIDED'] || record['services provided'],
                        'Remarks': record['Remarks'] || record['REMARKS'] || record['remarks'],
                        'Registration Date': record['Registration Date'] || record['REGISTRATION DATE'] || record['registration date'] || record['Reg. Date'] || record['REG. DATE'] || record['reg. date'],
                    };
                    
                    value = fieldMap[column] || record[column] || 'N/A';
                    cell.textContent = value;
                    cell.className = 'compact-cell';
                }
                
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });
        
        // Save the merged data back to localStorage
        localStorage.setItem('importedData', JSON.stringify(mergedData));
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

    document.getElementById('export-applicants-btn').addEventListener('click', function() {
        exportApplicantsToExcel();
    });

    function exportApplicantsToExcel() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        if (savedApplicants.length === 0) {
            showNotification('No applicants to export', 'error');
            return;
        }
        
        try {
            const exportData = savedApplicants.map(applicant => {
                const exportApplicant = { ...applicant };
                
                // Ensure names are properly formatted for export
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
                
                return {
                    'SRS ID': exportApplicant['SRS ID'] || '',
                    'Last Name': exportApplicant['LAST NAME'] || extractLastName(exportApplicant.NAME),
                    'First Name': exportApplicant['FIRST NAME'] || extractFirstName(exportApplicant.NAME),
                    'Middle Name': exportApplicant['MIDDLE NAME'] || extractMiddleName(exportApplicant.NAME),
                    'Full Name': exportApplicant.NAME || '',
                    'Age': exportApplicant.AGE || '',
                    'Gender': exportApplicant.SEX || '',
                    'Civil Status': exportApplicant['CIVIL STATUS'] || '',
                    'Phone': exportApplicant.CELLPHONE || '',
                    'Email': exportApplicant.EMAIL || '',
                    'Barangay': exportApplicant.BARANGAY || '',
                    'City/Municipality': exportApplicant['CITY/MUNICIPALITY'] || '',
                    'Employment Status': exportApplicant['EMP. STATUS'] || '',
                    'Education Level': exportApplicant['EDUC LEVEL'] || '',
                    'Program Category': exportApplicant['PROGRAM CATEGORY'] || '',
                    'Program Status': exportApplicant['PROGRAM STATUS'] || '',
                    'Registration Date': exportApplicant['REG. DATE'] || ''
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

    function deleteImportedRecord(index) {
        const importedData = JSON.parse(localStorage.getItem('importedData')) || [];
        importedData.splice(index, 1);
        localStorage.setItem('importedData', JSON.stringify(importedData));
        displayImportedData([]); // Pass empty array to trigger reload of existing data
        showNotification('Imported record deleted successfully!', 'success');
    }

    function generateExpandableCourseStats(stats) {
        console.log('🔍 Debug: Starting course stats generation');
        console.log('📊 Education levels:', stats.byEducation);
        console.log('📚 All courses:', stats.byCourse);
        
        // More comprehensive college graduate detection
        const collegeGrads = calculateCollegeGraduates(stats.byEducation);
        
        console.log(`🎓 College graduates count: ${collegeGrads}`);
        
        if (collegeGrads === 0) {
            return '<p style="text-align: center; color: #666; margin: 10px 0;">No college graduates found in the data.</p>';
        }
        
        // Get all courses with proper filtering
        const allCourses = Object.entries(stats.byCourse)
            .filter(([course, count]) => {
                const isValidCourse = course && 
                    course !== 'No Course Specified' && 
                    course !== 'N/A' && 
                    course !== '' && 
                    course !== 'null' &&
                    course !== 'undefined' &&
                    count > 0;
                
                console.log(`📖 Course: "${course}", Count: ${count}, Valid: ${isValidCourse}`);
                return isValidCourse;
            })
            .sort((a, b) => b[1] - a[1]);

        console.log(`✅ Valid courses found: ${allCourses.length}`);
        
        let coursesHTML = '';
        
        if (allCourses.length === 0) {
            coursesHTML = '<p style="text-align: center; color: #666; padding: 10px;">Course data is available but no specific courses were recorded for college graduates.</p>';
        } else {
            allCourses.forEach(([course, count]) => {
                const percentage = ((count / collegeGrads) * 100).toFixed(1);
                coursesHTML += `
                    <div class="course-item">
                        <span class="course-name">${course}</span>
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <span class="course-count">${count}</span>
                            <span class="course-percentage">${percentage}%</span>
                        </div>
                    </div>
                `;
            });

            coursesHTML += `
                <div class="course-summary">
                    <span>Total College Graduates</span>
                    <span style="color: #2196f3;">${collegeGrads}</span>
                </div>
            `;
        }

        return `
            <div class="expandable-section" style="margin-top: 20px;">
                <div class="expandable-header">
                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                        <span style="font-weight: bold; color: #1976d2;">
                            <i class="fas fa-graduation-cap" style="margin-right: 8px;"></i>
                            ${collegeGrads} College Graduates - Course Breakdown
                            ${allCourses.length > 0 ? `<span style="font-size: 12px; color: #666; margin-left: 8px;">(${allCourses.length} courses)</span>` : ''}
                        </span>
                    </div>
                </div>
                <div class="expandable-content">
                    ${coursesHTML}
                </div>
            </div>
        `;
    }

    // Add this helper function to better detect college graduates
    function calculateCollegeGraduates(educationLevels) {
        let total = 0;
        
        // Comprehensive list of education levels that indicate college graduation
        const collegeLevels = [
            'College Graduate', 'College', 'Bachelor', 'Bachelor\'s Degree',
            'BS', 'B.S.', 'AB', 'A.B.', 'B.A.', 'BA',
            'Bachelor of Science', 'Bachelor of Arts',
            'Undergraduate', 'University', 'College Level',
            'Tertiary', 'Higher Education'
        ];
        
        Object.entries(educationLevels).forEach(([level, count]) => {
            const lowerLevel = level.toLowerCase();
            
            // Check if this education level indicates college
            const isCollegeLevel = collegeLevels.some(collegeLevel => 
                lowerLevel.includes(collegeLevel.toLowerCase()) || 
                collegeLevel.toLowerCase().includes(lowerLevel)
            );
            
            // Also check for common patterns
            const hasCollegeKeywords = 
                lowerLevel.includes('college') ||
                lowerLevel.includes('bachelor') ||
                lowerLevel.includes('university') ||
                lowerLevel.includes('tertiary') ||
                lowerLevel.includes('degree');
                
            if (isCollegeLevel || hasCollegeKeywords) {
                console.log(`🎓 Counting as college: "${level}" with ${count} graduates`);
                total += count;
            }
        });
        
        return total;
    }
    function extractLastName(fullName) {
        if (!fullName || fullName === 'N/A') return '';
        const parts = fullName.split(',');
        return parts[0] ? parts[0].trim() : fullName.split(' ')[0] || '';
    }

    function extractFirstName(fullName) {
        if (!fullName || fullName === 'N/A') return '';
        const parts = fullName.split(',');
        if (parts.length > 1) {
            const firstMiddle = parts[1].trim().split(' ');
            return firstMiddle[0] || '';
        }
        const nameParts = fullName.split(' ');
        return nameParts.length > 1 ? nameParts[1] : nameParts[0] || '';
    }

    function extractMiddleName(fullName) {
        if (!fullName || fullName === 'N/A') return '';
        const parts = fullName.split(',');
        if (parts.length > 1) {
            const firstMiddle = parts[1].trim().split(' ');
            return firstMiddle.length > 1 ? firstMiddle.slice(1).join(' ') : '';
        }
        const nameParts = fullName.split(' ');
        return nameParts.length > 2 ? nameParts.slice(2).join(' ') : '';
    }

    function formatFullName(applicant) {
        const lastName = applicant['LAST NAME'] || applicant.LASTNAME || '';
        const firstName = applicant['FIRST NAME'] || applicant.FIRSTNAME || '';
        const middleName = applicant['MIDDLE NAME'] || applicant.MIDDLENAME || '';
        
        if (lastName && firstName) {
            return `${lastName}, ${firstName} ${middleName}`.trim();
        }
        return applicant.NAME || '';
    }

    function getFormFieldMappings() {
        return {
            'SRS ID': ['SRS ID', 'ID', 'Applicant ID', 'SRS_ID', 'srs id'],
            'LAST NAME': ['LAST NAME', 'Last Name', 'LASTNAME', 'last name', 'Surname', 'Family Name'],
            'FIRST NAME': ['FIRST NAME', 'First Name', 'FIRSTNAME', 'first name', 'Given Name'],
            'MIDDLE NAME': ['MIDDLE NAME', 'Middle Name', 'MIDDLENAME', 'middle name', 'Middle Initial'],
            'NAME': ['NAME', 'Full Name', 'FULL NAME', 'full name', 'Complete Name', 'Applicant Name'],
            'BDATE': ['BDATE', 'Date of Birth', 'Birthday', 'BIRTH DATE', 'Birth Date', 'DOB'],
            'AGE': ['AGE', 'Age'],
            'SEX': ['SEX', 'Gender', 'SEX/GENDER', 'gender', 'GENDER', 'Sex'],
            'CIVIL STATUS': ['CIVIL STATUS', 'Civil Status', 'Status', 'Marital Status'],
            'STREET ADDRESS': ['STREET ADDRESS', 'Street Address', 'Address', 'STREET', 'Street', 'House No', 'House Number', 'Village', 'House No./Street/Village'],
            'BARANGAY': ['BARANGAY', 'Barangay', 'BRGY', 'Brgy'],
            'CITY/MUNICIPALITY': ['CITY/MUNICIPALITY', 'City/Municipality', 'City', 'Municipality', 'CITY', 'MUNICIPALITY'],
            'PROVINCE': ['PROVINCE', 'Province'],
            'REGION': ['REGION', 'Region'],
            'EMAIL': ['EMAIL', 'Email', 'Email Address', 'email', 'username', 'Username', 'USERNAME', 'user name','Email Address', 'E-mail', 'e-mail', 'E-Mail','Contact Email', 'contact email', 'CONTACT EMAIL','Email ID', 'email id', 'EmailId'],
            'TELEPHONE': ['TELEPHONE', 'Telephone', 'Phone', 'Landline', 'LANDLINE NUMBER', 'Landline Number'],
            'CELLPHONE': ['CELLPHONE', 'Cellphone', 'Mobile', 'Mobile No', 'Contact No', 'Contact Number', 'Cellphone Number'],
            'EMP. STATUS': ['EMP. STATUS', 'Employment Status', 'EMP STATUS', 'Employment'],
            'EMP. TYPE': ['EMP. TYPE', 'Employment Type', 'EMP TYPE', 'Type of Employment'],
            'EDUC LEVEL': ['EDUC LEVEL', 'Educational Level', 'Education', 'Educational Attainment'],
            'COURSE': ['COURSE', 'Course', 'Degree', 'College Course'],
            '4Ps': ['4Ps', '4PS', '4Ps Member', 'Pantawid Pamilya'],
            'PWD': ['PWD', 'Person with Disability', 'PWD Status'],
            'DISABILITY': ['DISABILITY', 'Disability', 'Type of Disability'],
            'PREFERRED POSITION': ['PREFERRED POSITION', 'Preferred Position', 'Desired Position', 'Job Preference'],
            'SKILLS': ['SKILLS', 'Skills', 'Competencies'],
            'WORK EXPERIENCE': ['WORK EXPERIENCE', 'Work Experience', 'Experience', 'Employment History'],
            'OFW': ['OFW', 'Overseas Filipino Worker', 'OFW Status'],
            'COUNTRY': ['COUNTRY', 'Country', 'Current Country'],
            'FORMER OFW': ['FORMER OFW', 'Former OFW', 'Ex-OFW'],
            'LATEST COUNTRY': ['LATEST COUNTRY', 'Latest Country', 'Previous Country'],
            'REG. DATE': ['REG. DATE', 'Registration Date', 'Date Registered', 'REG DATE'],
            'REMARKS': ['REMARKS', 'Remarks', 'Notes', 'Comments'],
            'PROGRAM CATEGORY': ['PROGRAM CATEGORY', 'Program Category', 'Category', 'Sector'],
            'SPECIFIC PROGRAM': ['SPECIFIC PROGRAM', 'Specific Program', 'Program', 'Service'],
            'PROGRAM STATUS': ['PROGRAM STATUS', 'Program Status', 'Status']
        };
    }

    function findMatchingValue(record, possibleLabels) {
        if (!record) return null;
        
        // First: Exact case-insensitive match
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                if (recordKey.toLowerCase() === label.toLowerCase()) {
                    return record[recordKey];
                }
            }
        }
        
        // Second: Partial match (contains)
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                if (recordKey.toLowerCase().includes(label.toLowerCase()) || 
                    label.toLowerCase().includes(recordKey.toLowerCase())) {
                    return record[recordKey];
                }
            }
        }
        
        // Third: Remove spaces/special chars and match
        for (const label of possibleLabels) {
            const cleanLabel = label.toLowerCase().replace(/[\s_\-]/g, '');
            for (const recordKey in record) {
                const cleanRecordKey = recordKey.toLowerCase().replace(/[\s_\-]/g, '');
                if (cleanRecordKey === cleanLabel) {
                    return record[recordKey];
                }
            }
        }
        
        // Fourth: Common field name variations
        const commonVariations = {
            'username': ['userid', 'login', 'emailaddress', 'e-mail'],
            'email': ['mail', 'electronicmail', 'contactinfo']
        };
        
        for (const label of possibleLabels) {
            const variations = commonVariations[label.toLowerCase()] || [];
            for (const variation of variations) {
                for (const recordKey in record) {
                    const cleanRecordKey = recordKey.toLowerCase().replace(/[\s_\-]/g, '');
                    if (cleanRecordKey === variation) {
                        return record[recordKey];
                    }
                }
            }
        }
        
        return null;
    }

    function processFieldValue(fieldKey, value) {
        if (!value) return value;
        
        value = String(value).trim();
        
        if (fieldKey === 'BDATE' || fieldKey === 'REG. DATE') {
            return formatDateValue(value);
        }
        
        const booleanFields = ['4Ps', 'PWD', 'OFW', 'FORMER OFW'];
        if (booleanFields.includes(fieldKey)) {
            return normalizeBooleanValue(value);
        }
        
        if (fieldKey === 'AGE' || fieldKey === 'CELLPHONE') {
            if (value.includes('.0')) {
                value = value.replace('.0', '');
            }
        }
        
        if (value === '' || value === 'null' || value === 'undefined' || value === 'NaN') {
            return 'N/A';
        }
        
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

    function normalizeBooleanValue(value) {
        const trueValues = ['yes', 'true', '1', 'y', 'check', 'checked', 'x'];
        const falseValues = ['no', 'false', '0', 'n', 'unchecked', ''];
        
        const lowerValue = value.toLowerCase().trim();
        
        if (trueValues.includes(lowerValue)) return 'Yes';
        if (falseValues.includes(lowerValue)) return 'No';
        
        return value; 
    }

    function smartImportData(jsonData) {
        console.log("Raw imported data:", jsonData);
        
        if (jsonData.length === 0) {
            return [];
        }
        jsonData.forEach((record, index) => {
            console.log(`Record ${index} course fields:`, {
                'COURSE': record.COURSE,
                'Course': record.Course,
                'course': record.course,
                'COURSE/DEGREE': record['COURSE/DEGREE'],
                'All keys': Object.keys(record)
            });
        });
        
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

    function combineNameFromParts(record, processedRecord) {
        let lastName = processedRecord['LAST NAME'];
        let firstName = processedRecord['FIRST NAME'];
        let middleName = processedRecord['MIDDLE NAME'];
        
        if (lastName === 'N/A') {
            lastName = findMatchingValue(record, ['LAST NAME', 'Last Name', 'LASTNAME', 'last name', 'Surname']);
        }
        if (firstName === 'N/A') {
            firstName = findMatchingValue(record, ['FIRST NAME', 'First Name', 'FIRSTNAME', 'first name', 'Given Name']);
        }
        if (middleName === 'N/A') {
            middleName = findMatchingValue(record, ['MIDDLE NAME', 'Middle Name', 'MIDDLENAME', 'middle name', 'Middle Initial']);
        }
        
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
        
        for (const key in record) {
            const lowerKey = key.toLowerCase();
            if ((lowerKey.includes('name') || lowerKey.includes('full') || lowerKey.includes('complete')) && 
                record[key] && record[key] !== 'N/A') {
                return record[key];
            }
        }
        
        return 'N/A';
    }

    function checkImportedDuplicate(newApplicant, importedData) {
        const matches = [];
        
        // Field mappings for imported data (since imported data might have different field names)
        const fieldMappings = {
            'NAME': ['NAME', 'Full Name', 'FULL NAME', 'full name', 'Complete Name', 'Applicant Name'],
            'BDATE': ['BDATE', 'Date of Birth', 'Birthday', 'BIRTH DATE', 'Birth Date', 'DOB'],
            'CELLPHONE': ['CELLPHONE', 'Cellphone', 'Mobile', 'Mobile No', 'Contact No', 'Contact Number'],
            'EMAIL': ['EMAIL', 'Email', 'email', 'Email Address', 'EMAIL ADDRESS', 'email address', 'Username', 'USERNAME', 'username']
        };
        
        for (const existingApp of importedData) {
            // Extract values using field mappings for both new and existing applicants
            const newName = extractFieldValue(newApplicant, fieldMappings['NAME'])?.toLowerCase() || '';
            const existingName = extractFieldValue(existingApp, fieldMappings['NAME'])?.toLowerCase() || '';
            
            const newBdate = extractFieldValue(newApplicant, fieldMappings['BDATE']) || '';
            const existingBdate = extractFieldValue(existingApp, fieldMappings['BDATE']) || '';
            
            const newPhone = extractFieldValue(newApplicant, fieldMappings['CELLPHONE']) || '';
            const existingPhone = extractFieldValue(existingApp, fieldMappings['CELLPHONE']) || '';
            
            const newEmail = extractFieldValue(newApplicant, fieldMappings['EMAIL'])?.toLowerCase() || '';
            const existingEmail = extractFieldValue(existingApp, fieldMappings['EMAIL'])?.toLowerCase() || '';
            
            // Check for matches with better logic
            const nameMatch = newName && existingName && newName === existingName;
            const bdateMatch = newBdate && existingBdate && newBdate === existingBdate;
            const phoneMatch = newPhone && existingPhone && newPhone === existingPhone;
            const emailMatch = newEmail && existingEmail && newEmail === existingEmail;
            
            const sameNameDifferentBday = nameMatch && !bdateMatch;
            
            // Consider it a duplicate if we have strong matches
            if (nameMatch && (bdateMatch || phoneMatch || emailMatch)) {
                const matchDetails = {
                    existingApplicant: existingApp,
                    matchingFields: [],
                    differences: [],
                    sameNameDifferentBday: sameNameDifferentBday,
                    source: 'imported'
                };
                
                if (nameMatch) matchDetails.matchingFields.push('Name');
                if (bdateMatch) matchDetails.matchingFields.push('Birthday');
                if (phoneMatch) matchDetails.matchingFields.push('Phone Number');
                if (emailMatch) matchDetails.matchingFields.push('Email');
                if (sameNameDifferentBday) matchDetails.matchingFields.push('Same Name, Different Birthday');
                
                // Compare other fields for differences
                const fieldsToCompare = ['BARANGAY', 'CITY/MUNICIPALITY', 'PROGRAM CATEGORY'];
                
                fieldsToCompare.forEach(field => {
                    const newValue = extractFieldValue(newApplicant, [field]) || '';
                    const existingValue = extractFieldValue(existingApp, [field]) || '';
                    
                    if (newValue && existingValue && newValue.toLowerCase() !== existingValue.toLowerCase()) {
                        matchDetails.differences.push({
                            field: field,
                            newValue: newValue,
                            existingValue: existingValue
                        });
                    }
                });
                
                // Add birthday difference for same name cases
                if (sameNameDifferentBday) {
                    matchDetails.differences.push({
                        field: 'Birthday',
                        newValue: newBdate || 'Not provided',
                        existingValue: existingBdate || 'Not provided'
                    });
                }
                
                matches.push(matchDetails);
            }
        }
        
        return {
            hasMatches: matches.length > 0,
            matches: matches
        };
    }

    // Helper function to extract field values using mappings
    function extractFieldValue(record, possibleLabels) {
        if (!record) return null;
        
        // First try exact matches
        for (const label of possibleLabels) {
            if (record[label] && record[label] !== 'N/A') {
                return record[label];
            }
        }
        
        // Then try case-insensitive matches
        for (const recordKey in record) {
            for (const label of possibleLabels) {
                if (recordKey.toLowerCase() === label.toLowerCase()) {
                    return record[recordKey];
                }
            }
        }
        
        // Then try partial matches
        for (const recordKey in record) {
            for (const label of possibleLabels) {
                if (recordKey.toLowerCase().includes(label.toLowerCase()) || 
                    label.toLowerCase().includes(recordKey.toLowerCase())) {
                    return record[recordKey];
                }
            }
        }
        
        return null;
    }

    function validateImportedDataDuplicates(newApplicants) {
        console.log('🔍 Starting duplicate validation (Name + Birthday only)...');
        const importedData = JSON.parse(localStorage.getItem('importedData')) || [];
        const mainApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        
        console.log('📊 Data counts:', {
            newApplicants: newApplicants.length,
            importedData: importedData.length,
            mainApplicants: mainApplicants.length
        });

        const duplicates = {
            inImported: [],
            inMain: [],
            unique: []
        };

        newApplicants.forEach((newApp, newIndex) => {
            console.log(`\n🔍 Checking new applicant ${newIndex + 1}:`, newApp.NAME);
            let isDuplicate = false;

            // Check against imported data (Name + Birthday only)
            importedData.forEach((importedApp, importedIndex) => {
                if (isDuplicateByNameAndBirthday(newApp, importedApp)) {
                    console.log(`✅ Found duplicate in imported data: ${newApp.NAME} (${newApp.BDATE}) matches ${importedApp.NAME} (${importedApp.BDATE})`);
                    duplicates.inImported.push({
                        new: newApp,
                        existing: importedApp,
                        source: 'imported'
                    });
                    isDuplicate = true;
                }
            });

            // Check against main applicants (Name + Birthday only)
            if (!isDuplicate) {
                mainApplicants.forEach((mainApp, mainIndex) => {
                    if (isDuplicateByNameAndBirthday(newApp, mainApp)) {
                        console.log(`✅ Found duplicate in main data: ${newApp.NAME} (${newApp.BDATE}) matches ${mainApp.NAME} (${mainApp.BDATE})`);
                        duplicates.inMain.push({
                            new: newApp,
                            existing: mainApp,
                            source: 'main'
                        });
                        isDuplicate = true;
                    }
                });
            }

            // If no duplicates found, add to unique
            if (!isDuplicate) {
                console.log(`✅ No duplicates found for: ${newApp.NAME} (${newApp.BDATE})`);
                duplicates.unique.push(newApp);
            }
        });

        console.log('📋 Final validation results:', duplicates);
        return duplicates;
    }

    function isDuplicateByNameAndBirthday(app1, app2) {
        if (!app1 || !app2) return false;

        // Get names - handle various field names
        const name1 = (app1.NAME || app1.name || app1['Full Name'] || '').toString().trim();
        const name2 = (app2.NAME || app2.name || app2['Full Name'] || '').toString().trim();
        
        // Get birth dates
        const bdate1 = (app1.BDATE || app1.bdate || app1['Date of Birth'] || '').toString().trim();
        const bdate2 = (app2.BDATE || app2.bdate || app2['Date of Birth'] || '').toString().trim();

        console.log('🔍 Comparing by Name + Birthday:', {
            name1, name2,
            bdate1, bdate2
        });

        // Skip if either name is empty or "N/A"
        if (!name1 || name1 === 'N/A' || !name2 || name2 === 'N/A') {
            return false;
        }

        // Rule 1: Exact name match + exact birthday match
        const nameMatch = name1.toLowerCase() === name2.toLowerCase();
        const bdateMatch = normalizeDate(bdate1) === normalizeDate(bdate2);

        console.log('🎯 Name match:', nameMatch, 'Birthday match:', bdateMatch);

        // Only consider it a duplicate if BOTH name and birthday match
        if (nameMatch && bdateMatch) {
            console.log('🎯 Exact Name + Birthday match found');
            return true;
        }

        console.log('❌ No Name + Birthday duplicate match found');
        return false;
    }

    function normalizeDate(dateString) {
        if (!dateString || dateString === 'N/A') return '';
        
        try {
            // Handle MM/DD/YYYY format (common in your system)
            if (dateString.includes('/')) {
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    const month = parts[0].padStart(2, '0');
                    const day = parts[1].padStart(2, '0');
                    const year = parts[2];
                    return `${month}/${day}/${year}`;
                }
            }
            
            // Handle YYYY-MM-DD format (from date inputs)
            if (dateString.includes('-')) {
                const date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                }
            }
            
            // Return original if no specific format matched
            return dateString;
        } catch (error) {
            console.warn('Date normalization error:', error);
            return dateString;
        }
    }

    function areNamesSimilar(name1, name2) {
        if (name1 === name2) return true;
        
        // Remove extra spaces and special characters
        const clean1 = name1.replace(/\s+/g, ' ').trim().toLowerCase();
        const clean2 = name2.replace(/\s+/g, ' ').trim().toLowerCase();
        
        // Split into parts
        const parts1 = clean1.split(' ');
        const parts2 = clean2.split(' ');
        
        // Check if they share significant name parts
        const significantParts1 = parts1.filter(part => part.length > 2);
        const significantParts2 = parts2.filter(part => part.length > 2);
        
        const commonParts = significantParts1.filter(part => 
            significantParts2.some(otherPart => 
                part === otherPart || 
                otherPart.includes(part) || 
                part.includes(otherPart)
            )
        );
        
        return commonParts.length >= Math.min(significantParts1.length, significantParts2.length);
    }

    function formatDateForComparison(dateString) {
        if (!dateString || dateString === 'N/A') return '';
        
        try {
            // Handle MM/DD/YYYY format
            if (dateString.includes('/')) {
                const parts = dateString.split('/');
                if (parts.length === 3) {
                    const month = parts[0].padStart(2, '0');
                    const day = parts[1].padStart(2, '0');
                    const year = parts[2];
                    return `${year}-${month}-${day}`;
                }
            }
            
            // Handle other date formats
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        } catch (error) {
            console.warn('Date comparison error:', error);
        }
        
        return dateString;
    }

    function normalizePhone(phone) {
        if (!phone || phone === 'N/A') return '';
        
        // Remove all non-digit characters
        return phone.replace(/\D/g, '');
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
                    <!-- Summary Section -->
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

            // Imported Data Duplicates Section
            if (validationResults.inImported.length > 0) {
                message += `
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #ff9800; border-bottom: 2px solid #ff9800; padding-bottom: 5px;">
                            <i class="fas fa-database"></i> Duplicates in Imported Data (${validationResults.inImported.length})
                        </h3>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                            These records already exist in your imported data table.
                        </p>
                        <div style="max-height: 300px; overflow-y: auto;">`;
                
                validationResults.inImported.forEach((dup, index) => {
                    message += `
                        <div style="background: #fff3e0; padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 4px solid #ff9800;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <div style="flex: 1;">
                                    <strong style="color: #e65100;">New Record:</strong> ${dup.new.NAME || 'N/A'}
                                </div>
                                <span style="background: #ff9800; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                                    Match #${index + 1}
                                </span>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                                <div><strong>Birth:</strong> ${dup.new.BDATE || 'N/A'}</div>
                                <div><strong>Phone:</strong> ${dup.new.CELLPHONE || 'N/A'}</div>
                                <div><strong>Email:</strong> ${dup.new.EMAIL || 'N/A'}</div>
                                <div><strong>Location:</strong> ${dup.new.BARANGAY || 'N/A'}</div>
                            </div>
                            <div style="margin-top: 8px; padding: 8px; background: #fff8e1; border-radius: 4px;">
                                <strong>Matching Imported Record:</strong> ${dup.existing.NAME || 'N/A'}
                            </div>
                        </div>`;
                });
                
                message += `</div></div>`;
            }

            // Main Database Duplicates Section
            if (validationResults.inMain.length > 0) {
                message += `
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #f44336; border-bottom: 2px solid #f44336; padding-bottom: 5px;">
                            <i class="fas fa-users"></i> Duplicates in Main Database (${validationResults.inMain.length})
                        </h3>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                            These records already exist in your main applicant database.
                        </p>
                        <div style="max-height: 300px; overflow-y: auto;">`;
                
                validationResults.inMain.forEach((dup, index) => {
                    message += `
                        <div style="background: #ffebee; padding: 12px; margin: 8px 0; border-radius: 4px; border-left: 4px solid #f44336;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                <div style="flex: 1;">
                                    <strong style="color: #c62828;">New Record:</strong> ${dup.new.NAME || 'N/A'}
                                </div>
                                <span style="background: #f44336; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                                    Match #${index + 1}
                                </span>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
                                <div><strong>Birth:</strong> ${dup.new.BDATE || 'N/A'}</div>
                                <div><strong>Phone:</strong> ${dup.new.CELLPHONE || 'N/A'}</div>
                                <div><strong>Email:</strong> ${dup.new.EMAIL || 'N/A'}</div>
                                <div><strong>Program:</strong> ${dup.new['PROGRAM CATEGORY'] || 'N/A'}</div>
                            </div>
                            <div style="margin-top: 8px; padding: 8px; background: #fce4ec; border-radius: 4px;">
                                <strong>Matching Main Record:</strong> ${dup.existing.NAME || 'N/A'}
                            </div>
                        </div>`;
                });
                
                message += `</div></div>`;
            }

            // Unique Records Section
            if (validationResults.unique.length > 0) {
                message += `
                    <div style="margin-bottom: 25px;">
                        <h3 style="color: #4caf50; border-bottom: 2px solid #4caf50; padding-bottom: 5px;">
                            <i class="fas fa-user-check"></i> New Unique Records (${validationResults.unique.length})
                        </h3>
                        <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                            These records will be added as new entries.
                        </p>
                        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">`;
                
                validationResults.unique.slice(0, 20).forEach((app, index) => {
                    message += `
                        <div style="padding: 5px; border-bottom: 1px solid #f0f0f0;">
                            <strong>${app.NAME || 'Unnamed Record'}</strong><br>
                            <span style="color: #666;">${app.BDATE || 'No birth date'} | ${app.CELLPHONE || 'No phone'}</span>
                        </div>`;
                });
                
                if (validationResults.unique.length > 20) {
                    message += `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 10px; color: #666;">
                            ... and ${validationResults.unique.length - 20} more records
                        </div>`;
                }
                
                message += `</div></div></div>`;
            }

            // Action Section
            message += `
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 4px; margin-top: 20px;">
                        <p><strong>Import Options:</strong></p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div style="background: #e8f5e8; padding: 10px; border-radius: 4px;">
                                <strong>Import Unique Only</strong><br>
                                <small>Add only ${validationResults.unique.length} new records</small>
                            </div>
                            <div style="background: #fff3e0; padding: 10px; border-radius: 4px;">
                                <strong>Import All Records</strong><br>
                                <small>Add all ${allApplicants.length} records (including duplicates)</small>
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

            // Event handlers
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

    function createTestData() {
        console.log('🧪 Creating test data...');
        
        // Create some test imported data
        const testImportedData = [
            {
                'NAME': 'John Smith',
                'BDATE': '01/15/1990',
                'CELLPHONE': '09123456789',
                'EMAIL': 'john.smith@example.com',
                'BARANGAY': 'Test Barangay',
                'SRS ID': 'TEST_IMPORT_1'
            },
            {
                'NAME': 'Maria Garcia',
                'BDATE': '05/20/1985',
                'CELLPHONE': '09111111111',
                'EMAIL': 'maria.garcia@example.com',
                'BARANGAY': 'Sample Village',
                'SRS ID': 'TEST_IMPORT_2'
            }
        ];
        
        // Save to imported data
        localStorage.setItem('importedData', JSON.stringify(testImportedData));
        console.log('✅ Test imported data created');
        
        // Create some test main applicants
        const testMainApplicants = [
            {
                'NAME': 'Robert Johnson',
                'BDATE': '03/10/1978',
                'CELLPHONE': '09222222222',
                'EMAIL': 'robert.johnson@example.com',
                'BARANGAY': 'Main Town',
                'SRS ID': 'TEST_MAIN_1'
            }
        ];
        
        // Save to main applicants
        localStorage.setItem('mainApplicants', JSON.stringify(testMainApplicants));
        console.log('✅ Test main applicants created');
        
        return {
            imported: testImportedData,
            main: testMainApplicants
        };
    }

    // Function to open manual form with existing applicant data
    function openManualFormWithData(applicant) {
        if (!elements.manualModal) return;
        
        // Close view modal first
        elements.viewModal.style.display = 'none';
        
        // Open manual modal
        elements.manualModal.style.display = 'block';
        
        // Update modal header for edit mode
        const modalHeader = elements.manualModal.querySelector('.modal-header h2');
        if (modalHeader) {
            modalHeader.textContent = 'Edit Applicant';
            modalHeader.style.color = '#ff9800';
        }
        
        // Add edit mode class
        elements.manualModal.classList.add('manual-form-edit-mode');
        
        // Store the applicant ID for updating
        currentEditId = applicant['SRS ID'] || applicant.ID;
        
        // Populate the manual form with applicant data
        populateManualForm(applicant);
    }

    // Function to populate manual form with data
    function populateManualForm(applicant) {
        if (!applicant) return;
        
        console.log('Populating manual form with data:', applicant);
        
        // Personal Information Section
        document.getElementById('manual-surname').value = applicant['LAST NAME'] || '';
        document.getElementById('manual-first-name').value = applicant['FIRST NAME'] || '';
        document.getElementById('manual-middle-name').value = applicant['MIDDLE NAME'] || '';
        
        // Suffix (extract from name if needed)
        const suffix = extractSuffix(applicant.NAME);
        if (suffix && document.getElementById('manual-suffix')) {
            document.getElementById('manual-suffix').value = suffix;
        }
        
        // Date of Birth - convert format if needed
        if (applicant.BDATE && applicant.BDATE !== 'N/A') {
            const bdate = formatDateForInput(applicant.BDATE);
            document.getElementById('manual-bdate').value = bdate;
        }
        
        document.getElementById('manual-place-birth').value = applicant['PLACE OF BIRTH'] || '';
        
        // Address Information
        document.getElementById('manual-house-street').value = applicant['STREET ADDRESS'] || '';
        document.getElementById('manual-barangay').value = applicant.BARANGAY || '';
        document.getElementById('manual-city-municipality').value = applicant['CITY/MUNICIPALITY'] || '';
        document.getElementById('manual-province').value = applicant.PROVINCE || '';
        
        // Personal Details
        setSelectValue('manual-sex', applicant.SEX);
        setSelectValue('manual-civil-status', applicant['CIVIL STATUS']);
        
        document.getElementById('manual-tin').value = applicant.TIN || '';
        document.getElementById('manual-gsis-sss').value = applicant['GSIS/SSS NO.'] || '';
        document.getElementById('manual-pagibig').value = applicant['PAGIBIG NO.'] || '';
        document.getElementById('manual-philhealth').value = applicant['PHILHEALTH NO.'] || '';
        document.getElementById('manual-height').value = applicant.HEIGHT || '';
        document.getElementById('manual-email').value = applicant.EMAIL || '';
        document.getElementById('manual-landline').value = applicant.TELEPHONE || '';
        document.getElementById('manual-cellphone').value = applicant.CELLPHONE || '';
        
        // Disability
        if (applicant.DISABILITY && applicant.DISABILITY !== 'N/A') {
            const disabilities = applicant.DISABILITY.split(',').map(d => d.trim());
            disabilities.forEach(disability => {
                const checkbox = document.querySelector(`input[name="manual-disability"][value="${disability}"]`);
                if (checkbox) checkbox.checked = true;
            });
            
            // Handle "Others" disability
            if (applicant.DISABILITY.includes('Others') && applicant['DISABILITY SPECIFY']) {
                document.getElementById('manual-disability-others').checked = true;
                document.getElementById('manual-disability-specify').style.display = 'block';
                document.getElementById('manual-disability-specify').value = applicant['DISABILITY SPECIFY'];
            }
        }
        
        // Employment Status
        setSelectValue('manual-emp-status', applicant['EMP. STATUS']);
        
        // 4Ps
        if (applicant['4Ps'] && applicant['4Ps'] !== 'N/A') {
            const fourPsValue = applicant['4Ps'].toLowerCase() === 'yes' ? 'Yes' : 'No';
            document.querySelector(`input[name="manual-4ps"][value="${fourPsValue}"]`).checked = true;
            
            if (fourPsValue === 'Yes' && applicant['4PS ID']) {
                document.getElementById('manual-4ps-id').style.display = 'block';
                document.getElementById('manual-4ps-id').value = applicant['4PS ID'];
            }
        }
        
        // Job Preference Section
        document.getElementById('manual-pref-occupation1').value = applicant['PREFERRED POSITION'] || '';
        
        // Expected Salary
        document.getElementById('manual-expected-salary').value = applicant['EXPECTED SALARY'] || '';
        
        // Passport Information
        document.getElementById('manual-passport').value = applicant.PASSPORT || '';
        if (applicant['PASSPORT EXPIRY']) {
            document.getElementById('manual-passport-expiry').value = formatDateForInput(applicant['PASSPORT EXPIRY']);
        }
        
        // Language Proficiency
        populateLanguageProficiency(applicant);
        
        // Educational Background
        populateEducationalBackground(applicant);
        
        // Program Information
        setSelectValue('manual-program-category', applicant['PROGRAM CATEGORY']);
        document.getElementById('manual-specific-program').value = applicant['SPECIFIC PROGRAM'] || '';
        setSelectValue('manual-program-status', applicant['PROGRAM STATUS']);
        
        // Load photo if exists
        const photoId = applicant['SRS ID'] || applicant.ID;
        const savedPhoto = localStorage.getItem(`photo_${photoId}`);
        if (savedPhoto) {
            elements.manualPhotoPreview.src = savedPhoto;
            elements.manualPhotoPreview.style.display = 'block';
            elements.manualPhotoPlaceholder.style.display = 'none';
            elements.manualRemovePhotoBtn.style.display = 'block';
        }
        
        // Update form submission to handle edit instead of add
        updateManualFormForEdit(applicant);
    }

    // Helper function to set select values
    function setSelectValue(selectId, value) {
        const select = document.getElementById(selectId);
        if (select && value && value !== 'N/A') {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === value) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // Extract suffix from full name
    function extractSuffix(fullName) {
        if (!fullName) return '';
        const suffixes = ['Jr.', 'Sr.', 'II', 'III', 'IV'];
        const nameParts = fullName.split(' ');
        const lastPart = nameParts[nameParts.length - 1];
        return suffixes.includes(lastPart) ? lastPart : '';
    }

    // Populate language proficiency
    function populateLanguageProficiency(applicant) {
        // This would need to be customized based on how you store language data
        // For now, setting basic English and Filipino if skills indicate
        if (applicant.SKILLS && applicant.SKILLS.toLowerCase().includes('english')) {
            document.getElementById('manual-lang-english-read').checked = true;
            document.getElementById('manual-lang-english-write').checked = true;
            document.getElementById('manual-lang-english-speak').checked = true;
            document.getElementById('manual-lang-english-understand').checked = true;
        }
        
        if (applicant.SKILLS && applicant.SKILLS.toLowerCase().includes('filipino')) {
            document.getElementById('manual-lang-filipino-read').checked = true;
            document.getElementById('manual-lang-filipino-write').checked = true;
            document.getElementById('manual-lang-filipino-speak').checked = true;
            document.getElementById('manual-lang-filipino-understand').checked = true;
        }
    }

    // Populate educational background
    function populateEducationalBackground(applicant) {
        // Populate based on EDUC LEVEL and COURSE
        const educLevel = applicant['EDUC LEVEL'] || '';
        const course = applicant.COURSE || '';
        
        if (educLevel.includes('Elementary')) {
            document.getElementById('manual-edu-elem-course').value = course;
        } else if (educLevel.includes('Secondary') || educLevel.includes('High School')) {
            document.getElementById('manual-edu-secondary-course').value = course;
        } else if (educLevel.includes('College') || educLevel.includes('Bachelor')) {
            document.getElementById('manual-edu-tertiary-course').value = course;
        } else if (educLevel.includes('Graduate')) {
            document.getElementById('manual-edu-graduate-course').value = course;
        }
    }

    // Update manual form to handle edits instead of new entries
    // Replace the updateManualFormForEdit function with this improved version
    function updateManualFormForEdit(applicant) {
        // Remove ALL existing submit event listeners by cloning the form
        const newForm = elements.manualApplicantForm.cloneNode(true);
        elements.manualApplicantForm.parentNode.replaceChild(newForm, elements.manualApplicantForm);
        elements.manualApplicantForm = newForm;
        
        // Re-initialize photo controls for the new form
        initializeManualPhotoControls();
        
        // Add submit handler for editing
        elements.manualApplicantForm.addEventListener('submit', function(event) {
            event.preventDefault();
            updateApplicantFromManualForm(applicant);
        });
        
        // Update the submit button text
        const submitBtn = elements.manualApplicantForm.querySelector('.save-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Applicant';
            submitBtn.type = 'button'; // Change to button to prevent form submission
            submitBtn.onclick = function() {
                updateApplicantFromManualForm(applicant);
            };
        }
        
        // Remove required attributes temporarily to avoid validation issues
        removeTemporaryValidation();
    }

    // Function to re-initialize photo controls after form clone
    function initializeManualPhotoControls() {
        // Re-bind photo controls
        const manualUploadPhotoBtn = document.getElementById('manual-upload-photo-btn');
        const manualPhotoInput = document.getElementById('manual-photo-input');
        const manualRemovePhotoBtn = document.getElementById('manual-remove-photo-btn');
        const manualTakePhotoBtn = document.getElementById('manual-take-photo-btn');
        
        if (manualUploadPhotoBtn && manualPhotoInput) {
            manualUploadPhotoBtn.addEventListener('click', function() {
                manualPhotoInput.click();
            });
        }

        if (manualPhotoInput) {
            manualPhotoInput.addEventListener('change', function(e) {
                handleManualPhotoUpload(e);
            });
        }

        if (manualRemovePhotoBtn) {
            manualRemovePhotoBtn.addEventListener('click', function() {
                const manualPhotoPreview = document.getElementById('manual-photo-preview');
                const manualPhotoPlaceholder = document.getElementById('manual-photo-placeholder');
                
                manualPhotoPreview.src = '';
                manualPhotoPreview.style.display = 'none';
                manualPhotoPlaceholder.style.display = 'flex';
                manualRemovePhotoBtn.style.display = 'none';
                manualPhotoInput.value = '';
            });
        }

        if (manualTakePhotoBtn) {
            manualTakePhotoBtn.addEventListener('click', function() {
                currentEditId = 'manual_' + Date.now();
                openCamera();
            });
        }
    }

    // Remove temporary validation requirements
    function removeTemporaryValidation() {
        const requiredFields = elements.manualApplicantForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.dataset.wasRequired = 'true';
            field.removeAttribute('required');
        });
    }

    // Restore validation when going back to add mode
    function restoreValidation() {
        const fields = elements.manualApplicantForm.querySelectorAll('[data-was-required="true"]');
        fields.forEach(field => {
            field.setAttribute('required', 'true');
            delete field.dataset.wasRequired;
        });
    }

    // Function to update applicant from manual form
    function updateApplicantFromManualForm(originalApplicant) {
        // Basic validation
        if (!validateManualForm(true)) { // true for edit mode (less strict validation)
            return;
        }
        
        const formData = new FormData(elements.manualApplicantForm);
        const updatedApplicant = { ...originalApplicant };
        
        // Process all form data
        const lastName = document.getElementById('manual-surname').value.trim() || '';
        const firstName = document.getElementById('manual-first-name').value.trim() || '';
        const middleName = document.getElementById('manual-middle-name').value.trim() || '';
        
        // Update name fields
        if (lastName && firstName) {
            let fullName = `${lastName}, ${firstName}`;
            if (middleName) {
                fullName += ` ${middleName}`;
            }
            updatedApplicant['NAME'] = fullName;
        }
        
        updatedApplicant['LAST NAME'] = lastName || 'N/A';
        updatedApplicant['FIRST NAME'] = firstName || 'N/A';
        updatedApplicant['MIDDLE NAME'] = middleName || 'N/A';
        
        // Process other form fields - FIXED: Include all fields
        formData.forEach((value, key) => {
            const fieldName = key.replace('manual-', '').toUpperCase().replace(/-/g, ' ');
            
            // Skip name fields we already processed
            if (!fieldName.includes('SURNAME') && !fieldName.includes('FIRST NAME') && !fieldName.includes('MIDDLE NAME')) {
                updatedApplicant[fieldName] = value || 'N/A';
            }
        });
        
        // Process specific fields
        if (updatedApplicant['BDATE']) {
            try {
                const date = new Date(updatedApplicant['BDATE']);
                if (!isNaN(date.getTime())) {
                    updatedApplicant['BDATE'] = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
                }
            } catch (error) {
                console.warn('Date parsing error:', error);
                updatedApplicant['BDATE'] = 'N/A';
            }
        } else {
            updatedApplicant['BDATE'] = 'N/A';
        }
        
        // Address fields - FIXED: Get values directly from form
        updatedApplicant['STREET ADDRESS'] = document.getElementById('manual-house-street').value.trim() || 'N/A';
        updatedApplicant['BARANGAY'] = document.getElementById('manual-barangay').value.trim() || 'N/A';
        updatedApplicant['CITY/MUNICIPALITY'] = document.getElementById('manual-city-municipality').value.trim() || 'N/A';
        updatedApplicant['PROVINCE'] = document.getElementById('manual-province').value.trim() || 'N/A';
        
        // FIXED: Ensure email is properly captured
        updatedApplicant['EMAIL'] = document.getElementById('manual-email').value.trim() || 'N/A';
        
        // Handle photo update
        const tempPhoto = localStorage.getItem('tempManualPhoto');
        if (tempPhoto) {
            const photoId = updatedApplicant['SRS ID'];
            localStorage.setItem(`photo_${photoId}`, tempPhoto);
            localStorage.removeItem('tempManualPhoto');
            updatedApplicant['PHOTO'] = tempPhoto;
        }
        
        // Update timestamps
        updatedApplicant['DATE LAST MODIFIED'] = new Date().toLocaleString();
        updatedApplicant['LAST MODIFIED BY'] = localStorage.getItem('currentUser') || 'System';
        
        console.log('Updated applicant data:', updatedApplicant);
        
        // Save updated applicant
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        const updatedApplicants = savedApplicants.map(applicant => {
            if (applicant['SRS ID'] === updatedApplicant['SRS ID']) {
                return updatedApplicant;
            }
            return applicant;
        });
        
        saveMainApplicants(updatedApplicants);
        displayMainApplicants(updatedApplicants);
        
        // Close modal and show success message
        elements.manualModal.style.display = 'none';
        showNotification('Applicant updated successfully!', 'success', elements.manualNotification);
        
        // Reset form handler back to add mode
        resetManualFormToAddMode();
    }

    // Add form validation function
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
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
                
                // Highlight missing field
                field.style.borderColor = '#f44336';
                setTimeout(() => {
                    if (field) field.style.borderColor = '';
                }, 3000);
            }
        }
        
        if (!isValid && firstInvalidField) {
            showNotification('Please fill in all required fields.', 'error', elements.manualNotification);
            firstInvalidField.focus();
            return false;
        }
        
        return true;
    }

    // Reset manual form back to add mode
    function resetManualFormToAddMode() {
        // Restore validation requirements
        restoreValidation();
        
        // Remove the form and replace with a fresh clone to clear all event listeners
        const newForm = elements.manualApplicantForm.cloneNode(true);
        elements.manualApplicantForm.parentNode.replaceChild(newForm, elements.manualApplicantForm);
        elements.manualApplicantForm = newForm;
        
        // Re-initialize the form for add mode
        initializeManualFormControls();
        
        // Update the submit button
        const submitBtn = elements.manualApplicantForm.querySelector('.save-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Add Applicant';
            submitBtn.type = 'submit'; // Change back to submit
        }
    }

    function initializeManualFormControls() {
        try {
            console.log('Initializing manual form controls...');
            
            // Check if elements exist before using them
            if (!elements.manualApplicantForm) {
                console.warn('Manual applicant form not found');
                return;
            }

            // Initialize photo controls only if elements exist
            if (elements.manualUploadPhotoBtn && elements.manualPhotoInput) {
                elements.manualUploadPhotoBtn.addEventListener('click', function() {
                    elements.manualPhotoInput.click();
                });
            }

            if (elements.manualPhotoInput) {
                elements.manualPhotoInput.addEventListener('change', function(e) {
                    handleManualPhotoUpload(e);
                });
            }

            if (elements.manualRemovePhotoBtn) {
                elements.manualRemovePhotoBtn.addEventListener('click', function() {
                    const manualPhotoPreview = document.getElementById('manual-photo-preview');
                    const manualPhotoPlaceholder = document.getElementById('manual-photo-placeholder');
                    
                    if (manualPhotoPreview && manualPhotoPlaceholder) {
                        manualPhotoPreview.src = '';
                        manualPhotoPreview.style.display = 'none';
                        manualPhotoPlaceholder.style.display = 'flex';
                        elements.manualRemovePhotoBtn.style.display = 'none';
                        elements.manualPhotoInput.value = '';
                        localStorage.removeItem('tempManualPhoto');
                    }
                });
            }

            if (elements.manualTakePhotoBtn) {
                elements.manualTakePhotoBtn.addEventListener('click', function() {
                    currentEditId = 'manual_' + Date.now();
                    openCamera();
                });
            }
            
            // Initialize dynamic form elements
            initializeDynamicFormElements();
            
            // Initialize add entry buttons
            initializeAddEntryButtons();
            
            // Add submit handler for adding new applicants
            elements.manualApplicantForm.addEventListener('submit', function(event) {
                event.preventDefault();
                console.log('Manual form submitted');
                if (validateManualForm(false)) {
                    addManualApplicant();
                }
            });
            
            console.log('Manual form controls initialized successfully');
        } catch (error) {
            console.error('Error initializing manual form controls:', error);
        }
    }

    function setDefaultManualFormValues() {
        // Set default values for optional fields when in add mode
        const optionalFields = [
            'manual-street-address', 'manual-course', 'manual-disability',
            'manual-preferred-position', 'manual-skills', 'manual-work-experience',
            'manual-country', 'manual-latest-country', 'manual-remarks'
        ];
        
        // Don't set defaults in edit mode, only when opening fresh for add
        if (!elements.manualModal.classList.contains('manual-form-edit-mode')) {
            optionalFields.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value) {
                    field.value = 'N/A';
                }
            });
            
            const defaultDropdowns = {
                'manual-4ps': 'No',
                'manual-pwd': 'No',
                'manual-ofw': 'No',
                'manual-former-ofw': 'No'
            };
            
            Object.keys(defaultDropdowns).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && field.value === '') {
                    field.value = defaultDropdowns[fieldId];
                }
            });
        }
    }

    function generateComprehensivePDFReport() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        if (savedApplicants.length === 0) {
            showNotification('No data available to generate report', 'error');
            return;
        }

        const programStats = calculateProgramStatistics(savedApplicants);
        const employmentStats = calculateEmploymentStatistics(savedApplicants);
        const demographicStats = calculateDemographicStatistics(savedApplicants);
        
        const printWindow = window.open('', 'CPESO Comprehensive Program Report');
        const today = new Date().toLocaleDateString();
        
        // Capture all visual elements
        const enhancedStats = generateEnhancedStatistics(programStats, employmentStats, demographicStats);
        const programPictograph = generateProgramPictograph(programStats);
        const educationTable = generateEducationTable(programStats);
        const genderFigures = generateGenderFigures(demographicStats);
        const programPieChart = generateProgramPieChart(programStats);
        const employmentComparison = generateEmploymentComparison(employmentStats);
        const agePyramid = generateAgePyramid(programStats);
        const programProgress = generateProgramProgress(programStats);
        const courseBreakdown = generateExpandableCourseStats(programStats);
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Comprehensive Program Report - ${today}</title>
                <style>
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        margin: 25px; 
                        color: #333; 
                        line-height: 1.6;
                        background: #f5f7f5;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px; 
                        padding: 25px; 
                        background: linear-gradient(135deg, #f86c6c, #a51f41);
                        color: white;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .header h1 { 
                        margin: 0; 
                        font-size: 32px;
                        font-weight: 700;
                    }
                    .header .subtitle { 
                        margin: 5px 0 0 0;
                        font-size: 16px;
                        opacity: 0.9;
                    }
                    .report-section { 
                        background: white;
                        padding: 25px;
                        margin-bottom: 25px;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
                        page-break-inside: avoid;
                    }
                    .section-title { 
                        color: #ee5656;
                        margin-bottom: 20px;
                        font-size: 22px;
                        border-bottom: 2px solid #e3f2fd;
                        padding-bottom: 10px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .section-title i {
                        color: #1e88e5;
                    }
                    
                    /* Enhanced Statistics Styles for PDF */
                    .stats-grid-enhanced {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .stat-card-enhanced {
                        background: white;
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        border-left: 4px solid #3498db;
                    }
                    .stat-card-enhanced.total {
                        border-left-color: #2c3e50;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                    }
                    .stat-card-enhanced.male { border-left-color: #3498db; }
                    .stat-card-enhanced.female { border-left-color: #e91e63; }
                    .stat-card-enhanced.employed { border-left-color: #27ae60; }
                    .stat-card-enhanced.unemployed { border-left-color: #f39c12; }
                    .stat-card-enhanced.self-employed { border-left-color: #9b59b6; }
                    .stat-icon {
                        font-size: 32px;
                        width: 60px;
                        height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        background: rgba(52, 152, 219, 0.1);
                    }
                    .stat-card-enhanced.total .stat-icon {
                        background: rgba(255, 255, 255, 0.2);
                    }
                    .stat-content { flex: 1; }
                    .stat-number {
                        font-size: 28px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .stat-card-enhanced.total .stat-number { color: white; }
                    .stat-label {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                        font-weight: 500;
                    }
                    .stat-card-enhanced.total .stat-label { color: rgba(255, 255, 255, 0.9); }
                    .stat-percentage {
                        font-size: 12px;
                        color: #27ae60;
                        font-weight: bold;
                        background: rgba(39, 174, 96, 0.1);
                        padding: 2px 8px;
                        border-radius: 10px;
                        display: inline-block;
                    }
                    
                    /* Pictograph Styles for PDF */
                    .pictograph-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .pictograph-item {
                        display: flex;
                        align-items: center;
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 6px;
                        flex: 1;
                        min-width: 200px;
                    }
                    .pictograph-icon {
                        font-size: 24px;
                        margin-right: 10px;
                        width: 30px;
                        text-align: center;
                    }
                    .pictograph-content { flex: 1; }
                    .pictograph-bar {
                        height: 20px;
                        background: #e0e0e0;
                        border-radius: 10px;
                        overflow: hidden;
                        margin: 5px 0;
                    }
                    .pictograph-fill {
                        height: 100%;
                        border-radius: 10px;
                    }
                    .pictograph-info {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                    }
                    
                    /* Education Table Styles */
                    .education-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        background: white;
                        border-radius: 8px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .education-table th {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 12px 15px;
                        text-align: left;
                        font-weight: 600;
                    }
                    .education-table td {
                        padding: 12px 15px;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .education-table tr:hover {
                        background-color: #f5f5f5;
                    }
                    .education-table .percentage {
                        text-align: center;
                        font-weight: bold;
                        color: #4caf50;
                    }
                    
                    /* Gender Figures Styles */
                    .gender-figures {
                        display: flex;
                        justify-content: space-around;
                        align-items: flex-end;
                        margin: 20px 0;
                        padding: 20px;
                        background: white;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .gender-figure {
                        text-align: center;
                        flex: 1;
                        max-width: 200px;
                    }
                    .gender-icon {
                        font-size: 48px;
                        margin-bottom: 10px;
                        display: block;
                    }
                    .gender-male .gender-icon { color: #2196f3; }
                    .gender-female .gender-icon { color: #e91e63; }
                    .gender-count {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .gender-label {
                        font-size: 14px;
                        color: #666;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .gender-percentage {
                        font-size: 12px;
                        color: #4caf50;
                        font-weight: bold;
                        margin-top: 5px;
                    }
                    
                    /* Pie Chart Styles */
                    .pie-chart-container {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 20px 0;
                    }
                    .pie-chart {
                        width: 200px;
                        height: 200px;
                        border-radius: 50%;
                        background: conic-gradient(
                            #ff6b6b 0% 30%,
                            #4ecdc4 30% 60%,
                            #45b7d1 60% 80%,
                            #96ceb4 80% 95%,
                            #feca57 95% 100%
                        );
                        position: relative;
                    }
                    .pie-chart-center {
                        position: absolute;
                        width: 80px;
                        height: 80px;
                        background: white;
                        border-radius: 50%;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        color: #333;
                    }
                    .pie-legend {
                        margin-left: 30px;
                        flex: 1;
                    }
                    .pie-legend-item {
                        display: flex;
                        align-items: center;
                        margin-bottom: 8px;
                        padding: 5px 0;
                    }
                    .pie-color {
                        width: 15px;
                        height: 15px;
                        border-radius: 3px;
                        margin-right: 10px;
                    }
                    .pie-label { flex: 1; font-size: 14px; }
                    .pie-value { font-weight: bold; color: #333; }
                    
                    /* Employment Comparison Styles */
                    .comparison-cards {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .comparison-card {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        border-top: 4px solid #2196f3;
                    }
                    .comparison-card.employed { border-top-color: #4caf50; }
                    .comparison-card.unemployed { border-top-color: #ff9800; }
                    .comparison-card.self-employed { border-top-color: #9c27b0; }
                    .comparison-icon {
                        font-size: 36px;
                        margin-bottom: 10px;
                    }
                    .comparison-count {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .comparison-label {
                        color: #666;
                        font-size: 14px;
                    }
                    
                    /* Age Pyramid Styles */
                    .age-pyramid {
                        display: flex;
                        justify-content: center;
                        align-items: flex-end;
                        margin: 20px 0;
                        gap: 5px;
                        height: 200px;
                    }
                    .pyramid-bar {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 50px;
                        height: 200px;
                        position: relative;
                    }
                    .pyramid-male {
                        background: #2196f3;
                        border-radius: 3px 3px 0 0;
                        width: 100%;
                        min-height: 1px;
                    }
                    .pyramid-female {
                        background: #e91e63;
                        border-radius: 0 0 3px 3px;
                        width: 100%;
                        min-height: 1px;
                    }
                    .pyramid-label {
                        margin-top: 5px;
                        font-size: 11px;
                        font-weight: bold;
                        text-align: center;
                        line-height: 1.2;
                    }
                    
                    /* Progress Bars Styles */
                    .progress-bars { margin: 20px 0; }
                    .progress-item { margin-bottom: 15px; }
                    .progress-label {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                        font-size: 14px;
                    }
                    .progress-bar {
                        height: 20px;
                        background: #e0e0e0;
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .progress-fill {
                        height: 100%;
                        border-radius: 10px;
                        background: linear-gradient(90deg, #4caf50, #8bc34a);
                    }
                    
                    /* Expandable Section Styles */
                    .expandable-section {
                        margin: 15px 0;
                        border-radius: 4px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .expandable-header {
                        background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                        padding: 12px 15px;
                        cursor: pointer;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .expandable-content {
                        padding: 15px;
                        background: white;
                        border: 1px solid #e0e0e0;
                        border-top: none;
                        border-radius: 0 0 4px 4px;
                    }
                    .course-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                        align-items: center;
                    }
                    .course-item:last-child { border-bottom: none; }
                    .course-name { flex: 1; font-weight: 500; }
                    .course-count { font-weight: bold; color: #2196f3; margin-right: 10px; }
                    .course-percentage {
                        color: #4caf50;
                        font-size: 12px;
                        background: #e8f5e8;
                        padding: 2px 6px;
                        border-radius: 10px;
                    }
                    .course-summary {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        margin-top: 10px;
                        border-top: 2px solid #2196f3;
                        background: #f8f9fa;
                        border-radius: 4px;
                        font-weight: bold;
                    }
                    
                    .footer { 
                        text-align: center; 
                        margin-top: 40px; 
                        color: #7f8c8d; 
                        font-size: 12px; 
                        border-top: 1px solid #bdc3c7; 
                        padding-top: 10px;
                    }
                    
                    @media print {
                        body { 
                            margin: 0.25in;
                            background: white !important;
                        }
                        .report-section { 
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        .header { 
                            margin-bottom: 20px;
                            break-after: avoid;
                        }
                        .stats-grid-enhanced {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                        .comparison-cards {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>COMPREHENSIVE PROGRAM REPORT</h1>
                    <div class="subtitle">CPESO Applicant Management System</div>
                    <div class="subtitle">Generated on: ${new Date().toLocaleString()}</div>
                </div>
                
                <!-- Executive Summary -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-chart-line"></i> Executive Summary
                    </div>
                    ${enhancedStats}
                </div>
                
                <!-- Program Enrollment Overview -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-users"></i> Program Enrollment Overview
                    </div>
                    ${programPictograph}
                </div>
                
                <!-- Educational Attainment -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-graduation-cap"></i> Educational Attainment
                    </div>
                    ${educationTable}
                    ${courseBreakdown}
                </div>
                
                <!-- Gender Distribution -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-user-friends"></i> Gender Distribution
                    </div>
                    ${genderFigures}
                </div>
                
                <!-- Program Category Breakdown -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-chart-pie"></i> Program Category Breakdown
                    </div>
                    ${programPieChart}
                </div>
                
                <!-- Employment Status -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-briefcase"></i> Employment Status
                    </div>
                    ${employmentComparison}
                </div>
                
                <!-- Age Demographics -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-chart-bar"></i> Age Demographics
                    </div>
                    ${agePyramid}
                </div>
                
                <!-- Program Status Progress -->
                <div class="report-section">
                    <div class="section-title">
                        <i class="fas fa-tasks"></i> Program Status Progress
                    </div>
                    ${programProgress}
                </div>
                
                <div class="footer">
                    <p>This report was generated automatically by the CPESO Applicant Management System</p>
                    <p>For questions or concerns, please contact the system administrator</p>
                </div>
                
                <script>
                    // Load Font Awesome for icons
                    const faLink = document.createElement('link');
                    faLink.rel = 'stylesheet';
                    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                    document.head.appendChild(faLink);
                    
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() {
                                // window.close();
                            }, 1000);
                        }, 1000);
                    };
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Show notification
        showNotification('PDF report generated successfully! The print dialog will open shortly.', 'success');
    }

    // Helper functions for PDF generation
    function generateCourseBreakdownHTML(stats) {
        const collegeGrads = (stats.byEducation['College Graduate'] || 0) + 
                            (stats.byEducation['College'] || 0) + 
                            (stats.byEducation['Bachelor'] || 0) +
                            (stats.byEducation['Bachelor\'s Degree'] || 0);

        if (collegeGrads === 0) {
            return '<p style="text-align: center; color: #666; padding: 20px;">No college graduate data available.</p>';
        }

        const topCourses = Object.entries(stats.byCourse)
            .filter(([course, count]) => count > 0 && course !== 'No Course Specified')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        let html = `
            <table class="table-container-pdf" style="width: 100%;">
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Graduates</th>
                        <th>Percentage</th>
                        <th>Distribution</th>
                    </tr>
                </thead>
                <tbody>
        `;

        topCourses.forEach(([course, count]) => {
            const percentage = ((count / collegeGrads) * 100).toFixed(1);
            html += `
                <tr>
                    <td>${course}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                    <td style="width: 200px;">
                        <div class="progress-bar-pdf">
                            <div class="progress-fill-pdf" style="width: ${percentage}%"></div>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
            <div style="text-align: center; margin-top: 10px; color: #666; font-size: 12px;">
                Showing top ${topCourses.length} courses out of ${collegeGrads} college graduates
            </div>
        `;

        return html;
    }

    function generateProgramBreakdownHTML(stats) {
        const topPrograms = Object.entries(stats.byCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);

        let html = `
            <table class="table-container-pdf" style="width: 100%;">
                <thead>
                    <tr>
                        <th>Program Category</th>
                        <th>Applicants</th>
                        <th>Percentage</th>
                        <th>Distribution</th>
                    </tr>
                </thead>
                <tbody>
        `;

        topPrograms.forEach(([program, count]) => {
            const percentage = ((count / stats.total) * 100).toFixed(1);
            html += `
                <tr>
                    <td>${program}</td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                    <td style="width: 200px;">
                        <div class="progress-bar-pdf">
                            <div class="progress-fill-pdf" style="width: ${percentage}%"></div>
                        </div>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        return html;
    }

    function testGenderDetection() {
        const testCases = [
            'M', 'm', 'Male', 'male', 'MALE',
            'F', 'f', 'Female', 'female', 'FEMALE',
            'Other', 'Unknown', 'N/A', ''
        ];
        
        console.log('Gender Detection Test:');
        testCases.forEach(testCase => {
            const result = normalizeGender(testCase);
            console.log(`"${testCase}" → ${result}`);
        });
    }


    function categorizeCourse(course) {
        try {
            if (!course || course === 'No Course Specified' || course === 'N/A' || 
                course === '' || course === 'null' || course === 'undefined') {
                return 'No Course Specified';
            }
            
            // Ensure course is a string
            course = String(course).trim().toLowerCase();
            
            if (!course || course === 'no course specified' || course === 'n/a') {
                return 'No Course Specified';
            }
            
            console.log('🔍 Processing course:', course);
            
            // Information Technology & Computer-related
            if (course.includes('information technology') || course.includes(' it ') || 
                course.includes('it,') || course.includes('computer science') || 
                course.includes('comsci') || course.includes('comp sci') ||
                course.includes('computer engineering') || course.includes('comeng') || 
                course.includes('comp eng') || course.includes('information system') || 
                course.includes(' info sys') || course.includes('is,') ||
                course.includes('software') || course.includes('programming') || 
                course.includes('developer') || course.includes('computer') || 
                course.includes('tech')) {
                return 'Information Technology & Computer Science';
            }
            
            // Business & Management
            if (course.includes('business administration') || course.includes('bussiness') || 
                course.includes('bus adm') || course.includes('business management') || 
                course.includes('bus management') || course.includes('marketing') ||
                course.includes('management') || course.includes('entrepreneurship') || 
                course.includes('enterprise') || course.includes('hr') || 
                course.includes('human resource') || course.includes('human resources') ||
                course.includes('office administration') || course.includes('office management') || 
                course.includes('office')) {
                return 'Business Administration & Management';
            }
            
            // Education
            if (course.includes('education') || course.includes('educ') || 
                course.includes('teacher') || course.includes('elementary education') || 
                course.includes('secondary education') || course.includes('high school') ||
                course.includes('physical education') || course.includes(' p.e.') || 
                course.includes(' p.e ') || course.includes('special education') || 
                course.includes('sped') || course.includes('special ed') ||
                course.includes('early childhood') || course.includes('preschool')) {
                return 'Education';
            }
            
            // Engineering
            if (course.includes('engineering') || course.includes('engineer') || 
                course.includes('eng\'g') || course.includes('civil engineering') || 
                course.includes('civil eng') || course.includes('ce,') ||
                course.includes('electrical engineering') || course.includes('electrical eng') || 
                course.includes('ee,') || course.includes('mechanical engineering') || 
                course.includes('mechanical eng') || course.includes('me,') ||
                course.includes('electronics engineering') || course.includes('electronics eng') || 
                course.includes('ece') || course.includes('chemical engineering') || 
                course.includes('chemical eng') || course.includes('che') ||
                course.includes('industrial engineering') || course.includes('industrial eng') || 
                course.includes('ie,') || course.includes('sanitary engineering') || 
                course.includes('sanitary eng')) {
                return 'Engineering';
            }
            
            // Accounting & Finance
            if (course.includes('accounting') || course.includes('accountancy') || 
                course.includes('bsa') || course.includes('finance') || 
                course.includes('banking') || course.includes('financial') ||
                course.includes('financial management') || course.includes('management accounting') || 
                course.includes('fin mgt')) {
                return 'Accounting & Finance';
            }
            
            // Healthcare & Nursing
            if (course.includes('nursing') || course.includes('nurse') || 
                course.includes('bsn') || course.includes('midwifery') || 
                course.includes('midwife') || course.includes('mid') ||
                course.includes('medical technology') || course.includes('medtech') || 
                course.includes('med tech') || course.includes('pharmacy') || 
                course.includes('pharmacist') || course.includes('bs pharmacy') ||
                course.includes('physical therapy') || course.includes('physiotherapy') || 
                course.includes('pt,') || course.includes('radiological') || 
                course.includes('rad tech') || course.includes('x-ray') ||
                course.includes('respiratory therapy') || course.includes('respiratory')) {
                return 'Healthcare & Nursing';
            }
            
            // Hospitality & Tourism
            if (course.includes('hotel') || course.includes('restaurant') || 
                course.includes('hr') || course.includes('tourism') || 
                course.includes('tourist') || course.includes('travel') ||
                course.includes('hospitality') || course.includes('culinary') || 
                course.includes('cookery') || course.includes('chef') || 
                course.includes('food') || course.includes('beverage')) {
                return 'Hospitality & Tourism Management';
            }
            
            // Maritime
            if (course.includes('marine') || course.includes('maritime') || 
                course.includes('seaman') || course.includes('seafaring') || 
                course.includes('seafarer') || course.includes('bsmt')) {
                return 'Maritime Education';
            }
            
            // Arts & Sciences
            if (course.includes('psychology') || course.includes('psych') || 
                course.includes('bs psych') || course.includes('sociology') || 
                course.includes('socio') || course.includes('bs socio') ||
                course.includes('political science') || course.includes('pol sci') || 
                course.includes('political') || course.includes('biology') || 
                course.includes('biological') || course.includes('bs bio') ||
                course.includes('chemistry') || course.includes('chemical') || 
                course.includes('bs chem') || course.includes('mathematics') || 
                course.includes('math') || course.includes('bs math') ||
                course.includes('physics') || course.includes('physical') || 
                course.includes('bs physics') || course.includes('english') || 
                course.includes('literature') || course.includes('ab english') ||
                course.includes('filipino') || course.includes('philippine') || 
                course.includes('ab fil') || course.includes('history') || 
                course.includes('historical') || course.includes('ab history') ||
                course.includes('communication') || course.includes('mass comm') || 
                course.includes('ab comm')) {
                return 'Arts & Sciences';
            }
            
            // Criminology
            if (course.includes('criminology') || course.includes('criminal justice') || 
                course.includes('criminal') || course.includes('bs crim')) {
                return 'Criminology';
            }
            
            // Architecture & Design
            if (course.includes('architecture') || course.includes('architect') || 
                course.includes('bs arch') || course.includes('interior design') || 
                course.includes('interior') || course.includes('indesign') ||
                course.includes('fine arts') || course.includes('fine art') || 
                course.includes('bfa') || course.includes('graphic design') || 
                course.includes('graphic') || course.includes('graphics')) {
                return 'Architecture & Design';
            }
            
            // Agriculture
            if (course.includes('agriculture') || course.includes('agricultural') || 
                course.includes('bsa') || course.includes('fishery') || 
                course.includes('fisheries') || course.includes('bsf') ||
                course.includes('veterinary') || course.includes('vet') || 
                course.includes('dvm') || course.includes('agribusiness') || 
                course.includes('agri business') || course.includes('agri-business')) {
                return 'Agriculture';
            }
            
            // Technical Vocational
            if (course.includes('automotive') || course.includes('auto') || 
                course.includes('auto mech') || course.includes('welding') || 
                course.includes('welder') || course.includes('weld') ||
                course.includes('electrical technology') || course.includes('electrical tech') || 
                course.includes('elec tech') || course.includes('refrigeration') || 
                course.includes('refrigerator') || course.includes('hvac') ||
                course.includes('driving') || course.includes('driver') || 
                course.includes('chauffeur') || course.includes('heavy equipment') || 
                course.includes('heavy equip') || course.includes('heavy')) {
                return 'Technical Vocational';
            }
            
            // Return original course if no category matches (with proper capitalization)
            return course.charAt(0).toUpperCase() + course.slice(1);
            
        } catch (error) {
            console.error('Error in categorizeCourse:', error, 'for course:', course);
            return 'No Course Specified';
        }
    }

    function debugDataIssues() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        console.log('🔍 DEBUG: Checking for data issues');
        
        savedApplicants.forEach((applicant, index) => {
            try {
                // Test course categorization
                const course = applicant['COURSE'] || applicant['Course'] || 'No Course';
                categorizeCourse(course);
                
                // Test gender normalization
                normalizeGender(applicant.SEX);
                
            } catch (error) {
                console.error(`❌ Error in applicant ${index}:`, error);
                console.error('Problematic applicant data:', applicant);
            }
        });
        
        console.log('✅ Debug complete');
    }

    function initializeNavigation() {
        // Tab navigation
        const navTabs = document.querySelectorAll('.nav-tab');
        const pageContents = document.querySelectorAll('.page-content');
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetPage = this.getAttribute('data-page');
                
                // Remove active class from all tabs and contents
                navTabs.forEach(t => t.classList.remove('active'));
                pageContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to current tab and content
                this.classList.add('active');
                document.getElementById(`${targetPage}-content`).classList.add('active');
                
                // Load data for the active page
                loadPageData(targetPage);
            });
        });
    }

    function loadPageData(page) {
        console.log('Loading page:', page);
        
        switch(page) {
            case 'dashboard':
                loadDashboardStats();
                break;
            case 'applicants':
                loadMainApplicants();
                break;
            case 'employers':
                // Re-initialize employers when tab is clicked
                setTimeout(() => {
                    initializeEmployers();
                    loadEmployers();
                }, 100);
                break;
            case 'vacancies':
                // Re-initialize vacancies when tab is clicked
                setTimeout(() => {
                    initializeVacancies();
                    loadVacancies();
                }, 100);
                break;
            case 'programs':
                // Re-initialize programs when tab is clicked
                setTimeout(() => {
                    initializePrograms();
                    loadPrograms();
                }, 100);
                break;
            case 'reports':
                // Reports are generated on demand
                break;
            case 'tools':
            case 'admin':
                // Coming soon pages
                break;
        }
    }

    // Employers Management
    function initializeEmployers() {
        console.log('Initializing employers...');
        
        // Employer search functionality
        const employerSearchBtn = document.getElementById('employer-search-btn');
        const employerClearSearchBtn = document.getElementById('employer-clear-search-btn');
        const employerSearchInput = document.getElementById('employer-search-input');
        
        if (employerSearchBtn) {
            employerSearchBtn.addEventListener('click', searchEmployers);
            console.log('Employer search button initialized');
        } else {
            console.warn('Employer search button not found');
        }
        
        if (employerClearSearchBtn) {
            employerClearSearchBtn.addEventListener('click', clearEmployerSearch);
            console.log('Employer clear search button initialized');
        }
        
        if (employerSearchInput) {
            employerSearchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') searchEmployers();
            });
        }
        
        // Add employer button - FIXED
        const addEmployerBtn = document.getElementById('add-employer-btn');
        if (addEmployerBtn) {
            addEmployerBtn.addEventListener('click', function() {
                console.log('Add employer button clicked');
                openAddEmployerModal();
            });
            console.log('Add employer button initialized');
        } else {
            console.warn('Add employer button not found');
        }
        
        // Advanced filters button - FIXED
        const advancedFiltersBtn = document.getElementById('employer-advanced-filters-btn');
        const filtersPanel = document.getElementById('employer-advanced-filters-panel');
        
        if (advancedFiltersBtn && filtersPanel) {
            advancedFiltersBtn.addEventListener('click', function() {
                console.log('Advanced filters button clicked');
                filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
            });
            console.log('Employer advanced filters button initialized');
        } else {
            console.warn('Employer advanced filters elements not found');
        }
        
        // Apply and clear filters buttons
        const applyFiltersBtn = document.getElementById('apply-employer-filters-btn');
        const clearFiltersBtn = document.getElementById('clear-employer-filters-btn');
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyEmployerFilters);
        }
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearEmployerFilters);
        }
        
        // Export employers
        const exportEmployersBtn = document.getElementById('export-employers-btn');
        if (exportEmployersBtn) {
            exportEmployersBtn.addEventListener('click', exportEmployersToExcel);
        }
        
        // Clear all employers
        const clearAllEmployersBtn = document.getElementById('clear-all-employers-btn');
        if (clearAllEmployersBtn) {
            clearAllEmployersBtn.addEventListener('click', clearAllEmployers);
        }
        
        // File upload for employers - FIXED
        initializeEmployerFileUpload();
        
        console.log('Employers initialization complete');
    }

    function loadEmployers() {
        const employers = JSON.parse(localStorage.getItem('employers')) || [];
        displayEmployers(employers);
    }

    function displayEmployers(employers) {
        const table = document.getElementById('employers-table');
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (employers.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 21; // Adjust based on your table columns
            cell.className = 'no-results';
            cell.textContent = 'No employers found';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        employers.forEach((employer, index) => {
            const row = document.createElement('tr');
            
            // Create cells for each employer field
            const cells = [
                createTableCell(employer['EMPLOYER ID'] || `EMP-${index + 1}`),
                createTableCell(employer['COMPANY NAME'] || 'N/A'),
                createTableCell(employer['COMPANY TYPE'] || 'N/A'),
                createTableCell(employer['INDUSTRY'] || 'N/A'),
                createTableCell(employer['CONTACT PERSON'] || 'N/A'),
                createTableCell(employer['CONTACT POSITION'] || 'N/A'),
                createTableCell(employer['EMAIL'] || 'N/A'),
                createTableCell(employer['PHONE'] || 'N/A'),
                createTableCell(employer['ADDRESS'] || 'N/A'),
                createTableCell(employer['BARANGAY'] || 'N/A'),
                createTableCell(employer['CITY/MUNICIPALITY'] || 'N/A'),
                createTableCell(employer['PROVINCE'] || 'N/A'),
                createTableCell(employer['BUSINESS PERMIT NO.'] || 'N/A'),
                createTableCell(employer['BUSINESS PERMIT EXPIRY'] || 'N/A'),
                createTableCell(employer['NUMBER OF EMPLOYEES'] || 'N/A'),
                createTableCell(employer['YEAR ESTABLISHED'] || 'N/A'),
                createTableCell(employer['WEBSITE'] || 'N/A'),
                createTableCell(employer['STATUS'] || 'N/A'),
                createTableCell(employer['REGISTRATION DATE'] || 'N/A'),
                createTableCell(employer['LAST ACTIVE'] || 'N/A'),
                createEmployerActionsCell(employer, index)
            ];
            
            cells.forEach(cell => row.appendChild(cell));
            tbody.appendChild(row);
        });
    }

    function createEmployerActionsCell(employer, index) {
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        // View Button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-btn';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'View Employer Details';
        viewBtn.addEventListener('click', function() {
            openViewEmployerModal(employer);
        });
        
        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit Employer';
        editBtn.addEventListener('click', function() {
            openEditEmployerModal(employer);
        });
        
        // Download Button - ADDED
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.title = 'Download Employer Data';
        downloadBtn.addEventListener('click', function() {
            downloadEmployerData(employer);
        });
        
        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete Employer';
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this employer?')) {
                deleteEmployer(employer['EMPLOYER ID'] || employer.ID);
            }
        });
        
        // Add all buttons to the actions container
        actionButtons.appendChild(viewBtn);
        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(downloadBtn);
        actionButtons.appendChild(deleteBtn);
        
        actionsCell.appendChild(actionButtons);
        return actionsCell;
    }

    // Add View Employer Modal Function
    function openViewEmployerModal(employer) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Employer Details</h2>
                    <span class="close">&times;</span>
                </div>
                <div style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Company Information</h3>
                            <div class="view-field">
                                <label>Company Name:</label>
                                <span>${employer['COMPANY NAME'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Company Type:</label>
                                <span>${employer['COMPANY TYPE'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Industry:</label>
                                <span>${employer['INDUSTRY'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Business Permit:</label>
                                <span>${employer['BUSINESS PERMIT NO.'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Employees:</label>
                                <span>${employer['NUMBER OF EMPLOYEES'] || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Contact Information</h3>
                            <div class="view-field">
                                <label>Contact Person:</label>
                                <span>${employer['CONTACT PERSON'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Position:</label>
                                <span>${employer['CONTACT POSITION'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Email:</label>
                                <span>${employer['EMAIL'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Phone:</label>
                                <span>${employer['PHONE'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Status:</label>
                                <span class="status-badge status-${(employer['STATUS'] || 'Active').toLowerCase()}">${employer['STATUS'] || 'Active'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Address Information</h3>
                        <div class="view-field">
                            <label>Address:</label>
                            <span>${employer['ADDRESS'] || 'N/A'}</span>
                        </div>
                        <div class="view-field">
                            <label>Barangay:</label>
                            <span>${employer['BARANGAY'] || 'N/A'}</span>
                        </div>
                        <div class="view-field">
                            <label>City/Municipality:</label>
                            <span>${employer['CITY/MUNICIPALITY'] || 'N/A'}</span>
                        </div>
                        <div class="view-field">
                            <label>Province:</label>
                            <span>${employer['PROVINCE'] || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Additional Information</h3>
                        <div class="view-field">
                            <label>Year Established:</label>
                            <span>${employer['YEAR ESTABLISHED'] || 'N/A'}</span>
                        </div>
                        <div class="view-field">
                            <label>Website:</label>
                            <span>${employer['WEBSITE'] || 'N/A'}</span>
                        </div>
                        <div class="view-field">
                            <label>Registration Date:</label>
                            <span>${employer['REGISTRATION DATE'] || 'N/A'}</span>
                        </div>
                        <div class="view-field">
                            <label>Last Active:</label>
                            <span>${employer['LAST ACTIVE'] || 'N/A'}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" id="close-view-employer">Close</button>
                    <button class="download-btn" id="download-employer-data">
                        <i class="fas fa-download"></i> Download Data
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.close');
        const closeViewBtn = modal.querySelector('#close-view-employer');
        const downloadBtn = modal.querySelector('#download-employer-data');
        
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        closeViewBtn.addEventListener('click', () => document.body.removeChild(modal));
        downloadBtn.addEventListener('click', () => {
            downloadEmployerData(employer);
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // Add Download Employer Data Function
    function downloadEmployerData(employer) {
        try {
            const worksheet = XLSX.utils.json_to_sheet([employer]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Employer Data");
            
            const fileName = `employer_${employer['EMPLOYER ID'] || employer['COMPANY NAME'] || 'data'}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            showNotification('Employer data downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading employer data:', error);
            showNotification('Error downloading employer data', 'error');
        }
    }

    function searchEmployers() {
        const searchInput = document.getElementById('employer-search-input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        const employers = JSON.parse(localStorage.getItem('employers')) || [];
        
        if (!searchTerm) {
            displayEmployers(employers);
            return;
        }
        
        const filteredEmployers = employers.filter(employer => {
            const searchableFields = [
                employer['COMPANY NAME'],
                employer['CONTACT PERSON'],
                employer['INDUSTRY'],
                employer['EMAIL'],
                employer['BARANGAY']
            ].join(' ').toLowerCase();
            
            return searchableFields.includes(searchTerm);
        });
        
        displayEmployers(filteredEmployers);
        showNotification(`Found ${filteredEmployers.length} employer(s)`, 'success');
    }

    function clearEmployerSearch() {
        const searchInput = document.getElementById('employer-search-input');
        if (searchInput) {
            searchInput.value = '';
            loadEmployers();
        }
    }

    function exportEmployersToExcel() {
        const employers = JSON.parse(localStorage.getItem('employers')) || [];
        if (employers.length === 0) {
            showNotification('No employers to export', 'error');
            return;
        }
        
        try {
            const worksheet = XLSX.utils.json_to_sheet(employers);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Employers");
            
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `employers_${today}.xlsx`);
            
            showNotification('Employers exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting employers:', error);
            showNotification('Error exporting employers: ' + error.message, 'error');
        }
    }

    function deleteEmployer(id) {
        const employers = JSON.parse(localStorage.getItem('employers')) || [];
        const updatedEmployers = employers.filter(employer => 
            employer['EMPLOYER ID'] !== id && employer.ID !== id
        );
        
        localStorage.setItem('employers', JSON.stringify(updatedEmployers));
        displayEmployers(updatedEmployers);
        showNotification('Employer deleted successfully!', 'success');
    }

    function clearAllEmployers() {
        if (confirm('Are you sure you want to clear ALL employers? This action cannot be undone.')) {
            localStorage.removeItem('employers');
            displayEmployers([]);
            showNotification('All employers cleared successfully.', 'success');
        }
    }

    // Filter functions for employers
    function applyEmployerFilters() {
        showNotification('Employer filters applied', 'success');
    }

    function clearEmployerFilters() {
        showNotification('Employer filters cleared', 'info');
    }

    // Fixed employer file upload function
    function initializeEmployerFileUpload() {
        console.log('Initializing employer file upload...');
        
        const uploadBtn = document.getElementById('employer-add-btn');
        const fileInput = document.getElementById('employer-upload-file-input');
        const browseBtn = document.getElementById('employer-browse-btn');
        const fileName = document.getElementById('employer-upload-file-name');
        
        // Browse button functionality - FIXED
        if (browseBtn && fileInput) {
            browseBtn.addEventListener('click', function() {
                console.log('Browse button clicked');
                fileInput.click();
            });
            console.log('Employer browse button initialized');
        } else {
            console.warn('Employer browse button or file input not found');
        }
        
        // File input change handler - FIXED
        if (fileInput && fileName) {
            fileInput.addEventListener('change', function() {
                console.log('File input changed');
                if (this.files && this.files.length > 0) {
                    fileName.value = this.files[0].name;
                    if (uploadBtn) {
                        uploadBtn.disabled = false;
                        uploadBtn.style.opacity = '1';
                        uploadBtn.style.cursor = 'pointer';
                    }
                    console.log('File selected:', this.files[0].name);
                } else {
                    fileName.value = '';
                    if (uploadBtn) {
                        uploadBtn.disabled = true;
                        uploadBtn.style.opacity = '0.6';
                        uploadBtn.style.cursor = 'not-allowed';
                    }
                }
            });
        }
        
        // Upload button functionality - FIXED
        if (uploadBtn) {
            uploadBtn.addEventListener('click', function() {
                console.log('Upload button clicked');
                
                if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                    showNotification('Please select a file first.', 'error');
                    return;
                }
                
                const file = fileInput.files[0];
                
                // Check if it's an Excel file
                if (!file.name.match(/\.(xlsx|xls)$/)) {
                    showNotification('Please select an Excel file (.xlsx or .xls).', 'error');
                    return;
                }
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        console.log('File read successfully');
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        
                        console.log('Excel data parsed:', jsonData.length, 'rows');
                        
                        if (jsonData.length === 0) {
                            showNotification('The file does not contain any data.', 'error');
                            return;
                        }
                        
                        const processedData = processEmployerData(jsonData);
                        const employers = JSON.parse(localStorage.getItem('employers')) || [];
                        const updatedEmployers = [...employers, ...processedData];
                        
                        localStorage.setItem('employers', JSON.stringify(updatedEmployers));
                        displayEmployers(updatedEmployers);
                        
                        showNotification(`Successfully imported ${processedData.length} employers`, 'success');
                        
                        // Reset file input
                        if (fileInput) fileInput.value = '';
                        if (fileName) fileName.value = '';
                        if (uploadBtn) {
                            uploadBtn.disabled = true;
                            uploadBtn.style.opacity = '0.6';
                            uploadBtn.style.cursor = 'not-allowed';
                        }
                        
                    } catch (error) {
                        console.error('Error processing file:', error);
                        showNotification('Error processing file: ' + error.message, 'error');
                    }
                };
                
                reader.onerror = function() {
                    console.error('Error reading file');
                    showNotification('Error reading file. Please try again.', 'error');
                };
                
                reader.readAsArrayBuffer(file);
            });
            console.log('Employer upload button initialized');
        } else {
            console.warn('Employer upload button not found');
        }
    }

    function processEmployerData(jsonData) {
        return jsonData.map((record, index) => {
            return {
                'EMPLOYER ID': generateUniqueId('EMP'),
                'COMPANY NAME': record['COMPANY NAME'] || record['Company Name'] || 'N/A',
                'COMPANY TYPE': record['COMPANY TYPE'] || record['Company Type'] || 'N/A',
                'INDUSTRY': record['INDUSTRY'] || record['Industry'] || 'N/A',
                'CONTACT PERSON': record['CONTACT PERSON'] || record['Contact Person'] || 'N/A',
                'CONTACT POSITION': record['CONTACT POSITION'] || record['Contact Position'] || 'N/A',
                'EMAIL': record['EMAIL'] || record['Email'] || 'N/A',
                'PHONE': record['PHONE'] || record['Phone'] || 'N/A',
                'ADDRESS': record['ADDRESS'] || record['Address'] || 'N/A',
                'BARANGAY': record['BARANGAY'] || record['Barangay'] || 'N/A',
                'CITY/MUNICIPALITY': record['CITY/MUNICIPALITY'] || record['City/Municipality'] || 'N/A',
                'PROVINCE': record['PROVINCE'] || record['Province'] || 'N/A',
                'BUSINESS PERMIT NO.': record['BUSINESS PERMIT NO.'] || record['Business Permit No.'] || 'N/A',
                'BUSINESS PERMIT EXPIRY': record['BUSINESS PERMIT EXPIRY'] || record['Business Permit Expiry'] || 'N/A',
                'NUMBER OF EMPLOYEES': record['NUMBER OF EMPLOYEES'] || record['Number of Employees'] || 'N/A',
                'YEAR ESTABLISHED': record['YEAR ESTABLISHED'] || record['Year Established'] || 'N/A',
                'WEBSITE': record['WEBSITE'] || record['Website'] || 'N/A',
                'STATUS': record['STATUS'] || record['Status'] || 'Active',
                'REGISTRATION DATE': new Date().toLocaleDateString(),
                'LAST ACTIVE': new Date().toLocaleDateString()
            };
        });
    }

    // Add employer modal function
    function openAddEmployerModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Add New Employer</h2>
                    <span class="close">&times;</span>
                </div>
                <form id="addEmployerForm">
                    <div style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="employer-company-name">Company Name *</label>
                                <input type="text" id="employer-company-name" name="company-name" required>
                            </div>
                            <div class="form-group">
                                <label for="employer-company-type">Company Type</label>
                                <select id="employer-company-type" name="company-type">
                                    <option value="Private">Private</option>
                                    <option value="Government">Government</option>
                                    <option value="NGO">NGO</option>
                                    <option value="International">International</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="employer-industry">Industry</label>
                                <input type="text" id="employer-industry" name="industry">
                            </div>
                            <div class="form-group">
                                <label for="employer-contact-person">Contact Person *</label>
                                <input type="text" id="employer-contact-person" name="contact-person" required>
                            </div>
                            <div class="form-group">
                                <label for="employer-contact-position">Contact Position</label>
                                <input type="text" id="employer-contact-position" name="contact-position">
                            </div>
                            <div class="form-group">
                                <label for="employer-email">Email</label>
                                <input type="email" id="employer-email" name="email">
                            </div>
                            <div class="form-group">
                                <label for="employer-phone">Phone</label>
                                <input type="text" id="employer-phone" name="phone">
                            </div>
                            <div class="form-group">
                                <label for="employer-address">Address</label>
                                <input type="text" id="employer-address" name="address">
                            </div>
                            <div class="form-group">
                                <label for="employer-barangay">Barangay</label>
                                <input type="text" id="employer-barangay" name="barangay">
                            </div>
                            <div class="form-group">
                                <label for="employer-city">City/Municipality</label>
                                <input type="text" id="employer-city" name="city">
                            </div>
                            <div class="form-group">
                                <label for="employer-province">Province</label>
                                <input type="text" id="employer-province" name="province">
                            </div>
                            <div class="form-group">
                                <label for="employer-business-permit">Business Permit No.</label>
                                <input type="text" id="employer-business-permit" name="business-permit">
                            </div>
                            <div class="form-group">
                                <label for="employer-employees">Number of Employees</label>
                                <input type="number" id="employer-employees" name="employees" min="0">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="cancel-btn" id="cancel-employer">Cancel</button>
                        <button type="submit" class="save-btn">Add Employer</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event handlers
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('#cancel-employer');
        const form = modal.querySelector('#addEmployerForm');
        
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewEmployer();
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function addNewEmployer() {
        const form = document.querySelector('#addEmployerForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const employer = {
            'EMPLOYER ID': generateUniqueId('EMP'),
            'COMPANY NAME': formData.get('company-name'),
            'COMPANY TYPE': formData.get('company-type') || 'Private',
            'INDUSTRY': formData.get('industry') || 'N/A',
            'CONTACT PERSON': formData.get('contact-person'),
            'CONTACT POSITION': formData.get('contact-position') || 'N/A',
            'EMAIL': formData.get('email') || 'N/A',
            'PHONE': formData.get('phone') || 'N/A',
            'ADDRESS': formData.get('address') || 'N/A',
            'BARANGAY': formData.get('barangay') || 'N/A',
            'CITY/MUNICIPALITY': formData.get('city') || 'N/A',
            'PROVINCE': formData.get('province') || 'N/A',
            'BUSINESS PERMIT NO.': formData.get('business-permit') || 'N/A',
            'NUMBER OF EMPLOYEES': formData.get('employees') || 'N/A',
            'STATUS': 'Active',
            'REGISTRATION DATE': new Date().toLocaleDateString(),
            'LAST ACTIVE': new Date().toLocaleDateString()
        };
        
        const employers = JSON.parse(localStorage.getItem('employers')) || [];
        employers.push(employer);
        localStorage.setItem('employers', JSON.stringify(employers));
        
        displayEmployers(employers);
        showNotification('Employer added successfully!', 'success');
    }


    function initializeVacancies() {
        console.log('Initializing vacancies...');
        
        // Vacancy search functionality
        const vacancySearchBtn = document.getElementById('vacancy-search-btn');
        const vacancyClearSearchBtn = document.getElementById('vacancy-clear-search-btn');
        const vacancySearchInput = document.getElementById('vacancy-search-input');
        
        if (vacancySearchBtn) {
            vacancySearchBtn.addEventListener('click', searchVacancies);
        }
        if (vacancyClearSearchBtn) {
            vacancyClearSearchBtn.addEventListener('click', clearVacancySearch);
        }
        if (vacancySearchInput) {
            vacancySearchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') searchVacancies();
            });
        }
        
        // Add vacancy button - FIXED
        const addVacancyBtn = document.getElementById('add-vacancy-btn');
        if (addVacancyBtn) {
            addVacancyBtn.addEventListener('click', function() {
                console.log('Add vacancy button clicked');
                openAddVacancyModal();
            });
        }
        
        // Advanced filters button - FIXED
        const advancedFiltersBtn = document.getElementById('vacancy-advanced-filters-btn');
        const filtersPanel = document.getElementById('vacancy-advanced-filters-panel');
        
        if (advancedFiltersBtn && filtersPanel) {
            advancedFiltersBtn.addEventListener('click', function() {
                console.log('Vacancy advanced filters button clicked');
                filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        // Apply and clear filters buttons
        const applyFiltersBtn = document.getElementById('apply-vacancy-filters-btn');
        const clearFiltersBtn = document.getElementById('clear-vacancy-filters-btn');
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyVacancyFilters);
        }
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearVacancyFilters);
        }
        
        // Export vacancies
        const exportVacanciesBtn = document.getElementById('export-vacancies-btn');
        if (exportVacanciesBtn) {
            exportVacanciesBtn.addEventListener('click', exportVacanciesToExcel);
        }
        
        // Clear all vacancies
        const clearAllVacanciesBtn = document.getElementById('clear-all-vacancies-btn');
        if (clearAllVacanciesBtn) {
            clearAllVacanciesBtn.addEventListener('click', clearAllVacancies);
        }
        
        // File upload for vacancies - FIXED
        initializeVacancyFileUpload();
        
        console.log('Vacancies initialization complete');
    }

    function loadVacancies() {
        const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
        displayVacancies(vacancies);
    }

    function displayVacancies(vacancies) {
        const table = document.getElementById('vacancies-table');
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (vacancies.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 20; // Adjust based on your table columns
            cell.className = 'no-results';
            cell.textContent = 'No vacancies found';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        vacancies.forEach((vacancy, index) => {
            const row = document.createElement('tr');
            
            // Create cells for each vacancy field
            const cells = [
                createTableCell(vacancy['VACANCY ID'] || `VAC-${index + 1}`),
                createTableCell(vacancy['JOB TITLE'] || 'N/A'),
                createTableCell(vacancy['EMPLOYER'] || 'N/A'),
                createTableCell(vacancy['INDUSTRY'] || 'N/A'),
                createTableCell(vacancy['JOB TYPE'] || 'N/A'),
                createTableCell(vacancy['SALARY RANGE'] || 'N/A'),
                createTableCell(vacancy['WORK LOCATION'] || 'N/A'),
                createTableCell(vacancy['EDUCATION REQUIREMENT'] || 'N/A'),
                createTableCell(vacancy['EXPERIENCE REQUIREMENT'] || 'N/A'),
                createTableCell(vacancy['SKILLS REQUIRED'] || 'N/A'),
                createTableCell(vacancy['JOB DESCRIPTION'] || 'N/A', '', '', 'long-text-cell'),
                createTableCell(vacancy['RESPONSIBILITIES'] || 'N/A', '', '', 'long-text-cell'),
                createTableCell(vacancy['BENEFITS'] || 'N/A', '', '', 'long-text-cell'),
                createTableCell(vacancy['VACANCY COUNT'] || 'N/A'),
                createTableCell(vacancy['APPLICATION DEADLINE'] || 'N/A'),
                createTableCell(vacancy['DATE POSTED'] || 'N/A'),
                createStatusCell(vacancy['STATUS'] || 'Active'),
                createTableCell(vacancy['APPLICATION COUNT'] || '0'),
                createTableCell(vacancy['VIEWS'] || '0'),
                createVacancyActionsCell(vacancy, index)
            ];
            
            cells.forEach(cell => row.appendChild(cell));
            tbody.appendChild(row);
        });
    }

    function createStatusCell(status) {
        const cell = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = `status-badge status-${status.toLowerCase()}`;
        badge.textContent = status;
        cell.appendChild(badge);
        return cell;
    }

    function createVacancyActionsCell(vacancy, index) {
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        // View Button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-btn';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'View Vacancy Details';
        viewBtn.addEventListener('click', function() {
            openViewVacancyModal(vacancy);
        });
        
        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit Vacancy';
        editBtn.addEventListener('click', function() {
            openEditVacancyModal(vacancy);
        });
        
        // Download Button - ADDED
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.title = 'Download Vacancy Data';
        downloadBtn.addEventListener('click', function() {
            downloadVacancyData(vacancy);
        });
        
        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete Vacancy';
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this vacancy?')) {
                deleteVacancy(vacancy['VACANCY ID'] || vacancy.ID);
            }
        });
        
        actionButtons.appendChild(viewBtn);
        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(downloadBtn);
        actionButtons.appendChild(deleteBtn);
        actionsCell.appendChild(actionButtons);
        
        return actionsCell;
    }

    // Add Download Vacancy Data Function
    function downloadVacancyData(vacancy) {
        try {
            const worksheet = XLSX.utils.json_to_sheet([vacancy]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Vacancy Data");
            
            const fileName = `vacancy_${vacancy['VACANCY ID'] || vacancy['JOB TITLE'] || 'data'}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            showNotification('Vacancy data downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading vacancy data:', error);
            showNotification('Error downloading vacancy data', 'error');
        }
    }

    function searchVacancies() {
        const searchInput = document.getElementById('vacancy-search-input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
        
        if (!searchTerm) {
            displayVacancies(vacancies);
            return;
        }
        
        const filteredVacancies = vacancies.filter(vacancy => {
            const searchableFields = [
                vacancy['JOB TITLE'],
                vacancy['EMPLOYER'],
                vacancy['INDUSTRY'],
                vacancy['WORK LOCATION'],
                vacancy['SKILLS REQUIRED'],
                vacancy['JOB DESCRIPTION']
            ].join(' ').toLowerCase();
            
            return searchableFields.includes(searchTerm);
        });
        
        displayVacancies(filteredVacancies);
        showNotification(`Found ${filteredVacancies.length} vacancy(s)`, 'success');
    }

    function clearVacancySearch() {
        const searchInput = document.getElementById('vacancy-search-input');
        if (searchInput) {
            searchInput.value = '';
            loadVacancies();
        }
    }

    function openAddVacancyModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Add New Job Vacancy</h2>
                    <span class="close">&times;</span>
                </div>
                <form id="addVacancyForm">
                    <div style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="vacancy-job-title">Job Title *</label>
                                <input type="text" id="vacancy-job-title" name="job-title" required>
                            </div>
                            <div class="form-group">
                                <label for="vacancy-employer">Employer *</label>
                                <input type="text" id="vacancy-employer" name="employer" required>
                            </div>
                            <div class="form-group">
                                <label for="vacancy-industry">Industry</label>
                                <input type="text" id="vacancy-industry" name="industry">
                            </div>
                            <div class="form-group">
                                <label for="vacancy-job-type">Job Type</label>
                                <select id="vacancy-job-type" name="job-type">
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Temporary">Temporary</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="vacancy-salary">Salary Range</label>
                                <input type="text" id="vacancy-salary" name="salary" placeholder="e.g., ₱20,000 - ₱30,000">
                            </div>
                            <div class="form-group">
                                <label for="vacancy-location">Work Location</label>
                                <input type="text" id="vacancy-location" name="location">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="vacancy-description">Job Description</label>
                                <textarea id="vacancy-description" name="description" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="vacancy-requirements">Requirements</label>
                                <textarea id="vacancy-requirements" name="requirements" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="vacancy-count">Vacancy Count</label>
                                <input type="number" id="vacancy-count" name="count" min="1" value="1">
                            </div>
                            <div class="form-group">
                                <label for="vacancy-deadline">Application Deadline</label>
                                <input type="date" id="vacancy-deadline" name="deadline">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="cancel-btn" id="cancel-vacancy">Cancel</button>
                        <button type="submit" class="save-btn">Add Vacancy</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event handlers
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('#cancel-vacancy');
        const form = modal.querySelector('#addVacancyForm');
        
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewVacancy();
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function addNewVacancy() {
        const form = document.querySelector('#addVacancyForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const vacancy = {
            'VACANCY ID': generateUniqueId('VAC'),
            'JOB TITLE': formData.get('job-title'),
            'EMPLOYER': formData.get('employer'),
            'INDUSTRY': formData.get('industry') || 'N/A',
            'JOB TYPE': formData.get('job-type'),
            'SALARY RANGE': formData.get('salary') || 'N/A',
            'WORK LOCATION': formData.get('location') || 'N/A',
            'JOB DESCRIPTION': formData.get('description') || 'N/A',
            'SKILLS REQUIRED': formData.get('requirements') || 'N/A',
            'VACANCY COUNT': formData.get('count') || '1',
            'APPLICATION DEADLINE': formData.get('deadline') || 'N/A',
            'DATE POSTED': new Date().toLocaleDateString(),
            'STATUS': 'Active',
            'APPLICATION COUNT': '0',
            'VIEWS': '0'
        };
        
        const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
        vacancies.push(vacancy);
        localStorage.setItem('vacancies', JSON.stringify(vacancies));
        
        displayVacancies(vacancies);
        showNotification('Vacancy added successfully!', 'success');
    }

    function openEditVacancyModal(vacancy) {
        showNotification('Edit vacancy functionality coming soon', 'info');
    }

    function openViewVacancyModal(vacancy) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Vacancy Details</h2>
                    <span class="close">&times;</span>
                </div>
                <div style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Job Information</h3>
                            <div class="view-field">
                                <label>Job Title:</label>
                                <span>${vacancy['JOB TITLE'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Employer:</label>
                                <span>${vacancy['EMPLOYER'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Industry:</label>
                                <span>${vacancy['INDUSTRY'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Job Type:</label>
                                <span>${vacancy['JOB TYPE'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Salary Range:</label>
                                <span>${vacancy['SALARY RANGE'] || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Position Details</h3>
                            <div class="view-field">
                                <label>Work Location:</label>
                                <span>${vacancy['WORK LOCATION'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Vacancy Count:</label>
                                <span>${vacancy['VACANCY COUNT'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Applications:</label>
                                <span>${vacancy['APPLICATION COUNT'] || '0'}</span>
                            </div>
                            <div class="view-field">
                                <label>Date Posted:</label>
                                <span>${vacancy['DATE POSTED'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Deadline:</label>
                                <span>${vacancy['APPLICATION DEADLINE'] || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Job Description</h3>
                        <p>${vacancy['JOB DESCRIPTION'] || 'No description provided.'}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Requirements & Skills</h3>
                        <p>${vacancy['SKILLS REQUIRED'] || 'No specific requirements listed.'}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" id="close-view-vacancy">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.close');
        const closeViewBtn = modal.querySelector('#close-view-vacancy');
        
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        closeViewBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function exportVacanciesToExcel() {
        const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
        if (vacancies.length === 0) {
            showNotification('No vacancies to export', 'error');
            return;
        }
        
        try {
            const exportData = vacancies.map(vacancy => ({
                'Vacancy ID': vacancy['VACANCY ID'],
                'Job Title': vacancy['JOB TITLE'],
                'Employer': vacancy['EMPLOYER'],
                'Industry': vacancy['INDUSTRY'],
                'Job Type': vacancy['JOB TYPE'],
                'Salary Range': vacancy['SALARY RANGE'],
                'Work Location': vacancy['WORK LOCATION'],
                'Vacancy Count': vacancy['VACANCY COUNT'],
                'Application Deadline': vacancy['APPLICATION DEADLINE'],
                'Date Posted': vacancy['DATE POSTED'],
                'Status': vacancy['STATUS'],
                'Applications': vacancy['APPLICATION COUNT']
            }));
            
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Vacancies");
            
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `vacancies_${today}.xlsx`);
            
            showNotification('Vacancies exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting vacancies:', error);
            showNotification('Error exporting vacancies: ' + error.message, 'error');
        }
    }

    function deleteVacancy(id) {
        const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
        const updatedVacancies = vacancies.filter(vacancy => 
            vacancy['VACANCY ID'] !== id && vacancy.ID !== id
        );
        
        localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
        displayVacancies(updatedVacancies);
        showNotification('Vacancy deleted successfully!', 'success');
    }

    function clearAllVacancies() {
        if (confirm('Are you sure you want to clear ALL vacancies? This action cannot be undone.')) {
            localStorage.removeItem('vacancies');
            displayVacancies([]);
            showNotification('All vacancies cleared successfully.', 'success');
        }
    }

    // Fixed vacancy file upload function
function initializeVacancyFileUpload() {
    console.log('Initializing vacancy file upload...');
    
    const uploadBtn = document.getElementById('vacancy-add-btn');
    const fileInput = document.getElementById('vacancy-upload-file-input');
    const browseBtn = document.getElementById('vacancy-browse-btn');
    const fileName = document.getElementById('vacancy-upload-file-name');
    
    // Browse button functionality
    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', function() {
            console.log('Vacancy browse button clicked');
            fileInput.click();
        });
    }
    
    // File input change handler
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function() {
            console.log('Vacancy file input changed');
            if (this.files && this.files.length > 0) {
                fileName.value = this.files[0].name;
                if (uploadBtn) {
                    uploadBtn.disabled = false;
                    uploadBtn.style.opacity = '1';
                    uploadBtn.style.cursor = 'pointer';
                }
            } else {
                fileName.value = '';
                if (uploadBtn) {
                    uploadBtn.disabled = true;
                    uploadBtn.style.opacity = '0.6';
                    uploadBtn.style.cursor = 'not-allowed';
                }
            }
        });
    }
    
    // Upload button functionality
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                showNotification('Please select a file first.', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            
            if (!file.name.match(/\.(xlsx|xls)$/)) {
                showNotification('Please select an Excel file (.xlsx or .xls).', 'error');
                return;
            }
            
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
                    
                    const processedData = processVacancyData(jsonData);
                    const vacancies = JSON.parse(localStorage.getItem('vacancies')) || [];
                    const updatedVacancies = [...vacancies, ...processedData];
                    
                    localStorage.setItem('vacancies', JSON.stringify(updatedVacancies));
                    displayVacancies(updatedVacancies);
                    
                    showNotification(`Successfully imported ${processedData.length} vacancies`, 'success');
                    
                    // Reset file input
                    if (fileInput) fileInput.value = '';
                    if (fileName) fileName.value = '';
                    if (uploadBtn) {
                        uploadBtn.disabled = true;
                        uploadBtn.style.opacity = '0.6';
                        uploadBtn.style.cursor = 'not-allowed';
                    }
                    
                } catch (error) {
                    console.error('Error processing file:', error);
                    showNotification('Error processing file: ' + error.message, 'error');
                }
            };
            
            reader.onerror = function() {
                showNotification('Error reading file.', 'error');
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
}

// Fixed program file upload function
function initializeProgramFileUpload() {
    console.log('Initializing program file upload...');
    
    const uploadBtn = document.getElementById('program-add-btn');
    const fileInput = document.getElementById('program-upload-file-input');
    const browseBtn = document.getElementById('program-browse-btn');
    const fileName = document.getElementById('program-upload-file-name');
    
    // Browse button functionality
    if (browseBtn && fileInput) {
        browseBtn.addEventListener('click', function() {
            console.log('Program browse button clicked');
            fileInput.click();
        });
    }
    
    // File input change handler
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function() {
            console.log('Program file input changed');
            if (this.files && this.files.length > 0) {
                fileName.value = this.files[0].name;
                if (uploadBtn) {
                    uploadBtn.disabled = false;
                    uploadBtn.style.opacity = '1';
                    uploadBtn.style.cursor = 'pointer';
                }
            } else {
                fileName.value = '';
                if (uploadBtn) {
                    uploadBtn.disabled = true;
                    uploadBtn.style.opacity = '0.6';
                    uploadBtn.style.cursor = 'not-allowed';
                }
            }
        });
    }
    
    // Upload button functionality
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
                showNotification('Please select a file first.', 'error');
                return;
            }
            
            const file = fileInput.files[0];
            
            if (!file.name.match(/\.(xlsx|xls)$/)) {
                showNotification('Please select an Excel file (.xlsx or .xls).', 'error');
                return;
            }
            
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
                    
                    const processedData = processProgramData(jsonData);
                    const programs = JSON.parse(localStorage.getItem('programs')) || [];
                    const updatedPrograms = [...programs, ...processedData];
                    
                    localStorage.setItem('programs', JSON.stringify(updatedPrograms));
                    displayPrograms(updatedPrograms);
                    updateProgramStats();
                    
                    showNotification(`Successfully imported ${processedData.length} programs`, 'success');
                    
                    // Reset file input
                    if (fileInput) fileInput.value = '';
                    if (fileName) fileName.value = '';
                    if (uploadBtn) {
                        uploadBtn.disabled = true;
                        uploadBtn.style.opacity = '0.6';
                        uploadBtn.style.cursor = 'not-allowed';
                    }
                    
                } catch (error) {
                    console.error('Error processing file:', error);
                    showNotification('Error processing file: ' + error.message, 'error');
                }
            };
            
            reader.onerror = function() {
                showNotification('Error reading file.', 'error');
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
}

    function processVacancyData(jsonData) {
        return jsonData.map((record, index) => {
            return {
                'VACANCY ID': generateUniqueId('VAC'),
                'JOB TITLE': record['JOB TITLE'] || record['Job Title'] || 'N/A',
                'EMPLOYER': record['EMPLOYER'] || record['Employer'] || 'N/A',
                'INDUSTRY': record['INDUSTRY'] || record['Industry'] || 'N/A',
                'JOB TYPE': record['JOB TYPE'] || record['Job Type'] || 'Full-time',
                'SALARY RANGE': record['SALARY RANGE'] || record['Salary Range'] || 'N/A',
                'WORK LOCATION': record['WORK LOCATION'] || record['Work Location'] || 'N/A',
                'JOB DESCRIPTION': record['JOB DESCRIPTION'] || record['Job Description'] || 'N/A',
                'SKILLS REQUIRED': record['SKILLS REQUIRED'] || record['Skills Required'] || 'N/A',
                'VACANCY COUNT': record['VACANCY COUNT'] || record['Vacancy Count'] || '1',
                'APPLICATION DEADLINE': record['APPLICATION DEADLINE'] || record['Application Deadline'] || 'N/A',
                'DATE POSTED': new Date().toLocaleDateString(),
                'STATUS': 'Active',
                'APPLICATION COUNT': '0',
                'VIEWS': '0'
            };
        });
    }

    function initializeVacancyFilters() {
        const filtersBtn = document.getElementById('vacancy-advanced-filters-btn');
        const filtersPanel = document.getElementById('vacancy-advanced-filters-panel');
        
        if (filtersBtn && filtersPanel) {
            filtersBtn.addEventListener('click', function() {
                filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        const applyFiltersBtn = document.getElementById('apply-vacancy-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyVacancyFilters);
        }
        
        const clearFiltersBtn = document.getElementById('clear-vacancy-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearVacancyFilters);
        }
    }

    function applyVacancyFilters() {
        // Implementation for vacancy filters
        showNotification('Vacancy filters applied', 'success');
    }

    function clearVacancyFilters() {
        // Implementation for clearing vacancy filters
        showNotification('Vacancy filters cleared', 'info');
    }

    // Programs Management
    function initializePrograms() {
        console.log('Initializing programs...');
        
        // Program search functionality
        const programSearchBtn = document.getElementById('program-search-btn');
        const programClearSearchBtn = document.getElementById('program-clear-search-btn');
        const programSearchInput = document.getElementById('program-search-input');
        
        if (programSearchBtn) {
            programSearchBtn.addEventListener('click', searchPrograms);
        }
        if (programClearSearchBtn) {
            programClearSearchBtn.addEventListener('click', clearProgramSearch);
        }
        if (programSearchInput) {
            programSearchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') searchPrograms();
            });
        }
        
        // Add program button - FIXED
        const addProgramBtn = document.getElementById('add-program-btn');
        if (addProgramBtn) {
            addProgramBtn.addEventListener('click', function() {
                console.log('Add program button clicked');
                openAddProgramModal();
            });
        }
        
        // Advanced filters button - FIXED
        const advancedFiltersBtn = document.getElementById('program-advanced-filters-btn');
        const filtersPanel = document.getElementById('program-advanced-filters-panel');
        
        if (advancedFiltersBtn && filtersPanel) {
            advancedFiltersBtn.addEventListener('click', function() {
                console.log('Program advanced filters button clicked');
                filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        // Apply and clear filters buttons
        const applyFiltersBtn = document.getElementById('apply-program-filters-btn');
        const clearFiltersBtn = document.getElementById('clear-program-filters-btn');
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyProgramFilters);
        }
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearProgramFilters);
        }
        
        // Export programs
        const exportProgramsBtn = document.getElementById('export-programs-btn');
        if (exportProgramsBtn) {
            exportProgramsBtn.addEventListener('click', exportProgramsToExcel);
        }
        
        // Clear all programs
        const clearAllProgramsBtn = document.getElementById('clear-all-programs-btn');
        if (clearAllProgramsBtn) {
            clearAllProgramsBtn.addEventListener('click', clearAllPrograms);
        }
        
        // File upload for programs - FIXED
        initializeProgramFileUpload();
        
        console.log('Programs initialization complete');
    }

    function loadPrograms() {
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        displayPrograms(programs);
    }

    function displayPrograms(programs) {
        const table = document.getElementById('programs-table');
        if (!table) return;
        
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (programs.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 21; // Adjust based on your table columns
            cell.className = 'no-results';
            cell.textContent = 'No programs found';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        programs.forEach((program, index) => {
            const row = document.createElement('tr');
            
            // Create cells for each program field
            const cells = [
                createTableCell(program['PROGRAM ID'] || `PROG-${index + 1}`),
                createTableCell(program['PROGRAM NAME'] || 'N/A'),
                createTableCell(program['PROGRAM CATEGORY'] || 'N/A'),
                createTableCell(program['PROGRAM TYPE'] || 'N/A'),
                createTableCell(program['TARGET BENEFICIARIES'] || 'N/A'),
                createTableCell(program['PROGRAM DESCRIPTION'] || 'N/A', '', '', 'long-text-cell'),
                createTableCell(program['OBJECTIVES'] || 'N/A', '', '', 'long-text-cell'),
                createTableCell(program['ELIGIBILITY CRITERIA'] || 'N/A', '', '', 'long-text-cell'),
                createTableCell(program['BENEFITS PROVIDED'] || 'N/A', '', '', 'long-text-cell'),
                createTableCell(program['DURATION'] || 'N/A'),
                createTableCell(program['START DATE'] || 'N/A'),
                createTableCell(program['END DATE'] || 'N/A'),
                createTableCell(formatCurrency(program['BUDGET ALLOCATED'] || '0')),
                createTableCell(formatCurrency(program['BUDGET UTILIZED'] || '0')),
                createTableCell(program['PARTNER AGENCIES'] || 'N/A'),
                createTableCell(program['PROGRAM COORDINATOR'] || 'N/A'),
                createTableCell(program['CONTACT INFORMATION'] || 'N/A'),
                createStatusCell(program['STATUS'] || 'Active'),
                createTableCell(program['PARTICIPANT COUNT'] || '0'),
                createTableCell(formatPercentage(program['SUCCESS RATE'] || '0')),
                createProgramActionsCell(program, index)
            ];
            
            cells.forEach(cell => row.appendChild(cell));
            tbody.appendChild(row);
        });
    }

    function formatCurrency(amount) {
        if (!amount || amount === 'N/A') return 'N/A';
        const num = parseFloat(amount);
        return isNaN(num) ? amount : '₱' + num.toLocaleString('en-PH');
    }

    function formatPercentage(value) {
        if (!value || value === 'N/A') return 'N/A';
        const num = parseFloat(value);
        return isNaN(num) ? value : num.toFixed(1) + '%';
    }

    function createProgramActionsCell(program, index) {
        const actionsCell = document.createElement('td');
        actionsCell.className = 'actions-cell';
        
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';

        // View Button
        const viewBtn = document.createElement('button');
        viewBtn.className = 'view-btn';
        viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
        viewBtn.title = 'View Program Details';
        viewBtn.addEventListener('click', function() {
            openViewProgramModal(program);
        });
        
        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Edit Program';
        editBtn.addEventListener('click', function() {
            openEditProgramModal(program);
        });
        
        // Download Button - ADDED
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.title = 'Download Program Data';
        downloadBtn.addEventListener('click', function() {
            downloadProgramData(program);
        });
        
        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Delete Program';
        deleteBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this program?')) {
                deleteProgram(program['PROGRAM ID'] || program.ID);
            }
        });
        
        actionButtons.appendChild(viewBtn);
        actionButtons.appendChild(editBtn);
        actionButtons.appendChild(downloadBtn);
        actionButtons.appendChild(deleteBtn);
        actionsCell.appendChild(actionButtons);
        
        return actionsCell;
    }

    // Add Download Program Data Function
    function downloadProgramData(program) {
        try {
            const worksheet = XLSX.utils.json_to_sheet([program]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Program Data");
            
            const fileName = `program_${program['PROGRAM ID'] || program['PROGRAM NAME'] || 'data'}.xlsx`;
            XLSX.writeFile(workbook, fileName);
            
            showNotification('Program data downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading program data:', error);
            showNotification('Error downloading program data', 'error');
        }
    }

    function searchPrograms() {
        const searchInput = document.getElementById('program-search-input');
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase().trim();
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        
        if (!searchTerm) {
            displayPrograms(programs);
            return;
        }
        
        const filteredPrograms = programs.filter(program => {
            const searchableFields = [
                program['PROGRAM NAME'],
                program['PROGRAM CATEGORY'],
                program['PROGRAM TYPE'],
                program['TARGET BENEFICIARIES'],
                program['PROGRAM DESCRIPTION'],
                program['PROGRAM COORDINATOR']
            ].join(' ').toLowerCase();
            
            return searchableFields.includes(searchTerm);
        });
        
        displayPrograms(filteredPrograms);
        showNotification(`Found ${filteredPrograms.length} program(s)`, 'success');
    }

    function clearProgramSearch() {
        const searchInput = document.getElementById('program-search-input');
        if (searchInput) {
            searchInput.value = '';
            loadPrograms();
        }
    }

    function openAddProgramModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Add New Program</h2>
                    <span class="close">&times;</span>
                </div>
                <form id="addProgramForm">
                    <div style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="program-name">Program Name *</label>
                                <input type="text" id="program-name" name="program-name" required>
                            </div>
                            <div class="form-group">
                                <label for="program-category">Program Category *</label>
                                <select id="program-category" name="program-category" required>
                                    <option value="">Select Category</option>
                                    <option value="Livelihood">Livelihood Program</option>
                                    <option value="Employment">Employment Assistance</option>
                                    <option value="Education">Educational Assistance</option>
                                    <option value="Skills">Skills Training</option>
                                    <option value="OFW">OFW Reintegration</option>
                                    <option value="PWD">PWD Assistance</option>
                                    <option value="4Ps">4Ps Monitoring</option>
                                    <option value="Other">Other Programs</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="program-type">Program Type</label>
                                <select id="program-type" name="program-type">
                                    <option value="Government">Government</option>
                                    <option value="Private">Private</option>
                                    <option value="NGO">NGO</option>
                                    <option value="International">International</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="program-status">Status</label>
                                <select id="program-status" name="program-status">
                                    <option value="Active">Active</option>
                                    <option value="Upcoming">Upcoming</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="target-beneficiaries">Target Beneficiaries</label>
                                <input type="text" id="target-beneficiaries" name="target-beneficiaries">
                            </div>
                            <div class="form-group">
                                <label for="program-duration">Duration (Months)</label>
                                <input type="number" id="program-duration" name="program-duration" min="1">
                            </div>
                            <div class="form-group">
                                <label for="start-date">Start Date</label>
                                <input type="date" id="start-date" name="start-date">
                            </div>
                            <div class="form-group">
                                <label for="end-date">End Date</label>
                                <input type="date" id="end-date" name="end-date">
                            </div>
                            <div class="form-group">
                                <label for="budget-allocated">Budget Allocated (₱)</label>
                                <input type="number" id="budget-allocated" name="budget-allocated" min="0" step="0.01">
                            </div>
                            <div class="form-group">
                                <label for="program-coordinator">Program Coordinator</label>
                                <input type="text" id="program-coordinator" name="program-coordinator">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="program-description">Program Description</label>
                                <textarea id="program-description" name="program-description" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="program-objectives">Objectives</label>
                                <textarea id="program-objectives" name="program-objectives" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="eligibility-criteria">Eligibility Criteria</label>
                                <textarea id="eligibility-criteria" name="eligibility-criteria" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="benefits-provided">Benefits Provided</label>
                                <textarea id="benefits-provided" name="benefits-provided" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="partner-agencies">Partner Agencies</label>
                                <input type="text" id="partner-agencies" name="partner-agencies">
                            </div>
                            <div class="form-group">
                                <label for="contact-information">Contact Information</label>
                                <input type="text" id="contact-information" name="contact-information">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="cancel-btn" id="cancel-program">Cancel</button>
                        <button type="submit" class="save-btn">Add Program</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event handlers
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('#cancel-program');
        const form = modal.querySelector('#addProgramForm');
        
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProgram();
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function addNewProgram() {
        const form = document.querySelector('#addProgramForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const program = {
            'PROGRAM ID': generateUniqueId('PROG'),
            'PROGRAM NAME': formData.get('program-name'),
            'PROGRAM CATEGORY': formData.get('program-category'),
            'PROGRAM TYPE': formData.get('program-type') || 'Government',
            'TARGET BENEFICIARIES': formData.get('target-beneficiaries') || 'N/A',
            'PROGRAM DESCRIPTION': formData.get('program-description') || 'N/A',
            'OBJECTIVES': formData.get('program-objectives') || 'N/A',
            'ELIGIBILITY CRITERIA': formData.get('eligibility-criteria') || 'N/A',
            'BENEFITS PROVIDED': formData.get('benefits-provided') || 'N/A',
            'DURATION': formData.get('program-duration') ? formData.get('program-duration') + ' months' : 'N/A',
            'START DATE': formData.get('start-date') || 'N/A',
            'END DATE': formData.get('end-date') || 'N/A',
            'BUDGET ALLOCATED': formData.get('budget-allocated') || '0',
            'BUDGET UTILIZED': '0',
            'PARTNER AGENCIES': formData.get('partner-agencies') || 'N/A',
            'PROGRAM COORDINATOR': formData.get('program-coordinator') || 'N/A',
            'CONTACT INFORMATION': formData.get('contact-information') || 'N/A',
            'STATUS': formData.get('program-status') || 'Active',
            'PARTICIPANT COUNT': '0',
            'SUCCESS RATE': '0'
        };
        
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        programs.push(program);
        localStorage.setItem('programs', JSON.stringify(programs));
        
        displayPrograms(programs);
        updateProgramStats();
        showNotification('Program added successfully!', 'success');
    }

    function openEditProgramModal(program) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h2>Edit Program</h2>
                    <span class="close">&times;</span>
                </div>
                <form id="editProgramForm">
                    <div style="padding: 20px; max-height: 70vh; overflow-y: auto;">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="edit-program-name">Program Name *</label>
                                <input type="text" id="edit-program-name" name="program-name" value="${program['PROGRAM NAME'] || ''}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-program-category">Program Category *</label>
                                <select id="edit-program-category" name="program-category" required>
                                    <option value="">Select Category</option>
                                    <option value="Livelihood" ${program['PROGRAM CATEGORY'] === 'Livelihood' ? 'selected' : ''}>Livelihood Program</option>
                                    <option value="Employment" ${program['PROGRAM CATEGORY'] === 'Employment' ? 'selected' : ''}>Employment Assistance</option>
                                    <option value="Education" ${program['PROGRAM CATEGORY'] === 'Education' ? 'selected' : ''}>Educational Assistance</option>
                                    <option value="Skills" ${program['PROGRAM CATEGORY'] === 'Skills' ? 'selected' : ''}>Skills Training</option>
                                    <option value="OFW" ${program['PROGRAM CATEGORY'] === 'OFW' ? 'selected' : ''}>OFW Reintegration</option>
                                    <option value="PWD" ${program['PROGRAM CATEGORY'] === 'PWD' ? 'selected' : ''}>PWD Assistance</option>
                                    <option value="4Ps" ${program['PROGRAM CATEGORY'] === '4Ps' ? 'selected' : ''}>4Ps Monitoring</option>
                                    <option value="Other" ${program['PROGRAM CATEGORY'] === 'Other' ? 'selected' : ''}>Other Programs</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-program-type">Program Type</label>
                                <select id="edit-program-type" name="program-type">
                                    <option value="Government" ${program['PROGRAM TYPE'] === 'Government' ? 'selected' : ''}>Government</option>
                                    <option value="Private" ${program['PROGRAM TYPE'] === 'Private' ? 'selected' : ''}>Private</option>
                                    <option value="NGO" ${program['PROGRAM TYPE'] === 'NGO' ? 'selected' : ''}>NGO</option>
                                    <option value="International" ${program['PROGRAM TYPE'] === 'International' ? 'selected' : ''}>International</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-program-status">Status</label>
                                <select id="edit-program-status" name="program-status">
                                    <option value="Active" ${program['STATUS'] === 'Active' ? 'selected' : ''}>Active</option>
                                    <option value="Upcoming" ${program['STATUS'] === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
                                    <option value="Completed" ${program['STATUS'] === 'Completed' ? 'selected' : ''}>Completed</option>
                                    <option value="Cancelled" ${program['STATUS'] === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="edit-target-beneficiaries">Target Beneficiaries</label>
                                <input type="text" id="edit-target-beneficiaries" name="target-beneficiaries" value="${program['TARGET BENEFICIARIES'] || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-program-duration">Duration (Months)</label>
                                <input type="number" id="edit-program-duration" name="program-duration" min="1" value="${parseInt(program['DURATION']) || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-start-date">Start Date</label>
                                <input type="date" id="edit-start-date" name="start-date" value="${program['START DATE'] || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-end-date">End Date</label>
                                <input type="date" id="edit-end-date" name="end-date" value="${program['END DATE'] || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-budget-allocated">Budget Allocated (₱)</label>
                                <input type="number" id="edit-budget-allocated" name="budget-allocated" min="0" step="0.01" value="${program['BUDGET ALLOCATED'] || '0'}">
                            </div>
                            <div class="form-group">
                                <label for="edit-budget-utilized">Budget Utilized (₱)</label>
                                <input type="number" id="edit-budget-utilized" name="budget-utilized" min="0" step="0.01" value="${program['BUDGET UTILIZED'] || '0'}">
                            </div>
                            <div class="form-group">
                                <label for="edit-program-coordinator">Program Coordinator</label>
                                <input type="text" id="edit-program-coordinator" name="program-coordinator" value="${program['PROGRAM COORDINATOR'] || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-participant-count">Participant Count</label>
                                <input type="number" id="edit-participant-count" name="participant-count" min="0" value="${program['PARTICIPANT COUNT'] || '0'}">
                            </div>
                            <div class="form-group">
                                <label for="edit-success-rate">Success Rate (%)</label>
                                <input type="number" id="edit-success-rate" name="success-rate" min="0" max="100" step="0.1" value="${parseFloat(program['SUCCESS RATE']) || '0'}">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="edit-program-description">Program Description</label>
                                <textarea id="edit-program-description" name="program-description" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">${program['PROGRAM DESCRIPTION'] || ''}</textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="edit-program-objectives">Objectives</label>
                                <textarea id="edit-program-objectives" name="program-objectives" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">${program['OBJECTIVES'] || ''}</textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="edit-eligibility-criteria">Eligibility Criteria</label>
                                <textarea id="edit-eligibility-criteria" name="eligibility-criteria" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">${program['ELIGIBILITY CRITERIA'] || ''}</textarea>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="edit-benefits-provided">Benefits Provided</label>
                                <textarea id="edit-benefits-provided" name="benefits-provided" rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">${program['BENEFITS PROVIDED'] || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="edit-partner-agencies">Partner Agencies</label>
                                <input type="text" id="edit-partner-agencies" name="partner-agencies" value="${program['PARTNER AGENCIES'] || ''}">
                            </div>
                            <div class="form-group">
                                <label for="edit-contact-information">Contact Information</label>
                                <input type="text" id="edit-contact-information" name="contact-information" value="${program['CONTACT INFORMATION'] || ''}">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="cancel-btn" id="cancel-edit-program">Cancel</button>
                        <button type="submit" class="save-btn">Update Program</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event handlers
        const closeBtn = modal.querySelector('.close');
        const cancelBtn = modal.querySelector('#cancel-edit-program');
        const form = modal.querySelector('#editProgramForm');
        
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        cancelBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            updateProgram(program['PROGRAM ID'] || program.ID);
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function updateProgram(programId) {
        const form = document.querySelector('#editProgramForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const updatedProgram = {
            'PROGRAM ID': programId,
            'PROGRAM NAME': formData.get('program-name'),
            'PROGRAM CATEGORY': formData.get('program-category'),
            'PROGRAM TYPE': formData.get('program-type') || 'Government',
            'TARGET BENEFICIARIES': formData.get('target-beneficiaries') || 'N/A',
            'PROGRAM DESCRIPTION': formData.get('program-description') || 'N/A',
            'OBJECTIVES': formData.get('program-objectives') || 'N/A',
            'ELIGIBILITY CRITERIA': formData.get('eligibility-criteria') || 'N/A',
            'BENEFITS PROVIDED': formData.get('benefits-provided') || 'N/A',
            'DURATION': formData.get('program-duration') ? formData.get('program-duration') + ' months' : 'N/A',
            'START DATE': formData.get('start-date') || 'N/A',
            'END DATE': formData.get('end-date') || 'N/A',
            'BUDGET ALLOCATED': formData.get('budget-allocated') || '0',
            'BUDGET UTILIZED': formData.get('budget-utilized') || '0',
            'PARTNER AGENCIES': formData.get('partner-agencies') || 'N/A',
            'PROGRAM COORDINATOR': formData.get('program-coordinator') || 'N/A',
            'CONTACT INFORMATION': formData.get('contact-information') || 'N/A',
            'STATUS': formData.get('program-status') || 'Active',
            'PARTICIPANT COUNT': formData.get('participant-count') || '0',
            'SUCCESS RATE': formData.get('success-rate') || '0'
        };
        
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        const programIndex = programs.findIndex(p => 
            p['PROGRAM ID'] === programId || p.ID === programId
        );
        
        if (programIndex !== -1) {
            programs[programIndex] = updatedProgram;
            localStorage.setItem('programs', JSON.stringify(programs));
            displayPrograms(programs);
            updateProgramStats();
            showNotification('Program updated successfully!', 'success');
        } else {
            showNotification('Program not found!', 'error');
        }
    }

    function openViewProgramModal(program) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px;">
                <div class="modal-header">
                    <h2>Program Details</h2>
                    <span class="close">&times;</span>
                </div>
                <div style="padding: 20px; max-height: 80vh; overflow-y: auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Program Information</h3>
                            <div class="view-field">
                                <label>Program Name:</label>
                                <span>${program['PROGRAM NAME'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Category:</label>
                                <span>${program['PROGRAM CATEGORY'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Type:</label>
                                <span>${program['PROGRAM TYPE'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Status:</label>
                                <span class="status-badge status-${(program['STATUS'] || 'Active').toLowerCase()}">${program['STATUS'] || 'Active'}</span>
                            </div>
                            <div class="view-field">
                                <label>Target Beneficiaries:</label>
                                <span>${program['TARGET BENEFICIARIES'] || 'N/A'}</span>
                            </div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Program Timeline & Budget</h3>
                            <div class="view-field">
                                <label>Duration:</label>
                                <span>${program['DURATION'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Start Date:</label>
                                <span>${program['START DATE'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>End Date:</label>
                                <span>${program['END DATE'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Budget Allocated:</label>
                                <span>${formatCurrency(program['BUDGET ALLOCATED'] || '0')}</span>
                            </div>
                            <div class="view-field">
                                <label>Budget Utilized:</label>
                                <span>${formatCurrency(program['BUDGET UTILIZED'] || '0')}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Program Performance</h3>
                            <div class="view-field">
                                <label>Participant Count:</label>
                                <span>${program['PARTICIPANT COUNT'] || '0'}</span>
                            </div>
                            <div class="view-field">
                                <label>Success Rate:</label>
                                <span>${formatPercentage(program['SUCCESS RATE'] || '0')}</span>
                            </div>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h3 style="color: #1e88e5; margin-bottom: 15px;">Contact Information</h3>
                            <div class="view-field">
                                <label>Program Coordinator:</label>
                                <span>${program['PROGRAM COORDINATOR'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Contact Info:</label>
                                <span>${program['CONTACT INFORMATION'] || 'N/A'}</span>
                            </div>
                            <div class="view-field">
                                <label>Partner Agencies:</label>
                                <span>${program['PARTNER AGENCIES'] || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Program Description</h3>
                        <p>${program['PROGRAM DESCRIPTION'] || 'No description provided.'}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Objectives</h3>
                        <p>${program['OBJECTIVES'] || 'No objectives listed.'}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Eligibility Criteria</h3>
                        <p>${program['ELIGIBILITY CRITERIA'] || 'No eligibility criteria specified.'}</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                        <h3 style="color: #1e88e5; margin-bottom: 15px;">Benefits Provided</h3>
                        <p>${program['BENEFITS PROVIDED'] || 'No benefits information available.'}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn" id="close-view-program">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeBtn = modal.querySelector('.close');
        const closeViewBtn = modal.querySelector('#close-view-program');
        
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));
        closeViewBtn.addEventListener('click', () => document.body.removeChild(modal));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    function exportProgramsToExcel() {
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        if (programs.length === 0) {
            showNotification('No programs to export', 'error');
            return;
        }
        
        try {
            const exportData = programs.map(program => ({
                'Program ID': program['PROGRAM ID'],
                'Program Name': program['PROGRAM NAME'],
                'Category': program['PROGRAM CATEGORY'],
                'Type': program['PROGRAM TYPE'],
                'Status': program['STATUS'],
                'Target Beneficiaries': program['TARGET BENEFICIARIES'],
                'Duration': program['DURATION'],
                'Start Date': program['START DATE'],
                'End Date': program['END DATE'],
                'Budget Allocated': program['BUDGET ALLOCATED'],
                'Budget Utilized': program['BUDGET UTILIZED'],
                'Participant Count': program['PARTICIPANT COUNT'],
                'Success Rate': program['SUCCESS RATE'],
                'Program Coordinator': program['PROGRAM COORDINATOR']
            }));
            
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Programs");
            
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `programs_${today}.xlsx`);
            
            showNotification('Programs exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting programs:', error);
            showNotification('Error exporting programs: ' + error.message, 'error');
        }
    }

    function deleteProgram(id) {
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        const updatedPrograms = programs.filter(program => 
            program['PROGRAM ID'] !== id && program.ID !== id
        );
        
        localStorage.setItem('programs', JSON.stringify(updatedPrograms));
        displayPrograms(updatedPrograms);
        updateProgramStats();
        showNotification('Program deleted successfully!', 'success');
    }

    function clearAllPrograms() {
        if (confirm('Are you sure you want to clear ALL programs? This action cannot be undone.')) {
            localStorage.removeItem('programs');
            displayPrograms([]);
            updateProgramStats();
            showNotification('All programs cleared successfully.', 'success');
        }
    }

    function initializeProgramFileUpload() {
        const uploadBtn = document.getElementById('program-add-btn');
        const fileInput = document.getElementById('program-upload-file-input');
        
        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', function() {
                if (!fileInput.files.length) {
                    showNotification('Please select a file first.', 'error');
                    return;
                }
                
                const file = fileInput.files[0];
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
                        
                        const processedData = processProgramData(jsonData);
                        const programs = JSON.parse(localStorage.getItem('programs')) || [];
                        const updatedPrograms = [...programs, ...processedData];
                        
                        localStorage.setItem('programs', JSON.stringify(updatedPrograms));
                        displayPrograms(updatedPrograms);
                        updateProgramStats();
                        
                        showNotification(`Successfully imported ${processedData.length} programs`, 'success');
                        
                        // Reset file input
                        fileInput.value = '';
                        document.getElementById('program-upload-file-name').value = '';
                        uploadBtn.disabled = true;
                        
                    } catch (error) {
                        console.error('Error processing file:', error);
                        showNotification('Error processing file: ' + error.message, 'error');
                    }
                };
                
                reader.onerror = function() {
                    showNotification('Error reading file.', 'error');
                };
                
                reader.readAsArrayBuffer(file);
            });
        }
    }

    function processProgramData(jsonData) {
        return jsonData.map((record, index) => {
            return {
                'PROGRAM ID': generateUniqueId('PROG'),
                'PROGRAM NAME': record['PROGRAM NAME'] || record['Program Name'] || 'N/A',
                'PROGRAM CATEGORY': record['PROGRAM CATEGORY'] || record['Program Category'] || 'Other',
                'PROGRAM TYPE': record['PROGRAM TYPE'] || record['Program Type'] || 'Government',
                'TARGET BENEFICIARIES': record['TARGET BENEFICIARIES'] || record['Target Beneficiaries'] || 'N/A',
                'PROGRAM DESCRIPTION': record['PROGRAM DESCRIPTION'] || record['Program Description'] || 'N/A',
                'OBJECTIVES': record['OBJECTIVES'] || record['Objectives'] || 'N/A',
                'ELIGIBILITY CRITERIA': record['ELIGIBILITY CRITERIA'] || record['Eligibility Criteria'] || 'N/A',
                'BENEFITS PROVIDED': record['BENEFITS PROVIDED'] || record['Benefits Provided'] || 'N/A',
                'DURATION': record['DURATION'] || record['Duration'] || 'N/A',
                'START DATE': record['START DATE'] || record['Start Date'] || 'N/A',
                'END DATE': record['END DATE'] || record['End Date'] || 'N/A',
                'BUDGET ALLOCATED': record['BUDGET ALLOCATED'] || record['Budget Allocated'] || '0',
                'BUDGET UTILIZED': record['BUDGET UTILIZED'] || record['Budget Utilized'] || '0',
                'PARTNER AGENCIES': record['PARTNER AGENCIES'] || record['Partner Agencies'] || 'N/A',
                'PROGRAM COORDINATOR': record['PROGRAM COORDINATOR'] || record['Program Coordinator'] || 'N/A',
                'CONTACT INFORMATION': record['CONTACT INFORMATION'] || record['Contact Information'] || 'N/A',
                'STATUS': record['STATUS'] || record['Status'] || 'Active',
                'PARTICIPANT COUNT': record['PARTICIPANT COUNT'] || record['Participant Count'] || '0',
                'SUCCESS RATE': record['SUCCESS RATE'] || record['Success Rate'] || '0'
            };
        });
    }

    function initializeProgramFilters() {
        const filtersBtn = document.getElementById('program-advanced-filters-btn');
        const filtersPanel = document.getElementById('program-advanced-filters-panel');
        
        if (filtersBtn && filtersPanel) {
            filtersBtn.addEventListener('click', function() {
                filtersPanel.style.display = filtersPanel.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        const applyFiltersBtn = document.getElementById('apply-program-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', applyProgramFilters);
        }
        
        const clearFiltersBtn = document.getElementById('clear-program-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearProgramFilters);
        }
    }

    function applyProgramFilters() {
        const categoryFilter = document.getElementById('program-filter-category');
        const typeFilter = document.getElementById('program-filter-type');
        const statusFilter = document.getElementById('program-filter-status');
        const dateFromFilter = document.getElementById('program-filter-date-from');
        const dateToFilter = document.getElementById('program-filter-date-to');
        
        const filters = {
            category: categoryFilter ? categoryFilter.value : '',
            type: typeFilter ? typeFilter.value : '',
            status: statusFilter ? statusFilter.value : '',
            dateFrom: dateFromFilter ? dateFromFilter.value : '',
            dateTo: dateToFilter ? dateToFilter.value : ''
        };
        
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        const filteredPrograms = programs.filter(program => {
            let matches = true;
            
            if (filters.category && program['PROGRAM CATEGORY'] !== filters.category) {
                matches = false;
            }
            
            if (filters.type && program['PROGRAM TYPE'] !== filters.type) {
                matches = false;
            }
            
            if (filters.status && program['STATUS'] !== filters.status) {
                matches = false;
            }
            
            if (filters.dateFrom || filters.dateTo) {
                const programDate = new Date(program['START DATE']);
                if (filters.dateFrom && programDate < new Date(filters.dateFrom)) {
                    matches = false;
                }
                if (filters.dateTo && programDate > new Date(filters.dateTo)) {
                    matches = false;
                }
            }
            
            return matches;
        });
        
        displayPrograms(filteredPrograms);
        showNotification(`Found ${filteredPrograms.length} program(s) matching your filters`, 'success');
    }

    function clearProgramFilters() {
        const categoryFilter = document.getElementById('program-filter-category');
        const typeFilter = document.getElementById('program-filter-type');
        const statusFilter = document.getElementById('program-filter-status');
        const dateFromFilter = document.getElementById('program-filter-date-from');
        const dateToFilter = document.getElementById('program-filter-date-to');
        
        if (categoryFilter) categoryFilter.value = '';
        if (typeFilter) typeFilter.value = '';
        if (statusFilter) statusFilter.value = '';
        if (dateFromFilter) dateFromFilter.value = '';
        if (dateToFilter) dateToFilter.value = '';
        
        loadPrograms();
        showNotification('All filters cleared', 'info');
    }

    function updateProgramStats() {
        const programs = JSON.parse(localStorage.getItem('programs')) || [];
        
        const totalPrograms = programs.length;
        const activePrograms = programs.filter(p => p['STATUS'] === 'Active').length;
        const completedPrograms = programs.filter(p => p['STATUS'] === 'Completed').length;
        const totalBudget = programs.reduce((sum, p) => sum + parseFloat(p['BUDGET ALLOCATED'] || 0), 0);
        const totalParticipants = programs.reduce((sum, p) => sum + parseInt(p['PARTICIPANT COUNT'] || 0), 0);
        
        // Update stats cards
        updateStatCard('total-programs-count', totalPrograms);
        updateStatCard('active-programs-count', activePrograms);
        updateStatCard('completed-programs-count', completedPrograms);
        updateStatCard('total-budget-allocated', '₱' + totalBudget.toLocaleString('en-PH'));
        updateStatCard('total-participants-count', totalParticipants);
        
        // Update category distribution
        updateProgramCategoryDistribution(programs);
    }

    function updateProgramCategoryDistribution(programs) {
        const categoryChart = document.getElementById('program-category-chart');
        if (!categoryChart) return;
        
        const categoryCount = {};
        programs.forEach(program => {
            const category = program['PROGRAM CATEGORY'] || 'Unknown';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        
        console.log('Program Category Distribution:', categoryCount);
    }

    // Initialize programs when document is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializePrograms();
        loadPrograms();
        updateProgramStats();
    });

    initializeApp();
});