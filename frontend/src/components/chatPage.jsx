import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Row, Col, Button,
} from 'react-bootstrap';
import { PlusSquareFill, ArrowRightSquareFill } from 'react-bootstrap-icons';

import axios from 'axios';

import { useAuth } from '../hooks/index.jsx';
import routes from '../routes/routes.js';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user) {
    return { Authorization: `Bearer ${user}` };
  }
  return {};
};

const ChannelsBox = ({ channels }) => (
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
          <Button className="w-100 rounded-0 text-start btn btn-secondary">
            <span className="me-1">#</span>
            {channel.name}
          </Button>
        </li>
      ))}
    </ul>
  </Col>
);

const CurrentChannel = () => (
  <div className="bg-light mb-4 p-3 shadow-sm small">
    <p className="m-0">
      <b># general</b>
    </p>
    <span className="text-muted">0 сообщений</span>
  </div>
);

const MessagesBox = () => (
  <div id="messages-box" className="chat-messages overflow-auto px-5" />
);

const NewMessage = () => (
  <div className="mt-auto px-5 py-3">
    <form noValidate className="py-1 border rounded-2">
      <div className="input-group has-validation">
        <input
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          className="border-0 p-0 ps-2 form-control"
        />
        <button type="submit" disabled className="btn btn-group-vertical">
          <ArrowRightSquareFill size={20} />
          <span className="visually-hidden">Отправить</span>
        </button>
      </div>
    </form>
  </div>
);

const Chat = () => (
  <Col className="p-0 h-100">
    <div className="d-flex flex-column h-100">
      <CurrentChannel />
      <MessagesBox />
      <NewMessage />
    </div>
  </Col>
);

const ChatPage = () => {
  const auth = useAuth();
  const headers = getAuthHeader();
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath, { headers });

        dispatch(channelsActions.addChannels(data.channels));
        dispatch(messagesActions.addMessages(data.messages));
      } catch (error) {
        if (error.isAxiosError && error.response.status === 401) {
          auth.logOut();
        }
      }
    };

    fetchData();
  }, [dispatch, auth, headers]);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <ChannelsBox
          channels={channels}
        />
        <Chat />
      </Row>
    </Container>
  );
};

export default ChatPage;
