import { loadPlatformProgress } from "./progressStore";

const SESSION_KEY = "aprendi-brincando:bestSessionXp:v1";

export const getBestSessionTotalXp = () => {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
};

export const setBestSessionTotalXp = (value: number) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, String(value));
};

// Ainda simples: "sessão" é apenas uma sequência de acertos enquanto a página está aberta.
export const createSessionTracker = () => {
  const state = loadPlatformProgress();
  let totalXpThisSession = 0;
  const startTime = Date.now();

  return {
    get totalXp() {
      return totalXpThisSession;
    },
    get startTime() {
      return startTime;
    },
    addXp(amount: number) {
      totalXpThisSession += Math.max(0, amount);
    },
    finalize() {
      const prevBest = getBestSessionTotalXp();
      const best = Math.max(prevBest, totalXpThisSession);
      setBestSessionTotalXp(best);
      // também salva no state consolidado
      return best;
    },
  };
};

