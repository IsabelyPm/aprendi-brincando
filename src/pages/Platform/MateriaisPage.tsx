import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Download, Sparkles, Layers, BookOpen, ArrowLeft, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";
import mascot from "@/assets/mascot.png";

const MATERIAL_CATEGORIES = {
  vogais: {
    label: "Canteiro das Vogais",
    icon: Sparkles,
    activeColor: "bg-gradient-to-r from-rose-400 to-pink-500 text-white shadow-rose-200",
    borderColor: "border-pink-200",
    files: [
      { name: "Circule as Vogais.pdf", path: "files/vogais/Circule as Vogais.pdf" },
      { name: "Complete as Vogais.pdf", path: "files/vogais/Complete as Vogais.pdf" },
      { name: "Contorne as Vogais.pdf", path: "files/vogais/Contorne as Vogais.pdf" },
      { name: "Ligando as Vogais.pdf", path: "files/vogais/Ligando as Vogais.pdf" },
    ]
  },
  silabas: {
    label: "Horta das Sílabas",
    icon: Layers,
    activeColor: "bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-green-200",
    borderColor: "border-green-200",
    files: [
      { name: "Conte as Sílabas.pdf", path: "files/silabas/Conte as Sílabas.pdf" },
      { name: "Desafio das Sílabas.pdf", path: "files/silabas/Desafio das Sílabas.pdf" },
      { name: "Descubra as Sílabas.pdf", path: "files/silabas/Descubra as Sílabas.pdf" },
      { name: "Monte as Sílabas.pdf", path: "files/silabas/Monte as Sílabas.pdf" },
      { name: "Recorte as Sílabas.pdf", path: "files/silabas/Recorte as Sílabas.pdf" },
    ]
  },
  palavras: {
    label: "Pomar das Palavras",
    icon: BookOpen,
    activeColor: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-amber-200",
    borderColor: "border-amber-200",
    files: [
      { name: "Cole a imagem na palavra.pdf", path: "files/palavras/Cole a imagem na palavra.pdf" },
      { name: "Complete a tabela de palavras.pdf", path: "files/palavras/Complete a tabela de palavras.pdf" },
      { name: "Desembaralhe as palavras.pdf", path: "files/palavras/Desembaralhe as palavras.pdf" },
      { name: "Ligue as frutas.pdf", path: "files/palavras/Ligue as frutas.pdf" },
      { name: "Palavras e Figuras.pdf", path: "files/palavras/Palavras e Figuras.pdf" },
      { name: "Pinte as letras.pdf", path: "files/palavras/Pinte as letras.pdf" },
    ]
  }
};

