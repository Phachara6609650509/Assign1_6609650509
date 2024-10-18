function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    }
}

function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.getElementById('message');
    
    messageElement.innerHTML = `<div class="${type}-message">
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        ${message}
    </div>`;
    messageContainer.classList.remove('hide');
}

function submitLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userRole = document.getElementById('userRole').value;
    
    // Validate fields
    if (!username || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    // Check role selection
    if (userRole === 'selected') {
        showMessage('Please select your role', 'error');
        return;
    }

    // Handle lecturer role
    if (userRole === 'lecturer') {
        showMessage('Access denied. This system is for students only.', 'error');
        return;
    }

    // Proceed with student login
    fetch('https://restapi.tu.ac.th/api/v1/auth/Ad/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Application-key': 'TUbb6fcaa8f4cbc9e0535d13d7afd727a9cb41ae3b68a6eaa4a152e83de1be51a7a6fb9a8239b5dd82ba1901f90213695d'
        },
        body: JSON.stringify({ "UserName": username, "PassWord": password })
    })
    .then(response => response.json())
    .then(data => {
        displayLoginResult(data);
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred during login', 'error');
    });
}

function displayLoginResult(data) {
    const messageContainer = document.getElementById('message-container');
    const messageElement = document.getElementById('message');
    
    if (!data.status) {
        showMessage('Invalid credentials. Please try again.', 'error');
        return;
    }

    // Create formatted HTML for successful login
    const resultHTML = `
        <div class="success-message">Login Successful!</div>
        <div class="result-row">
            <span class="result-label">TU Status:</span> 
            <span class="result-value">${data.tu_status || 'N/A'}</span>
        </div>
         <div class="result-row">
            <span class="result-label">Username:</span> 
            <span class="result-value">${data.username || 'N/A'}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Name (TH):</span> 
            <span class="result-value">${data.displayname_th || 'N/A'}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Name (EN):</span> 
            <span class="result-value">${data.displayname_en || 'N/A'}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Email:</span> 
            <span class="result-value">${data.email || 'N/A'}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Department:</span> 
            <span class="result-value">${data.department || 'N/A'}</span>
        </div>
        <div class="result-row">
            <span class="result-label">Faculty:</span> 
            <span class="result-value">${data.faculty || 'N/A'}</span>
        </div>
    `;

    messageElement.innerHTML = resultHTML;
    messageContainer.classList.remove('hide');
}
