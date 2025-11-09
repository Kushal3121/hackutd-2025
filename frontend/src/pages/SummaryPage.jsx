import { useLocation, useNavigate } from 'react-router-dom';
import SummarySection from '../components/SummarySection';

export default function SummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { car, accentColor, selectedColor, selectedPackages, quote } = state || {};

  if (!car) {
    return (
      <div className='p-6 text-center text-gray-600'>
        No build data found.{' '}
        <button
          className='text-[#EB0A1E] underline'
          onClick={() => navigate('/dashboard')}
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen overflow-x-hidden overflow-y-hidden bg-white'>
      <SummarySection
        car={car}
        accentColor={accentColor}
        selectedColor={selectedColor}
        selectedPackages={selectedPackages}
        quote={quote}
      />
    </div>
  );
}


