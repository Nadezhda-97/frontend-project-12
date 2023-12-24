import React from 'react';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { actions as channelsActions } from '../slices/channelsSlice.js';

const Channel = ({ channel, showModal }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const variant = channel.id === currentChannelId ? 'secondary' : 'default';

  return (
    <li className="nav-item w-100">
      <Dropdown as={ButtonGroup} className="d-flex">
        <Button
          className="w-100 rounded-0 text-start text-truncate"
          onClick={() => dispatch(channelsActions.setCurrentChannel(channel.id))}
          variant={variant}
        >
          <span className="me-1">#</span>
          {channel.name}
        </Button>
        {channel.removable ? (
          <>
            <Dropdown.Toggle variant={variant} split className="border-0">
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
  );
};

export default Channel;
