import { useState } from 'react';

export default function AddHabitForm({ onAdd }) {
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="add-form">
      <input
        type="text"
        placeholder="New habit name..."
        value={value}
        onChange={e => setValue(e.target.value)}
        maxLength={40}
        className="add-input"
      />
      <button type="submit" className="btn btn-primary" disabled={!value.trim()}>
        Add
      </button>
    </form>
  );
}
