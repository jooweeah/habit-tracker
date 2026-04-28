import { useState, useRef, useEffect } from 'react';
import HabitGrid from './HabitGrid';
import { localDateStr } from '../utils/date';

export default function HabitCard({ habit, stats, onToggle, onRemove, onRename }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(habit.name);
  const inputRef = useRef(null);
  const today = localDateStr();
  const doneToday = !!habit.completions[today];

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  function startEdit() {
    setEditValue(habit.name);
    setIsEditing(true);
  }

  function commitEdit() {
    if (editValue.trim() && editValue.trim() !== habit.name) {
      onRename(habit.id, editValue.trim());
    }
    setIsEditing(false);
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') setIsEditing(false);
  }

  function handleRemove() {
    if (confirmDelete) {
      onRemove(habit.id);
    } else {
      setConfirmDelete(true);
    }
  }

  return (
    <div className={`habit-card ${doneToday ? 'habit-card--done' : ''}`}>
      <div className="habit-header">
        <div className="habit-title-row">
          <button
            className={`check-btn ${doneToday ? 'checked' : ''}`}
            onClick={() => onToggle(habit.id, today)}
            aria-label={doneToday ? 'Mark incomplete' : 'Mark complete'}
          >
            {doneToday ? '✓' : ''}
          </button>
          {isEditing ? (
            <input
              ref={inputRef}
              className="habit-name-input"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={commitEdit}
              onKeyDown={handleEditKeyDown}
              maxLength={40}
            />
          ) : (
            <h2
              className="habit-name"
              onDoubleClick={startEdit}
              title="Double-click to rename"
            >
              {habit.name}
            </h2>
          )}
        </div>
        <button
          className={`delete-btn ${confirmDelete ? 'delete-btn--confirm' : ''}`}
          onClick={handleRemove}
          onBlur={() => setConfirmDelete(false)}
          aria-label="Delete habit"
        >
          {confirmDelete ? 'Sure?' : '×'}
        </button>
      </div>

      <div className="habit-stats">
        <div className="stat">
          <span className="stat-value">{stats.streak}</span>
          <span className="stat-label">streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.longestStreak}</span>
          <span className="stat-label">best</span>
        </div>
        <div className="stat">
          <span className="stat-value">{stats.completionRate}%</span>
          <span className="stat-label">30-day rate</span>
        </div>
      </div>

      <HabitGrid
        completions={habit.completions}
        onToggle={date => onToggle(habit.id, date)}
      />
    </div>
  );
}
