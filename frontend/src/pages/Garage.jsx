import { useMemo, useState } from 'react';
import { useGarageStore } from '../store/garageStore';
import { bookTestDrive } from '../services/api';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Garage() {
  const items = useGarageStore((s) => s.items);
  const remove = useGarageStore((s) => s.remove);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [testDate, setTestDate] = useState(null);
  const [testTime, setTestTime] = useState(null);
  const navigate = useNavigate();

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

  const fallbackImage = (car) => {
    if (car?.media?.hero) return car.media.hero;
    const code = (car?.modelCode || '').toLowerCase();
    return code ? `/images/${code}.jpg` : '/images/vite.svg';
    // vite.svg as harmless placeholder
  };

  if (items.length === 0) {
    return (
      <div className='p-6'>
        <h2 className='text-2xl font-bold text-gray-900 mb-4'>My Garage</h2>
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-gray-600'>
          No saved cars yet. Save cars from Compare or Car Details to see them
          here.
        </div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold text-gray-900 mb-4'>My Garage</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
        {items.map((car) => (
          <div
            key={car.id}
            className='group relative overflow-hidden rounded-2xl bg-white shadow-md border border-gray-200'
          >
            <div className='relative'>
              <img
                src={fallbackImage(car)}
                alt={car.name}
                className='w-full h-44 object-cover'
              />
            </div>
            <div className='p-4 space-y-2'>
              <div className='flex items-start justify-between gap-2'>
                <div>
                  <div className='font-bold text-gray-900'>{car.name}</div>
                  <div className='text-sm text-gray-500'>{car.trim}</div>
                </div>
                <button
                  title='Remove'
                  onClick={() => remove(car.id)}
                  className='p-2 rounded-md border border-gray-300 text-gray-700 hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className='text-toyotaRed font-semibold text-base'>
                {car.currency} {Number(car.msrp || 0).toLocaleString()}
              </div>
              <div className='flex items-center gap-2 pt-2'>
                <button
                  onClick={() => {
                    setSelectedCar(car);
                    setTestDate(null);
                    setTestTime(null);
                    setShowModal(true);
                  }}
                  className='flex-1 px-3 py-2 rounded-md bg-[#EB0A1E] text-white font-semibold hover:bg-red-600 transition'
                >
                  Book Test Drive
                </button>
                <button
                  onClick={() => navigate('/dashboard/lease')}
                  className='flex-1 px-3 py-2 rounded-md border border-gray-300 text-gray-800 font-semibold hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
                >
                  Lease This Car
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
