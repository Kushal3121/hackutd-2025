import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <nav className='fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-toyotaGray-mid'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
        {/* Logo */}
        <Link
          to='/'
          className='flex items-center space-x-2'
          onClick={() => setOpen(false)}
        >
          {/* Kynetic logo (you can place an SVG or image here later) */}
          <span className='text-2xl font-extrabold text-toyotaRed tracking-tight hover:text-toyotaRed-dark transition'>
            TOYOTA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className='hidden sm:flex items-center space-x-8'>
          <Link
            to='/'
            className={`font-medium ${
              isActive('/')
                ? 'text-toyotaRed'
                : 'text-toyotaGray hover:text-toyotaRed'
            }`}
          >
            Home
          </Link>

          <Link
            to='/about'
            className={`font-medium ${
              isActive('/about')
                ? 'text-toyotaRed'
                : 'text-toyotaGray hover:text-toyotaRed'
            }`}
          >
            About
          </Link>

          <div className='flex items-center space-x-3'>
            <Link
              to='/login'
              className='px-5 py-2 bg-toyotaRed text-white font-medium rounded-lg shadow-md hover:bg-toyotaRed-dark transition'
            >
              Sign In
            </Link>

            <Link
              to='/signup'
              className='px-5 py-2 border border-toyotaRed text-toyotaRed font-medium rounded-lg hover:bg-toyotaRed hover:text-white transition'
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className='sm:hidden text-toyotaGray focus:outline-none'
          onClick={() => setOpen(!open)}
          aria-label='Toggle menu'
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className='sm:hidden bg-white/95 backdrop-blur-lg shadow-md border-t border-toyotaGray-mid'>
          <div className='flex flex-col space-y-4 py-4 px-6'>
            <Link
              to='/'
              className={`font-medium ${
                isActive('/')
                  ? 'text-toyotaRed'
                  : 'text-toyotaGray hover:text-toyotaRed'
              }`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>

            <Link
              to='/about'
              className={`font-medium ${
                isActive('/about')
                  ? 'text-toyotaRed'
                  : 'text-toyotaGray hover:text-toyotaRed'
              }`}
              onClick={() => setOpen(false)}
            >
              About
            </Link>

            <Link
              to='/login'
              className='px-4 py-2 bg-toyotaRed text-white font-medium rounded-lg hover:bg-toyotaRed-dark transition text-center'
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>

            <Link
              to='/signup'
              className='px-4 py-2 border border-toyotaRed text-toyotaRed font-medium rounded-lg hover:bg-toyotaRed hover:text-white transition text-center'
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
