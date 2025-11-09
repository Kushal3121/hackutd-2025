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

// --- Car APIs ---
export const getCars = async (params) => {
  const { data } = await api.get(API_ROUTES.CARS, { params });
  return data;
};

export const getCarById = async (id) => {
  const { data } = await api.get(API_ROUTES.CAR_DETAIL(id));
  return data;
};

// pass e.g. { region: 'US', year: 2024 }
export const filterCars = async (params = {}) => {
  const { data } = await api.get(API_ROUTES.CAR_FILTER, { params });
  return data;
};

// --- Test Drive APIs ---
export const bookTestDrive = async (payload) => {
  const { data } = await api.post(API_ROUTES.TESTDRIVE, payload);
  return data;
};

export const getUserTestDrives = async (userId) => {
  const { data } = await api.get(API_ROUTES.TESTDRIVE_USER(userId));
  return data;
};

export const getAllTestDrives = async (userId) => {
  const { data } = await api.get(API_ROUTES.TESTDRIVE, {
    params: userId ? { userId } : undefined,
  });
  return data;
};

export const deleteTestDrive = async (id) => {
  const { data } = await api.delete(API_ROUTES.TESTDRIVE_DELETE(id));
  return data;
};

export const updateTestDrive = async (id, payload) => {
  const { data } = await api.put(API_ROUTES.TESTDRIVE_DELETE(id), payload);
  return data;
};
// --- Configurator helper APIs (API-first with graceful fallbacks) ---
export const getPackages = async (carId) => {
  const { data } = await api.get(`${API_ROUTES.CAR_DETAIL(carId)}/packages`);
  return data;
};

export const getDrivetrainOptions = async (carId) => {
  const { data } = await api.get(
    `${API_ROUTES.CAR_DETAIL(carId)}/drivetrain-options`
  );
  return data;
};

export const getInteriorOptions = async (carId) => {
  const { data } = await api.get(`${API_ROUTES.CAR_DETAIL(carId)}/interiors`);
  return data;
};

export const getAccessories = async (carId) => {
  const { data } = await api.get(
    `${API_ROUTES.CAR_DETAIL(carId)}/accessories`
  );
  return data;
};

export const getInsurancePlans = async (carId) => {
  const { data } = await api.get(`${API_ROUTES.CAR_DETAIL(carId)}/insurance`);
  return data;
};

export const getFinancePlans = async (carId) => {
  const { data } = await api.get(`${API_ROUTES.CAR_DETAIL(carId)}/finance`);
  return data; // expected: { finance: {...}, lease: {...} }
};

export const getSummary = async (carId) => {
  const { data } = await api.get(`${API_ROUTES.CAR_DETAIL(carId)}/summary`);
  return data;
};

// --- Lease APIs ---
export const getLeaseCars = async (params = {}) => {
  const { data } = await api.get(API_ROUTES.LEASE, { params });
  return data;
};

export const createLease = async (payload) => {
  const { data } = await api.post(API_ROUTES.LEASE_BOOK, payload);
  return data;
};

export const getMyLeases = async (userId) => {
  const { data } = await api.get(API_ROUTES.LEASE_BOOKINGS, {
    params: { userId },
  });
  return data;
};

export const deleteLeaseBooking = async (id) => {
  const { data } = await api.delete(API_ROUTES.LEASE_BOOKING_DELETE(id));
  return data;
};

export default api;
