import type { LearningAnswerResult, LearningCategory, PlatformProgressState, ProgressEvent } from "./types";

export type ExerciseKind = LearningCategory;

export type ExercisePrompt = {
  id: string;
  category: ExerciseKind;
  mode: import("./types").ExerciseMode;
  prompt: string; // texto mostrado
  answer: string; // resposta correta (string normalizada)
  // opcional para UI
  hint?: string;
  displayValue?: string; // Opcional, para casos específicos
  extra?: Record<string, any>;
};


export type AnswerEvaluation = {
  result: LearningAnswerResult;
  isCorrect: boolean;
  normalizedAnswer: string;
  timeMs: number;
  xpEarned: number;
  streakDelta: number;
};

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

// Motor simples e determinístico: gera prompts a partir de um conjunto fixo.
// (Quando quiser, podemos evoluir para algoritmos de adaptação por nível.)
const vowelSet = ["a", "e", "i", "o", "u"];
const syllables = ["ba", "be", "bi", "bo", "bu", "ca", "ce", "ci", "co", "cu", "pa", "pe", "pi", "po", "pu", "ma", "me", "mi", "mo", "mu"];
const words = ["bola", "casa", "pato", "maca", "sapo", "pipa", "tato", "moto", "faca", "coco"];
// Frases com variação: algumas devem ser "leia" e outras "ouça"
const phrases = ["A bola é azul", "Eu vi a casa", "O pato pula", "A maca é doce", "Eu gosto de sopa"];
const phraseModes: Array<"leia" | "ouça"> = ["leia", "ouça", "leia", "ouça", "leia", "ouça"];


const pickByProgress = (category: LearningCategory, index: number) => {
  switch (category) {
    case "vogais":
      return vowelSet[index % vowelSet.length];
    case "silabas":
      return syllables[index % syllables.length];
    case "palavras":
      return words[index % words.length];
    case "frases":
      return phrases[index % phrases.length];
  }
};

// prompts extras para diversificar a UI
const wordPrompts = ["Agora é palavra:", "Vamos praticar a palavra:", "Digite a palavra que você ouvir:"];

const promptByCategory = (category: LearningCategory, nextIndex: number) => {
  switch (category) {
    case "vogais":
      return "Qual é a vogal?";
    case "silabas":
      return "Complete a sílaba (som):";
    case "palavras":
      return wordPrompts[nextIndex % wordPrompts.length];
    case "frases": {
      const mode = phraseModes[nextIndex % phraseModes.length];
      return mode === "leia" ? "Leia a frase e digite" : "Ouça a frase e escreva";
    }
  }
};




