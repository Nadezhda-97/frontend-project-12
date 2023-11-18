import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Row } from 'react-bootstrap';

import axios from 'axios';

import ChannelsBox from '../ChannelsBox.jsx';
import MessagesPanel from '../MessagesPanel.jsx';

import { useAuth } from '../../hooks/index.jsx';
import routes from '../../routes/routes.js';
import { actions as channelsActions } from '../../slices/channelsSlice.js';
import { actions as messagesActions } from '../../slices/messagesSlice.js';

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('userData'));
  if (user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
};

const ChatPage = () => {
  const auth = useAuth();
  const headers = getAuthHeader();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath, { headers });
        dispatch(channelsActions.addChannels(data.channels));
        dispatch(channelsActions.setCurrentChannel(data.currentChannelId));
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
        <ChannelsBox />
        <MessagesPanel />
      </Row>
    </Container>
  );
};

export default ChatPage;