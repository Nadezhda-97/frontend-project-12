import React, { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/index.jsx';

const MessagesBox = ({ channelMessages }) => {
  const { userData } = useAuth();
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.lastElementChild?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [channelMessages]);

  return (
    <div id="messages-box" ref={messagesRef} className="chat-messages overflow-auto px-5">
      {channelMessages.map((message) => {
        const isCurrentUser = message.username === userData.username;
        return (
          <div className={`text-break mb-2 bg-${isCurrentUser ? 'info p-2 bg-opacity-10' : 'white'}`} key={message.id}>
            <b>{message.username}</b>
            {': '}
            {message.text}
          </div>
        );
      })}
    </div>
  );
};

export default MessagesBox;
