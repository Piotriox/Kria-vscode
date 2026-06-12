import * as vscode from 'vscode';
import {
  BUILTIN_FUNCTIONS,
  KEYWORDS,
  ARRAY_METHODS,
  OBJECT_METHODS,
  GENERIC_TYPES
} from '../utils/definitions';
import { KriaParser } from '../utils/parser';

export class CompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.CompletionItem[] {
    const line = KriaParser.getLineAtPosition(document, position);
    const beforeCursor = line.substring(0, position.character);
    const items: vscode.CompletionItem[] = [];

    // Context: Import paths (inside import statement)
    if (beforeCursor.includes('import') && (beforeCursor.includes('from') || beforeCursor.includes('"') || beforeCursor.includes("'"))) {
      return this.getImportPathCompletions(document, beforeCursor);
    }

    // Context: Array methods (after arr.)
    if (beforeCursor.match(/\w+\.$/)) {
      return this.getArrayCompletions();
    }

    // Context: Generic types (after <)
    if (beforeCursor.match(/<$/)) {
      return this.getGenericTypeCompletions();
    }

    // Context: General completions
    items.push(...this.getKeywordCompletions());
    items.push(...this.getBuiltInFunctionCompletions());
    items.push(...this.getUserDefinedCompletions(document));

    return items;
  }

  /**
   * Get keyword completion items
   */
  private getKeywordCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    // Standard keywords with snippets
    const snippets = {
      fn: 'fn ${1:functionName}(${2:parameters}) {\n\t$3\n\treturn $4\n}',
      if: 'if (${1:condition}) {\n\t$2\n}',
      while: 'while (${1:condition}) {\n\t$2\n}',
      for: 'for ${1:item} in ${2:array} {\n\t$3\n}',
      forobj: 'for ${1:key}, ${2:value} in ${3:object} {\n\t$4\n}',
      set: 'set ${1:variableName} = ${2:value}',
      ifelse: 'if (${1:condition}) {\n\t$2\n} else {\n\t$3\n}'
    };

    for (const [word, snippet] of Object.entries(snippets)) {
      const item = new vscode.CompletionItem(word, vscode.CompletionItemKind.Snippet);
      item.insertText = new vscode.SnippetString(snippet);
      
      if (word in KEYWORDS) {
        const keyword = KEYWORDS[word as keyof typeof KEYWORDS];
        item.documentation = keyword.documentation;
      }
      
      items.push(item);
    }

    // Other keywords without snippets
    for (const [word, keyword] of Object.entries(KEYWORDS)) {
      if (!snippets.hasOwnProperty(word)) {
        const item = new vscode.CompletionItem(word, keyword.kind);
        item.documentation = keyword.documentation;
        items.push(item);
      }
    }

    return items;
  }

  /**
   * Get built-in function completion items
   */
  private getBuiltInFunctionCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const [name, func] of Object.entries(BUILTIN_FUNCTIONS)) {
      const item = new vscode.CompletionItem(name, func.kind);
      item.insertText = new vscode.SnippetString(func.snippet);
      item.documentation = func.documentation;
      item.detail = func.signature;
      items.push(item);
    }

    return items;
  }

  /**
   * Get array method completion items
   */
  private getArrayCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const method of ARRAY_METHODS) {
      const item = new vscode.CompletionItem(method.name, method.kind);
      item.insertText = new vscode.SnippetString(method.snippet);
      item.documentation = method.documentation;
      items.push(item);
    }

    return items;
  }

  /**
   * Get object method completion items
   */
  private getObjectCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const method of OBJECT_METHODS) {
      const item = new vscode.CompletionItem(method.name, method.kind);
      item.insertText = new vscode.SnippetString(method.snippet);
      item.documentation = method.documentation;
      items.push(item);
    }

    return items;
  }

  /**
   * Get generic type completion items (str, int, float)
   */
  private getGenericTypeCompletions(): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    for (const type of GENERIC_TYPES) {
      const item = new vscode.CompletionItem(type.name, type.kind);
      item.documentation = type.documentation;
      items.push(item);
    }

    return items;
  }

  /**
   * Get import path completion items for .krx files
   */
  private getImportPathCompletions(document: vscode.TextDocument, beforeCursor: string): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    // Extract current path from import statement
    const pathMatch = beforeCursor.match(/from\s+["']([^"']*)$/);
    if (!pathMatch) {
      // Show initial path suggestions
      const item = new vscode.CompletionItem('./', vscode.CompletionItemKind.Folder);
      item.detail = 'Current directory';
      items.push(item);

      const parentItem = new vscode.CompletionItem('../', vscode.CompletionItemKind.Folder);
      parentItem.detail = 'Parent directory';
      items.push(parentItem);

      return items;
    }

    const currentPath = pathMatch[1];
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return items;

    try {
      const fs = require('fs');
      const path = require('path');

      const baseDir = currentPath.startsWith('../') ? workspaceFolder.uri.fsPath : workspaceFolder.uri.fsPath;
      const fullPath = path.join(baseDir, currentPath);
      const dirPath = currentPath.endsWith('/') ? fullPath : path.dirname(fullPath);

      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);

          if (stats.isDirectory()) {
            const item = new vscode.CompletionItem(file + '/', vscode.CompletionItemKind.Folder);
            items.push(item);
          } else if (file.endsWith('.krx')) {
            const item = new vscode.CompletionItem(file, vscode.CompletionItemKind.File);
            item.detail = 'Kria module';
            items.push(item);
          }
        }
      }
    } catch (error) {
      // Silently fail if fs operations don't work
    }

    return items;
  }

  /**
   * Get user-defined symbols (functions, variables) for completion
   */
  private getUserDefinedCompletions(document: vscode.TextDocument): vscode.CompletionItem[] {
    const items: vscode.CompletionItem[] = [];

    // User-defined functions
    const functions = KriaParser.findFunctionDefinitions(document);
    for (const func of functions) {
      const item = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
      item.detail = `fn ${func.name}(${func.params.join(', ')})`;
      item.documentation = `User-defined function${func.isExported ? ' (exported)' : ''}`;
      items.push(item);
    }

    // User-defined variables
    const variables = KriaParser.findVariableDeclarations(document);
    for (const variable of variables) {
      const item = new vscode.CompletionItem(variable.name, vscode.CompletionItemKind.Variable);
      item.documentation = 'User-defined variable';
      items.push(item);
    }

    return items;
  }
}
