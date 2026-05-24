import * as vscode from 'vscode';
import { HoverProvider } from './providers/hoverProvider';
import { DefinitionProvider } from './providers/definitionProvider';
import { CompletionProvider } from './providers/completionProvider';

export function activate(context: vscode.ExtensionContext) {
  console.log('Kria extension is now active!');

  // Register Hover Provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    'kria',
    new HoverProvider()
  );
  context.subscriptions.push(hoverProvider);

  // Register Definition Provider
  const definitionProvider = vscode.languages.registerDefinitionProvider(
    'kria',
    new DefinitionProvider()
  );
  context.subscriptions.push(definitionProvider);

  // Register Completion Provider
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'kria',
    new CompletionProvider(),
    '.', '(', '<', ',' // Trigger characters
  );
  context.subscriptions.push(completionProvider);

  console.log('Kria IDE features loaded:');
  console.log('  ✓ Hover Information');
  console.log('  ✓ Go to Definition (Ctrl+Click)');
  console.log('  ✓ Completion / IntelliSense');
}

export function deactivate() {}
