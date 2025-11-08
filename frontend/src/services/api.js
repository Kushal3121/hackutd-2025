import axios from 'axios';
import { API_ROUTES } from '../routes/backend/apiRoutes';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

// --- Auth APIs ---
export const signupUser = async ({ username, name, password }) => {
  const { data } = await api.post(API_ROUTES.SIGNUP, {
    username,
    name,
    password,
  });
  return data;
};

export const loginUser = async ({ username, password }) => {
  const { data } = await api.post(API_ROUTES.LOGIN, { username, password });
  return data;
};

export const resetPassword = async ({
  username,
  currentPassword,
  newPassword,
}) => {
  const { data } = await api.post(API_ROUTES.RESET_PASSWORD, {
    username,
    currentPassword,
    newPassword,
  });
  return data;
};

// --- User APIs ---
export const getUsers = async () => {
  const { data } = await api.get(API_ROUTES.USERS);
  return data;
};

export const getUserDetail = async (username) => {
  const { data } = await api.get(API_ROUTES.USER_DETAIL(username));
  return data;
};

export default api;
