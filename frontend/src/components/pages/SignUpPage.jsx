import React, { useRef, useState } from 'react';
import {
  Container, Row, Col, Card, Image, Form, FloatingLabel, Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import { useAuth } from '../../hooks/index.jsx';
import routes from '../../routes/routes.js';

const schema = yup.object().shape({
  username: yup.string()
    .trim()
    .required('Обязательное поле')
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов'),
  password: yup.string()
    .trim()
    .required('Обязательное поле')
    .min(6, 'Не менее 6 символов'),
  confirmPassword: yup.string()
    .trim()
    .required('Обязательное поле')
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
});

const SignUpPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

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
        if (error.isAxiosError && error.response.status === 409) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        toast.error('Ошибка соединения');
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
                <Image src="#" className="rounded-circle" alt="Регистрация" />
              </div>
              <Form onSubmit={formik.handleSubmit} className="w-50">
                <h1 className="text-center mb-4">Регистрация</h1>
                <FloatingLabel className="mb-3" label="Имя пользователя">
                  <Form.Control
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="От 3 до 20 символов"
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
                <FloatingLabel className="mb-3" label="Пароль">
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Не менее 6 символов"
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
                <FloatingLabel className="mb-4" label="Подтвердите пароль">
                  <Form.Control
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Пароли должны совпадать"
                    onChange={formik.handleChange}
                    value={formik.values.confirmPassword}
                    isInvalid={
                      (formik.touched.confirmPassword && formik.errors.confirmPassword)
                      || authFailed
                    }
                    disabled={formik.isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {authFailed ? 'Такой пользователь уже существует' : formik.errors.confirmPassword}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">Зарегистрироваться</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpPage;
