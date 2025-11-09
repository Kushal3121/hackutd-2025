import nlp from 'compromise';

// Flexible natural-language parser for in-app, offline use
// Extracts: price ceiling, year, powertrain, body type, region, and detects "compare" intents

const powertrainMap = {
  hybrid: ['hybrid', 'dual engine'],
  'plug-in hybrid': ['plug-in', 'plugin hybrid', 'phev'],
  electric: ['electric', 'ev', 'battery'],
  gas: ['gas', 'petrol', 'gasoline'],
  hydrogen: ['hydrogen', 'fuel cell'],
};

const bodyTypeMap = {
  suv: ['suv', 'crossover', 'family car', 'family-friendly', 'family'],
  sedan: ['sedan', 'saloon', 'compact car'],
  truck: ['truck', 'pickup'],
  crossover: ['crossover'],
  minivan: ['minivan', 'van'],
};

const regionMap = {
  us: 'US',
  usa: 'US',
  america: 'US',
  canada: 'Canada',
  ca: 'Canada',
  eu: 'EU',
  europe: 'EU',
  germany: 'EU',
  france: 'EU',
  italy: 'EU',
};

function norm(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractMaxPrice(lower) {
  // Handle "under 30k", "below 40,000", "less than $25k", "under $40 grand"
  const normalized = lower.replace(/[, ]/g, '');
  const m =
    normalized.match(/(?:under|below|lessthan|<=|<)\$?(\d+)(k|grand)?/) ||
    normalized.match(/(?:max|atmost)\$?(\d+)(k|grand)?/);
  if (!m) return null;
  const num = Number(m[1]);
  if (!Number.isFinite(num)) return null;
  const mult = m[2] ? 1000 : 1;
  return num * mult;
}

function mapByIncludes(lower, map) {
  for (const key of Object.keys(map)) {
    const list = Array.isArray(map[key]) ? map[key] : [map[key]];
    if (list.some((term) => lower.includes(term))) return key;
  }
  return null;
}

function extractRegion(lower) {
  for (const key of Object.keys(regionMap)) {
    if (lower.includes(key)) return regionMap[key];
  }
  return null;
}

export function parseCommand(text) {
  const input = norm(text);
  const lower = input.toLowerCase();
  const doc = nlp(lower);

  // Intent
  let action = 'search';
  if (/\bcompare\b|\bvs\b/.test(lower)) action = 'compare';
  if (/\bhelp\b|what can you do/.test(lower)) action = 'help';
  // Chit-chat detection (greeting/thanks/farewell/etc.)
  const isGreeting =
    /\b(hi|hello|hey|yo|sup|good (morning|afternoon|evening))\b/.test(lower);
  const isThanks = /\b(thanks|thank you|ty|thx|appreciate)\b/.test(lower);
  const isFarewell = /\b(bye|goodbye|see (ya|you)|later|cya)\b/.test(lower);
  const isAffirm = /\b(yes|yep|yeah|sure|ok|okay|sounds good|go ahead)\b/.test(
    lower
  );
  const isNegative = /\b(no|nope|nah|not now)\b/.test(lower);
  const isHowAreYou = /(how are you|how's it going|how are u)/.test(lower);
  const isWhoAreYou = /(who are you|what are you)/.test(lower);

  // Year
  const year = (lower.match(/\b(20\d{2})\b/) || [])[1]
    ? Number((lower.match(/\b(20\d{2})\b/) || [])[1])
    : null;

  // Price
  const maxPrice = extractMaxPrice(lower);

  // Powertrain and body type via synonyms
  const foundPowertrainKey = mapByIncludes(lower, powertrainMap);
  const powertrain =
    foundPowertrainKey === 'plug-in hybrid'
      ? 'Plug-in Hybrid'
      : foundPowertrainKey
      ? foundPowertrainKey[0].toUpperCase() + foundPowertrainKey.slice(1)
      : null;

  const foundBodyKey = mapByIncludes(lower, bodyTypeMap);
  const bodyType = foundBodyKey
    ? foundBodyKey.toUpperCase() === 'SUV'
      ? 'SUV'
      : foundBodyKey[0].toUpperCase() + foundBodyKey.slice(1)
    : null;

  // Region
  const region = extractRegion(lower);

  // Basic model capture (proper nouns) with compromise as a hint
  const nouns = doc
    .nouns()
    .out('array')
    .map((s) => s.trim());
  const models = nouns
    .filter((w) =>
      /rav4|corolla|camry|prius|highlander|tundra|tacoma|sienna|supra|crown|land|4runner|bz4x|gr|cross/.test(
        w
      )
    )
    .map((w) => w.replace(/land$/, 'Land Cruiser'))
    .filter(Boolean);

  // If nothing meaningful, fall back to chitchat
  if (
    !powertrain &&
    !bodyType &&
    !maxPrice &&
    !region &&
    !year &&
    models.length === 0
  ) {
    const chit =
      (isGreeting && 'greeting') ||
      (isThanks && 'thanks') ||
      (isFarewell && 'farewell') ||
      (isAffirm && 'affirmation') ||
      (isNegative && 'negative') ||
      (isHowAreYou && 'howareyou') ||
      (isWhoAreYou && 'whoareyou') ||
      'generic';
    return { action: 'chitchat', chitchat: chit };
  }

  return {
    action,
    filters: {
      powertrain,
      bodyType: bodyType === 'Crossover' ? 'Crossover' : bodyType,
      maxPrice: maxPrice || null,
      region: region || null,
      year: year || null,
      models: models.length ? models : undefined,
    },
  };
}

export default parseCommand;
