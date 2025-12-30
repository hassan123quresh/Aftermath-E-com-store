
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const DatePicker: React.FC<DatePickerProps> = ({ date, setDate, placeholder = "Pick a date", className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // For navigation
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync navigation with selected date when opened
  useEffect(() => {
    if (isOpen && date) {
      setCurrentDate(new Date(date));
    }
  }, [isOpen, date]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Normalize to avoid timezone issues when comparing just dates
    newDate.setHours(0, 0, 0, 0); 
    
    // If clicking the same date, clear it (optional, but good for single date filters)
    if (date && date.getTime() === newDate.getTime()) {
       setDate(undefined);
    } else {
       setDate(newDate);
    }
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);
    
    const calendarDays = [];

    // Empty slots for previous month
    for (let i = 0; i < startDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, month, d);
      thisDate.setHours(0,0,0,0);
      
      const isSelected = date && date.getDate() === d && date.getMonth() === month && date.getFullYear() === year;
      const isToday = new Date().setHours(0,0,0,0) === thisDate.getTime();

      calendarDays.push(
        <button
          key={d}
          onClick={() => handleDateClick(d)}
          className={`w-8 h-8 text-xs rounded-md flex items-center justify-center transition-colors
            ${isSelected ? 'bg-obsidian text-white font-bold' : 'hover:bg-stone-100 text-stone-700'}
            ${!isSelected && isToday ? 'text-obsidian font-bold bg-stone-100' : ''}
          `}
        >
          {d}
        </button>
      );
    }

    return calendarDays;
  };

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full min-w-[140px] px-3 py-2 text-xs font-normal border rounded-md transition-colors shadow-sm
          ${isOpen ? 'border-obsidian ring-1 ring-obsidian' : 'border-stone-200 hover:bg-stone-50'}
          bg-white text-stone-900
        `}
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-3.5 h-3.5 text-stone-500" />
          <span className={!date ? "text-stone-500" : ""}>
            {date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : placeholder}
          </span>
        </div>
        <ChevronDown className="w-3 h-3 opacity-50" />
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-[100] p-3 bg-white border border-stone-200 rounded-lg shadow-2xl min-w-[280px] animate-fade-in-up">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-stone-100 rounded-md">
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>
            <span className="text-sm font-semibold text-obsidian">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-stone-100 rounded-md">
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {days.map(day => (
              <div key={day} className="text-[10px] font-medium text-stone-400 uppercase tracking-wider h-8 flex items-center justify-center">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
          
          {date && (
              <div className="pt-2 border-t border-stone-100 mt-2">
                  <button 
                    onClick={() => { setDate(undefined); setIsOpen(false); }}
                    className="text-xs text-stone-500 hover:text-red-600 w-full text-center py-1"
                  >
                      Clear Selection
                  </button>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
