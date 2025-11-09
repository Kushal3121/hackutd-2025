import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/cars.json');

// Utility function to load cars
const loadCars = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// Get all cars (supports optional pagination via ?limit=&page= or ?limit=&offset=)
export const getAllCars = (req, res) => {
  try {
    const cars = loadCars();
    const { limit, page, offset } = req.query;
    const lim = parseInt(limit, 10);
    // Only paginate when a valid limit is provided
    if (Number.isFinite(lim) && lim > 0) {
      let start = 0;
      if (offset !== undefined) {
        const off = parseInt(offset, 10);
        start = Number.isFinite(off) && off >= 0 ? off : 0;
      } else if (page !== undefined) {
        const p = parseInt(page, 10);
        start = Number.isFinite(p) && p > 0 ? (p - 1) * lim : 0;
      }
      const slice = cars.slice(start, start + lim);
      return res.json(slice);
    }
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load cars data' });
  }
};

// Get car by ID
export const getCarById = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching car' });
  }
};

// Filter by region or year (optional)
export const filterCars = (req, res) => {
  try {
    const { region, year } = req.query;
    let cars = loadCars();
    if (region) cars = cars.filter((c) => c.region === region);
    if (year) cars = cars.filter((c) => c.year === parseInt(year));
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Error filtering cars' });
  }
};

// --- Configurator endpoints ---
export const getCarPackages = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    return res.json(car.packages || []);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching packages' });
  }
};

export const getCarDrivetrainOptions = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    // Derive options from car data (no mocks)
    const unique = Array.from(
      new Set([car.powertrain, car.drivetrain].filter(Boolean))
    );
    const options = unique.map((v) => ({ label: v, value: v }));
    return res.json(options);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching drivetrain options' });
  }
};

export const getCarInteriors = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    // Return provided interiors if present, otherwise an empty list
    return res.json(car.interiors || []);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching interiors' });
  }
};

export const getCarAccessories = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    return res.json(car.accessories || []);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching accessories' });
  }
};

export const getCarInsurancePlans = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    return res.json(car.insurance || []);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching insurance plans' });
  }
};

export const getCarFinance = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    return res.json({
      finance: car.finance || null,
      lease: car.lease || null,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching finance data' });
  }
};

export const getCarSummary = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    return res.json({
      model: `${car.name} ${car.trim} (${car.year})`,
      powertrain: car.powertrain,
      drivetrain: car.drivetrain,
      msrp: car.msrp,
      currency: car.currency,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching summary' });
  }
};
