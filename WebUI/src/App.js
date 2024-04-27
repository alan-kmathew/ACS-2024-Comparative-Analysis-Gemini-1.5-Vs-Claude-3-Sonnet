import React, {useState} from 'react';
import Dashboard from './Dashboard';

function App() {
  const [messages, setMessages] = useState([]); // Initialize messages as an empty array

  return (
    <Dashboard messages={messages} setMessages={setMessages} />
  );
}
export default App;