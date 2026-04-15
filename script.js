const TERMUX_URL = 'http://localhost:3000';

// 1. Connection Heartbeat
async function checkTermux() {
    try {
        const response = await fetch(`${TERMUX_URL}/ping`);
        if (response.ok) {
            document.getElementById('connectionDot').style.background = '#10b981';
            document.getElementById('statusText').innerText = 'Termux: Connected';
        }
    } catch (err) {
        document.getElementById('connectionDot').style.background = '#ef4444';
        document.getElementById('statusText').innerText = 'Termux: Offline';
    }
}

// 2. Submit Payout to Termux
document.getElementById('payoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const payload = {
        email: document.getElementById('email').value,
        amount: document.getElementById('amount').value,
        type: document.getElementById('type').value
    };

    addLog(`Requesting ${payload.type} payout for ${payload.email}...`);

    try {
        const res = await fetch(`${TERMUX_URL}/api/payout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        addLog(`SUCCESS: ${data.message}`, 'success');
    } catch (err) {
        addLog(`FAILED: Could not reach Termux Engine`, 'error');
    }
});

function addLog(msg, type = '') {
    const terminal = document.getElementById('terminal');
    const line = document.createElement('div');
    line.className = `log-line ${type}`;
    line.innerHTML = `> ${msg}`;
    terminal.prepend(line);
}

// Check connection every 3 seconds
setInterval(checkTermux, 3000);
checkTermux();
