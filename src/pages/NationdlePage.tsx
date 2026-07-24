import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import countriesData from "../data/countries.json";
import "./Nationdle.css";

type Country = {
  code: string;
  name: string;
  capital: string;
  continent: string;
  population: number;
  flagColors: string[];
  nationalBird: string;
  nationalFlower: string;
  nationalDish: string;
  nationalAnimal: string;
};

const COUNTRIES = countriesData as Country[];
const MAX_GUESSES = 7;

const HINT_LABELS = [
  "National Bird",
  "National Flower",
  "National Dish",
  "National Animal",
  "Flag Colors",
  "Continent & Population",
  "Capital City",
];

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function epochDay(): number {
  const d = new Date();
  const localMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor(localMidnight.getTime() / 86_400_000);
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hintCount(c: Country): number {
  let n = 0;
  if (c.nationalBird && c.nationalBird !== "Unknown") n++;
  if (c.nationalFlower && c.nationalFlower !== "Unknown") n++;
  if (c.nationalDish && c.nationalDish !== "Unknown") n++;
  if (c.nationalAnimal && c.nationalAnimal !== "Unknown") n++;
  if (c.flagColors && c.flagColors.length > 0) n++;
  if (c.continent && c.continent !== "Unknown") n++;
  if (c.capital && c.capital !== "Unknown") n++;
  return n;
}

function shuffledOrder(pool: Country[]): Country[] {
  const rng = mulberry32(0xc0ffee);
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const PLAYABLE = COUNTRIES.filter((c) => hintCount(c) >= 5);

function pickCountryOfTheDay(): Country {
  const order = shuffledOrder(PLAYABLE);
  return order[epochDay() % order.length];
}

function formatPopulationRange(pop: number): string {
  if (pop < 1_000_000) return "Under 1 million";
  if (pop < 10_000_000) return "1–10 million";
  if (pop < 50_000_000) return "10–50 million";
  if (pop < 100_000_000) return "50–100 million";
  if (pop < 500_000_000) return "100–500 million";
  return "Over 500 million";
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

type GameState = {
  guesses: string[];
  status: "playing" | "won" | "lost";
};

function loadState(date: string): GameState {
  try {
    const raw = localStorage.getItem(`nationdle:${date}`);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { guesses: [], status: "playing" };
}

function saveState(date: string, state: GameState) {
  try {
    localStorage.setItem(`nationdle:${date}`, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const NationdlePage = () => {
  const date = todayKey();
  const country = useMemo(pickCountryOfTheDay, []);
  const [state, setState] = useState<GameState>(() => loadState(date));
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    saveState(date, state);
  }, [date, state]);

  const hintsUnlocked = Math.min(state.guesses.length + 1, HINT_LABELS.length);
  const hints = useMemo(() => {
    const all = [
      country.nationalBird,
      country.nationalFlower,
      country.nationalDish,
      country.nationalAnimal,
      "FLAG_COLORS",
      `${country.continent} • ${formatPopulationRange(country.population)}`,
      country.capital,
    ];
    return all.map((value, i) => ({
      label: HINT_LABELS[i],
      value,
      unlocked: i < hintsUnlocked || state.status !== "playing",
    }));
  }, [country, hintsUnlocked, state.status]);

  const suggestions = useMemo(() => {
    if (!input.trim()) return [];
    const q = normalize(input);
    return COUNTRIES.filter((c) => normalize(c.name).includes(q))
      .filter((c) => !state.guesses.includes(c.name))
      .slice(0, 6);
  }, [input, state.guesses]);

  const submitGuess = (rawGuess: string) => {
    if (state.status !== "playing") return;
    const match = COUNTRIES.find(
      (c) => normalize(c.name) === normalize(rawGuess)
    );
    if (!match) return;
    if (state.guesses.includes(match.name)) return;

    const nextGuesses = [...state.guesses, match.name];
    let nextStatus: GameState["status"] = "playing";
    if (normalize(match.name) === normalize(country.name)) {
      nextStatus = "won";
    } else if (nextGuesses.length >= MAX_GUESSES) {
      nextStatus = "lost";
    }
    setState({ guesses: nextGuesses, status: nextStatus });
    setInput("");
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      submitGuess(suggestions[0].name);
    } else if (input.trim()) {
      submitGuess(input.trim());
    }
  };

  const remaining = MAX_GUESSES - state.guesses.length;

  return (
    <motion.div
      className="nationdle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="nationdle__bg" />

      <header className="nationdle__header">
        <Link to="/" className="nationdle__back" aria-label="Back to portfolio">
          <span className="nationdle__back-arrow">←</span>
          <span>Back to Portfolio</span>
        </Link>
        <div className="nationdle__date">{date}</div>
      </header>

      <main className="nationdle__main">
        <motion.div
          className="nationdle__title-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="nationdle__label">Daily Game</span>
          <h1 className="nationdle__title">Nationdle</h1>
          <p className="nationdle__subtitle">
            Guess today's country. Each wrong guess unlocks another hint.
          </p>
        </motion.div>

        <motion.section
          className="nationdle__hints glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="nationdle__hints-title">Hints</h2>
          <ul className="nationdle__hints-list">
            {hints.map((h, i) => (
              <li
                key={h.label}
                className={`nationdle__hint ${h.unlocked ? "is-unlocked" : "is-locked"}`}
              >
                <span className="nationdle__hint-num">{i + 1}</span>
                <div className="nationdle__hint-body">
                  <div className="nationdle__hint-label">{h.label}</div>
                  <AnimatePresence mode="wait">
                    {h.unlocked ? (
                      <motion.div
                        key="value"
                        className="nationdle__hint-value"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {h.value === "FLAG_COLORS" ? (
                          <div className="nationdle__flag-colors">
                            {[...new Set(country.flagColors)].map((hex, idx) => (
                              <span
                                key={idx}
                                className="nationdle__flag-swatch"
                                style={{ background: hex }}
                                title={hex}
                              />
                            ))}
                          </div>
                        ) : h.value === "Unknown" ? (
                          <span className="nationdle__hint-unknown">— no official symbol —</span>
                        ) : (
                          h.value
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="locked"
                        className="nationdle__hint-locked"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        Locked — keep guessing
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            ))}
          </ul>
        </motion.section>

        {state.status === "playing" && (
          <motion.section
            className="nationdle__guess-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form className="nationdle__form" onSubmit={handleSubmit} autoComplete="off">
              <div className="nationdle__input-wrap">
                <input
                  type="text"
                  className="nationdle__input"
                  placeholder={`Type a country name… (${remaining} guess${remaining === 1 ? "" : "es"} left)`}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="nationdle__suggestions">
                    {suggestions.map((s) => (
                      <li
                        key={s.code}
                        className="nationdle__suggestion"
                        onMouseDown={() => submitGuess(s.name)}
                      >
                        {s.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="btn btn--primary nationdle__submit">
                Guess
              </button>
            </form>
          </motion.section>
        )}

        {state.guesses.length > 0 && (
          <motion.section
            className="nationdle__history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="nationdle__history-title">Your Guesses</h3>
            <ul className="nationdle__history-list">
              {state.guesses.map((g, i) => {
                const correct = normalize(g) === normalize(country.name);
                return (
                  <li
                    key={i}
                    className={`nationdle__history-item ${correct ? "is-correct" : "is-wrong"}`}
                  >
                    <span className="nationdle__history-mark">{correct ? "✓" : "✕"}</span>
                    <span>{g}</span>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        )}

        {state.status !== "playing" && (
          <motion.section
            className={`nationdle__result glass-card ${state.status === "won" ? "is-won" : "is-lost"}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="nationdle__result-headline">
              {state.status === "won" ? "Nice — you got it!" : "Out of guesses."}
            </div>
            <div className="nationdle__result-answer">
              Today's country was <strong>{country.name}</strong>.
            </div>
            <div className="nationdle__result-meta">
              {state.status === "won"
                ? `Solved in ${state.guesses.length} guess${state.guesses.length === 1 ? "" : "es"}.`
                : "Come back tomorrow for a new country."}
            </div>
          </motion.section>
        )}
      </main>
    </motion.div>
  );
};

export default NationdlePage;
