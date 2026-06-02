import type { LearningCategory } from "./types";

export type ModeUiModel = {
  options: string[];
  answerToken: string;
};

export const buildModeUiModel = (args: {
  category: LearningCategory;
  promptAnswer: string;
}): ModeUiModel => {
  return {
    // UI vai embaralhar/organizar localmente
    options: [args.promptAnswer],
    answerToken: args.promptAnswer,
  };
};