export const generateNextExercise = (
  state: PlatformProgressState,
  category: ExerciseKind,
  mode?: import("./types").ExerciseMode,
): ExercisePrompt => {
  const catProgress = state.categories[category];
  const nextIndex = catProgress.completedAttempts; // avança conforme tentativas

  const modeForThisAttempt: import("./types").ExerciseMode =
    mode ?? (nextIndex % 5 === 1 ? "escuta" : nextIndex % 5 === 2 ? "caça-palavras" : nextIndex % 5 === 3 ? "arrastar" : "texto");



  const raw = pickByProgress(category, nextIndex);


  const id = `${category}:${catProgress.completedAttempts}:${raw}`;

  if (category === "vogais") {
    const letter = raw;

    // Força o prompt de UI de acordo com o modo
    const promptText =
      modeForThisAttempt === "texto"
        ? "Qual é a vogal?"
        : modeForThisAttempt === "escuta"
          ? "Escute e repita: qual é a vogal?"
          : modeForThisAttempt === "caça-palavras"
            ? "Encontre a vogal no quadro"
            : "Arraste para montar a vogal";

    return {
      id,
      category,
      mode: modeForThisAttempt,
      prompt: promptText,
      answer: normalize(letter),
      hint: `Diga: ${letter.toUpperCase()}`,
      extra: {
        token: letter.toUpperCase(),
      },
    };
  }


  if (category === "silabas") {
    const syl = raw;

    const promptText =
      modeForThisAttempt === "texto"
        ? "Complete a sílaba (som):"
        : modeForThisAttempt === "escuta"
          ? "Escute e repita: complete a sílaba"
          : modeForThisAttempt === "caça-palavras"
            ? "Encontre a sílaba no quadro"
            : "Arraste para montar a sílaba";

    return {
      id,
      category,
      mode: modeForThisAttempt,
      prompt: promptText,
      answer: normalize(syl),
      hint: `Sílaba: ${syl.toUpperCase()}`,
      extra: {
        token: syl.toUpperCase(),
      },
    };
  }



  if (category === "palavras") {
    const w = raw;
    const uiPromptBase = promptByCategory("palavras", nextIndex) as string;

    const promptText =
      modeForThisAttempt === "texto"
        ? uiPromptBase
        : modeForThisAttempt === "escuta"
          ? "Escute e repita: qual é a palavra?"
          : modeForThisAttempt === "caça-palavras"
            ? "Encontre a palavra no quadro"
            : "Arraste para montar a palavra";

    return {
      id,
      category,
      mode: modeForThisAttempt,
      prompt: promptText,
      answer: normalize(w),
      hint: `Palavra: ${w.toUpperCase()}`,
      extra: {
        token: w.toUpperCase(),
      },
    };
  }


  // frases
  if (category === "frases") {
    const phrase = raw;
    const uiPromptBase = promptByCategory("frases", nextIndex) as string;

    // Para o modo “caça-palavras” em Frases: resposta vira apenas 1 palavra aleatória da frase.
    const phraseWords = phrase.split(/\s+/).filter(Boolean);
    const targetWord = phraseWords.length > 0 ? phraseWords[nextIndex % phraseWords.length] : phrase;

    // AJUSTE AQUI: No modo caça-palavras, incluímos a frase no promptText 
    // para que a UI tenha o que exibir e falar!
    const promptText =
      modeForThisAttempt === "texto"
        ? uiPromptBase
        : modeForThisAttempt === "escuta"
          ? "Escute e diga/repita a frase"
          : modeForThisAttempt === "caça-palavras"
            ? `Encontre a palavra na frase: ${phrase}` // Adicionamos a frase aqui!
            : "Arraste palavras para montar a frase";

    // Para “caça-palavras”: a 'answer' é a palavra que a criança deve clicar,
    // mas a frase completa agora viaja dentro do 'prompt'.
    const answerToken = modeForThisAttempt === "caça-palavras" ? targetWord : phrase;

    return {
      id,
      category,
      mode: modeForThisAttempt,
      prompt: modeForThisAttempt === "caça-palavras" ? phrase : promptText, // Se for caça-palavras, priorizamos a frase pura
      answer: normalize(answerToken),
      hint: `Frase: ${phrase.toUpperCase()}`,
      extra: {
        token: answerToken,
        phrase,
        tokenFromPhrase: answerToken,
        originalInstruction: promptText // Guardamos a instrução se precisar
      },
    };
  }

};

export const evaluateAnswer = (args: {
  prompt: ExercisePrompt;
  userAnswer: string;
  timeMs: number;
}): AnswerEvaluation => {
  const normalizedUser = normalize(args.userAnswer);
  const normalizedAnswer = normalize(args.prompt.answer);
  const isCorrect = normalizedUser === normalizedAnswer;

  // XP simples: acerto vale mais se rápido (cap).
  const seconds = Math.max(0.001, args.timeMs / 1000);
  const speedBonus = Math.round(clamp(1 / seconds, 0, 2) * 10); // 0..20-ish
  const base = 20;
  const xpEarned = isCorrect ? base + speedBonus : 0;

  return {
    result: isCorrect ? "acerto" : "erro",
    isCorrect,
    normalizedAnswer,
    timeMs: args.timeMs,
    xpEarned,
    streakDelta: isCorrect ? 1 : -1,
  };
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const applyEvaluationToProgress = (state: PlatformProgressState, args: {
  prompt: ExercisePrompt;
  evaluation: AnswerEvaluation;
}): PlatformProgressState => {
  const { prompt, evaluation } = args;
  const now = Date.now();

  const prevCat = state.categories[prompt.category];

  const updatedCat: typeof prevCat = {
    ...prevCat,
    completedAttempts: prevCat.completedAttempts + 1,
    correctAttempts: prevCat.correctAttempts + (evaluation.isCorrect ? 1 : 0),
    streak: evaluation.isCorrect ? prevCat.streak + 1 : 0,
    bestStreak: evaluation.isCorrect ? Math.max(prevCat.bestStreak, prevCat.streak + 1) : prevCat.bestStreak,
    totalTimeMs: prevCat.totalTimeMs + evaluation.timeMs,
    xp: prevCat.xp + evaluation.xpEarned,
  };

  const updatedTotalXp = state.totalXp + evaluation.xpEarned;

  const progressEvent: ProgressEvent = {
    id: `${prompt.id}:${now}`,
    category: prompt.category,
    createdAt: now,
    prompt: prompt.prompt,
    answer: prompt.answer,
    isCorrect: evaluation.isCorrect,
    timeMs: evaluation.timeMs,
  };

  const next: PlatformProgressState = {
    ...state,
    totalXp: updatedTotalXp,
    categories: {
      ...state.categories,
      [prompt.category]: updatedCat,
    },
    events: [progressEvent, ...state.events].slice(0, 50),
  };

  return next;
};

