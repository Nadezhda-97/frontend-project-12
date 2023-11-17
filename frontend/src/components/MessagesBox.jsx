const MessagesBox = ({ channelMessages }) => (
  <div id="messages-box" className="chat-messages overflow-auto px-5">
    {channelMessages.map((message) => (
      <div className="text-break mb-2" key={message.id}>
        <b>{message.username}</b>
        {': '}
        {message.text}
      </div>
    ))}
  </div>
);

export default MessagesBox;
