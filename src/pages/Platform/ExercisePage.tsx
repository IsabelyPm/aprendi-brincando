import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlatformShell from "@/components/Platform/PlatformShell";
import ExerciseCard from "@/components/Platform/ExerciseCard";
import SessionBlocks from "@/components/Platform/SessionBlocks";
import type { ExerciseMode, LearningCategory } from "@/lib/learning/types";


import { generateNextExercise, evaluateAnswer, applyEvaluationToProgress } from "@/lib/learning/engine";
import { loadPlatformProgress, savePlatformProgress } from "@/lib/learning/progressStore";
import { useToast } from "@/hooks/use-toast";

const categoryFromParam = (p?: string): LearningCategory => {
  const val = String(p ?? "");
  if (val === "vogais" || val === "silabas" || val === "palavras" || val === "frases") return val;
  return "vogais";
};

export default function ExercisePage({ forcedCategory }: { forcedCategory?: LearningCategory }) {
  const { category } = useParams();
  const navigate = useNavigate();
  const cat = forcedCategory ?? categoryFromParam(category);


  const { toast } = useToast();

  const [state, setState] = useState(() => loadPlatformProgress());
  const [mode, setMode] = useState<ExerciseMode>("texto");
  const [prompt, setPrompt] = useState(() => generateNextExercise(state, cat, "texto"));



  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<"idle" | "acerto" | "erro">("idle");
  const [disabled, setDisabled] = useState(false);
  const [timeMs, setTimeMs] = useState(0);

  useEffect(() => {
    setState(loadPlatformProgress());
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!disabled && result === "idle") {
        // aproxima tempo com base em tick (para UI)
        setTimeMs((t) => t + 250);
      }
    }, 250);
    return () => window.clearInterval(interval);
  }, [disabled, result]);

useEffect(() => {
    // 1. Gera o próximo exercício baseado no modo selecionado nos SessionBlocks
    const next = generateNextExercise(state, cat, mode);
  
    
    setPrompt(next);
    setUserAnswer("");
    setResult("idle");
    setDisabled(false);
    setTimeMs(0);
  }, [cat, mode, state.categories[cat].completedAttempts]);


  // muda o título conforme a categoria


  const expectedAnswer = useMemo(() => prompt.answer, [prompt.answer]);


  const submit = () => {
    if (disabled) return;
    const time = Math.max(250, timeMs || 500);

    const evaluation = evaluateAnswer({
      prompt,
      userAnswer,
      timeMs: time,
    });

    setDisabled(true);

    const nextState = applyEvaluationToProgress(state, { prompt, evaluation });
    // persist
    savePlatformProgress(nextState);
    setState(nextState);

    setResult(evaluation.isCorrect ? "acerto" : "erro");

    if (evaluation.isCorrect) {
      toast({
        title: `Acertou! +${evaluation.xpEarned} XP`,
        description: "Continue brincando — a próxima missão já vai aparecer.",
      });
      window.setTimeout(() => {
        setDisabled(false);
        setResult("idle");
        // re-render via completedAttempts change effect
      }, 900);
    } else {
      toast({
        title: "Quase lá!",
        description: "Ouça novamente e tente digitar com calma.",
      });
      window.setTimeout(() => {
        setDisabled(false);
        setUserAnswer("");
        setResult("idle");
        // mantém o mesmo prompt para permitir tentar de novo
        // por simplicidade, não alteramos completedAttempts/correções sem acerto
        // (o motor incrementa por tentativa; se quiser, podemos separar tentativas e acertos)
      }, 1200);
    }
  };

  if (!cat) {
    navigate("/plataforma");
    return null;
  }

  const modeTitle = prompt.mode === "texto" ? "Escrita" : prompt.mode === "caça-palavras" ? "Caça-palavras" : prompt.mode === "escuta" ? "Escuta" : "Arraste";


  return (
    <PlatformShell>
      <div className="grid gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              Categoria
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-primary">
              {cat === "vogais" ? "Vogais" : cat === "silabas" ? "Sílabas" : cat === "palavras" ? "Palavras" : "Frases"}
            </h2>

          </div>
          <div className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
            {modeTitle} · XP da categoria: {state.categories[cat].xp.toLocaleString("pt-BR")}
          </div>

        </div>

        <SessionBlocks category={cat} onPickMode={(m) => setMode(m)} />

        <div className="hidden" aria-hidden="true" />

      <ExerciseCard
          // O SEGREDO: Garantimos que o modo atual do estado seja passado
          // e passamos o prompt original.
          prompt={{ ...prompt, mode: mode }} 
          expectedAnswer={prompt.answer}
          userAnswer={userAnswer}
          onChangeAnswer={setUserAnswer}
          onSubmit={submit}
          result={result}
          timeMs={timeMs}
          disabled={disabled}
          
        />
      </div>
    </PlatformShell>
  );
}

