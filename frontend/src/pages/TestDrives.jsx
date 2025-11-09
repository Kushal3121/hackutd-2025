import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  getAllTestDrives,
  deleteTestDrive,
  updateTestDrive,
} from '../services/api';
import { Pencil, Trash2 } from 'lucide-react';
import Select from 'react-select';
import AppointmentModal from '../components/AppointmentModal';

export default function TestDrives() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editDate, setEditDate] = useState(null);
  const [editTime, setEditTime] = useState(null);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      return {};
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllTestDrives(user?.id || user?.username);
      setItems(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load test drives');
    } finally {
      setLoading(false);
    }
  };

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

  const openEdit = (td) => {
    setEditItem(td);
    if (td.appointmentAt) {
      const d = new Date(td.appointmentAt);
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      setEditDate({
        value: `${yyyy}-${mm}-${dd}`,
        label: d.toLocaleDateString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      });
      setEditTime({
        value: `${hh}:${mi}`,
        label: d.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    } else {
      setEditDate(null);
      setEditTime(null);
    }
    setShowEdit(true);
  };

  const submitEdit = async () => {
    try {
      if (!editItem) return;
      if (!editDate?.value || !editTime?.value) {
        toast.error('Please select date and time');
        return;
      }
      await updateTestDrive(editItem.id, {
        date: editDate.value,
        time: editTime.value,
      });
      toast.success('Appointment updated');
      setShowEdit(false);
      fetchData();
    } catch {
      toast.error('Failed to update');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTestDrive(id);
      toast.success('Deleted successfully');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <p className='p-6'>Loading test drives…</p>;

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-bold text-gray-900'>My Test Drives</h2>
        <button
          onClick={fetchData}
          className='px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:border-toyotaRed transition'
        >
          Refresh
        </button>
      </div>

      {items.length === 0 ? (
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-gray-600 text-center'>
          No test drives booked yet.
        </div>
      ) : (
        <div className='overflow-x-auto rounded-xl shadow-sm border border-gray-200 bg-white'>
          <table className='min-w-full text-sm text-left'>
            <thead className='bg-gray-100 text-gray-800 border-b border-gray-200'>
              <tr>
                <th className='p-4 font-semibold'>#</th>
                <th className='p-4 font-semibold'>Car</th>
                <th className='p-4 font-semibold'>Color</th>
                <th className='p-4 font-semibold'>Total Price</th>
                <th className='p-4 font-semibold'>Appointment</th>
                <th className='p-4 font-semibold'>ETA (days)</th>
                <th className='p-4 font-semibold'>Booked At</th>
                <th className='p-4 font-semibold text-center'>Actions</th>
              </tr>
            </thead>

            <tbody className='divide-y divide-gray-100'>
              {items.map((td, idx) => (
                <tr key={td.id} className='hover:bg-gray-50 transition'>
                  <td className='p-4 text-gray-600'>{idx + 1}</td>
                  <td className='p-4 font-medium text-gray-900'>
                    {td.carName}
                  </td>
                  <td className='p-4 text-gray-700'>{td.color || '—'}</td>
                  <td className='p-4 text-gray-800'>
                    {td.totalPrice
                      ? `USD ${td.totalPrice.toLocaleString()}`
                      : '—'}
                  </td>
                  <td className='p-4 text-gray-700'>
                    {td.appointmentAt
                      ? new Date(td.appointmentAt).toLocaleString()
                      : '—'}
                  </td>
                  <td className='p-4 text-gray-700'>{td.etaDays}</td>
                  <td className='p-4 text-gray-700'>
                    {new Date(td.bookedAt).toLocaleString()}
                  </td>
                  <td className='p-4 text-center'>
                    <div className='flex items-center justify-center gap-3'>
                      <button
                        onClick={() => openEdit(td)}
                        title='Edit appointment'
                        className='p-2 rounded-md border border-gray-300 text-gray-700 hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(td.id)}
                        title='Delete'
                        className='p-2 rounded-md border border-gray-300 text-gray-700 hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AppointmentModal
        title='Edit appointment'
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        onSubmit={submitEdit}
        isSubmitting={false}
        dateOptions={getDateOptions(30)}
        timeOptions={getTimeOptions()}
        selectStyles={selectStyles}
        dateValue={editDate}
        timeValue={editTime}
        onDateChange={(opt) => setEditDate(opt)}
        onTimeChange={(opt) => setEditTime(opt)}
        submitLabel='Save'
        cancelLabel='Cancel'
      />
    </div>
  );
}
