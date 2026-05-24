import * as vscode from 'vscode';

// Built-in Functions Documentation
export const BUILTIN_FUNCTIONS = {
  print: {
    signature: 'print(value: any): void',
    documentation: 'Print a value to the console output',
    kind: vscode.CompletionItemKind.Function,
    snippet: 'print(${1:value})'
  },
  input: {
    signature: 'input<T>(prompt: string): T',
    documentation: 'Get user input from the console. Use input<str>, input<int>, or input<float>',
    kind: vscode.CompletionItemKind.Function,
    snippet: 'input<${1:str}>(${2:"prompt"})'
  },
  push: {
    signature: 'push(array: Array, item: any): void',
    documentation: 'Add an item to the end of a mutable array',
    kind: vscode.CompletionItemKind.Function,
    snippet: 'push(${1:array}, ${2:item})'
  },
  pop: {
    signature: 'pop(array: Array): any',
    documentation: 'Remove and return the last item from a mutable array',
    kind: vscode.CompletionItemKind.Function,
    snippet: 'pop(${1:array})'
  },
  rmv: {
    signature: 'rmv(object.property): void',
    documentation: 'Remove a property from an object',
    kind: vscode.CompletionItemKind.Function,
    snippet: 'rmv(${1:object.property})'
  }
};

// Keywords Documentation
export const KEYWORDS = {
  fn: {
    documentation: 'Define a function. Use: fn functionName(params) { ... }',
    kind: vscode.CompletionItemKind.Keyword
  },
  if: {
    documentation: 'Conditional statement. Use: if (condition) { ... }',
    kind: vscode.CompletionItemKind.Keyword
  },
  else: {
    documentation: 'Else clause for if statement. Use: else { ... }',
    kind: vscode.CompletionItemKind.Keyword
  },
  while: {
    documentation: 'While loop. Use: while (condition) { ... }',
    kind: vscode.CompletionItemKind.Keyword
  },
  for: {
    documentation: 'For-in loop. Use: for item in array { ... } or for key, value in object { ... }',
    kind: vscode.CompletionItemKind.Keyword
  },
  set: {
    documentation: 'Variable declaration. Use: set variableName = value',
    kind: vscode.CompletionItemKind.Keyword
  },
  return: {
    documentation: 'Return a value from a function. Use: return value',
    kind: vscode.CompletionItemKind.Keyword
  },
  break: {
    documentation: 'Break out of a loop',
    kind: vscode.CompletionItemKind.Keyword
  },
  continue: {
    documentation: 'Skip to the next iteration of a loop',
    kind: vscode.CompletionItemKind.Keyword
  },
  export: {
    documentation: 'Export a function or variable for use in other modules',
    kind: vscode.CompletionItemKind.Keyword
  },
  import: {
    documentation: 'Import a module. Use: import name from "./path.krx"',
    kind: vscode.CompletionItemKind.Keyword
  },
  true: {
    documentation: 'Boolean true value',
    kind: vscode.CompletionItemKind.Constant
  },
  false: {
    documentation: 'Boolean false value',
    kind: vscode.CompletionItemKind.Constant
  },
  null: {
    documentation: 'Null value',
    kind: vscode.CompletionItemKind.Constant
  }
};

// Array Methods and Properties
export const ARRAY_METHODS = [
  {
    name: 'push',
    documentation: 'Add item to array',
    snippet: 'push(${1:item})',
    kind: vscode.CompletionItemKind.Function
  },
  {
    name: 'pop',
    documentation: 'Remove last item from array',
    snippet: 'pop()',
    kind: vscode.CompletionItemKind.Function
  },
  {
    name: 'length',
    documentation: 'Get array length',
    snippet: 'length',
    kind: vscode.CompletionItemKind.Property
  }
];

// Object Methods and Properties
export const OBJECT_METHODS = [
  {
    name: 'rmv',
    documentation: 'Remove property from object',
    snippet: 'rmv(${1:property})',
    kind: vscode.CompletionItemKind.Function
  }
];

// Generic Types
export const GENERIC_TYPES = [
  {
    name: 'str',
    documentation: 'String type',
    kind: vscode.CompletionItemKind.TypeParameter
  },
  {
    name: 'int',
    documentation: 'Integer type',
    kind: vscode.CompletionItemKind.TypeParameter
  },
  {
    name: 'float',
    documentation: 'Float type',
    kind: vscode.CompletionItemKind.TypeParameter
  }
];
