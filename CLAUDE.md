# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Install dependencies
npm i

# Start development server with auto-reloading
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Lint the codebase
npm lint

# Preview the production build
npm run preview
```

## Project Architecture

Num-Nom-Dash is a mathematical maze game built with React, TypeScript, and Vite. The game challenges players to navigate through mazes collecting numbers that match specific mathematical rules.

### Core Components

1. **Application Structure**
   - React Router manages navigation between home page, game screen, and high scores
   - Main game flow managed by `Index.tsx` which controls the game state: starting, playing, or game over

2. **Game Architecture**
   - `Game.tsx`: Core game component that orchestrates game mechanics
   - Custom hooks for game logic:
     - `useGameState.ts`: Manages game state (level, score, lives)
     - `useGameInitialization.ts`: Initializes game levels
     - `usePlayerMovement.ts`: Handles player movement logic

3. **Game Mechanics**
   - `levels.ts`: Defines mathematical rules for each level
   - `GameBoard.tsx`: Renders the game grid
   - `GameCell.tsx`: Individual cell components that make up the board
   - Challenge mode vs standard level progression

4. **Game Logic**
   - Mathematical rule evaluation based on expressions
   - `rules.ts`: Provides rule definitions and validation logic
   - Mazes are generated dynamically with walls, player position, and target numbers
   - Glitch entities move towards the player, adding difficulty

5. **UI Components**
   - Uses shadcn-ui for consistent, styled UI components
   - Tailwind CSS for styling

## Key Files

- `/src/components/game/Game.tsx`: Main game component
- `/src/components/game/types.ts`: Type definitions for game entities
- `/src/components/game/levels.ts`: Game level definitions and rules
- `/src/components/game/rules.ts`: Rule definitions and validation logic
- `/src/components/game/hooks/`: Custom hooks for game mechanics
- `/src/pages/Index.tsx`: Manages overall game flow and state transitions

## Development Notes

- The game evaluates mathematical expressions against rules (e.g., even numbers, odd numbers, primes)
- Position-based movement with keyboard, touch, and click interactions
- Game supports both standard progression through predefined levels and a challenge mode
- High scores are tracked locally

## Housekeeping Notes

- Always perform a sanity check before committing changes:
  1. Run `npm run build` to verify no build errors
  2. Run `npm run dev` and do a quick visual check of the application
  3. Verify key functionality works: level selection, game play, rule validation
  4. Check for any UI issues like duplicate buttons, formatting problems, etc.
- Always request after a significant change to the codebase to create a git commit and push to origin - Github repo: https://github.com/spenceriam/num-nom-dash
- Check if a changelog.md exists and update it with any changes made to the codebase using https://keepachangelog.com/en/1.1.0/ as a reference or template. Always put the current date and changes made starting with version 0.5.0
- Check if a todo.md exists and update it with any changes made to the codebase using https://github.com/todomd/todo.md/blob/master/TODO.md as a reference or template. Always put the current date and changes made starting with version 0.5.0
- Check if a .gitignore exists and do analysis to ensure the right files shouldn't be updated back to the Github repo
- Check if readme.md exists and update it with any changes made to the codebase
- If you are unsure about the requirements, always check for a prd.md file in the project directory

# Visual changes Notes

- Always ask for approval before making visual changes to the game
- Ensure that the visual changes are consistent with the game's overall aesthetic
- Ensure that the visual changes are consistent with the game's overall theme
- Ensure that the visual changes are consistent with the game's overall style
- Ensure that this is a mobile first design, then scale up to large screens only for the background. The game board should always be the same size as the mobile version unless the screen size is too small to fit the game board then scale down