import * as vscode from 'vscode';
import { KriaParser } from '../utils/parser';

export class DefinitionProvider implements vscode.DefinitionProvider {
  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Definition | undefined> {
    const word = KriaParser.getWordAtPosition(document, position);
    if (!word) return undefined;

    // Skip built-in functions - they don't have definitions in user code
    const builtins = ['print', 'input', 'push', 'pop', 'rmv'];
    if (builtins.includes(word)) return undefined;

    // Try to find in current document
    const definitionInDoc = this.findDefinitionInDocument(document, word);
    if (definitionInDoc) return definitionInDoc;

    // Try to find in imported modules
    const importDef = this.findDefinitionInImportedModule(document, word, position);
    if (importDef) return importDef;

    return undefined;
  }

  /**
   * Find function or variable definition in current document
   */
  private findDefinitionInDocument(
    document: vscode.TextDocument,
    word: string
  ): vscode.Location | undefined {
    // Check functions
    const functions = KriaParser.findFunctionDefinitions(document);
    const func = functions.find(f => f.name === word);
    if (func) {
      return new vscode.Location(
        document.uri,
        new vscode.Position(func.line, func.character)
      );
    }

    // Check variables
    const variables = KriaParser.findVariableDeclarations(document);
    const variable = variables.find(v => v.name === word);
    if (variable) {
      return new vscode.Location(
        document.uri,
        new vscode.Position(variable.line, variable.character)
      );
    }

    return undefined;
  }

  /**
   * Find definition in imported modules
   */
  private async findDefinitionInImportedModule(
    document: vscode.TextDocument,
    word: string,
    position: vscode.Position
  ): Promise<vscode.Location | undefined> {
    const line = KriaParser.getLineAtPosition(document, position);
    
    // Check if we're in an import statement
    if (line.includes('import')) {
      return undefined; // Let VSCode handle import path resolution
    }

    // Find all imports in document
    const text = document.getText();
    const importPattern = /import\s+(\w+)\s+from\s+['"](.*?)['"]/g;
    let match;

    while ((match = importPattern.exec(text)) !== null) {
      const moduleName = match[1];
      const modulePath = match[2];

      // If current position is using this module's name
      if (line.includes(`${moduleName}.`)) {
        try {
          const resolvedPath = KriaParser.resolveImportPath(
            document.fileName,
            modulePath
          );
          
          const moduleUri = vscode.Uri.file(resolvedPath);
          const moduleDoc = await vscode.workspace.openTextDocument(moduleUri);
          
          // Find the definition in the imported module
          const functions = KriaParser.findFunctionDefinitions(moduleDoc);
          const func = functions.find(f => f.name === word && f.isExported);
          
          if (func) {
            return new vscode.Location(
              moduleUri,
              new vscode.Position(func.line, func.character)
            );
          }
        } catch (error) {
          // Module not found, continue
        }
      }
    }

    return undefined;
  }
}
