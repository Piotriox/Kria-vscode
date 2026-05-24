# Change Log

All notable changes to the "kria" extension will be documented in this file.

## [1.3.0] - 2026-05-24

### Added
- **IDE Features**
  - Hover Information - View documentation for functions, keywords, and variables by hovering
  - Go to Definition - Jump to function/variable definitions with Ctrl+Click
  - IntelliSense/Autocomplete - Context-aware code completion with Ctrl+Space
- For-in object loop syntax highlighting: `for key, value in object`
- Array element assignment pattern recognition: `arr[0] = value`
- Additional code snippets:
  - `forobj` - For-in loop for objects
  - `expfn` - Export function
  - `imp` - Import module
  - `impall` - Import all exports
- TypeScript-based extension architecture with compiled JavaScript output

### Changed
- Upgraded VS Code engine requirement to ^1.75.0 for IDE features support
- Improved syntax highlighting patterns for better code analysis
- Enhanced built-in functions database for IDE features

## [1.1.0] - 2026-05-23

### Added
- Code snippets for common patterns (fn, while, for, if, set, input, array, object, etc.)
- Support for `break` and `continue` statements
- Support for `for-in` loops
- Generic type syntax: `<str>`, `<int>`, `<float>`
- Array support (mutable `[...]` and immutable `#[...]`)
- Array methods: `push()`, `pop()`, `.length`
- Object literals and property access (`.property` and `["key"]`)
- Object method: `rmv()` for property removal
- Enhanced syntax highlighting for arrays, objects, and generics

### Changed
- Updated README with complete language documentation
- Expanded built-in functions support

## [1.0.0] - 2026-05-23

- Initial release