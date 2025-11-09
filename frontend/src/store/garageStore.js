import { create } from 'zustand';

const STORAGE_KEY = 'garage';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export const useGarageStore = create((set, get) => ({
  items: loadInitial(),
  add: (car) => {
    const items = get().items;
    if (items.some((c) => c.id === car.id)) return;
    const minimal = {
      id: car.id,
      name: car.name,
      trim: car.trim,
      msrp: car.msrp,
      currency: car.currency,
      media: car.media,
      modelCode: car.modelCode,
    };
    const next = [...items, minimal];
    set({ items: next });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  },
  remove: (id) => {
    const next = get().items.filter((c) => c.id !== id);
    set({ items: next });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  },
  toggle: (car) => {
    const items = get().items;
    if (items.some((c) => c.id === car.id)) {
      get().remove(car.id);
    } else {
      get().add(car);
    }
  },
  clear: () => {
    set({ items: [] });
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch {}
  },
}));
