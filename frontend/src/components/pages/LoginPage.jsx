import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Image, Form, FloatingLabel, Button,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import { useAuth } from '../../hooks/index.jsx';
import routes from '../../routes/routes.js';

const schema = yup.object().shape({
  username: yup.string().trim().required('Обязательное поле'),
  password: yup.string().trim().required('Обязательное поле'),
});

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

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
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }

        toast.error('Ошибка соединения');
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
                <Image src="#" className="rounded-circle" alt="Войти" />
              </Col>
              <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Войти</h1>
                <FloatingLabel className="mb-3" label="Ваш ник">
                  <Form.Control
                    id="username"
                    name="username"
                    autoComplete="username"
                    placeholder="Ваш ник"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    isInvalid={(formik.touched.username && formik.errors.username) || authFailed}
                    disabled={formik.isSubmitting}
                    ref={inputRef}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <FloatingLabel className="mb-4" label="Пароль">
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Пароль"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={(formik.touched.password && formik.errors.password) || authFailed}
                    disabled={formik.isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    {authFailed ? 'Неверные имя пользователя или пароль' : formik.errors.password}
                  </Form.Control.Feedback>
                </FloatingLabel>
                <Button type="submit" className="w-100 mb-3" variant="outline-primary">Войти</Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                { ' ' }
                <Link to={routes.signUpPage}>Регистрация</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
