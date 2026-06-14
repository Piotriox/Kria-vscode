import * as vscode from 'vscode';
import { KriaParser } from '../utils/parser';

export class DiagnosticsProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext) {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('kria');
    context.subscriptions.push(this.diagnosticCollection);

    // Register on document change
    vscode.workspace.onDidOpenTextDocument(doc => this.validate(doc));
    vscode.workspace.onDidChangeTextDocument(e => this.validate(e.document));
    vscode.workspace.onDidSaveTextDocument(doc => this.validate(doc));
  }

  private validate(document: vscode.TextDocument): void {
    if (document.languageId !== 'kria') return;

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    // Get all defined functions and variables
    const functions = KriaParser.findFunctionDefinitions(document);
    const variables = KriaParser.findVariableDeclarations(document);
    const functionNames = new Set(functions.map(f => f.name));
    const variableNames = new Set(variables.map(v => v.name));

    // Built-in functions that don't need definitions
    const builtins = new Set(['print', 'input', 'push', 'pop', 'rmv', 'type', 'wait']);

    // Check brackets globally (across all lines)
    const bracketIssues = this.checkBracketsGlobal(text, lines);
    diagnostics.push(...bracketIssues);

    // Check each line for other issues
    lines.forEach((line, lineIndex) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return;
      }

      // Check for type mismatches in input statements
      const inputTypeIssues = this.checkInputTypes(line, lineIndex);
      diagnostics.push(...inputTypeIssues);

      // Check for unreachable code after return
      if (lineIndex > 0) {
        const prevLine = lines[lineIndex - 1].trim();
        if (prevLine === 'return' || prevLine.startsWith('return ')) {
          if (line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('}')) {
            const range = new vscode.Range(
              new vscode.Position(lineIndex, 0),
              new vscode.Position(lineIndex, line.length)
            );
            const diagnostic = new vscode.Diagnostic(
              range,
              'Unreachable code after return statement',
              vscode.DiagnosticSeverity.Warning
            );
            diagnostic.source = 'Kria Linter';
            diagnostics.push(diagnostic);
          }
        }
      }
    });

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  private checkBracketsGlobal(text: string, lines: string[]): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const stack: Array<{ char: string; line: number; col: number }> = [];
    let inString = false;
    let inBlockComment = false;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = i + 1 < line.length ? line[i + 1] : '';

        // Handle block comments
        if (!inString && char === '/' && nextChar === '*') {
          inBlockComment = true;
          i++;
          continue;
        }
        if (inBlockComment && char === '*' && nextChar === '/') {
          inBlockComment = false;
          i++;
          continue;
        }
        if (inBlockComment) continue;

        // Handle strings
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inString = !inString;
          continue;
        }
        if (inString) continue;

        // Handle single-line comments
        if (char === '/' && nextChar === '/') break;

        // Track brackets
        if (char === '{' || char === '(' || char === '[') {
          stack.push({ char, line: lineIndex, col: i });
        } else if (char === '}' || char === ')' || char === ']') {
          if (stack.length === 0) {
            const range = new vscode.Range(
              new vscode.Position(lineIndex, i),
              new vscode.Position(lineIndex, i + 1)
            );
            const diagnostic = new vscode.Diagnostic(
              range,
              `Unmatched closing bracket '${char}'`,
              vscode.DiagnosticSeverity.Error
            );
            diagnostic.source = 'Kria Linter';
            diagnostics.push(diagnostic);
          } else {
            const last = stack[stack.length - 1];
            const matches = (last.char === '{' && char === '}') ||
                           (last.char === '(' && char === ')') ||
                           (last.char === '[' && char === ']');
            if (!matches) {
              const range = new vscode.Range(
                new vscode.Position(lineIndex, i),
                new vscode.Position(lineIndex, i + 1)
              );
              const diagnostic = new vscode.Diagnostic(
                range,
                `Mismatched bracket: expected '${last.char === '{' ? '}' : last.char === '(' ? ')' : ']'}' but got '${char}'`,
                vscode.DiagnosticSeverity.Error
              );
              diagnostic.source = 'Kria Linter';
              diagnostics.push(diagnostic);
            } else {
              stack.pop();
            }
          }
        }
      }
    }

    // Report unclosed brackets at end of file
    if (stack.length > 0) {
      for (const unclosed of stack) {
        const range = new vscode.Range(
          new vscode.Position(unclosed.line, unclosed.col),
          new vscode.Position(unclosed.line, unclosed.col + 1)
        );
        const closeChar = unclosed.char === '{' ? '}' : unclosed.char === '(' ? ')' : ']';
        const diagnostic = new vscode.Diagnostic(
          range,
          `Unclosed bracket '${unclosed.char}'. Expected '${closeChar}'`,
          vscode.DiagnosticSeverity.Error
        );
        diagnostic.source = 'Kria Linter';
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  private checkInputTypes(line: string, lineIndex: number): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    
    // Check for input<type> with valid types
    const inputPattern = /input\s*<\s*([^>]+)\s*>/g;
    let match;

    while ((match = inputPattern.exec(line)) !== null) {
      const type = match[1].trim();
      const validTypes = ['str', 'int', 'float'];

      if (!validTypes.includes(type)) {
        const range = new vscode.Range(
          new vscode.Position(lineIndex, match.index),
          new vscode.Position(lineIndex, match.index + match[0].length)
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          `Invalid input type '${type}'. Use 'str', 'int', or 'float'`,
          vscode.DiagnosticSeverity.Error
        );
        diagnostic.source = 'Kria Linter';
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  public clear(uri: vscode.Uri): void {
    this.diagnosticCollection.delete(uri);
  }

  public clearAll(): void {
    this.diagnosticCollection.clear();
  }
}
