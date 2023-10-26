import { useContext } from 'react';
import { AuthContext, ApiContext } from '../context/index.jsx';

const useAuth = () => useContext(AuthContext);
const useApi = () => useContext(ApiContext);

export { useAuth, useApi };
