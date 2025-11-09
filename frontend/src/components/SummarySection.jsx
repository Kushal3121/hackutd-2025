import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { bookTestDrive } from '../services/api';

export default function SummarySection({
  car,
  accentColor,
  selectedColor,
  selectedPackages = [],
}) {
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const packagesTotal = selectedPackages.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );
  const colorExtra = selectedColor?.extraCost || 0;
  const totalPrice = (car?.msrp || 0) + colorExtra + packagesTotal;

  const handleBook = async () => {
    if (isBooking || booked) return;
    try {
      setIsBooking(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        userId: user?.id || user?.username || 'guest',
        carId: car.id,
        carName: car.name,
        color: selectedColor?.name || null,
        packages: selectedPackages.map((p) => p.name),
        totalPrice,
      };
      const res = await bookTestDrive(payload);
      if (res?.id) {
        setBooked(true);
        toast.success('Test drive booked!');
      } else {
        toast.error(res?.error || 'Booking failed');
      }
    } catch {
      toast.error('Server not reachable');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <section className='max-w-4xl mx-auto text-center py-24'>
      <Toaster position='top-right' reverseOrder={false} />
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-4xl font-bold mb-12 text-gray-900 tracking-tight'
      >
        Your Build Summary
      </motion.h2>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-2xl px-10 py-8 border border-gray-100 text-left space-y-5'
        style={{ '--accent': accentColor }}
      >
        <div className='space-y-3 text-lg text-gray-700 leading-relaxed'>
          <p>
            <strong className='text-gray-900'>Model:</strong> {car.name}{' '}
            {car.trim} ({car.year})
          </p>
          <p>
            <strong className='text-gray-900'>Color:</strong>{' '}
            {selectedColor?.name}{' '}
            {colorExtra > 0
              ? `(+${car.currency} ${colorExtra.toLocaleString()})`
              : ''}
          </p>
          <p>
            <strong className='text-gray-900'>Packages:</strong>{' '}
            {selectedPackages.length > 0
              ? selectedPackages
                  .map(
                    (p) =>
                      `${p.name} (+${car.currency} ${p.price.toLocaleString()})`
                  )
                  .join(', ')
              : 'None'}
          </p>
        </div>

        {/* Split Grid */}
        <div className='grid sm:grid-cols-2 gap-x-10 gap-y-3 pt-5 border-t border-gray-200 text-base text-gray-700'>
          <p>
            <strong className='text-gray-900'>Powertrain:</strong>{' '}
            {car.powertrain}
          </p>
          <p>
            <strong className='text-gray-900'>Drivetrain:</strong>{' '}
            {car.drivetrain}
          </p>
          <p>
            <strong className='text-gray-900'>Base MSRP:</strong> {car.currency}{' '}
            {car.msrp.toLocaleString()}
          </p>
          <p>
            <strong className='text-gray-900'>Efficiency:</strong>{' '}
            {car.efficiency?.city_mpg} city / {car.efficiency?.hwy_mpg} hwy MPG
          </p>
          <p className='sm:col-span-2'>
            <strong className='text-gray-900'>Inventory:</strong>{' '}
            {car.inventory?.location} • In stock: {car.inventory?.inStock} •
            ETA: {car.inventory?.deliveryEtaDays} days
          </p>
        </div>

        {/* Total */}
        <div className='flex justify-between items-center border-t border-gray-200 pt-6 mt-4'>
          <p className='text-xl font-semibold text-gray-700'>Total Price</p>
          <p
            className='text-3xl font-extrabold tracking-tight'
            style={{ color: accentColor }}
          >
            {car.currency} {totalPrice.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.button
        whileHover={{
          scale: 1.04,
          boxShadow: `0 6px 15px ${accentColor}40`,
        }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.3 }}
        className='mt-12 px-10 py-4 text-lg rounded-lg font-semibold text-white shadow-md transition-all disabled:opacity-60'
        style={{ backgroundColor: accentColor }}
        disabled={isBooking || booked}
        onClick={handleBook}
      >
        {isBooking
          ? 'Booking…'
          : booked
          ? 'Test Drive Booked'
          : 'Book a Test Drive'}
      </motion.button>
    </section>
  );
}
