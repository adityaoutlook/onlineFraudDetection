// User Dashboard JS
// Replace baseUrl with your backend URL if needed
const baseUrl = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', function() {
    // Fetch transaction history
    fetch(baseUrl + '/api/transactions/user')
        .then(res => res.json())
        .then(data => {
            // Display transaction history (implement as needed)
            console.log('Transaction history:', data);
        });

    // Fetch account balance
    fetch(baseUrl + '/api/users/balance')
        .then(res => res.json())
        .then(data => {
            // Display balance (implement as needed)
            console.log('Balance:', data);
        });

    // Fetch fraud alerts
    fetch(baseUrl + '/api/fraud/alerts')
        .then(res => res.json())
        .then(data => {
            // Display fraud alerts (implement as needed)
            console.log('Fraud alerts:', data);
        });
});

// Register new transaction (example)
function registerTransaction(transactionData) {
    fetch(baseUrl + '/api/transactions/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(transactionData)
    })
    .then(res => res.json())
    .then(data => {
        alert('Transaction registered!');
    });
}
