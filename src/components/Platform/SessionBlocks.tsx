import { useMemo, useState } from "react";
import type { LearningCategory, ExerciseMode } from "@/lib/learning/types";
import { cn } from "@/lib/utils";
import { Sparkles, PencilLine, Volume2, Target, Hand, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type BlockDef = {
  key: ExerciseMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const blocksByCategory: Record<LearningCategory, BlockDef[]> = {
  vogais: [
    { key: "texto", label: "Escrita", icon: PencilLine },
    { key: "escuta", label: "Escuta", icon: Volume2 },
    { key: "caça-palavras", label: "Caça Palavras", icon: Target },
    { key: "arrastar", label: "Arraste", icon: Hand },
  ],

  silabas: [
    { key: "texto", label: "Escrita", icon: PencilLine },
    { key: "escuta", label: "Escuta", icon: Volume2 },
    { key: "caça-palavras", label: "Caça Palavras", icon: Target },
    { key: "arrastar", label: "Arraste", icon: Hand },
  ],

  palavras: [
    { key: "texto", label: "Escrita", icon: PencilLine },
    { key: "escuta", label: "Escuta", icon: Volume2 },
    { key: "caça-palavras", label: "Caça Palavras", icon: Target },
    { key: "arrastar", label: "Arraste", icon: Hand },
  ],

  frases: [
    { key: "texto", label: "Escrita", icon: PencilLine },
    { key: "escuta", label: "Escuta", icon: Volume2 },
    { key: "caça-palavras", label: "Caça Palavras", icon: Target },
    { key: "arrastar", label: "Arraste", icon: Hand },
  ],
};


export default function SessionBlocks({
  category,
  onPickMode,
}: {
  category: LearningCategory;
  onPickMode: (mode: ExerciseMode) => void;
}) {
  const blocks = useMemo(() => blocksByCategory[category], [category]);
  const [active, setActive] = useState<ExerciseMode>("texto");

  return (
    <div className="rounded-[1.75rem] bg-card border border-border p-4 md:p-6 shadow-wine">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Sessões
          </div>
          <h3 className="mt-3 font-display text-2xl md:text-3xl text-primary">Escolha um tipo de atividade</h3>
        </div>

        <div className="text-sm text-muted-foreground">
          Toque para abrir o exercício
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {blocks.map((b) => {
          const Icon = b.icon;
          const isActive = active === b.key;
          return (
            <Button
              key={b.label + b.key}
              type="button"
              variant={isActive ? "default" : "secondary"}
              className={cn(
                "h-16 justify-start gap-3 rounded-2xl px-4 font-semibold",
                isActive && "shadow-playful"
              )}
              onClick={() => {
                setActive(b.key);
                onPickMode(b.key);
              }}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm">{b.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

