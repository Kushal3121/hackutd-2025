import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex flex-col'>
      <Navbar />

      {/* Hero Section */}
      <section className='flex flex-col items-center justify-center flex-1 px-6 text-center text-white'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='max-w-3xl'
        >
          <h1 className='text-5xl sm:text-6xl font-extrabold mb-6 leading-tight'>
            Build, Innovate, and Create with{' '}
            <span className='text-yellow-300'>HackUTD</span>
          </h1>
          <p className='text-lg sm:text-xl text-white/90 mb-10'>
            Join the next generation of innovators. Collaborate, code, and bring
            your ideas to life.
          </p>

          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              to='/signup'
              className='px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg shadow-md hover:bg-yellow-300 transition'
            >
              Get Started
            </Link>
            <Link
              to='/login'
              className='px-8 py-3 bg-white/20 border border-white text-white font-semibold rounded-lg shadow-md hover:bg-white/30 transition'
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className='text-center text-white/70 py-6 text-sm border-t border-white/30'>
        © {new Date().getFullYear()} HackUTD UI — All Rights Reserved.
      </footer>
    </div>
  );
}
