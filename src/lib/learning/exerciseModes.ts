// Auxiliar para embaralhar
const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const buildWordSearchGrid = (fullPhrase: string, targetToken?: string) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const size = 10;

  if (!fullPhrase) return { grid: [], size, token: "", fullPhrase: "" };

  // Prioriza o token que vem do motor (engine.ts)
  const selectedWord = targetToken 
    ? targetToken.toUpperCase().replace(/[.,!?;]/g, "")
    : fullPhrase.split(" ")[0].toUpperCase().replace(/[.,!?;]/g, "");

  let grid = Array.from({ length: size }, () => Array(size).fill(''));

  const startR = Math.floor(Math.random() * size);
  const startC = Math.floor(Math.random() * (size - selectedWord.length));

  for (let i = 0; i < selectedWord.length; i++) {
    grid[startR][startC + i] = selectedWord[i];
  }

  const finalGrid = grid.map(row => 
    row.map(char => char || alphabet[Math.floor(Math.random() * alphabet.length)])
  );

  return { 
    grid: finalGrid, 
    size, 
    token: selectedWord, 
    fullPhrase 
  };
};
export const buildDragSet = (target: string) => {
  const letters = target.toUpperCase().split("");
  return {
    items: shuffle(letters),
    token: target.toUpperCase()
  };
};

export const buildVogaisGame = (target: string) => {
  const vogaisMap: Record<string, { icon: string, label: string }> = {
    A: { icon: "🍍", label: "Abacaxi" },
    E: { icon: "🐘", label: "Elefante" },
    I: { icon: "🦎", label: "Iguana" },
    O: { icon: "🥚", label: "Ovo" },
    U: { icon: "🍇", label: "Uva" },
  };

  const current = target.toUpperCase()[0];
  const options = ["A", "E", "I", "O", "U"].map(v => ({
    char: v,
    ...vogaisMap[v],
    isCorrect: v === current
  }));

  return {
    correct: vogaisMap[current],
    options: options.sort(() => Math.random() - 0.5)
  };
};