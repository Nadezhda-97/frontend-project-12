import { useSelector } from 'react-redux';
import { selectors as channelsSelectors } from '../slices/channelsSlice.js';

const MessagesHeader = ({ currentChannelId, channelMessages }) => {
  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>{`# ${currentChannel && currentChannel.name}`}</b>
      </p>
      <span className="text-muted">{`${channelMessages.length} сообщений`}</span>
    </div>
  );
};

export default MessagesHeader;
