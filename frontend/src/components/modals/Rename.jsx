import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useChatContext } from '../../hooks/index.jsx';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

const Rename = ({ modalInfo, hideModal }) => {
  const { t } = useTranslation();
  const { renameChannel } = useChatContext();
  const { channel } = modalInfo;
  const inputRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .notOneOf(channelsNames, t('errors.unique')),
  });

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: channel.id,
      name: channel.name,
    },
    validationSchema: schema,
    onSubmit: async ({ id, name }, { setSubmitting }) => {
      const filteredName = leoProfanity.clean(name);
      try {
        await renameChannel({ id, name: filteredName });
        setSubmitting(true);
        hideModal();
        toast.success(t('feedback.channelRenamed'));
      } catch (error) {
        setSubmitting(false);
        toast.error(t('feedback.networkError'));
      }
    },
  });

  return (
    <Modal show centered onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t('headers.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group controlId="name">
            <Form.Control
              name="name"
              className="mb-2"
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={formik.errors.name && formik.touched.name}
              ref={inputRef}
              disabled={formik.isSubmitting}
            />
            <Form.Label className="visually-hidden">{t('channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                className="me-2"
                variant="secondary"
                onClick={hideModal}
              >
                {t('buttons.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
                {t('buttons.send')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
