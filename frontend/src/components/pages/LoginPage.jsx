import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Image, Form, FormGroup, Button,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import { useAuth } from '../../hooks/index.jsx';
import routes from '../../routes/routes.js';
import loginImage from '../../assets/LoginPage.jpg';

const LoginPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const schema = yup.object().shape({
    username: yup.string().trim().required(t('errors.required')),
    password: yup.string().trim().required(t('errors.required')),
  });

  const [authFailed, setAuthFailed] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthFailed(false);

      try {
        const { data } = await axios.post(routes.loginPath, values);
        auth.logIn(data);
        navigate(routes.chatPage);
      } catch (error) {
        setSubmitting(false);
        if (!error.isAxiosError) {
          toast.error(t('feedback.unknownError'));
        }
        if (error.response?.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
        } else {
          toast.error(t('feedback.networkError'));
        }
      }
    },
  });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Container fluid className="h-100">
      <Row className="row justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={loginImage} className="rounded-circle" alt={t('headers.logIn')} />
              </Col>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('headers.logIn')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <FormGroup controlId="username" className="mb-3 form-floating">
                    <Form.Control
                      name="username"
                      autoComplete="username"
                      required
                      placeholder={t('placeholders.nickname')}
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      isInvalid={authFailed}
                      ref={inputRef}
                    />
                    <Form.Label>{t('placeholders.nickname')}</Form.Label>
                  </FormGroup>
                  <FormGroup controlId="password" className="mb-4 form-floating">
                    <Form.Control
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder={t('placeholders.password')}
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      isInvalid={authFailed}
                    />
                    <Form.Label>{t('placeholders.password')}</Form.Label>
                    {authFailed ? (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {t('errors.incorrect')}
                      </Form.Control.Feedback>
                    ) : null}
                  </FormGroup>
                  <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                    {t('buttons.logIn')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>{t('messages.noAccount')}</span>
                { ' ' }
                <Link to={routes.signUpPage}>{t('links.signup')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
