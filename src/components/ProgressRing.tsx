interface ProgressRingProps {
  value: number; // 0-100
  label: string;
  color?: "coral" | "wine";
}

export const ProgressRing = ({ value, label, color = "coral" }: ProgressRingProps) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const stroke = color === "coral" ? "hsl(var(--accent))" : "hsl(var(--primary))";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="110" height="110" viewBox="0 0 110 110" className="-rotate-90">
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="55"
            cy="55"
            r={radius}
            stroke={stroke}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-primary">
          {value}%
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
};
