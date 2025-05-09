# 🎮 Num-Nom Dash

[![Status](https://img.shields.io/badge/Status-In%20Development-yellow)](https://github.com/spenceriam/num-nom-dash)
[![Version](https://img.shields.io/badge/Version-0.1.8-blue)](https://github.com/spenceriam/num-nom-dash/blob/main/changelog.md)
[![License](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <img src="public/Num-Nom.png" alt="Num-Nom Character" width="150">
</p>

## 📖 Overview

Num-Nom Dash is an engaging educational math game where players guide the adorable Num-Nom character through a grid-based maze to collect numbers that match specific mathematical rules. Avoid the mischievous Glitches while solving mathematical challenges across 15 progressively difficult levels!

Perfect for students, educators, and anyone looking to sharpen their math skills in a fun, interactive environment.

## ✨ Features

- **15 Progressive Levels**: From simple even/odd numbers to complex mathematical operations
- **Diverse Math Challenges**: Even/odd numbers, prime numbers, addition, multiplication, factors, and subtraction
- **Adaptive Difficulty**: Grid size and challenge complexity increase as you advance
- **Dynamic Enemies**: Glitches with intelligent movement patterns that adapt to your level
- **Responsive Design**: Play on desktop or mobile devices with touch/swipe support
- **Visual Feedback**: Character mirroring, transparent backgrounds, and notifications
- **Score Tracking**: Compete for high scores across different game modes

## 🎯 Game Mechanics

- **Goal**: Collect all numbers that match the level's mathematical rule
- **Controls**:
  - Desktop: Arrow keys or click adjacent cells
  - Mobile: Swipe or tap adjacent cells
- **Lives**: 3 lives per level
- **Scoring**: +10 points for each correct number collected
- **Obstacles**:
  - Glitches that appear after 5 seconds and chase you
  - Wall obstacles in higher levels
  - Wrong numbers that cost you a life if collected

## 🔢 Level Progression

| Level | Rule Type | Description | Grid Size | Glitches |
|-------|-----------|-------------|-----------|----------|
| 1-3   | Basic Numbers | Even, Odd, Prime | 6×6 | 1 (Random movement) |
| 4-6   | Addition | Sum to 10, 15, 20 | 7×7 | 1-2 (Basic chase) |
| 7-9   | Multiplication | Multiples of 12, 16, 24 | 8×8 | 2 (Smarter pathfinding) |
| 10-12 | Factors | Factors of 12, 16, 24 | 8×8 | 2 (Advanced chase) |
| 13-15 | Subtraction | Difference of 5, 8, 10 | 9×9 | 3 (Smart pathfinding) |

## 🧩 Characters

- **Num-Nom**: The player character who loves collecting numbers
- **Glitches**: Enemy characters that chase Num-Nom and try to consume valid numbers

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui
- **State Management**: React Hooks
- **Notifications**: Sonner
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone https://github.com/spenceriam/num-nom-dash.git

# Navigate to the project directory
cd num-nom-dash

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📝 Development Roadmap

Check out our [Todo List](https://github.com/spenceriam/num-nom-dash/blob/main/todo.md) to see what features are coming next!

## 📜 Changelog

View our [Changelog](https://github.com/spenceriam/num-nom-dash/blob/main/changelog.md) to track the project's evolution.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
