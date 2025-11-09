import { NavLink, useLocation } from 'react-router-dom';
import { Car, BarChart3, User, LogOut } from 'lucide-react';

export default function Sidebar({ onLogout }) {
  const location = useLocation();

  // This will be true for both /dashboard and /dashboard/cars/*
  const isCarsActive =
    location.pathname === '/dashboard' ||
    location.pathname.startsWith('/dashboard/cars');

  return (
    <aside className='w-64 bg-white text-toyotaGray flex flex-col p-5 border-r border-toyotaGray-mid'>
      <h2 className='text-2xl font-bold text-toyotaRed mb-8 uppercase tracking-wider'>
        Toyota
      </h2>

      <nav className='space-y-2'>
        <NavLink
          to='/dashboard'
          end
          className={`flex items-center gap-3 p-2 rounded-lg transition font-medium ${
            isCarsActive
              ? 'bg-toyotaRed text-white'
              : 'hover:bg-toyotaRed-light hover:text-white'
          }`}
        >
          <Car size={20} /> Cars
        </NavLink>

        <NavLink
          to='/dashboard/compare'
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition font-medium ${
              isActive
                ? 'bg-toyotaRed text-white'
                : 'hover:bg-toyotaRed-light hover:text-white'
            }`
          }
        >
          <BarChart3 size={20} /> Compare
        </NavLink>

        <NavLink
          to='/dashboard/profile'
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-lg transition font-medium ${
              isActive
                ? 'bg-toyotaRed text-white'
                : 'hover:bg-toyotaRed-light hover:text-white'
            }`
          }
        >
          <User size={20} /> Profile
        </NavLink>
      </nav>

      <button
        onClick={onLogout}
        className='mt-auto flex items-center gap-2 p-2 rounded-lg text-toyotaGray hover:bg-toyotaRed hover:text-white transition'
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
}
