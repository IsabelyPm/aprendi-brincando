export type LearningCategory = "vogais" | "silabas" | "palavras" | "frases";

// Tipos de atividade (dentro da mesma categoria/rota)
export type ExerciseMode = 
  | "texto" 
  | "escuta" 
  | "fala" 
  | "caça-palavras" 
  | "arrastar" 
  | "quebra-cabeça";



export type LearningAnswerResult = "acerto" | "erro";

export type ProgressEvent = {
  id: string;
  category: LearningCategory;
  createdAt: number; // epoch ms
  prompt: string;
  answer: string;
  isCorrect: boolean;
  timeMs: number;
};

export type CategoryProgress = {
  completedAttempts: number;
  correctAttempts: number;
  streak: number;
  bestStreak: number;
  totalTimeMs: number;
  xp: number;
};

export type PlatformProgressState = {
  version: number;
  totalXp: number;
  bestSessionTotalXp: number;
  categories: Record<LearningCategory, CategoryProgress>;
  events: ProgressEvent[]; // pequeno histórico para dashboard
};

export interface ExercisePrompt {
 id: string;
  mode: any;               // Evita quebra por string literal (ExerciseMode)
  category: any;           // Aceita tanto ExerciseKind quanto LearningCategory
  prompt: string;          // O comando textual obrigatório
  answer: string;          // A resposta para conferência obrigatória
  question?: string;       // Opcional para não quebrar onde chamam por question
  displayValue?: string;   // Opcional
  hint?: string;           // Opcional
  extra?: Record<string, any>;
}