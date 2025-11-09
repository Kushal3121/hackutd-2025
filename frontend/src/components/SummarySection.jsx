import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { bookTestDrive } from '../services/api';
import Select from 'react-select';
import AppointmentModal from './AppointmentModal';
import { useGarageStore } from '../store/garageStore';

export default function SummarySection({
  car,
  accentColor,
  selectedColor,
  selectedPackages = [],
  quote = null,
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
    <section className='max-w-4xl mx-auto text-center py-12'>
      <Toaster position='top-right' reverseOrder={false} />
      {/* Header */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-4xl font-bold mb-12 tracking-tight'
        style={{ color: accentColor }}
      >
        Your Build Summary
      </motion.h2>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white shadow-[0_4px_25px_rgba(0,0,0,0.05)] rounded-2xl px-8 py-8 border border-gray-100 text-left'
        style={{ '--accent': accentColor }}
      >
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left: Build details */}
          <div className='space-y-6'>
            <div>
              <div className='text-sm text-gray-500 mb-1'>Model</div>
              <div className='text-lg font-semibold text-gray-900'>
                {car.name} {car.trim} ({car.year})
              </div>
            </div>
            <div className='grid grid-cols-2 gap-x-8 gap-y-3 text-[15px] text-gray-700'>
              <div className='text-gray-500'>Powertrain</div>
              <div className='font-medium'>{car.powertrain}</div>
              <div className='text-gray-500'>Drivetrain</div>
              <div className='font-medium'>{car.drivetrain}</div>
              <div className='text-gray-500'>Efficiency</div>
              <div className='font-medium'>
                {car.efficiency?.city_mpg} city / {car.efficiency?.hwy_mpg} hwy
              </div>
              <div className='text-gray-500'>Location</div>
              <div className='font-medium'>{car.inventory?.location}</div>
              <div className='text-gray-500'>In Stock</div>
              <div className='font-medium'>{car.inventory?.inStock}</div>
              <div className='text-gray-500'>ETA</div>
              <div className='font-medium'>
                {car.inventory?.deliveryEtaDays} days
              </div>
            </div>
          </div>

          {/* Right: Pricing breakdown */}
          <div className='rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-sm'>
            <div
              className='text-lg font-semibold mb-5'
              style={{ color: accentColor }}
            >
              Pricing Summary
            </div>
            <ul className='space-y-3 text-[15px]'>
              <BreakdownRow
                label='Base MSRP'
                value={formatCurrency(car.currency, car.msrp)}
              />
              <BreakdownRow
                label={`Color${
                  selectedColor?.name ? ` • ${selectedColor.name}` : ''
                }`}
                value={
                  colorExtra > 0
                    ? `+ ${formatCurrency(car.currency, colorExtra)}`
                    : formatCurrency(car.currency, 0)
                }
              />
              <BreakdownRow
                label={`Packages${
                  selectedPackages.length
                    ? ` • ${selectedPackages.map((p) => p.name).join(', ')}`
                    : ''
                }`}
                value={formatCurrency(car.currency, packagesTotal)}
              />
              <div className='h-2' />
              <BreakdownRow
                label='Subtotal'
                value={formatCurrency(car.currency, totalPrice)}
                strong
              />
              {!quote && (
                <BreakdownRow
                  label={`Estimated Tax (${(getTaxRate(car) * 100).toFixed(
                    1
                  )}%)`}
                  value={formatCurrency(
                    car.currency,
                    Math.round(totalPrice * getTaxRate(car))
                  )}
                />
              )}
              <div className='border-t border-gray-200 my-3' />
              {quote?.kind === 'finance' ? (
                <>
                  <BreakdownRow
                    label='Financed Principal'
                    value={formatCurrency(
                      car.currency,
                      quote.breakdown?.principal
                    )}
                  />
                  <BreakdownRow
                    label='Estimated Monthly'
                    value={formatCurrency(
                      car.currency,
                      quote.breakdown?.monthlyPayment
                    )}
                    xlarge
                    accent={accentColor}
                  />
                  <BreakdownRow
                    label='Total Interest'
                    value={formatCurrency(
                      car.currency,
                      quote.breakdown?.totalInterest
                    )}
                  />
                  <BreakdownRow
                    label='Total Paid'
                    value={formatCurrency(
                      car.currency,
                      quote.breakdown?.totalPaid
                    )}
                    strong
                  />
                </>
              ) : quote?.kind === 'lease' ? (
                <>
                  <BreakdownRow
                    label='Lease Monthly'
                    value={formatCurrency(
                      car.currency,
                      quote.breakdown?.monthlyPayment
                    )}
                    xlarge
                    accent={accentColor}
                  />
                  <BreakdownRow
                    label='Financed Principal'
                    value={formatCurrency(
                      car.currency,
                      quote.breakdown?.principal ?? totalPrice
                    )}
                  />
                </>
              ) : (
                <BreakdownRow
                  label='Estimated Total'
                  value={formatCurrency(
                    car.currency,
                    Math.round(totalPrice * (1 + getTaxRate(car)))
                  )}
                  xlarge
                  accent={accentColor}
                />
              )}
            </ul>
            <div className='mt-4 text-xs text-gray-500'>
              Taxes estimated based on region. Final pricing may vary by dealer.
            </div>
          </div>
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
          className='px-6 py-3 text-lg rounded-lg font-semibold text-white shadow-md transition-all'
          style={{ backgroundColor: accentColor }}
          onClick={() => {
            toggleGarage(car);
            toast.success(inGarage ? 'Removed from Garage' : 'Saved to Garage');
          }}
        >
          {inGarage ? 'Remove from Garage' : 'Save to Garage'}
        </motion.button>

        <button
          className='px-6 py-3 rounded-lg font-semibold border border-gray-300 transition disabled:opacity-60'
          style={{ borderColor: accentColor, color: accentColor }}
          disabled={isBooking || booked}
          onClick={() => setShowModal(true)}
        >
          Book a Test Drive
        </button>
      </div>

      <AppointmentModal
        title='Edit appointment'
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={submitBooking}
        isSubmitting={isBooking}
        dateOptions={getDateOptions(30)}
        timeOptions={getTimeOptions()}
        selectStyles={selectStyles}
        dateValue={testDate}
        timeValue={testTime}
        onDateChange={(opt) => setTestDate(opt)}
        onTimeChange={(opt) => setTestTime(opt)}
        submitLabel='Save'
        cancelLabel='Cancel'
      />
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

// --- pricing helpers & presenter ---
function getTaxRate(car) {
  // Basic heuristic by currency/region
  const cur = String(car?.currency || '').toUpperCase();
  const location = String(car?.inventory?.location || '').toLowerCase();
  if (cur.includes('CAD') || location.includes('canada')) return 0.13; // HST approx
  if (
    cur.includes('EUR') ||
    location.includes('germany') ||
    location.includes('france') ||
    location.includes('italy')
  )
    return 0.2; // EU VAT approx
  return 0.0825; // default ~8.25% (typical US sales tax)
}

function formatCurrency(currency, amount) {
  return `${currency} ${Number(amount || 0).toLocaleString()}`;
}

function BreakdownRow({ label, value, strong, xlarge, accent }) {
  return (
    <li className='flex items-center justify-between'>
      <span className={`text-gray-700 ${strong ? 'font-semibold' : ''}`}>
        {label}
      </span>
      <span
        className={`text-right ${
          xlarge
            ? 'text-2xl font-extrabold'
            : strong
            ? 'font-semibold'
            : 'text-gray-900'
        }`}
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </span>
    </li>
  );
}
