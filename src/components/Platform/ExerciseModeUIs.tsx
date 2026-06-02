import React, { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { buildWordSearchGrid, buildDragSet, buildVogaisGame } from "@/lib/learning/exerciseModes";


// --- CAÇA-PALAVRAS ---
export function CacaPalavrasUI({ prompt, onChangeAnswer, disabled }: any) {
  // Pegamos o token (palavra correta) vindo direto do engine.ts
  const targetFromEngine = prompt?.extra?.token;
  
  const game = useMemo(() => 
    buildWordSearchGrid(prompt.phraseContext || prompt.prompt, targetFromEngine), 
    [prompt.phraseContext, prompt.prompt, targetFromEngine]
  );

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    setSelected([]);
    onChangeAnswer("");

    // Áudio: Agora garantimos que ele leia a frase inteira sem erro
    if (game.fullPhrase) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(game.fullPhrase);
      utterance.lang = "pt-BR";
      window.speechSynthesis.speak(utterance);
    }
  }, [game.fullPhrase, onChangeAnswer]);

  const renderPhrase = () => {
    return game.fullPhrase.split(" ").map((word, i) => {
      // O destaque agora usa o mesmo token da resposta
      const isTarget = word.toUpperCase().replace(/[.,!?;]/g, "") === game.token;
      
      return (
        <span key={i} className={cn("mx-1", isTarget ? "text-[#FF3D5A] font-black underline" : "text-slate-600")}>
          {word}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full animate-in fade-in duration-700">
      {/* Box da Frase com Destaque */}
      <div className="w-full p-5 bg-white rounded-3xl border-2 border-slate-100 shadow-sm text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
          Ouça a frase e ache a palavra:
        </p>
        <div className="text-2xl md:text-3xl font-display leading-relaxed">
          {renderPhrase()}
        </div>
      </div>

      {/* Grid do Caça-Palavras */}
      <div 
        className="grid gap-2 p-3 bg-[#1A0505] rounded-[2.5rem] border-b-[12px] border-[#0a0202] shadow-2xl"
        style={{ gridTemplateColumns: `repeat(${game.size}, minmax(0, 1fr))` }}
      >
        {game.grid.map((row, r) => row.map((char, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => {
              if (disabled) return;
              const key = `${r}-${c}`;
              setSelected(prev => {
                const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key];
                const currentStr = next.map(k => {
                  const [rowIdx, colIdx] = k.split("-").map(Number);
                  return game.grid[rowIdx][colIdx];
                }).join("");
                onChangeAnswer(currentStr.toLowerCase());
                return next;
              });
            }}
            className={cn(
              "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-lg font-black transition-all",
              selected.includes(`${r}-${c}`)
                ? "bg-[#FF3D5A] text-white scale-90 shadow-inner" 
                : "bg-white text-[#1A0505] border-b-4 border-slate-200 hover:bg-slate-50"
            )}
          >
            {char}
          </button>
        )))}
      </div>
    </div>
  );
}
// --- ARRASTAR (LÓGICA HÍBRIDA) ---
export function ArrastarUI({ prompt, onChangeAnswer, disabled }: any) {
  // Se a categoria for vogais, desviamos para a UI de associação com imagens
  if (prompt.category === "vogais") {
    return <VogaisInterativoUI prompt={prompt} onChangeAnswer={onChangeAnswer} disabled={disabled} />;
  }

  // Caso contrário, segue a lógica normal de montar palavras
  const game = useMemo(() => buildDragSet(prompt.answer), [prompt.answer]);
  const [placed, setPlaced] = useState<(string | null)[]>([]);

  useEffect(() => {
    setPlaced(new Array(game.items.length).fill(null));
    onChangeAnswer("");
  }, [prompt.id, game.items.length, onChangeAnswer]);

  const handlePick = (char: string, index: number) => {
    if (disabled) return;
    const firstEmpty = placed.indexOf(null);
    if (firstEmpty === -1) return;

    const next = [...placed];
    next[firstEmpty] = char;
    setPlaced(next);
    onChangeAnswer(next.filter(Boolean).join("").toLowerCase());
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex gap-2 flex-wrap justify-center min-h-[60px]">
        {placed.map((char, i) => (
          <div key={i} className={cn(
            "w-12 h-14 rounded-2xl border-2 border-dashed flex items-center justify-center text-xl font-bold transition-all",
            char ? "bg-white border-[#FF3D5A] text-[#FF3D5A] border-b-4 scale-110" : "bg-gray-100 border-gray-300"
          )}>
            {char}
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {game.items.map((char, i) => {
          const countInPlaced = placed.filter(c => c === char).length;
          const countInItems = game.items.filter(c => c === char).length;
          const isUsed = countInPlaced >= countInItems; 

          return (
            <button
              key={i}
              onClick={() => handlePick(char, i)}
              disabled={disabled || isUsed}
              className={cn(
                "w-12 h-12 bg-white border-b-4 border-gray-300 rounded-2xl flex items-center justify-center text-xl font-black text-[#1A0505] transition-all active:translate-y-1",
                isUsed ? "opacity-0 pointer-events-none" : "hover:bg-gray-50"
              )}
            >
              {char}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- EXERCÍCIO DE VOGAIS (ASSOCIAÇÃO COM IMAGEM) ---
export function VogaisInterativoUI({ prompt, onChangeAnswer, disabled }: any) {
  const game = useMemo(() => buildVogaisGame(prompt.answer), [prompt.answer]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
    onChangeAnswer("");
  }, [prompt.id, onChangeAnswer]);

  const handleSelect = (char: string) => {
    if (disabled) return;
    setSelected(char);
    onChangeAnswer(char.toLowerCase());
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full animate-in fade-in duration-500">
      <div className="text-center">
        <p className="text-lg font-medium text-slate-600 mb-2 font-['Plus_Jakarta_Sans']">
          Qual começa com a letra...
        </p>
        <h2 className="text-7xl font-black text-[#FF3D5A] animate-bounce font-['Playfair_Display']">
          {prompt.answer.toUpperCase()}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        {game.options.map((opt) => (
          <button
            key={opt.char}
            onClick={() => handleSelect(opt.char)}
            disabled={disabled}
            className={cn(
              "p-4 rounded-3xl bg-white border-b-8 border-slate-200 transition-all active:border-b-0 active:translate-y-2",
              selected === opt.char && (opt.isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"),
              "flex flex-col items-center gap-2 group"
            )}
          >
            <span className="text-5xl group-hover:scale-110 transition-transform">
              {opt.icon}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CaligrafiaUI({ prompt, onChangeAnswer, disabled }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  const textoParaTracejar = (prompt.phraseContext || prompt.answer || "").toUpperCase();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define o tamanho da fonte dinamicamente
    let fontSize = textoParaTracejar.length > 8 ? 45 : 70; 

    ctx.font = `bold ${fontSize}px 'Arial'`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // EFEITO TRACEJADO
    ctx.setLineDash([5, 5]); 
    ctx.strokeStyle = "#CBD5E1"; 
    ctx.lineWidth = 2; 
    ctx.strokeText(textoParaTracejar, canvas.width / 2, canvas.height / 2);

    // Configuração do Pincel do Usuário (Linha firme)
    ctx.setLineDash([]); 
    ctx.strokeStyle = "#4F46E5"; 
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [textoParaTracejar]);

  const startDrawing = (e: any) => {
    if (disabled) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: any) => {
    if (!isDrawing || disabled) return;
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.lineTo(offsetX, offsetY);
    ctx?.stroke();
    setMoveCount(prev => prev + 1);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    // Assim que ela solta o clique, já salvamos a resposta no estado global!
    onChangeAnswer(textoParaTracejar); 
  };

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300 w-full">
      
      {/* Quadro do Canvas */}
      <div className="bg-white rounded-3xl border-4 border-dashed border-slate-200 p-4 shadow-inner relative max-w-full">
        <canvas
          ref={canvasRef}
          width={600}
          height={250}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair touch-none max-w-full h-auto"
        />
        
        <button 
          type="button"
          onClick={() => {
            const ctx = canvasRef.current?.getContext('2d');
            ctx?.clearRect(0, 0, 600, 250);
            if (ctx) {
               ctx.setLineDash([5, 5]);
               ctx.strokeStyle = "#CBD5E1";
               ctx.lineWidth = 2;
               ctx.strokeText(textoParaTracejar, 300, 125);
            }
            setMoveCount(0);
          }}
          className="absolute top-2 right-2 p-2 bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 font-semibold rounded-xl transition-all shadow-sm"
        >
          🔄 Limpar
        </button>
      </div>

      <p className="text-slate-500 font-medium text-sm">
        Contorne as letras tracejadas com o dedo ou mouse!
      </p>

    </div>
  );
}