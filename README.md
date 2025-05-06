# Num Nom Dash

<div align="center">

![Version](https://img.shields.io/badge/version-0.6.0-blue.svg?cacheSeconds=2592000)
![Status](https://img.shields.io/badge/status-in_development-green)
![License](https://img.shields.io/badge/license-MIT-yellow)

</div>

A fast-paced mathematical puzzle game where you navigate through mazes collecting numbers that match specific mathematical rules while avoiding glitches!

<div align="center">
  <img src="./public/lovable-uploads/ce72a35c-6820-4164-ba07-21851bf30984.png" alt="Num Nom Dash Character" width="120"/>
</div>

## Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA4ElEQVR4Ae3TOQgCQRSH8TFJEARrG2sPsBFvEE+wUgRBUBALwVJQlMBGRMSTQgSxsxAsxPf/GXgbBreYGViBH3wy7KxZNxkRkQQy6GCMJVbYYIEh2ijCcx3OMcSHw2WoI23NTeABm+JGsOansMQBLsWc0E+JdlzgeU74oYJWG69kYFPYFbmLT2TdFPDzA4OzATxwMoBHtgAkVIDrDfBaAa71K8B2nwDgGYAOIDHAAx4DcAtAApAYoO7qY2QKOJcAYCQB2Ev8iSzkAXlTQAWefTRQMgW0YdNHCzUUsIVNEw3IvQHXG/3cLxB30AAAAABJRU5ErkJggg==)

</div>

## Features

- 🧮 Multiple game types including Even Numbers, Odd Numbers, Prime Numbers, and operation-based challenges
- 🎮 Progressive difficulty with increasing grid sizes (4x4 to 6x6) and complexity
- 🌀 Dynamic mazes with walls and glitch enemies to avoid
- 📱 Optimized for both desktop (keyboard controls) and mobile (touch controls)
- 🏆 Challenge mode with rotating rule types

## Development

### Prerequisites

- Node.js and npm installed ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Setup and Run

```sh
# Clone the repository
git clone https://github.com/spenceriam/num-nom-dash.git

# Navigate to the project directory
cd num-nom-dash

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Build

```sh
# Build for production
npm run build

# Preview the production build
npm run preview
```

## Game Rules

In Num Nom Dash, you navigate through mazes collecting numbers that match a specific rule:

- **Even Numbers**: Collect all even numbers
- **Odd Numbers**: Collect all odd numbers
- **Prime Numbers**: Collect all prime numbers (2, 3, 5, 7, 11, etc.)
- **Additions Of**: Collect expressions that add up to a target number (e.g., for target 10: 5+5, 2+8, 15-5)
- **Multiplications Of**: Collect expressions that multiply to a target number (e.g., for target 12: 3×4, 2×6, 4×3)
- **Factors Of**: Collect all factors of a target number (e.g., for target 12: 1, 2, 3, 4, 6, 12)
- **Subtractions Of**: Collect expressions that subtract to a target number (e.g., for target 5: 10-5, 13-8, 6-1)

## Controls

- **Desktop**: Arrow keys (↑ ↓ ← →) or QEZC for diagonal movement
- **Mobile**: Swipe gestures or tap to move
- **Mouse**: Click a cell to move there

## Project Origin

This project was initially created with [Lovable](https://lovable.dev/projects/b9f54261-ed74-4771-a456-e3f9fb52ee95), and is now being developed further as an open-source mathematical puzzle game.

## License

MIT © 2025