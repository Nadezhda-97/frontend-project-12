import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';

import MessagesHeader from './MessagesHeader.jsx';
import MessagesBox from './MessagesBox.jsx';
import SendingForm from './SendingForm.jsx';

const MessagesPanel = () => {
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <MessagesHeader currentChannelId={currentChannelId} />
        <MessagesBox />
        <SendingForm currentChannelId={currentChannelId} />
      </div>
    </Col>
  );
};

export default MessagesPanel;
