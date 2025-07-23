'use client';

import { useState, useEffect, useCallback } from 'react';
import { MLBGame, TeamStreak, UserThreshold, StreakAlert } from '@/types';
import { streakTracker } from '@/lib/streak-tracker';
import DateNavigator from './DateNavigator';
import GameCard from './GameCard';
import ThresholdSettings from './ThresholdSettings';
import { format } from 'date-fns';
import { 
  RefreshCw, 
  Settings, 
  LogOut, 
  AlertTriangle,
  Trophy,
  Calendar,
  Users
} from 'lucide-react';

interface DashboardProps {
  user: { email: string };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [games, setGames] = useState<MLBGame[]>([]);
  const [streaks, setStreaks] = useState<Map<string, TeamStreak>>(new Map());
  const [userThresholds, setUserThresholds] = useState<UserThreshold[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      console.log('🎯 Fetching games for date:', dateString);
      
      const response = await fetch(`/api/odds?date=${dateString}`);
      const data = await response.json();
      
      console.log('📊 API Response:', data);
      
      if (data.success) {
        setGames(data.data);
        setLastUpdated(new Date());
        console.log('✅ Successfully loaded', data.count, 'games from The Odds API');
      } else {
        setError(data.error || 'Failed to fetch games');
        console.error('❌ API Error:', data.error);
      }
    } catch (error) {
      console.error('❌ Network error fetching games:', error);
      setError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    // Initialize streak tracker
    streakTracker.initializeFromStorage();
    setStreaks(streakTracker.getAllStreaks());
    
    // Load user thresholds from localStorage
    const savedThresholds = localStorage.getItem(`thresholds-${user.email}`);
    if (savedThresholds) {
      try {
        setUserThresholds(JSON.parse(savedThresholds));
      } catch (error) {
        console.error('Error loading user thresholds:', error);
      }
    }

    // Load initial games
    fetchGames();
  }, [selectedDate, user.email, fetchGames]);

  const handleSaveThreshold = (threshold: UserThreshold) => {
    const updatedThresholds = [...userThresholds];
    const existingIndex = updatedThresholds.findIndex(t => t.teamId === threshold.teamId);
    
    if (existingIndex >= 0) {
      updatedThresholds[existingIndex] = threshold;
    } else {
      updatedThresholds.push(threshold);
    }
    
    setUserThresholds(updatedThresholds);
    localStorage.setItem(`thresholds-${user.email}`, JSON.stringify(updatedThresholds));
    
    // Update streak tracker with new threshold
    streakTracker.setUserThreshold(user.email, threshold);
  };

  const hasThresholdAlert = (teamId: string): boolean => {
    const teamStreak = streaks.get(teamId);
    if (!teamStreak) return false;
    
    const teamThresholds = userThresholds.filter(t => t.teamId === teamId && t.alertEnabled);
    
    return teamThresholds.some(threshold => {
      return (
        (threshold.winStreakThreshold > 0 && teamStreak.winStreak >= threshold.winStreakThreshold) ||
        (threshold.lossStreakThreshold > 0 && teamStreak.lossStreak >= threshold.lossStreakThreshold) ||
        (threshold.overStreakThreshold > 0 && teamStreak.overStreak >= threshold.overStreakThreshold) ||
        (threshold.underStreakThreshold > 0 && teamStreak.underStreak >= threshold.underStreakThreshold) ||
        (threshold.runLineStreakThreshold > 0 && teamStreak.runLineLossStreak >= threshold.runLineStreakThreshold)
      );
    });
  };

  const getActiveAlerts = (): StreakAlert[] => {
    const activeAlerts: StreakAlert[] = [];
    
    for (const [teamId, streak] of streaks) {
      const teamThresholds = userThresholds.filter(t => t.teamId === teamId && t.alertEnabled);
      
      for (const threshold of teamThresholds) {
        if (threshold.winStreakThreshold > 0 && streak.winStreak >= threshold.winStreakThreshold) {
          activeAlerts.push({
            teamId,
            alertType: 'win',
            currentStreak: streak.winStreak,
            threshold: threshold.winStreakThreshold,
            message: `${teamId} has won ${streak.winStreak} games in a row`,
            timestamp: new Date().toISOString()
          });
        }
        
        if (threshold.lossStreakThreshold > 0 && streak.lossStreak >= threshold.lossStreakThreshold) {
          activeAlerts.push({
            teamId,
            alertType: 'loss',
            currentStreak: streak.lossStreak,
            threshold: threshold.lossStreakThreshold,
            message: `${teamId} has lost ${streak.lossStreak} games in a row`,
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return activeAlerts;
  };

  const activeAlerts = getActiveAlerts();
  const alertCount = activeAlerts.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4 lg:h-18 gap-4 lg:gap-0">
            {/* Left Section - Logo and Status */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full lg:w-auto">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-lg sm:text-xl font-bold text-white">MLB Odds Tracker</h1>
                  <div className="text-xs text-gray-400 hidden sm:block">Live Betting Intelligence</div>
                </div>
              </div>
              {lastUpdated && (
                <div className="text-sm text-gray-300 bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600/30 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm">Updated: {format(lastUpdated, 'h:mm:ss a')}</span>
                  </div>
                  <div className="text-xs text-emerald-400 mt-1">Live from The Odds API</div>
                </div>
              )}
            </div>

            {/* Right Section - Actions and User */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              {/* Active Alerts */}
              {alertCount > 0 && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 rounded-full border border-orange-500/30 backdrop-blur-sm">
                  <AlertTriangle className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-semibold">{alertCount} Alert{alertCount !== 1 ? 's' : ''}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-center">
                {/* Action Buttons */}
                <div className="flex items-center space-x-1 bg-gray-700/30 rounded-xl p-1 border border-gray-600/30">
                  <button
                    onClick={fetchGames}
                    disabled={isLoading}
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-200"
                    title="Refresh Data"
                  >
                    <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-600/50 rounded-lg transition-all duration-200"
                    title="Alert Settings"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* User Info - Hidden on mobile, shown on larger screens */}
                <div className="hidden sm:flex items-center space-x-2 bg-gray-700/30 rounded-xl px-3 py-2 border border-gray-600/30">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-300 truncate max-w-32 lg:max-w-none">{user.email}</span>
                </div>

                <button
                  onClick={onLogout}
                  className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-gray-600/30"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Date Navigator */}
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          className="mb-6 sm:mb-8"
        />

        {/* Active Alerts Section */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h2 className="font-semibold text-orange-300">Active Streak Alerts</h2>
              </div>
              <div className="space-y-2">
                {activeAlerts.map((alert, index) => (
                  <div key={index} className="text-sm text-orange-200 bg-orange-800/20 rounded-lg p-2">
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-red-900/50 to-red-800/50 border border-red-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 sm:py-16">
            <RefreshCw className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300 text-sm sm:text-base">Loading games...</p>
          </div>
        )}

        {/* Games Grid */}
        {!isLoading && games.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Today's Games</h2>
              <div className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full self-start sm:self-auto">
                {games.length} game{games.length !== 1 ? 's' : ''} scheduled
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {games.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  homeStreak={streaks.get(game.homeTeam.id)}
                  awayStreak={streaks.get(game.awayTeam.id)}
                  onThresholdAlert={hasThresholdAlert}
                />
              ))}
            </div>
          </div>
        )}

        {/* No Games Message */}
        {!isLoading && games.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16">
            <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-medium text-white mb-2">No games scheduled</h3>
            <p className="text-gray-300 text-sm sm:text-base px-4">
              There are no MLB games scheduled for {format(selectedDate, 'EEEE, MMMM d, yyyy')}.
            </p>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <ThresholdSettings
          userThresholds={userThresholds}
          onSaveThreshold={handleSaveThreshold}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
