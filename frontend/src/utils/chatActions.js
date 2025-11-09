import { parseCommand } from './commandParser';

// Basic helpers to find cars by model tokens
function findCarsByModelTokens(cars, tokens = []) {
  if (!Array.isArray(tokens) || tokens.length === 0) return [];
  const lowerTokens = tokens.map((t) => String(t).toLowerCase());
  return cars.filter((c) => {
    const hay = `${c.name} ${c.trim} ${c.modelCode}`.toLowerCase();
    return lowerTokens.some((t) => hay.includes(t));
  });
}

export function applyFilters(cars, filters = {}) {
  let list = [...cars];
  // If user specified model tokens, constrain results to those models first
  if (Array.isArray(filters.models) && filters.models.length > 0) {
    list = findCarsByModelTokens(list, filters.models);
  }
  if (filters.region) list = list.filter((c) => c.region === filters.region);
  if (filters.bodyType)
    list = list.filter((c) => c.series === filters.bodyType);
  if (filters.powertrain)
    list = list.filter((c) => c.powertrain === filters.powertrain);
  if (filters.drivetrain)
    list = list.filter((c) => c.drivetrain === filters.drivetrain);
  if (typeof filters.year === 'number')
    list = list.filter((c) => c.year === filters.year);
  if (typeof filters.maxPrice === 'number')
    list = list.filter((c) => Number(c.msrp || 0) <= filters.maxPrice);
  // Prefer in-stock
  list.sort(
    (a, b) =>
      Number(b?.inventory?.inStock || 0) - Number(a?.inventory?.inStock || 0) ||
      a.msrp - b.msrp
  );
  return list;
}

function mkText(message) {
  return { type: 'text', message };
}
function mkCars(message, cars) {
  return { type: 'cars', message, cars };
}

export async function handleAction(input, cars, helpers = {}) {
  const text = String(input || '');
  const parsed = parseCommand(text);
  const actionText = text.toLowerCase();
  let action = parsed.action || 'search';

  // Extend action detection heuristically
  if (actionText.includes('recommend')) action = 'recommend';
  if (/(add|save).*(garage)/.test(actionText)) action = 'add_to_garage';
  if (actionText.match(/\bhelp\b|\bwhat can you do\b/)) action = 'help';

  const filters = parsed.filters || {};

  if (action === 'help') {
    return mkText(
      'I can help with: \n- "show hybrid suvs under 30k"\n- "compare camry and corolla"\n- "recommend me hybrid sedans"\n- "add corolla to my garage"'
    );
  }
  if (action === 'chitchat') {
    const kind = parsed?.chitchat || 'generic';
    const replies = {
      greeting:
        'Hello! I can help you search models, compare two cars, or suggest options.',
      thanks: 'You’re welcome! Anything else I can help you find?',
      farewell: 'Goodbye! Come back anytime if you need more help.',
      affirmation: 'Great — tell me what you’d like to search or compare.',
      negative: 'No problem. Ask me anytime.',
      howareyou: 'Doing well and ready to help with car searches!',
      whoareyou:
        'I’m your assistant for car search, comparisons, and recommendations.',
      generic:
        'I can help with search, compare, and recommendations. Try "hybrid suv under 30k".',
    };
    return mkText(replies[kind] || replies.generic);
  }

  if (action === 'compare') {
    const list = findCarsByModelTokens(
      cars,
      filters.models || [filters.model]
    ).slice(0, 2);
    if (list.length < 2) {
      return mkText(
        'I need two models to compare, e.g., "compare camry and corolla".'
      );
    }
    // Let UI render "comparing..." and call summarizer asynchronously
    return { type: 'compare', message: 'Comparing models…', cars: list };
  }

  if (action === 'add_to_garage') {
    const list = findCarsByModelTokens(cars, filters.models || [filters.model]);
    const car = list[0];
    if (!car)
      return mkText(
        'I could not find that model to add. Try "add corolla to my garage".'
      );
    if (typeof helpers.addToGarage === 'function') helpers.addToGarage(car);
    return mkText(`Added ${car.name} ${car.trim} to your garage.`);
  }

  if (action === 'recommend') {
    const base = applyFilters(cars, filters);
    // Simple heuristic: prioritize higher total MPG and lower price
    const scored = base.map((c) => {
      const mpg =
        Number(c?.efficiency?.city_mpg || 0) +
        Number(c?.efficiency?.hwy_mpg || 0);
      const price = Number(c?.msrp || 0);
      const score = mpg * 2 - price / 1000;
      return { c, score };
    });
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3).map((s) => s.c);
    if (!top.length) return mkText('No recommendations matched your request.');
    return mkCars('Here are a few recommendations for you:', top);
  }

  // search intent from parser
  if (action === 'search') {
    // If user provided only vague info, ask a follow-up
    const hasAnyStrongFilter = !!(
      filters.maxPrice ||
      filters.region ||
      filters.year
    );
    const hasAnySoftFilter = !!(filters.powertrain || filters.bodyType);
    if (!hasAnyStrongFilter && hasAnySoftFilter) {
      return mkText('Got it — any budget range in mind?');
    }
    return {
      type: 'search',
      message: `Searching for ${filters.powertrain || ''} ${
        filters.bodyType || ''
      } cars${
        filters.maxPrice
          ? ' under $' + Number(filters.maxPrice).toLocaleString()
          : ''
      }${filters.region ? ' in ' + filters.region : ''}${
        filters.year ? ' (' + filters.year + ')' : ''
      }...`,
      filters,
    };
  }

  // default fallback: run a basic search anyway
  const results = applyFilters(cars, filters);
  if (results.length === 0)
    return mkText(
      'No matches found. Try relaxing your filters or changing the region.'
    );
  return mkCars(
    `Found ${results.length} match(es). Showing top results:`,
    results.slice(0, 3)
  );
}

export default { handleAction };
