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

    // Check each line for issues
    lines.forEach((line, lineIndex) => {
      // Skip comments
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return;
      }

      // Check for undefined variables in assignments and function calls
      const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
      let match;

      while ((match = variablePattern.exec(line)) !== null) {
        const name = match[1];
        const position = match.index;

        // Skip keywords
        const keywords = ['set', 'if', 'elseif', 'else', 'while', 'for', 'in', 'fn', 'return', 
                         'break', 'continue', 'export', 'import', 'from', 'true', 'false', 'null'];
        if (keywords.includes(name)) continue;

        // Skip if it's a property access (after dot)
        if (position > 0 && line[position - 1] === '.') continue;

        // Check if it's being defined (after 'set' keyword)
        const beforeName = line.substring(0, position).trim();
        if (beforeName.endsWith('set')) continue;

        // Check if it's being defined (function definition with 'fn')
        if (beforeName.endsWith('fn')) continue;

        // Check if it's a reference to undefined function/variable
        if (!functionNames.has(name) && !variableNames.has(name) && !builtins.has(name)) {
          // Only warn if it looks like a function call or variable reference
          if (position + name.length < line.length && line[position + name.length] === '(') {
            // It's a function call
            const range = new vscode.Range(
              new vscode.Position(lineIndex, position),
              new vscode.Position(lineIndex, position + name.length)
            );
            const diagnostic = new vscode.Diagnostic(
              range,
              `Undefined function '${name}'`,
              vscode.DiagnosticSeverity.Error
            );
            diagnostic.source = 'Kria Linter';
            diagnostic.code = 'undefined-function';
            diagnostics.push(diagnostic);
          }
        }
      }

      // Check for mismatched brackets
      const bracketIssues = this.checkBrackets(line, lineIndex);
      diagnostics.push(...bracketIssues);

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

  private checkBrackets(line: string, lineIndex: number): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const stack: Array<{ char: string; index: number }> = [];

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '{' || char === '(' || char === '[') {
        stack.push({ char, index: i });
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
