'use client';

import { useState } from 'react';
import { UserThreshold } from '@/types';
import { MLB_TEAMS } from '@/lib/teams';
import { Settings, Save, X } from 'lucide-react';
import Image from 'next/image';

interface ThresholdSettingsProps {
  userThresholds: UserThreshold[];
  onSaveThreshold: (threshold: UserThreshold) => void;
  onClose: () => void;
}

export default function ThresholdSettings({ userThresholds, onSaveThreshold, onClose }: ThresholdSettingsProps) {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [thresholds, setThresholds] = useState<Partial<UserThreshold>>({
    winStreakThreshold: 3,
    lossStreakThreshold: 2,
    overStreakThreshold: 3,
    underStreakThreshold: 3,
    runLineStreakThreshold: 3,
    alertEnabled: true
  });

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
    const existingThreshold = userThresholds.find(t => t.teamId === teamId);
    if (existingThreshold) {
      setThresholds(existingThreshold);
    } else {
      setThresholds({
        winStreakThreshold: 3,
        lossStreakThreshold: 2,
        overStreakThreshold: 3,
        underStreakThreshold: 3,
        runLineStreakThreshold: 3,
        alertEnabled: true
      });
    }
  };

  const handleSave = () => {
    if (!selectedTeam) return;

    const threshold: UserThreshold = {
      teamId: selectedTeam,
      winStreakThreshold: thresholds.winStreakThreshold || 0,
      lossStreakThreshold: thresholds.lossStreakThreshold || 0,
      overStreakThreshold: thresholds.overStreakThreshold || 0,
      underStreakThreshold: thresholds.underStreakThreshold || 0,
      runLineStreakThreshold: thresholds.runLineStreakThreshold || 0,
      alertEnabled: thresholds.alertEnabled || false
    };

    onSaveThreshold(threshold);
    setSelectedTeam('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-gray-300" />
            <h2 className="text-xl font-semibold text-white">Streak Alert Thresholds</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Team Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a team...</option>
              {MLB_TEAMS.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          {/* Threshold Configuration */}
          {selectedTeam && (
            <div className="space-y-6 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <h3 className="font-medium text-white mb-4">
                  Alert Thresholds for {MLB_TEAMS.find(t => t.id === selectedTeam)?.shortName}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Win Streak Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={thresholds.winStreakThreshold || 0}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        winStreakThreshold: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">Alert when team wins this many games in a row</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Loss Streak Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={thresholds.lossStreakThreshold || 0}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        lossStreakThreshold: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-400 mt-1">Alert when team loses this many games in a row</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Over Streak Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={thresholds.overStreakThreshold || 0}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        overStreakThreshold: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when team games go over this many times in a row</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Under Streak Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={thresholds.underStreakThreshold || 0}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        underStreakThreshold: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when team games go under this many times in a row</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Run Line Streak Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={thresholds.runLineStreakThreshold || 0}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        runLineStreakThreshold: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Alert when team fails to cover run line this many times in a row</p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="alertEnabled"
                      checked={thresholds.alertEnabled || false}
                      onChange={(e) => setThresholds({
                        ...thresholds,
                        alertEnabled: e.target.checked
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="alertEnabled" className="ml-2 block text-sm text-gray-700">
                      Enable alerts for this team
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Threshold
                </button>
              </div>
            </div>
          )}

          {/* Current Thresholds */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Current Thresholds</h3>
            {userThresholds.length === 0 ? (
              <p className="text-gray-500 text-sm">No thresholds configured yet.</p>
            ) : (
              <div className="space-y-2">
                {userThresholds.map(threshold => {
                  const team = MLB_TEAMS.find(t => t.id === threshold.teamId);
                  return (
                    <div key={threshold.teamId} className="flex items-center justify-between bg-gray-50 rounded p-3">
                      <div className="flex items-center space-x-3">
                        <Image
                          src={team?.logo || '/logos/default.png'}
                          alt={team?.shortName || 'Team logo'}
                          width={24}
                          height={24}
                          className="object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logos/default.png';
                          }}
                        />
                        <span className="font-medium">{team?.shortName}</span>
                        <span className={`px-2 py-1 rounded text-xs ${threshold.alertEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {threshold.alertEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        W:{threshold.winStreakThreshold} L:{threshold.lossStreakThreshold} O:{threshold.overStreakThreshold} U:{threshold.underStreakThreshold} RL:{threshold.runLineStreakThreshold}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
