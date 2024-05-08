import React, {useState} from 'react';
import GeminiUI from './GeminiUI';
import AnthropicUI from './AnthropicUI';
import './App.css';

function App() {
  const [anthropicMessages, setAnthropicMessages] = useState([]);
  const [geminiMessages, setGeminiMessages] = useState([]);

  return (
    <div className="dashboard-Header">
      <div className="dashboard-Header_text">Comparative Analysis: Gemini 1.5 Vs Claude 3 Sonnet</div>
    <div className="dashboard-container">
      <GeminiUI messages={geminiMessages} setMessages={setGeminiMessages} />
      <AnthropicUI messages={anthropicMessages} setMessages={setAnthropicMessages} />
    </div>
    </div>
  );
}

export default App;


