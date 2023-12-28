import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import leoProfanity from 'leo-profanity';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { useChatContext } from '../../hooks/index.jsx';

const Rename = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { renameChannel } = useChatContext();
  const inputRef = useRef(null);

  const channels = useSelector(channelsSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const channelForRename = useSelector((state) => state.modals.channel);

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
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      id: channelForRename.id,
      name: channelForRename.name,
    },
    validationSchema: schema,
    validateOnChange: true,
    onSubmit: async ({ id, name }, { setSubmitting }) => {
      const filteredName = leoProfanity.clean(name);
      try {
        await renameChannel({ id, name: filteredName });
        setSubmitting(false);
        dispatch(modalsActions.hideModal());
        toast.success(t('feedback.channelRenamed'));
      } catch (error) {
        setSubmitting(false);
        toast.error(t('feedback.networkError'));
      }
    },
  });

  return (
    <Modal show centered onHide={() => dispatch(modalsActions.hideModal())}>
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
              isInvalid={formik.errors.name}
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
                onClick={() => dispatch(modalsActions.hideModal())}
              >
                {t('buttons.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={formik.isSubmitting || !formik.isValid}>
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
