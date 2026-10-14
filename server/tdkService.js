import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache
const memoryCache = new Map();

// Load official TDK 5-letter dictionary
let tdkDictionary = {};
try {
  const data = fs.readFileSync(path.join(__dirname, 'tdk_words_5.json'), 'utf-8');
  tdkDictionary = JSON.parse(data);
  console.log(`[TDK Service] Loaded ${Object.keys(tdkDictionary).length} official TDK 5-letter words with definitions.`);
} catch (err) {
  console.error('[TDK Service] Failed to load tdk_words_5.json:', err);
}

/**
 * Normalizes and cleans a Turkish word
 */
export function cleanTurkishWord(word) {
  if (!word || typeof word !== 'string') return '';
  return word
    .trim()
    .toLocaleLowerCase('tr-TR')
    .normalize('NFKC')
    .replace(/[^\w\sçğıöşüÇĞİÖŞÜ\-]/g, '');
}

/**
 * Parses raw TDK GTS API response (Creart-TDK format)
 */
function parseRawTDKResponse(rawArray, searchWord) {
  if (!Array.isArray(rawArray) || rawArray.length === 0) return null;
  const entry = rawArray[0];

  const meanings = [];
  if (Array.isArray(entry.anlamlarListe)) {
    entry.anlamlarListe.forEach((a, idx) => {
      if (!a.anlam) return;
      const types = [];
      if (Array.isArray(a.ozelliklerListe)) {
        a.ozelliklerListe.forEach(oz => {
          if (oz.tam_adi) types.push(oz.tam_adi);
        });
      }
      const examples = [];
      if (Array.isArray(a.orneklerListe)) {
        a.orneklerListe.forEach(ex => {
          if (ex.ornek) {
            examples.push({
              ornek: ex.ornek,
              yazar: ex.yazar && ex.yazar[0] ? ex.yazar[0].tam_adi : null
            });
          }
        });
      }
      meanings.push({
        sira: idx + 1,
        anlam: a.anlam,
        tur: types.length > 0 ? types.join(', ') : null,
        ornekler: examples
      });
    });
  }

  return {
    word: entry.madde || searchWord,
    origin: entry.lisan ? entry.lisan.trim() : null,
    meanings: meanings,
    birlesikler: entry.birlesikler ? entry.birlesikler.split(',').map(s => s.trim()).filter(Boolean) : [],
    source: 'TDK Güncel Türkçe Sözlük (GTS)'
  };
}

/**
 * Fetches definition from live TDK API (sozluk.gov.tr) with timeout
 */
async function fetchLiveTDK(word) {
  const clean = cleanTurkishWord(word);
  if (!clean) return null;

  try {
    const url = `https://sozluk.gov.tr/gts?ara=${encodeURIComponent(clean)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'tr-TR,tr;q=0.9'
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    if (data.error || !Array.isArray(data)) return null;

    return parseRawTDKResponse(data, clean);
  } catch (err) {
    // Timeout or network error - fallback to local database
    return null;
  }
}

/**
 * Gets TDK details for a given word
 * Checks memory cache -> local TDK DB -> live TDK API
 */
export async function getWordDetails(word) {
  const clean = cleanTurkishWord(word);
  if (!clean) return null;

  // 1. Check in-memory cache
  if (memoryCache.has(clean)) {
    return memoryCache.get(clean);
  }

  // 2. Check local official TDK database
  if (tdkDictionary[clean]) {
    const local = tdkDictionary[clean];
    const result = {
      word: local.word,
      origin: local.origin || null,
      meanings: local.meanings || [],
      source: 'TDK Güncel Türkçe Sözlük (GTS)'
    };
    memoryCache.set(clean, result);

    // Opportunistically try live fetch in background if missing origin/details
    if (!local.origin) {
      fetchLiveTDK(clean).then(live => {
        if (live && live.origin) {
          result.origin = live.origin;
          memoryCache.set(clean, result);
        }
      }).catch(() => {});
    }

    return result;
  }

  // 3. Fallback to live TDK fetch (for non-5-letter words or newly added words)
  const liveResult = await fetchLiveTDK(clean);
  if (liveResult) {
    memoryCache.set(clean, liveResult);
    return liveResult;
  }

  // Fallback empty result
  return {
    word: clean,
    origin: null,
    meanings: [{ anlam: 'TDK sözlüğünde temel kayıt', tur: 'kelime', ornekler: [] }],
    source: 'TDK'
  };
}

/**
 * Returns a dictionary mapping of word -> TDK details for a list of words
 */
export async function getWordsDetailsMap(wordsList) {
  if (!Array.isArray(wordsList)) return {};
  const map = {};
  await Promise.all(
    wordsList.map(async (w) => {
      const details = await getWordDetails(w);
      if (details) {
        map[cleanTurkishWord(w)] = details;
      }
    })
  );
  return map;
}

/**
 * Returns count and status of TDK dictionary
 */
export function getTDKStats() {
  return {
    loadedWords: Object.keys(tdkDictionary).length,
    cachedQueries: memoryCache.size
  };
}
