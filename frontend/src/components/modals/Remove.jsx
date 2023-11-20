import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useChatContext } from '../../hooks/index.jsx';

const Remove = ({ modalInfo, hideModal }) => {
  const { t } = useTranslation();
  const { removeChannel } = useChatContext();
  const { channel } = modalInfo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await removeChannel(channel.id);
      hideModal();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal show centered onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('headers.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('messages.warning')}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 gap-2 d-flex justify-content-end">
            <Button variant="secondary" onClick={hideModal}>{t('buttons.cancel')}</Button>
            <Button variant="danger" type="submit">{t('buttons.remove')}</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
