const vscode = acquireVsCodeApi();

document.getElementById('sendCodeButton').addEventListener('click', () => {
    vscode.postMessage({ command: 'sendCodeToAPI' });
});
