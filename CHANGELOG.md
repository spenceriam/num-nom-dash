# Changelog

All notable changes to the Num Nom Dash project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0] - In Progress

### Added
- New game types as specified in PRD: Even, Odd, Prime, AdditionsOf, MultiplesOf, FactorsOf, SubtractionsOf
- Expression interface with display, value, operation, and operands properties
- Rule interface with validate, description, and target generation capabilities
- Enhanced level generation with difficulty progression (4x4 to 6x6 grids)
- Dynamic wall and glitch placement based on level difficulty
- Challenge mode with rotating game types
- Sanity check instructions in CLAUDE.md to verify builds before commits

### Changed
- Refactored types.ts with updated interfaces and type definitions
- Improved expression handling for different operation types (addition, subtraction, multiplication, division)
- Enhanced maze generation algorithm with better expression placement
- Replaced eval() with Function() for slightly improved security in expression evaluation
- Better mathematical symbols for multiplication (×) and division (÷)
- Updated player movement to handle dynamic grid sizes
- Improved rule description display with target number interpolation

### Fixed
- Fixed duplicate game type buttons on home screen
- Fixed GameCell rule validation for expressions
- Fixed player movement bounds based on grid size
- Fixed GameContainer to pass targetNumber to child components

## [0.5.0] - 2025-05-05

### Added
- Created TODO.md for tracking project tasks
- Created CHANGELOG.md for tracking project changes
- Added PRD.md with comprehensive project requirements and specifications

### Changed
- Updated CLAUDE.md with housekeeping and visual guidelines

### Fixed
- N/A (Initial setup for project overhaul)

## [0.4.0] - (Previous release)

### Added
- Initial game implementation with basic game mechanics
- Basic level progression
- Simple enemy AI
- Score tracking
- Basic UI components

### Changed
- N/A

### Fixed
- N/A