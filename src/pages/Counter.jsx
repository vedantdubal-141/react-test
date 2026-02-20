import { useState } from 'react';

function Counter() {
  const [value, setValue] = useState(0);

  const increment = () => setValue(prev => prev + 1);
  const decrement = () => {
    if (value > 0) {
      setValue(prev => prev - 1);
    }
  };
  const reset = () => setValue(0);

  // Color logic
  const valueColor = value === 0 ? 'var(--error-color)' : 'var(--success-color)';

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Interactive Counter</h1>
      </header>

      <div className="card counter-card" style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem', color: valueColor, fontSize: '3rem' }}>
          {value}
        </h2>
        
        <div className="counter-controls" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn" onClick={increment}>Increment</button>
          <button className="btn" onClick={decrement} disabled={value === 0} style={{ backgroundColor: value === 0 ? '#aaa' : '' }}>
            Decrement
          </button>
          <button className="btn" onClick={reset} style={{ backgroundColor: 'var(--text-secondary)' }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default Counter;
