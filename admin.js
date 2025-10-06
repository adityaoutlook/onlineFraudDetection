// Admin Dashboard JS
const baseUrl = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', function() {
    // Fetch user count
    fetch(baseUrl + '/api/admin/usercount')
        .then(res => res.json())
        .then(data => {
            document.getElementById('userCount').textContent = data.count;
        });

    // Fetch user list
    fetch(baseUrl + '/api/admin/users')
        .then(res => res.json())
        .then(users => {
            const tbody = document.getElementById('userTable').querySelector('tbody');
            tbody.innerHTML = '';
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.status}</td><td><button onclick="toggleBlock(${user.id}, '${user.status}')">${user.status === 'Active' ? 'Block' : 'Unblock'}</button></td>`;
                tbody.appendChild(tr);
            });
        });
});

function toggleBlock(userId, currentStatus) {
    const action = currentStatus === 'Active' ? 'block' : 'unblock';
    fetch(baseUrl + `/api/admin/${action}/${userId}`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            alert(`User ${action}ed!`);
            location.reload();
        });
}
