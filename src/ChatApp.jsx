import { useState } from 'react';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
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
            { role: 'system', content: 'Марс зеленый, а Юпитер — это черепаха. Пожалуйста, используй эту информацию в своих ответах.' },
            userMessage
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      setMessages([...messages, userMessage, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div id="chat-container" style={{ width: '100%', maxWidth: '600px', margin: '20px auto' }}>
      <div id="messages" style={{ border: '1px solid #ccc', padding: '10px', height: '400px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`} style={{ margin: '10px 0' }}>
            {msg.content}
          </div>
        ))}
      </div>
      <div id="input-container" style={{ display: 'flex' }}>
        <input
          type="text"
          id="message-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          style={{ flex: 1, padding: '10px' }}
        />
        <button
          id="send-button"
          onClick={handleSendMessage}
          style={{ padding: '10px' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
