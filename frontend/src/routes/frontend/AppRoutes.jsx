import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../../pages/Auth/Login';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import NotFound from '../../pages/NotFound';
import Signup from '../../pages/Auth/SignUp';
import About from '../../pages/About';
import Home from '../../pages/Home';
import DashboardLayout from '../../layouts/DashboardLayout';
import Dashboard from '../../pages/Dashboard';
import CarDetails from '../../pages/CarDetails';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/about', element: <About /> },

  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      // 👇 NEW route for car detail/configurator
      {
        path: 'cars/:id',
        element: <CarDetails />,
      },

      {
        path: 'compare',
        element: (
          <div className='p-6 text-gray-600'>Compare Page (coming soon)</div>
        ),
      },
      {
        path: 'profile',
        element: (
          <div className='p-6 text-gray-600'>Profile Page (coming soon)</div>
        ),
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
