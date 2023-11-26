import React from 'react';
import { useTranslation } from 'react-i18next';
import errorImage from '../../assets/NotFoundImage.svg';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center">
      <img
        alt={t('messages.pageNotFound')}
        className="img-fluid h-25"
        src={errorImage}
      />
      <h1 className="h4 text-muted">{t('messages.pageNotFound')}</h1>
      <p className="text-muted">
        {t('messages.redirect')}
        <a href="/login">{t('links.toMainPage')}</a>
      </p>
    </div>
  );
};

export default ErrorPage;
