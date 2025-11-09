import { motion } from 'framer-motion';
import { useState } from 'react';
import FinanceCalculator from './FinanceCalculator';

export default function FinanceSelector({ car, accentColor, onComputed, onContinue }) {
  const [mode, setMode] = useState('finance');
  const [ready, setReady] = useState(false);
  const [lastQuote, setLastQuote] = useState(null);
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
            setReady(false);
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
            // Emit lease quote immediately when switching
            if (lease) {
              const payload = {
                kind: 'lease',
                breakdown: {
                  monthlyPayment: Number(lease?.monthly || 0),
                  principal: Number(car?.msrp || 0),
                  totalInterest: null,
                  totalPaid: null,
                },
              };
              setLastQuote(payload);
              setReady(true);
              if (onComputed) onComputed(payload);
            }
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

      {mode === 'finance' ? (
        <FinanceCalculator
          car={car}
          accentColor={accentColor}
          onComputed={(data) => {
            const payload = { kind: 'finance', ...data };
            setLastQuote(payload);
            setReady(true);
            if (onComputed) onComputed(payload);
          }}
        />
      ) : (
        <motion.div
          key='lease'
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='bg-white/80 border border-gray-200 shadow-sm rounded-xl p-8 max-w-md mx-auto'
        >
          <p className='text-lg text-gray-700 font-medium'>
            Lease Term:{' '}
            <span className='font-semibold'>
              {lease ? lease.termMonths : '-'} months
            </span>
          </p>
          <p className='text-lg text-gray-700 font-medium'>
            Miles/Year: <span className='font-semibold'>{lease?.miles ?? '-'}</span>
          </p>
          <p className='text-2xl mt-4 font-bold text-toyotaRed'>
            {car.currency} {lease ? lease.monthly : '-'}/month
          </p>
        </motion.div>
      )}

      <div className='mt-8'>
        <button
          disabled={!ready}
          onClick={() => onContinue && onContinue(lastQuote)}
          className={`px-6 py-3 rounded-lg font-semibold transition ${
            ready ? 'text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          style={ready ? { backgroundColor: accentColor } : undefined}
        >
          Continue to Summary
        </button>
      </div>

      {/* No Continue button; parent scrolls immediately after selection */}
    </section>
  );
}
