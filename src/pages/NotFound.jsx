import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-6'>
      {/* Animated gradient blob */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.25 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className='absolute w-[500px] h-[500px] bg-pink-400 rounded-full blur-3xl opacity-40'
        style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className='relative z-10 bg-white/80 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-3xl px-10 py-14 text-center max-w-lg w-full'
      >
        {/* Big number with gradient text */}
        <h1 className='text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-4'>
          404
        </h1>

        <h2 className='text-2xl font-semibold text-gray-900 mb-3'>
          Page Not Found
        </h2>

        <p className='text-gray-600 mb-10 leading-relaxed'>
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back on track.
        </p>

        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          <Link
            to='/'
            className='flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition'
          >
            Go Home
          </Link>

          <Link
            to='/login'
            className='px-6 py-3 border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50 transition'
          >
            Sign In
          </Link>
        </div>
      </motion.div>

      {/* Subtle floating text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2 }}
        className='absolute bottom-6 text-white/70 text-sm'
      >
        © {new Date().getFullYear()} HackUTD — Innovate Fearlessly.
      </motion.p>
    </div>
  );
}
