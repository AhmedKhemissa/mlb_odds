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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-8 h-8 text-blue-400" />
                <h1 className="text-xl font-bold text-white">MLB Odds Tracker</h1>
              </div>
              {lastUpdated && (
                <div className="text-sm text-gray-300">
                  <div>Last updated: {format(lastUpdated, 'h:mm:ss a')}</div>
                  <div className="text-xs text-green-400">📡 Live data from The Odds API</div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Active Alerts */}
              {alertCount > 0 && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-orange-900 text-orange-300 rounded-full">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{alertCount} Alert{alertCount !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Action Buttons */}
              <button
                onClick={fetchGames}
                disabled={isLoading}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Users className="w-4 h-4" />
                <span>{user.email}</span>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Navigator */}
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          className="mb-8"
        />

        {/* Active Alerts Section */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-orange-900 border border-orange-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h2 className="font-medium text-orange-300">Active Streak Alerts</h2>
              </div>
              <div className="space-y-2">
                {activeAlerts.map((alert, index) => (
                  <div key={index} className="text-sm text-orange-200">
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-900 border border-red-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading games...</p>
          </div>
        )}

        {/* Games Grid */}
        {!isLoading && games.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        )}

        {/* No Games Message */}
        {!isLoading && games.length === 0 && !error && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No games scheduled</h3>
            <p className="text-gray-300">
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
