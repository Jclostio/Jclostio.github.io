// Quick diagnostic: which country names appear in geocountries tables but NOT in REST Countries?
// And vice versa? Helps tune the alias map.

import { readFileSync } from "node:fs";
import { load } from "cheerio";

const UA = "NationdlePortfolioBuild/1.0 (diagnostic)";

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

async function fetchText(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  return r.text();
}

async function scrapeBirdTable() {
  const html = await fetchText("https://www.geocountries.com/country/national/birds");
  const $ = load(html);
  const names = [];
  $("table tr").each((_, tr) => {
    const cells = $(tr).find("td");
    if (cells.length < 2) return;
    const country = $(cells[0]).text().trim();
    if (country && !/scientific/i.test(country)) names.push(country);
  });
  return names;
}

const ours = JSON.parse(readFileSync("src/data/countries.json", "utf8"));
const ourSet = new Set(ours.map((c) => normalize(c.name)));

const birdRows = await scrapeBirdTable();
console.log(`geocountries bird rows: ${birdRows.length}`);
const unmatched = birdRows.filter((n) => !ourSet.has(normalize(n)));
console.log(`Unmatched (${unmatched.length}):`);
for (const n of unmatched) console.log("  geo:", JSON.stringify(n), "→ norm:", normalize(n));
