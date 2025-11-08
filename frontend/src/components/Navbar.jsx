import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-lg shadow-sm border-b border-white/40'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
        {/* Logo */}
        <Link
          to='/'
          className='text-2xl font-extrabold text-indigo-700 tracking-tight hover:text-indigo-900 transition'
        >
          HackUTD
        </Link>

        {/* Desktop Nav */}
        <div className='hidden sm:flex items-center space-x-8'>
          <Link
            to='/'
            className={`font-medium ${
              isActive('/')
                ? 'text-indigo-700'
                : 'text-gray-700 hover:text-indigo-600'
            }`}
          >
            Home
          </Link>
          <Link
            to='/about'
            className={`font-medium ${
              isActive('/about')
                ? 'text-indigo-700'
                : 'text-gray-700 hover:text-indigo-600'
            }`}
          >
            About
          </Link>

          <div className='flex items-center space-x-3'>
            <Link
              to='/login'
              className='px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition'
            >
              Sign In
            </Link>
            <Link
              to='/signup'
              className='px-5 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition'
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className='sm:hidden text-gray-800 focus:outline-none'
          onClick={() => setOpen(!open)}
          aria-label='Toggle menu'
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className='sm:hidden bg-white/90 backdrop-blur-lg shadow-md border-t border-gray-200'>
          <div className='flex flex-col space-y-4 py-4 px-6'>
            <Link
              to='/'
              className={`font-medium ${
                isActive('/')
                  ? 'text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <Link
              to='/about'
              className={`font-medium ${
                isActive('/about')
                  ? 'text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600'
              }`}
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Link
              to='/login'
              className='px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition text-center'
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to='/signup'
              className='px-4 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition text-center'
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
