import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import getModal from './modals/index.js';

import Channel from './Channel.jsx';

const defaultChannelId = 1;

const renderModal = (modalType) => {
  if (!modalType) {
    return null;
  }
  const Modal = getModal(modalType);
  return <Modal />;
};

const ChannelsBox = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channelsRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const channelsIds = useSelector(channelsSelectors.selectIds);
  const lastChannelId = channelsIds[channelsIds.length - 1];

  const modalType = useSelector((state) => state.modals.modalType);

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
          className="p-0 btn btn-light text-primary btn-group-vertical"
          onClick={() => dispatch(modalsActions.showModal({ modalType: 'add' }))}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="20"
            height="20"
            fill="currentColor"
          >
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul id="channels-box" ref={channelsRef} className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map((channel) => (
          <Channel key={channel.id} channel={channel} />
        ))}
      </ul>
      {renderModal(modalType)}
    </Col>
  );
};

export default ChannelsBox;
