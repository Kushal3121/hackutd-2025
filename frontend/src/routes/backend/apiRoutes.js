const BASE_URL = 'http://localhost:3000';

export const API_ROUTES = {
  SIGNUP: `${BASE_URL}/signup`,
  LOGIN: `${BASE_URL}/login`,
  RESET_PASSWORD: `${BASE_URL}/reset-password`,
  USERS: `${BASE_URL}/users`,
  USER_DETAIL: (username) => `${BASE_URL}/users/${username}`,
};
