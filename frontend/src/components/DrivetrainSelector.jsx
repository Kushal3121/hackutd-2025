import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function DrivetrainSelector({ car, accentColor, onSelect }) {
  const [selected, setSelected] = useState(null);
  const options = useMemo(() => {
    const list = Array.from(
      new Set([car?.powertrain, car?.drivetrain].filter(Boolean))
    );
    return list.map((v) => ({ label: v, value: v }));
  }, [car?.powertrain, car?.drivetrain]);

  // Auto-advance if there are no options or a single implicit option
  useEffect(() => {
    if (options.length === 0 && onSelect) {
      // Advance on next tick to avoid state updates during render
      const id = requestAnimationFrame(() => onSelect());
      return () => cancelAnimationFrame(id);
    }
    if (options.length === 1 && onSelect && selected == null) {
      // Set local selection and advance
      setSelected(options[0].value);
      const id = requestAnimationFrame(() => onSelect());
      return () => cancelAnimationFrame(id);
    }
  }, [options, onSelect, selected]);

  return (
    <section className='max-w-5xl mx-auto px-6 pb-20 text-center'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-3xl font-semibold mb-8 text-toyotaGray'
      >
        Choose Powertrain & Drivetrain
      </motion.h2>

      <div className='flex flex-wrap justify-center gap-6'>
        {options.map((opt) => (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelected(opt.value);
              if (onSelect) onSelect();
            }}
            className={`px-6 py-3 rounded-lg border-2 text-lg font-medium transition 
              ${
                selected === opt.value
                  ? 'bg-[var(--accent)] text-white'
                  : 'border-gray-300 hover:border-[var(--accent)]'
              }`}
            style={{ '--accent': accentColor }}
          >
            {opt.label}
          </motion.button>
        ))}
        {options.length === 0 && (
          <p className='text-gray-500'>No drivetrain options available.</p>
        )}
      </div>
    </section>
  );
}
