// ===== Auth State =====
const API_BASE = window.location.origin;
let currentUser = null;

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        fetchProfile(token);
    }
});

// ===== Modal Functions =====
function openAuthModal(type) {
    document.getElementById('authModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    switchAuth(type || 'login');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.body.style.overflow = '';
    clearErrors();
}

function switchAuth(type) {
    document.getElementById('loginForm').style.display = type === 'login' ? 'block' : 'none';
    document.getElementById('registerForm').style.display = type === 'register' ? 'block' : 'none';
    clearErrors();
}

function clearErrors() {
    document.getElementById('loginError').textContent = '';
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('registerError').textContent = '';
    document.getElementById('registerError').style.display = 'none';
}

function showError(elementId, message) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.style.display = 'block';
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
    } else {
        input.type = 'password';
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    }
}

// ===== Login =====
async function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginSubmitBtn');

    if (!email || !password) {
        showError('loginError', 'Please enter email and password.');
        return;
    }

    btn.textContent = 'Logging in...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            showError('loginError', data.error || 'Login failed.');
            btn.textContent = 'Login';
            btn.disabled = false;
            return;
        }

        // Success
        localStorage.setItem('authToken', data.token);
        currentUser = data.user;
        updateUIForLoggedIn(data.user);
        closeAuthModal();
        btn.textContent = 'Login';
        btn.disabled = false;
    } catch (err) {
        // Server not available — redirect to WhatsApp
        closeAuthModal();
        window.open('https://wa.me/971542040298?text=Hello%20Upali%20Immigration%20Services%2C%20I%20would%20like%20to%20register%20or%20enquire%20about%20your%20services.', '_blank');
        btn.textContent = 'Login';
        btn.disabled = false;
    }
}

// ===== Register =====
async function handleRegister() {
    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const destinationCountry = document.getElementById('regDestination').value;
    const jobType = document.getElementById('regJobType').value;
    const btn = document.getElementById('registerSubmitBtn');

    if (!firstName || !lastName || !email || !password) {
        showError('registerError', 'Please fill in all required fields.');
        return;
    }

    if (password.length < 6) {
        showError('registerError', 'Password must be at least 6 characters.');
        return;
    }

    btn.textContent = 'Creating Account...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, phone, password, destinationCountry, jobType })
        });

        const data = await res.json();

        if (!res.ok) {
            showError('registerError', data.error || 'Registration failed.');
            btn.textContent = 'Create Account';
            btn.disabled = false;
            return;
        }

        // Success
        localStorage.setItem('authToken', data.token);
        currentUser = data.user;
        updateUIForLoggedIn(data.user);
        closeAuthModal();
        btn.textContent = 'Create Account';
        btn.disabled = false;
    } catch (err) {
        // Server not available — redirect to WhatsApp
        closeAuthModal();
        window.open(`https://wa.me/971542040298?text=Hello%20Upali%20Immigration%20Services%2C%20I%20would%20like%20to%20register.%20My%20name%20is%20${encodeURIComponent(firstName + ' ' + lastName)}.`, '_blank');
        btn.textContent = 'Create Account';
        btn.disabled = false;
    }
}

// ===== Fetch Profile =====
async function fetchProfile(token) {
    try {
        const res = await fetch(`${API_BASE}/api/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
            localStorage.removeItem('authToken');
            return;
        }

        const data = await res.json();
        currentUser = data.user;
        updateUIForLoggedIn(data.user);
    } catch (err) {
        // Server might not be running, silently fail
    }
}

// ===== Update UI =====
function updateUIForLoggedIn(user) {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('userMenu').style.display = 'block';

    const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();
    document.getElementById('userInitials').textContent = initials;
    document.getElementById('dropdownName').textContent = `${user.firstName} ${user.lastName}`;
    document.getElementById('dropdownEmail').textContent = user.email;
}

function updateUIForLoggedOut() {
    document.getElementById('loginBtn').style.display = 'inline-flex';
    document.getElementById('userMenu').style.display = 'none';
    currentUser = null;
}

// ===== User Dropdown =====
document.getElementById('userAvatarBtn').addEventListener('click', () => {
    document.getElementById('userDropdown').classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
});

// ===== Dashboard =====
function openDashboard() {
    document.getElementById('userDropdown').classList.remove('show');
    if (!currentUser) return;

    document.getElementById('dashName').textContent = currentUser.firstName;
    document.getElementById('dashFullName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('dashEmail').textContent = currentUser.email;
    document.getElementById('dashDestination').textContent = currentUser.destinationCountry
        ? currentUser.destinationCountry.charAt(0).toUpperCase() + currentUser.destinationCountry.slice(1)
        : 'Not selected';
    document.getElementById('dashJobType').textContent = currentUser.jobType === 'professional'
        ? 'Professional (€4,000/mo)'
        : 'Blue Collar (€2,500/mo)';
    document.getElementById('dashStatus').textContent = currentUser.status
        ? currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)
        : 'Pending';

    const createdDate = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) : '-';
    document.getElementById('dashCreatedAt').textContent = createdDate;

    document.getElementById('dashboardModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDashboard() {
    document.getElementById('dashboardModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Logout =====
function logout() {
    localStorage.removeItem('authToken');
    updateUIForLoggedOut();
    document.getElementById('userDropdown').classList.remove('show');
}

// ===== Close modals on overlay click =====
document.getElementById('authModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('authModal')) closeAuthModal();
});

document.getElementById('dashboardModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('dashboardModal')) closeDashboard();
});

// ===== Enter key support =====
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
});

document.getElementById('regPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleRegister();
})