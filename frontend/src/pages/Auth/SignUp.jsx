import { useState } from 'react';
import { Lock, User, AtSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { signupUser } from '../../services/api';

export default function Signup() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signupUser(form);
      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
        if (res.token) localStorage.setItem('token', res.token);

        toast.success('Account created successfully!');
        setTimeout(() => navigate('/dashboard'), 200);
      } else {
        toast.error(res.error || 'Signup failed');
      }
    } catch {
      toast.error('Server not reachable');
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
        transition={{ duration: 0.5 }}
        className='flex justify-center w-full'
      >
        <div className='bg-white/90 backdrop-blur-xl border border-toyotaGray-mid shadow-2xl rounded-3xl px-10 py-12 w-full sm:max-w-lg md:max-w-xl'>
          <h2 className='text-center text-4xl font-extrabold text-toyotaRed mb-10'>
            Create Your Account
          </h2>

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
                  placeholder='johndoe123'
                  required
                  className='w-full pl-10 pr-3 py-3 border border-toyotaGray-mid rounded-lg focus:ring-2 focus:ring-toyotaRed focus:border-toyotaRed outline-none bg-white/80 placeholder-gray-400'
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className='block text-sm font-medium text-toyotaGray mb-1'>
                Full Name
              </label>
              <div className='relative flex items-center'>
                <User
                  className='absolute left-3 text-toyotaGray-mid pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder='John Doe'
                  required
                  className='w-full pl-10 pr-3 py-3 border border-toyotaGray-mid rounded-lg focus:ring-2 focus:ring-toyotaRed focus:border-toyotaRed outline-none bg-white/80 placeholder-gray-400'
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className='block text-sm font-medium text-toyotaGray mb-1'>
                Password
              </label>
              <div className='relative flex items-center'>
                <Lock
                  className='absolute left-3 text-toyotaGray-mid pointer-events-none'
                  size={18}
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  placeholder='••••••••'
                  required
                  className='w-full pl-10 pr-3 py-3 border border-toyotaGray-mid rounded-lg focus:ring-2 focus:ring-toyotaRed focus:border-toyotaRed outline-none bg-white/80 placeholder-gray-400'
                />
              </div>
            </div>

            {/* Already have an account */}
            <div className='text-sm text-center'>
              <span className='text-toyotaGray'>Already have an account? </span>
              <Link
                to='/login'
                className='text-toyotaRed hover:text-toyotaRed-dark font-medium transition'
              >
                Sign In
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type='submit'
              disabled={loading}
              className='w-full py-3 bg-toyotaRed text-white font-semibold rounded-lg shadow-md hover:bg-toyotaRed-dark focus:ring-4 focus:ring-toyotaRed/40 transition'
            >
              {loading ? 'Creating...' : 'Sign Up'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </AuthLayout>
  );
}
