const BASE_URL = 'http://localhost:3000';

export const API_ROUTES = {
  // --- Auth routes ---
  SIGNUP: `${BASE_URL}/signup`,
  LOGIN: `${BASE_URL}/login`,
  RESET_PASSWORD: `${BASE_URL}/reset-password`,

  // --- User routes ---
  USERS: `${BASE_URL}/users`,
  USER_DETAIL: (username) => `${BASE_URL}/users/${username}`,

  // --- Car routes ---
  CARS: `${BASE_URL}/api/cars`, // Get all cars
  CAR_DETAIL: (id) => `${BASE_URL}/api/cars/${id}`, // Get car by ID
  CAR_FILTER: `${BASE_URL}/api/cars/filter`, // Filter by region/year
  // --- Test drive routes ---
  TESTDRIVE: `${BASE_URL}/api/testdrive`,
  TESTDRIVE_USER: (userId) => `${BASE_URL}/api/testdrive/${userId}`,
};
