import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const Chat = ({ teamId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Listen for incoming chat messages
  useEffect(() => {
    // When a new message is received from the server
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Send a message to the server
  const sendMessage = () => {
    if (input.trim()) {
      const messageData = {
        teamId,
        userId,
        text: input,
        timestamp: new Date(),
      };

      // Emit the message event to the server
      socket.emit('sendMessage', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setInput('');
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <strong>{msg.userId}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

// Styles for the component
const styles = {
  chatContainer: {
    width: '400px',
    margin: '0 auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
  },
  messageList: {
    height: '300px',
    overflowY: 'auto',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
  },
  message: {
    padding: '8px',
    marginBottom: '5px',
    borderBottom: '1px solid #ddd',
  },
  inputContainer: {
    display: 'flex',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  button: {
    padding: '8px 12px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};
