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
    if (streak === 0) return 'text-gray-500';
    if (type === 'win') {
      return streak >= 3 ? 'text-green-600 font-bold' : 'text-green-500';
    } else {
      return streak >= 3 ? 'text-red-600 font-bold' : 'text-red-500';
    }
  };

  const hasAlert = (teamId: string) => {
    return onThresholdAlert ? onThresholdAlert(teamId) : false;
  };

  const renderTeamInfo = (team: typeof game.homeTeam, streak?: TeamStreak | null) => (
    <div className="flex items-center space-x-3">
      <div className="relative">
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
      <div className="flex-1">
        <div className="font-medium text-gray-900">{team.shortName}</div>
        <div className="text-sm text-gray-500">{team.city}</div>
        {streak && (
          <div className="flex space-x-2 text-xs mt-1">
            <span className={getStreakColor(streak.winStreak, 'win')}>
              W{streak.winStreak}
            </span>
            <span className={getStreakColor(streak.lossStreak, 'loss')}>
              L{streak.lossStreak}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderOddsSection = (title: string, odds: any, icon: React.ReactNode) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!odds) return null;

    return (
      <div className="bg-gray-50 rounded p-3">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <span className="font-medium text-sm text-gray-700">{title}</span>
        </div>
        <div className="space-y-1 text-sm">
          {title === 'Money Line' && (
            <>
              <div className="flex justify-between">
                <span>{game.homeTeam.shortName}</span>
                <span className="font-mono">{formatOdds(odds.home)}</span>
              </div>
              <div className="flex justify-between">
                <span>{game.awayTeam.shortName}</span>
                <span className="font-mono">{formatOdds(odds.away)}</span>
              </div>
            </>
          )}
          {title === 'Run Line' && (
            <>
              <div className="flex justify-between">
                <span>{game.homeTeam.shortName} {odds.home.point > 0 ? '+' : ''}{odds.home.point}</span>
                <span className="font-mono">{formatOdds(odds.home.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>{game.awayTeam.shortName} {odds.away.point > 0 ? '+' : ''}{odds.away.point}</span>
                <span className="font-mono">{formatOdds(odds.away.price)}</span>
              </div>
            </>
          )}
          {title === 'Total' && (
            <>
              <div className="flex justify-between">
                <span>Over {odds.over.point}</span>
                <span className="font-mono">{formatOdds(odds.over.price)}</span>
              </div>
              <div className="flex justify-between">
                <span>Under {odds.under.point}</span>
                <span className="font-mono">{formatOdds(odds.under.price)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            {format(new Date(game.commenceTime), 'h:mm a')}
          </div>
          {game.result && (
            <div className="text-sm font-medium text-green-600">Final</div>
          )}
        </div>

        <div className="space-y-4">
          {/* Away Team */}
          {renderTeamInfo(game.awayTeam, awayStreak)}
          
          <div className="text-center text-gray-400 font-medium">vs</div>
          
          {/* Home Team */}
          {renderTeamInfo(game.homeTeam, homeStreak)}
        </div>

        {/* Quick Odds Summary */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {game.odds.moneyLine && (
            <div className="text-center">
              <div className="text-gray-500">ML</div>
              <div className="font-mono">
                {formatOdds(game.odds.moneyLine.away)} / {formatOdds(game.odds.moneyLine.home)}
              </div>
            </div>
          )}
          {game.odds.runLine && (
            <div className="text-center">
              <div className="text-gray-500">RL</div>
              <div className="font-mono">
                {game.odds.runLine.away.point > 0 ? '+' : ''}{game.odds.runLine.away.point} / {game.odds.runLine.home.point > 0 ? '+' : ''}{game.odds.runLine.home.point}
              </div>
            </div>
          )}
          {game.odds.total && (
            <div className="text-center">
              <div className="text-gray-500">O/U</div>
              <div className="font-mono">{game.odds.total.over.point}</div>
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 flex items-center justify-center py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors"
        >
          <span className="mr-1">
            {isExpanded ? 'Less Details' : 'More Details'}
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
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderOddsSection('Money Line', game.odds.moneyLine, <TrendingUp className="w-4 h-4" />)}
            {renderOddsSection('Run Line', game.odds.runLine, <TrendingDown className="w-4 h-4" />)}
            {renderOddsSection('Total', game.odds.total, <TrendingUp className="w-4 h-4" />)}
          </div>

          {/* Streak Information */}
          {(homeStreak || awayStreak) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-700 mb-3">Team Streaks</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {awayStreak && (
                  <div>
                    <div className="font-medium">{game.awayTeam.shortName}</div>
                    <div className="space-y-1 mt-1">
                      <div>Win: <span className={getStreakColor(awayStreak.winStreak, 'win')}>{awayStreak.winStreak}</span></div>
                      <div>Loss: <span className={getStreakColor(awayStreak.lossStreak, 'loss')}>{awayStreak.lossStreak}</span></div>
                      <div>Over: <span className="text-blue-600">{awayStreak.overStreak}</span></div>
                      <div>Under: <span className="text-purple-600">{awayStreak.underStreak}</span></div>
                    </div>
                  </div>
                )}
                {homeStreak && (
                  <div>
                    <div className="font-medium">{game.homeTeam.shortName}</div>
                    <div className="space-y-1 mt-1">
                      <div>Win: <span className={getStreakColor(homeStreak.winStreak, 'win')}>{homeStreak.winStreak}</span></div>
                      <div>Loss: <span className={getStreakColor(homeStreak.lossStreak, 'loss')}>{homeStreak.lossStreak}</span></div>
                      <div>Over: <span className="text-blue-600">{homeStreak.overStreak}</span></div>
                      <div>Under: <span className="text-purple-600">{homeStreak.underStreak}</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
