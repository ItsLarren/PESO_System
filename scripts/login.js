document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('login-error');

    const validCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'peso', password: 'peso2024' },
        { username: 'user', password: 'user123' }
    ];

    // Auto-redirect check
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html'; // Changed from dashboard.html
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );

        if (isValid) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            
            window.location.href = 'index.html'; // Changed from dashboard.html
        } else {
            showError('Invalid username or password');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }

    usernameInput.addEventListener('focus', clearError);
    passwordInput.addEventListener('focus', clearError);

    function clearError() {
        errorMessage.style.display = 'none';
    }
});