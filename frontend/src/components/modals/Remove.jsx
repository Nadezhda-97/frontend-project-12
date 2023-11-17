import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

import { useChatContext } from '../../hooks/index.jsx';

const Remove = ({ modalInfo, hideModal }) => {
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
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Уверены?</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 gap-2 d-flex justify-content-end">
            <Button variant="secondary" onClick={hideModal}>Отменить</Button>
            <Button variant="danger" type="submit">Удалить</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
