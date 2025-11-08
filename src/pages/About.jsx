import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white flex flex-col'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='flex flex-col items-center justify-center flex-1 px-6 text-center'
      >
        <h1 className='text-5xl font-extrabold mb-6'>About HackUTD Project</h1>
        <p className='max-w-2xl text-lg text-white/90 leading-relaxed mb-10'>
          Our mission is to build a platform that empowers developers and
          students to collaborate, innovate, and showcase their creativity
          during HackUTD. This project was designed with modern web
          technologies, focusing on speed, accessibility, and elegant user
          experience.
        </p>

        <div className='flex flex-wrap justify-center gap-4 text-sm text-white/80'>
          <span className='px-4 py-2 bg-white/20 rounded-full'>React.js</span>
          <span className='px-4 py-2 bg-white/20 rounded-full'>
            Tailwind CSS
          </span>
          <span className='px-4 py-2 bg-white/20 rounded-full'>
            Framer Motion
          </span>
          <span className='px-4 py-2 bg-white/20 rounded-full'>
            Node.js (Backend)
          </span>
        </div>
      </motion.div>
      <footer className='text-center text-white/70 py-6 text-sm border-t border-white/30'>
        © {new Date().getFullYear()} HackUTD Project — All rights reserved.
      </footer>
    </div>
  );
}
