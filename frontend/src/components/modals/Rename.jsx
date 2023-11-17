import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { useChatContext } from '../../hooks/index.jsx';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';

const Rename = ({ modalInfo, hideModal }) => {
  const { renameChannel } = useChatContext();
  const { channel } = modalInfo;
  const inputRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  const schema = yup.object().shape({
    name: yup.string()
      .trim()
      .required('Обязательное поле')
      .notOneOf(channelsNames, 'Должно быть уникальным'),
  });

  const formik = useFormik({
    initialValues: {
      id: channel.id,
      name: channel.name,
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await renameChannel(values);
        setSubmitting(true);
        hideModal();
      } catch (error) {
        setSubmitting(false);
        console.error(error.message);
      }
    },
  });

  return (
    <Modal show centered onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label className="visually-hidden">Имя канала</Form.Label>
            <Form.Control
              id="name"
              name="name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.name}
              className="mb-2"
              ref={inputRef}
              disabled={formik.isSubmitting}
              isInvalid={formik.errors.name && formik.touched.name}
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3 gap-2 d-flex justify-content-end">
            <Button variant="secondary" onClick={hideModal}>Отменить</Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting}>Отправить</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
