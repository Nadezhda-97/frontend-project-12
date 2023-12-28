import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useChatContext } from '../../hooks/index.jsx';
import { actions as modalsActions } from '../../slices/modalsSlice.js';

const Remove = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { removeChannel } = useChatContext();

  const channelForRemove = useSelector((state) => state.modals.channel);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await removeChannel(channelForRemove.id);
      dispatch(modalsActions.hideModal());
      toast.success(t('feedback.channelRemoved'));
    } catch (error) {
      toast.error(t('feedback.networkError'));
    }
  };

  return (
    <Modal show centered onHide={() => dispatch(modalsActions.hideModal())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('headers.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('messages.warning')}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3 gap-2 d-flex justify-content-end">
            <Button variant="secondary" onClick={() => dispatch(modalsActions.hideModal())}>{t('buttons.cancel')}</Button>
            <Button variant="danger" type="submit">{t('buttons.remove')}</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
