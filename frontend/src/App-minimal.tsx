import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hello World!</h1>
      <p>If you can see this, React is working!</p>
      <button onClick={() => alert('Button clicked!')}>
        Click me!
      </button>
    </div>
  );
}

export default App;
