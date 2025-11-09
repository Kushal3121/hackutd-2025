import Select from 'react-select';

export default function AppointmentModal({
  title = 'Edit appointment',
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  dateOptions = [],
  timeOptions = [],
  selectStyles,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
}) {
  if (!isOpen) return null;
  return (
    <div className='fixed inset-0 z-50 bg-black/30 flex items-center justify-center'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-md'>
        <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
          <h4 className='text-lg font-semibold'>{title}</h4>
          <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
            ×
          </button>
        </div>
        <div className='p-4 space-y-4'>
          <div className='grid grid-cols-3 items-center gap-3'>
            <label className='text-sm text-gray-600'>Date</label>
            <div className='col-span-2'>
              <Select
                options={dateOptions}
                value={dateValue}
                onChange={onDateChange}
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
                options={timeOptions}
                value={timeValue}
                onChange={onTimeChange}
                isSearchable={false}
                styles={selectStyles}
                placeholder='Select time'
              />
            </div>
          </div>
        </div>
        <div className='p-4 border-t border-gray-200 flex items-center justify-end gap-2'>
          <button onClick={onClose} className='px-4 py-2 rounded-md border border-gray-300'>
            {cancelLabel}
          </button>
          <button
            onClick={onSubmit}
            className='px-4 py-2 rounded-md bg-[#EB0A1E] text-white font-semibold'
            disabled={isSubmitting}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


