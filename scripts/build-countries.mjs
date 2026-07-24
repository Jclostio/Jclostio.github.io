// One-time data pipeline for Nationdle.
// Sources:
//   - REST Countries (https://restcountries.com)        : code, name, capital, region, population
//   - geocountries.com                                   : national bird / flower / animal
//   - Wikipedia "List of national dishes"                : national dish
//   - lipis/flag-icons GitHub repo                       : flag colors (parsed from SVG)
//
// Usage: node scripts/build-countries.mjs
// Respects geocountries.com robots.txt (10s crawl-delay).

import { writeFileSync } from "node:fs";
import { load } from "cheerio";

const CRAWL_DELAY_MS = 10_000;
const UA = "NationdlePortfolioBuild/1.0 (personal portfolio one-time data fetch)";
const OUTFILE = "src/data/countries.json";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function normalize(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&\w+;/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Map alternative names → canonical (in normalized form).
// Source names → REST Countries canonical (e.g., REST has "United States", geocountries has "United States Of America").
const NAME_ALIASES = {
  "united states of america": "united states",
  "usa": "united states",
  "us": "united states",
  "uk": "united kingdom",
  "great britain": "united kingdom",
  "britain": "united kingdom",
  "russian federation": "russia",
  "korea republic of": "south korea",
  "republic of korea": "south korea",
  "korea south": "south korea",
  "korea democratic peoples republic of": "north korea",
  "democratic peoples republic of korea": "north korea",
  "korea north": "north korea",
  "viet nam": "vietnam",
  "syrian arab republic": "syria",
  "iran islamic republic of": "iran",
  "lao peoples democratic republic": "laos",
  "myanmar burma": "myanmar",
  "burma": "myanmar",
  "czech republic": "czechia",
  "the bahamas": "bahamas",
  "the gambia": "gambia",
  "ivory coast": "cote d ivoire",
  "cote divoire": "cote d ivoire",
  "republic of the congo": "congo",
  "congo brazzaville": "congo",
  "democratic republic of the congo": "dr congo",
  "congo kinshasa": "dr congo",
  "drc": "dr congo",
  "east timor": "timor leste",
  "tanzania united republic of": "tanzania",
  "macedonia": "north macedonia",
  "moldova republic of": "moldova",
  "swaziland": "eswatini",
  "cape verde": "cabo verde",
  "saint vincent and the grenadines": "saint vincent grenadines",
  "trinidad tobago": "trinidad and tobago",
  "antigua barbuda": "antigua and bermuda",
  "antigua and bermuda": "antigua and barbuda",
  "saint kitts nevis": "saint kitts and nevis",
  "vatican city": "holy see",
  "palestine": "palestinian territory occupied",
};

function canonicalName(n) {
  const norm = normalize(n);
  return NAME_ALIASES[norm] ?? norm;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

// ---------- REST Countries ----------
async function getRestCountries() {
  const url =
    "https://restcountries.com/v3.1/all?fields=name,cca2,capital,region,subregion,population,independent,unMember";
  const data = await fetchJson(url);
  return data
    .filter((c) => c.independent === true || c.unMember === true)
    .map((c) => ({
      code: c.cca2,
      name: c.name?.common ?? "",
      officialName: c.name?.official ?? "",
      capital: Array.isArray(c.capital) && c.capital[0] ? c.capital[0] : "Unknown",
      region: c.region ?? "Unknown",
      subregion: c.subregion ?? "",
      population: c.population ?? 0,
    }));
}

// ---------- geocountries.com tables ----------
async function scrapeGeoCountriesTable(url) {
  const html = await fetchText(url);
  const $ = load(html);
  const rows = {};
  $("table tr").each((_, tr) => {
    const cells = $(tr).find("td");
    if (cells.length < 2) return;
    const country = $(cells[0]).text().trim();
    const value = $(cells[1]).text().trim();
    if (!country || !value) return;
    if (/scientific/i.test(country)) return;
    rows[canonicalName(country)] = value;
  });
  return rows;
}

// ---------- Wikipedia: National dish ----------
// The page is a bulleted list shaped like "Country: dish1, dish2".
// Each <li> in the article body that matches "Word(s): Word(s)" is a candidate.
async function scrapeWikipediaDishes() {
  const html = await fetchText("https://en.wikipedia.org/wiki/National_dish");
  const $ = load(html);
  const dishes = {};

  $("#mw-content-text li").each((_, li) => {
    // Strip footnote refs like [12] before reading text.
    const $li = $(li).clone();
    $li.find("sup").remove();
    const text = $li.text().replace(/\s+/g, " ").trim();
    // Match "Country: dish1, dish2 ..."  Country must come before the first colon.
    const m = text.match(/^([^:()]+?):\s*(.+)$/);
    if (!m) return;
    const country = m[1].trim();
    const dishPart = m[2].trim();
    // Skip nested or pathological entries.
    if (country.length > 50 || country.split(" ").length > 6) return;
    // Take the first dish before a comma or "and".
    const first = dishPart
      .split(/,| and /i)[0]
      .replace(/\(.*?\)/g, "")
      .trim();
    if (!first || first.length > 60) return;
    const key = canonicalName(country);
    if (!dishes[key]) dishes[key] = first;
  });

  return dishes;
}

// ---------- Flag colors via lipis/flag-icons SVGs ----------
async function getFlagColors(code) {
  const c = code.toLowerCase();
  const url = `https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/${c}.svg`;
  try {
    const svg = await fetchText(url);
    const colors = new Set();
    const fillRe = /fill\s*=\s*"([^"]+)"|fill\s*:\s*([#a-zA-Z0-9()., ]+)/g;
    let m;
    while ((m = fillRe.exec(svg)) !== null) {
      const raw = (m[1] ?? m[2] ?? "").trim();
      const hex = normalizeColor(raw);
      if (hex) colors.add(hex);
    }
    // Also <stop stop-color="#XXX"/>
    const stopRe = /stop-color\s*=\s*"([^"]+)"/g;
    while ((m = stopRe.exec(svg)) !== null) {
      const hex = normalizeColor(m[1]);
      if (hex) colors.add(hex);
    }
    return [...colors].slice(0, 8);
  } catch {
    return [];
  }
}

