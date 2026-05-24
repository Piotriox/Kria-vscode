# Kria Programming Language - VS Code Extension

VS Code extension providing syntax highlighting, language support, and professional IDE features for Kria programming language.

## Features

### IDE Features

- **Hover Information** - Hover over functions, keywords, and variables to see documentation and type information
- **Go to Definition** - Press `Ctrl+Click` on any function or variable to jump to its definition
- **IntelliSense / Autocomplete** - Get smart code suggestions while typing
  - Type `prin` → Suggests `print()`
  - Type `arr.` → Suggests `push`, `pop`, `length`
  - Type `input<` → Suggests `str`, `int`, `float`
  - Type `for` → Suggests loop templates

### Syntax Highlighting
- **Keywords** - `if`, `else`, `while`, `for`, `in`, `fn`, `set`, `return`, `break`, `continue`
- **Built-in Functions** - `print()`, `input()`, `push()`, `pop()`, `rmv()`
- **Data Types**
  - Strings (Green)
  - Numbers (Light Cyan)
  - Booleans & Null (Purple)
  - Arrays `[...]` (Mutable)
  - Immutable Arrays `#[...]`
  - Objects `{...}`
- **Generic Types** - `<str>`, `<int>`, `<float>`
- **Operators** - `+`, `-`, `*`, `/`, `==`, `!=`, `>`, `<`, `>=`, `<=`, `=`
- **Comments** - `// comment`

### Language Support
- Auto-closing brackets: `{}`, `()`, `""`
- Automatic indentation
- Bracket matching
- File icon for `.krx` files
- Code snippets for common patterns

### Code Snippets
Quick templates for common code patterns:
- `fn` - Function definition
- `while` - While loop
- `for` - For-in loop (arrays)
- `forobj` - For-in loop (objects)
- `if` - If statement
- `ifelse` - If-else statement
- `set` - Variable declaration
- `inputstr`, `inputint`, `inputfloat` - User input
- `print` - Print statement
- `arr`, `immarr` - Array creation
- `obj` - Object creation
- `push`, `pop`, `rmv` - Array/Object operations
- `expfn` - Export function
- `imp` - Import module
- `impall` - Import all exports

## Installation

1. Search for "Kria Programming Language" in VS Code Extensions Marketplace
2. Click the "Install" button
3. Restart VS Code

## File Extension

Save your Kria code with the `.krx` extension.

## License

MIT License - See LICENSE file in directory

## Contributing

You can open issues to report bugs or suggestions.

---

Happy coding with Kria!
