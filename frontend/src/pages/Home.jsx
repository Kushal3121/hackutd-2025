import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import {
  Car,
  Zap,
  Shield,
  Leaf,
  Award,
  Headphones,
  Users,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  // Static display component (no animation) as requested
  const Counter = ({ end, suffix = '' }) => {
    return (
      <span>
        {end}
        {suffix}
      </span>
    );
  };

  return (
    <div className='min-h-screen flex flex-col bg-white text-toyotaGray overflow-hidden'>
      <Navbar />

      {/* Hero Section */}
      <section className='flex flex-col items-center justify-start px-6 pt-24 pb-6 text-center relative overflow-hidden bg-white'>
        {/* Headline + Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className='relative z-10 max-w-4xl px-4'
        >
          <motion.h1
            className='text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 text-black py-10'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Discover the Future of{' '}
            <motion.span
              className='text-[#eb0a1e] inline-block'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              Kynetic Mobility
            </motion.span>
          </motion.h1>

          <motion.p
            className='text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed'
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Explore, compare, and find your dream Kynetic — powered by
            innovation, designed for every lifestyle.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className='flex flex-col sm:flex-row justify-center gap-4 py-12'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to='/signup'
                className='px-9 py-3 bg-[#eb0a1e] text-white font-semibold rounded-lg  hover:bg-[#d1091b] transition-all'
              >
                Get Started
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                to='/login'
                className='px-9 py-3 border-2 border-[#eb0a1e] text-[#eb0a1e] font-semibold rounded-lg hover:bg-[#eb0a1e]/10 hover:shadow-inner transition-all'
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        className='px-6 pt-10 pb-16 bg-white relative overflow-hidden'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className='max-w-6xl mx-auto'>
          <motion.div
            variants={staggerContainer}
            className='grid grid-cols-2 md:grid-cols-4 gap-8'
          >
            {[
              { value: 50000, suffix: '+', label: 'Happy Customers' },
              { value: 150, suffix: '+', label: 'Vehicle Models' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
              { value: 24, suffix: '/7', label: 'Support Available' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className='text-center'
              >
                <motion.div
                  className='text-4xl md:text-5xl font-bold text-[#eb0a1e] mb-2'
                  whileHover={{ scale: 1.1 }}
                >
                  <Counter end={stat.value} suffix={stat.suffix} />
                </motion.div>
                <p className='text-gray-600 font-medium'>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Models Section */}
      <motion.section
        className='py-20 px-6 bg-white'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className='max-w-6xl mx-auto'>
          <motion.div variants={fadeInUp} className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-black'>
              Featured <span className='text-[#eb0a1e]'>Models</span>
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              Discover our most popular vehicles, crafted for performance,
              comfort, and style
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className='grid md:grid-cols-3 gap-8'
          >
            {[
              {
                name: 'GR Supra',
                category: 'Sports Car',
                price: '$55,250',
                image: '/images/grsupra.jpg',
                features: ['335 HP', '0-60 in 4.1s', 'RWD'],
              },
              {
                name: 'RAV4 Hybrid',
                category: 'SUV',
                price: '$32,475',
                image: '/images/rav4.jpg',
                features: ['219 HP', '40 MPG', 'AWD'],
              },
              {
                name: 'Camry TRD',
                category: 'Sedan',
                price: '$35,790',
                image: '/images/camry.jpg',
                features: ['301 HP', 'Sport Tuned', 'FWD'],
              },
            ].map((car, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10, scale: 1.02 }}
                className='bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group'
              >
                <div className='relative h-56 overflow-hidden'>
                  <img
                    src={car.image}
                    alt={car.name}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  <div className='absolute top-4 right-4 bg-[#eb0a1e] text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    {car.category}
                  </div>
                </div>
                <div className='p-6'>
                  <h3 className='text-2xl font-bold mb-2 text-black'>
                    {car.name}
                  </h3>
                  <p className='text-3xl font-bold text-[#eb0a1e] mb-4'>
                    {car.price}
                  </p>
                  <div className='flex flex-wrap gap-2'>
                    {car.features.map((feature, i) => (
                      <span
                        key={i}
                        className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        className='py-20 px-6 bg-white'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        <div className='max-w-6xl mx-auto'>
          <motion.div variants={fadeInUp} className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-black'>
              Why Choose <span className='text-[#eb0a1e]'>Kynetic</span>
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              Experience excellence in every journey with our commitment to
              quality and innovation
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className='grid md:grid-cols-3 gap-8'
          >
            {[
              {
                icon: Car,
                title: 'Premium Quality',
                description:
                  'Every vehicle meets the highest standards of engineering excellence and reliability',
              },
              {
                icon: Zap,
                title: 'Innovative Technology',
                description:
                  'Cutting-edge features and smart systems for a connected driving experience',
              },
              {
                icon: Shield,
                title: 'Safety First',
                description:
                  'Advanced safety systems to protect what matters most on every journey',
              },
              {
                icon: Leaf,
                title: 'Eco-Friendly',
                description:
                  'Sustainable solutions with hybrid and electric options for a greener future',
              },
              {
                icon: Award,
                title: 'Award-Winning',
                description:
                  'Recognized globally for exceptional design, performance, and customer satisfaction',
              },
              {
                icon: Headphones,
                title: 'Customer Support',
                description:
                  '24/7 dedicated support team ready to assist you whenever you need us',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                className='bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100'
              >
                <feature.icon className='w-12 h-12 text-[#eb0a1e] mb-4' />
                <h3 className='text-xl font-bold mb-3 text-black'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section
        className='py-20 px-6 bg-gray-50 relative overflow-hidden'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Background Accent */}
        <motion.div
          aria-hidden='true'
          className='absolute top-20 right-0 h-[20rem] w-[20rem] rounded-full bg-[#eb0a1e]/5 blur-[100px]'
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className='max-w-6xl mx-auto relative z-10'>
          <motion.div variants={fadeInUp} className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-black'>
              What Our <span className='text-[#eb0a1e]'>Customers Say</span>
            </h2>
            <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
              Join thousands of satisfied drivers who trust Kynetic for their
              mobility needs
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className='grid md:grid-cols-3 gap-8'
          >
            {[
              {
                name: 'Sarah Johnson',
                role: 'Business Executive',
                rating: 5,
                review:
                  "The GR Supra exceeded all my expectations! The performance is incredible and the technology is top-notch. Best purchase I've ever made.",
              },
              {
                name: 'Michael Chen',
                role: 'Family Man',
                rating: 5,
                review:
                  "Our RAV4 Hybrid is perfect for our family adventures. Spacious, fuel-efficient, and incredibly safe. Kynetic's customer service is exceptional!",
              },
              {
                name: 'Emma Rodriguez',
                role: 'Tech Entrepreneur',
                rating: 5,
                review:
                  "The connected features and smart technology in my Camry TRD are game-changers. It's like having a personal assistant on wheels!",
              },
              {
                name: 'David Park',
                role: 'Outdoor Enthusiast',
                rating: 5,
                review:
                  'Took my Kynetic on a cross-country road trip and it performed flawlessly. The reliability and comfort made every mile enjoyable.',
              },
              {
                name: 'Lisa Thompson',
                role: 'Environmental Advocate',
                rating: 5,
                review:
                  "Finally a vehicle that aligns with my values! The hybrid technology is impressive and I love knowing I'm reducing my carbon footprint.",
              },
              {
                name: 'James Wilson',
                role: 'Car Enthusiast',
                rating: 5,
                review:
                  "As someone who's owned 20+ cars, I can confidently say Kynetic delivers on every front - performance, design, and innovation.",
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -8, scale: 1.02 }}
                className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300'
              >
                <div className='flex items-center mb-4'>
                  <div className='w-14 h-14 rounded-full bg-gradient-to-br from-[#eb0a1e] to-[#d1091b] flex items-center justify-center mr-4'>
                    <Users className='w-7 h-7 text-white' />
                  </div>
                  <div>
                    <h4 className='font-bold text-black text-lg'>
                      {review.name}
                    </h4>
                    <p className='text-gray-500 text-sm'>{review.role}</p>
                  </div>
                </div>
                <div className='flex mb-4'>
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 fill-[#eb0a1e] text-[#eb0a1e]'
                    />
                  ))}
                </div>
                <p className='text-gray-600 leading-relaxed italic'>
                  "{review.review}"
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Overall Rating Banner */}
          <motion.div
            variants={fadeInUp}
            className='mt-16 bg-gradient-to-r from-[#eb0a1e] to-[#d1091b] text-white p-8 rounded-2xl text-center'
          >
            <div className='text-5xl font-bold mb-2'>4.9/5.0</div>
            <div className='flex justify-center gap-1 mb-3'>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className='w-7 h-7 fill-yellow-300 text-yellow-300'
                />
              ))}
            </div>
            <p className='text-xl'>
              Based on 12,847+ verified customer reviews
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className='py-20 px-6 bg-gradient-to-br from-[#eb0a1e] to-[#d1091b] text-white relative overflow-hidden'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        {/* Animated Background Elements */}
        <motion.div
          className='absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl'
          animate={{ x: [-50, 50, -50], y: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className='absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl'
          animate={{ x: [50, -50, 50], y: [50, -50, 50] }}
          transition={{ duration: 25, repeat: Infinity }}
        />

        <motion.div
          variants={fadeInUp}
          className='max-w-4xl mx-auto text-center relative z-10'
        >
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            Ready to Experience Kynetic?
          </h2>
          <p className='text-xl mb-10 text-white/90 max-w-2xl mx-auto'>
            Join our community of satisfied drivers and discover why thousands
            choose Kynetic for their mobility needs
          </p>
          <div className='flex flex-col sm:flex-row justify-center gap-4'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to='/signup'
                className='inline-block px-10 py-4 bg-white text-[#eb0a1e] font-bold rounded-lg shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all'
              >
                Start Your Journey
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to='/contact'
                className='inline-block px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all'
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className='bg-white text-gray-600 py-12 border-t border-gray-200'>
        <div className='max-w-6xl mx-auto px-6'>
          <div className='grid md:grid-cols-4 gap-8 mb-8'>
            <div>
              <h3 className='text-2xl font-bold text-[#eb0a1e] mb-4'>
                Kynetic
              </h3>
              <p className='text-sm leading-relaxed'>
                Pioneering the future of mobility with innovation, quality, and
                sustainability.
              </p>
            </div>
            <div>
              <h4 className='font-bold text-black mb-3'>Quick Links</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link to='/about' className='hover:text-[#eb0a1e] transition'>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to='/models'
                    className='hover:text-[#eb0a1e] transition'
                  >
                    Our Models
                  </Link>
                </li>
                <li>
                  <Link
                    to='/dealers'
                    className='hover:text-[#eb0a1e] transition'
                  >
                    Find a Dealer
                  </Link>
                </li>
                <li>
                  <Link
                    to='/support'
                    className='hover:text-[#eb0a1e] transition'
                  >
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-bold text-black mb-3'>Resources</h4>
              <ul className='space-y-2 text-sm'>
                <li>
                  <Link
                    to='/financing'
                    className='hover:text-[#eb0a1e] transition'
                  >
                    Financing
                  </Link>
                </li>
                <li>
                  <Link
                    to='/warranty'
                    className='hover:text-[#eb0a1e] transition'
                  >
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link
                    to='/maintenance'
                    className='hover:text-[#eb0a1e] transition'
                  >
                    Maintenance
                  </Link>
                </li>
                <li>
                  <Link to='/faq' className='hover:text-[#eb0a1e] transition'>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-bold text-black mb-3'>Connect</h4>
              <div className='flex gap-4'>
                <motion.button
                  type='button'
                  aria-label='Facebook'
                  whileHover={{ scale: 1.2, y: -2 }}
                  className='hover:text-[#eb0a1e] transition'
                >
                  <Facebook className='w-6 h-6' />
                </motion.button>
                <motion.button
                  type='button'
                  aria-label='Twitter'
                  whileHover={{ scale: 1.2, y: -2 }}
                  className='hover:text-[#eb0a1e] transition'
                >
                  <Twitter className='w-6 h-6' />
                </motion.button>
                <motion.button
                  type='button'
                  aria-label='Instagram'
                  whileHover={{ scale: 1.2, y: -2 }}
                  className='hover:text-[#eb0a1e] transition'
                >
                  <Instagram className='w-6 h-6' />
                </motion.button>
                <motion.button
                  type='button'
                  aria-label='YouTube'
                  whileHover={{ scale: 1.2, y: -2 }}
                  className='hover:text-[#eb0a1e] transition'
                >
                  <Youtube className='w-6 h-6' />
                </motion.button>
              </div>
            </div>
          </div>
          <div className='border-t border-gray-300 pt-6 text-center text-sm'>
            <p>
              © {new Date().getFullYear()} Kynetic - All Rights Reserved. |
              Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
