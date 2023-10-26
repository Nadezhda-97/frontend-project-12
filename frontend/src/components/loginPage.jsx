import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Button, Card, Col, Container, Form, FloatingLabel, Row,
} from 'react-bootstrap';
import { toast } from 'react-toastify';

import { useAuth } from '../hooks/index.jsx';
import routes from '../routes/routes.js';

const schema = yup.object().shape({
  username: yup.string().trim().required(),
  password: yup.string().trim().required(),
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
    schema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const response = await axios.post(routes.loginPath, values);
        auth.logIn(response.data.token, response.data.username);
        navigate('/');
      } catch (error) {
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
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body className="row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src="#"
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Войти</h1>
                <FloatingLabel className="mb-3" controlId="username" label="Ваш ник">
                  <Form.Control
                    ref={inputRef}
                    name="username"
                    type="username"
                    autoComplete="username"
                    placeholder="Ваш ник"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    isInvalid={authFailed}
                  />
                </FloatingLabel>
                <FloatingLabel className="mb-4" controlId="password" label="Пароль">
                  <Form.Control
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Пароль"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    isInvalid={authFailed}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Неверные имя пользователя или пароль
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
