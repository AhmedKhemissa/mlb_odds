'use client';

import { useState } from 'react';
import { MLBGame, TeamStreak } from '@/types';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

interface GameCardProps {
  game: MLBGame;
  homeStreak?: TeamStreak | null;
  awayStreak?: TeamStreak | null;
  onThresholdAlert?: (teamId: string) => boolean;
}

export default function GameCard({ game, homeStreak, awayStreak, onThresholdAlert }: GameCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const getStreakColor = (streak: number, type: 'win' | 'loss') => {
    if (streak === 0) return 'text-gray-400 bg-gray-700/50';
    if (type === 'win') {
      if (streak >= 5) return 'text-emerald-100 bg-emerald-500 font-bold shadow-md';
      if (streak >= 3) return 'text-green-100 bg-green-500 font-semibold';
      return 'text-green-200 bg-green-600/80';
    } else {
      if (streak >= 5) return 'text-red-100 bg-red-500 font-bold shadow-md';
      if (streak >= 3) return 'text-red-100 bg-red-500 font-semibold';
      return 'text-red-200 bg-red-600/80';
    }
  };

  const getOverUnderColor = (streak: number, type: 'over' | 'under') => {
    if (streak === 0) return 'text-gray-400 bg-gray-700/50';
    if (type === 'over') {
      if (streak >= 5) return 'text-blue-100 bg-blue-500 font-bold shadow-md';
      if (streak >= 3) return 'text-blue-100 bg-blue-500 font-semibold';
      return 'text-blue-200 bg-blue-600/80';
    } else {
      if (streak >= 5) return 'text-purple-100 bg-purple-500 font-bold shadow-md';
      if (streak >= 3) return 'text-purple-100 bg-purple-500 font-semibold';
      return 'text-purple-200 bg-purple-600/80';
    }
  };

  const hasAlert = (teamId: string) => {
    return onThresholdAlert ? onThresholdAlert(teamId) : false;
  };

  const renderTeamInfo = (team: typeof game.homeTeam, streak?: TeamStreak | null) => (
    <div className="flex items-center space-x-3">
      <div className="relative flex-shrink-0">
        <Image
          src={team.logo}
          alt={`${team.shortName} logo`}
          width={40}
          height={40}
          className="object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/logos/default.png';
          }}
        />
        {hasAlert(team.id) && (
          <AlertTriangle className="w-4 h-4 text-orange-500 absolute -top-1 -right-1" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-base sm:text-lg truncate">{team.shortName}</div>
        <div className="text-xs sm:text-sm text-gray-400 font-medium truncate">{team.city}</div>
        {streak && (
          <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getStreakColor(streak.winStreak, 'win')}`}>
              W{streak.winStreak}
            </span>
            <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getStreakColor(streak.lossStreak, 'loss')}`}>
              L{streak.lossStreak}
            </span>
            {streak.overStreak > 0 && (
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getOverUnderColor(streak.overStreak, 'over')}`}>
                O{streak.overStreak}
              </span>
            )}
            {streak.underStreak > 0 && (
              <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${getOverUnderColor(streak.underStreak, 'under')}`}>
                U{streak.underStreak}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderOddsSection = (title: string, odds: any, icon: React.ReactNode) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!odds) return null;

    return (
      <div className="bg-gradient-to-br from-gray-700/40 to-gray-800/40 rounded-xl p-3 sm:p-4 border border-gray-600/30 backdrop-blur-sm">
        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
          {icon}
          <span className="font-semibold text-xs sm:text-sm text-white">{title}</span>
        </div>
        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-200">
          {title === 'Money Line' && (
            <>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 min-w-0 flex-1">{game.homeTeam.shortName}</span>
                <span className="font-mono font-semibold flex-shrink-0">{formatOdds(odds.home)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 min-w-0 flex-1">{game.awayTeam.shortName}</span>
                <span className="font-mono font-semibold flex-shrink-0">{formatOdds(odds.away)}</span>
              </div>
            </>
          )}
          {title === 'Run Line' && (
            <>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 min-w-0 flex-1 text-xs sm:text-sm">
                  {game.homeTeam.shortName} {odds.home.point > 0 ? '+' : ''}{odds.home.point}
                </span>
                <span className="font-mono font-semibold flex-shrink-0 text-xs sm:text-sm">{formatOdds(odds.home.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 min-w-0 flex-1 text-xs sm:text-sm">
                  {game.awayTeam.shortName} {odds.away.point > 0 ? '+' : ''}{odds.away.point}
                </span>
                <span className="font-mono font-semibold flex-shrink-0 text-xs sm:text-sm">{formatOdds(odds.away.price)}</span>
              </div>
            </>
          )}
          {title === 'Total' && (
            <>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 min-w-0 flex-1">Over {odds.over.point}</span>
                <span className="font-mono font-semibold flex-shrink-0">{formatOdds(odds.over.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="truncate pr-2 min-w-0 flex-1">Under {odds.under.point}</span>
                <span className="font-mono font-semibold flex-shrink-0">{formatOdds(odds.under.price)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-xl shadow-xl border border-gray-700/50 overflow-hidden backdrop-blur-sm transition-all duration-200 hover:shadow-2xl hover:border-gray-600">
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="text-xs sm:text-sm font-medium text-gray-300 bg-gray-700/50 px-2 sm:px-3 py-1 rounded-full">
              {format(new Date(game.commenceTime), 'h:mm a')}
            </div>
          </div>
          {game.result && (
            <div className="text-xs sm:text-sm font-bold text-emerald-400 bg-emerald-500/20 px-2 sm:px-3 py-1 rounded-full">
              FINAL
            </div>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Away Team */}
          {renderTeamInfo(game.awayTeam, awayStreak)}
          
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent mb-1"></div>
              <div className="text-xs text-gray-400 font-medium tracking-wider">VS</div>
              <div className="w-6 sm:w-8 h-0.5 bg-gradient-to-r from-transparent via-gray-500 to-transparent mt-1"></div>
            </div>
          </div>
          
          {/* Home Team */}
          {renderTeamInfo(game.homeTeam, homeStreak)}
        </div>

        {/* Quick Odds Summary */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {game.odds.moneyLine && (
            <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3 text-center border border-gray-600/30">
              <div className="text-xs text-gray-400 font-medium mb-1">MONEY LINE</div>
              <div className="font-mono text-xs sm:text-sm text-gray-200 font-semibold">
                {formatOdds(game.odds.moneyLine.away)} / {formatOdds(game.odds.moneyLine.home)}
              </div>
            </div>
          )}
          {game.odds.runLine && (
            <div className="bg-gray-700/30 rounded-lg p-2 sm:p-3 text-center border border-gray-600/30">
              <div className="text-xs text-gray-400 font-medium mb-1">RUN LINE</div>
              <div className="font-mono text-xs sm:text-sm text-gray-200 font-semibold">
                {game.odds.runLine.away.point > 0 ? '+' : ''}{game.odds.runLine.away.point} / {game.odds.runLine.home.point > 0 ? '+' : ''}{game.odds.runLine.home.point}
              </div>
            </div>
          )}
          {game.odds.total && (
            <div className={`bg-gray-700/30 rounded-lg p-2 sm:p-3 text-center border border-gray-600/30 ${!game.odds.runLine ? 'col-span-1' : ''}`}>
              <div className="text-xs text-gray-400 font-medium mb-1">TOTAL</div>
              <div className="font-mono text-xs sm:text-sm text-gray-200 font-semibold">O/U {game.odds.total.over.point}</div>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 sm:mt-6 flex items-center justify-center py-2 sm:py-3 text-sm font-medium text-gray-300 hover:text-white bg-gradient-to-r from-gray-700/30 to-gray-600/30 hover:from-gray-600/50 hover:to-gray-500/50 rounded-lg border border-gray-600/20 hover:border-gray-500/40 transition-all duration-200"
        >
          <span className="mr-2">
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {renderOddsSection('Money Line', game.odds.moneyLine, <TrendingUp className="w-4 h-4 text-emerald-400" />)}
              {renderOddsSection('Run Line', game.odds.runLine, <TrendingDown className="w-4 h-4 text-blue-400" />)}
              {renderOddsSection('Total', game.odds.total, <TrendingUp className="w-4 h-4 text-purple-400" />)}
            </div>

            {/* Streak Information */}
            {(homeStreak || awayStreak) && (
              <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-700/30">
                <h4 className="font-semibold text-white mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2"></div>
                  Recent Team Streaks
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  {awayStreak && (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="font-semibold text-gray-200 text-sm sm:text-lg">{game.awayTeam.shortName}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded-lg text-center border ${getStreakColor(awayStreak.winStreak, 'win').includes('bg-green') ? 'border-green-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">WINS</div>
                          <div className={`font-bold text-base sm:text-lg ${getStreakColor(awayStreak.winStreak, 'win')}`}>{awayStreak.winStreak}</div>
                        </div>
                        <div className={`p-2 rounded-lg text-center border ${getStreakColor(awayStreak.lossStreak, 'loss').includes('bg-red') ? 'border-red-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">LOSSES</div>
                          <div className={`font-bold text-base sm:text-lg ${getStreakColor(awayStreak.lossStreak, 'loss')}`}>{awayStreak.lossStreak}</div>
                        </div>
                        <div className={`p-2 rounded-lg text-center border ${getOverUnderColor(awayStreak.overStreak, 'over').includes('bg-blue') ? 'border-blue-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">OVER</div>
                          <div className={`font-bold text-base sm:text-lg ${getOverUnderColor(awayStreak.overStreak, 'over')}`}>{awayStreak.overStreak}</div>
                        </div>
                        <div className={`p-2 rounded-lg text-center border ${getOverUnderColor(awayStreak.underStreak, 'under').includes('bg-purple') ? 'border-purple-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">UNDER</div>
                          <div className={`font-bold text-base sm:text-lg ${getOverUnderColor(awayStreak.underStreak, 'under')}`}>{awayStreak.underStreak}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {homeStreak && (
                    <div className="space-y-2 sm:space-y-3">
                      <div className="font-semibold text-gray-200 text-sm sm:text-lg">{game.homeTeam.shortName}</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className={`p-2 rounded-lg text-center border ${getStreakColor(homeStreak.winStreak, 'win').includes('bg-green') ? 'border-green-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">WINS</div>
                          <div className={`font-bold text-base sm:text-lg ${getStreakColor(homeStreak.winStreak, 'win')}`}>{homeStreak.winStreak}</div>
                        </div>
                        <div className={`p-2 rounded-lg text-center border ${getStreakColor(homeStreak.lossStreak, 'loss').includes('bg-red') ? 'border-red-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">LOSSES</div>
                          <div className={`font-bold text-base sm:text-lg ${getStreakColor(homeStreak.lossStreak, 'loss')}`}>{homeStreak.lossStreak}</div>
                        </div>
                        <div className={`p-2 rounded-lg text-center border ${getOverUnderColor(homeStreak.overStreak, 'over').includes('bg-blue') ? 'border-blue-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">OVER</div>
                          <div className={`font-bold text-base sm:text-lg ${getOverUnderColor(homeStreak.overStreak, 'over')}`}>{homeStreak.overStreak}</div>
                        </div>
                        <div className={`p-2 rounded-lg text-center border ${getOverUnderColor(homeStreak.underStreak, 'under').includes('bg-purple') ? 'border-purple-500/30' : 'border-gray-600/30'}`}>
                          <div className="text-xs text-gray-400 mb-1">UNDER</div>
                          <div className={`font-bold text-base sm:text-lg ${getOverUnderColor(homeStreak.underStreak, 'under')}`}>{homeStreak.underStreak}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
