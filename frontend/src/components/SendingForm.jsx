import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquareFill } from 'react-bootstrap-icons';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { useChatContext } from '../hooks/index.jsx';

const schema = yup.object().shape({
  message: yup.string().trim().required('Обязательное поле'),
});

const SendingForm = ({ currentChannelId }) => {
  const { addMessage } = useChatContext();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId]);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await addMessage(values);
        setSubmitting(true);
        resetForm();
      } catch (error) {
        setSubmitting(false);
        console.error(error.message);
      } finally {
        inputRef.current.focus();
      }
    },
  });

  return (
    <div className="mt-auto px-5 py-3">
      <Form noValidate onSubmit={formik.handleSubmit} className="py-1 border rounded-2">
        <InputGroup>
          <Form.Control
            name="message"
            aria-label="Новое сообщение"
            placeholder="Введите сообщение..."
            className="border-0 p-0 ps-2 form-control"
            onChange={formik.handleChange}
            value={formik.values.message}
            ref={inputRef}
          />
          <Button type="submit" disabled={formik.isSubmitting} className="btn-group-vertical">
            <ArrowRightSquareFill size={20} />
            <span className="visually-hidden">Отправить</span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default SendingForm;
