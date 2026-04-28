import { useHabits } from './hooks/useHabits';
import { localDateStr } from './utils/date';
import AddHabitForm from './components/AddHabitForm';
import HabitCard from './components/HabitCard';
import './App.css';

export default function App() {
  const { habits, addHabit, removeHabit, renameHabit, toggleDay, getStats } = useHabits();
  const today = localDateStr();
  const doneCount = habits.filter(h => !!h.completions[today]).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <h1 className="app-title">Habit Tracker</h1>
          <span className="app-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        {habits.length > 0 && (
          <div className={`today-badge ${doneCount === habits.length ? 'today-badge--complete' : ''}`}>
            {doneCount} / {habits.length} today
          </div>
        )}
      </header>

      <main className="app-main">
        <AddHabitForm onAdd={addHabit} />

        {habits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <p>No habits yet. Add one above to get started.</p>
          </div>
        ) : (
          <div className="habit-list">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                stats={getStats(habit)}
                onToggle={toggleDay}
                onRemove={removeHabit}
                onRename={renameHabit}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
