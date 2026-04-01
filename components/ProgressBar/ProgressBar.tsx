// app/components/ProgressBar/ProgressBar.tsx
import styles from "./ProgressBar.module.css";

type Props = {
  percent: number;
  variant?: "training" | "table";
};

export default function ProgressBar({ percent, variant = "table" }: Props) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;

  const safePercent =
    isNaN(percent) || percent < 0 ? 0 : percent > 100 ? 100 : percent;

  const offset = circumference - (circumference * safePercent) / 100;

  return (
   <div className={`${styles.wrapper} ${variant === "table" ? styles.tableWrapper : ""}`}>
  {variant === "table" && <span className={styles.percent}>{safePercent}%</span>}

  <svg viewBox="0 0 26 26" className={styles.circle}>
    <circle
      cx="13"
      cy="13"
      r={radius}
      stroke="#eee"
      strokeWidth="2"
      fill="none"
    />
    <circle
      cx="13"
      cy="13"
      r={radius}
      stroke="#85aa9f"
      strokeWidth="2"
      fill="none"
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      strokeLinecap="round"
      transform="rotate(-90 13 13)"
    />

    {variant === "training" && (
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.insideText}
      >
        {safePercent}
      </text>
    )}
  </svg>
</div>
  );
}