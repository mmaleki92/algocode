import * as vscode from 'vscode';

export class SendCodeWebviewProvider implements vscode.WebviewViewProvider {
    private _webviewView?: vscode.WebviewView;
    private _status: string = 'No submission yet';
    private _gameMessage: string = 'Welcome to the Game! Follow the instructions.';

    constructor(private readonly extensionUri: vscode.Uri) {}

    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, token: vscode.CancellationToken): void {
        this._webviewView = webviewView;
        this._webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')]
        };

        this._webviewView.webview.html = this.getHtmlForWebview();

        // Listen for messages from the webview
        this._webviewView.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'sendCodeToAPI':
                    vscode.commands.executeCommand('extension.sendCodeToAPI');
                    break;
            }
        });
    }

    private getHtmlForWebview(): string {
        const scriptUri = this._webviewView?.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'script.js'));
        const styleUri = this._webviewView?.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'style.css'));

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Send Code to API</title>
                <link href="${styleUri}" rel="stylesheet">
            </head>
            <body>
                <div class="container">
                    <div class="game-box">
                        <h1 class="game-title">Algo Game</h1>
                        <div id="gameMessage" class="game-message">${this._gameMessage}</div>
                        <div class="status-box">
                            <h2>Submission Status</h2>
                            <div id="status">${this._status}</div>
                        </div>
                        <button id="sendCodeButton" class="send-button">Send Code to API</button>
                    </div>
                </div>
                <script src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }

    public updateStatus(status: string): void {
        this._status = status;
        if (this._webviewView) {
            this._webviewView.webview.postMessage({ command: 'updateStatus', text: status });
        }
    }

    public updateGameMessage(message: string): void {
        this._gameMessage = message;
        if (this._webviewView) {
            this._webviewView.webview.postMessage({ command: 'updateGameMessage', text: message });
        }
    }
}
