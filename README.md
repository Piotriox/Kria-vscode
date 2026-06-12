# Kria Programming Language - VS Code Extension

![Version](https://img.shields.io/badge/version-1.4.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![VS Code](https://img.shields.io/badge/VS%20Code-1.75.0+-blue)

Professional IDE extension for Kria programming language with syntax highlighting, diagnostics, formatting, and intelligent code completion.

## Features

### IDE Features

- **Hover Information** - Hover over functions, keywords, and variables to see documentation and type information
- **Go to Definition** - Press `Ctrl+Click` on any function or variable to jump to its definition
- **IntelliSense / Autocomplete** - Get smart code suggestions while typing
  - Type `prin` → Suggests `print()`
  - Type `arr.` → Suggests `push`, `pop`, `length`
  - Type `input<` → Suggests `str`, `int`, `float`
  - Type `typ` → Suggests `type()`
  - Type `wait` → Suggests `wait()`
  - Type `import` → Suggests `.krx` files in directory
  - Type `for` → Suggests loop templates
  - Type `ifelse` → Suggests if-else templates
- **Code Diagnostics & Linting** - Real-time error detection
  - Undefined functions and variables warnings
  - Bracket matching and validation
  - Type error detection (invalid input types)
  - Unreachable code warnings
- **Code Formatter** - Automatic code formatting
  - Press `Shift+Alt+F` to format entire document
  - Automatic indentation based on brackets
  - Consistent operator spacing
  - Proper keyword formatting
- **Import Path Autocomplete** - Smart import suggestions
  - Type `import _ from "./"` → Lists available `.krx` files
  - Navigate directory structure with `../`
- **Enhanced Bracket Autoclosing**
  - Auto-closes all bracket types: `{}`, `[]`, `()`, `#[]`
  - Auto-closes quotes: `"` and `"""` multi-line strings
  - Auto-closes block comments: `/* */`

### Syntax Highlighting
- **Keywords** - `if`, `elseif`, `else`, `while`, `for`, `in`, `fn`, `set`, `return`, `break`, `continue`
- **Built-in Functions** - `print()`, `input()`, `push()`, `pop()`, `rmv()`, `type()`, `wait()`
- **Data Types**
  - Strings (Single & Multi-line) - `"string"` and `"""multi-line string"""`
  - Numbers (Light Cyan)
  - Booleans & Null (Purple)
  - Arrays `[...]` (Mutable)
  - Immutable Arrays `#[...]`
  - Objects `{...}`
- **Generic Types** - `<str>`, `<int>`, `<float>`
- **Operators** - `+`, `-`, `*`, `/`, `==`, `!=`, `>`, `<`, `>=`, `<=`, `=`
- **Comments** - Single-line `// comment` and Multi-line `/* comment */`

### Language Support
- Auto-closing brackets: `{}`, `()`, `""`
- Automatic indentation
- Bracket matching
- File icon for `.krx` files
- Code snippets for common patterns

### Code Snippets
Quick templates for common code patterns (50+ snippets):
- **Control Flow** - `fn`, `if`, `ifelse`, `ifelseif`, `while`, `for`, `forobj`, `try`, `switch`, `guard`
- **Input/Output** - `inputstr`, `inputint`, `inputfloat`, `print`
- **Arrays & Objects** - `arr`, `immarr`, `obj`, `push`, `pop`, `rmv`, `elem`, `setelement`, `iterarr`, `iterobj`
- **Functions** - `fnret`, `fnested`, `anon`, `fnrec`, `expfn`, `exp`
- **Utilities** - `type`, `wait`, `cmt`, `str3`, `prop`, `delay`
- **Advanced** - `ternary`, `inline`, `imp`, `impall`

## Installation

1. Search for "Kria Programming Language" in VS Code Extensions Marketplace
2. Click the "Install" button
3. Restart VS Code

## Quick Start

Create a new file with `.krx` extension:

```kria
// Hello World in Kria
print("Hello, Kria!")

// Variables
set name = "World"
set count = 42

// Functions
fn greet(greeting, target) {
    print(greeting)
    print(target)
}

greet("Hello", name)
```

## File Extension

Save your Kria code with the `.krx` extension.

## Requirements

- VS Code 1.75.0 or newer

## License

MIT License - See LICENSE file in directory