import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';
import { useChatContext } from '../../hooks/index.jsx';

const Add = ({ hideModal }) => {
  const { t } = useTranslation();
  const { addChannel } = useChatContext();
  const inputRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map((channel) => channel.name);

  const schema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.symbolsCount'))
      .max(20, t('errors.symbolsCount'))
      .notOneOf(channelsNames, t('errors.unique')),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: schema,
    onSubmit: async ({ name }, { setSubmitting }) => {
      const filteredName = leoProfanity.clean(name);
      try {
        await addChannel({ name: filteredName });
        setSubmitting(true);
        hideModal();
        toast.success(t('feedback.channelAdded'));
      } catch (error) {
        setSubmitting(false);
        toast.error(t('feedback.networkError'));
      } finally {
        inputRef.current.focus();
      }
    },
  });

  return (
    <Modal show centered onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title className="h4">{t('headers.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              id="name"
              className="mb-2"
              value={formik.values.name}
              onChange={formik.handleChange}
              ref={inputRef}
              disabled={formik.isSubmitting}
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('channelName')}</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button onClick={hideModal} className="me-2" variant="secondary">
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

export default Add;
