document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('login-error');

    // Default credentials (you can change these)
    const validCredentials = [
        { username: 'admin', password: 'admin123' },
        { username: 'peso', password: 'peso2024' },
        { username: 'user', password: 'user123' }
    ];

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'index.html';
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate credentials
        const isValid = validCredentials.some(cred => 
            cred.username === username && cred.password === password
        );

        if (isValid) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('currentUser', username);
            
            // Redirect to main system
            window.location.href = 'index.html';
        } else {
            showError('Invalid username or password');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        // Clear error after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }

    // Add some interactivity
    usernameInput.addEventListener('focus', clearError);
    passwordInput.addEventListener('focus', clearError);

    function clearError() {
        errorMessage.style.display = 'none';
    }
});