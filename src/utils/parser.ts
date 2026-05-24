import * as vscode from 'vscode';

export class KriaParser {
  /**
   * Get the word at the given position
   */
  static getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string | null {
    const range = document.getWordRangeAtPosition(position);
    if (!range) return null;
    return document.getText(range);
  }

  /**
   * Get the line content at the given position
   */
  static getLineAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
    return document.lineAt(position.line).text;
  }

  /**
   * Check if position is inside array context (after '.' or '[')
   */
  static isInArrayContext(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = this.getLineAtPosition(document, position);
    const beforeCursor = line.substring(0, position.character);
    
    // Check for arr.method or arr[index].method
    return /\w+\./.test(beforeCursor) || /\w+\[/.test(beforeCursor);
  }

  /**
   * Check if position is inside object context
   */
  static isInObjectContext(document: vscode.TextDocument, position: vscode.Position): boolean {
    const line = this.getLineAtPosition(document, position);
    const beforeCursor = line.substring(0, position.character);
    
    // Check for obj.property or obj["property"]
    return /\w+\./.test(beforeCursor) || /\w+\[/.test(beforeCursor);
  }

  /**
   * Find all function definitions in document
   */
  static findFunctionDefinitions(document: vscode.TextDocument): FunctionDefinition[] {
    const functions: FunctionDefinition[] = [];
    const text = document.getText();
    
    // Match: export fn name(...) or fn name(...)
    const pattern = /^(?:export\s+)?fn\s+(\w+)\s*\((.*?)\)/gm;
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      const nameStart = document.positionAt(match.index + match[0].indexOf(match[1]));
      functions.push({
        name: match[1],
        params: match[2].split(',').map(p => p.trim()),
        line: nameStart.line,
        character: nameStart.character,
        isExported: match[0].includes('export')
      });
    }
    
    return functions;
  }

  /**
   * Find all variable declarations in document
   */
  static findVariableDeclarations(document: vscode.TextDocument): VariableDefinition[] {
    const variables: VariableDefinition[] = [];
    const text = document.getText();
    
    // Match: set name = value
    const pattern = /set\s+(\w+)\s*=/gm;
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      const nameStart = document.positionAt(match.index + match[0].indexOf(match[1]));
      variables.push({
        name: match[1],
        line: nameStart.line,
        character: nameStart.character
      });
    }
    
    return variables;
  }

  /**
   * Find import statement for a module name
   */
  static findImportStatement(document: vscode.TextDocument, moduleName: string): ImportDefinition | null {
    const text = document.getText();
    const pattern = new RegExp(`import\\s+${moduleName}\\s+from\\s+['"](.*?)['"]`, 'g');
    const match = pattern.exec(text);
    
    if (!match) return null;
    
    return {
      name: moduleName,
      path: match[1]
    };
  }

  /**
   * Check if a word is a keyword
   */
  static isKeyword(word: string): boolean {
    const keywords = [
      'if', 'else', 'while', 'for', 'in', 'fn', 'set', 'return',
      'break', 'continue', 'export', 'import', 'from',
      'true', 'false', 'null'
    ];
    return keywords.includes(word);
  }

  /**
   * Check if a word is a built-in function
   */
  static isBuiltInFunction(word: string): boolean {
    const builtins = ['print', 'input', 'push', 'pop', 'rmv'];
    return builtins.includes(word);
  }

  /**
   * Get symbol type at position
   */
  static getSymbolType(document: vscode.TextDocument, position: vscode.Position): SymbolType {
    const word = this.getWordAtPosition(document, position);
    if (!word) return 'unknown';
    
    if (this.isKeyword(word)) return 'keyword';
    if (this.isBuiltInFunction(word)) return 'builtin';
    
    const functions = this.findFunctionDefinitions(document);
    if (functions.some(f => f.name === word)) return 'function';
    
    const variables = this.findVariableDeclarations(document);
    if (variables.some(v => v.name === word)) return 'variable';
    
    return 'unknown';
  }

  /**
   * Resolve import path to absolute path
   */
  static resolveImportPath(currentFile: string, importPath: string): string {
    const path = require('path');
    const dir = path.dirname(currentFile);
    return path.resolve(dir, importPath);
  }
}

// Type definitions
export interface FunctionDefinition {
  name: string;
  params: string[];
  line: number;
  character: number;
  isExported: boolean;
}

export interface VariableDefinition {
  name: string;
  line: number;
  character: number;
}

export interface ImportDefinition {
  name: string;
  path: string;
}

export type SymbolType = 'keyword' | 'builtin' | 'function' | 'variable' | 'unknown';
