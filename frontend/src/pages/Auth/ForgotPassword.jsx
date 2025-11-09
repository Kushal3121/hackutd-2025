import { useState } from 'react';
import { Lock, AtSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { resetPassword } from '../../services/api';

export default function ForgotPassword() {
  const [form, setForm] = useState({
    username: '',
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await resetPassword(form);
      if (res.message) {
        toast.success(res.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(res.error || 'Reset failed');
      }
    } catch {
      toast.error('Server not reachable — please check backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Toaster position='top-right' reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex justify-center w-full'
      >
        <div className='bg-white/90 backdrop-blur-xl border border-toyotaGray-mid shadow-2xl rounded-3xl px-10 py-12 w-full sm:max-w-lg md:max-w-xl'>
          <h2 className='text-center text-4xl font-extrabold text-toyotaRed mb-6'>
            Reset Password
          </h2>

          <p className='text-center text-toyotaGray mb-8'>
            Enter your username and set a new password securely.
          </p>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Username */}
            <div>
              <label className='block text-sm font-medium text-toyotaGray mb-1'>
                Username
              </label>
              <div className='relative flex items-center'>
                <AtSign
                  className='absolute left-3 text-toyotaGray-mid pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='text'
                  name='username'
                  value={form.username}
                  onChange={handleChange}
                  placeholder='Enter your username'
                  required
                  className='w-full pl-10 pr-3 py-3 border border-toyotaGray-mid rounded-lg focus:ring-2 focus:ring-toyotaRed focus:border-toyotaRed outline-none bg-white/80 placeholder-gray-400'
                />
              </div>
            </div>

            {/* Current Password */}
            <div>
              <label className='block text-sm font-medium text-toyotaGray mb-1'>
                Current Password
              </label>
              <div className='relative flex items-center'>
                <Lock
                  className='absolute left-3 text-toyotaGray-mid pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='password'
                  name='currentPassword'
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                  className='w-full pl-10 pr-3 py-3 border border-toyotaGray-mid rounded-lg focus:ring-2 focus:ring-toyotaRed focus:border-toyotaRed outline-none bg-white/80 placeholder-gray-400'
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className='block text-sm font-medium text-toyotaGray mb-1'>
                New Password
              </label>
              <div className='relative flex items-center'>
                <Lock
                  className='absolute left-3 text-toyotaGray-mid pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='password'
                  name='newPassword'
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                  className='w-full pl-10 pr-3 py-3 border border-toyotaGray-mid rounded-lg focus:ring-2 focus:ring-toyotaRed focus:border-toyotaRed outline-none bg-white/80 placeholder-gray-400'
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-toyotaRed text-white font-semibold rounded-lg shadow-md hover:bg-toyotaRed-dark focus:ring-4 focus:ring-toyotaRed/40 transition'
            >
              {loading ? 'Updating...' : 'Update Password'}
            </motion.button>

            {/* Back to Login */}
            <div className='text-sm text-center mt-4'>
              <Link
                to='/login'
                className='text-toyotaRed hover:text-toyotaRed-dark font-medium transition'
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
