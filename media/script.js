const vscode = acquireVsCodeApi();

document.getElementById('sendCodeButton').addEventListener('click', () => {
    vscode.postMessage({ command: 'sendCodeToAPI' });
});

// Optional: Add animation or effects here
function animateGameMessage() {
    const messageElement = document.getElementById('gameMessage');
    if (messageElement) {
        messageElement.classList.add('animate');
        setTimeout(() => messageElement.classList.remove('animate'), 2000);
    }
}

// Add event listener for dynamic effects if needed
window.addEventListener('message', event => {
    const message = event.data; // The JSON data that the extension sent

    if (message.command === 'updateGameMessage') {
        document.getElementById('gameMessage').textContent = message.text;
        animateGameMessage();
    }

    if (message.command === 'updateStatus') {
        document.getElementById('status').textContent = message.text;
    }
});
