import * as vscode from 'vscode';
import { HoverProvider } from './providers/hoverProvider';
import { DefinitionProvider } from './providers/definitionProvider';
import { CompletionProvider } from './providers/completionProvider';
import { DiagnosticsProvider } from './providers/diagnosticsProvider';
import { FormatterProvider, RangeFormattingProvider } from './providers/formatterProvider';

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
    '.', '(', '<', ',', '"', '/', "'" // Trigger characters including import paths
  );
  context.subscriptions.push(completionProvider);

  // Register Diagnostics Provider
  const diagnosticsProvider = new DiagnosticsProvider(context);

  // Register Formatter Provider
  const formatterProvider = vscode.languages.registerDocumentFormattingEditProvider(
    'kria',
    new FormatterProvider()
  );
  context.subscriptions.push(formatterProvider);

  // Register Range Formatter Provider
  const rangeFormatterProvider = vscode.languages.registerDocumentRangeFormattingEditProvider(
    'kria',
    new RangeFormattingProvider()
  );
  context.subscriptions.push(rangeFormatterProvider);

  console.log('Kria IDE features loaded:');
  console.log('  ✓ Hover Information');
  console.log('  ✓ Go to Definition (Ctrl+Click)');
  console.log('  ✓ Completion / IntelliSense');
  console.log('  ✓ Code Diagnostics & Linting');
  console.log('  ✓ Code Formatter (Shift+Alt+F)');
  console.log('  ✓ Import Path Autocomplete');
}

export function deactivate() {}
