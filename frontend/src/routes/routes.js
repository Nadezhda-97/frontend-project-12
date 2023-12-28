const apiPath = '/api/v1';

export default {
  loginPath: [apiPath, 'login'].join('/'),
  signUpPath: [apiPath, 'signup'].join('/'),
  dataPath: [apiPath, 'data'].join('/'),
  chatPage: '/',
  loginPage: '/login',
  signUpPage: '/signup',
};
