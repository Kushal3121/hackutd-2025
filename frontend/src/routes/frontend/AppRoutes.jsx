import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../../pages/Home';
import Login from '../../pages/Auth/Login';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import NotFound from '../../pages/NotFound';
import Signup from '../../pages/Auth/SignUp';
import About from '../../pages/About';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/about', element: <About /> },
  { path: '*', element: <NotFound /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
