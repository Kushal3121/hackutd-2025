import { MapPin, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CarCard({ car }) {
  const navigate = useNavigate();

  return (
    <div
      className='
        group relative overflow-hidden rounded-2xl bg-white shadow-md 
        hover:shadow-2xl transition-all duration-300 hover:-translate-y-1
        border border-toyotaGray-mid/30
      '
    >
      {/* --- Car Image --- */}
      <div className='relative'>
        <img
          src={car.media?.hero || '/images/default-car.jpg'}
          alt={car.name}
          className='w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>

        {/* Year badge */}
        <div className='absolute top-3 left-3 bg-toyotaRed text-white text-xs font-semibold px-2 py-1 rounded-md'>
          {car.year}
        </div>
      </div>

      {/* --- Car Details --- */}
      <div className='p-4 space-y-2'>
        <h2 className='font-bold text-lg text-toyotaGray group-hover:text-toyotaRed transition-colors'>
          {car.name}
        </h2>

        <p className='text-sm text-toyotaGray-mid'>
          {car.trim} • {car.powertrain} • {car.drivetrain}
        </p>

        <p className='text-toyotaRed font-semibold text-base'>
          {car.currency} {car.msrp.toLocaleString()}
        </p>

        <div className='flex items-center justify-between text-xs text-toyotaGray-mid mt-3'>
          <span className='flex items-center gap-1'>
            <MapPin size={14} /> {car.inventory.location}
          </span>
          <span className='flex items-center gap-1'>
            <Fuel size={14} /> {car.efficiency.city_mpg}/
            {car.efficiency.hwy_mpg} mpg
          </span>
        </div>
      </div>

      {/* --- Hover Action Layer --- */}
      <div
        className='
          absolute inset-0 flex flex-col items-center justify-center text-center
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-white/10 backdrop-blur-md
        '
      >
        <p className='text-white font-medium text-sm mb-3 drop-shadow'>
          {car.packages.length} Optional Packages
        </p>
        <button
          onClick={() => navigate(`/dashboard/cars/${car.id}`)}
          className='
            bg-toyotaRed text-white px-4 py-2 rounded-lg text-sm font-semibold
            hover:bg-toyotaRed-dark transition shadow-md hover:shadow-lg
          '
        >
          View Details
        </button>
      </div>
    </div>
  );
}
