import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';
import { useChatContext } from '../../hooks/index.jsx';

const Add = ({ hideModal }) => {
  const { addChannel } = useChatContext();
  const inputRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map((channel) => channel.name);

  const schema = yup.object().shape({
    name: yup.string()
      .trim()
      .required('Обязательное поле')
      .notOneOf(channelsNames, 'Должно быть уникальным'),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: schema,
    onSubmit: async (value, { setSubmitting }) => {
      try {
        await addChannel(value);
        setSubmitting(true);
        hideModal();
      } catch (error) {
        setSubmitting(false);
        console.error(error.message);
      } finally {
        inputRef.current.focus();
      }
    },
  });

  return (
    <Modal show centered onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title className="h4">Добавить канал</Modal.Title>
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
            <Form.Label className="visually-hidden" htmlFor="name">Имя канала</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button onClick={hideModal} className="me-2" variant="secondary">Отменить</Button>
              <Button type="submit" variant="primary" disabled={formik.isSubmitting}>Отправить</Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
