import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Trophy, ArrowUp, CheckCircle2 } from "lucide-react";

// Lista estrita com apenas as 4 palavras desejadas
const PALAVRAS_VALIDAS = ["BOLA", "CASA", "PATO", "ROSA"];
// Letras que compõem estritamente essas 4 palavras (B, O, L, A, C, S, P, T, R)
const LETRAS_POSSIVEIS = ["B", "O", "L", "A", "C", "S", "P", "T", "R"];

const MAPA_ESTRUTURAL = [
  [true, true, true, true, true, true, true],
  [true, true, true, true, true, true, false],
  [true, true, true, true, true, true, true],
  [false, false, true, true, true, true, false],
  [false, true, true, true, false, false, false],
  [false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false]
];

export default function BubbleShooterMorangos() {
  const [grid, setGrid] = useState<string[][]>(() => Array(7).fill(null).map(() => Array(7).fill("")));
  const [letraCarregada, setLetraCarregada] = useState<string>("O");
  const [proximaLetra, setProximaLetra] = useState<string>("A");
  const [angulo, setAngulo] = useState<number>(0);
  const [pontos, setPontos] = useState<number>(810);
  const [palavraAlerta, setPalavraAlerta] = useState<string>("");
  const [atirando, setAtirando] = useState<boolean>(false);
  const [palavrasDescobertas, setPalavrasDescobertas] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const canhaoRef = useRef<HTMLDivElement>(null);
  const municaoRef = useRef<HTMLDivElement>(null);

  // Sorteio inicial usando apenas as letras das 4 palavras
  useEffect(() => {
    const novoGridSorteado = MAPA_ESTRUTURAL.map((linha) =>
      linha.map((temBolha) => {
        if (temBolha) {
          return LETRAS_POSSIVEIS[Math.floor(Math.random() * LETRAS_POSSIVEIS.length)];
        }
        return "";
      })
    );
    setGrid(novoGridSorteado);
    setLetraCarregada(LETRAS_POSSIVEIS[Math.floor(Math.random() * LETRAS_POSSIVEIS.length)]);
    setProximaLetra(LETRAS_POSSIVEIS[Math.floor(Math.random() * LETRAS_POSSIVEIS.length)]);
  }, []);

  const lidarComMovimentoMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (atirando || !canhaoRef.current) return;
    const rect = canhaoRef.current.getBoundingClientRect();
    const canhaoX = rect.left + rect.width / 2;
    const canhaoY = rect.top + rect.height / 2;

    const deltaX = e.clientX - canhaoX;
    const deltaY = e.clientY - canhaoY;

    let radianos = Math.atan2(deltaX, -deltaY);
    let graus = radianos * (180 / Math.PI);
    graus = Math.max(-75, Math.min(75, graus));
    setAngulo(graus);
  };

  const obterVizinhosColmeia = (r: number, c: number) => {
    const isImpar = r % 2 === 1;
    const caminhos = isImpar
      ? [ { dr: -1, dc: 0 }, { dr: -1, dc: 1 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 } ]
      : [ { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 0 } ];

    const vizinhos: { r: number; c: number }[] = [];
    caminhos.forEach(({ dr, dc }) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 7 && nc >= 0 && nc < 7) {
        vizinhos.push({ r: nr, c: nc });
      }
    });
    return vizinhos;
  };

  // Mantida a lógica de grupo (anagrama conectado) solicitado anteriormente
  const analisarAgrupamentoOrtografico = (tabuleiro: string[][]) => {
    let bolhasParaExcluir: { r: number; c: number }[] = [];
    let palavraDetectada = "";

    const mapearIlhaConectada = (startR: number, startC: number, visitados: Set<string>, ilha: { r: number; c: number; letra: string }[]) => {
      const fila = [{ r: startR, c: startC }];
      visitados.add(`${startR},${startC}`);

      while (fila.length > 0) {
        const atual = fila.shift()!;
        ilha.push({ r: atual.r, c: atual.c, letra: tabuleiro[atual.r][atual.c] });

        const vizinhos = obterVizinhosColmeia(atual.r, atual.c);
        for (const v of vizinhos) {
          const chave = `${v.r},${v.c}`;
          if (!visitados.has(chave) && tabuleiro[v.r][v.c] !== "") {
            visitados.add(chave);
            fila.push({ r: v.r, c: v.c });
          }
        }
      }
    };

    const visitadosGlobal = new Set<string>();

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (tabuleiro[r][c] !== "" && !visitadosGlobal.has(`${r},${c}`)) {
          const ilhaAtual: { r: number; c: number; letra: string }[] = [];
          mapearIlhaConectada(r, c, visitadosGlobal, ilhaAtual);

          // Verifica apenas as 4 palavras estritas dentro da ilha conectada
          for (const palavra of PALAVRAS_VALIDAS) {
            let letrasNecessarias = palavra.split("");
            let coordenadasMatch: { r: number; c: number }[] = [];
            let copiaIlha = [...ilhaAtual];

            for (const letra of letrasNecessarias) {
              const idx = copiaIlha.findIndex(item => item.letra === letra);
              if (idx !== -1) {
                coordenadasMatch.push({ r: copiaIlha[idx].r, c: copiaIlha[idx].c });
                copiaIlha.splice(idx, 1);
              }
            }

            if (coordenadasMatch.length === palavra.length) {
              palavraDetectada = palavra;
              bolhasParaExcluir = coordenadasMatch;
              break;
            }
          }
        }
        if (palavraDetectada) break;
      }
      if (palavraDetectada) break;
    }

    if (palavraDetectada && bolhasParaExcluir.length > 0) {
      setPalavraAlerta(palavraDetectada);
      setPontos((p) => p + 150);
      
      setPalavrasDescobertas((prev) => 
        prev.includes(palavraDetectada) ? prev : [...prev, palavraDetectada]
      );

      const novoGridLimpo = [...tabuleiro.map((row) => [...row])];
      
      bolhasParaExcluir.forEach(({ r, c }) => {
        novoGridLimpo[r][c] = "";
        
        gsap.to(`.b-${r}-${c}`, {
          scale: 0,
          opacity: 0,
          duration: 0.25,
          ease: "power3.in",
        });
      });

      setGrid(novoGridLimpo);
      
      setTimeout(() => {
        setPalavraAlerta("");
      }, 2000);
    }
  };

  const dispararLetra = (e: React.MouseEvent<HTMLDivElement>) => {
    if (atirando || (e.target as HTMLElement).closest(".no-shoot") || !municaoRef.current || !containerRef.current) return;
    setAtirando(true);

    const containerRect = containerRef.current.getBoundingClientRect();
    const radianos = angulo * (Math.PI / 180);
    
    let vx = Math.sin(radianos) * 16;
    let vy = -Math.cos(radianos) * 16;

    let posX = containerRect.width / 2;
    let posY = containerRect.height - 130;

    gsap.fromTo(canhaoRef.current, { scaleY: 0.8 }, { scaleY: 1, duration: 0.1, ease: "power2.out" });

    const loopVoo = gsap.ticker.add(() => {
      posX += vx;
      posY += vy;

      if (posX <= 22 || posX >= containerRect.width - 22) {
        vx *= -1;
        posX = Math.max(22, Math.min(containerRect.width - 22, posX));
      }

      gsap.set(municaoRef.current, {
        x: posX - containerRect.width / 2,
        y: posY - (containerRect.height - 130)
      });

      let colidiu = false;

      if (posY <= 110) { 
        colidiu = true;
      } else {
        const bolhasElementos = document.querySelectorAll(".bubble-active");
        for (let i = 0; i < bolhasElementos.length; i++) {
          const el = bolhasElementos[i];
          const bRect = el.getBoundingClientRect();
          
          const bX = bRect.left + bRect.width / 2 - containerRect.left;
          const bY = bRect.top + bRect.height / 2 - containerRect.top;

          const distancia = Math.hypot(posX - bX, posY - bY);
          if (distancia < 42) { 
            colidiu = true;
            break;
          }
        }
      }

      if (colidiu) {
        gsap.ticker.remove(loopVoo);

        const pontoImpactoX = posY <= 110 ? posX : posX - vx * 1.2;
        const pontoImpactoY = posY <= 110 ? posY : posY - vy * 1.2;

        let linhaAlvo = 0;
        let colunaAlvo = 0;
        let menorDistanciaSlot = Infinity;

        const slotsDoPainel = document.querySelectorAll(".bubble-slot");
        slotsDoPainel.forEach((slot) => {
          const r = parseInt(slot.getAttribute("data-row") || "0");
          const c = parseInt(slot.getAttribute("data-col") || "0");

          if (grid[r][c] !== "") return;

          const sRect = slot.getBoundingClientRect();
          const sX = sRect.left + sRect.width / 2 - containerRect.left;
          const sY = sRect.top + sRect.height / 2 - containerRect.top;

          const d = Math.hypot(pontoImpactoX - sX, pontoImpactoY - sY);
          if (d < menorDistanciaSlot) {
            menorDistanciaSlot = d;
            linhaAlvo = r;
            colunaAlvo = c;
          }
        });

        if (grid[linhaAlvo][colunaAlvo] !== "") {
          const vizinhosLivres = obterVizinhosColmeia(linhaAlvo, colunaAlvo).filter(
            (v) => grid[v.r][v.c] === ""
          );
          if (vizinhosLivres.length > 0) {
            let vizinhoMaisPerto = vizinhosLivres[0];
            let minDistV = Infinity;
            vizinhosLivres.forEach((v) => {
              const elSlot = document.querySelector(`[data-row="${v.r}"][data-col="${v.c}"]`);
              if (elSlot) {
                const r = elSlot.getBoundingClientRect();
                const sx = r.left + r.width / 2 - containerRect.left;
                const sy = r.top + r.height / 2 - containerRect.top;
                const dv = Math.hypot(pontoImpactoX - sx, pontoImpactoY - sy);
                if (dv < minDistV) {
                  minDistV = dv;
                  vizinhoMaisPerto = v;
                }
              }
            });
            linhaAlvo = vizinhoMaisPerto.r;
            colunaAlvo = vizinhoMaisPerto.c;
          }
        }

        const novoGrid = [...grid.map(row => [...row])];
        novoGrid[linhaAlvo][colunaAlvo] = letraCarregada;
        setGrid(novoGrid);

        setTimeout(() => {
          gsap.fromTo(`.b-${linhaAlvo}-${colunaAlvo}`, 
            { scale: 0 }, 
            { scale: 1, duration: 0.25, ease: "elastic.out(1, 0.6)" }
          );
        }, 10);

        analisarAgrupamentoOrtografico(novoGrid);

        gsap.set(municaoRef.current, { x: 0, y: 0 });
        setLetraCarregada(proximaLetra);
        setProximaLetra(LETRAS_POSSIVEIS[Math.floor(Math.random() * LETRAS_POSSIVEIS.length)]);
        setAtirando(false);
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={lidarComMovimentoMouse}
      onClick={dispararLetra}
      className="w-full max-w-[450px] h-[780px] bg-[#F4FAFF] border-4 border-[#0F172A] rounded-[48px] p-5 shadow-[0_16px_0_#0F172A] relative overflow-hidden flex flex-col justify-between select-none cursor-crosshair mx-auto bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:20px_20px]"
    >
      {/* HUD Superior */}
      <div className="no-shoot flex items-center justify-between bg-white border-3 border-[#0F172A] px-5 py-3 rounded-2xl shadow-[0_6px_0_#0F172A] z-40">
        <div className="flex items-center gap-2 font-black text-slate-700 text-base">
          <Trophy className="w-5 h-5 text-amber-400 stroke-[3.5]" />
          <span>{pontos} XP</span>
        </div>
        <div className="text-xs font-black text-rose-500 bg-rose-50 px-3 py-1.5 rounded-full border-2 border-rose-200 tracking-wide font-display">
          ✨ BUBBLE MORANGUINHO
        </div>
      </div>

      {/* Alerta de Feedback */}
      <div className="h-7 text-center z-30 pointer-events-none mt-1">
        {palavraAlerta && (
          <p className="text-emerald-700 font-black bg-emerald-50 border-3 border-emerald-400 px-6 py-1.5 rounded-full inline-flex items-center gap-1.5 text-xs shadow-md animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 stroke-[3]" />
            Formou: <span className="underline decoration-wavy decoration-emerald-400 tracking-wider">{palavraAlerta}</span>! +150 XP 🎉
          </p>
        )}
      </div>

      {/* PAINEL DO GRID */}
      <div className="no-shoot flex flex-col gap-2 bg-white/70 border-3 border-[#0F172A] p-5 rounded-[32px] min-h-[390px] shadow-[inset_0_4px_12px_rgba(0,0,0,0.04)] justify-start z-10 items-center mt-1">
        {grid.map((linha, rIdx) => {
          const isImpar = rIdx % 2 === 1;
          return (
            <div 
              key={rIdx} 
              className={`flex gap-2 justify-center w-full row-${rIdx} ${isImpar ? "translate-x-[24px]" : ""}`}
            >
              {linha.map((letra, cIdx) => (
                <div 
                  key={cIdx} 
                  data-row={rIdx}
                  data-col={cIdx}
                  className="bubble-slot w-11 h-11 flex items-center justify-center relative"
                >
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-sky-200 bg-sky-50/40 z-0" />
                  
                  {letra && (
                    <div className={`bubble-active b-${rIdx}-${cIdx} h-11 w-11 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 border-3 border-[#0F172A] flex items-center justify-center text-white font-display text-lg font-black shadow-[0_4px_0_#0F172A] z-10 relative`}>
                      {letra}
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer Informativo Focado */}
      <div className="no-shoot text-center pointer-events-none z-10 text-[10px] font-black uppercase text-slate-400 tracking-wider">
        PROCURE POR: BOLA, CASA, PATO, ROSA
      </div>

      {/* ZONA INFERIOR */}
      <div className="relative h-44 w-full flex items-end justify-center">
        
        {/* LISTINHA LATERAL */}
        <div className="no-shoot absolute left-0 top-0 bottom-4 w-28 bg-slate-100/80 border-2 border-dashed border-slate-300 rounded-2xl p-2 flex flex-col gap-1.5 overflow-y-auto max-h-[160px] shadow-inner z-30">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block border-b border-slate-200 pb-1 mb-0.5">
            Formadas ({palavrasDescobertas.length})
          </span>
          {palavrasDescobertas.length === 0 ? (
            <span className="text-[10px] italic text-slate-400 font-medium leading-tight block pt-1">
              Nenhuma ainda...
            </span>
          ) : (
            <div className="flex flex-col gap-1">
              {palavrasDescobertas.map((palavra, index) => (
                <div 
                  key={index}
                  className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center justify-between shadow-xs"
                >
                  <span>{palavra}</span>
                  <span className="text-[8px] text-emerald-500 font-bold">✓</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CANHÃO */}
        <div className="relative flex flex-col items-center justify-end h-40 pointer-events-none z-20">
          {!atirando && (
            <div 
              className="absolute bottom-20 w-1 border-l-4 border-dashed border-rose-400/80"
              style={{ 
                height: "260px", 
                transform: `rotate(${angulo}deg)`, 
                transformOrigin: "bottom center",
              }}
            />
          )}

          <div className="absolute bottom-16 w-11 h-11 flex items-center justify-center">
            <div 
              ref={municaoRef}
              className="h-11 w-11 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 border-3 border-[#0F172A] flex items-center justify-center text-white font-display text-lg font-black shadow-[0_4px_0_#0F172A]"
            >
              {letraCarregada}
            </div>
          </div>

          <div 
            ref={canhaoRef}
            style={{ transform: `rotate(${angulo}deg)`, transformOrigin: "bottom center" }}
            className="w-16 h-16 bg-[#1E293B] rounded-t-full relative border-t-3 border-x-3 border-[#0F172A] shadow-[0_6px_0_#0F172A] flex items-center justify-center pt-1"
          >
            <ArrowUp className="text-white w-6 h-6 stroke-[3.5]" />
          </div>
        </div>
      </div>

      {/* FILA */}
      <div className="no-shoot flex items-center justify-between bg-sky-50 border-2 border-dashed border-sky-200 p-2.5 rounded-2xl z-40 mt-1">
        <span className="text-xs font-black text-sky-700/80 pl-2">Próxima da fila:</span>
        <div className="h-9 w-9 rounded-full bg-amber-400 border-2 border-[#0F172A] flex items-center justify-center text-white font-black text-sm shadow-[0_3px_0_#0F172A]">
          {proximaLetra}
        </div>
      </div>
    </div>
  );
}