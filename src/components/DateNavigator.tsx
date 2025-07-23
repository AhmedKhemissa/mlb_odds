'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';
import CalendarModal from './Calendar';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export default function DateNavigator({ selectedDate, onDateChange, className = '' }: DateNavigatorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const goToPreviousDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'EEEE, MMMM d');
  };

  return (
    <>
      <div className={`flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-gray-800/60 to-gray-700/60 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-700/50 gap-4 sm:gap-0 ${className}`}>
        {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <button
            onClick={goToPreviousDay}
            className="flex items-center px-3 sm:px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-600/40 rounded-xl transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="ml-1 sm:ml-2 text-sm sm:text-base font-medium hidden xs:inline">Prev</span>
            <span className="ml-1 sm:ml-2 text-sm sm:text-base font-medium hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={goToNextDay}
            className="flex items-center px-3 sm:px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-600/40 rounded-xl transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50 sm:hidden"
          >
            <span className="mr-1 sm:mr-2 text-sm sm:text-base font-medium hidden xs:inline">Next</span>
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Date Display and Actions */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6">
          <div className="text-center bg-gray-700/30 rounded-xl px-4 sm:px-6 py-2 sm:py-3 border border-gray-600/30">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {formatDate(selectedDate)}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              {format(selectedDate, 'yyyy')}
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Calendar Button */}
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 rounded-xl transition-all duration-200 border border-purple-500/30"
            >
              <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Calendar</span>
            </button>

            {!isToday(selectedDate) && (
              <button
                onClick={goToToday}
                className="flex items-center px-3 sm:px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-all duration-200 border border-blue-500/30"
              >
                <span>Today</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Next Button */}
        <button
          onClick={goToNextDay}
          className="hidden sm:flex items-center px-3 sm:px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-600/40 rounded-xl transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
        >
          <span className="mr-1 sm:mr-2 text-sm sm:text-base font-medium">Next</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        selectedDate={selectedDate}
        onDateSelect={onDateChange}
        onClose={() => setIsCalendarOpen(false)}
        isOpen={isCalendarOpen}
      />
    </>
  );
}
