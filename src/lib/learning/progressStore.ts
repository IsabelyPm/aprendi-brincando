import type { CategoryProgress, LearningCategory, PlatformProgressState } from "./types";

const STORAGE_KEY = "aprendi-brincando:platformProgress:v1";

const emptyCategoryProgress = (): CategoryProgress => ({
  completedAttempts: 0,
  correctAttempts: 0,
  streak: 0,
  bestStreak: 0,
  totalTimeMs: 0,
  xp: 0,
});

export const getDefaultPlatformProgressState = (): PlatformProgressState => {
  const categories: Record<LearningCategory, CategoryProgress> = {
    vogais: emptyCategoryProgress(),
    silabas: emptyCategoryProgress(),
    palavras: emptyCategoryProgress(),
    frases: emptyCategoryProgress(),
  };

  return {
    version: 1,
    totalXp: 0,
    bestSessionTotalXp: 0,
    categories,
    events: [],
  };
};

const safeParse = (raw: string | null): PlatformProgressState | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as PlatformProgressState;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.version) return null;
    if (!parsed.categories) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const loadPlatformProgress = (): PlatformProgressState => {
  if (typeof window === "undefined") return getDefaultPlatformProgressState();
  const parsed = safeParse(window.localStorage.getItem(STORAGE_KEY));
  return parsed ?? getDefaultPlatformProgressState();
};

export const savePlatformProgress = (state: PlatformProgressState) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const computeAccuracy = (cat: CategoryProgress) => {
  if (cat.completedAttempts <= 0) return 0;
  return cat.correctAttempts / cat.completedAttempts;
};