function normalizeColor(raw) {
  if (!raw) return null;
  const r = raw.toLowerCase().trim();
  if (r === "none" || r === "transparent" || r.startsWith("url(")) return null;
  if (/^#[0-9a-f]{6}$/.test(r)) return r.toUpperCase();
  if (/^#[0-9a-f]{3}$/.test(r)) {
    return ("#" + r[1] + r[1] + r[2] + r[2] + r[3] + r[3]).toUpperCase();
  }
  const named = NAMED_COLORS[r];
  if (named) return named;
  const rgb = r.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgb) {
    return (
      "#" +
      [rgb[1], rgb[2], rgb[3]]
        .map((v) => Number(v).toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  }
  return null;
}

const NAMED_COLORS = {
  white: "#FFFFFF",
  black: "#000000",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  orange: "#FFA500",
  gray: "#808080",
  grey: "#808080",
  silver: "#C0C0C0",
  gold: "#FFD700",
};

function titleCase(s) {
  if (!s || s === "Unknown") return s;
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function regionToContinent(region, subregion) {
  if (region === "Americas") {
    if (subregion?.includes("South")) return "South America";
    return "North America";
  }
  return region || "Unknown";
}

// ---------- Main ----------
async function main() {
  console.log("→ REST Countries…");
  const base = await getRestCountries();
  console.log(`  got ${base.length} countries`);

  console.log("→ geocountries.com: birds…");
  const birds = await scrapeGeoCountriesTable("https://www.geocountries.com/country/national/birds");
  console.log(`  got ${Object.keys(birds).length} entries`);
  await sleep(CRAWL_DELAY_MS);

  console.log("→ geocountries.com: flowers…");
  const flowers = await scrapeGeoCountriesTable("https://www.geocountries.com/country/national/flowers");
  console.log(`  got ${Object.keys(flowers).length} entries`);
  await sleep(CRAWL_DELAY_MS);

  console.log("→ geocountries.com: animals…");
  const animals = await scrapeGeoCountriesTable("https://www.geocountries.com/country/national/animals");
  console.log(`  got ${Object.keys(animals).length} entries`);

  console.log("→ Wikipedia: national dishes…");
  const dishes = await scrapeWikipediaDishes();
  console.log(`  got ${Object.keys(dishes).length} entries`);

  console.log("→ Flag colors (lipis/flag-icons)…");
  const merged = [];
  let i = 0;
  for (const c of base) {
    i++;
    if (i % 25 === 0) console.log(`  ${i}/${base.length}`);
    const key = canonicalName(c.name);
    const flagColors = c.code ? await getFlagColors(c.code) : [];
    merged.push({
      code: c.code,
      name: c.name,
      capital: c.capital,
      continent: regionToContinent(c.region, c.subregion),
      population: c.population,
      flagColors,
      nationalBird: titleCase(birds[key] ?? "Unknown"),
      nationalFlower: titleCase(flowers[key] ?? "Unknown"),
      nationalDish: titleCase(dishes[key] ?? "Unknown"),
      nationalAnimal: titleCase(animals[key] ?? "Unknown"),
    });
  }

  merged.sort((a, b) => a.name.localeCompare(b.name));

  // Quick coverage report.
  const stats = {
    total: merged.length,
    missingBird: merged.filter((c) => c.nationalBird === "Unknown").length,
    missingFlower: merged.filter((c) => c.nationalFlower === "Unknown").length,
    missingDish: merged.filter((c) => c.nationalDish === "Unknown").length,
    missingAnimal: merged.filter((c) => c.nationalAnimal === "Unknown").length,
    missingFlagColors: merged.filter((c) => c.flagColors.length === 0).length,
  };
  console.log("\nCoverage:", stats);

  writeFileSync(OUTFILE, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log(`\nWrote ${merged.length} countries → ${OUTFILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
