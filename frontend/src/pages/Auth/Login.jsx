import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../services/http';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        toast.success('Login successful!');
      } else {
        toast.error(res.data.message || 'Invalid credentials');
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
        <div
          className='bg-white/80 backdrop-blur-xl border border-white/50 
          shadow-2xl rounded-3xl px-10 py-14 w-full sm:max-w-lg md:max-w-xl 
          transform transition-all duration-500 hover:scale-[1.01]'
        >
          <h2 className='text-center text-4xl font-extrabold text-gray-900 mb-10 tracking-tight'>
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
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
                  className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition outline-none text-gray-900 bg-white/60 placeholder-gray-400'
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
                  autoComplete='current-password'
                  className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 transition outline-none text-gray-900 bg-white/60 placeholder-gray-400'
                  placeholder='••••••••'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Links */}
            <div className='flex justify-between text-sm font-medium'>
              <a
                href='/forgot-password'
                className='text-indigo-600 hover:text-indigo-800 transition'
              >
                Forgot password?
              </a>
              <a
                href='/signup'
                className='text-gray-700 hover:text-indigo-600 transition'
              >
                Create account
              </a>
            </div>

            {/* Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-indigo-600 text-white font-semibold 
                rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 
                focus:ring-indigo-300 transition-all duration-200'
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
