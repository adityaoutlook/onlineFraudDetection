// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', function() {
    // Load all users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    document.getElementById('userCount').textContent = `Total registered users: ${users.length}`;
    const tbody = document.getElementById('userTable').querySelector('tbody');
    tbody.innerHTML = users.map(u => `<tr><td>${u.username}</td><td>${u.blacklisted ? 'Blocked' : 'Active'}</td><td><button onclick="toggleBlock('${u.username}')">${u.blacklisted ? 'Unblock' : 'Block'}</button></td></tr>`).join('');
});

function toggleBlock(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === username);
    if (idx !== -1) {
        users[idx].blacklisted = !users[idx].blacklisted;
        localStorage.setItem('users', JSON.stringify(users));
        location.reload();
    }
}

document.getElementById('logoutBtn').onclick = function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
};
