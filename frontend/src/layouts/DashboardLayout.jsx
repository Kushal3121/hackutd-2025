import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/TopBar';
import CompareFab from '../components/CompareFab';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (stored && token) setUser(JSON.parse(stored));
    else navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='flex h-screen bg-toyotaGray-light font-sans'>
      <Toaster position='top-right' reverseOrder={false} />
      <Sidebar onLogout={handleLogout} />
      <div className='flex-1 flex flex-col'>
        <Topbar user={user} onLogout={handleLogout} />
        <main className='flex-1 overflow-y-auto p-6 bg-toyotaGray-light'>
          <Outlet />
        </main>
      </div>
      <CompareFab />
    </div>
  );
}
