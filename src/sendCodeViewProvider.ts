import * as vscode from 'vscode';

export class SendCodeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;

    // Variables to hold game messages and submission status
    private gameMessage: string = 'Welcome to the Game! Follow the instructions.';
    private submissionStatus: string | undefined;

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
        if (!element) {
            // Create items for the tree view
            const sendCodeItem = new vscode.TreeItem('Send Current Code to API', vscode.TreeItemCollapsibleState.None);
            sendCodeItem.command = {
                command: 'extension.sendCodeToAPI',
                title: 'Send Code to API'
            };

            // Dynamic game message item
            const gameMessageItem = new vscode.TreeItem(this.gameMessage, vscode.TreeItemCollapsibleState.None);

            // Show the current submission status in the tree view
            const statusItem = new vscode.TreeItem(this.submissionStatus ? `Status: ${this.submissionStatus}` : 'No submission yet', vscode.TreeItemCollapsibleState.None);

            return Promise.resolve([gameMessageItem, sendCodeItem, statusItem]);
        }
        return Promise.resolve([]);
    }

    // Method to update the submission status and refresh the view
    updateStatus(status: string): void {
        this.submissionStatus = status;
        this.refresh();
    }

    // Method to update game message dynamically
    updateGameMessage(message: string): void {
        this.gameMessage = message;
        this.refresh();
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
