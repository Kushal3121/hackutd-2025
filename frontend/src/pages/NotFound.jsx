import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CarFront } from 'lucide-react';

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-[#f8f8f8] to-[#ededed] text-center px-6'>
      {/* Animated Car Icon */}
      <motion.div
        initial={{ y: -15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className='mb-6'
      >
        <CarFront
          size={90}
          strokeWidth={1.5}
          className='text-toyotaRed animate-bounce-slow'
        />
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className='text-3xl font-semibold text-toyotaGray mb-3'>
          You’ve Taken a Wrong Turn
        </h2>

        <p className='text-gray-600 text-lg mb-6 max-w-md mx-auto'>
          This route doesn’t seem to exist — let’s get you back to the right
          track.
        </p>

        <Link
          to='/dashboard'
          className='inline-flex items-center justify-center px-8 py-3 bg-toyotaRed text-white font-semibold rounded-lg shadow-sm hover:bg-toyotaRed-dark transition'
        >
          Back to Dashboard
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2 }}
        className='absolute bottom-6 text-toyotaGray text-sm'
      >
        © {new Date().getFullYear()} Kynetic Mobility Challenge — All Rights
        Reserved.
      </motion.p>
    </div>
  );
}
