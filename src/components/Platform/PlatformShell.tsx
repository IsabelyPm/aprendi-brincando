import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, BookOpen, Trophy, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LearningCategory } from "@/lib/learning/types";

const base = [
  { to: "/plataforma", label: "Dashboard", icon: Trophy },
  { to: "/plataforma/vogais", label: "Vogais", icon: BookOpen },
  { to: "/plataforma/silabas", label: "Sílabas", icon: Sparkles },
  { to: "/plataforma/palavras", label: "Palavras", icon: BookOpen },
  { to: "/plataforma/frases", label: "Frases", icon: Sparkles },
];

export type SessionType = "escrita" | "escuta" | "caça-palavras" | "arraste";


export default function PlatformShell({ children }: PropsWithChildren) {
  const location = useLocation();
  const active = useMemo(() => {
    // match por prefixo
    const path = location.pathname;
    return base.find((i) => path === i.to || path.startsWith(i.to + "/"))?.to ?? "/plataforma";
  }, [location.pathname]);

  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const handler = () => {
      const hc = window.matchMedia?.("(prefers-contrast: more)")?.matches;
      if (hc !== undefined) setHighContrast(!!hc);
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className={cn("min-h-screen bg-background", highContrast && "contrast-more")}>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between py-4 gap-4">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-accent/10 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-semibold">Voltar</span>
          </Link>

          <nav className="flex items-center gap-2 flex-wrap justify-center">
            {base.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isActive ? "bg-primary text-primary-foreground shadow-playful" : "bg-accent/10 text-primary hover:bg-accent/20"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="container py-8 md:py-12">{children}</main>
    </div>
  );
}

