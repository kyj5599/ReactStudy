// import './App.css';
import { useState } from 'react';

function App() {
  const [count,setCount] = useState(1);

  const handleCountUpdate = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <button onClick={handleCountUpdate}>Update</button>
      <span>count: {count}</span>
    </div>
  );
}

export default App;
