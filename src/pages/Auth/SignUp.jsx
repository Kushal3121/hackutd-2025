import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../services/http';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      if (res.data.success) {
        toast.success('Account created successfully!');
        // navigate("/login");
      } else {
        toast.error(res.data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Server not reachable — backend not connected yet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex justify-center w-full'
      >
        <div className='bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl px-10 py-12 w-full sm:max-w-lg md:max-w-xl'>
          <h2 className='text-center text-4xl font-extrabold text-gray-900 mb-10'>
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Full Name
              </label>
              <div className='relative flex items-center'>
                <User
                  className='absolute left-3 text-gray-400 pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='text'
                  autoComplete='name'
                  className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/60 placeholder-gray-400'
                  placeholder='John Doe'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <div className='relative flex items-center'>
                <Mail
                  className='absolute left-3 text-gray-400 pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='email'
                  autoComplete='email'
                  className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/60 placeholder-gray-400'
                  placeholder='you@example.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Password
              </label>
              <div className='relative flex items-center'>
                <Lock
                  className='absolute left-3 text-gray-400 pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='password'
                  autoComplete='new-password'
                  className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/60 placeholder-gray-400'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm Password
              </label>
              <div className='relative flex items-center'>
                <Lock
                  className='absolute left-3 text-gray-400 pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='password'
                  autoComplete='new-password'
                  className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white/60 placeholder-gray-400'
                  placeholder='••••••••'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='text-sm text-center'>
              <span className='text-gray-700'>Already have an account? </span>
              <a
                href='/login'
                className='text-indigo-600 hover:text-indigo-800 font-medium transition'
              >
                Sign In
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition'
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
