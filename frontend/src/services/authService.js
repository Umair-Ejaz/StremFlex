import API from './api';

export const login = async (credentials, passwordParam) => {
  const payload =
    typeof credentials === 'object' && credentials !== null
      ? { email: credentials.email?.trim(), password: credentials.password }
      : { email: credentials?.trim(), password: passwordParam };

  const { data } = await API.post('/auth/login', payload);
  return data;
};

export const register = async (userData, email, password) => {
  const payload =
    typeof userData === 'object' && userData !== null
      ? {
          username: userData.username?.trim(),
          email: userData.email?.trim(),
          password: userData.password,
        }
      : { username: userData?.trim(), email: email?.trim(), password };

  const { data } = await API.post('/auth/register', payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await API.get('/users/profile');
  return data;
};

export const updateProfile = async (userData) => {
  const { data } = await API.put('/users/profile', userData);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await API.delete('/users/profile');
  return data;
};

export const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  deleteAccount,
};

export default authService;