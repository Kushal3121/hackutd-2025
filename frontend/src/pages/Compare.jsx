import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import { getCars, bookTestDrive } from '../services/api';
import { useCompareStore } from '../store/compareStore';
import { useGarageStore } from '../store/garageStore';
import toast from 'react-hot-toast';
import CarSelect from '../components/CarSelect';

export default function Compare() {
  const selected = useCompareStore((s) => s.items);
  const toggle = useCompareStore((s) => s.toggle);
  const clear = useCompareStore((s) => s.clear);
  const [cars, setCars] = useState([]);
  const [sortKey, setSortKey] = useState('price');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [testDate, setTestDate] = useState(null);
  const [testTime, setTestTime] = useState(null);
  const garageItems = useGarageStore((s) => s.items);
  const toggleGarage = useGarageStore((s) => s.toggle);
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      borderColor: '#d1d5db',
      boxShadow: 'none',
    }),
  };
  const pad = (n) => String(n).padStart(2, '0');
  const getDateOptions = (days = 30) => {
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
  };
  const getTimeOptions = () => {
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
  };

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

  const parseNumber = (value) => Number(String(value).replace(/[^\d.-]/g, ''));

  const sortedCars = useMemo(() => {
    const arr = [...selectedCars];
    if (sortKey === 'price')
      arr.sort((a, b) => parseNumber(a.msrp) - parseNumber(b.msrp));
    else if (sortKey === 'efficiency')
      arr.sort(
        (a, b) =>
          b.efficiency.city_mpg +
          b.efficiency.hwy_mpg -
          (a.efficiency.city_mpg + a.efficiency.hwy_mpg)
      );
    else if (sortKey === 'year') arr.sort((a, b) => b.year - a.year);
    else if (sortKey === 'stock')
      arr.sort((a, b) => b.inventory.inStock - a.inventory.inStock);
    return arr;
  }, [selectedCars, sortKey]);

  if (loading) return <p className='p-6 text-center text-gray-600'>Loading…</p>;

  const features = [
    { label: 'Year', key: 'year' },
    { label: 'Trim', key: 'trim' },
    { label: 'Powertrain', key: 'powertrain' },
    { label: 'Drivetrain', key: 'drivetrain' },
    {
      label: 'Base MSRP',
      key: 'msrp',
      format: (v, c) => `${c.currency} ${v.toLocaleString()}`,
    },
    {
      label: 'Price Range',
      key: 'priceRange',
      format: (v, c) =>
        `${c.currency} ${v.min.toLocaleString()} - ${
          c.currency
        } ${v.max.toLocaleString()}`,
    },
    {
      label: 'Efficiency (city/hwy)',
      key: 'efficiency',
      format: (v) => `${v.city_mpg} / ${v.hwy_mpg} MPG`,
    },
    {
      label: 'Estimated Monthly (Finance)',
      key: 'finance',
      format: (v, c) => `${c.currency} ${v.estimatedMonthly.toLocaleString()}`,
    },
    {
      label: 'Lease Offer',
      key: 'lease',
      format: (v, c) => `${c.currency} ${v.monthly}/mo • ${v.termMonths} mo`,
    },
    { label: 'Location', key: 'inventory', format: (v) => v.location },
    { label: 'In Stock', key: 'inventory', format: (v) => v.inStock },
    { label: 'ETA (days)', key: 'inventory', format: (v) => v.deliveryEtaDays },
  ];

  const getHighlight = (feature, car, values) => {
    // Lowest price = green
    if (feature.key === 'msrp') {
      const min = Math.min(...values);
      return car.msrp === min ? 'text-green-600 font-semibold' : '';
    }

    // Highest efficiency = green
    if (feature.key === 'efficiency') {
      const mpg = car.efficiency.city_mpg + car.efficiency.hwy_mpg;
      const max = Math.max(...values);
      return mpg === max ? 'text-green-600 font-semibold' : '';
    }

    // Highest stock = green (best availability)
    if (feature.label === 'In Stock') {
      const max = Math.max(...values);
      return car.inventory.inStock === max
        ? 'text-green-600 font-semibold'
        : '';
    }

    return '';
  };

  return (
    <div className='p-10 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between mb-10 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200'>
        <h2 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
          Compare Cars
        </h2>

        <div className='flex flex-wrap items-center gap-4'>
          {/* CHANGED: Pass ALL cars instead of availableCars */}
          <CarSelect
            cars={cars}
            selectedCars={selectedCars}
            onSelect={(car) => toggle(car)}
            onRemove={(id) => {
              const car = selectedCars.find((c) => c.id === id);
              if (car) toggle(car);
            }}
          />
          <Select
            options={[
              { value: 'price', label: 'Lowest Price' },
              { value: 'efficiency', label: 'Best Efficiency' },
              { value: 'year', label: 'Newest Year' },
              { value: 'stock', label: 'Highest Stock' },
            ]}
            defaultValue={{ value: 'price', label: 'Lowest Price' }}
            onChange={(opt) => setSortKey(opt.value)}
            isSearchable={false}
            menuShouldScrollIntoView={false}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: '0.5rem',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                width: '200px',
              }),
            }}
          />
          <button
            onClick={clear}
            className='px-5 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition-all'
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Table */}
      {sortedCars.length === 0 ? (
        <div className='h-64 flex flex-col items-center justify-center text-gray-500 border border-dashed border-gray-300 rounded-xl bg-white shadow-sm'>
          <p className='text-lg'>
            Select cars to compare their features side by side.
          </p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='overflow-x-auto rounded-2xl shadow-md border border-gray-200 bg-white'
        >
          <table className='min-w-full text-sm text-left'>
            <thead className='bg-gray-100 text-gray-900 border-b border-gray-200'>
              <tr>
                <th className='p-5 font-semibold w-60 text-base text-gray-800'>
                  Feature
                </th>
                {sortedCars.map((car) => (
                  <th key={car.id} className='p-5 text-center relative'>
                    <div className='flex flex-col items-center'>
                      <img
                        src={car.media.hero}
                        alt={car.name}
                        className='w-full max-w-[350px] h-30 object-cover object-center rounded-lg mb-3 shadow-md hover:scale-105 transition-transform duration-300'
                      />
                      <div className='font-semibold text-gray-900 text-base mb-1'>
                        {car.name} {car.trim}
                      </div>
                    </div>
                    <button
                      onClick={() => toggle(car)}
                      className='absolute top-3 right-3 bg-white border border-gray-300 rounded-full w-7 h-7 grid place-items-center text-gray-600 hover:border-[#EB0A1E]'
                      title='Remove'
                    >
                      ×
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {features.map((feature) => {
                const values = sortedCars.map((c) => {
                  const val = c[feature.key];
                  if (feature.label === 'In Stock') return c.inventory.inStock;
                  if (feature.label === 'ETA (days)')
                    return c.inventory.deliveryEtaDays;
                  if (typeof val === 'object' && val !== null)
                    return val.min || val.city_mpg || 0;
                  return val;
                });

                return (
                  <tr key={feature.label} className='odd:bg-gray-50'>
                    <td className='p-4 font-medium text-gray-800 text-base'>
                      {feature.label}
                    </td>
                    {sortedCars.map((car) => (
                      <td
                        key={car.id}
                        className={`p-4 text-center text-sm ${getHighlight(
                          feature,
                          car,
                          values
                        )}`}
                      >
                        {feature.format
                          ? feature.format(car[feature.key], car)
                          : car[feature.key]}
                      </td>
                    ))}
                  </tr>
                );
              })}

              {/* Buttons under each car */}
              <tr className='bg-gray-100 border-t border-gray-200'>
                <td className='p-4 font-medium text-gray-800'>Actions</td>
                {sortedCars.map((car) => (
                  <td key={car.id} className='p-4 text-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <button
                        onClick={() => {
                          setSelectedCar(car);
                          setTestDate(null);
                          setTestTime(null);
                          setShowModal(true);
                        }}
                        className='w-40 px-5 py-2 border border-red-400 bg-[#EB0A1E] text-white font-semibold rounded-md shadow-sm hover:bg-[#c10000] transition-all'
                      >
                        Book Test Drive
                      </button>
                      <button
                        onClick={() => {
                          toggleGarage(car);
                          const inGarage = garageItems.some(
                            (c) => c.id === car.id
                          );
                          toast.success(
                            inGarage
                              ? `${car.name} removed from garage`
                              : `${car.name} saved to garage`
                          );
                        }}
                        className='w-40 px-5 py-2 border border-gray-400 text-gray-800 font-semibold rounded-md hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition-all'
                      >
                        {garageItems.some((c) => c.id === car.id)
                          ? 'Remove from Garage'
                          : 'Save to Garage'}
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      )}
      {showModal && selectedCar && (
        <div className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center'>
          <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
            <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
              <h4 className='text-lg font-semibold'>
                Book Test Drive: {selectedCar.name}
              </h4>
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
                onClick={async () => {
                  try {
                    if (!testDate?.value || !testTime?.value) {
                      toast.error('Please select date and time');
                      return;
                    }
                    const user = JSON.parse(
                      localStorage.getItem('user') || '{}'
                    );
                    const payload = {
                      userId: user?.id || user?.username || 'guest',
                      carId: selectedCar.id,
                      carName: selectedCar.name,
                      color: null,
                      packages: [],
                      totalPrice: selectedCar.msrp,
                      date: testDate.value,
                      time: testTime.value,
                    };
                    const res = await bookTestDrive(payload);
                    if (res?.id) {
                      toast.success(
                        `Booked test drive for ${selectedCar.name}`
                      );
                      setShowModal(false);
                    } else {
                      toast.error(res?.error || 'Booking failed');
                    }
                  } catch {
                    toast.error('Server not reachable');
                  }
                }}
                className='px-4 py-2 rounded-md bg-[#EB0A1E] text-white font-semibold'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
