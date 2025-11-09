import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { bookTestDrive } from '../services/api';
import Select from 'react-select';
import { useGarageStore } from '../store/garageStore';

export default function SummarySection({
  car,
  accentColor,
  selectedColor,
  selectedPackages = [],
}) {
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [testDate, setTestDate] = useState(null);
  const [testTime, setTestTime] = useState(null);
  const garageItems = useGarageStore((s) => s.items);
  const toggleGarage = useGarageStore((s) => s.toggle);
  const inGarage = garageItems.some((c) => c.id === car.id);
  const packagesTotal = selectedPackages.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );
  const colorExtra = selectedColor?.extraCost || 0;
  const totalPrice = (car?.msrp || 0) + colorExtra + packagesTotal;

  const submitBooking = async () => {
    if (isBooking || booked) return;
    if (!testDate?.value || !testTime?.value) {
      toast.error('Please select date and time');
      return;
    }
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
        date: testDate.value,
        time: testTime.value,
      };
      const res = await bookTestDrive(payload);
      if (res?.id) {
        setBooked(true);
        toast.success('Test drive booked!');
        setShowModal(false);
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

      {/* CTA Row */}
      <div className='mt-12 flex items-center justify-center gap-4'>
        <motion.button
          whileHover={{
            scale: 1.04,
            boxShadow: `0 6px 15px ${accentColor}40`,
          }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.3 }}
          className='px-10 py-4 text-lg rounded-lg font-semibold text-white shadow-md transition-all'
          style={{ backgroundColor: accentColor }}
          onClick={() => {
            toggleGarage(car);
            toast.success(inGarage ? 'Removed from Garage' : 'Saved to Garage');
          }}
        >
          {inGarage ? 'Remove from Garage' : 'Save to Garage'}
        </motion.button>

        <button
          className='px-6 py-3 rounded-lg font-semibold border border-gray-300 hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition disabled:opacity-60'
          disabled={isBooking || booked}
          onClick={() => setShowModal(true)}
        >
          Book a Test Drive
        </button>
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>Select date & time</h4>
              <button
                onClick={() => setShowModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ×
              </button>
            </div>
            <div className='p-4 space-y-4'>
              <div className='grid grid-cols-3 items-center gap-3'>
                <label className='text-sm text-gray-600'>Date</label>
                <div className='col-span-2'>
                  <Select
                    options={getDateOptions(30)}
                    value={testDate}
                    onChange={(opt) => setTestDate(opt)}
                    isSearchable={false}
                    styles={selectStyles}
                    placeholder='Select date'
                  />
                </div>
              </div>
              <div className='grid grid-cols-3 items-center gap-3'>
                <label className='text-sm text-gray-600'>Time</label>
                <div className='col-span-2'>
                  <Select
                    options={getTimeOptions()}
                    value={testTime}
                    onChange={(opt) => setTestTime(opt)}
                    isSearchable={false}
                    styles={selectStyles}
                    placeholder='Select time'
                  />
                </div>
              </div>
            </div>
            <div className='p-4 border-t border-gray-200 flex items-center justify-end gap-2'>
              <button
                onClick={() => setShowModal(false)}
                className='px-4 py-2 rounded-md border border-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={submitBooking}
                className='px-4 py-2 rounded-md bg-[#EB0A1E] text-white font-semibold'
                disabled={isBooking}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// --- helpers for react-select date/time ---
const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: '0.5rem',
    borderColor: '#d1d5db',
    boxShadow: 'none',
  }),
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function getDateOptions(days = 30) {
  const out = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    out.push({
      value: `${yyyy}-${mm}-${dd}`,
      label: d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    });
  }
  return out;
}

function getTimeOptions() {
  const out = [];
  const startHour = 9;
  const endHour = 18;
  for (let h = startHour; h <= endHour; h++) {
    for (const m of [0, 30]) {
      const a = new Date();
      a.setHours(h, m, 0, 0);
      out.push({
        value: `${pad(h)}:${pad(m)}`,
        label: a.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }
  }
  return out;
}
