import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Volume2 } from "lucide-react";
import type { ExercisePrompt } from "@/lib/learning/types"; // Ajustado para o caminho correto de tipos
import { cn } from "@/lib/utils";
import { ArrastarUI, CacaPalavrasUI, VogaisInterativoUI, CaligrafiaUI } from "@/components/Platform/ExerciseModeUIs";
const normalizeForSpeech = (s: string) => s.trim();

export default function ExerciseCard(props: {
  prompt: ExercisePrompt;
  expectedAnswer: string;
  userAnswer: string;
  onChangeAnswer: (v: string) => void;
  onSubmit: () => void;
  result: "idle" | "acerto" | "erro";
  timeMs: number;
  onReplayAudio?: () => void;
  disabled?: boolean;
}) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [moveCount, setMoveCount] = useState(0);

  useEffect(() => {
    setStartedAt(Date.now());
  }, [props.prompt.id]);

  // Texto de instrução dinâmico para evitar confusão (ex: não falar "arraste" em vogais)
  const instructionText = useMemo(() => {
    if (props.prompt.category === "vogais") return "Escolha a figura correta";
    if (props.prompt.mode === "caça-palavras") return "Encontre a palavra no quadro";
    if (props.prompt.mode === "arrastar") return "Coloque as letras na ordem certa";
    return "Digite a resposta e toque em “Conferir”";
  }, [props.prompt.category, props.prompt.mode]);

  const timeLabel = useMemo(() => {
    if (!startedAt) return "0s";
    if (props.disabled) return "";
    return props.timeMs ? `${Math.round(props.timeMs / 1000)}s` : "";
  }, [props.timeMs, props.disabled, startedAt]);

  const speak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const text = normalizeForSpeech(props.expectedAnswer);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "pt-BR";
    u.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  const recordAndFill = async () => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "pt-BR";
    recognition.onresult = (event: any) => {
      const transcript = event?.results?.[0]?.[0]?.transcript;
      if (typeof transcript === "string") props.onChangeAnswer(transcript);
    };
    recognition.start();
  };

  return (
    <div className="rounded-[1.75rem] bg-card border border-border shadow-wine p-6 md:p-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            <span>{props.prompt.category}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-4xl text-primary">
            {props.prompt.question}
          </h1>

          {props.prompt?.category === "frases" && props.prompt?.mode === "caça-palavras" && props.prompt?.question && (() => {
            // Esta UI usa `expectedAnswer` como frase inteira e destaca a palavra-alvo em vermelho.
            const phrase = props.expectedAnswer;
            const target = props.prompt.answer; // palavra normalizada (sem acento/minúscula)

            // tenta localizar a palavra-alvo na frase original, ignorando case/acentos
            const normalizedPhrase = phrase
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "");

            const normalizedTarget = target;
            const parts = phrase.split(/(\s+)/); // preserva espaços

            let found = false;
            return (
              <div className="mt-4 rounded-2xl bg-secondary/20 border border-border p-4">
                <div className="text-sm font-semibold text-accent">Frase para ler</div>
                <div className="mt-2 font-display text-2xl text-primary leading-tight">
                  {parts.map((part, i) => {
                    const n = part
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/\p{Diacritic}/gu, "");
                    const isTarget = !found && n === normalizedTarget && n.length > 0;
                    if (isTarget) found = true;
                    return (
                      <span key={i} className={isTarget ? "text-red-500 font-bold" : undefined}>
                        {part}
                      </span>
                    );
                  })}
                </div>

                {/* narração completa (texto completo) */}
                <div className="mt-2 text-sm text-muted-foreground">Ouvir: clique em “Ouvir”</div>
              </div>
            );
          })()}


          {props.prompt?.category === "frases" && props.prompt?.question?.toLowerCase().includes("leia") && (
            <div className="mt-4 rounded-2xl bg-secondary/20 border border-border p-4">
              <div className="text-sm font-semibold text-accent">Frase para ler</div>
              <div className="mt-2 font-display text-2xl text-primary leading-tight">{props.expectedAnswer}</div>
            </div>
          )}

          <p className="mt-2 text-muted-foreground">{instructionText}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={props.onReplayAudio ?? speak}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors"
          >
            <Volume2 className="h-4 w-4" /> Ouvir
          </button>

          {props.prompt?.question?.toLowerCase().includes("leia") && (
            <button
              type="button"
              onClick={recordAndFill}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20 transition-colors"
            >
              🎙️ Falar
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {/* Lógica de Renderização de UI Dinâmica */}
       {props.prompt.mode === "texto" ? (
  <CaligrafiaUI
    prompt={{
      ...props.prompt,
      // Se for frase, pegamos a palavra-alvo (token) que o engine já sorteou.
      // Caso contrário, usamos o answer padrão.
      phraseContext: props.prompt.category === "frases" 
        ? (props.prompt.extra?.token || props.prompt.answer)
        : props.prompt.answer
    }}
    onChangeAnswer={props.onChangeAnswer}
    disabled={props.disabled}
  />
) : props.prompt.category === "vogais" ? (
  <VogaisInterativoUI
    prompt={props.prompt}
    onChangeAnswer={props.onChangeAnswer}
    disabled={props.disabled}
  />
) : props.prompt.mode === "caça-palavras" ? ( // Corrigido de && para ?
  <CacaPalavrasUI
    prompt={{
      ...props.prompt,
      // Prioriza a frase (prompt) sobre a palavra única (answer)
      phraseContext: props.prompt.prompt || props.prompt.answer
    }}
    onChangeAnswer={props.onChangeAnswer}
    disabled={props.disabled}
  />
) : props.prompt.mode === "arrastar" ? (
  <ArrastarUI
    prompt={props.prompt}
    disabled={props.disabled}
    onChangeAnswer={props.onChangeAnswer}
  />
) : (
  <div className="rounded-2xl bg-secondary/40 border border-border p-4">
    <label className="text-sm font-semibold text-primary">Resposta</label>
    <input
      value={props.userAnswer}
      onChange={(e) => props.onChangeAnswer(e.target.value)}
      disabled={props.disabled}
      className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xl font-display focus:outline-none focus:ring-2 focus:ring-accent/40"
      autoComplete="off"
    />
  </div>
)}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-4">
        
<button 
  // Usa o props.disabled que o TypeScript confirmou que existe
  disabled={props.disabled} 
  
  // SOLUÇÃO DO ERRO: Troquei o que estava antes por props.onSubmit
  onClick={props.onSubmit} 
  
  className={cn(
    props.prompt.mode === "texto"
      ? "mx-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-xl transition-all duration-300 bg-emerald-500 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-600 hover:scale-105 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed disabled:border-2 disabled:border-slate-200/60 disabled:shadow-none"
      : "mt-4 px-8 py-3 rounded-full font-bold transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed bg-green-500 text-white shadow-lg hover:scale-105"
  )}
>
  Terminei! ✨
</button>

          <div className="flex items-center gap-2">
            {props.result === "acerto" && (
              <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold animate-bounce">
                <CheckCircle2 className="h-5 w-5" /> Acertou!
              </span>
            )}
            {props.result === "erro" && (
              <span className="inline-flex items-center gap-2 text-destructive font-semibold animate-shake">
                <XCircle className="h-5 w-5" /> Quase lá!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}