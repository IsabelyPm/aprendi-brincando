import { useEffect, useState } from "react";
import { Accessibility, Type, Contrast, X } from "lucide-react";

export const AccessibilityMenu = () => {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(100);
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--a11y-font-scale", `${scale}%`);
  }, [scale]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", contrast);
  }, [contrast]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div
          role="dialog"
          aria-label="Menu de acessibilidade"
          className="mb-3 w-72 rounded-2xl bg-card p-5 shadow-wine border border-border animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-primary">Acessibilidade</h3>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="rounded-full p-1 hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Type className="h-4 w-4" /> Tamanho da fonte: {scale}%
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setScale((s) => Math.max(80, s - 10))}
                  className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold hover:bg-muted transition-bounce"
                  aria-label="Diminuir fonte"
                >
                  A−
                </button>
                <button
                  onClick={() => setScale(100)}
                  className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold hover:bg-muted transition-bounce"
                >
                  A
                </button>
                <button
                  onClick={() => setScale((s) => Math.min(150, s + 10))}
                  className="flex-1 rounded-lg bg-secondary px-3 py-2 text-sm font-semibold hover:bg-muted transition-bounce"
                  aria-label="Aumentar fonte"
                >
                  A+
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={() => setContrast((c) => !c)}
                className="w-full flex items-center justify-between rounded-lg bg-secondary px-3 py-2 text-sm font-semibold hover:bg-muted transition-bounce"
                aria-pressed={contrast}
              >
                <span className="flex items-center gap-2">
                  <Contrast className="h-4 w-4" /> Alto contraste
                </span>
                <span
                  className={`inline-block h-5 w-9 rounded-full transition-colors ${
                    contrast ? "bg-accent" : "bg-border"
                  } relative`}
                >
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                      contrast ? "left-4" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir menu de acessibilidade"
        aria-expanded={open}
        className="h-14 w-14 rounded-full bg-gradient-coral text-accent-foreground shadow-playful flex items-center justify-center hover:scale-110 active:scale-95 transition-bounce"
      >
        <Accessibility className="h-7 w-7" />
      </button>
    </div>
  );
};
