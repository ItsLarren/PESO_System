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
        sortOrder: document.getElementById('sort-order'),
        generateReportBtn: document.getElementById('generate-report-btn'),
        exportReportBtn: document.getElementById('export-report-btn')
    };

    let currentEditId = null;
    let stream = null;
    let capturedPhoto = null;
    let activeFilters = {};

    // Initialize all functionality
    function initializeApp() {
        initializeManualForm();
        initializeCamera();
        initializeSearch();
        initializeEditModal();
        initializeFileUploads();
        initializeAdvancedFilters();
        initializeReporting();
        loadMainApplicants();
        loadImportedData();
        
        // Check authentication
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = 'login.html';
            return;
        }
        
        // Display current user
        displayCurrentUser();
    }

    // Initialize manual form functionality
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

        // Set default values for manual form
        if (elements.manualApplicantForm) {
            // Set default values to N/A for optional fields
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
            
            // Set default values for dropdowns
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

        // Photo functionality remains the same
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
    }

    function openManualModal() {
        if (!elements.manualModal) return;
        
        // Reset form
        elements.manualApplicantForm.reset();
        
        // Reset photo
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
    }

    function handleManualPhotoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const photoData = e.target.result;
                    // Store temporarily for manual entry
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
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        const matches = [];
        
        for (const existingApp of savedApplicants) {
            const nameMatch = applicantData.NAME && existingApp.NAME && 
                            applicantData.NAME.toLowerCase() === existingApp.NAME.toLowerCase();
            
            const bdateMatch = applicantData.BDATE && existingApp.BDATE && 
                            applicantData.BDATE === existingApp.BDATE;
            
            if (nameMatch || bdateMatch) {
                const matchDetails = {
                    existingApplicant: existingApp,
                    matchingFields: [],
                    differences: []
                };
                
                // Check which fields match
                if (nameMatch) matchDetails.matchingFields.push('Name');
                if (bdateMatch) matchDetails.matchingFields.push('Birthday');
                
                // Check other fields for differences
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
                
                matches.push(matchDetails);
            }
        }
        
        return {
            hasMatches: matches.length > 0,
            matches: matches
        };
    }

    // Function to show detailed duplicate confirmation
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
                        </h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div>
                                <strong>Current Program:</strong><br>
                                ${existing['PROGRAM CATEGORY'] || 'Not specified'} - ${existing['PROGRAM STATUS'] || 'No status'}
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
                            <div colspan="2">
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
                    <p style="font-size: 14px; color: #666;">If this is a different person, click "Add Anyway". If it's the same person, click "Cancel".</p>
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

    // Function to highlight matching applicants in the table
    function highlightMatchingApplicants(matches) {
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        // Remove any existing highlights
        const existingHighlights = tbody.querySelectorAll('.duplicate-highlight');
        existingHighlights.forEach(row => {
            row.classList.remove('duplicate-highlight');
        });
        
        // Highlight matching rows
        matches.forEach(match => {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const nameCell = row.querySelector('td:nth-child(3)'); // NAME column
                if (nameCell && nameCell.textContent.trim().toLowerCase() === match.existingApplicant.NAME.toLowerCase()) {
                    row.classList.add('duplicate-highlight');
                    
                    // Scroll to the first highlighted row
                    if (!window.hasScrolledToHighlight) {
                        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        window.hasScrolledToHighlight = true;
                    }
                }
            });
        });
    }

    // Function to remove highlights
    function removeHighlights() {
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        const highlightedRows = tbody.querySelectorAll('.duplicate-highlight');
        highlightedRows.forEach(row => {
            row.classList.remove('duplicate-highlight');
        });
        
        window.hasScrolledToHighlight = false;
    }

    function addManualApplicant() {
        const formData = new FormData(elements.manualApplicantForm);
        const applicantData = {};
        
        // Map form fields to applicant data structure
        formData.forEach((value, key) => {
            const fieldName = key.replace('manual-', '').toUpperCase().replace(/-/g, ' ');
            applicantData[fieldName] = value;
        });
        const lastName = applicantData['LAST NAME'] || '';
        const firstName = applicantData['FIRST NAME'] || '';
        const middleName = applicantData['MIDDLE NAME'] || '';
        
        if (lastName && firstName) {
            applicantData['NAME'] = `${lastName}, ${firstName} ${middleName}`.trim();
        }
        
        // Generate SRS ID
        applicantData['SRS ID'] = generateUniqueId();
        
        // Process date fields
        if (applicantData['BDATE']) {
            const date = new Date(applicantData['BDATE']);
            applicantData['BDATE'] = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
        }
        
        // Set registration date to current date
        applicantData['REG. DATE'] = new Date().toLocaleDateString();
        applicantData['DATE CREATED'] = new Date().toLocaleString();
        applicantData['DATE LAST MODIFIED'] = new Date().toLocaleString();
        
        // Check for name duplicates (even if other fields are different)
        const duplicateCheck = checkApplicantDuplicate(applicantData);
        
        if (duplicateCheck.hasMatches) {
            // Highlight the matching applicants in the table
            highlightMatchingApplicants(duplicateCheck.matches);
            
            // Show detailed confirmation modal
            showDuplicateConfirmation(applicantData, duplicateCheck.matches)
                .then(shouldProceed => {
                    if (!shouldProceed) {
                        // Remove highlights if user cancels
                        removeHighlights();
                        return;
                    }
                    
                    // User chose to proceed - add the applicant
                    proceedWithAddingApplicant(applicantData);
                });
        } else {
            // No duplicates found - proceed with adding
            proceedWithAddingApplicant(applicantData);
        }
    }

    // Separate function to handle the actual adding of applicant
    function proceedWithAddingApplicant(applicantData) {
        // Handle photo
        const tempPhoto = localStorage.getItem('tempManualPhoto');
        if (tempPhoto) {
            const photoId = applicantData['SRS ID'];
            localStorage.setItem(`photo_${photoId}`, tempPhoto);
            localStorage.removeItem('tempManualPhoto');
            applicantData['PHOTO'] = tempPhoto;
        }
        
        // Save to localStorage
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        savedApplicants.push(applicantData);
        saveMainApplicants(savedApplicants);
        
        // Refresh display and remove highlights
        displayMainApplicants(savedApplicants);
        removeHighlights();
        
        // Close modal and show success message
        closeManualModal();
        showNotification('Applicant added successfully!', 'success', elements.manualNotification);
        
        // Clear the temporary photo
        localStorage.removeItem('tempManualPhoto');
    }

    // Initialize camera functionality
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
                // For manual form
                localStorage.setItem('tempManualPhoto', capturedPhoto);
                elements.manualPhotoPreview.src = capturedPhoto;
                elements.manualPhotoPreview.style.display = 'block';
                elements.manualPhotoPlaceholder.style.display = 'none';
                elements.manualRemovePhotoBtn.style.display = 'block';
            } else {
                // For edit form (existing functionality)
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

    // Initialize search functionality
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

    // Initialize edit modal functionality
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
        
        // Updated field mapping - removed unwanted fields
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
        
        formData.forEach((value, key) => {
            const originalFieldName = key.replace('edit-', '').replace(/-/g, ' ').toUpperCase();

            if (originalFieldName === 'BDATE' && value) {
                const date = new Date(value);
                updatedApplicant[originalFieldName] = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            } else {
                updatedApplicant[originalFieldName] = value;
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

    // Initialize file uploads
    function initializeFileUploads() {
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
                        
                        // Use smart import
                        const processedData = smartImportData(jsonData);
                        
                        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
                        
                        const { duplicates, uniqueNewApplicants } = checkForDuplicates(processedData, savedApplicants);

                        if (duplicates.length > 0) {
                            // Highlight duplicates in the table
                            highlightMatchingApplicants(duplicates.map(dup => ({
                                existingApplicant: dup.existing,
                                matchingFields: ['Possible Duplicate'],
                                differences: []
                            })));
                            
                            elements.duplicateWarning.innerHTML = `
                                <strong>Found ${duplicates.length} potential duplicate(s):</strong> 
                                These applicants appear to already exist in the system. They have been highlighted in the table above.
                                <br><br>
                                <strong>Import Summary:</strong>
                                <ul>
                                    <li>Total records in file: ${processedData.length}</li>
                                    <li>New applicants: ${uniqueNewApplicants.length}</li>
                                    <li>Duplicates found: ${duplicates.length}</li>
                                </ul>
                                <br>
                                <button id="proceed-upload" class="save-btn" style="padding: 8px 15px; font-size: 14px;">
                                    Add ${uniqueNewApplicants.length} New Applicants Anyway
                                </button>
                            `;
                            elements.duplicateWarning.style.display = 'block';
                            
                            document.getElementById('proceed-upload').addEventListener('click', function() {
                                uniqueNewApplicants.forEach(applicant => {
                                    savedApplicants.push(applicant);
                                });
                                
                                saveMainApplicants(savedApplicants);
                                displayMainApplicants(savedApplicants);
                                removeHighlights();
                                
                                showUploadNotification(`Successfully added ${uniqueNewApplicants.length} new applicant(s). ${duplicates.length} duplicate(s) were skipped.`, 'success');
                                if (elements.uploadFileName) elements.uploadFileName.value = '';
                                if (elements.addBtn) elements.addBtn.disabled = true;
                                if (elements.uploadFileInput) elements.uploadFileInput.value = '';
                                elements.duplicateWarning.style.display = 'none';
                            });
                            
                            return;
                        }
                        
                        // If no duplicates, add all
                        processedData.forEach(applicant => {
                            savedApplicants.push(applicant);
                        });
                        
                        saveMainApplicants(savedApplicants);
                        displayMainApplicants(savedApplicants);
                        
                        showUploadNotification(`Successfully imported ${processedData.length} applicant(s). The system automatically matched your file's columns to the appropriate fields.`, 'success');
                        if (elements.uploadFileName) elements.uploadFileName.value = '';
                        if (elements.addBtn) elements.addBtn.disabled = true;
                        if (elements.uploadFileInput) elements.uploadFileInput.value = '';
                        
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
                        
                        const processedData = processDateFields(jsonData);
                        displayImportedData(processedData);
                        
                        showNotification(`Successfully loaded ${processedData.length} record(s) from file.`, 'success');
                        if (elements.fileName) elements.fileName.value = '';
                        if (elements.importBtn) elements.importBtn.disabled = true;
                        if (elements.fileInput) elements.fileInput.value = '';
                        
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
    }

    // Initialize advanced filters
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
            // Text search
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
            
            // Program category filter
            if (activeFilters.programCategory && applicant['PROGRAM CATEGORY'] !== activeFilters.programCategory) {
                return false;
            }
            
            // Program status filter
            if (activeFilters.programStatus && applicant['PROGRAM STATUS'] !== activeFilters.programStatus) {
                return false;
            }
            
            // Employment status filter
            if (activeFilters.employmentStatus && applicant['EMP. STATUS'] !== activeFilters.employmentStatus) {
                return false;
            }
            
            // Age range filter
            const applicantAge = parseInt(applicant.AGE) || 0;
            if (activeFilters.ageMin && applicantAge < parseInt(activeFilters.ageMin)) {
                return false;
            }
            if (activeFilters.ageMax && applicantAge > parseInt(activeFilters.ageMax)) {
                return false;
            }
            
            // Barangay filter - fixed to filter out N/A and partial match
            if (activeFilters.barangay) {
                const applicantBarangay = (applicant.BARANGAY || '').toLowerCase();
                const filterBarangay = activeFilters.barangay.toLowerCase();
                
                // Don't show if barangay is N/A or doesn't match
                if (applicantBarangay === 'n/a' || applicantBarangay === '' || 
                    !applicantBarangay.includes(filterBarangay)) {
                    return false;
                }
            }
            
            // Registration date filter - fixed to handle year/month filtering
            if (activeFilters.regDate) {
                const applicantRegDate = applicant['REG. DATE'];
                
                // Don't show if registration date is N/A or empty
                if (!applicantRegDate || applicantRegDate === 'N/A' || applicantRegDate === '') {
                    return false;
                }
                
                const filterDate = new Date(activeFilters.regDate);
                const applicantDate = new Date(applicantRegDate);
                
                // Check if dates are valid
                if (isNaN(filterDate.getTime()) || isNaN(applicantDate.getTime())) {
                    return false;
                }
                
                // Check year and month match
                if (filterDate.getFullYear() !== applicantDate.getFullYear() || 
                    filterDate.getMonth() !== applicantDate.getMonth()) {
                    return false;
                }
            }
            
            return true;
        });
        
        // Apply sorting
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

    // Initialize reporting
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
        
        // Toggle visibility
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
            <div class="report-section">
                <h3>📊 Program Enrollment Summary</h3>
                <div class="stats-grid">
                    ${generateProgramStatsHTML(programStats)}
                </div>
            </div>
            
            <div class="report-section">
                <h3>🎓 Educational Attainment</h3>
                <div class="stats-grid">
                    ${generateEducationStatsHTML(programStats)}
                </div>
                ${generateExpandableCourseStats(programStats)}
            </div>
            
            <div class="report-section">
                <h3>👥 Age Demographics</h3>
                <div class="stats-grid">
                    ${generateAgeStatsHTML(programStats)}
                </div>
            </div>
            
            <div class="report-section">
                <h3>💼 Employment Status Overview</h3>
                <div class="stats-grid">
                    ${generateEmploymentStatsHTML(employmentStats)}
                </div>
            </div>
            
            <div class="report-section">
                <h3>👤 Demographic Overview</h3>
                <div class="stats-grid">
                    ${generateDemographicStatsHTML(demographicStats)}
                </div>
            </div>
            
            <div class="report-actions" style="margin-top: 20px; display: flex; gap: 10px;">
                <button id="export-summary-btn" class="action-btn" style="background: #4caf50;">
                    <i class="fas fa-file-excel"></i> Export Summary Report
                </button>
                <button id="export-full-btn" class="action-btn" style="background: #2196f3;">
                    <i class="fas fa-file-excel"></i> Export Full Data
                </button>
            </div>
        `;
        
        // Initialize expandable sections
        initializeExpandableSections();
        
        document.getElementById('export-summary-btn').addEventListener('click', exportSummaryReport);
        document.getElementById('export-full-btn').addEventListener('click', exportReportsToExcel);
        
        reportsContainer.style.display = 'block';
    }

    function initializeExpandableSections() {
        document.querySelectorAll('.expandable-section').forEach(section => {
            const header = section.querySelector('.expandable-header');
            const icon = header.querySelector('i');
            
            header.addEventListener('click', function() {
                section.classList.toggle('expanded');
                if (section.classList.contains('expanded')) {
                    icon.className = 'fas fa-chevron-up';
                } else {
                    icon.className = 'fas fa-chevron-down';
                }
            });
        });
    }

    // New function for education statistics
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

    // New function for age statistics
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
            }
        };
        
        applicants.forEach(applicant => {
            const category = applicant['PROGRAM CATEGORY'] || 'Uncategorized';
            const status = applicant['PROGRAM STATUS'] || 'Not Specified';
            const specificProgram = applicant['SPECIFIC PROGRAM'] || 'No Specific Program';
            const education = applicant['EDUC LEVEL'] || 'Not Specified';
            const course = applicant['COURSE'] || 'No Course Specified';
            const age = parseInt(applicant.AGE) || 0;
            
            // Age groups
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
        
        return `
            <div class="stat-card">
                <div class="stat-number">${stats.male}</div>
                <div class="stat-label">Male</div>
                <div class="stat-percentage">${totalGender > 0 ? ((stats.male / totalGender) * 100).toFixed(1) : 0}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.female}</div>
                <div class="stat-label">Female</div>
                <div class="stat-percentage">${totalGender > 0 ? ((stats.female / totalGender) * 100).toFixed(1) : 0}%</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.averageAge}</div>
                <div class="stat-label">Average Age</div>
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
            // Create a cleaned version of the data for export
            const exportData = savedApplicants.map(applicant => {
                const cleanApplicant = {};
                
                // Only include essential fields and truncate long text
                Object.keys(applicant).forEach(key => {
                    let value = applicant[key];
                    
                    // Truncate very long text fields
                    if (typeof value === 'string' && value.length > 1000) {
                        value = value.substring(0, 1000) + '... [truncated]';
                    }
                    
                    // Skip extremely long fields that might cause issues
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
            
            // Generate filename with current date
            const today = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `applicants_report_${today}.xlsx`);
            
            showNotification('Report exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting report:', error);
            
            // More specific error handling
            if (error.message.includes('32767')) {
                showNotification('Error: Some data fields are too long for Excel export. Try exporting a summary report instead.', 'error');
            } else {
                showNotification('Error exporting report: ' + error.message, 'error');
            }
        }
    }

    // Utility functions
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
        if (!targetElement) return;
        
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
        if (!elements.mainApplicantTable) return;
        
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (applicants.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 35; // Updated column count
            cell.className = 'no-results';
            cell.textContent = 'No applicants found';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }
        
        applicants.forEach((applicant, index) => {
            const row = document.createElement('tr');
            
            // SRS ID
            const idCell = document.createElement('td');
            idCell.textContent = applicant['SRS ID'] || `APP-${index + 1}`;
            idCell.style.fontFamily = 'monospace';
            idCell.style.fontSize = '10px';
            row.appendChild(idCell);

            // LAST NAME
            const lastNameCell = document.createElement('td');
            lastNameCell.textContent = applicant['LAST NAME'] || applicant.LASTNAME || extractLastName(applicant.NAME) || 'N/A';
            lastNameCell.className = 'compact-cell';
            row.appendChild(lastNameCell);

            // FIRST NAME
            const firstNameCell = document.createElement('td');
            firstNameCell.textContent = applicant['FIRST NAME'] || applicant.FIRSTNAME || extractFirstName(applicant.NAME) || 'N/A';
            firstNameCell.className = 'compact-cell';
            row.appendChild(firstNameCell);

            // MIDDLE NAME
            const middleNameCell = document.createElement('td');
            middleNameCell.textContent = applicant['MIDDLE NAME'] || applicant.MIDDLENAME || extractMiddleName(applicant.NAME) || 'N/A';
            middleNameCell.className = 'compact-cell';
            row.appendChild(middleNameCell);

            // FULL NAME (for backward compatibility)
            const fullNameCell = document.createElement('td');
            fullNameCell.textContent = applicant.NAME || formatFullName(applicant) || 'N/A';
            fullNameCell.className = 'compact-cell';
            row.appendChild(fullNameCell);
            
            // BDATE
            const bdateCell = document.createElement('td');
            bdateCell.textContent = applicant.BDATE || 'N/A';
            bdateCell.style.fontSize = '10px';
            row.appendChild(bdateCell);
            
            // AGE
            const ageCell = document.createElement('td');
            ageCell.textContent = applicant.AGE || 'N/A';
            ageCell.style.textAlign = 'center';
            row.appendChild(ageCell);
            
            // SEX
            const sexCell = document.createElement('td');
            sexCell.textContent = applicant.SEX || 'N/A';
            sexCell.style.textAlign = 'center';
            row.appendChild(sexCell);
            
            // CIVIL STATUS
            const civilStatusCell = document.createElement('td');
            civilStatusCell.textContent = applicant['CIVIL STATUS'] || 'N/A';
            row.appendChild(civilStatusCell);
            
            // STREET ADDRESS
            const streetCell = document.createElement('td');
            streetCell.textContent = applicant['STREET ADDRESS'] || 'N/A';
            streetCell.className = 'compact-cell';
            row.appendChild(streetCell);
            
            // BARANGAY
            const barangayCell = document.createElement('td');
            barangayCell.textContent = applicant.BARANGAY || 'N/A';
            row.appendChild(barangayCell);
            
            // CITY/MUNICIPALITY
            const cityCell = document.createElement('td');
            cityCell.textContent = applicant['CITY/MUNICIPALITY'] || 'N/A';
            row.appendChild(cityCell);
            
            // PROVINCE
            const provinceCell = document.createElement('td');
            provinceCell.textContent = applicant.PROVINCE || 'N/A';
            row.appendChild(provinceCell);
            
            // REGION
            const regionCell = document.createElement('td');
            regionCell.textContent = applicant.REGION || 'N/A';
            row.appendChild(regionCell);
            
            // EMAIL
            const emailCell = document.createElement('td');
            emailCell.textContent = applicant.EMAIL || 'N/A';
            emailCell.className = 'compact-cell';
            row.appendChild(emailCell);
            
            // TELEPHONE
            const telephoneCell = document.createElement('td');
            telephoneCell.textContent = applicant.TELEPHONE || 'N/A';
            row.appendChild(telephoneCell);
            
            // CELLPHONE
            const cellphoneCell = document.createElement('td');
            cellphoneCell.textContent = applicant.CELLPHONE || 'N/A';
            row.appendChild(cellphoneCell);
            
            // EMP. STATUS
            const empStatusCell = document.createElement('td');
            empStatusCell.textContent = applicant['EMP. STATUS'] || 'N/A';
            row.appendChild(empStatusCell);
            
            // EMP. TYPE
            const empTypeCell = document.createElement('td');
            empTypeCell.textContent = applicant['EMP. TYPE'] || 'N/A';
            row.appendChild(empTypeCell);
            
            // EDUC LEVEL
            const educCell = document.createElement('td');
            educCell.textContent = applicant['EDUC LEVEL'] || 'N/A';
            row.appendChild(educCell);
            
            // COURSE
            const courseCell = document.createElement('td');
            courseCell.textContent = applicant.COURSE || 'N/A';
            row.appendChild(courseCell);
            
            // 4Ps
            const fourPsCell = document.createElement('td');
            fourPsCell.textContent = applicant['4Ps'] || 'N/A';
            fourPsCell.style.textAlign = 'center';
            row.appendChild(fourPsCell);
            
            // PWD
            const pwdCell = document.createElement('td');
            pwdCell.textContent = applicant.PWD || 'N/A';
            pwdCell.style.textAlign = 'center';
            row.appendChild(pwdCell);
            
            // DISABILITY
            const disabilityCell = document.createElement('td');
            disabilityCell.textContent = applicant.DISABILITY || 'N/A';
            row.appendChild(disabilityCell);
            
            // PREFERRED POSITION
            const preferredPositionCell = document.createElement('td');
            preferredPositionCell.textContent = applicant['PREFERRED POSITION'] || 'N/A';
            row.appendChild(preferredPositionCell);
            
            // SKILLS
            const skillsCell = document.createElement('td');
            skillsCell.textContent = applicant.SKILLS || 'N/A';
            skillsCell.className = 'compact-cell';
            row.appendChild(skillsCell);
            
            // WORK EXPERIENCE
            const workExpCell = document.createElement('td');
            workExpCell.textContent = applicant['WORK EXPERIENCE'] || 'N/A';
            workExpCell.className = 'compact-cell';
            row.appendChild(workExpCell);
            
            // OFW
            const ofwCell = document.createElement('td');
            ofwCell.textContent = applicant.OFW || 'N/A';
            ofwCell.style.textAlign = 'center';
            row.appendChild(ofwCell);
            
            // COUNTRY
            const countryCell = document.createElement('td');
            countryCell.textContent = applicant.COUNTRY || 'N/A';
            row.appendChild(countryCell);
            
            // FORMER OFW
            const formerOfwCell = document.createElement('td');
            formerOfwCell.textContent = applicant['FORMER OFW'] || 'N/A';
            row.appendChild(formerOfwCell);
            
            // LATEST COUNTRY
            const latestCountryCell = document.createElement('td');
            latestCountryCell.textContent = applicant['LATEST COUNTRY'] || 'N/A';
            row.appendChild(latestCountryCell);
            
            // REG. DATE
            const regDateCell = document.createElement('td');
            regDateCell.textContent = applicant['REG. DATE'] || 'N/A';
            regDateCell.style.fontSize = '10px';
            row.appendChild(regDateCell);
            
            // REMARKS
            const remarksCell = document.createElement('td');
            remarksCell.textContent = applicant.REMARKS || 'N/A';
            row.appendChild(remarksCell);
            
            // CREATED BY
            const createdByCell = document.createElement('td');
            createdByCell.textContent = applicant['CREATED BY'] || 'System';
            row.appendChild(createdByCell);
            
            // DATE CREATED
            const dateCreatedCell = document.createElement('td');
            dateCreatedCell.textContent = applicant['DATE CREATED'] || 'N/A';
            dateCreatedCell.style.fontSize = '10px';
            row.appendChild(dateCreatedCell);
            
            // LAST MODIFIED BY
            const lastModifiedByCell = document.createElement('td');
            lastModifiedByCell.textContent = applicant['LAST MODIFIED BY'] || 'System';
            row.appendChild(lastModifiedByCell);
            
            // DATE LAST MODIFIED
            const dateModifiedCell = document.createElement('td');
            dateModifiedCell.textContent = applicant['DATE LAST MODIFIED'] || 'N/A';
            dateModifiedCell.style.fontSize = '10px';
            row.appendChild(dateModifiedCell);
            
            // Actions Cell
            const actionsCell = document.createElement('td');
            actionsCell.className = 'actions-cell';
            
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons';
            
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
            
            actionButtons.appendChild(editBtn);
            actionButtons.appendChild(downloadBtn);
            actionButtons.appendChild(deleteBtn);
            actionsCell.appendChild(actionButtons);
            row.appendChild(actionsCell);
            
            tbody.appendChild(row);
        });
    }

    // Helper function for status badges
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

    // Function to download individual applicant data
    function downloadApplicantData(applicant) {
        try {
            const worksheet = XLSX.utils.json_to_sheet([applicant]);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Applicant Data");
            
            const fileName = `applicant_${applicant['SRS ID'] || applicant.NAME || 'data'}.xlsx`;
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
            
            // Create cells for all columns in the imported table
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
                    
                    // Add event listeners for actions
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
                    // Map column names to record fields
                    let value = 'N/A';
                    const fieldMap = {
                        'Last Name': record['Last Name'] || record['LAST NAME'] || record['last_name'],
                        'Given Name': record['Given Name'] || record['GIVEN NAME'] || record['given_name'] || record['First Name'] || record['FIRST NAME'] || record['first name'],
                        'Middle Name': record['Middle Name'] || record['MIDDLE NAME'] || record['middle_name'],
                        'Full Name': record['Full Name'] || record['FULL NAME'] || record['full_name'] || record['NAME'],
                        'Date of Birth': record['Date of Birth'] || record['DATE OF BIRTH'] || record['date of birth'] || ['Birthday'] || record['BIRTHDAY'] || record['birthday'] || record['Bdate'] || record['BDATE'] || record['bdate'] || record['bDate'],
                        'Age': record['Age'] || record['AGE'] || record['age'],
                        'Sex': record['Sex'] || record['SEX'] || record['sex'] || record['Gender'] || record['GENDER'] || record['gender'],
                        'Civil Status': record['Civil Status'] || record['CIVIL STATUS'] || record['civil status'],
                        'Street': record['Street'] || record['STREET'] || record['street'] || record['Street Address'] || record['STREET ADDRESS'] || record['street address'],
                        'Barangay': record['Barangay'] || record['BARANGAY'] || record['barangay'],
                        'City': record['City'] || record['CITY'] || record['city'] || record['City/Municipality'] || record['CITY/MUNICIPALITY'] || record['city/municipality'],
                        'Province': record['Province'] || record['PROVINCE'] || record['province'],
                        'Contact No.': record['Contact No.'] || record['CONTACT NO.'] || record['contact no.'] || record['Cellphone'] || record['CELLPHONE'] || record['cellphone'] || record['Phone No.'] || record['PHONE NO.'] || record['phone no.'],
                        'Employment Status': record['Employment Status'] || record['EMPLOYMENT STATUS'] || record['employment status'] || record['Employment Status'] || record['EMPLOYMENT STATUS'] || record['employment status'] || record['Emp. Status'] || record['EMP. STATUS'] || record['emp. status'],
                        'If Employed/Self Employed': record['If Employed/Self Employed'] || record['IF EMPLOYED/SELF EMPLOYED'] || record['if Employed/self employed'] || record[''],
                        'Educational Attainment': record['Educational Attainment'] || record['EDUCATIONAL ATTAINMENT'] || record['educational attainment'] || record[''],
                        'Course': record['Course'] || record['COURSE'] || record['course'] || record[''],
                        'Skills': record['Skills'] || record['SKILLS'] || record['skills'] || record[''],
                        'Work Experience': record['Work Experience'] || record['WORK EXPERIENCE'] || record['work experience'] || record[''],
                        'Sector': record['Sector'] || record['SECTOR'] || record['sector'] || record[''],
                        'Program/Services Provided': record['Program/Services Provided'] || record['PROGRAM/SERVICES PROVIDED'] || record['program/services provided'] || record[''],
                        'Remarks': record['Remarks'] || record['REMARKS'] || record['remarks'] || record[''],
                        'Registration Date': record['Registration Date'] || record['REGISTRATION DATE'] || record['registration date'] || record[''],
                    };
                    
                    value = fieldMap[column] || record[column] || 'N/A';
                    cell.textContent = value;
                    cell.className = 'compact-cell';
                }
                
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });
        
        localStorage.setItem('importedData', JSON.stringify(data));
    }

    function exportSummaryReport() {
        const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
        if (savedApplicants.length === 0) {
            showNotification('No data available to export', 'error');
            return;
        }
        
        try {
            // Create summary data instead of full records
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

    // Add export functionality
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
            // Create simplified data for export
            const exportData = savedApplicants.map(applicant => ({
                'SRS ID': applicant['SRS ID'] || '',
                'Name': applicant.NAME || '',
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
            }));
            
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
        displayImportedData(importedData);
        showNotification('Imported record deleted successfully!', 'success');
    }

    function generateExpandableCourseStats(stats) {
        const collegeGrads = stats.byEducation['College Graduate'] || stats.byEducation['College'] || 0;
        
        if (collegeGrads === 0) {
            return '<p style="text-align: center; color: #666; margin: 10px 0;">No college graduates found.</p>';
        }
        
        // Get top courses
        const topCourses = Object.entries(stats.byCourse)
            .filter(([course, count]) => course !== 'No Course Specified' && course !== 'N/A' && count > 0)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        
        let coursesHTML = '';
        topCourses.forEach(([course, count]) => {
            const percentage = ((count / collegeGrads) * 100).toFixed(1);
            coursesHTML += `
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee;">
                    <span>${course}</span>
                    <span><strong>${count}</strong> (${percentage}%)</span>
                </div>
            `;
        });
        
        return `
            <div class="expandable-section">
                <div class="expandable-header">
                    <span><strong>${collegeGrads} College Graduates - Course Breakdown</strong></span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="expandable-content">
                    ${coursesHTML || '<p style="text-align: center; color: #666;">No course data available.</p>'}
                </div>
            </div>
        `;
    }

    // Helper functions for name parsing
    function extractLastName(fullName) {
        if (!fullName) return '';
        const parts = fullName.split(',');
        return parts[0] ? parts[0].trim() : '';
    }

    function extractFirstName(fullName) {
        if (!fullName) return '';
        const parts = fullName.split(',');
        if (parts.length > 1) {
            const firstMiddle = parts[1].trim().split(' ');
            return firstMiddle[0] || '';
        }
        return fullName.split(' ')[0] || '';
    }

    function extractMiddleName(fullName) {
        if (!fullName) return '';
        const parts = fullName.split(',');
        if (parts.length > 1) {
            const firstMiddle = parts[1].trim().split(' ');
            return firstMiddle.length > 1 ? firstMiddle.slice(1).join(' ') : '';
        }
        const nameParts = fullName.split(' ');
        return nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
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
        // Define all possible labels for each field based on your form
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
            'STREET ADDRESS': ['STREET ADDRESS', 'Street Address', 'Address', 'STREET', 'Street'],
            'BARANGAY': ['BARANGAY', 'Barangay', 'BRGY', 'Brgy'],
            'CITY/MUNICIPALITY': ['CITY/MUNICIPALITY', 'City/Municipality', 'City', 'Municipality', 'CITY', 'MUNICIPALITY'],
            'PROVINCE': ['PROVINCE', 'Province'],
            'REGION': ['REGION', 'Region'],
            'EMAIL': ['EMAIL', 'Email', 'Email Address'],
            'TELEPHONE': ['TELEPHONE', 'Telephone', 'Phone', 'Landline'],
            'CELLPHONE': ['CELLPHONE', 'Cellphone', 'Mobile', 'Mobile No', 'Contact No', 'Contact Number'],
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
        // First, try exact matches (case insensitive)
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                if (recordKey.toLowerCase() === label.toLowerCase()) {
                    return record[recordKey];
                }
            }
        }
        
        // Then try partial matches
        for (const label of possibleLabels) {
            for (const recordKey in record) {
                if (recordKey.toLowerCase().includes(label.toLowerCase()) || 
                    label.toLowerCase().includes(recordKey.toLowerCase())) {
                    return record[recordKey];
                }
            }
        }
        
        return null;
    }

    function processFieldValue(fieldKey, value) {
        if (!value) return value;
        
        // Convert to string and trim
        value = String(value).trim();
        
        // Handle date fields
        if (fieldKey === 'BDATE' || fieldKey === 'REG. DATE') {
            return formatDateValue(value);
        }
        
        // Handle boolean-like fields
        const booleanFields = ['4Ps', 'PWD', 'OFW', 'FORMER OFW'];
        if (booleanFields.includes(fieldKey)) {
            return normalizeBooleanValue(value);
        }
        
        // Handle empty values
        if (value === '' || value === 'null' || value === 'undefined') {
            return 'N/A';
        }
        
        return value;
    }

    function formatDateValue(dateValue) {
        if (!dateValue) return 'N/A';
        
        try {
            // Try to parse as Date object first
            let dateObj = new Date(dateValue);
            
            if (isNaN(dateObj.getTime())) {
                // If that fails, try common string formats
                if (dateValue.includes('/')) {
                    const parts = dateValue.split('/');
                    if (parts.length === 3) {
                        const month = parts[0].padStart(2, '0');
                        const day = parts[1].padStart(2, '0');
                        const year = parts[2];
                        return `${month}/${day}/${year}`;
                    }
                }
                return dateValue; // Return as-is if we can't parse
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
        
        return value; // Return original if not recognized
    }

    function smartImportData(jsonData) {
        console.log("Raw imported data:", jsonData);
        
        if (jsonData.length === 0) {
            return [];
        }
        
        const processedData = jsonData.map((record, index) => {
            const processedRecord = {};
            
            // Get all field mappings from the manual form
            const fieldMappings = getFormFieldMappings();
            
            // Try to match each field
            Object.keys(fieldMappings).forEach(fieldKey => {
                const possibleLabels = fieldMappings[fieldKey];
                let value = findMatchingValue(record, possibleLabels);
                
                // Special handling for specific fields
                if (value) {
                    value = processFieldValue(fieldKey, value);
                }
                
                processedRecord[fieldKey] = value || 'N/A';
            });
            
            // Generate SRS ID if not present
            if (!processedRecord['SRS ID'] || processedRecord['SRS ID'] === 'N/A') {
                processedRecord['SRS ID'] = generateUniqueId();
            }
            
            // Set timestamps
            processedRecord['DATE CREATED'] = new Date().toLocaleString();
            processedRecord['DATE LAST MODIFIED'] = new Date().toLocaleString();
            processedRecord['CREATED BY'] = 'System Import';
            processedRecord['LAST MODIFIED BY'] = 'System Import';
            
            return processedRecord;
        });
        
        return processedData;
    }

    function showFieldMapping(originalRecord, processedRecord) {
        console.log("Field mapping results:");
        Object.keys(processedRecord).forEach(key => {
            if (processedRecord[key] !== 'N/A') {
                // Find which original field was mapped
                const originalField = Object.keys(originalRecord).find(origKey => 
                    String(originalRecord[origKey]) === String(processedRecord[key])
                );
                console.log(`${key}: "${processedRecord[key]}" (from: "${originalField}")`);
            }
        });
    }


    // Initialize the application
    initializeApp();
});