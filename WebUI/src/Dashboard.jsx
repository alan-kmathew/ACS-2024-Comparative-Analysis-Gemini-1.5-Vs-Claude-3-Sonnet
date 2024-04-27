import React, { useState } from 'react';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser, faArrowsRotate, faCircleArrowRight} from '@fortawesome/free-solid-svg-icons';

const BASE_URL = 'http://localhost:5008';


const sendMessageToAssistant = async (message) => {
  console.log('Message:', message); // log the message
  const response = await fetch(`${BASE_URL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  console.log('Response:', data); // log the response
  return data;
};

const createNewThread = async () => {
  const response = await fetch(`${BASE_URL}/createThread`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  console.log('Response:', data); // log the response
  return data;
};

const Dashboard = ({ messages, setMessages }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (inputValue.trim() === '') return;
  
    setMessages([...messages, { type: 'user', text: inputValue }]);
    setInputValue('');
    setIsTyping(true);
  
    try {
      const response = await sendMessageToAssistant(inputValue);
      response.content.forEach(item => {
        if (item.type === 'text') {
          setMessages(prevMessages => [
            ...prevMessages,
            { type: 'ai', text: item.text },
          ]);
        }
      });
      setIsTyping(false);
    } catch (error) {
      console.error('Error in sending message:', error);
      setIsTyping(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await createNewThread();
      setMessages([{ type: 'ai', text: 'Hello! How can I assist you today?' }]);
    } catch (error) {
      console.error('Error creating new thread:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        Assistant AI
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-row ${message.type}`}>
            <FontAwesomeIcon
              icon={message.type === 'user' ? faUser : faRobot}
              className="message-icon"
            />
            {message.type === 'ai' ? (
              <div
                className={`message-content ${message.type}`}
                dangerouslySetInnerHTML={{ __html: message.text }}
              />
            ) : (
              <span className={`message-content ${message.type}`}>
                {message.text}
              </span>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="message-row">
            <FontAwesomeIcon icon={faRobot} className="message-icon" />
            <span className="typing-indicator">Typing...</span>
          </div>
        )}
      </div>
      <div className="chat-input-area">
        <button className="refresh-button" onClick={handleRefresh}>
          <FontAwesomeIcon icon={faArrowsRotate} />
        </button>
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt here"
        />
        <button className="send-button" onClick={sendMessage}>
          <FontAwesomeIcon icon={faCircleArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;