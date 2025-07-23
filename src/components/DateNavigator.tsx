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
    <div className={`flex items-center justify-between bg-white rounded-lg shadow-md p-4 ${className}`}>
      <button
        onClick={goToPreviousDay}
        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="ml-1 hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center space-x-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {formatDate(selectedDate)}
          </h2>
          <p className="text-sm text-gray-500">
            {format(selectedDate, 'yyyy')}
          </p>
        </div>

        {!isToday(selectedDate) && (
          <button
            onClick={goToToday}
            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Today
          </button>
        )}
      </div>

      <button
        onClick={goToNextDay}
        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
      >
        <span className="mr-1 hidden sm:inline">Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
