// User Dashboard Logic

document.addEventListener('DOMContentLoaded', function() {
    // Load user info
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    document.getElementById('userInfo').textContent = `Username: ${user.username || ''}, Balance: ₹${user.balance || 0}`;

    // Add funds
    document.getElementById('addFundsForm').onsubmit = function(e) {
        e.preventDefault();
        const amount = Number(document.getElementById('addFundsAmount').value);
        const pin = document.getElementById('addFundsPin').value;
        const msg = document.getElementById('addFundsMessage');
        if (pin !== user.pin) {
            msg.style.color = 'red';
            msg.textContent = 'Incorrect PIN!';
            return;
        }
        user.balance = (user.balance || 0) + amount;
        localStorage.setItem('currentUser', JSON.stringify(user));
        msg.style.color = 'green';
        msg.textContent = `Funds added: ₹${amount}. New balance: ₹${user.balance}`;
        document.getElementById('userInfo').textContent = `Username: ${user.username}, Balance: ₹${user.balance}`;
    };

    // Transaction history (demo)
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const tbody = document.getElementById('transactionsTable').querySelector('tbody');
    tbody.innerHTML = transactions.filter(t => t.username === user.username).map(t => `<tr><td>${t.date}</td><td>₹${t.amount}</td><td>${t.status}</td></tr>`).join('');

    // Fraud alerts (demo)
    const alerts = JSON.parse(localStorage.getItem('fraudAlerts') || '[]');
    document.getElementById('fraudAlertsList').innerHTML = alerts.filter(a => a.username === user.username).map(a => `<li>${a.message}</li>`).join('');

    // Logout
    document.getElementById('logoutBtn').onclick = function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };
});
