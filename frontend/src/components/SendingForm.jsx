import React, { useEffect, useRef } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { ArrowRightSquareFill } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';

import * as yup from 'yup';
import { useFormik } from 'formik';

import { useChatContext } from '../hooks/index.jsx';

const SendingForm = ({ currentChannelId }) => {
  const { t } = useTranslation();
  const { addMessage } = useChatContext();
  const inputRef = useRef(null);

  const schema = yup.object().shape({
    message: yup.string().trim().required(t('errors.required')),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId]);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: schema,
    onSubmit: async ({ message }, { setSubmitting, resetForm }) => {
      const filteredMessage = leoProfanity.clean(message);
      try {
        await addMessage({ message: filteredMessage });
        setSubmitting(true);
        resetForm();
      } catch (error) {
        setSubmitting(false);
        toast.error(t('feedback.networkError'));
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
            aria-label={t('newMessage')}
            placeholder={t('placeholders.addMessage')}
            className="border-0 p-0 ps-2 form-control"
            onChange={formik.handleChange}
            value={formik.values.message}
            ref={inputRef}
          />
          <Button type="submit" disabled={formik.isSubmitting} className="btn-group-vertical">
            <ArrowRightSquareFill size={20} />
            <span className="visually-hidden">{t('buttons.send')}</span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default SendingForm;
