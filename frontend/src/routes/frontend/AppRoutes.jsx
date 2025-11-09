import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../../pages/Auth/Login';
import ForgotPassword from '../../pages/Auth/ForgotPassword';
import NotFound from '../../pages/NotFound';
import Signup from '../../pages/Auth/SignUp';
import About from '../../pages/About';
import Home from '../../pages/Home';
import DashboardLayout from '../../layouts/DashboardLayout';
import Dashboard from '../../pages/Dashboard';
import Compare from '../../pages/Compare';
import TestDrives from '../../pages/TestDrives';
import CarDetails from '../../pages/CarDetails';
import Garage from '../../pages/Garage';
import Lease from '../../pages/Lease';
import SummaryPage from '../../pages/SummaryPage';

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
        path: 'garage',
        element: <Garage />,
      },

      {
        path: 'compare',
        element: <Compare />,
      },
      {
        path: 'testdrives',
        element: <TestDrives />,
      },
      {
        path: 'lease',
        element: <Lease />,
      },
      {
        path: 'summary',
        element: <SummaryPage />,
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
