# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.8] - 2023-05-06

### Added
- Added 5-second delay before Glitches appear at the start of each level
- Added notification when Glitches appear

## [0.1.7] - 2023-05-06

### Fixed
- Fixed issue with Num-Nom character not mirroring when moving left
- Fixed issue with Glitch characters not appearing in the game

## [0.1.6] - 2023-05-06

### Changed
- Updated character images with new transparent background versions:
  - Replaced Num-Nom image with improved transparent version
  - Replaced Glitch image with improved transparent version
- Added character mirroring when moving left:
  - Num-Nom now faces left when moving left
  - Glitch now faces left when moving left

## [0.1.5] - 2023-05-05

### Added
- Complete implementation of all game types:
  - Even Numbers
  - Odd Numbers
  - Prime Numbers
  - Additions (with dynamic targets: 10, 15, 20)
  - Multiples (with dynamic targets: 12, 16, 24)
  - Factors (with dynamic targets: 12, 16, 24)
  - Subtractions (with dynamic targets: 5, 8, 10)
- Refined glitch AI behavior for different difficulty levels:
  - Early levels: Random movement with occasional basic chase
  - Mid levels: Basic pathfinding with occasional pauses
  - Advanced levels: Smart pathfinding with fewer pauses
- Proper level progression system with 15 levels of increasing difficulty
- Wall obstacles in higher levels
- Responsive grid sizing based on level difficulty (6x6 to 9x9)
- Enhanced expression generation for all operation types
- Math helper functions for game logic

### Changed
- Improved maze generation to support different grid sizes
- Enhanced glitch movement logic with better pathfinding
- Updated GameBoard component to support dynamic grid sizing
- Refined difficulty progression across levels

### Fixed

### Removed
