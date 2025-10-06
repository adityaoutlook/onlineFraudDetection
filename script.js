    // Check Balance section logic
    var pinFormEl = document.getElementById('pinForm');
    if (pinFormEl) {
        pinFormEl.onsubmit = function(e) {
            e.preventDefault();
            const pin = document.getElementById('pin').value;
            const msg = document.getElementById('pinMessage');
            if (pin === validUser.pin) {
                msg.style.color = 'green';
                msg.textContent = `Your balance is $${userBalance}`;
            } else {
                msg.style.color = '#d32f2f';
                msg.textContent = 'Incorrect PIN!';
            }
        };
    }
    // Check Balance section logic
    const pinForm = document.getElementById('pinForm');
    if (pinForm) {
        pinForm.onsubmit = function(e) {
            e.preventDefault();
            const pin = document.getElementById('pin').value;
            const msg = document.getElementById('pinMessage');
            if (pin === validUser.pin) {
                msg.style.color = 'green';
                msg.textContent = `Your balance is $${userBalance}`;
            } else {
                msg.style.color = '#d32f2f';
                msg.textContent = 'Incorrect PIN!';
            }
        };
    }
// Simple login, PIN, payment, and file fraud check logic
let loginAttempts = 0;
const maxAttempts = 3;
// User registration and storage (localStorage for demo)
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[{"username":"admin","password":"admin123","pin":"0000","phone":"","balance":10000,"role":"admin","blacklisted":false},{"username":"user","password":"pass","pin":"1234","phone":"","balance":5000,"role":"user","blacklisted":false}]');
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
// Ensure there's at least one admin account in localStorage for demo/testing
function ensureDefaultAdmin() {
    try {
        let users = getUsers();
        if (!Array.isArray(users)) users = [];
        const hasAdmin = users.some(u => u && u.role === 'admin');
        if (!hasAdmin) {
            const admin = { username: 'admin', password: 'admin123', pin: '0000', phone: '', balance: 10000, role: 'admin', blacklisted: false };
            users.unshift(admin);
            saveUsers(users);
        }
    } catch (err) {
        // ignore
    }
}
// call early so admin exists
ensureDefaultAdmin();
let validUser = getUsers()[0];

// Store session in localStorage
function setSession(loggedIn) {
    localStorage.setItem('loggedIn', loggedIn ? '1' : '0');
}
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === '1';
}

// Registration logic
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').onsubmit = function(e) {
        e.preventDefault();
        const regUser = document.getElementById('regUsername').value.trim();
        const regPass = document.getElementById('regPassword').value;
        const regPin = document.getElementById('regPin').value;
        const regPhone = document.getElementById('regPhone') ? document.getElementById('regPhone').value.trim() : '';
        // read role radio buttons if present
        let regRole = 'user';
        try {
            const roleEl = document.querySelector('input[name="regRole"]:checked');
            if (roleEl) regRole = roleEl.value;
        } catch (err) {}
        const msg = document.getElementById('registerMessage');
        let users = getUsers();
        if (users.some(u => u.username === regUser)) {
            msg.style.color = '#d32f2f';
            msg.textContent = 'Username already exists!';
            return;
        }
        if (!/^\d{4}$/.test(regPin)) {
            msg.style.color = '#d32f2f';
            msg.textContent = 'PIN must be 4 digits!';
            return;
        }
    const newUser = { username: regUser, password: regPass, pin: regPin, phone: regPhone || '', balance: 5000, role: regRole || 'user', blacklisted: false };
        users.push(newUser);
        saveUsers(users);
        // Auto-login after registration
        validUser = newUser;
        setSession(true);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        msg.style.color = 'green';
        msg.textContent = 'Registration successful! Redirecting to dashboard...';
        setTimeout(() => window.location.href = 'dashboard.html', 900);
    };
}

