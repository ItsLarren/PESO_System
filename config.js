// config.js
const CONFIG = {
    table: {
        pageSize: 50,
        maxExportRows: 10000,
        chunkSize: 100
    },
    sync: {
        retryAttempts: 3,
        retryDelay: 1000,
        backupInterval: 300000
    },
    validation: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['.xlsx', '.xls']
    }
};