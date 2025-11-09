import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FinanceSelector({ car, accentColor, onComplete }) {
  const [mode, setMode] = useState('finance');
  const finance = car?.finance;
  const lease = car?.lease;
  const active = mode === 'finance' ? finance : lease;

  return (
    <section className='max-w-5xl mx-auto px-6 pb-24 text-center'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-3xl font-semibold mb-6 text-toyotaGray'
      >
        Choose Your Plan
      </motion.h2>

      <div className='flex justify-center gap-6 mb-10'>
        <button
          onClick={() => {
            setMode('finance');
            if (onComplete) onComplete();
          }}
          className={`px-5 py-2 rounded-full font-semibold border ${
            mode === 'finance'
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'border-gray-300 text-gray-600'
          }`}
          style={{ '--accent': accentColor }}
        >
          Finance
        </button>
        <button
          onClick={() => {
            setMode('lease');
            if (onComplete) onComplete();
          }}
          className={`px-5 py-2 rounded-full font-semibold border ${
            mode === 'lease'
              ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
              : 'border-gray-300 text-gray-600'
          }`}
          style={{ '--accent': accentColor }}
        >
          Lease
        </button>
      </div>

      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='bg-white/80 border border-gray-200 shadow-sm rounded-xl p-8 max-w-md mx-auto'
      >
        {mode === 'finance' ? (
          <>
            <p className='text-lg text-gray-700 font-medium'>
              APR:{' '}
              <span className='font-semibold'>
                {finance ? finance.apr : '-'}%
              </span>
            </p>
            <p className='text-lg text-gray-700 font-medium'>
              Term:{' '}
              <span className='font-semibold'>
                {Array.isArray(finance?.termMonths)
                  ? finance.termMonths.join(', ')
                  : finance?.term ?? '-'}{' '}
                {Array.isArray(finance?.termMonths) ? 'months' : ''}
              </span>
            </p>
            <p className='text-2xl mt-4 font-bold text-toyotaRed'>
              {car.currency} {finance ? finance.estimatedMonthly : '-'}/month
            </p>
          </>
        ) : (
          <>
            <p className='text-lg text-gray-700 font-medium'>
              Lease Term:{' '}
              <span className='font-semibold'>
                {lease ? lease.termMonths : '-'} months
              </span>
            </p>
            <p className='text-lg text-gray-700 font-medium'>
              Miles/Year: <span className='font-semibold'>{lease.miles}</span>
            </p>
            <p className='text-2xl mt-4 font-bold text-toyotaRed'>
              {car.currency} {lease ? lease.monthly : '-'}/month
            </p>
          </>
        )}
      </motion.div>

      {/* No Continue button; parent scrolls immediately after selection */}
    </section>
  );
}
