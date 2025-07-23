# Copilot Instructions for MLB Odds Tracker

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js TypeScript application for tracking MLB odds and team streaks with the following key features:

## Core Features
1. **Live MLB Odds Integration**: Integrates with the-odds-api.com to fetch real-time MLB game data and DraftKings odds for Money Line, Run Line, and Total (Over/Under) markets
2. **Team Streak Tracking**: Tracks win/loss streaks, over/under streaks, run line outcomes, and series results (2, 3, or 4-game series)
3. **Custom Threshold Alerts**: Allows users to set custom streak thresholds per team with visual alerts when exceeded
4. **Secure Authentication**: Browser-based access limited to two users (Steven + 1) with basic login system
5. **Day Navigation**: Display games for selected day with navigation for previous and upcoming days

## Technical Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js or custom JWT-based auth
- **Data Storage**: Local storage/session storage for user preferences, external API for live data
- **API Integration**: the-odds-api.com for live odds data

## UI Requirements
- Clean, readable interface with team logos
- Color indicators for streaks (red for loss streaks, green for win streaks)
- Expandable dropdowns for recent game logs and stats
- Responsive design for various screen sizes
- Game schedule view with easy day navigation

## Architecture Considerations
- Designed for scalability to support future sports (NFL, NBA, NHL)
- Modular component structure
- Centralized state management for streak data
- Efficient API caching and rate limiting
- Error handling for external API failures

## Code Style Guidelines
- Use TypeScript strict mode
- Follow Next.js best practices for App Router
- Implement proper error boundaries
- Use Tailwind CSS for styling consistency
- Follow accessibility guidelines (WCAG)
- Implement proper loading states and error handling
