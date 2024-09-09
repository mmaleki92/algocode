import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

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
                <div id="status">${this._status}</div>
                <div id="gameMessage">${this._gameMessage}</div>
                <button id="sendCodeButton">Send Code</button>
                <script src="${scriptUri}"></script>
            </body>
            </html>
        `;
    }

    public updateStatus(status: string): void {
        this._status = status;
        if (this._webviewView) {
            this._webviewView.webview.html = this.getHtmlForWebview();
        }
    }

    public updateGameMessage(message: string): void {
        this._gameMessage = message;
        if (this._webviewView) {
            this._webviewView.webview.html = this.getHtmlForWebview();
        }
    }
}
