// Enhanced Utilities for CPESO System
class CPESOUtilities {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static withErrorHandling(fn, errorMessage, fallback = null) {
        return function(...args) {
            try {
                return fn.apply(this, args);
            } catch (error) {
                console.error(`${errorMessage}:`, error);
                showNotification(errorMessage, 'error');
                return fallback;
            }
        };
    }

    static formatDate(date) {
        if (!date) return 'N/A';
        try {
            const d = new Date(date);
            return d.toLocaleDateString('en-PH');
        } catch {
            return date;
        }
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
        return re.test(phone);
    }

    static generateId(prefix = 'SRS') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    static exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            showNotification('No data to export', 'error');
            return;
        }

        try {
            const headers = Object.keys(data[0]);
            const csvContent = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => 
                        `"${String(row[header] || '').replace(/"/g, '""')}"`
                    ).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showNotification('Data exported successfully', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showNotification('Error exporting data', 'error');
        }
    }
}

// Enhanced Data Manager
class DataManager {
    constructor() {
        this.backupKey = 'cpeso_backup';
        this.maxBackups = 5;
    }

    createBackup() {
        try {
            const backup = {
                timestamp: new Date().toISOString(),
                applicants: JSON.parse(localStorage.getItem('mainApplicants') || '[]'),
                imported: JSON.parse(localStorage.getItem('importedData') || '[]'),
                zeroUnemployment: JSON.parse(localStorage.getItem('zeroUnemploymentApplicants') || '[]')
            };

            const backups = JSON.parse(localStorage.getItem(this.backupKey) || '[]');
            backups.unshift(backup);

            // Keep only recent backups
            if (backups.length > this.maxBackups) {
                backups.splice(this.maxBackups);
            }

            localStorage.setItem(this.backupKey, JSON.stringify(backups));
            console.log('Backup created successfully');
            return true;
        } catch (error) {
            console.error('Backup creation failed:', error);
            return false;
        }
    }

    restoreBackup(backupIndex = 0) {
        try {
            const backups = JSON.parse(localStorage.getItem(this.backupKey) || '[]');
            if (backups[backupIndex]) {
                const backup = backups[backupIndex];
                localStorage.setItem('mainApplicants', JSON.stringify(backup.applicants || []));
                localStorage.setItem('importedData', JSON.stringify(backup.imported || []));
                localStorage.setItem('zeroUnemploymentApplicants', JSON.stringify(backup.zeroUnemployment || []));
                
                console.log('Backup restored successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Backup restoration failed:', error);
            return false;
        }
    }

    getBackups() {
        return JSON.parse(localStorage.getItem(this.backupKey) || '[]');
    }

    clearBackups() {
        localStorage.removeItem(this.backupKey);
    }
}

// Enhanced Error Handler
class ErrorHandler {
    static init() {
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }

    static handleGlobalError(event) {
        console.error('Global error:', event.error);
        this.showErrorNotification('An unexpected error occurred');
    }

    static handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        this.showErrorNotification('An operation failed');
    }

    static showErrorNotification(message) {
        // Use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: #f44336;
                color: white;
                border-radius: 4px;
                z-index: 10000;
                font-family: Arial, sans-serif;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 5000);
        }
    }
}

// Enhanced Error Handler with Home Dashboard support
class ErrorHandler {
    static init() {
        // Remove any existing error handlers to prevent duplicates
        window.removeEventListener('error', this.handleGlobalError);
        window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
        
        // Add new error handlers
        window.addEventListener('error', this.handleGlobalError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
        
        console.log('Error handler initialized');
    }

    static handleGlobalError(event) {
        console.error('Global error:', event.error);
        console.error('Error details:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
        
        // Don't show notification for null errors (usually harmless)
        if (event.error !== null && event.message !== 'null') {
            this.showErrorNotification('An unexpected error occurred');
        }
    }

    static handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        this.showErrorNotification('An operation failed');
        
        // Prevent the default handling (optional)
        event.preventDefault();
    }

    static showErrorNotification(message) {
        // Use available notification systems
        if (window.homeDashboard && typeof window.homeDashboard.showNotification === 'function') {
            window.homeDashboard.showNotification(message, 'error');
        } else if (typeof showNotification === 'function') {
            showNotification(message, 'error');
        } else {
            // Fallback notification
            this.showFallbackNotification(message);
        }
    }

    static showFallbackNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: #f44336;
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
        }, 5000);
    }
}

// Initialize error handling
ErrorHandler.init();