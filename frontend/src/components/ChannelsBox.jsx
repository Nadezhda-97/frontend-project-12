import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col, Button, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import getModal from './modals/index.js';

const defaultChannelId = 1;

const renderModal = (modalInfo, hideModal) => {
  if (modalInfo.type === null) {
    return null;
  }

  const Modal = getModal(modalInfo.type);
  return <Modal modalInfo={modalInfo} hideModal={hideModal} />;
};

const ChannelsBox = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const channelsRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const channelsIds = useSelector(channelsSelectors.selectIds);
  const lastChannelId = channelsIds[channelsIds.length - 1];

  const initialModal = {
    type: null,
    channel: null,
  };

  const [modalInfo, setModalInfo] = useState(initialModal);

  const showModal = (type, channel = null) => {
    setModalInfo({
      type,
      channel,
    });
  };

  const hideModal = () => {
    setModalInfo({
      type: null,
      channel: null,
    });
  };

  useEffect(() => {
    if (currentChannelId === defaultChannelId) {
      channelsRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    if (currentChannelId === lastChannelId) {
      channelsRef.current?.lastElementChild?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [currentChannelId, lastChannelId, channels]);

  return (
    <Col md={2} className="col-4 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('headers.channels')}</b>
        <Button
          type="button"
          className="p-0 text-white btn btn-group-vertical"
          onClick={() => showModal('add')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul id="channels-box" ref={channelsRef} className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => (
          <li className="nav-item w-100" key={channel.id}>
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button
                className="w-100 rounded-0 text-start text-truncate"
                onClick={() => dispatch(channelsActions.setCurrentChannel(channel.id))}
                variant={channel.id === currentChannelId && 'secondary'}
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
              {channel.removable ? (
                <>
                  <Dropdown.Toggle split className="border-0">
                    <span className="visually-hidden">{t('channelActions')}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => showModal('remove', channel)}>
                      {t('buttons.remove')}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => showModal('rename', channel)}>
                      {t('buttons.rename')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </>
              ) : null }
            </Dropdown>
          </li>
        ))}
      </ul>
      {renderModal(modalInfo, hideModal)}
    </Col>
  );
};

export default ChannelsBox;
