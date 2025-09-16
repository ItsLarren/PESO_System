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
        clearSearchBtn: document.getElementById('clear-search-btn')
    };

    let currentEditId = null;

    if (elements.searchBtn && elements.clearSearchBtn && elements.searchInput) {
        elements.searchBtn.addEventListener('click', searchApplicants);
        elements.clearSearchBtn.addEventListener('click', clearSearch);
        elements.searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchApplicants();
            }
        });
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

    function displayMainApplicants(applicants) {
        if (!elements.mainApplicantTable) return;
        
        const tbody = elements.mainApplicantTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!applicants || !Array.isArray(applicants) || applicants.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 42;
            cell.textContent = 'No applicants found. Import data or add manually.';
            cell.className = 'no-results';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }

        const validApplicants = applicants.filter(applicant => applicant !== null && applicant !== undefined);
        
        validApplicants.forEach(applicant => {
            addApplicantRow(tbody, applicant);
        });
        
        clearSearch();
    }
    
    const fieldMapping = {
        'SRS ID': 'ID',
        'NAME': 'Full Name',
        'BDATE': 'Date of Birth',
        'AGE': 'Age',
        'SEX': 'Sex',
        'CIVIL STATUS': 'Civil Status',
        'STREET ADDRESS': 'Street',
        'BARANGAY': 'Barangay',
        'CITY/MUNICIPALITY': 'City',
        'PROVINCE': 'Province',
        'CELLPHONE': 'Contact No.',
        'EMP. STATUS': 'Employment Status',
        'EMP. TYPE': 'If Employed/Self Employment',
        'EDUC LEVEL': 'Educational Attainment',
        'COURSE': 'Course',
        'SKILLS': 'Skills',
        'WORK EXPERIENCE': 'Work Experience',
        'REMARKS': 'Remarks',
        'REG. DATE': 'Registration Date'
    };

    function excelDateToJSDate(serial) {
        if (!serial || isNaN(serial)) return null;
        
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);

        const year = date_info.getFullYear();
        const month = date_info.getMonth() + 1;
        const day = date_info.getDate();

        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
    }

    function processDateFields(data) {
        return data.map(item => {
            const newItem = {...item};
            
            if (newItem.BDATE && typeof newItem.BDATE === 'number') {
                newItem.BDATE = excelDateToJSDate(newItem.BDATE);
            }
            
            if (newItem['REG. DATE'] && typeof newItem['REG. DATE'] === 'number') {
                newItem['REG. DATE'] = excelDateToJSDate(newItem['REG. DATE']);
            }
            
            if (newItem['DATE CREATED'] && typeof newItem['DATE CREATED'] === 'number') {
                newItem['DATE CREATED'] = excelDateToJSDate(newItem['DATE CREATED']);
            }
            
            if (newItem['DATE LAST MODIFIED'] && typeof newItem['DATE LAST MODIFIED'] === 'number') {
                newItem['DATE LAST MODIFIED'] = excelDateToJSDate(newItem['DATE LAST MODIFIED']);
            }
            
            return newItem;
        });
    }
    
    function generateUniqueId() {
        return Date.now().toString();
    }

    
    function parseName(fullName) {
        if (!fullName) return { lastName: 'N/A', givenName: 'N/A', middleName: 'N/A' };
        
        const nameParts = fullName.trim().split(' ');
        let lastName = 'N/A', givenName = 'N/A', middleName = 'N/A';
        
        if (nameParts.length >= 1) {
            givenName = nameParts[0];
        }
        if (nameParts.length >= 2) {
            lastName = nameParts[nameParts.length - 1];
        }
        if (nameParts.length >= 3) {
            middleName = nameParts[1];
        }
        
        return { lastName, givenName, middleName };
    }

    
    function mapExcelData(excelRow) {
        const nameParts = parseName(excelRow['NAME'] || excelRow['Full Name']);
        
        return {
            'ID': excelRow['SRS ID'] || excelRow['ID'] || generateUniqueId(),
            'Last Name': nameParts.lastName,
            'Given Name': nameParts.givenName,
            'Middle Name': nameParts.middleName,
            'Full Name': excelRow['NAME'] || excelRow['Full Name'] || 'N/A',
            'Date of Birth': excelRow['BDATE'] || excelRow['Date of Birth'] || 'N/A',
            'Age': excelRow['AGE'] || excelRow['Age'] || 'N/A',
            'Sex': excelRow['SEX'] || excelRow['Sex'] || 'N/A',
            'Civil Status': excelRow['CIVIL STATUS'] || excelRow['Civil Status'] || 'N/A',
            'Street': excelRow['STREET ADDRESS'] || excelRow['Street'] || 'N/A',
            'Barangay': excelRow['BARANGAY'] || excelRow['Barangay'] || 'N/A',
            'City': excelRow['CITY/MUNICIPALITY'] || excelRow['City'] || 'N/A',
            'Province': excelRow['PROVINCE'] || excelRow['Province'] || 'N/A',
            'Contact No.': excelRow['CELLPHONE'] || excelRow['Contact No.'] || 'N/A',
            'Employment Status': excelRow['EMP. STATUS'] || excelRow['Employment Status'] || 'N/A',
            'If Employed/Self Employment': excelRow['EMP. TYPE'] || excelRow['If Employed/Self Employment'] || 'N/A',
            'Educational Attainment': excelRow['EDUC LEVEL'] || excelRow['Educational Attainment'] || 'N/A',
            'Course': excelRow['COURSE'] || excelRow['Course'] || 'N/A',
            'Skills': excelRow['SKILLS'] || excelRow['Skills'] || 'N/A',
            'Work Experience': excelRow['WORK EXPERIENCE'] || excelRow['Work Experience'] || 'N/A',
            'Sector': excelRow['Sector'] || 'N/A',
            'Program/Services Provided': excelRow['Program/Services Provided'] || 'N/A',
            'Remarks': excelRow['REMARKS'] || excelRow['Remarks'] || 'N/A',
            'Registration Date': excelRow['REG. DATE'] || excelRow['Registration Date'] || new Date().toLocaleDateString()
        };
    }

    function saveDataToLocalStorage(data) {
        try {
            const existingData = JSON.parse(localStorage.getItem('importedData')) || [];
            const combinedData = [...existingData, ...data];
            
            const jsonData = JSON.stringify(combinedData);
            localStorage.setItem('importedData', jsonData);
            
            console.log('Data successfully saved to localStorage:', combinedData);
            return true;
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
            return false;
        }
    }

    
    function showNotification(message, type, notificationElement = elements.notification) {
        if (!notificationElement) return;
        
        notificationElement.textContent = message;
        notificationElement.classList.remove('success', 'error', 'warning');
        notificationElement.classList.add(type);
        notificationElement.style.display = 'block';

        setTimeout(function () {
            notificationElement.style.display = 'none';
        }, 5000);
    }

    function showUploadNotification(message, type) {
        showNotification(message, type, elements.uploadNotification);
    }

    function checkForDuplicates(newApplicants, existingApplicants) {
        const duplicates = [];
        const uniqueNewApplicants = [];
        
        newApplicants.forEach(newApp => {
            let isDuplicate = false;
            
            for (const existingApp of existingApplicants) {
                const nameMatch = newApp.NAME && existingApp.NAME && 
                                 newApp.NAME.toLowerCase() === existingApp.NAME.toLowerCase();
                
                const bdateMatch = newApp.BDATE && existingApp.BDATE && 
                                  newApp.BDATE === existingApp.BDATE;
                
                const phoneMatch = newApp.CELLPHONE && existingApp.CELLPHONE && 
                                  newApp.CELLPHONE === existingApp.CELLPHONE;
                
                const emailMatch = newApp.EMAIL && existingApp.EMAIL && 
                                  newApp.EMAIL.toLowerCase() === existingApp.EMAIL.toLowerCase();
                
                if ((nameMatch && bdateMatch) || (nameMatch && phoneMatch) || (phoneMatch && emailMatch)) {
                    duplicates.push({
                        applicant: newApp,
                        existing: existingApp
                    });
                    isDuplicate = true;
                    break;
                }
            }
            
            if (!isDuplicate) {
                uniqueNewApplicants.push(newApp);
            }
        });
        
        return { duplicates, uniqueNewApplicants };
    }
    
    function loadMainApplicants() {
        try {
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            const validApplicants = savedApplicants.filter(applicant => applicant !== null && applicant !== undefined);
            displayMainApplicants(validApplicants);
        } catch (error) {
            console.error('Error loading applicants:', error);
            displayMainApplicants([]);
        }
    }
    
    function saveMainApplicants(applicants) {
        try {
            const validApplicants = applicants.filter(applicant => applicant !== null && applicant !== undefined);
            localStorage.setItem('mainApplicants', JSON.stringify(validApplicants));
        } catch (error) {
            console.error('Error saving applicants:', error);
        }
    }
    
    function addApplicantRow(tbody, applicant) {
        const row = document.createElement('tr');
        
        const fields = [
            'PESO', 'AREA TYPE', 'AREA CLASS', 'SRS ID', 'NAME', 'BDATE', 'AGE', 'SEX', 'CIVIL STATUS',
            'STREET ADDRESS', 'BARANGAY', 'CITY/MUNICIPALITY', 'PROVINE', 'REGION', 'EMAIL', 'TELEPHONE',
            'CELLPHONE', 'EMP. STATUS', 'EMP. TYPE', 'EDUC LEVEL', 'COURSE', '4Ps', 'PWD', 'DISABILITY',
            'PREFERRED POSITION', 'SKILLS', 'WORK EXPERIENCE', 'OFW', 'COUNTRY', 'FORMER OFW', 'LATEST COUNTRY',
            'REG. DATE', 'REMARKS', 'CREATED BY', 'DATE CREATED', 'LAST MODIFIED BY', 'DATE LAST MODIFIED',
            'username', 'firstname', 'lastname', 'email', 'course1', 'role1'
        ];
        
        fields.forEach(field => {
            const cell = document.createElement('td');
            cell.textContent = applicant[field] || '';
            row.appendChild(cell);
        });
        
        const actionCell = document.createElement('td');
        actionCell.classList.add('action-buttons');
        
        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add('download-btn');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.addEventListener('click', function() {
            exportApplicantToExcel(applicant);
        });
        
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', function() {
            openEditModal(applicant);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', function() {
            deleteApplicant(applicant);
        });
        
        actionCell.appendChild(downloadBtn);
        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
        row.appendChild(actionCell);
        
        tbody.appendChild(row);
    }
    
    function exportApplicantToExcel(applicant) {
        const worksheet = XLSX.utils.json_to_sheet([applicant]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applicant");
        XLSX.writeFile(workbook, `applicant_${applicant['SRS ID'] || 'data'}.xlsx`);
        showNotification('Applicant data exported successfully!', 'success');
    }
    
    function deleteApplicant(applicant) {
        if (confirm('Are you sure you want to delete this applicant?')) {
            const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
            const updatedApplicants = savedApplicants.filter(a => a['SRS ID'] !== applicant['SRS ID']);
            saveMainApplicants(updatedApplicants);
            displayMainApplicants(updatedApplicants);
            showNotification('Applicant deleted successfully!', 'success');
        }
    }
    
    function openEditModal(applicant) {
        console.log("Opening edit modal for applicant:", applicant);
        console.log("Modal element:", elements.editModal);
        
        if (!elements.editModal) return;
        
        const formInputs = elements.editModal.querySelectorAll('input');
        formInputs.forEach(input => {
            input.value = '';
        });
        
        const fieldToIdMap = {
            'PESO': 'edit-peso',
            'AREA TYPE': 'edit-area-type',
            'AREA CLASS': 'edit-area-class',
            'SRS ID': 'edit-srs-id',
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
            'DATE LAST MODIFIED': 'edit-date-last-modified',
            'username': 'edit-username',
            'firstname': 'edit-firstname',
            'lastname': 'edit-lastname',
            'email': 'edit-email',
            'course1': 'edit-course1',
            'role1': 'edit-role1'
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
        
        elements.editModal.style.display = 'block';

        currentEditId = applicant['SRS ID'] || applicant.ID;

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

    function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    let date;
    if (typeof dateString === 'string') {

        if (dateString.includes('/')) {
            const parts = dateString.split('/');
            if (parts.length === 3) {
                date = new Date(parts[2], parts[0] - 1, parts[1]);
            }
        } else if (dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    date = new Date(parts[0], parts[1] - 1, parts[2]);
                } else {
                    date = new Date(parts[2], parts[1] - 1, parts[0]);
                }
            }
        } else {
            date = new Date(dateString);
        }
    } else if (typeof dateString === 'number') {
        date = excelDateToJSDateObject(dateString);
    }
    
    if (date instanceof Date && !isNaN(date)) {
        return date.toISOString().split('T')[0]; 
    }
    
    return '';
}

