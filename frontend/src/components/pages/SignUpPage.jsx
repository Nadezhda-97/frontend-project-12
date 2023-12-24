import React, { useRef, useState, useEffect } from 'react';
import {
  Container, Row, Col, Card, Image, Form, FormGroup, Button,
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
      .min(3, t('errors.symbolsCount'))
      .max(20, t('errors.symbolsCount')),
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

  useEffect(() => {
    inputRef.current.focus();
  }, []);

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
                <fieldset disabled={formik.isSubmitting}>
                  <FormGroup controlId="username" className="mb-3 form-floating">
                    <Form.Control
                      placeholder={t('placeholders.usernameLength')}
                      name="username"
                      autoComplete="username"
                      required
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      isInvalid={(formik.touched.username && formik.errors.username) || authFailed}
                      ref={inputRef}
                    />
                    <Form.Label>{t('placeholders.username')}</Form.Label>
                    {authFailed ? null : (
                      <Form.Control.Feedback type="invalid" tooltip placement="right">
                        {formik.errors.username}
                      </Form.Control.Feedback>
                    )}
                  </FormGroup>
                  <FormGroup controlId="password" className="mb-3 form-floating">
                    <Form.Control
                      placeholder={t('placeholders.passwordLength')}
                      name="password"
                      aria-describedby="passwordHelpBlock"
                      required
                      autoComplete="new-password"
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      isInvalid={(formik.touched.password && formik.errors.password) || authFailed}
                    />
                    <Form.Label>{t('placeholders.password')}</Form.Label>
                    {authFailed ? null : (
                      <Form.Control.Feedback type="invalid" tooltip>
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    )}
                  </FormGroup>
                  <FormGroup controlId="confirmPassword" className="mb-4 form-floating">
                    <Form.Control
                      placeholder={t('placeholders.match')}
                      name="confirmPassword"
                      required
                      autoComplete="new-password"
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.confirmPassword}
                      isInvalid={
                        (formik.touched.confirmPassword && formik.errors.confirmPassword)
                        || authFailed
                      }
                    />
                    <Form.Label>{t('placeholders.confirmPassword')}</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      {authFailed ? t('errors.alreadyExists') : formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  </FormGroup>
                  <Button type="submit" className="w-100 mb-3" variant="outline-primary">
                    {t('buttons.signup')}
                  </Button>
                </fieldset>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
