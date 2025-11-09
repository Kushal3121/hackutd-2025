import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { getCars } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import PackageSelector from '../components/PackageSelector';
import FinanceSelector from '../components/FinanceSelector';
import DrivetrainSelector from '../components/DrivetrainSelector';
import SummarySection from '../components/SummarySection';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [accentColor, setAccentColor] = useState('#EB0A1E');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedPackages, setSelectedPackages] = useState([]);

  const refs = {
    package: useRef(null),
    drivetrain: useRef(null),
    finance: useRef(null),
    summary: useRef(null),
  };

  useEffect(() => {
    getCars().then((all) => {
      const found = all.find((c) => c.id === id);
      setCar(found);
      setLoading(false);
    });
  }, [id]);

  const colorMap = {
    '089': '#ffffff',
    218: '#111111',
    '3U5': '#B20000',
    '8X8': '#1F3A93',
    '1J9': '#A9A9A9',
    '089W': '#F5F5F5',
  };

  // ✅ Fixed: correctly scrolls to the next section
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const shade = colorMap[color.code] || '#EB0A1E';
    setAccentColor(shade);

    setTimeout(() => {
      requestAnimationFrame(() => {
        refs.package.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }, 700);
  };

  if (loading || !car)
    return (
      <p className='text-center mt-10 text-gray-500'>Loading car details...</p>
    );

  return (
    <div
      className='min-h-screen transition-all duration-1000'
      style={{
        background: selectedColor
          ? `linear-gradient(to bottom, ${accentColor}25 0%, #ffffff 60%, ${accentColor}10 100%)`
          : '#fff',
      }}
    >
      {/* --- Back --- */}
      <div className='max-w-6xl mx-auto px-6 py-4'>
        <button
          onClick={() => navigate('/dashboard')}
          className='flex items-center text-toyotaRed hover:text-toyotaRed-dark transition'
        >
          <ArrowLeft size={18} className='mr-1' /> Back to Models
        </button>
      </div>

      {/* --- Hero --- */}
      <section className='relative max-w-6xl mx-auto px-6 mb-12'>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className='relative'
        >
          <div className='relative rounded-2xl overflow-hidden shadow-lg'>
            <img
              src={car.media?.hero}
              alt={car.name}
              className='w-full h-80 object-cover'
            />
            <div
              className='absolute inset-0 rounded-2xl'
              style={{
                background: `linear-gradient(to top, ${accentColor}20 0%, transparent 60%)`,
              }}
            ></div>
          </div>

          <h1 className='absolute bottom-6 left-8 text-white text-4xl font-extrabold drop-shadow-lg'>
            {car.name}
          </h1>
          <p className='absolute bottom-2 left-8 text-white/90 text-sm drop-shadow'>
            {car.trim} • {car.year}
          </p>
        </motion.div>
      </section>

      {/* --- Step 1: Color Selection --- */}
      <section className='max-w-5xl mx-auto px-6 mb-20'>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='text-3xl font-semibold mb-10 text-toyotaGray text-center'
        >
          Choose Your Color
        </motion.h2>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center'>
          {car.colors.map((color, index) => {
            const isSelected = selectedColor?.code === color.code;
            const bg = colorMap[color.code] || '#ddd';
            return (
              <motion.button
                key={color.code}
                onClick={() => handleColorSelect(color)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full max-w-[200px] h-28 flex flex-col justify-center items-center gap-2 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_10px_var(--accent)]'
                    : 'border-gray-300 hover:border-[var(--accent)]'
                }`}
                style={{ '--accent': accentColor }}
              >
                <div
                  className='w-8 h-8 rounded-full border border-gray-300'
                  style={{
                    backgroundColor: bg,
                    boxShadow: isSelected
                      ? `0 0 0 3px ${accentColor}60`
                      : '0 0 0 1px rgba(0,0,0,0.1)',
                  }}
                ></div>
                <div className='flex flex-col items-center'>
                  <span className='text-sm font-medium text-toyotaGray text-center'>
                    {color.name}
                  </span>
                  {color.extraCost > 0 && (
                    <span className='text-xs text-toyotaRed font-semibold'>
                      +{car.currency} {color.extraCost}
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedColor && (
            <motion.div
              key={selectedColor.code}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className='mt-16 text-center space-y-3'
            >
              <h3 className='text-xl font-semibold text-black'>
                {selectedColor.name}
              </h3>
              <p className='text-gray-600 text-sm'>
                Great choice! Let’s explore available packages next.
              </p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className='text-gray-500 mt-3 flex justify-center'
              >
                <ChevronDown />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- Step 2: Packages --- */}
      {selectedColor && (
        <div ref={refs.package}>
          <PackageSelector
            car={car}
            accentColor={accentColor}
            visible={step >= 1}
            onPackagesChange={(list) => setSelectedPackages(list)}
            onComplete={() => {
              setStep(2);
              setTimeout(() => {
                requestAnimationFrame(() => {
                  refs.drivetrain.current?.scrollIntoView({
                    behavior: 'smooth',
                  });
                });
              }, 700);
            }}
          />
        </div>
      )}

      {/* --- Step 3: Drivetrain --- */}
      {step >= 2 && (
        <div ref={refs.drivetrain}>
          <DrivetrainSelector
            car={car}
            accentColor={accentColor}
            visible={step >= 2}
            onSelect={() => {
              setStep(3);
              setTimeout(() => {
                requestAnimationFrame(() => {
                  refs.finance.current?.scrollIntoView({ behavior: 'smooth' });
                });
              }, 700);
            }}
          />
        </div>
      )}

      {/* --- Step 4: Finance --- */}
      {step >= 3 && (
        <div ref={refs.finance}>
          <FinanceSelector
            car={car}
            accentColor={accentColor}
            visible={step >= 3}
            onComplete={() => {
              setStep(4);
              setTimeout(() => {
                requestAnimationFrame(() => {
                  refs.summary.current?.scrollIntoView({ behavior: 'smooth' });
                });
              }, 700);
            }}
          />
        </div>
      )}

      {/* --- Step 5: Summary --- */}
      {step >= 4 && (
        <div ref={refs.summary}>
          <SummarySection
            car={car}
            accentColor={accentColor}
            selectedColor={selectedColor}
            selectedPackages={selectedPackages}
          />
        </div>
      )}
    </div>
  );
}