function excelDateToJSDateObject(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000);
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
                    
                    const processedData = processDateFields(jsonData);
                    
                    const savedApplicants = JSON.parse(localStorage.getItem('mainApplicants')) || [];
                    
                    const { duplicates, uniqueNewApplicants } = checkForDuplicates(processedData, savedApplicants);
                    
                    if (elements.duplicateWarning && duplicates.length > 0) {
                        elements.duplicateWarning.innerHTML = `<strong>Found ${duplicates.length} duplicate(s):</strong> These applicants already exist in the system and will not be added.`;
                        elements.duplicateWarning.style.display = 'block';
                    } else if (elements.duplicateWarning) {
                        elements.duplicateWarning.style.display = 'none';
                    }
                    
                    if (uniqueNewApplicants.length === 0) {
                        showUploadNotification('The applicant/s in the file was already on the list . No new applicants added.', 'warning');
                        return;
                    }
                    
                    uniqueNewApplicants.forEach(applicant => {
                        if (!applicant['SRS ID']) {
                            applicant['SRS ID'] = generateUniqueId();
                        }
                        
                        applicant['DATE CREATED'] = new Date().toLocaleString();
                        applicant['DATE LAST MODIFIED'] = new Date().toLocaleString();
                        
                        savedApplicants.push(applicant);
                    });
                    
                    saveMainApplicants(savedApplicants);
                    displayMainApplicants(savedApplicants);
                    
                    showUploadNotification(`Added ${uniqueNewApplicants.length} new applicant(s). ${duplicates.length} duplicate(s) found.`, 'success');
                    if (elements.uploadFileName) elements.uploadFileName.value = '';
                    if (elements.addBtn) elements.addBtn.disabled = true;
                    if (elements.uploadFileInput) elements.uploadFileInput.value = '';
                    
                } catch (error) {
                    console.error('Error processing Excel file:', error);
                    showUploadNotification('Error processing Excel file: ' + error.message, 'error');
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
                    
                    const importedData = jsonData.map(row => mapExcelData(row));
                    
                    if (saveDataToLocalStorage(importedData)) {
                        displayImportedData(importedData);
                        showNotification('Data imported successfully!', 'success');
                        if (elements.fileName) elements.fileName.value = '';
                        if (elements.importBtn) elements.importBtn.disabled = true;
                        if (elements.fileInput) elements.fileInput.value = '';
                    } else {
                        showNotification('Failed to save data to local storage.', 'error');
                    }
                    
                } catch (error) {
                    console.error('Error processing Excel file:', error);
                    showNotification('Error processing Excel file: ' + error.message, 'error');
                }
            };
            
            reader.onerror = function() {
                showNotification('Error reading file.', 'error');
            };
            
            reader.readAsArrayBuffer(file);
        });
    }
    
    function displayImportedData(data) {
        if (!elements.importedTable) return;
        
        const tbody = elements.importedTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const allImportedData = JSON.parse(localStorage.getItem('importedData')) || [];
        
        allImportedData.forEach(item => {
            const row = document.createElement('tr');
            
            const fields = [
                'ID', 'Last Name', 'Given Name', 'Middle Name', 'Full Name', 'Date of Birth', 'Age', 'Sex',
                'Civil Status', 'Street', 'Barangay', 'City', 'Province', 'Contact No.', 'Employment Status',
                'If Employed/Self Employment', 'Educational Attainment', 'Course', 'Skills', 'Work Experience',
                'Sector', 'Program/Services Provided', 'Remarks', 'Registration Date'
            ];
            
            fields.forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = item[field] || 'N/A';
                row.appendChild(cell);
            });
            
            const actionCell = document.createElement('td');
            actionCell.classList.add('action-buttons');
            
            const downloadBtn = document.createElement('button');
            downloadBtn.classList.add('download-btn');
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.addEventListener('click', function() {
                exportRowToExcel(item);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', function() {
                deleteRow(row, item);
            });
            
            actionCell.appendChild(downloadBtn);
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            
            tbody.appendChild(row);
        });
    }
    
    function exportRowToExcel(item) {
        const worksheet = XLSX.utils.json_to_sheet([item]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applicant");
        XLSX.writeFile(workbook, `applicant_${item.ID}.xlsx`);
        showNotification('Row exported successfully!', 'success');
    }
    
    function deleteRow(row, item) {
        if (confirm('Are you sure you want to delete this row?')) {
            if (!elements.importedTable) return;
            
            const tbody = elements.importedTable.querySelector('tbody');
            if (tbody) tbody.removeChild(row);
            
            const importedData = JSON.parse(localStorage.getItem('importedData')) || [];
            const updatedData = importedData.filter(data => data.ID !== item.ID);
            localStorage.setItem('importedData', JSON.stringify(updatedData));
            
            showNotification('Row deleted successfully!', 'success');
        }
    }
    
    if (elements.resetDataBtn) {
        elements.resetDataBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all imported data?')) {
                localStorage.removeItem('importedData');
                if (elements.importedTable) {
                    const tbody = elements.importedTable.querySelector('tbody');
                    if (tbody) tbody.innerHTML = '';
                }
                showNotification('Imported data has been reset.', 'success');
            }
        });
    }
    
    if (elements.clearAllApplicantsBtn) {
        elements.clearAllApplicantsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all applicants? This action cannot be undone.')) {
                localStorage.removeItem('mainApplicants');
                if (elements.mainApplicantTable) {
                    const tbody = elements.mainApplicantTable.querySelector('tbody');
                    if (tbody) tbody.innerHTML = '';
                }
                showNotification('All applicants have been cleared.', 'success');
            }
        });
    }
    
    loadMainApplicants();
    
    const savedData = localStorage.getItem('importedData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            displayImportedData(parsedData);
        } catch (error) {
            console.error('Error parsing saved data:', error);
        }
    }
});