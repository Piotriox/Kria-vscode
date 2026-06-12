import * as vscode from 'vscode';

export class FormatterProvider implements vscode.DocumentFormattingEditProvider {
  async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const edits: vscode.TextEdit[] = [];
    const text = document.getText();
    const lines = text.split('\n');
    let formattedText = '';

    let indentLevel = 0;
    const indentStr = ' '.repeat(options.tabSize || 2);

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) {
        formattedText += '\n';
        continue;
      }

      // Decrease indent for closing braces
      if (trimmed.startsWith('}') || trimmed.startsWith(']')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Apply indentation
      let formattedLine = indentStr.repeat(indentLevel) + trimmed;

      // Add spacing around operators
      formattedLine = this.formatOperators(formattedLine);

      // Add spacing after keywords
      formattedLine = this.formatKeywords(formattedLine);

      formattedText += formattedLine;
      if (i < lines.length - 1) {
        formattedText += '\n';
      }

      // Increase indent for opening braces
      if (trimmed.endsWith('{') || trimmed.endsWith('[')) {
        indentLevel++;
      }
    }

    if (text !== formattedText) {
      const range = new vscode.Range(
        document.positionAt(0),
        document.positionAt(text.length)
      );
      edits.push(new vscode.TextEdit(range, formattedText));
    }

    return edits;
  }

  private formatOperators(line: string): string {
    // Add spacing around operators: =, ==, !=, +, -, *, /, >, <, >=, <=
    const operators = ['==', '!=', '>=', '<=', '=', '+', '-', '*', '/', '>', '<'];

    let result = line;
    for (const op of operators) {
      if (op === '=') {
        // Special handling for '=' to avoid '==' and '!='
        result = result.replace(/([^!=<>])\s*=\s*([^=])/g, '$1 = $2');
      } else {
        const escaped = op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`([^\\s${escaped}])\\s*${escaped}\\s*`, 'g');
        result = result.replace(regex, `$1 ${op} `);
      }
    }

    return result;
  }

  private formatKeywords(line: string): string {
    // Add spacing after keywords
    const keywords = ['if', 'elseif', 'else', 'while', 'for', 'fn', 'set', 'return', 'import'];

    let result = line;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\s*\\(`, 'g');
      result = result.replace(regex, `${keyword} (`);

      // Special handling for fn keyword
      if (keyword === 'fn') {
        const fnRegex = /\bfn\s+(\w+)\s*\(/g;
        result = result.replace(fnRegex, 'fn $1(');
      }

      // Special handling for set keyword
      if (keyword === 'set') {
        const setRegex = /\bset\s+(\w+)\s*=/g;
        result = result.replace(setRegex, 'set $1 =');
      }
    }

    return result;
  }
}

export class RangeFormattingProvider implements vscode.DocumentRangeFormattingEditProvider {
  async provideDocumentRangeFormattingEdits(
    document: vscode.TextDocument,
    range: vscode.Range,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    const formatter = new FormatterProvider();
    
    // For now, format the entire document
    // In a real implementation, you'd only format the selected range
    return formatter.provideDocumentFormattingEdits(document, options, token);
  }
}
