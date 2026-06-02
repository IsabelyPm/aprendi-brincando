import { useEffect, useMemo, useState } from "react";
import { Sparkles, TrendingUp, Flame, Zap } from "lucide-react";
import PlatformShell from "@/components/Platform/PlatformShell";
import { ProgressRing } from "@/components/ProgressRing";


import { loadPlatformProgress, computeAccuracy } from "@/lib/learning/progressStore";
import type { LearningCategory, PlatformProgressState } from "@/lib/learning/types";

const categoriesOrder: LearningCategory[] = ["vogais", "silabas", "palavras", "frases"];
const labels: Record<LearningCategory, string> = {
  vogais: "Vogais",
  silabas: "Sílabas",
  palavras: "Palavras",
  frases: "Frases",
};

const ringValue = (catProgress: PlatformProgressState["categories"][LearningCategory]) => {
  // valor de 0..100 baseado em acurácia
  const acc = computeAccuracy(catProgress);
  return Math.round(acc * 100);
};

export default function Dashboard() {
  const [state, setState] = useState<PlatformProgressState>(() => loadPlatformProgress());

  useEffect(() => {
    const onStorage = () => setState(loadPlatformProgress());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const bestStreak = useMemo(() => {
    return Math.max(...categoriesOrder.map((c) => state.categories[c].bestStreak));
  }, [state.categories]);

  const totalAttempts = useMemo(() => {
    return categoriesOrder.reduce((sum, c) => sum + state.categories[c].completedAttempts, 0);
  }, [state.categories]);

  return (
    <PlatformShell>
      <div className="grid gap-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-4 w-4" /> Dashboard da Criança
          </div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-primary">Seu progresso em jogo!</h2>
          <p className="mt-3 text-muted-foreground">Veja como suas escolhas viraram aprendizagem.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-[1.5rem] bg-card border border-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">XP total</span>
              <Zap className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-2 font-display text-4xl text-primary">{state.totalXp.toLocaleString("pt-BR")}</div>
            <div className="mt-1 text-xs text-muted-foreground">pontos mágicos</div>
          </div>

          <div className="rounded-[1.5rem] bg-card border border-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Acertos</span>
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-2 font-display text-4xl text-primary">
              {categoriesOrder
                .reduce((sum, c) => sum + state.categories[c].correctAttempts, 0)
                .toLocaleString("pt-BR")}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">tentativas certas</div>
          </div>

          <div className="rounded-[1.5rem] bg-card border border-border p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Melhor sequência</span>
              <Flame className="h-5 w-5 text-accent" />
            </div>
            <div className="mt-2 font-display text-4xl text-primary">{bestStreak}</div>
            <div className="mt-1 text-xs text-muted-foreground">acertos seguidos</div>
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-card border border-border p-6">
          <h3 className="font-display text-2xl text-primary">Acurácia por habilidade</h3>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesOrder.map((cat) => (
              <ProgressRing value={ringValue(state.categories[cat])} label={labels[cat]} color="coral" />
            ))}

          </div>

          <div className="mt-6 text-sm text-muted-foreground">
            {totalAttempts} tentativas concluídas até agora.
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-secondary/30 border border-border p-6">
          <h3 className="font-display text-2xl text-primary">Próxima missão</h3>
          <p className="mt-2 text-muted-foreground">
            Escolha uma categoria para começar: vogais, sílabas, palavras ou frases.
          </p>
        </div>
      </div>
    </PlatformShell>
  );
}

