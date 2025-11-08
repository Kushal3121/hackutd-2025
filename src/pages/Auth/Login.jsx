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
      // Future-ready endpoint
      const res = await api.post('/auth/login', { email, password });

      if (res.data.success) {
        toast.success('Login successful!');
        // localStorage.setItem("token", res.data.token);
        // navigate("/dashboard");
      } else {
        toast.error(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Server not reachable — check backend setup later');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className='text-3xl font-bold text-center text-indigo-600 mb-6'>
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Email
            </label>
            <div className='mt-1 relative'>
              <Mail
                className='absolute left-3 top-2.5 text-gray-400'
                size={18}
              />
              <input
                type='email'
                className='w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Password
            </label>
            <div className='mt-1 relative'>
              <Lock
                className='absolute left-3 top-2.5 text-gray-400'
                size={18}
              />
              <input
                type='password'
                className='w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className='flex justify-between text-sm'>
            <a
              href='/forgot-password'
              className='text-indigo-600 hover:underline'
            >
              Forgot password?
            </a>
            <a href='/signup' className='text-gray-600 hover:text-indigo-600'>
              Create account
            </a>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition'
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </AuthLayout>
  );
}
