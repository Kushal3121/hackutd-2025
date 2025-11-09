import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCompareStore } from '../store/compareStore';
import { getCars, bookTestDrive } from '../services/api';
import toast from 'react-hot-toast';

function CompareColumn({ car }) {
  const [booking, setBooking] = useState(false);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const handleBook = async () => {
    try {
      setBooking(true);
      const payload = {
        userId: user?.id || user?.username || 'guest',
        carId: car.id,
        carName: car.name,
        color: null,
        packages: [],
        totalPrice: car.msrp,
      };
      const res = await bookTestDrive(payload);
      if (res?.id) toast.success('Test drive booked!');
      else toast.error(res?.error || 'Booking failed');
    } catch {
      toast.error('Server not reachable');
    } finally {
      setBooking(false);
    }
  };

  const handleAddToCart = () => toast.success('Added to cart');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col'
    >
      {/* Hero Image */}
      <div className='relative group'>
        <img
          src={car.media?.hero}
          alt={car.name}
          className='w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute top-3 left-3 bg-toyotaRed text-white text-xs font-semibold px-3 py-1 rounded-full shadow'>
          {car.year}
        </div>
      </div>

      {/* Info Section */}
      <div className='p-5 flex-1 flex flex-col justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            {car.name} {car.trim}
          </h3>
          <p className='text-sm text-gray-500 mb-3'>
            {car.series} • {car.powertrain} • {car.drivetrain}
          </p>

          <div className='text-sm text-gray-700 space-y-2'>
            <div>
              <span className='font-semibold text-gray-900'>MSRP:</span>{' '}
              {car.currency} {car.msrp.toLocaleString()}
            </div>
            <div>
              <span className='font-semibold text-gray-900'>Price Range:</span>{' '}
              {car.currency} {car.priceRange.min.toLocaleString()} -{' '}
              {car.currency} {car.priceRange.max.toLocaleString()}
            </div>
            <div>
              <span className='font-semibold text-gray-900'>Efficiency:</span>{' '}
              {car.efficiency.city_mpg} city / {car.efficiency.hwy_mpg} hwy MPG
            </div>
            <div>
              <span className='font-semibold text-gray-900'>Inventory:</span>{' '}
              {car.inventory.location} • In stock: {car.inventory.inStock} •
              ETA: {car.inventory.deliveryEtaDays} days
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className='flex gap-3 pt-5'>
          <button
            onClick={handleBook}
            disabled={booking}
            className='flex-1 px-4 py-2 rounded-lg font-semibold text-white bg-toyotaRed hover:bg-red-700 shadow-sm transition-all disabled:opacity-60'
          >
            {booking ? 'Booking…' : 'Book Test Drive'}
          </button>
          <button
            onClick={handleAddToCart}
            className='flex-1 px-4 py-2 rounded-lg font-semibold border border-gray-300 text-gray-800 hover:border-toyotaRed hover:text-toyotaRed transition'
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Compare() {
  const selected = useCompareStore((s) => s.items);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCars();
        setCars(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedCars = useMemo(() => {
    const map = new Map(cars.map((c) => [c.id, c]));
    return selected.map((s) => map.get(s.id)).filter(Boolean);
  }, [cars, selected]);

  const availableCars = useMemo(() => {
    const selectedIds = new Set(selected.map((s) => s.id));
    return cars.filter((c) => !selectedIds.has(c.id));
  }, [cars, selected]);

  const colsClass =
    selectedCars.length === 3
      ? 'grid-cols-1 md:grid-cols-3'
      : selectedCars.length === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1';

  if (loading) return <p className='p-6'>Loading…</p>;

  return (
    <div className='p-6'>
      {/* Header Section */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='text-3xl font-bold text-gray-900'>Compare Cars</h2>
        <div className='flex items-center gap-3'>
          <select
            className='border border-gray-300 rounded-md px-3 py-2 text-sm'
            onChange={(e) => {
              const car = cars.find((c) => c.id === e.target.value);
              if (car) toggle(car);
              e.target.value = '';
            }}
            defaultValue=''
          >
            <option value='' disabled>
              {selectedCars.length >= 3
                ? 'Max 3 cars selected'
                : 'Add car to compare…'}
            </option>
            {availableCars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.trim} ({c.year})
              </option>
            ))}
          </select>
          <button
            onClick={clear}
            className='px-3 py-2 rounded-md border border-gray-300 text-sm font-semibold hover:border-toyotaRed transition'
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Compare Grid */}
      {selectedCars.length === 0 ? (
        <div className='h-64 flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-xl bg-gray-50'>
          <p className='text-lg'>
            Select cars to compare their features side by side.
          </p>
        </div>
      ) : (
        <div className={`grid gap-8 ${colsClass}`}>
          {selectedCars.map((car) => (
            <div key={car.id} className='relative'>
              <CompareColumn car={car} />
              <button
                onClick={() => toggle(car)}
                className='absolute top-3 right-3 bg-white border border-gray-300 rounded-full w-8 h-8 grid place-items-center text-gray-600 hover:border-toyotaRed transition'
                title='Remove'
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
