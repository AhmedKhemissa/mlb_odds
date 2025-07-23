'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, subDays, isToday } from 'date-fns';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export default function DateNavigator({ selectedDate, onDateChange, className = '' }: DateNavigatorProps) {
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
    <div className={`flex items-center justify-between bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 ${className}`}>
      <button
        onClick={goToPreviousDay}
        className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center space-x-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-white">
            {formatDate(selectedDate)}
          </h2>
          <p className="text-sm text-gray-400">
            {format(selectedDate, 'yyyy')}
          </p>
        </div>

        {!isToday(selectedDate) && (
          <button
            onClick={goToToday}
            className="flex items-center px-3 py-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded-md transition-colors"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Today
          </button>
        )}
      </div>

      <button
        onClick={goToNextDay}
        className="flex items-center px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
