import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../hooks/index.jsx';
import routes from '../routes/routes.js';

const Header = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  return (
    <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
      <Container>
        <Navbar.Brand as={Link} to={routes.chatPage}>{t('headers.chat')}</Navbar.Brand>
        {auth.userData && (<Button onClick={auth.logOut}>{t('buttons.logOut')}</Button>)}
      </Container>
    </Navbar>
  );
};

export default Header;
