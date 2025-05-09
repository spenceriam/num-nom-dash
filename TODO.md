# Num Nom Dash - TODO List

This document outlines the tasks for the Num Nom Dash project overhaul.

## Project Version: 0.5.0
Date: 2025-05-05

## 1. Overhaul Game Types and Levels (HIGH PRIORITY)

- [ ] Refactor game types to match PRD specifications
  - [ ] Update types.ts with new interfaces and type definitions (Expression, GameType, etc.)
  - [ ] Implement improved Rule interface with validate, description, and target generation
  - [ ] Create validation methods for all game types (even, odd, prime, etc.)
- [ ] Implement new expression types
  - [ ] Create Expression interface with display, value, operation, and operands
  - [ ] Build expression generators for each operation type
  - [ ] Develop expression rendering components
- [ ] Enhance level generation
  - [ ] Implement difficulty progression (4x4 to 6x6 grids)
  - [ ] Create algorithm for appropriate number/expression placement
  - [ ] Add wall generation for higher levels
  - [ ] Adjust glitch count and behavior based on level

## 2. Visual Improvements (HIGH PRIORITY)

*Awaiting user input on specific visual issues*

- [ ] Review current UI/UX flow
- [ ] Ensure mobile-first responsive design
- [ ] Maintain consistent game board size across devices
- [ ] Improve visual feedback for game events (collection, errors)
- [ ] Enhance readability of expressions on smaller screens

## 3. Game Mechanics, Levels, and AI (MEDIUM PRIORITY)

- [ ] Implement improved glitch AI behavior
  - [ ] Level 1-2: Random movement
  - [ ] Level 3-5: Basic pathfinding
  - [ ] Level 6+: Smart pathfinding
- [ ] Develop level progression system
  - [ ] Define clear difficulty curve
  - [ ] Create more engaging level designs
  - [ ] Implement challenge mode with rotating game types
- [ ] Enhance player movement
  - [ ] Optimize keyboard controls
  - [ ] Implement touch controls
  - [ ] Add click/tap destination movement
- [ ] Add game loop logic as specified in PRD
  - [ ] Handle player input
  - [ ] Process number collection with rule validation
  - [ ] Manage glitch collisions
  - [ ] Track level completion and game over states

## 4. Single Player Experience (MEDIUM PRIORITY)

- [ ] Focus all game mechanics on single player
- [ ] Improve score tracking and high score system
  - [ ] Store high scores locally by game type
  - [ ] Implement score calculation based on speed and accuracy
- [ ] Add session persistence
  - [ ] Save game state in local storage
  - [ ] Allow resuming from last played level

## 5. Local Build and Testing (HIGH PRIORITY)

- [ ] Ensure build process is reliable
- [ ] Fix any TypeScript errors
- [ ] Implement comprehensive testing
  - [ ] Test all game rules and validation logic
  - [ ] Verify level generation works correctly
  - [ ] Test mobile and desktop controls
- [ ] Optimize performance
  - [ ] Reduce unnecessary rerenders
  - [ ] Optimize game loop logic

## 6. Future Enhancements (LOW PRIORITY)

*Awaiting user input on desired features*

- [ ] Additional game types
- [ ] Achievements system
- [ ] Custom difficulty settings
- [ ] Theme customization
- [ ] Sound effects and background music

## Task Status Legend

- ✓ = Complete
- 🔄 = In Progress
- ❌ = Cancelled