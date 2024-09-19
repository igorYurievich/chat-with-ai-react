import { useState, useCallback, useEffect } from 'react';
import ChatApp from './ChatApp';
import './App.css'; // Подключаем файл стилей

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    return savedTheme === 'true';
  });

  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(true);

  const handleCopyLastMessage = useCallback(() => {
    const lastMessage = messages.slice().reverse().find(msg => msg.role === 'assistant');
    if (lastMessage) {
      navigator.clipboard.writeText(lastMessage.content)
        .catch(err => {
          console.error('Failed to copy message:', err);
        });
    }
  }, [messages]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('isDarkMode', newMode);
      return newMode;
    });
  };

  const handleKeyDown = useCallback((event) => {
    if (event.ctrlKey && event.key === 'd') {
      event.preventDefault();
      toggleTheme();
    }
    if (event.ctrlKey && event.key === 'c') {
      event.preventDefault();
      handleCopyLastMessage();
    }
    if (event.ctrlKey && event.key === 'h') { // Добавляем обработчик для Ctrl + H
      event.preventDefault();
      setShowMessages(prev => !prev);
    }
  }, [toggleTheme, handleCopyLastMessage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={`app-container ${isDarkMode ? 'night-mode' : 'day-mode'}`}>
      <button className="toggle-messages" onClick={toggleTheme}>
        {isDarkMode ? (
          <i className="fas fa-sun"></i> 
        ) : (
          <i className="fas fa-moon"></i> 
        )}
      </button>
      <button className="toggle-messages" onClick={() => setShowMessages(prev => !prev)}>
        {showMessages ? (
          <i className="fas fa-eye"></i> 
        ) : (
          <i className="fas fa-eye-slash"></i> 
        )}
      </button>
      <button className="toggle-messages" onClick={handleCopyLastMessage}>
        <i className="fas fa-copy"></i> 
      </button>
      <ChatApp setMessages={setMessages} showMessages={showMessages} />
    </div>
  );
}

export default App;
