import * as vscode from 'vscode';
import axios from 'axios';
import { SendCodeViewProvider } from './sendCodeViewProvider';

export function activate(context: vscode.ExtensionContext) {
    const sendCodeViewProvider = new SendCodeViewProvider();
    vscode.window.registerTreeDataProvider('sendCodeToAPIView', sendCodeViewProvider);

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
                    sendCodeViewProvider.updateStatus(`Success - ${message}`);
                } else {
                    vscode.window.showErrorMessage('Failed to send code: ' + message);
                    sendCodeViewProvider.updateStatus(`Error - ${message}`);
                }

            } catch (error: any) {
                const errorMessage = error.message || 'Unknown error';
                vscode.window.showErrorMessage('Failed to send code: ' + errorMessage);
                sendCodeViewProvider.updateStatus(`Error - ${errorMessage}`);
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
                sendCodeViewProvider.updateGameMessage(response.data.message);
            } else {
                sendCodeViewProvider.updateGameMessage('Failed to retrieve game messages.');
            }
        } catch (error: any) {
            sendCodeViewProvider.updateGameMessage('Error fetching game messages: ' + (error.message || 'Unknown error'));
        }
    }

    // Set an interval to fetch game messages every 5 seconds
    setInterval(fetchGameMessages, 5000);

    context.subscriptions.push(sendCodeCommand);
}

export function deactivate() {}
