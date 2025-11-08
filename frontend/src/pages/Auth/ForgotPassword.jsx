import { useState } from 'react';
import { Mail } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import api from '../../services/http';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data.success) {
        toast.success('Password reset link sent!');
      } else {
        toast.error(res.data.message || 'No account found for this email');
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
            Forgot Password
          </h2>

          <p className='text-center text-gray-600 mb-8'>
            Enter your email and we’ll send you a password reset link.
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition'
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>

            <div className='text-sm text-center mt-4'>
              <a
                href='/login'
                className='text-indigo-600 hover:text-indigo-800 transition font-medium'
              >
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
