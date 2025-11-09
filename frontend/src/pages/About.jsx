import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-[#f8f8f8] to-[#ededed] text-toyotaGray flex flex-col'>
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex flex-col items-center justify-center flex-1 px-6 text-center'
      >
        {/* Title */}
        <h1 className='text-4xl sm:text-5xl font-extrabold mb-6 text-toyotaGray-dark'>
          About{' '}
          <span className='text-toyotaRed'>Kynetic Mobility Challenge</span>
        </h1>

        {/* Description */}
        <p className='max-w-2xl text-lg text-gray-700 leading-relaxed mb-10'>
          The Kynetic Mobility Challenge is an initiative to reimagine the
          driving experience through technology and innovation. Our goal is to
          combine cutting-edge AI, real-time analytics, and human-centered
          design to make every journey safer, smarter, and more connected.
        </p>

        {/* Key Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='flex flex-wrap justify-center gap-4 text-sm text-toyotaGray'
        >
          {[
            'React.js',
            'Tailwind CSS',
            'Framer Motion',
            'Node.js',
            'MongoDB',
            'Three.js',
            'AWS Cloud',
          ].map((tech) => (
            <span
              key={tech}
              className='px-5 py-2 border border-toyotaRed/60 text-toyotaRed font-medium rounded-full hover:bg-toyotaRed hover:text-white transition'
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className='text-center text-toyotaGray text-sm border-t border-gray-200 py-6'>
        © {new Date().getFullYear()} Kynetic Mobility Challenge — All Rights
        Reserved.
      </footer>
    </div>
  );
}
