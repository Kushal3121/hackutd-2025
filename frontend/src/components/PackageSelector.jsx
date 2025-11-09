import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export default function PackageSelector({
  car,
  accentColor,
  onComplete,
  onPackagesChange,
}) {
  const [selectedPackages, setSelectedPackages] = useState([]);
  const totalExtra = selectedPackages.reduce((sum, p) => sum + p.price, 0);
  const sectionRef = useRef(null);

  const handleToggle = (pkg) => {
    setSelectedPackages((prev) => {
      const alreadySelected = prev.find((p) => p.name === pkg.name);
      const next = alreadySelected
        ? prev.filter((p) => p.name !== pkg.name)
        : [...prev, pkg];

      if (onPackagesChange) onPackagesChange(next);

      // Trigger completion when first selection is made
      if (!alreadySelected && prev.length === 0 && onComplete) {
        onComplete();
      }

      return next;
    });
  };

  return (
    <section ref={sectionRef} className='max-w-5xl mx-auto px-6 pb-20'>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-3xl font-semibold mb-6 text-toyotaGray text-center'
      >
        Optional Packages
      </motion.h2>

      <p className='text-center text-gray-600 mb-10'>
        Enhance your {car.name} with premium add-ons. Select what suits your
        needs best.
      </p>

      {/* Package Cards */}
      <div className='grid gap-6'>
        {(car.packages || []).map((pkg, i) => {
          const isSelected = selectedPackages.some((p) => p.name === pkg.name);
          return (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleToggle(pkg)}
              className={`cursor-pointer border rounded-xl p-5 shadow-sm transition-all duration-300
                ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-md'
                    : 'border-gray-200 hover:border-[var(--accent)]'
                }`}
              style={{ '--accent': accentColor }}
            >
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg font-semibold text-toyotaGray'>
                    {pkg.name}
                  </h3>
                  <p className='text-sm text-gray-500'>{pkg.description}</p>
                </div>

                <div className='text-right'>
                  <p className='text-sm font-semibold text-toyotaRed'>
                    +{car.currency} {pkg.price.toLocaleString()}
                  </p>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className='text-green-600 font-medium flex justify-end mt-1'
                      >
                        <Check size={18} className='mr-1' /> Added
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
        {car.packages && car.packages.length === 0 && (
          <p className='text-center text-gray-500'>No packages available for this model.</p>
        )}
      </div>

      {/* Total + Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='mt-10 text-center'
      >
        <p className='text-lg text-gray-700 font-medium'>
          Total Add-ons:{' '}
          <span className='font-bold'>
            {car.currency} {totalExtra.toLocaleString()}
          </span>
        </p>
        <p className='text-gray-500 text-sm mt-1'>
          Base MSRP: {car.currency} {car.msrp.toLocaleString()}
        </p>

        {/* No explicit continue; parent handles scroll on first selection */}
      </motion.div>
    </section>
  );
}
