import api from './axios';
import Cookies from 'js-cookie';

export const loginUser = async (username, password) => {
  const res = await api.post('/login', { username, password });
  if (res.data.token) {
    Cookies.set('sdr_token', res.data.token, { expires: 1 });
  }
  return res.data;
};

export const logoutUser = () => {
  Cookies.remove('sdr_token');
};