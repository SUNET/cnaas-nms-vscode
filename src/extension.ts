// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

var rp = require('request-promise');
var yaml = require('js-yaml');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cnaas-nms" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cnaas-nms.checkSyntax', () => {
		// The code you place here will be executed every time your command is executed
		let yamlData = null;
		let activeTextEd = vscode.window.activeTextEditor;
		if (activeTextEd === undefined) {
			return;
		}
		try {
			let fileText = activeTextEd.document.getText();
			yamlData = yaml.safeLoad(fileText);
		} catch(err) {
			console.log(err);
			vscode.window.showInformationMessage("Could not parse YAML: "+err);
			return;
		}

		let settings = vscode.workspace.getConfiguration('cnaasNms');
		var options = {
			method: 'POST',
			uri: settings.apiUrl + '/api/v1.0/settings/model',
			body: yamlData,
			json: true // Automatically stringifies the body to JSON
		};
		
		rp(options)
			.then(function (parsedBody: any) {
				// Display a message box to the user
				vscode.window.showInformationMessage("CNaaS syntax check: " + parsedBody.status);
			})
			.catch(function (err: any) {
				// POST failed...
				vscode.window.showInformationMessage("CNaaS syntax check: " + err.response.body.message);
			});

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
