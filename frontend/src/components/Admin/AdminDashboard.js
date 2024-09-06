import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    axios.get('localhost:5000/api/auth/users')
      .then(response => {
        setChats(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (selectedChat && newMessage) {
      axios.post(`/api/chats/${selectedChat.id}/messages`, { message: newMessage })
        .then(response => {
          setNewMessage('');
          setChats(chats.map(chat => {
            if (chat.id === selectedChat.id) {
              return { ...chat, messages: [...chat.messages, response.data] };
            }
            return chat;
          }));
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div>
        <h2>Chats</h2>
        <ul>
          {chats.map((chat, index) => (
            <li key={index}>
              <span>{chat.user.username}</span>
              <button onClick={() => handleChatSelect(chat)}>Select</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedChat && (
        <div>
          <h2>Chat History</h2>
          <ul>
            {selectedChat.messages.map((message, index) => (
              <li key={index}>{message.text}</li>
            ))}
          </ul>
          <form>
            <label>New Message:</label>
            <input type="text" value={newMessage} onChange={handleNewMessageChange} />
            <button type="submit" onClick={handleSendMessage}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;