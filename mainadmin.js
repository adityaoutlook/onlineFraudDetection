// Main Admin Dashboard JS
// Demo logic using localStorage

document.addEventListener('DOMContentLoaded', function() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const totalUsers = users.filter(u => u.role === 'user').length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalTransactions = 0; // Replace with actual transaction count if available
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalAdmins').textContent = totalAdmins;
    document.getElementById('totalTransactions').textContent = totalTransactions;

    // Populate all users table
    const userTableBody = document.getElementById('mainAdminUserTable').querySelector('tbody');
    userTableBody.innerHTML = '';
    users.filter(u => u.role === 'user').forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${user.username}</td><td>${user.username}</td><td>${user.role}</td><td>${user.blacklisted ? 'Blocked' : 'Active'}</td><td><button onclick="toggleBlock('${user.username}', 'user')">${user.blacklisted ? 'Unblock' : 'Block'}</button></td>`;
        userTableBody.appendChild(tr);
    });

    // Populate all admins table
    const adminTableBody = document.getElementById('mainAdminAdminTable').querySelector('tbody');
    adminTableBody.innerHTML = '';
    users.filter(u => u.role === 'admin').forEach(admin => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${admin.username}</td><td>${admin.username}</td><td>${admin.blacklisted ? 'Blocked' : 'Active'}</td><td><button onclick="toggleBlock('${admin.username}', 'admin')">${admin.blacklisted ? 'Unblock' : 'Block'}</button></td>`;
        adminTableBody.appendChild(tr);
    });
});

function toggleBlock(username, role) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === username && u.role === role);
    if (idx !== -1) {
        users[idx].blacklisted = !users[idx].blacklisted;
        localStorage.setItem('users', JSON.stringify(users));
        location.reload();
    }
}
