# Kria Programming Language - VS Code Extension

VS Code extension providing syntax highlighting, language support and theme for the **Kria** programming language.

## Features

Syntax Highlighting
- Keywords (if, else, while, fn, set, return) - Cool Blue
- Built-in functions (print, input) - Orange
- Strings - Green
- Numbers - Light Cyan
- Booleans (true, false, null) - Purple
- Operators - Grey-Blue
- Comments - Dark Grey

Kria Dark Theme - Modern dark theme optimized for the language

Language Support
- Auto-closing brackets: `{}`, `()`, `""`
- Automatic indentation
- Bracket matching
- File icon (.krx files)

## Installation

1. Search for "Kria Programming Language" in VS Code Extensions Marketplace
2. Click the "Install" button
3. Restart VS Code

## About Kria Language

Kria is a simple and understandable programming language designed for educational purposes.

### Basic Usage

**Variable Declaration:**
```kria
set x = 10
set name = "Kria"
set isActive = true
```

**Function Definition:**
```kria
fn add(a, b) {
    return a + b
}

print(add(5, 3))  // Output: 8
```

**Conditional Statements:**
```kria
set age = 25

if (age >= 18) {
    print("Adult")
} else {
    print("Child")
}
```

**Loops:**
```kria
set i = 0
while (i < 5) {
    print(i)
    set i = i + 1
}
```

**Recursive Functions:**
```kria
fn factorial(n) {
    if (n <= 1) {
        return 1
    } else {
        return n * factorial(n - 1)
    }
}
```

## File Extension

Save your Kria code with the `.krx` extension.

## Themes

- **Kria Dark** - Dark theme (default)

To change theme:
1. Press `Ctrl+K Ctrl+T` (macOS: `Cmd+K Cmd+T`)
2. Select "Kria Dark"

## Examples

Various example files are available in the `examples/` directory:
- `01_basics.krx` - Basic operations
- `02_conditionals.krx` - If/else structures
- `03_loops.krx` - While loops
- `04_functions_basic.krx` - Function definition
- `05_functions_advanced.krx` - Recursive functions
- `06_input_strings.krx` - String operations
- `07_input_numeric.krx` - Numeric input
- `08_input_interactive.krx` - Interactive input
- `09_algorithms.krx` - Algorithm examples
- `10_performance.krx` - Performance optimization

## Requirements

- VS Code 1.120.0 or newer

## License

MIT License - See LICENSE file in directory

## Contributing

You can open issues to report bugs or suggestions.

---

Happy coding with Kria! 🚀