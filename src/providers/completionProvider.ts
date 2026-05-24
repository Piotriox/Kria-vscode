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
