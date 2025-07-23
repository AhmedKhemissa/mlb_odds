'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function Calendar({ selectedDate, onDateSelect, onClose, isOpen }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  if (!isOpen) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const getDayStyle = (day: Date) => {
    const baseStyle = "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer";
    
    if (isSameDay(day, selectedDate)) {
      return `${baseStyle} bg-blue-500 text-white shadow-lg transform scale-105`;
    }
    
    if (isToday(day)) {
      return `${baseStyle} bg-blue-500/20 text-blue-400 border border-blue-500/50 font-bold`;
    }
    
    if (!isSameMonth(day, currentMonth)) {
      return `${baseStyle} text-gray-600 hover:text-gray-400`;
    }
    
    return `${baseStyle} text-gray-300 hover:bg-gray-700/50 hover:text-white`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Select Date</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h4 className="text-lg font-bold text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h4>
            
            <button
              onClick={goToNextMonth}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="h-10 flex items-center justify-center text-xs font-semibold text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Leading empty cells */}
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={index} className="w-10 h-10" />
            ))}
            
            {/* Days */}
            {days.map(day => (
              <button
                key={day.toISOString()}
                onClick={() => handleDateSelect(day)}
                className={getDayStyle(day)}
              >
                {format(day, 'd')}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/50">
            <button
              onClick={() => handleDateSelect(new Date())}
              className="px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
            >
              Today
            </button>
            
            <div className="text-xs text-gray-500">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
