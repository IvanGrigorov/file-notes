// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let opennotes = vscode.commands.registerCommand('notes-per-file.openNotes', () => {
		openNotes(context);
	});

	let savenotes = vscode.commands.registerCommand('notes-per-file.saveNotes', () => {
		saveNotes(context);
	});


	context.subscriptions.push(opennotes);
	context.subscriptions.push(savenotes);
}

function saveNotes(context: vscode.ExtensionContext) {
	let currentTabTitle =  vscode.window.tabGroups.activeTabGroup.activeTab?.input as any;
	currentTabTitle = currentTabTitle.uri.path	|| '';
	if (!currentTabTitle.includes('Notes-')) {
		vscode.window.showErrorMessage("Cannot save notes. Not a notes file.");
		return;
	}
	else {
		const key = currentTabTitle.split('Notes-').pop();
		context.globalState.update(key, vscode.window.activeTextEditor?.document.getText());
		vscode.window.showInformationMessage("Notes saved yopu can now close the file without saving it.");
	}
}

function openNotes(context: vscode.ExtensionContext) {
	let file = vscode.window.activeTextEditor!.document.fileName || '';
	if (!file) {
		vscode.window.showErrorMessage("You can open notes only for saved files");
		return;
	}
	var setting: vscode.Uri = vscode.Uri.parse('untitled:Notes-' + file);
	vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
		vscode.window.showTextDocument(a, 1, false).then(e => {
			e.edit(edit => {
				edit.insert(new vscode.Position(0, 0),  context.globalState.get(file) || '');
			});
		});
	}, (error: any) => {
		console.error(error);
		debugger;
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