export default function MateriaisPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<keyof typeof MATERIAL_CATEGORIES>('vogais');
  const navigate = useNavigate();

  useEffect(() => {
    const categoriaUrl = searchParams.get('categoria');
    if (categoriaUrl && categoriaUrl in MATERIAL_CATEGORIES) {
      setActiveTab(categoriaUrl as any);
    }
  }, [searchParams]);

  const handleTabChange = (categoryKey: keyof typeof MATERIAL_CATEGORIES) => {
    setActiveTab(categoryKey);
    setSearchParams({ categoria: categoryKey });
  };

  const currentCategory = MATERIAL_CATEGORIES[activeTab];

  return (
    // 1. FUNDO CREME COM PADRONAGEM DE PONTINHOS DO MORANGUINHO
    <div className="min-h-screen bg-[#FFFDF9] py-12 px-4 relative overflow-hidden selection:bg-rose-200">
      
      {/* Detalhe decorativo de círculos de morango ao fundo */}
      <div className="absolute inset-0 opacity-[0.25] pointer-events-none" 
           style={{ 
             backgroundImage: 'radial-gradient(#FFB3B3 2px, transparent 2px)', 
             backgroundSize: '32px 32px' 
           }} 
      />

      {/* Ilustrações flutuantes abstratas simundando folhagens/morangos no canto superior */}
      <div className="absolute -top-16 -left-16 w-44 h-44 bg-red-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-20 -right-16 w-60 h-60 bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
      <Link 
      to="./" 
      className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-bold text-sm mb-8 bg-white px-5 py-2.5 rounded-full border-2 border-rose-100 shadow-sm transition-all hover:scale-105 active:scale-95"
      >
  <ArrowLeft className="w-4 h-4 stroke-[3]" /> Voltar para o Início
</Link>

        {/* CABEÇALHO LÚDICO COM O MASCOTE */}
        <div className="text-center mb-12 flex flex-col items-center">
          
          {/* Caixa do Mascote Principal */}
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-rose-200 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <img 
              src={mascot}
              alt="Mascote Moranguinho" 
              className="w-52 h-52  object-contain relative z-10 animate-bounce duration-1000 selection:bg-transparent"
              style={{ animationDuration: '3s' }}
            />
            {/* Balãozinho de fala divertido */}
            <div className="absolute -right-24 top-2 bg-white text-rose-500 text-xs font-black px-3 py-1.5 rounded-2xl shadow-md border border-rose-100 rotate-6 hidden md:block">
              Vamos praticar? 🍓
            </div>
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-4 py-1.5 rounded-full shadow-sm">
            🍓 Aprendi Brincando • Atividades
          </span>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mt-4 tracking-tight font-display drop-shadow-sm">
            Central de <span className="text-rose-500">Materiais Didáticos</span>
          </h1>
          
          <p className="text-slate-500 mt-3 max-w-xl mx-auto text-base font-medium leading-relaxed">
            Cultive o conhecimento! Escolha uma das coleções do nosso Moranguinho abaixo e faça o download gratuito das folhinhas prontas para imprimir.
          </p>
        </div>

        {/* ABAS ESTILO BUBBLE/GUMMY COM CORES ALTERNADAS */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap bg-white p-2.5 rounded-3xl border-2 border-slate-100 shadow-sm max-w-2xl mx-auto">
          {Object.entries(MATERIAL_CATEGORIES).map(([key, category]) => {
            const Icon = category.icon;
            const isSelected = activeTab === key;
            
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key as any)}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 transform active:scale-95",
                  isSelected 
                    ? `${category.activeColor} shadow-lg scale-105` 
                    : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                )}
              >
                <Icon className={cn("w-4 h-4 stroke-[2.5]", isSelected ? "animate-pulse" : "")} />
                {category.label}
              </button>
            );
          })}
        </div>

        {/* GRID DE CARDS COM REVESTIMENTO EM JARDIM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCategory.files.map((file, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white rounded-[32px] border-2 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden",
                currentCategory.borderColor
              )}
            >
              {/* Detalhe sutil de moranguinho no topo do card ao dar HOVER */}
              <div className="absolute top-2 right-4 text-rose-400/20 group-hover:text-rose-400/40 transition-colors pointer-events-none">
                <Heart className="w-5 h-5 fill-current" />
              </div>

              {/* CONTAINER DO IFRAME COM BORDA PONTILHADA DE RECORTE PEDAGÓGICO */}
              <div className="w-full h-48 rounded-2xl flex items-center justify-center relative overflow-hidden mb-4 bg-slate-100 border-2 border-dashed border-slate-300 group-hover:border-rose-300 transition-colors">
                
                {/* O seu Iframe Real com os PDFs lindos contendo o seu moranguinho */}
                <iframe
                  src={`${file.path}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                  title={`Pré-visualização de ${file.name}`}
                  className="w-[94%] h-[92%] bg-white rounded-lg shadow-sm border border-slate-200"
                  loading="lazy"
                />

                {/* Camada anti-bloqueio de scroll que mantem a navegação lisa */}
                <div className="absolute inset-0 bg-transparent rounded-2xl pointer-events-auto" />
              </div>

              {/* Informações Textuais com Tipografia Infantil e Alinhamento Lindo */}
              <div className="px-1 mb-4 text-left">
                <h4 className="font-black text-slate-800 text-lg line-clamp-1 group-hover:text-rose-500 transition-colors font-display">
                  {file.name.replace(".pdf", "")}
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Apostila Gratuita • Formato A4
                </p>
              </div>

              {/* BOTÃO DE DOWNLOAD ESTILO BUBBLE AZUL NOTURNO */}
              <a
                href={file.path}
                download
                className="w-full flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-rose-500 text-white font-black py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md shadow-slate-900/10 hover:shadow-rose-500/20 transform active:scale-[0.98]"
              >
                <Download className="w-4 h-4 stroke-[3]" />
                Colher Atividade (Download)
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}