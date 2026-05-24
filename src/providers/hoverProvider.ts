import * as vscode from 'vscode';
import { BUILTIN_FUNCTIONS, KEYWORDS } from '../utils/definitions';
import { KriaParser } from '../utils/parser';

export class HoverProvider implements vscode.HoverProvider {
  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    const word = KriaParser.getWordAtPosition(document, position);
    if (!word) return undefined;

    // Check built-in functions
    if (word in BUILTIN_FUNCTIONS) {
      const func = BUILTIN_FUNCTIONS[word as keyof typeof BUILTIN_FUNCTIONS];
      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(`${func.signature}`, 'typescript');
      markdown.appendMarkdown(`\n${func.documentation}`);
      return new vscode.Hover(markdown);
    }

    // Check keywords
    if (word in KEYWORDS) {
      const keyword = KEYWORDS[word as keyof typeof KEYWORDS];
      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`**${word}** — Keyword\n\n${keyword.documentation}`);
      return new vscode.Hover(markdown);
    }

    // Check user-defined functions
    const functions = KriaParser.findFunctionDefinitions(document);
    const func = functions.find(f => f.name === word);
    if (func) {
      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(`fn ${func.name}(${func.params.join(', ')})`, 'kria');
      markdown.appendMarkdown(`\n${func.isExported ? '*(exported)* ' : ''}Defined at line ${func.line + 1}`);
      return new vscode.Hover(markdown);
    }

    // Check variables
    const variables = KriaParser.findVariableDeclarations(document);
    const variable = variables.find(v => v.name === word);
    if (variable) {
      const markdown = new vscode.MarkdownString();
      markdown.appendMarkdown(`**${variable.name}** — Variable\n\nDefined at line ${variable.line + 1}`);
      return new vscode.Hover(markdown);
    }

    return undefined;
  }
}
