import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { getMessage, sendMessage } from '../../http'; // Your API functions
// Socket connection
const socket = io(process.env.REACT_APP_BASE_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
});

const Chat = () => {
  const { user } = useSelector(state => state.authSlice);

  const location = useLocation();
  const { teamId, userId } = location.state || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Fetch chat history on mount
  useEffect(() => {
    if (teamId) {
      const fetchChatHistory = async () => {
        try {
          const response = await getMessage(teamId);
          if (response && response.data) {
            setMessages(response.data);
          }
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };

      fetchChatHistory();

      // Join room
      socket.emit('joinRoom', { teamId });

      // Listen for incoming messages
      socket.on('receiveChatMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      // Cleanup on component unmount
      return () => {
        socket.emit('leaveRoom', { teamId });
        socket.off('receiveChatMessage');
      };
    }
  }, [teamId]);

  // Handle message sending
  const handleSendMessage = async () => {
    if (input.trim() && teamId && userId) {
      const messageData = {
        teamId,
        sender: { id: userId, name: user.name }, // Include both id and name in sender object
        message: input,
        timestamp: new Date(),
      };

      // Emit to socket for real-time update
      socket.emit('sendChatMessage', messageData);

      // Call API to save message
      try {
        await sendMessage({ teamId, userId, message: input });
        // setMessages((prevMessages) => [...prevMessages, messageData]);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div >
      <div style={styles.chatContainer}>

      <div style={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.message}>
            <strong>{msg.sender.id === userId ? 'Me' : msg.sender.name || msg.sender}: </strong>
            {msg.text || msg.message}
          </div>
        ))}
      </div>
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;


// Styles for the component
const styles = {
    chatContainer: {
        width: "95%" ,
        height:'95%',
        margin: '0 auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
  
    },
    messageList: {
        height: '80%',
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
