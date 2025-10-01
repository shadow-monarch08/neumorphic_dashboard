import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs, { Dayjs } from "dayjs";
import LordIconPlayer from "../../utils/LordIconPlayer";
import { lottie } from "../../constants";

interface DatePickerProps {
  value?: Dayjs;
  onChange?: (date: Dayjs) => void;
  label?: string;
  minDate?: Dayjs;
}

type ViewMode = "date" | "month" | "year";

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  minDate,
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(value || null);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const [viewMode, setViewMode] = useState<ViewMode>("date");
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    selectedDate || dayjs()
  );
  const iconRef = useRef<any>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (iconRef.current) {
      iconRef.current.playFromBeginning?.();
    }
  };
  const handlePickerClose = () => {
    setIsOpen(false);
  };
  // Adjust modal position
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }

      //   document.body.addEventListener("click", handlePickerClose);
    }

    // return () => {
    //   document.body.removeEventListener("click", handlePickerClose);
    // };
  }, [isOpen]);

  // Handle date selection
  const handleDateClick = (date: Dayjs, disabled: boolean) => {
    if (disabled) return;
    setSelectedDate(date);
    onChange?.(date);
    setIsOpen(false);
  };

  // Handle month selection
  const handleMonthSelect = (monthIndex: number) => {
    const newMonth = currentMonth.month(monthIndex);
    if (minDate && newMonth.endOf("month").isBefore(minDate, "day")) return;
    setCurrentMonth(newMonth);
    setViewMode("date");
  };

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const newYear = currentMonth.year(year);
    if (minDate && newYear.endOf("year").isBefore(minDate, "day")) return;
    setCurrentMonth(newYear);
    setViewMode("month");
  };

  // Generate year grid (12 years per view)
  const yearsPerPage = 12;
  const startYear =
    Math.floor(currentMonth.year() / yearsPerPage) * yearsPerPage;
  const yearGrid = Array.from(
    { length: yearsPerPage },
    (_, i) => startYear + i
  );

  // Generate calendar grid including prev/next month dates
  const generateCalendarDays = () => {
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = currentMonth.startOf("month").day();
    const prevMonth = currentMonth.subtract(1, "month");
    const nextMonth = currentMonth.add(1, "month");
    const prevMonthDays = prevMonth.daysInMonth();

    const days: { date: Dayjs; isCurrentMonth: boolean }[] = [];

    // Prev month days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.date(prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: currentMonth.date(i), isCurrentMonth: true });
    }

    // Next month filler days
    const remaining = 42 - days.length; // 6 weeks grid
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: nextMonth.date(i), isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // Animation variants
  const variants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="relative inline-block w-full flex-1" ref={inputRef}>
      {label && (
        <label className="block mb-1 text-sm font-medium">{label}</label>
      )}
      <div
        className="w-full border-[0.5px] overflow-hidden border-tertiary rounded-lg cursor-pointer flex flex-row gap-2 neumorphic-in-xs"
        onClick={(e) => {
          setIsOpen((prev) => !prev);
          handleFocus(e);
        }}
      >
        <div className="px-2 neumorphic-flat-xs flex justify-center items-center">
          <LordIconPlayer
            ref={iconRef}
            size={20}
            icon={lottie.calendar}
            color="#645b52"
          />
        </div>
        <div className="py-2 px-2 w-full text-tertiary-100 font-pregular text-sm">
          {selectedDate
            ? selectedDate.format("ddd, MMM D, YYYY")
            : "Select a date"}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: position === "top" ? -10 : 10,
            }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: position === "top" ? -10 : 10 }}
            transition={{ duration: 0.25 }}
            className={`absolute left-1/2 -translate-x-1/2 w-72 rounded-2xl neumorphic-in-xs z-50 overflow-hidden ${
              position === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center py-3 px-6 mt-2 text-tertiary-100">
              <button
                onClick={() => {
                  if (viewMode === "date")
                    setCurrentMonth(currentMonth.subtract(1, "month"));
                  if (viewMode === "month")
                    setCurrentMonth(currentMonth.subtract(1, "year"));
                  if (viewMode === "year")
                    setCurrentMonth(
                      currentMonth.subtract(yearsPerPage, "year")
                    );
                }}
                className="font-pmedium text-sm p-2 p-2 rounded-md transition-all hover:bg-gray-100"
              >
                &lt;&lt;
              </button>

              <div className="flex items-center gap-2 font-medium cursor-pointer font-pmedium text-sm p-2 rounded-md transition-all hover:bg-gray-100">
                {viewMode === "date" && (
                  <>
                    <span onClick={() => setViewMode("month")}>
                      {currentMonth.format("MMMM")}
                    </span>
                    <span onClick={() => setViewMode("year")}>
                      {currentMonth.format("YYYY")}
                    </span>
                  </>
                )}
                {viewMode === "month" && (
                  <span onClick={() => setViewMode("year")}>
                    {currentMonth.format("YYYY")}
                  </span>
                )}
                {viewMode === "year" && (
                  <span>
                    {yearGrid[0]} – {yearGrid[yearGrid.length - 1]}
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  if (viewMode === "date")
                    setCurrentMonth(currentMonth.add(1, "month"));
                  if (viewMode === "month")
                    setCurrentMonth(currentMonth.add(1, "year"));
                  if (viewMode === "year")
                    setCurrentMonth(currentMonth.add(yearsPerPage, "year"));
                }}
                className="font-pmedium text-sm p-2 rounded-md transition-all hover:bg-gray-100"
              >
                &gt;&gt;
              </button>
            </div>

            {/* Body */}
            <div className="p-3 min-h-[16rem]">
              <AnimatePresence mode="wait">
                {/* Date view */}
                {viewMode === "date" && (
                  <motion.div
                    key="date"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-7 gap-1 text-center"
                  >
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                      <span
                        key={d}
                        className="text-xs font-medium text-tertiary"
                      >
                        {d}
                      </span>
                    ))}
                    {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                      const isSelected = selectedDate?.isSame(date, "day");
                      const isDisabled = minDate
                        ? date.isBefore(minDate, "day")
                        : false;

                      return (
                        <button
                          key={idx}
                          disabled={isDisabled}
                          className={`w-9 h-9 flex items-center font-pregular justify-center rounded-lg text-sm transition ${
                            isSelected
                              ? "bg-tertiary-100 text-white"
                              : isDisabled
                              ? "text-tertiary cursor-not-allowed"
                              : isCurrentMonth
                              ? "hover:bg-gray-200 text-tertiary-100"
                              : "text-tertiary"
                          }`}
                          onClick={() => handleDateClick(date, isDisabled)}
                        >
                          {date.date()}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Month view */}
                {viewMode === "month" && (
                  <motion.div
                    key="month"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-3 gap-2 text-tertiary-100"
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = currentMonth.month(i);
                      const isDisabled = minDate
                        ? month.endOf("month").isBefore(minDate, "day")
                        : false;

                      return (
                        <button
                          type="button"
                          key={i}
                          disabled={isDisabled}
                          className={`py-2 rounded-lg ${
                            currentMonth.month() === i
                              ? "bg-tertiary-100 text-white"
                              : isDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMonthSelect(i);
                          }}
                        >
                          {month.format("MMM")}
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Year view */}
                {viewMode === "year" && (
                  <motion.div
                    key="year"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-3 gap-2 text-tertiary-100"
                  >
                    {yearGrid.map((year) => {
                      const yearObj = currentMonth.year(year);
                      const isDisabled = minDate
                        ? yearObj.endOf("year").isBefore(minDate, "day")
                        : false;

                      return (
                        <button
                          key={year}
                          disabled={isDisabled}
                          className={`py-2 rounded-lg ${
                            currentMonth.year() === year
                              ? "bg-tertiary-100 text-white"
                              : isDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleYearSelect(year)}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatePicker;
