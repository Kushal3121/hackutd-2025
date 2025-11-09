import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { SlidersHorizontal, Gauge, Fuel } from 'lucide-react';
import { Range } from 'react-range';

export default function AdvancedFilters(props) {
  const {
    open,
    onClose,
    matchCount,
    visibleCount,
    clearFilters,
    allSeries,
    allRegions,
    years,
    allDrivetrains,
    allPowertrains,
    allLocations,
    allColors,
    allPackages,
    currencyCode,
    minMsrp,
    maxMsrp,
    minLease,
    maxLease,
    minFinance,
    maxFinance,
    minCity,
    maxCity,
    minHwy,
    maxHwy,
    query,
    setQuery,
    series,
    setSeries,
    region,
    setRegion,
    yearsSelected,
    setYearsSelected,
    drivetrains,
    setDrivetrains,
    powertrains,
    setPowertrains,
    msrpRange,
    setMsrpRange,
    leaseRange,
    setLeaseRange,
    financeRange,
    setFinanceRange,
    cityRange,
    setCityRange,
    hwyRange,
    setHwyRange,
    location,
    setLocation,
    colors,
    setColors,
    pkg,
    setPkg,
    inStockOnly,
    setInStockOnly,
    sortKey,
    setSortKey,
  } = props;

  const selectStyles = {
    control: (base) => ({
      ...base,
      borderRadius: '0.5rem',
      borderColor: '#d1d5db',
      boxShadow: 'none',
      '&:hover': { borderColor: '#EB0A1E' },
    }),
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 25 }}
            className='fixed top-0 right-0 z-50 h-full w-full sm:w-[540px] bg-white border-l border-gray-200 shadow-2xl overflow-hidden flex flex-col'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#EB0A1E]/10 to-white'>
              <div className='flex items-center gap-2 font-semibold text-gray-900'>
                <SlidersHorizontal className='text-[#EB0A1E]' size={18} />
                Advanced Filters
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-sm text-gray-600 hidden sm:block'>
                  {visibleCount} / {matchCount}
                </span>
                <button
                  onClick={clearFilters}
                  className='px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium hover:border-[#EB0A1E] hover:text-[#EB0A1E] transition'
                >
                  Clear
                </button>
                <button
                  onClick={onClose}
                  className='px-3 py-1.5 rounded-md bg-[#EB0A1E] text-white text-sm font-medium hover:bg-[#d0091a] transition'
                >
                  Close
                </button>
              </div>
            </div>

            {/* Body */}
            <div className='p-4 space-y-4 overflow-y-auto flex-1 bg-gray-50/40'>
              <CardSection label='Sort'>
                <Select
                  options={[
                    { value: 'none', label: 'Default' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' },
                    { value: 'mpg_desc', label: 'Best MPG' },
                    { value: 'lease_asc', label: 'Lowest Lease Monthly' },
                  ]}
                  value={[
                    { value: 'none', label: 'Default' },
                    { value: 'price_asc', label: 'Price: Low to High' },
                    { value: 'price_desc', label: 'Price: High to Low' },
                    { value: 'mpg_desc', label: 'Best MPG' },
                    { value: 'lease_asc', label: 'Lowest Lease Monthly' },
                  ].find((o) => o.value === sortKey)}
                  onChange={(opt) => setSortKey(opt?.value || 'none')}
                  isSearchable={false}
                  styles={selectStyles}
                />
              </CardSection>

              <CardSection label='Model / Name'>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search...'
                  className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-[#EB0A1E] focus:ring-1 focus:ring-[#EB0A1E]'
                />
              </CardSection>

              <PillGrid
                label='Series'
                items={allSeries}
                selected={series}
                setSelected={setSeries}
              />

              <div className='grid grid-cols-2 gap-3'>
                <CardSection label='Region'>
                  <Select
                    options={['All', ...allRegions].map((r) => ({
                      value: r,
                      label: r,
                    }))}
                    value={{ value: region, label: region }}
                    onChange={(opt) => setRegion(opt?.value || 'All')}
                    isSearchable={false}
                    styles={selectStyles}
                  />
                </CardSection>
                <PillGrid
                  label='Year'
                  items={years}
                  selected={yearsSelected}
                  setSelected={setYearsSelected}
                />
              </div>

              <IconSection icon={<Gauge size={18} />} label='Drivetrain'>
                <PillGrid
                  items={allDrivetrains}
                  selected={drivetrains}
                  setSelected={setDrivetrains}
                />
              </IconSection>

              <IconSection icon={<Fuel size={18} />} label='Powertrain'>
                <PillGrid
                  items={allPowertrains}
                  selected={powertrains}
                  setSelected={setPowertrains}
                />
              </IconSection>

              <RangeControl
                label='Price Range (MSRP)'
                min={minMsrp}
                max={maxMsrp}
                value={msrpRange}
                onChange={setMsrpRange}
                currency
                currencyCode={currencyCode}
              />
              <RangeControl
                label='Lease Monthly'
                min={minLease}
                max={maxLease}
                value={leaseRange}
                onChange={setLeaseRange}
                currency
                currencyCode={currencyCode}
              />
              <RangeControl
                label='Finance Monthly'
                min={minFinance}
                max={maxFinance}
                value={financeRange}
                onChange={setFinanceRange}
                currency
                currencyCode={currencyCode}
              />
              <RangeControl
                label='City MPG'
                min={minCity}
                max={maxCity}
                value={cityRange}
                onChange={setCityRange}
              />
              <RangeControl
                label='Highway MPG'
                min={minHwy}
                max={maxHwy}
                value={hwyRange}
                onChange={setHwyRange}
              />

              <CardSection label='Location'>
                <Select
                  options={['All', ...allLocations].map((r) => ({
                    value: r,
                    label: r,
                  }))}
                  value={{ value: location, label: location }}
                  onChange={(opt) => setLocation(opt?.value || 'All')}
                  isSearchable
                  styles={selectStyles}
                />
              </CardSection>

              <PillGrid
                label='Colors'
                items={allColors}
                selected={colors}
                setSelected={setColors}
              />
              <PillGrid
                label='Packages'
                items={allPackages}
                selected={pkg}
                setSelected={setPkg}
              />

              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  id='instock'
                />
                <label
                  htmlFor='instock'
                  className='text-sm text-gray-700 select-none'
                >
                  In Stock Only
                </label>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className='p-3 border-t bg-white flex justify-between items-center'>
              <span className='text-sm text-gray-600'>
                Showing {visibleCount} of {matchCount} matches
              </span>
              <button
                onClick={clearFilters}
                className='px-4 py-2 bg-[#EB0A1E] text-white text-sm font-semibold rounded-md hover:bg-[#c70c1a] transition'
              >
                Reset Filters
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------- UI Blocks ---------- */

function CardSection({ label, children }) {
  return (
    <div className='bg-white rounded-md p-3 shadow-sm border border-gray-100'>
      <label className='block text-sm font-medium text-gray-700 mb-1'>
        {label}
      </label>
      {children}
    </div>
  );
}

function IconSection({ icon, label, children }) {
  return (
    <div className='bg-white rounded-md p-3 shadow-sm border border-gray-100'>
      <div className='flex items-center gap-2 mb-1 text-gray-700 font-medium'>
        {icon} {label}
      </div>
      {children}
    </div>
  );
}

/* ---------- Pill Grid ---------- */

function PillGrid({ label, items = [], selected, setSelected }) {
  if (label)
    return (
      <CardSection label={label}>
        <PillGridInner
          items={items}
          selected={selected}
          setSelected={setSelected}
        />
      </CardSection>
    );
  return (
    <PillGridInner
      items={items}
      selected={selected}
      setSelected={setSelected}
    />
  );
}

function PillGridInner({ items, selected, setSelected }) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 gap-2'>
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            type='button'
            onClick={() =>
              setSelected((cur) =>
                active ? cur.filter((x) => x !== item) : [...cur, item]
              )
            }
            className={`text-sm font-medium px-3 py-1.5 rounded-md border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#EB0A1E]
              ${
                active
                  ? 'bg-[#EB0A1E] text-white border-[#EB0A1E]'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-[#EB0A1E]/60 hover:text-[#EB0A1E]'
              }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Range Controls ---------- */

function RangeControl({
  label,
  min,
  max,
  value,
  onChange,
  currency = false,
  currencyCode = 'USD',
}) {
  const [lo, hi] = value;
  return (
    <CardSection label={label}>
      <div className='px-2 py-2'>
        <Range
          step={1}
          min={min}
          max={max}
          values={value}
          onChange={(v) => onChange(v)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className='h-2 w-full bg-gray-200 rounded-md relative'
            >
              <div
                className='absolute h-2 bg-[#EB0A1E] rounded-md'
                style={{
                  left: `${((lo - min) / (max - min)) * 100}%`,
                  width: `${((hi - lo) / (max - min)) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className='w-4 h-4 bg-white border-2 border-[#EB0A1E] rounded-md shadow'
            />
          )}
        />
        <div className='flex justify-between text-xs text-gray-500 mt-1'>
          <span>
            {currency
              ? `${currencyCode} ${lo.toLocaleString()}`
              : `${lo.toLocaleString()}`}
          </span>
          <span>
            {currency
              ? `${currencyCode} ${hi.toLocaleString()}`
              : `${hi.toLocaleString()}`}
          </span>
        </div>
      </div>
    </CardSection>
  );
}
