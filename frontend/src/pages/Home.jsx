import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-toyotaGray-light to-[#F3F3F3] flex flex-col'>
      <Navbar />

      {/* Hero Section */}
      <section className='flex flex-col items-center justify-center flex-1 px-6 text-center text-toyotaGray'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='max-w-3xl'
        >
          <h1 className='text-5xl sm:text-6xl font-extrabold mb-6 leading-tight'>
            Discover the Future of{' '}
            <span className='text-toyotaRed'>Kynetic Mobility</span>
          </h1>

          <p className='text-lg sm:text-xl text-toyotaGray mb-10'>
            Explore, compare, and find your dream Kynetic — powered by
            innovation, designed for every lifestyle.
          </p>

          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <Link
              to='/signup'
              className='px-8 py-3 bg-toyotaRed text-white font-semibold rounded-lg shadow-md hover:bg-toyotaRed-dark transition'
            >
              Get Started
            </Link>

            <Link
              to='/login'
              className='px-8 py-3 border-2 border-toyotaRed text-toyotaRed font-semibold rounded-lg hover:bg-toyotaRed hover:text-white transition'
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className='text-center text-toyotaGray py-6 text-sm border-t border-toyotaGray-mid'>
        © {new Date().getFullYear()} Kynetic Mobility Challenge — All Rights
        Reserved.
      </footer>
    </div>
  );
}