// Login logic
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = function(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        let users = getUsers();
        const found = users.find(u => u.username === user && u.password === pass);
        if (found) {
            validUser = found;
            setSession(true);
            localStorage.setItem('currentUser', JSON.stringify(found));
            if (found.role === 'admin' && found.password === 'admin123') {
                // For admin, only show user listing and block/unblock system
                localStorage.setItem('adminView', 'true');
                window.location.href = 'admin_dashboard.html';
            } else {
                localStorage.removeItem('adminView');
                window.location.href = 'dashboard.html';
            }
        } else {
            loginAttempts++;
            if (loginAttempts >= maxAttempts) {
                document.getElementById('loginMessage').textContent = 'Account locked after 3 failed attempts!';
                document.getElementById('loginForm').querySelectorAll('input,button').forEach(el => el.disabled = true);
            } else {
                document.getElementById('loginMessage').textContent = `Incorrect credentials. Attempts left: ${maxAttempts - loginAttempts}`;
            }
        }
    };
}


// Dashboard logic with sidebar navigation
if (window.location.pathname.includes('dashboard.html')) {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
    } else {
        // Restore validUser from localStorage if missing
        if (!validUser || !validUser.username) {
            const stored = localStorage.getItem('currentUser');
            if (stored) {
                validUser = JSON.parse(stored);
            }
        }
    }
    let userBalance = validUser && validUser.balance ? validUser.balance : 0;
    let transactions = [];
    let fraudAlerts = [];

    // Sidebar navigation
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const sections = document.querySelectorAll('.feature-section');
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            sections.forEach(sec => sec.style.display = 'none');
            const section = document.getElementById(this.dataset.section);
            if (section) section.style.display = 'block';
        });
    });

    // Show dashboard section by default (if overviewSection exists, prefer it)
    const overviewEl = document.getElementById('overviewSection');
    if (overviewEl) {
        overviewEl.style.display = 'block';
    } else {
        const dashBtn = document.querySelector('.sidebar-item[data-section="dashboardSection"]');
        if (dashBtn) dashBtn.click();
    }

    // Overview Chart (using Chart.js)
    if (window.Chart && document.getElementById('overviewChart')) {
        const ctx = document.getElementById('overviewChart').getContext('2d');
        window.overviewChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Legit', 'Suspicious', 'Fraud'],
                datasets: [{
                    label: 'Transactions',
                    data: [12, 3, 1],
                    backgroundColor: ['#1976d2', '#ffb300', '#d32f2f']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Transaction Overview' }
                }
            }
        });
    }

    // Populate user info panel and enforce block rules
    function populateUserInfo() {
        const nameEl = document.getElementById('userDisplayName');
        const phoneEl = document.getElementById('userPhone');
        const balEl = document.getElementById('userBalanceDisplay');
        const roleEl = document.getElementById('userRoleDisplay');
        const blockedEl = document.getElementById('userBlockedDisplay');
        if (nameEl) nameEl.textContent = validUser.username || 'User';
        if (phoneEl) phoneEl.textContent = validUser.phone ? validUser.phone : 'Phone not set';
        if (balEl) balEl.textContent = `Balance: ₹${userBalance}`;
        if (roleEl) roleEl.textContent = `Role: ${validUser.role || 'user'}`;
        if (validUser.blacklisted) {
            if (blockedEl) blockedEl.style.display = 'block';
            // Disable payment and add funds forms/buttons
            const payBtn = document.querySelector('#paymentForm button[type="submit"]');
            const addBtn = document.querySelector('#addFundsForm button[type="submit"]');
            if (payBtn) payBtn.disabled = true;
            if (addBtn) addBtn.disabled = true;
            const paymentMsg = document.getElementById('paymentMessage');
            const addMsg = document.getElementById('addFundsMessage');
            if (paymentMsg) { paymentMsg.style.color = '#d32f2f'; paymentMsg.textContent = 'Account blocked. Cannot make payments.'; }
            if (addMsg) { addMsg.style.color = '#d32f2f'; addMsg.textContent = 'Account blocked. Cannot add funds.'; }
        } else {
            if (blockedEl) blockedEl.style.display = 'none';
        }
    }

    // Dashboard section
    function updateDashboard() {
        // if an external script set window.userBalance/currentUser, sync it
        if (typeof window.userBalance !== 'undefined') {
            userBalance = Number(window.userBalance);
        }
        if (typeof window.validUser !== 'undefined') {
            validUser = window.validUser;
        }
        const bal = document.getElementById('dashboardBalance');
        if (bal) bal.textContent = `$${userBalance}`;
        // Show fraud alerts if any
        const alertsBox = document.getElementById('dashboardAlerts');
        if (alertsBox) {
            if (fraudAlerts.length > 0) {
                alertsBox.style.display = 'block';
                alertsBox.innerHTML = fraudAlerts.map(a => `<div>${a}</div>`).join('');
            } else {
                alertsBox.style.display = 'none';
            }
        }
    }
    updateDashboard();
    populateUserInfo();

    // If current user is admin, show admin dashboard panel and render users there
    const adminPanel = document.getElementById('adminDashboardPanel');
    const projectDesc = document.querySelector('.project-desc');
    if (validUser && validUser.role === 'admin') {
        if (adminPanel) adminPanel.style.display = '';
        if (projectDesc) projectDesc.style.display = 'none';
        // render into top panel
        renderAdminUsers(true);
    } else {
        if (adminPanel) adminPanel.style.display = 'none';
        if (projectDesc) projectDesc.style.display = '';
    }

    // Admin utilities
    function showAdminNavIfNeeded() {
        const adminNav = document.querySelector('.sidebar-item[data-section="adminSection"]');
        if (adminNav) {
            if (validUser && validUser.role === 'admin') {
                adminNav.style.display = '';
            } else {
                adminNav.style.display = 'none';
            }
        }
    }

    function renderAdminUsers(targetTop) {
        // targetTop === true => render into adminPanel at top of dashboard
        const countEl = targetTop ? document.getElementById('adminUserCountTop') : document.getElementById('adminUserCount');
        const listEl = targetTop ? document.getElementById('adminUsersListTop') : document.getElementById('adminUsersList');
        if (!listEl || !countEl) return;
        const all = getUsers().filter(u => u && u.username);
        countEl.textContent = `Total registered users: ${all.length}`;
        if (all.length === 0) {
            listEl.innerHTML = '<div>No users registered.</div>';
            return;
        }
        listEl.innerHTML = all.map(u => {
            const status = u.blacklisted ? '<span style="color:#d32f2f;font-weight:700;">Blocked</span>' : '<span style="color:green;">Active</span>';
            const actionLabel = u.blacklisted ? 'Unblock' : 'Block';
            const btnColor = u.blacklisted ? '#388e3c' : '#d32f2f';
            return `<div style="display:flex;align-items:center;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #f3f3f3;">
                        <div style="display:flex;flex-direction:column;">
                            <div style="font-weight:600">${u.username} ${u.role ? '('+u.role+')' : ''}</div>
                            <div style="color:#666;font-size:0.95rem">${u.phone || 'No phone'} • ${status}</div>
                        </div>
                        <div>
                            <button class="admin-block-btn" data-user="${u.username}" style="padding:0.35rem 0.6rem;border-radius:4px;border:none;background:${btnColor};color:#fff;cursor:pointer;">${actionLabel}</button>
                        </div>
                    </div>`;
        }).join('');
        // attach handlers
        document.querySelectorAll('.admin-block-btn').forEach(btn => {
            btn.onclick = function() {
                const username = this.dataset.user;
                toggleBlockUser(username);
            };
        });
    }

    function toggleBlockUser(username) {
        const all = getUsers();
        const idx = all.findIndex(x => x.username === username);
        if (idx === -1) return;
        all[idx].blacklisted = !all[idx].blacklisted;
        saveUsers(all);
        // if current user changed, update validUser/localStorage
        if (validUser && validUser.username === username) {
            validUser.blacklisted = all[idx].blacklisted;
            localStorage.setItem('currentUser', JSON.stringify(validUser));
        }
        renderAdminUsers();
        populateUserInfo();
    }

    // show admin nav for admins and render table when admin section is visible
    showAdminNavIfNeeded();
    const adminNavBtn = document.querySelector('.sidebar-item[data-section="adminSection"]');
    if (adminNavBtn) {
        adminNavBtn.addEventListener('click', function() {
            renderAdminUsers();
        });
    }

    // Payment (with PIN) and transaction history
    function renderTransactions() {
        const tableBody = document.getElementById('transactionsTableBody');
        if (!tableBody) return;
        if (transactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">No transactions yet.</td></tr>';
        } else {
            tableBody.innerHTML = transactions.map(t => {
                // t should be an object, but legacy code uses string. Let's support both.
                if (typeof t === 'string') {
                    return `<tr><td colspan='6'>${t}</td></tr>`;
                } else {
                    return `<tr>
                        <td>${t.date || ''}</td>
                        <td>₹${t.amount || ''}</td>
                        <td>${t.riskScore || ''}</td>
                        <td>${t.status || ''}</td>
                        <td>${t.device || ''}</td>
                        <td>${t.location || ''}</td>
                    </tr>`;
                }
            }).join('');
        }
    }
    renderTransactions();
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.onsubmit = function(e) {
            e.preventDefault();
            if (validUser && validUser.blacklisted) {
                const msg = document.getElementById('paymentMessage');
                if (msg) { msg.style.color = '#d32f2f'; msg.textContent = 'Account is blocked. Payments disabled.'; }
                return;
            }
            const amount = parseFloat(document.getElementById('amount').value);
            const payPin = document.getElementById('payPin').value;
            const msg = document.getElementById('paymentMessage');
            if (payPin !== validUser.pin) {
                msg.style.color = '#d32f2f';
                msg.textContent = 'Incorrect PIN!';
            } else if (amount > userBalance) {
                msg.style.color = '#d32f2f';
                msg.textContent = 'Insufficient funds!';
            } else {
                userBalance -= amount;
                // persist new balance to validUser and users list
                validUser.balance = userBalance;
                try {
                    const all = getUsers();
                    const idx = all.findIndex(u => u.username === validUser.username);
                    if (idx !== -1) {
                        all[idx].balance = userBalance;
                        saveUsers(all);
                    }
                    localStorage.setItem('currentUser', JSON.stringify(validUser));
                } catch (err) {
                    // ignore storage errors
                }
                msg.style.color = 'green';
                msg.textContent = `Payment of $${amount} successful! New balance: $${userBalance}`;
                const now = new Date();
                transactions.unshift({
                    date: now.toLocaleString(),
                    amount: amount,
                    riskScore: '-',
                    status: 'Paid',
                    device: validUser.deviceInfo || '',
                    location: validUser.location || ''
                });
                if (transactions.length > 10) transactions.length = 10;
                renderTransactions();
                updateDashboard();
                // Simulate fraud check (placeholder)
                const fraudProb = Math.random();
                if (fraudProb > 0.8) {
                    fraudAlerts.unshift({
                        type: 'Fraud',
                        message: `${now.toLocaleString()}: Payment of $${amount} blocked (fraud detected)`,
                        username: validUser.username
                    });
                } else if (fraudProb > 0.5) {
                    fraudAlerts.unshift({
                        type: 'Suspicious',
                        message: `${now.toLocaleString()}: Payment of $${amount} flagged for review (suspicious)`,
                        username: validUser.username
                    });
                }
                if (fraudAlerts.length > 10) fraudAlerts.length = 10;
                localStorage.setItem('fraudAlerts', JSON.stringify(fraudAlerts));
                updateDashboard();
                renderFraudAlerts();
            }
        };
    }

    // Transaction history section
    function renderFraudAlerts() {
        const list = document.getElementById('fraudAlertsList');
        if (!list) return;
        list.innerHTML = fraudAlerts.length === 0
            ? '<li>No fraud alerts.</li>'
            : fraudAlerts.map(a => `<li><strong>${a.type || 'Alert'}:</strong> ${a.message}</li>`).join('');
    }
    renderFraudAlerts();

    // File upload fraud check
    const fileForm = document.getElementById('fileForm');
    if (fileForm) {
        fileForm.onsubmit = function(e) {
            e.preventDefault();
            const file = document.getElementById('fraudFile').files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function(evt) {
                const text = evt.target.result;
                // Simple check: if file contains 'fraud' in any row, mark as fraud
                const msg = document.getElementById('fileMessage');
                if (/fraud/i.test(text)) {
                    msg.style.color = '#d32f2f';
                    msg.textContent = 'Fraudulent payments detected in file!';
                } else {
                    msg.style.color = 'green';
                    msg.textContent = 'All payments in file are legit!';
                }
            };
            reader.readAsText(file);
        };
    }

    // Logout system
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            setSession(false);
            window.location.href = 'index.html';
        };
    }

    // Top right logout button
    const logoutBtnTop = document.getElementById('logoutBtnTop');
    if (logoutBtnTop) {
        logoutBtnTop.onclick = function() {
            setSession(false);
            window.location.href = 'index.html';
        };
    }
}
