import React, { useRef, useState } from 'react';
import {
  Container, Row, Col, Card, Image, Form, FloatingLabel, Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import { useAuth } from '../../hooks/index.jsx';
import routes from '../../routes/routes.js';
import signupImage from '../../assets/SignUpPage.jpg';

const SignUpPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const schema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .min(3, t('errors.usernameLength'))
      .max(20, t('errors.usernameLength')),
    password: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .min(6, t('errors.passwordLength')),
    confirmPassword: yup
      .string()
      .trim()
      .required(t('errors.required'))
      .oneOf([yup.ref('password'), null], t('errors.match')),
  });

  const [authFailed, setAuthFailed] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.post(routes.signUpPath, values);
        auth.logIn(data);
        navigate(routes.chatPage);
      } catch (error) {
        setSubmitting(false);
        if (!error.isAxiosError) {
          toast.error(t('feedback.unknownError'));
        }
        if (error.response.status === 409) {
          setAuthFailed(true);
          inputRef.current.select();
        } else {
          toast.error(t('feedback.networkError'));
        }
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
              <div>
                <Image src={signupImage} className="rounded-circle" alt={t('headers.signup')} />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">{t('headers.signup')}</h1>
                <FloatingLabel className="mb-3" label={t('placeholders.username')}>
                  <Form.Control
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder={t('placeholders.username')}
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    isInvalid={(formik.touched.username && formik.errors.username) || authFailed}
                    disabled={formik.isSubmitting}
                    ref={inputRef}
                  />
                  {authFailed ? (
                    <Form.Control.Feedback type="invalid" />
                  ) : (
                    <Form.Control.Feedback type="invalid" tooltip>
                      {authFailed ? null : formik.errors.username}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
                <FloatingLabel className="mb-3" label={t('placeholders.password')}>
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t('placeholders.password')}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    isInvalid={(formik.touched.password && formik.errors.password) || authFailed}
                    disabled={formik.isSubmitting}
                  />
                  {authFailed ? (
                    <Form.Control.Feedback type="invalid" />
                  ) : (
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  )}
                </FloatingLabel>
                <FloatingLabel className="mb-4" label={t('placeholders.confirmPassword')}>
                  <Form.Control
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t('placeholders.confirmPassword')}
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    isInvalid={
                      (formik.touched.confirmPassword && formik.errors.confirmPassword)
                      || authFailed
                    }
                    disabled={formik.isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {authFailed ? t('errors.alreadyExists') : formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                  {t('buttons.signup')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
