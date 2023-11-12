import { useSelector } from 'react-redux';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';

const MessagesBox = () => {
  const messages = useSelector(messagesSelectors.selectAll);

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5">
      {messages.map((message) => (
        <div className="text-break mb-2" key={message.id}>
          <b>{message.username}</b>
          {': '}
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default MessagesBox;
