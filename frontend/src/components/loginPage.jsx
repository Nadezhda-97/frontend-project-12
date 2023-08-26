import { useFormik } from 'formik';

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: console.log('Данные отправлены!'),
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src="#"
                  className="rounded-circle"
                  alt="Войти"
                />
              </div>
              <form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Войти</h1>
                <div className="form-floating mb-3">
                  <input
                    name="username"
                    type="username"
                    autoComplete="username"
                    required
                    placeholder="Ваш ник"
                    id="username"
                    className="form-control"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="username">Ваш ник</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Пароль"
                    id="password"
                    className="form-control"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <label className="form-label" htmlFor="password">Пароль</label>
                </div>
                <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
              </form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                <a href="/">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
