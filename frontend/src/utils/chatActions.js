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
  if (filters.region) list = list.filter((c) => c.region === filters.region);
  if (filters.bodyType) list = list.filter((c) => c.series === filters.bodyType);
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
    (a, b) => (Number(b?.inventory?.inStock || 0) - Number(a?.inventory?.inStock || 0)) || a.msrp - b.msrp
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
    const type = parsed.chitchat || 'generic';
    const hour = new Date().getHours();
    const timeGreet =
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    switch (type) {
      case 'greeting':
        return mkText(
          `${timeGreet}! I can help you find cars. Try "hybrid suv under 30k" or tell me your budget and region.`
        );
      case 'thanks':
        return mkText(
          'You’re welcome! Want me to save a car to your garage or compare any models?'
        );
      case 'farewell':
        return mkText('Bye! Happy driving — ping me anytime.');
      case 'affirmation':
        return mkText(
          'Great! Do you have a price range or location I should focus on?'
        );
      case 'negative':
        return mkText(
          'No worries. Tell me what body type or price you have in mind when you’re ready.'
        );
      case 'howareyou':
        return mkText(
          "I'm doing great and ready to help. What kind of car are you considering?"
        );
      case 'whoareyou':
        return mkText(
          'I’m your local Toyota AI Assistant. I can search, compare, recommend, and add cars to your garage — all offline.'
        );
      default:
        return mkText(
          'Hi there! You can ask me to search, compare, or recommend cars. For example, "electric sedan for 2025" or "compare camry and corolla".'
        );
    }
  }

  if (action === 'compare') {
    const list = findCarsByModelTokens(cars, filters.models || [filters.model]).slice(
      0,
      2
    );
    if (list.length < 2) {
      return mkText('I need two models to compare, e.g., "compare camry and corolla".');
    }
    const [a, b] = list;
    const priceDiff = Math.abs((a.msrp || 0) - (b.msrp || 0));
    const mpgA = (a?.efficiency?.city_mpg || 0) + (a?.efficiency?.hwy_mpg || 0);
    const mpgB = (b?.efficiency?.city_mpg || 0) + (b?.efficiency?.hwy_mpg || 0);
    const betterMpg = mpgA === mpgB ? 'Similar efficiency.' : mpgA > mpgB ? `${a.name} tends to have better MPG.` : `${b.name} tends to have better MPG.`;
    const msg = `Comparing ${a.name} ${a.trim} vs ${b.name} ${b.trim}:\n- Price difference ≈ ${a.currency} ${priceDiff.toLocaleString()}\n- ${betterMpg}`;
    return mkCars(msg, list);
  }

  if (action === 'add_to_garage') {
    const list = findCarsByModelTokens(cars, filters.models || [filters.model]);
    const car = list[0];
    if (!car) return mkText('I could not find that model to add. Try "add corolla to my garage".');
    if (typeof helpers.addToGarage === 'function') helpers.addToGarage(car);
    return mkText(`✅ Added ${car.name} ${car.trim} to your garage.`);
  }

  if (action === 'recommend') {
    const base = applyFilters(cars, filters);
    // Simple heuristic: prioritize higher total MPG and lower price
    const scored = base.map((c) => {
      const mpg = Number(c?.efficiency?.city_mpg || 0) + Number(c?.efficiency?.hwy_mpg || 0);
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
    const hasAnyStrongFilter = !!(filters.maxPrice || filters.region || filters.year);
    const hasAnySoftFilter = !!(filters.powertrain || filters.bodyType);
    if (!hasAnyStrongFilter && hasAnySoftFilter) {
      return mkText('Got it — any budget range in mind?');
    }
    return {
      type: 'search',
      message: `Searching for ${filters.powertrain || ''} ${filters.bodyType || ''} cars${filters.maxPrice ? ' under $' + Number(filters.maxPrice).toLocaleString() : ''}${filters.region ? ' in ' + filters.region : ''}${filters.year ? ' (' + filters.year + ')' : ''}...`,
      filters,
    };
  }

  // default fallback: run a basic search anyway
  const results = applyFilters(cars, filters);
  if (results.length === 0) return mkText('No matches found. Try relaxing your filters or changing the region.');
  return mkCars(`Found ${results.length} match(es). Showing top results:`, results.slice(0, 3));
}

export default { handleAction };


