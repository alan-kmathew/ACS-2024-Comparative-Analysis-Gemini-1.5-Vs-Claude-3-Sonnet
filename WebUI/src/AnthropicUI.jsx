import React, { useState } from 'react';
import './AnthropicUI.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPaperclip, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

const BASE_URL = 'http://localhost:5008';

const sendMessageToAssistant = async (message, file) => {
  const formData = new FormData();
  formData.append('message', message);
  if (file) {
    formData.append('file', file);
  }

  const response = await fetch(`${BASE_URL}/anthropic/sendMessage`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
};

const AnthropicUI = ({ messages, setMessages }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploadedAntropic, setIsFileUploadedAntropic] = useState(false);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (inputValue.trim() === '' && !selectedFile) return;
  
    setMessages([...messages, { type: 'user', text: inputValue, file: selectedFile, fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null }]);
    setInputValue('');
    setSelectedFile(null);
    setIsTyping(true);
    setIsFileUploadedAntropic(false);

  
    try {
      const response = await sendMessageToAssistant(inputValue, selectedFile);
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

  const anthropicFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFileUploadedAntropic(!!event.target.files[0]);
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
        Claude 3 Sonnet 
      </div>
        <div className="chat-messages">
  {messages.map((message, index) => (
    <div key={index} className={`message-row ${message.type}`}>
      {message.type === 'user' ? (
        <FontAwesomeIcon icon={faUser} className="message-icon" />           
      ):(
        <img className="message-icon" src="https://i.ibb.co/YBPk8cF/claude.webp" alt="Chat logo" />         
      )}
      {message.type === 'ai' ? (
        <ReactMarkdown className={`message-content ${message.type}`}>
          {message.text}
        </ReactMarkdown>
      ) : (
        <span className={`message-content ${message.type}`}>
        {message.text} <br></br>
          {message.file && (
            <>
              {message.fileUrl && <img src={message.fileUrl} alt={message.file.name} />}
            </>
          )}
        </span>
      )}
    </div>
  ))}
        {isTyping && (
          <div className="message-row">
          <img className="message-icon" src="https://i.ibb.co/YBPk8cF/claude.webp" alt="Chat logo" />         
            <span className="typing-indicator">Typing...</span>
          </div>
        )}
      </div>
      <div className="chat-input-area">
      <label htmlFor="file-upload-Antropic" className={`file-upload-button ${isFileUploadedAntropic ? 'file-uploaded' : ''}`}>
  <FontAwesomeIcon icon={faPaperclip} />
  <input
    type="file"
    id="file-upload-Antropic"
    style={{ display: 'none' }}
    onChange={anthropicFileUpload}
  />
</label>
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

export default AnthropicUI;

