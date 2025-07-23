# MLB Odds Tracker

A comprehensive web application for tracking MLB games, odds, and team streaks with custom alert thresholds.

## Features

### Live Odds Integration
- Integrates with [The Odds API](http://the-odds-api.com) to retrieve real-time MLB game data
- Displays DraftKings odds for Money Line, Run Line, and Total (Over/Under) markets
- Day navigation for viewing games on selected dates

### Team Streak Tracking
- **Win/Loss Streaks**: Track consecutive wins and losses for each team
- **Over/Under Streaks**: Monitor how often team games go over or under the total
- **Run Line Outcomes**: Track run line coverage streaks
- **Series Results**: Monitor outcomes for 2, 3, or 4-game series

### Custom Threshold Alerts
- Set custom streak thresholds per team (e.g., alert if Dodgers lose 2+ games in a row)
- Visual indicators when teams meet or exceed thresholds
- Configurable alert preferences for each user

### Secure Access
- Browser-based application with authentication
- Access limited to authorized users (Steven + 1 additional user)
- JWT-based session management

### User Interface
- Clean, responsive design with Tailwind CSS
- Team logos and color indicators for streaks
- Expandable game cards showing detailed odds and streak information
- Real-time updates and refresh functionality

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT implementation
- **API Integration**: The Odds API for live odds data
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- The Odds API key (register at [the-odds-api.com](http://the-odds-api.com))

### Installation

1. **Clone and setup the project**:
   ```bash
   cd "mlb odds"
   npm install
   ```

2. **Configure environment variables**:
   Copy `.env.local` and update with your values:
   ```env
   ODDS_API_KEY=your_odds_api_key_here
   ODDS_API_BASE_URL=https://api.the-odds-api.com/v4
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ALLOWED_USERS=steven@example.com,user2@example.com
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication
- Use one of the configured email addresses in `ALLOWED_USERS`
- Enter any password (4+ characters for demo purposes)
- The app uses JWT tokens stored in HTTP-only cookies

### Viewing Games
- Use the date navigator to browse games by date
- Click "More Details" on game cards to see full odds and streak information
- Refresh button updates odds data from the API

### Setting Up Alerts
1. Click the Settings icon in the header
2. Select a team from the dropdown
3. Configure threshold values for different streak types
4. Enable/disable alerts for each team
5. Save your preferences

### Understanding Streaks
- **Green numbers**: Win streaks (bold for 3+)
- **Red numbers**: Loss streaks (bold for 3+)
- **Orange warning icon**: Team has exceeded a threshold
- **Alert banner**: Shows active alerts when thresholds are met

## API Integration

The application integrates with The Odds API to fetch:
- MLB game schedules
- DraftKings money line odds
- Run line spreads and odds
- Over/Under totals and odds

API calls are cached and rate-limited to respect API quotas.

## Future Expansion

The system is designed for scalability to support additional sports:
- NFL (National Football League)
- NBA (National Basketball Association) 
- NHL (National Hockey League)

The modular architecture allows for easy extension to new sports by:
1. Adding new team data files
2. Creating sport-specific API integrations
3. Implementing sport-specific streak logic

## Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── GameCard.tsx    # Individual game display
│   ├── LoginForm.tsx   # Authentication form
│   ├── DateNavigator.tsx # Date selection
│   └── ThresholdSettings.tsx # Alert configuration
├── lib/                # Utility libraries
│   ├── teams.ts        # MLB team data
│   ├── odds-api.ts     # API integration
│   └── streak-tracker.ts # Streak calculation logic
└── types/              # TypeScript type definitions
    └── index.ts        # Shared types
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for private use only. Unauthorized distribution is prohibited.
