import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../pages/Auth/Login';
// import Signup from '../pages/Auth/Signup';
// import ForgotPassword from '../pages/Auth/ForgotPassword';

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  //   { path: '/signup', element: <Signup /> },
  //   { path: '/forgot-password', element: <ForgotPassword /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
