import { useState } from 'react';
import { localDateStr } from '../utils/date';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function buildMonthCells(year, month) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    );
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function HabitGrid({ completions, onToggle }) {
  const [offset, setOffset] = useState(0); // 0 = current month, -1 = prev, etc.

  const now = new Date();
  const displayDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();
  const today = localDateStr(now);

  const canGoNext = offset < 0;
  const canGoPrev = offset > -24;

  const cells = buildMonthCells(year, month);

  return (
    <div className="cal-wrapper">
      <div className="month-nav">
        <button
          className="nav-btn"
          onClick={() => setOffset(o => o - 1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="month-nav-label">
          {MONTH_NAMES[month]} <span className="month-nav-year">{year}</span>
        </span>
        <button
          className="nav-btn"
          onClick={() => setOffset(o => o + 1)}
          disabled={!canGoNext}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="month-dow-row">
        {DOW.map(d => <span key={d} className="dow-label">{d}</span>)}
      </div>

      <div className="month-grid">
        {cells.map((date, i) => {
          if (!date) return <div key={i} className="cal-cell cal-cell--empty" />;
          const done = !!completions[date];
          const isToday = date === today;
          const future = date > today;
          return (
            <button
              key={date}
              onClick={() => !future && onToggle(date)}
              className={[
                'cal-cell',
                done ? 'cal-cell--done' : '',
                isToday ? 'cal-cell--today' : '',
                future ? 'cal-cell--future' : '',
              ].filter(Boolean).join(' ')}
              aria-label={`${date}: ${done ? 'completed' : 'not completed'}`}
              aria-pressed={done}
            >
              <span className="cal-day-num">{parseInt(date.slice(8), 10)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
