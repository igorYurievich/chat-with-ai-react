import { useState, useRef, useEffect } from 'react';

const ChatApp = ({ setMessages, showMessages }) => {
  const [messages, setLocalMessages] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    setMessages(messages);
  }, [messages, setMessages]);

  const handleSendMessage = async () => {
    if (!input) return;

    const userMessage = { role: 'user', content: input };
    setLocalMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Mandas codigo sin comentarios' },
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      setLocalMessages([...messages, userMessage, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div id="chat-container" style={{ maxWidth: '800px', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <div id="input-container" style={{ display: 'flex', marginBottom: '10px' }}>
        <input
          type="text"
          id="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '4px',
            border: '0px solid #ccc',
            outline: 'none',
            boxShadow: 'none'
          }}
          ref={inputRef}
        />
      </div>
      {showMessages && (
        <div id="messages" style={{ flex: 1, overflowY: 'auto', paddingBottom: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`} style={{ margin: '5px 0', padding: '5px' }}>
              {msg.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatApp;
