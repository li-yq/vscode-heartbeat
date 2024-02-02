// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Heartbeat } from './Heartbeat';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "heartbeat" is now active!');

	// create the heartbeat instance
	const heartbeat = new Heartbeat(3000, () => {
		console.log(new Date().toISOString(), "Heartbeat");
	});
	context.subscriptions.push(heartbeat);

	// listen on window state change
	context.subscriptions.push(
		vscode.window.onDidChangeWindowState((e) => {
			console.log(
				new Date().toISOString(),
				"Window state changed:",
				JSON.stringify(e));
			if (e.active && !heartbeat.running) {
				heartbeat.start();
			}
			if (!e.active && heartbeat.running) {
				heartbeat.stop();
			}
		})
	);

}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log("Deactivating extension");
}
