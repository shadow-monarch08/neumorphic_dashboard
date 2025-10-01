import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs, { Dayjs } from "dayjs";
import { fetchTaskByMonth } from "../../api/task";
import type { GetTaskByMonthResponse, Task } from "../../types/tasks";

interface CalendarProps {
  onDateClick?: (date: Dayjs, tasks: Task[]) => void;
}

type ViewMode = "days" | "months" | "years";

const Calendar: React.FC<CalendarProps> = ({ onDateClick }) => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(today);
  const [view, setView] = useState<ViewMode>("days");
  const [tasks, setTasks] = useState<Record<string, Task[]> | null>(null);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Generate days for current month grid
  const generateCalendar = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");

    const startDay = startOfMonth.day();
    const daysInMonth = currentMonth.daysInMonth();

    const prevMonth = currentMonth.subtract(1, "month");
    const nextMonth = currentMonth.add(1, "month");
    const prevMonthDays = prevMonth.daysInMonth();

    const days: { date: Dayjs; isCurrentMonth: boolean }[] = [];

    // prev month
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: prevMonth.date(prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: currentMonth.date(i), isCurrentMonth: true });
    }

    // next month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: nextMonth.date(i), isCurrentMonth: false });
    }

    return days;
  };

  const calendarDays = generateCalendar();

  const handleDateClick = (date: Dayjs) => {
    const key = date.format("YYYY-MM-DD");
    onDateClick?.(date, tasks[key] || []);
  };

  useEffect(() => {
    (async () => {
      const res = await fetchTaskByMonth({
        month: currentMonth.month(),
        year: currentMonth.year(),
      });

      let tempObj: Record<string, Task[]> = {};

      if (res.data.tasks.length > 0) {
        res.data.tasks.forEach((element) => {
          const dateKey = dayjs(element.dueDate).format("YYYY-MM-DD");
          if (dateKey in tempObj) {
            tempObj[dateKey].push(element);
          } else {
            tempObj[dateKey] = [element];
          }
        });
      }
      console.log(tempObj);
      setTasks(tempObj);
    })();
  }, [currentMonth]);

  // Month grid
  const renderMonths = () => {
    return (
      <div className="grid grid-cols-3 gap-3 p-6 h-full">
        {Array.from({ length: 12 }, (_, i) => {
          const month = currentMonth.month(i);
          return (
            <motion.div
              key={i}
              onClick={() => {
                setCurrentMonth(month);
                setView("days");
              }}
              // whileHover={{ scale: 1.05 }}
              className="h-36 flex items-start justify-start p-5 cursor-pointer border-[0.1px] border-tertiary-100 hover:bg-gray-50"
            >
              <span
                className={`p-5 rounded-full text-sm font-pregular ${
                  currentMonth.month() === month.month()
                    ? "bg-tertiary-100 text-white"
                    : "text-tertiary-100"
                }`}
              >
                {month.format("MMM")}
              </span>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Year grid (12 years at a time)
  const renderYears = () => {
    const startYear = Math.floor(currentMonth.year() / 12) * 12;
    const years = Array.from({ length: 12 }, (_, i) => startYear + i);

    return (
      <div className="grid grid-cols-3 gap-3 p-6">
        {years.map((year) => (
          <motion.div
            key={year}
            onClick={() => {
              setCurrentMonth(currentMonth.year(year));
              setView("months");
            }}
            // whileHover={{ scale: 1.05 }}
            className="h-36 flex items-start justify-start p-5 cursor-pointer border-[0.1px] border-tertiary-100 hover:bg-gray-50"
          >
            <span
              className={`p-5 rounded-full text-sm font-pregular ${
                year === currentMonth.year()
                  ? "bg-tertiary-100 text-white"
                  : "text-tertiary-100"
              }`}
            >
              {year}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-[90%] min-h-[90svh] overflow-hidden max-h-fit rounded-3xl text-tertiary-100 neumorphic-flat-sm mx-auto relative">
      {/* Header */}
      <div className="w-full flex items-center justify-between border-b border-opacity-20 border-tertiary-100 py-6 px-7">
        <div className="flex gap-2 items-baseline">
          <button
            onClick={() => setView("months")}
            className="text-[1.3rem] font-pmedium hover:bg-gray-50 transition p-2"
          >
            {currentMonth.format("MMMM")}
          </button>
          <button
            onClick={() => setView("years")}
            className="text-[1.3rem] font-pmedium hover:bg-gray-50 transition p-2"
          >
            {currentMonth.format("YYYY")}
          </button>
        </div>
        <div className="flex gap-6">
          {/* Prev */}
          <button
            onClick={() =>
              setCurrentMonth(
                view === "days"
                  ? currentMonth.subtract(1, "month")
                  : view === "months"
                  ? currentMonth.subtract(1, "year")
                  : currentMonth.subtract(12, "year")
              )
            }
            className="px-3 py-1 neumorphic-flat-xs rounded-lg"
          >
            ◀
          </button>
          {/* Next */}
          <button
            onClick={() =>
              setCurrentMonth(
                view === "days"
                  ? currentMonth.add(1, "month")
                  : view === "months"
                  ? currentMonth.add(1, "year")
                  : currentMonth.add(12, "year")
              )
            }
            className="px-3 py-1 neumorphic-flat-xs rounded-lg"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence mode="wait">
        {view === "days" && (
          <motion.div
            key="days"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Week headers */}
            <div className="grid grid-cols-7 w-full px-6 pt-6 mb-3 gap-3">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center font-pmedium text-sm border border-opacity-10 border-tertiary-100"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dates grid */}
            <div className="grid grid-cols-7 w-full gap-3 px-6 pb-6">
              {calendarDays.map(({ date, isCurrentMonth }, idx) => {
                const key = date.format("YYYY-MM-DD");
                const dayTasks = tasks?.[key] || [];
                const isToday = date.isSame(today, "day");

                return (
                  <motion.div
                    key={idx}
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.01 * idx }}
                    onClick={() => handleDateClick(date)}
                    className={`h-[8em] w-full p-3 border border-opacity-20 border-tertiary-100 cursor-pointer flex flex-col gap-1 hover:bg-gray-50 transition ${
                      isCurrentMonth ? "bg-primary" : "bg-gray-100 opacity-60"
                    }`}
                  >
                    {/* Date */}
                    <div
                      className={`flex items-center justify-center rounded-full h-8 w-8 text-sm ${
                        isToday ? "bg-tertiary-100 text-primary font-bold" : ""
                      }`}
                    >
                      {date.date()}
                    </div>

                    {/* Tasks */}
                    {dayTasks.length > 0 && (
                      <div className="flex flex-col gap-1 overflow-hidden">
                        {dayTasks.slice(0, 2).map((task) => (
                          <p
                            key={task._id}
                            className="truncate text-xs font-plight text-tertiary-100"
                          >
                            • {task.title}
                          </p>
                        ))}
                        {dayTasks.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{dayTasks.length - 2} more
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {view === "months" && (
          <motion.div
            key="months"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderMonths()}
          </motion.div>
        )}

        {view === "years" && (
          <motion.div
            key="years"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {renderYears()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
