import { motion } from 'framer-motion';

export default function SummarySection({
  car,
  accentColor,
  selectedColor,
  selectedPackages = [],
}) {
  const packagesTotal = selectedPackages.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );
  const colorExtra = selectedColor?.extraCost || 0;
  const totalPrice = (car?.msrp || 0) + colorExtra + packagesTotal;

  return (
    <section className='max-w-4xl mx-auto text-center py-20'>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='text-3xl font-semibold mb-6 text-toyotaGray'
      >
        Your Build Summary
      </motion.h2>

      <div className='bg-white/90 shadow-lg rounded-2xl p-8 space-y-4 text-left'>
        <p>
          <strong>Model:</strong> {car.name} {car.trim} ({car.year})
        </p>
        <p>
          <strong>Color:</strong> {selectedColor?.name}{' '}
          {colorExtra > 0 ? `(+${
            car.currency
          } ${colorExtra.toLocaleString()})` : ''}
        </p>
        <p>
          <strong>Packages:</strong>{' '}
          {selectedPackages.length > 0
            ? selectedPackages
                .map((p) => `${p.name} (+${car.currency} ${p.price})`)
                .join(', ')
            : 'None'}
        </p>
        <p>
          <strong>Powertrain:</strong> {car.powertrain}
        </p>
        <p>
          <strong>Drivetrain:</strong> {car.drivetrain}
        </p>
        <p>
          <strong>Base MSRP:</strong> {car.currency}{' '}
          {car.msrp.toLocaleString()}
        </p>
        <p>
          <strong>Total:</strong> {car.currency} {totalPrice.toLocaleString()}
        </p>
        <p>
          <strong>Efficiency:</strong> {car.efficiency?.city_mpg} city /{' '}
          {car.efficiency?.hwy_mpg} hwy MPG
        </p>
        <p>
          <strong>Inventory:</strong> {car.inventory?.location} • In stock:{' '}
          {car.inventory?.inStock} • ETA:{' '}
          {car.inventory?.deliveryEtaDays} days
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='mt-10 px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold shadow-md'
        style={{ '--accent': accentColor }}
      >
        Book a Test Drive
      </motion.button>
    </section>
  );
}
