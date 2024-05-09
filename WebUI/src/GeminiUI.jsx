import React, { useState } from 'react';
import './GeminiUI.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPaperclip, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

const BASE_URL = 'https://acs-sose-2024-alan-k-mathew.ue.r.appspot.com';

const GeminiUI = ({ messages, setMessages }) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

const handleFileChange = (event) => {
  setSelectedFile(event.target.files[0]);
  setIsFileUploaded(!!event.target.files[0]);
};

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!inputValue.trim() && !selectedFile) return;

    setMessages([...messages, { type: 'user', text: inputValue, file: selectedFile, fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null }]);
    setInputValue('');
    setSelectedFile(null);
    setIsFileUploaded(false); 
    setIsTyping(true);

    const formData = new FormData();
    formData.append('message', inputValue);
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const response = await fetch(`${BASE_URL}/gemini/sendMessage`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseContent = await response.json();
      if (typeof responseContent === 'string') {
        setMessages(prevMessages => [
          ...prevMessages,
          { type: 'ai', text: responseContent },
        ]);
      } else {
        responseContent.content.forEach(item => {
          if (item.type === 'text') {
            setMessages(prevMessages => [
              ...prevMessages,
              { type: 'ai', text: item.text },
            ]);
          }
        });
      }
      setIsTyping(false);
    } catch (error) {
      console.error('Error in sending message:', error);
      setIsTyping(false);
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
        Gemini 1.5
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message-row ${message.type}`}>
              {message.type === 'user' ? (
                <FontAwesomeIcon icon={faUser} className="message-icon" />           
              ):(
               <img className="message-icon" src="https://i.ibb.co/fYRRKrp/gemini.png" alt="Gemini logo" /> 
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
          <img className="message-icon" src="https://i.ibb.co/fYRRKrp/gemini.png" alt="Chat logo" />         
            <span className="typing-indicator">Typing...</span>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <label htmlFor="file-upload" className={`file-upload-button ${isFileUploaded ? 'file-uploaded' : ''}`}>
          <FontAwesomeIcon icon={faPaperclip} />
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={handleFileChange}
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

export default GeminiUI;

