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

    // Add this missing function that was likely causing the error
    function initializeManualFormControls() {
        // Initialize photo controls
        initializeManualPhotoControls();
        
        // Initialize dynamic form elements
        initializeDynamicFormElements();
        
        // Initialize add entry buttons
        initializeAddEntryButtons();
        
        // Add submit handler for adding new applicants
        if (elements.manualApplicantForm) {
            elements.manualApplicantForm.addEventListener('submit', function(event) {
                event.preventDefault();
                if (validateManualForm(false)) {
                    addManualApplicant();
                }
            });
        }
    }
    // Add this function to initialize the view modal
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

    // Add this function to open the view modal
    function openViewModal(applicant) {
        if (!elements.viewModal) return;
        
        // Populate the view modal with applicant data
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
        
        // Handle photo
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
        
        // Set up edit button
        const editFullBtn = document.getElementById('edit-full-applicant-btn');
        if (editFullBtn) {
            editFullBtn.onclick = function() {
                openManualFormWithData(applicant);
            };
        }
        
        // Set up download buttons
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

    // Add this function to download as PDF
    function downloadApplicantAsPDF(applicant) {
        try {
            // Create a new window with the applicant data formatted for PDF
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
            
            // Check authentication
            if (localStorage.getItem('isLoggedIn') !== 'true') {
                window.location.href = 'login.html';
                return;
            }

            // Initialize all components
            initializeManualForm();
            initializeCamera();
            initializeSearch();
            initializeEditModal();
            initializeFileUploads();
            initializeAdvancedFilters();
            initializeReporting();
            initializeViewModal();
            
            // Load data
            loadMainApplicants();
            loadImportedData();
            
            // Initialize UI components
            initializeDynamicFormElements();
            initializeAddEntryButtons();
            displayCurrentUser();

            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Error during application initialization:', error);
            showNotification('Error initializing application: ' + error.message, 'error');
        }
    }

    function initializeDynamicFormElements() {
        // Disability "Others" specification
        const disabilityOthers = document.getElementById('manual-disability-others');
        const disabilitySpecify = document.getElementById('manual-disability-specify');
        
        if (disabilityOthers && disabilitySpecify) {
            disabilityOthers.addEventListener('change', function() {
                disabilitySpecify.style.display = this.checked ? 'block' : 'none';
            });
        }
        
        // Employment status specification
        const empStatus = document.getElementById('manual-emp-status');
        const empStatusSpecify = document.getElementById('manual-emp-status-specify');
        const empStatusCountry = document.getElementById('manual-emp-status-country');
        
        if (empStatus) {
            empStatus.addEventListener('change', function() {
                empStatusSpecify.style.display = this.value === 'Other' ? 'block' : 'none';
                empStatusCountry.style.display = this.value === 'Unemployed - Terminated/Laidoff (abroad)' ? 'block' : 'none';
            });
        }
        
        // Looking for work duration
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
                    localStorage.setItem('tempManualPhoto', photoData);
                    
                    elements.manualPhotoPreview.src = photoData;
                    elements.manualPhotoPreview.style.display = 'block';
                    elements.manualPhotoPlaceholder.style.display = 'none';
                    elements.manualRemovePhotoBtn.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                showNotification('Please select a valid image file.', 'error', elements.manualNotification);
            }
        }
    }

    function checkApplicantDuplicate(applicantData) {
        try {
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            const matches = [];
            
            for (const existingApp of savedApplicants) {
                // Add null checks for all property accesses
                const applicantName = applicantData.NAME ? applicantData.NAME.toLowerCase() : '';
                const existingName = existingApp.NAME ? existingApp.NAME.toLowerCase() : '';
                
                const applicantBdate = applicantData.BDATE || '';
                const existingBdate = existingApp.BDATE || '';
                
                const nameMatch = applicantName && existingName && 
                                applicantName === existingName;
                
                const bdateMatch = applicantBdate && existingBdate && 
                                applicantBdate === existingBdate;
                
                // Check for same name but different birthday
                const sameNameDifferentBday = nameMatch && !bdateMatch;
                
                if (nameMatch || bdateMatch || sameNameDifferentBday) {
                    const matchDetails = {
                        existingApplicant: existingApp,
                        matchingFields: [],
                        differences: [],
                        sameNameDifferentBday: sameNameDifferentBday
                    };
                    
                    if (nameMatch) matchDetails.matchingFields.push('Name');
                    if (bdateMatch) matchDetails.matchingFields.push('Birthday');
                    if (sameNameDifferentBday) matchDetails.matchingFields.push('Same Name, Different Birthday');
                    
                    // Compare other fields to show differences (with null checks)
                    const fieldsToCompare = [
                        'CELLPHONE', 'EMAIL', 'BARANGAY', 'CITY/MUNICIPALITY', 'PROGRAM CATEGORY'
                    ];
                    
                    fieldsToCompare.forEach(field => {
                        const newValue = applicantData[field] || '';
                        const existingValue = existingApp[field] || '';
                        
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
                            newValue: applicantData.BDATE || 'Not provided',
                            existingValue: existingApp.BDATE || 'Not provided'
                        });
                    }
                    
                    matches.push(matchDetails);
                }
            }
            
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
        const formData = new FormData(elements.manualApplicantForm);
        const applicantData = {};
        
        // Get individual name parts - FIXED: Using correct field IDs
        const lastName = document.getElementById('manual-surname')?.value.trim() || '';
        const firstName = document.getElementById('manual-first-name')?.value.trim() || '';
        const middleName = document.getElementById('manual-middle-name')?.value.trim() || '';
        
        // Combine into full name format: "Last Name, First Name Middle Name"
        if (lastName && firstName) {
            let fullName = `${lastName}, ${firstName}`;
            if (middleName) {
                fullName += ` ${middleName}`;
            }
            applicantData['NAME'] = fullName;
        } else {
            // Fallback to the full name field if provided
            applicantData['NAME'] = document.getElementById('manual-name')?.value.trim() || 'N/A';
        }
        
        // Store individual name parts for reference
        applicantData['LAST NAME'] = lastName || 'N/A';
        applicantData['FIRST NAME'] = firstName || 'N/A';
        applicantData['MIDDLE NAME'] = middleName || 'N/A';
        
        // Process other form data with null checks
        formData.forEach((value, key) => {
            if (!key.startsWith('manual-surname') && !key.startsWith('manual-first-name') && 
                !key.startsWith('manual-middle-name') && !key.startsWith('manual-name')) {
                const fieldName = key.replace('manual-', '').toUpperCase().replace(/-/g, ' ');
                applicantData[fieldName] = value || 'N/A';
            }
        });
        
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
        
        applicantData['REG. DATE'] = new Date().toLocaleDateString();
        applicantData['DATE CREATED'] = new Date().toLocaleString();
        applicantData['DATE LAST MODIFIED'] = new Date().toLocaleString();
        applicantData['STREET ADDRESS'] = document.getElementById('manual-house-street')?.value.trim() || 'N/A';
        applicantData['BARANGAY'] = document.getElementById('manual-barangay')?.value.trim() || 'N/A';
        applicantData['CITY/MUNICIPALITY'] = document.getElementById('manual-city-municipality')?.value.trim() || 'N/A';
        applicantData['PROVINCE'] = document.getElementById('manual-province')?.value.trim() || 'N/A';

        formData.forEach((value, key) => {
            if (!key.startsWith('manual-surname') && !key.startsWith('manual-first-name') && 
                !key.startsWith('manual-middle-name') && !key.startsWith('manual-name') &&
                !key.startsWith('manual-house-street') && !key.startsWith('manual-barangay') &&
                !key.startsWith('manual-city-municipality') && !key.startsWith('manual-province')) {
                const fieldName = key.replace('manual-', '').toUpperCase().replace(/-/g, ' ');
                applicantData[fieldName] = value || 'N/A';
            }
        });
        
        // Ensure all required fields have values
        const requiredFields = ['NAME', 'BDATE', 'SEX', 'CIVIL STATUS', 'BARANGAY', 'CITY/MUNICIPALITY'];
        requiredFields.forEach(field => {
            if (!applicantData[field] || applicantData[field] === '') {
                applicantData[field] = 'N/A';
            }
        });
        
        try {
            const duplicateCheck = checkApplicantDuplicate(applicantData);
            
            if (duplicateCheck.hasMatches) {
                highlightMatchingApplicants(duplicateCheck.matches);
                
                showDuplicateConfirmation(applicantData, duplicateCheck.matches)
                    .then(shouldProceed => {
                        if (!shouldProceed) {
                            removeHighlights();
                            return;
                        }
                        
                        proceedWithAddingApplicant(applicantData);
                    });
            } else {
                proceedWithAddingApplicant(applicantData);
            }
        } catch (error) {
            console.error('Error in duplicate check:', error);
            // Proceed with adding anyway if duplicate check fails
            proceedWithAddingApplicant(applicantData);
        }
    }

    function proceedWithAddingApplicant(applicantData) {
        try {
            const tempPhoto = localStorage.getItem('tempManualPhoto');
            if (tempPhoto) {
                const photoId = applicantData['SRS ID'];
                localStorage.setItem(`photo_${photoId}`, tempPhoto);
                localStorage.removeItem('tempManualPhoto');
                applicantData['PHOTO'] = tempPhoto;
            }
            
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            savedApplicants.push(applicantData);
            saveMainApplicants(savedApplicants);
            
            displayMainApplicants(savedApplicants);
            removeHighlights();
            
            closeManualModal();
            showNotification('Applicant added successfully!', 'success', elements.manualNotification);
            
            localStorage.removeItem('tempManualPhoto');
        } catch (error) {
            console.error('Error adding applicant:', error);
            showNotification('Error adding applicant: ' + error.message, 'error', elements.manualNotification);
        }
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
        elements.cameraModal.style.display = 'block';
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
        
        applicants.forEach(applicant => {
            const category = applicant['PROGRAM CATEGORY'] || 'Uncategorized';
            const status = applicant['PROGRAM STATUS'] || 'Not Specified';
            const specificProgram = applicant['SPECIFIC PROGRAM'] || 'No Specific Program';
            const education = applicant['EDUC LEVEL'] || 'Not Specified';
            let course = applicant['COURSE'] || 'No Course Specified';
            const age = parseInt(applicant.AGE) || 0;
            const gender = (applicant.SEX || '').toLowerCase();

            if (age < 20) stats.byAgeGroup['Below 20']++;
            else if (age >= 20 && age <= 29) stats.byAgeGroup['20-29']++;
            else if (age >= 30 && age <= 39) stats.byAgeGroup['30-39']++;
            else if (age >= 40 && age <= 49) stats.byAgeGroup['40-49']++;
            else if (age >= 50 && age <= 59) stats.byAgeGroup['50-59']++;
            else if (age >= 60) stats.byAgeGroup['60 and above']++;
            
            let ageGroup;
            if (age < 20) ageGroup = 'Below 20';
            else if (age >= 20 && age <= 29) ageGroup = '20-29';
            else if (age >= 30 && age <= 39) ageGroup = '30-39';
            else if (age >= 40 && age <= 49) ageGroup = '40-49';
            else if (age >= 50 && age <= 59) ageGroup = '50-59';
            else if (age >= 60) ageGroup = '60 and above';
            else ageGroup = null;
            
            if (ageGroup) {
                if (gender.includes('male') && !gender.includes('female')) {
                    stats.agePyramid[ageGroup].male++;
                } else if (gender.includes('female')) {
                    stats.agePyramid[ageGroup].female++;
                }
            }
            
            function categorizeCourse(course) {
            if (!course || course === 'No Course Specified' || course === 'N/A' || course === '') {
                return 'No Course Specified';
            }
            
            course = course.trim().toLowerCase();
            
            // Information Technology & Computer-related
            if (course.includes('information technology') || course.includes('it') || 
                course.includes('computer science') || course.includes('comsci') ||
                course.includes('computer engineering') || course.includes('comeng') ||
                course.includes('information system') || course.includes('is') ||
                course.includes('software engineering') || course.includes('computer programming')) {
                return 'Information Technology & Computer Science';
            }
            
            // Business & Management
            if (course.includes('business administration') || course.includes('bussiness') ||
                course.includes('business management') || course.includes('marketing') ||
                course.includes('management') || course.includes('entrepreneurship') ||
                course.includes('hr') || course.includes('human resource') ||
                course.includes('office administration') || course.includes('office management')) {
                return 'Business Administration & Management';
            }
            
            // Education
            if (course.includes('education') || course.includes('educ') ||
                course.includes('elementary education') || course.includes('secondary education') ||
                course.includes('physical education') || course.includes('pe') ||
                course.includes('special education') || course.includes('sped') ||
                course.includes('early childhood education')) {
                return 'Education';
            }
            
            // Engineering
            if (course.includes('engineering') || course.includes('civil engineering') ||
                course.includes('electrical engineering') || course.includes('mechanical engineering') ||
                course.includes('electronics engineering') || course.includes('chemical engineering') ||
                course.includes('industrial engineering') || course.includes('sanitary engineering')) {
                return 'Engineering';
            }
            
            // Accounting & Finance
            if (course.includes('accounting') || course.includes('accountancy') ||
                course.includes('finance') || course.includes('banking') ||
                course.includes('financial management') || course.includes('management accounting')) {
                return 'Accounting & Finance';
            }
            
            // Healthcare & Nursing
            if (course.includes('nursing') || course.includes('midwifery') ||
                course.includes('medical technology') || course.includes('medtech') ||
                course.includes('pharmacy') || course.includes('physical therapy') ||
                course.includes('radiological technology') || course.includes('respiratory therapy')) {
                return 'Healthcare & Nursing';
            }
            
            // Hospitality & Tourism
            if (course.includes('hotel') || course.includes('restaurant') ||
                course.includes('tourism') || course.includes('hospitality') ||
                course.includes('culinary') || course.includes('cookery')) {
                return 'Hospitality & Tourism Management';
            }
            
            // Maritime
            if (course.includes('marine') || course.includes('maritime') ||
                course.includes('seaman') || course.includes('seafaring')) {
                return 'Maritime Education';
            }
            
            // Arts & Sciences
            if (course.includes('psychology') || course.includes('sociology') ||
                course.includes('political science') || course.includes('pol sci') ||
                course.includes('biology') || course.includes('chemistry') ||
                course.includes('mathematics') || course.includes('physics') ||
                course.includes('english') || course.includes('filipino') ||
                course.includes('history') || course.includes('communication')) {
                return 'Arts & Sciences';
            }
            
            // Criminology
            if (course.includes('criminology') || course.includes('criminal justice')) {
                return 'Criminology';
            }
            
            // Architecture & Design
            if (course.includes('architecture') || course.includes('interior design') ||
                course.includes('fine arts') || course.includes('graphic design')) {
                return 'Architecture & Design';
            }
            
            // Agriculture
            if (course.includes('agriculture') || course.includes('fishery') ||
                course.includes('veterinary') || course.includes('agribusiness')) {
                return 'Agriculture';
            }
            
            // Technical Vocational
            if (course.includes('automotive') || course.includes('welding') ||
                course.includes('electrical technology') || course.includes('refrigeration') ||
                course.includes('driving') || course.includes('heavy equipment')) {
                return 'Technical Vocational';
            }
            
            // Return original course if no category matches
            return course.charAt(0).toUpperCase() + course.slice(1);
        }
            
            if (age < 20) stats.byAgeGroup['Below 20']++;
            else if (age >= 20 && age <= 29) stats.byAgeGroup['20-29']++;
            else if (age >= 30 && age <= 39) stats.byAgeGroup['30-39']++;
            else if (age >= 40 && age <= 49) stats.byAgeGroup['40-49']++;
            else if (age >= 50 && age <= 59) stats.byAgeGroup['50-59']++;
            else if (age >= 60) stats.byAgeGroup['60 and above']++;
            
            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
            stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
            stats.bySpecificProgram[specificProgram] = (stats.bySpecificProgram[specificProgram] || 0) + 1;
            stats.byEducation[education] = (stats.byEducation[education] || 0) + 1;
            stats.byCourse[course] = (stats.byCourse[course] || 0) + 1;
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

    function calculateDemographicStatistics(applicants) {
        const stats = {
            male: 0,
            female: 0,
            averageAge: 0
        };
        
        let totalAge = 0;
        let ageCount = 0;
        
        applicants.forEach(applicant => {
            const gender = (applicant.SEX || '').toLowerCase();
            if (gender.includes('male') && !gender.includes('female')) {
                stats.male++;
            } else if (gender.includes('female')) {
                stats.female++;
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
            cell.colSpan = 32; 
            cell.className = 'no-results';
            cell.textContent = 'No applicants found';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        applicants.forEach((applicant, index) => {
            const row = document.createElement('tr');
            
            const idCell = document.createElement('td');
            idCell.textContent = applicant['SRS ID'] || `APP-${index + 1}`;
            idCell.style.fontFamily = 'monospace';
            idCell.style.fontSize = '10px';
            row.appendChild(idCell);

            const fullNameCell = document.createElement('td');
            fullNameCell.textContent = applicant.NAME || formatFullName(applicant) || 'N/A';
            fullNameCell.className = 'compact-cell';
            row.appendChild(fullNameCell);
            
            const bdateCell = document.createElement('td');
            bdateCell.textContent = applicant.BDATE || 'N/A';
            bdateCell.style.fontSize = '10px';
            row.appendChild(bdateCell);
            
            const ageCell = document.createElement('td');
            ageCell.textContent = applicant.AGE || 'N/A';
            ageCell.style.textAlign = 'center';
            row.appendChild(ageCell);
            
            const sexCell = document.createElement('td');
            sexCell.textContent = applicant.SEX || 'N/A';
            sexCell.style.textAlign = 'center';
            row.appendChild(sexCell);
            
            const civilStatusCell = document.createElement('td');
            civilStatusCell.textContent = applicant['CIVIL STATUS'] || 'N/A';
            row.appendChild(civilStatusCell);
            
            const streetCell = document.createElement('td');
            streetCell.textContent = applicant['STREET ADDRESS'] || 'N/A';
            streetCell.className = 'compact-cell';
            row.appendChild(streetCell);
            
            const barangayCell = document.createElement('td');
            barangayCell.textContent = applicant.BARANGAY || 'N/A';
            row.appendChild(barangayCell);
            
            const cityCell = document.createElement('td');
            cityCell.textContent = applicant['CITY/MUNICIPALITY'] || 'N/A';
            row.appendChild(cityCell);
            
            const provinceCell = document.createElement('td');
            provinceCell.textContent = applicant.PROVINCE || 'N/A';
            row.appendChild(provinceCell);
            
            const regionCell = document.createElement('td');
            regionCell.textContent = applicant.REGION || 'N/A';
            row.appendChild(regionCell);
            
            const emailCell = document.createElement('td');
            emailCell.textContent = applicant.EMAIL || 'N/A';
            emailCell.className = 'compact-cell';
            row.appendChild(emailCell);
            
            const telephoneCell = document.createElement('td');
            telephoneCell.textContent = applicant.TELEPHONE || 'N/A';
            row.appendChild(telephoneCell);
            
            const cellphoneCell = document.createElement('td');
            cellphoneCell.textContent = applicant.CELLPHONE || 'N/A';
            row.appendChild(cellphoneCell);
            
            const empStatusCell = document.createElement('td');
            empStatusCell.textContent = applicant['EMP. STATUS'] || 'N/A';
            row.appendChild(empStatusCell);
            
            const empTypeCell = document.createElement('td');
            empTypeCell.textContent = applicant['EMP. TYPE'] || 'N/A';
            row.appendChild(empTypeCell);
            
            const educCell = document.createElement('td');
            educCell.textContent = applicant['EDUC LEVEL'] || 'N/A';
            row.appendChild(educCell);
            
            const courseCell = document.createElement('td');
            courseCell.textContent = applicant.COURSE || 'N/A';
            row.appendChild(courseCell);
            
            const fourPsCell = document.createElement('td');
            fourPsCell.textContent = applicant['4Ps'] || 'N/A';
            fourPsCell.style.textAlign = 'center';
            row.appendChild(fourPsCell);
            
            const pwdCell = document.createElement('td');
            pwdCell.textContent = applicant.PWD || 'N/A';
            pwdCell.style.textAlign = 'center';
            row.appendChild(pwdCell);
            
            const disabilityCell = document.createElement('td');
            disabilityCell.textContent = applicant.DISABILITY || 'N/A';
            row.appendChild(disabilityCell);
            
            const preferredPositionCell = document.createElement('td');
            preferredPositionCell.textContent = applicant['PREFERRED POSITION'] || 'N/A';
            row.appendChild(preferredPositionCell);
            
            const skillsCell = document.createElement('td');
            skillsCell.textContent = applicant.SKILLS || 'N/A';
            skillsCell.className = 'compact-cell';
            row.appendChild(skillsCell);
            
            const workExpCell = document.createElement('td');
            workExpCell.textContent = applicant['WORK EXPERIENCE'] || 'N/A';
            workExpCell.className = 'compact-cell';
            row.appendChild(workExpCell);
            
            const ofwCell = document.createElement('td');
            ofwCell.textContent = applicant.OFW || 'N/A';
            ofwCell.style.textAlign = 'center';
            row.appendChild(ofwCell);
            
            const countryCell = document.createElement('td');
            countryCell.textContent = applicant.COUNTRY || 'N/A';
            row.appendChild(countryCell);
            
            const formerOfwCell = document.createElement('td');
            formerOfwCell.textContent = applicant['FORMER OFW'] || 'N/A';
            row.appendChild(formerOfwCell);
            
            const latestCountryCell = document.createElement('td');
            latestCountryCell.textContent = applicant['LATEST COUNTRY'] || 'N/A';
            row.appendChild(latestCountryCell);
            
            const regDateCell = document.createElement('td');
            regDateCell.textContent = applicant['REG. DATE'] || 'N/A';
            regDateCell.style.fontSize = '10px';
            row.appendChild(regDateCell);
            
            const remarksCell = document.createElement('td');
            remarksCell.textContent = applicant.REMARKS || 'N/A';
            row.appendChild(remarksCell);
            
            const createdByCell = document.createElement('td');
            createdByCell.textContent = applicant['CREATED BY'] || 'System';
            row.appendChild(createdByCell);
            
            const dateCreatedCell = document.createElement('td');
            dateCreatedCell.textContent = applicant['DATE CREATED'] || 'N/A';
            dateCreatedCell.style.fontSize = '10px';
            row.appendChild(dateCreatedCell);
            
            const lastModifiedByCell = document.createElement('td');
            lastModifiedByCell.textContent = applicant['LAST MODIFIED BY'] || 'System';
            row.appendChild(lastModifiedByCell);
            
            const dateModifiedCell = document.createElement('td');
            dateModifiedCell.textContent = applicant['DATE LAST MODIFIED'] || 'N/A';
            dateModifiedCell.style.fontSize = '10px';
            row.appendChild(dateModifiedCell);
            
            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';
            
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';

            // Add View Button
            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-btn';
            viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            viewBtn.title = 'View Applicant Details';
            viewBtn.addEventListener('click', function() {
                openViewModal(applicant);
            });
            
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Edit Applicant';
            editBtn.addEventListener('click', function() {
                openEditModal(applicant);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete Applicant';
            deleteBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to delete this applicant?')) {
                    deleteApplicant(applicant['SRS ID'] || applicant.ID);
                }
            });
            
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
        const collegeGrads = (stats.byEducation['College Graduate'] || 0) + 
                            (stats.byEducation['College'] || 0) + 
                            (stats.byEducation['Bachelor'] || 0) +
                            (stats.byEducation['Bachelor\'s Degree'] || 0);

        if (collegeGrads === 0) {
            return '<p style="text-align: center; color: #666; margin: 10px 0;">No college graduates found.</p>';
        }
        
        const allCourses = Object.entries(stats.byCourse)
            .filter(([course, count]) => {
                return course && 
                    course !== 'No Course Specified' && 
                    course !== 'N/A' && 
                    course !== '' && 
                    course !== 'null' &&
                    course !== 'undefined' &&
                    count > 0;
            })
            .sort((a, b) => b[1] - a[1]);

        let coursesHTML = '';
        
        if (allCourses.length === 0) {
            coursesHTML = '<p style="text-align: center; color: #666; padding: 10px;">No course data available for college graduates.</p>';
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
            'SEX': ['SEX', 'Gender', 'SEX/GENDER', 'gender'],
            'CIVIL STATUS': ['CIVIL STATUS', 'Civil Status', 'Status', 'Marital Status'],
            'STREET ADDRESS': ['STREET ADDRESS', 'Street Address', 'Address', 'STREET', 'Street', 'House No', 'House Number', 'Village', 'House No./Street/Village'],
            'BARANGAY': ['BARANGAY', 'Barangay', 'BRGY', 'Brgy'],
            'CITY/MUNICIPALITY': ['CITY/MUNICIPALITY', 'City/Municipality', 'City', 'Municipality', 'CITY', 'MUNICIPALITY'],
            'PROVINCE': ['PROVINCE', 'Province'],
            'REGION': ['REGION', 'Region'],
            'EMAIL': ['EMAIL', 'Email', 'Email Address'],
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
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                if (recordKey.toLowerCase() === label.toLowerCase()) {
                    return record[recordKey];
                }
            }
        }
        
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                if (recordKey.toLowerCase().includes(label.toLowerCase()) || 
                    label.toLowerCase().includes(recordKey.toLowerCase())) {
                    return record[recordKey];
                }
            }
        }
        
        for (const label of possibleLabels) {
            const cleanLabel = label.toLowerCase().replace(/[\s_]/g, '');
            for (const recordKey in record) {
                const cleanRecordKey = recordKey.toLowerCase().replace(/[\s_]/g, '');
                if (cleanRecordKey === cleanLabel) {
                    return record[recordKey];
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
            'EMAIL': ['EMAIL', 'Email', 'Email Address']
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

    // Re-initialize manual form controls
    function initializeManualFormControls() {
        // Initialize photo controls
        initializeManualPhotoControls();
        
        // Initialize dynamic form elements
        initializeDynamicFormElements();
        
        // Initialize add entry buttons
        initializeAddEntryButtons();
        
        // Add submit handler for adding new applicants
        elements.manualApplicantForm.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateManualForm(false)) {
                addManualApplicant();
            }
        });
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
    initializeApp();
});