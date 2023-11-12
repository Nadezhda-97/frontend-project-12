import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Button, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { PlusSquareFill } from 'react-bootstrap-icons';

import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';

const ChannelsBox = () => {
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  return (
    <Col md={2} className="col-4 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button type="button" className="p-0 text-primary btn btn-group-vertical">
          <PlusSquareFill size={20} />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => (
          <li className="nav-item w-100" key={channel.id}>
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button
                className="w-100 rounded-0 text-start"
                onClick={() => dispatch(channelsActions.setCurrentChannel(channel.id))}
                variant={channel.id === currentChannelId && 'secondary'}
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
            </Dropdown>
          </li>
        ))}
      </ul>
    </Col>
  );
};

export default ChannelsBox;
