import React, { useEffect, useRef, useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
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
  const [delivery, setDelivery] = useState(false);

  const schema = yup.object().shape({
    message: yup.string().trim().required(t('errors.required')),
  });

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId, delivery]);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    validationSchema: schema,
    onSubmit: async ({ message }, { setSubmitting, resetForm }) => {
      const filteredMessage = leoProfanity.clean(message);
      try {
        await addMessage({ message: filteredMessage });
        setDelivery(true);
        setSubmitting(true);
        resetForm();
        setTimeout(() => setDelivery(false), 2000);
      } catch (error) {
        setDelivery(false);
        setSubmitting(false);
        toast.error(t('feedback.networkError'));
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
            disabled={formik.isSubmitting}
          />
          <Button type="submit" disabled={formik.isSubmitting || formik.values.message.trim() === ''} className="btn btn-light text-primary btn-group-vertical">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              width="20"
              height="20"
            >
              <path
                fillRule="evenodd"
                d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
              />
            </svg>
            <span className="visually-hidden">{t('buttons.send')}</span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default SendingForm;
