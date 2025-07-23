import { TeamStreak, GameResult, UserThreshold, StreakAlert } from '@/types';

export class StreakTracker {
  private streaks: Map<string, TeamStreak> = new Map();
  private thresholds: Map<string, UserThreshold[]> = new Map();

  /**
   * Initialize streak data from local storage
   */
  initializeFromStorage(): void {
    if (typeof window !== 'undefined') {
      const storedStreaks = localStorage.getItem('mlb-streaks');
      const storedThresholds = localStorage.getItem('mlb-thresholds');

      if (storedStreaks) {
        try {
          const parsed = JSON.parse(storedStreaks);
          this.streaks = new Map(Object.entries(parsed));
        } catch (error) {
          console.error('Error parsing stored streaks:', error);
        }
      }

      if (storedThresholds) {
        try {
          const parsed = JSON.parse(storedThresholds);
          this.thresholds = new Map(Object.entries(parsed));
        } catch (error) {
          console.error('Error parsing stored thresholds:', error);
        }
      }
    }
  }

  /**
   * Save streak data to local storage
   */
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      const streaksObj = Object.fromEntries(this.streaks);
      const thresholdsObj = Object.fromEntries(this.thresholds);
      
      localStorage.setItem('mlb-streaks', JSON.stringify(streaksObj));
      localStorage.setItem('mlb-thresholds', JSON.stringify(thresholdsObj));
    }
  }

  /**
   * Update team streaks based on game result
   */
  updateStreaks(teamId: string, gameResult: GameResult, isHomeTeam: boolean): StreakAlert[] {
    let streak = this.streaks.get(teamId);
    
    if (!streak) {
      streak = {
        teamId,
        winStreak: 0,
        lossStreak: 0,
        overStreak: 0,
        underStreak: 0,
        runLineWinStreak: 0,
        runLineLossStreak: 0,
        seriesResults: [],
        lastUpdated: new Date().toISOString()
      };
    }

    const alerts: StreakAlert[] = [];
    const isWinner = (isHomeTeam && gameResult.winner === 'home') || 
                    (!isHomeTeam && gameResult.winner === 'away');

    // Update win/loss streaks
    if (isWinner) {
      streak.winStreak += 1;
      streak.lossStreak = 0;
    } else {
      streak.lossStreak += 1;
      streak.winStreak = 0;
    }

    // Update over/under streaks based on total runs
    // Note: You'd need to get the total from odds data
    // For now, we'll use a placeholder total of 8.5
    const oddsTotal = 8.5; // This should come from the game odds
    const isOver = gameResult.totalRuns > oddsTotal;
    
    if (isOver) {
      streak.overStreak += 1;
      streak.underStreak = 0;
    } else {
      streak.underStreak += 1;
      streak.overStreak = 0;
    }

    // Update run line streaks
    // This is simplified - you'd need actual run line data
    const runLineSpread = isHomeTeam ? -1.5 : 1.5;
    const scoreDiff = isHomeTeam ? 
      gameResult.homeScore - gameResult.awayScore : 
      gameResult.awayScore - gameResult.homeScore;
    
    const coversRunLine = scoreDiff > Math.abs(runLineSpread);
    
    if (coversRunLine) {
      streak.runLineWinStreak += 1;
      streak.runLineLossStreak = 0;
    } else {
      streak.runLineLossStreak += 1;
      streak.runLineWinStreak = 0;
    }

    streak.lastUpdated = new Date().toISOString();
    this.streaks.set(teamId, streak);

    // Check for threshold alerts
    const userThresholds = this.getUserThresholds(teamId);
    alerts.push(...this.checkThresholdAlerts(teamId, streak, userThresholds));

    this.saveToStorage();
    return alerts;
  }

  /**
   * Get streak data for a team
   */
  getTeamStreak(teamId: string): TeamStreak | null {
    return this.streaks.get(teamId) || null;
  }

  /**
   * Get all streaks
   */
  getAllStreaks(): Map<string, TeamStreak> {
    return this.streaks;
  }

  /**
   * Set user thresholds for a team
   */
  setUserThreshold(userId: string, threshold: UserThreshold): void {
    const userThresholds = this.thresholds.get(userId) || [];
    const existingIndex = userThresholds.findIndex(t => t.teamId === threshold.teamId);
    
    if (existingIndex >= 0) {
      userThresholds[existingIndex] = threshold;
    } else {
      userThresholds.push(threshold);
    }
    
    this.thresholds.set(userId, userThresholds);
    this.saveToStorage();
  }

  /**
   * Get user thresholds for a team
   */
  getUserThresholds(teamId: string): UserThreshold[] {
    const allThresholds: UserThreshold[] = [];
    
    for (const userThresholds of this.thresholds.values()) {
      const teamThreshold = userThresholds.find(t => t.teamId === teamId);
      if (teamThreshold) {
        allThresholds.push(teamThreshold);
      }
    }
    
    return allThresholds;
  }

  /**
   * Check if any thresholds are exceeded and create alerts
   */
  private checkThresholdAlerts(teamId: string, streak: TeamStreak, thresholds: UserThreshold[]): StreakAlert[] {
    const alerts: StreakAlert[] = [];
    
    for (const threshold of thresholds) {
      if (!threshold.alertEnabled) continue;

      // Check win streak
      if (streak.winStreak >= threshold.winStreakThreshold && threshold.winStreakThreshold > 0) {
        alerts.push({
          teamId,
          alertType: 'win',
          currentStreak: streak.winStreak,
          threshold: threshold.winStreakThreshold,
          message: `${teamId} has won ${streak.winStreak} games in a row (threshold: ${threshold.winStreakThreshold})`,
          timestamp: new Date().toISOString()
        });
      }

      // Check loss streak
      if (streak.lossStreak >= threshold.lossStreakThreshold && threshold.lossStreakThreshold > 0) {
        alerts.push({
          teamId,
          alertType: 'loss',
          currentStreak: streak.lossStreak,
          threshold: threshold.lossStreakThreshold,
          message: `${teamId} has lost ${streak.lossStreak} games in a row (threshold: ${threshold.lossStreakThreshold})`,
          timestamp: new Date().toISOString()
        });
      }

      // Check over streak
      if (streak.overStreak >= threshold.overStreakThreshold && threshold.overStreakThreshold > 0) {
        alerts.push({
          teamId,
          alertType: 'over',
          currentStreak: streak.overStreak,
          threshold: threshold.overStreakThreshold,
          message: `${teamId} games have gone over ${streak.overStreak} times in a row (threshold: ${threshold.overStreakThreshold})`,
          timestamp: new Date().toISOString()
        });
      }

      // Check under streak
      if (streak.underStreak >= threshold.underStreakThreshold && threshold.underStreakThreshold > 0) {
        alerts.push({
          teamId,
          alertType: 'under',
          currentStreak: streak.underStreak,
          threshold: threshold.underStreakThreshold,
          message: `${teamId} games have gone under ${streak.underStreak} times in a row (threshold: ${threshold.underStreakThreshold})`,
          timestamp: new Date().toISOString()
        });
      }

      // Check run line streak
      if (streak.runLineLossStreak >= threshold.runLineStreakThreshold && threshold.runLineStreakThreshold > 0) {
        alerts.push({
          teamId,
          alertType: 'runline',
          currentStreak: streak.runLineLossStreak,
          threshold: threshold.runLineStreakThreshold,
          message: `${teamId} has failed to cover the run line ${streak.runLineLossStreak} times in a row (threshold: ${threshold.runLineStreakThreshold})`,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return alerts;
  }

  /**
   * Reset all streaks (for testing or new season)
   */
  resetAllStreaks(): void {
    this.streaks.clear();
    this.saveToStorage();
  }

  /**
   * Get teams that exceed any threshold
   */
  getTeamsWithAlerts(): string[] {
    const alertTeams: string[] = [];
    
    for (const [teamId, streak] of this.streaks) {
      const thresholds = this.getUserThresholds(teamId);
      const alerts = this.checkThresholdAlerts(teamId, streak, thresholds);
      
      if (alerts.length > 0) {
        alertTeams.push(teamId);
      }
    }
    
    return alertTeams;
  }
}

export const streakTracker = new StreakTracker();
