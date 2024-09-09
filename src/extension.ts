import * as vscode from 'vscode';
import axios from 'axios';
import { SendCodeWebviewProvider } from './sendCodeViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const sendCodeWebviewProvider = new SendCodeWebviewProvider(context.extensionUri);

    // Register the webview view
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'sendCodeWebview',
            sendCodeWebviewProvider
        )
    );

    const sendCodeCommand = vscode.commands.registerCommand('extension.sendCodeToAPI', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const document = editor.document;
            const code = document.getText();

            const apiUrl = "http://localhost:8000/submit-code/";

            try {
                const response = await axios.post(apiUrl, JSON.stringify({ code: code }), {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const message = response.data && response.data.message ? response.data.message : 'Unknown error';

                if (response.data && response.data.status === 'success') {
                    vscode.window.showInformationMessage('Code sent successfully! Response: ' + JSON.stringify(response.data));
                    sendCodeWebviewProvider.updateStatus(`Success - ${message}`);
                } else {
                    vscode.window.showErrorMessage('Failed to send code: ' + message);
                    sendCodeWebviewProvider.updateStatus(`Error - ${message}`);
                }

            } catch (error: any) {
                const errorMessage = error.message || 'Unknown error';
                vscode.window.showErrorMessage('Failed to send code: ' + errorMessage);
                sendCodeWebviewProvider.updateStatus(`Error - ${errorMessage}`);
            }
        } else {
            vscode.window.showErrorMessage('No active editor detected!');
        }
    });

    // Periodically fetch game messages from the FastAPI server
    async function fetchGameMessages() {
        const gameMessageUrl = "http://localhost:8000/game-messages/"; // Endpoint for game messages

        try {
            const response = await axios.get(gameMessageUrl);
            if (response.data && response.data.message) {
                sendCodeWebviewProvider.updateGameMessage(response.data.message);
            } else {
                sendCodeWebviewProvider.updateGameMessage('Failed to retrieve game messages.');
            }
        } catch (error: any) {
            sendCodeWebviewProvider.updateGameMessage('Error fetching game messages: ' + (error.message || 'Unknown error'));
        }
    }

    // Set an interval to fetch game messages every 5 seconds
    setInterval(fetchGameMessages, 5000);

    context.subscriptions.push(sendCodeCommand);
}

export function deactivate() {}
