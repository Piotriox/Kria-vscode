# Change Log

All notable changes to the "kria" extension will be documented in this file.

## [1.4.0] - 2026-06-12

### Fixed
- Bracket linter fixed

## [1.4.0] - 2026-06-12

### Added
- Diagnostics provider for real-time code analysis
  - Undefined function and variable detection
  - Bracket matching validation
  - Invalid input type detection
  - Unreachable code warnings
- Document formatter with Shift+Alt+F support
  - Automatic indentation based on bracket depth
  - Consistent operator and keyword spacing
- Import path autocomplete for .krx files
- Enhanced auto-closing pairs for all bracket types including immutable arrays (#[]) and multi-line strings (""")
- Block comment support with /* */ syntax
- Extended snippet library with 50+ templates
- elseif keyword support
- type() and wait() built-in functions

### Changed
- Extended completion provider trigger characters for import path detection
- Improved language configuration with better indentation patterns

## [1.3.0] - 2026-05-24

### Added
- IDE Features
  - Hover Information for functions, keywords, and variables
  - Go to Definition with Ctrl+Click
  - IntelliSense/Autocomplete with Ctrl+Space
- For-in object loop syntax highlighting
- Array element assignment pattern recognition
- Code snippets: forobj, expfn, imp, impall
- TypeScript-based extension architecture

### Changed
- Upgraded VS Code engine requirement to ^1.75.0
- Improved syntax highlighting patterns
- Enhanced built-in functions database

## [1.1.0] - 2026-05-23

### Added
- Code snippets for common patterns
- Support for break and continue statements
- Support for for-in loops
- Generic type syntax: <str>, <int>, <float>
- Array support (mutable [] and immutable #[])
- Array methods: push(), pop(), .length
- Object literals and property access
- Object method: rmv() for property removal
- Enhanced syntax highlighting for arrays, objects, and generics

### Changed
- Updated README with language documentation
- Expanded built-in functions support

## [1.0.0] - 2026-05-23
- Initial release