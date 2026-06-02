import { useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // CORREÇÃO: Importando o Link do react-router-dom
import { gsap } from "gsap";
import { Brain, HeartHandshake, Trophy, Sparkles, Star, Medal, Crown, Rocket, BookOpen, Download, Heart } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { ProgressRing } from "@/components/ProgressRing";

const Index = () => {
  const mascotRef = useRef<HTMLImageElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animação 3D flutuante do Moranguinho Principal
    if (mascotRef.current) {
      gsap.to(mascotRef.current, {
        y: -25,
        rotation: 4,
        scale: 1.02,
        duration: 2.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    // Brilho pulsante da bolha mágica de fundo
    if (blobRef.current) {
      gsap.to(blobRef.current, {
        scale: 1.15,
        rotation: 360,
        duration: 8,
        ease: "linear",
        repeat: -1,
      });
    }

    // Animação das Letrinhas e Confetes Saltitantes no Fundo (GSAP Randomization)
    const floatingElements = document.querySelectorAll(".magic-float");
    floatingElements.forEach((el) => {
      gsap.to(el, {
        y: "random(-30, 30)",
        x: "random(-20, 20)",
        rotation: "random(-45, 45)",
        duration: "random(2.5, 4)",
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }, []);

  const pillars = [
    {
      icon: Brain,
      title: "Treino Cognitivo",
      desc: "Jogos baseados em neurociência infantil que estimulam memória e raciocínio de forma aberta.",
      bgStyle: "bg-[#FFF2E6] border-[#FFD9B3] text-[#FF8000] shadow-[0_12px_0_#FFE6CC]",
      iconBg: "bg-[#FF8000] text-white shadow-[0_4px_0_#CC6600]"
    },
    {
      icon: HeartHandshake,
      title: "Acessibilidade",
      desc: "Conteúdo inclusivo com áudio-narração, alto contraste e teclado, seguindo as diretrizes WCAG.",
      bgStyle: "bg-[#E6F9F0] border-[#B3F0D2] text-[#00CC66] shadow-[0_12px_0_#CCF7E3]",
      iconBg: "bg-[#00CC66] text-white shadow-[0_4px_0_#00994C]"
    },
    {
      icon: BookOpen,
      title: "Atividades em PDF",
      desc: "Material pedagógico complementar para baixar, imprimir e colorir, estendendo o aprendizado pro papel.",
      bgStyle: "bg-[#E6F2FF] border-[#B3D7FF] text-[#0080FF] shadow-[0_12px_0_#CCE4FF]",
      iconBg: "bg-[#0080FF] text-white shadow-[0_4px_0_#0066CC]"
    },
  ];

  const medals = [
    { icon: Star, label: "Primeira Letra", color: "from-amber-400 to-yellow-500 shadow-yellow-200" },
    { icon: Medal, label: "Sílaba Mestre", color: "from-cyan-400 to-blue-500 shadow-blue-200" },
    { icon: Crown, label: "Rei da Leitura", color: "from-purple-400 to-indigo-500 shadow-purple-200" },
    { icon: Rocket, label: "Foguete Veloz", color: "from-rose-400 to-pink-500 shadow-rose-200" },
    { icon: BookOpen, label: "Livro Aberto", color: "from-emerald-400 to-teal-500 shadow-emerald-200" },
    { icon: Sparkles, label: "Brilho Mágico", color: "from-orange-400 to-amber-500 shadow-orange-200" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#FFFDF6] overflow-x-hidden selection:bg-rose-200 text-slate-700 relative pb-12">
      
      {/* TEXTURA DE FUNDO INFANTIL */}
      <div className="absolute inset-0 opacity-[0.25] pointer-events-none z-0" 
           style={{ 
             backgroundImage: 'radial-gradient(#FF9494 2.5px, transparent 2.5px), radial-gradient(#94E0FF 2.5px, transparent 2.5px)', 
             backgroundSize: '40px 40px',
             backgroundPosition: '0 0, 20px 20px'
           }} 
      />

      {/* CONFETES E LETRINHAS MÁGICAS */}
      <div className="absolute top-40 left-10 magic-float text-red-400 font-display font-black text-6xl opacity-40 select-none">A</div>
      <div className="absolute top-80 right-16 magic-float text-amber-400 font-display font-black text-7xl opacity-40 select-none">B</div>
      <div className="absolute top-[600px] left-16 magic-float text-emerald-400 font-display font-black text-5xl opacity-40 select-none">C</div>
      <div className="absolute top-[800px] right-24 magic-float text-indigo-400 font-display font-black text-6xl opacity-40 select-none">⭐️</div>
      <div className="absolute top-[1200px] left-12 magic-float text-pink-400 font-display font-black text-5xl opacity-30 select-none">🎈</div>

      {/* Header / Nav */}
      <header className="absolute top-0 inset-x-0 z-30">
        <nav className="container flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="h-11 w-11 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-xl shadow-[0_5px_0_#C93B56] group-hover:scale-110 active:scale-95 transition-all">
              🍓
            </span>
            <span className="font-display text-2xl font-black text-slate-800 tracking-tight">
              Aprendi <span className="text-rose-500">Brincando</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-black text-slate-600">
            <a href="#pilares" className="hover:text-rose-500 transition-colors">Método</a>
            {/* CORREÇÃO: Link interno usando o componente Link para a página de exercícios */}
            <Link to="/plataforma" className="hover:text-rose-500 transition-colors">Jogar Agora</Link>
            <a href="#pdfs" className="hover:text-rose-500 transition-colors">Atividades em PDF</a>
          </div>
          
          <Link
            to="/plataforma"
            className="hidden md:inline-flex items-center gap-2 rounded-2xl bg-slate-800 text-white font-black px-6 py-3.5 shadow-[0_5px_0_#0F172A] hover:bg-rose-500 hover:shadow-[0_5px_0_#BE123C] hover:scale-105 active:translate-y-1 transition-all"
          >
            Jogar Grátis
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-28">
        <div className="container grid lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* Lado Esquerdo - Textos e Chamada */}
          <div className="text-left">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white border-2 border-rose-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-rose-500 shadow-[0_4px_0_#FFE4E6]">
              <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" /> Plataforma 100% Gratuita
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-6xl lg:text-7xl font-black leading-[1.08] text-slate-800 tracking-tight">
              Cada letra<br/>
              vira uma <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent drop-shadow-xs">aventura Mágica!</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-500 font-bold leading-relaxed">
              Um space aberto para crianças treinarem a leitura e escrita através de jogos interativos 
              e atividades para baixar. Feito por quem ama a educação infantil!
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {/* CORREÇÃO: Mudado de href="/plataforma" para Link to="/plataforma" */}
              <Link
                to="/plataforma"
                className="group inline-flex items-center gap-2.5 rounded-3xl bg-gradient-to-r from-rose-400 to-pink-500 px-8 py-5 font-black text-white text-lg shadow-[0_8px_0_#C93B56] hover:translate-y-[-2px] active:translate-y-[4px] active:shadow-[0_4px_0_#C93B56] transition-all"
              >
                Iniciar Treino
                <Rocket className="h-5 w-5 group-hover:translate-x-1 transition-transform stroke-[3]" />
              </Link>
              <a
                href="#pdfs"
                className="inline-flex items-center gap-2.5 rounded-3xl border-3 border-slate-200 bg-white px-8 py-5 font-black text-slate-700 text-lg shadow-[0_8px_0_#E2E8F0] hover:border-rose-400 hover:text-rose-500 active:translate-y-[4px] active:shadow-[0_4px_0_#E2E8F0] transition-all"
              >
                <Download className="h-5 w-5 stroke-[3]" /> Baixar PDFs
              </a>
            </div>
          </div>

          {/* Lado Direito - O Moranguinho */}
          <div className="relative flex justify-center items-center min-h-[460px]">
            <div
              ref={blobRef}
              className="absolute inset-0 m-auto h-[360px] w-[360px] lg:h-[460px] lg:w-[460px] rounded-full bg-gradient-to-tr from-rose-400/20 via-pink-300/30 to-sky-300/30 blur-xl pointer-events-none border-4 border-dashed border-white/40"
            />
            <img
              ref={mascotRef}
              src={mascot}
              alt="Mascote morango"
              className="relative z-10 w-80 md:w-96 lg:w-[440px] h-auto drop-shadow-[0_25px_30px_rgba(244,63,94,0.25)] select-none"
            />
          </div>
        </div>
      </section>

      {/* Seção Pilares */}
      <section id="pilares" className="py-24 relative z-10">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-[#E6F9F0] border-2 border-[#B3F0D2] px-5 py-2 rounded-full shadow-sm">
              Apoio Pedagógico Divertido
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              Aprender na tela,<br/>fixar no papel!
            </h2>
          </div>

          {/* Grid de Bloquinhos 3D */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className={`group relative rounded-[36px] border-3 p-8 transition-all duration-300 text-left hover:-translate-y-2 active:translate-y-1 ${p.bgStyle}`}
                >
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform ${p.iconBg}`}>
                    <Icon className="h-8 w-8 stroke-[3]" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-black text-slate-800">{p.title}</h3>
                  <p className="mt-3 text-slate-600 text-sm font-bold leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simulador de Dashboard */}
      <section id="dashboard" className="py-24 bg-gradient-to-b from-[#32131C] to-[#1D080E] relative overflow-hidden rounded-[60px] mx-4 my-12 border-4 border-[#4A202C]">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(#FFF 3px, transparent 3px)', 
               backgroundSize: '30px 30px' 
             }} 
        />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-rose-300 bg-rose-500/20 border-2 border-rose-500/30 px-5 py-2 rounded-full">
              Área do Aluno • Conquistas
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-black tracking-tight">
              Acompanhe a sua <span className="text-rose-400">evolução!</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto rounded-[44px] bg-white p-6 md:p-10 shadow-[0_20px_0_rgba(0,0,0,0.3)] border-4 border-slate-100">
            {/* Topo do Aluno */}
            <div className="flex items-center justify-between flex-wrap gap-4 border-b-4 border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-display text-3xl font-black shadow-[0_5px_0_#C93B56]">
                  L
                </div>
                <div className="text-left">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Olá, pequeno explorador</p>
                  <h3 className="font-display text-3xl font-black text-slate-800">Lara, Nível 7</h3>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-rose-50 border-2 border-rose-200 px-5 py-2.5 text-sm font-black text-rose-500 shadow-sm">
                <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: '4s' }} /> 1.240 pontos de treino
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mt-8 text-left">
              <div className="flex items-center justify-between text-base font-black text-slate-600 mb-2">
                <span>Próximo Nível (Falta pouquinho!)</span>
                <span className="text-rose-500 bg-rose-50 px-3 py-1 rounded-full text-xs">740 / 1000 XP</span>
              </div>
              <div className="h-7 rounded-full bg-slate-100 overflow-hidden p-1.5 border-3 border-slate-200 shadow-inner">
                <div className="h-full w-[74%] bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] animate-pulse" />
              </div>
            </div>

            {/* Rosquinhas de Progresso */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <ProgressRing value={86} label="Vogais" />
              <ProgressRing value={62} label="Sílabas" />
              <ProgressRing value={45} label="Palavras" />
              <ProgressRing value={28} label="Frases" />
            </div>

            {/* Vitrine de Medalhas */}
            <div className="mt-12 border-t-4 border-slate-100 pt-8 text-left">
              <h4 className="font-display text-2xl font-black text-slate-800 mb-6">Medalhas Desbloqueadas 🎖️</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {medals.map((m) => (
                  <div
                    key={m.label}
                    className="group flex flex-col items-center gap-3 rounded-3xl bg-slate-50 border-2 border-slate-200/80 p-4 hover:bg-rose-50 hover:border-rose-400 hover:-translate-y-2 active:translate-y-0 transition-all duration-300 cursor-pointer shadow-sm"
                  >
                    <div className={`h-14 w-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform ${m.color}`}>
                      <m.icon className="h-6 w-6 stroke-[3]" />
                    </div>
                    <span className="text-xs font-black text-center text-slate-600 group-hover:text-rose-500 transition-colors leading-tight">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Redirecionamento para PDFs */}
      <section id="pdfs" className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-[#FFF9E6] border-2 border-[#FFE0B3] px-5 py-2 rounded-full shadow-sm">
              Canteiros de Impressão
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              Coleções prontas para <span className="text-rose-500">Imprimir!</span>
            </h2>
          </div>

          {/* Cards com Bordas Tracejadas */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { id: "vogais", title: "Canteiro das Vogais", border: "border-pink-300 shadow-[0_10px_0_#FBCFE8]", tagStyle: "bg-pink-50 text-pink-600" },
              { id: "silabas", title: "Horta das Sílabas", border: "border-emerald-300 shadow-[0_10px_0_#A7F3D0]", tagStyle: "bg-emerald-50 text-emerald-600" },
              { id: "palavras", title: "Pomar das Palavras", border: "border-amber-300 shadow-[0_10px_0_#FDE68A]", tagStyle: "bg-amber-50 text-amber-600" }
            ].map((item) => (
              <div 
                key={item.id} 
                className={`bg-white border-4 border-dashed p-6 rounded-[40px] flex flex-col items-center hover:translate-y-[-4px] active:translate-y-[6px] active:shadow-none transition-all duration-200 group ${item.border}`}
              >
                <div className="w-full h-36 bg-slate-50 border-2 border-slate-100 rounded-3xl flex items-center justify-center relative overflow-hidden mb-5 shadow-inner">
                  <BookOpen className="h-14 w-14 text-slate-400 group-hover:scale-110 group-hover:text-rose-400 transition-all stroke-[2.5]" />
                </div>
                
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 ${item.tagStyle}`}>
                  Apostila Completa A4
                </span>

                <h4 className="font-display text-xl text-slate-800 font-black tracking-tight group-hover:text-rose-500 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs font-bold text-slate-400 mt-1 mb-6">Pronta para o Papel</p>
                
                {/* CORREÇÃO: Mudado de href para Link to do React Router */}
                <Link 
                  to={`/materiais?categoria=${item.id}`} 
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-800 py-4 text-sm font-black text-white shadow-[0_4px_0_#0F172A] hover:bg-rose-500 hover:shadow-[0_4px_0_#9F1239] transition-all"
                >
                  <Download className="h-4 w-4 stroke-[3]" /> Explorar Caderno
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Caixa de Ação Final */}
      <section className="py-12 relative z-10">
        <div className="container">
          <div className="relative overflow-hidden rounded-[50px] bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 p-12 text-center shadow-[0_15px_0_#BE123C] max-w-5xl mx-auto border-4 border-white/20">
            <div className="relative max-w-2xl mx-auto">
              <h2 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight">
                Pronto para começar os treinos?
              </h2>
              <p className="mt-4 text-white/95 font-bold text-base">
                Acesse nossa área de exercícios aberta agora mesmo e divirta-se aprendendo!
              </p>
              {/* CORREÇÃO: Ajustado de href="/canhao" para apontar para a rota certa da /plataforma via Link */}
              <Link
                to="/plataforma"
                className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-slate-800 px-8 py-5 font-black text-white hover:bg-white hover:text-rose-500 shadow-[0_6px_0_#000] active:translate-y-1 active:shadow-none transition-all"
              >
                Acessar Plataforma
                <Rocket className="h-5 w-5 stroke-[3]" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;