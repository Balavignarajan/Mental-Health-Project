import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const DatePicker = ({
  value = '',
  onChange,
  min = null,
  max = null,
  placeholder = 'Select date',
  className = '',
  required = false,
  disabled = false,
  id = null,
  name = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const datePickerRef = useRef(null);
  const calendarRef = useRef(null);

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setCurrentMonth(date);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateDisabled = (date) => {
    if (min) {
      const minDate = new Date(min);
      minDate.setHours(0, 0, 0, 0);
      if (date < minDate) return true;
    }
    if (max) {
      const maxDate = new Date(max);
      maxDate.setHours(23, 59, 59, 999);
      if (date > maxDate) return true;
    }
    return false;
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (isDateDisabled(newDate)) return;

    setSelectedDate(newDate);
    const formattedDate = formatDate(newDate);
    onChange({ target: { value: formattedDate, name: name || id } });
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    let newMonth = currentMonth.getMonth();
    
    // Adjust month if it becomes invalid for the new year
    if (min) {
      const minDate = new Date(min);
      if (newYear === minDate.getFullYear() && newMonth < minDate.getMonth()) {
        newMonth = minDate.getMonth();
      }
    }
    if (max) {
      const maxDate = new Date(max);
      if (newYear === maxDate.getFullYear() && newMonth > maxDate.getMonth()) {
        newMonth = maxDate.getMonth();
      }
    }
    
    setCurrentMonth(new Date(newYear, newMonth, 1));
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value);
    setCurrentMonth(new Date(currentMonth.getFullYear(), newMonth, 1));
  };

  const handleToday = () => {
    const today = new Date();
    if (!isDateDisabled(today)) {
      setSelectedDate(today);
      setCurrentMonth(today);
      const formattedDate = formatDate(today);
      onChange({ target: { value: formattedDate, name: name || id } });
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange({ target: { value: '', name: name || id } });
    setIsOpen(false);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  // Generate years list (100 years back, 10 years forward from current year)
  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const startYear = min ? new Date(min).getFullYear() : currentYear - 100;
    const endYear = max ? new Date(max).getFullYear() : currentYear + 10;
    
    for (let y = startYear; y <= endYear; y++) {
      years.push(y);
    }
    return years;
  };

  // Generate months list
  const getMonthsList = () => {
    const months = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentYear = currentMonth.getFullYear();
    
    for (let i = 0; i < 12; i++) {
      let isDisabled = false;
      
      // Check min date constraint
      if (min) {
        const minDate = new Date(min);
        const minYear = minDate.getFullYear();
        const minMonth = minDate.getMonth();
        
        if (currentYear < minYear || (currentYear === minYear && i < minMonth)) {
          isDisabled = true;
        }
      }
      
      // Check max date constraint
      if (max && !isDisabled) {
        const maxDate = new Date(max);
        const maxYear = maxDate.getFullYear();
        const maxMonth = maxDate.getMonth();
        
        if (currentYear > maxYear || (currentYear === maxYear && i > maxMonth)) {
          isDisabled = true;
        }
      }
      
      months.push({
        value: i,
        label: monthNames[i],
        disabled: isDisabled
      });
    }
    return months;
  };

  const days = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const yearsList = getYearsList();
  const monthsList = getMonthsList();

  return (
    <div className="relative" ref={datePickerRef}>
      {/* Input Field */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          input-field
          cursor-pointer
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <div className="flex items-center gap-2 flex-1">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className={selectedDate ? 'text-gray-900' : 'text-gray-400'}>
            {selectedDate ? formatDisplayDate(selectedDate) : placeholder}
          </span>
        </div>
        {selectedDate && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        value={value}
        required={required}
        id={id}
        name={name}
      />

      {/* Calendar Popup */}
      {isOpen && !disabled && (
        <div
          ref={calendarRef}
          className="absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[320px] sm:w-[340px]"
          style={{ top: '100%', left: 0 }}
        >
          {/* Calendar Header with Year and Month Selectors */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              {/* Month Selector */}
              <div className="flex-1 relative">
                <select
                  value={currentMonth.getMonth()}
                  onChange={handleMonthChange}
                  className="w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-mh-green focus:border-transparent appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {monthsList.map((monthOption) => (
                    <option
                      key={monthOption.value}
                      value={monthOption.value}
                      disabled={monthOption.disabled}
                    >
                      {monthOption.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {/* Year Selector */}
              <div className="flex-1 relative">
                <select
                  value={currentMonth.getFullYear()}
                  onChange={handleYearChange}
                  className="w-full px-3 py-2 pr-8 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-mh-green focus:border-transparent appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                >
                  {yearsList.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const date = new Date(year, month, day);
              const disabled = isDateDisabled(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={disabled}
                  className={`
                    aspect-square
                    flex items-center justify-center
                    text-sm font-medium
                    rounded-lg
                    transition-all
                    ${disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : isSelected
                      ? 'bg-mh-green text-white font-semibold shadow-md'
                      : isTodayDate
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${!disabled && !isSelected ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleToday}
              className="text-sm text-mh-green hover:text-mh-green/80 font-medium transition-colors"
            >
              Today
            </button>
            {selectedDate && (
              <button
                type="button"
                onClick={handleClear}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;

