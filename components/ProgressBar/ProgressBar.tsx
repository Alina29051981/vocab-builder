// app/components/ProgressBar/ProgressBar.tsx
import styles from "./ProgressBar.module.css";

type Props = {
  percent: number;
  className?: string;
};

export default function ProgressBar({ percent }: Props) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;

  // Захист від NaN
  const safePercent = isNaN(percent) || percent < 0 ? 0 : percent > 100 ? 100 : percent;
  const offset = circumference - (circumference * safePercent) / 100;

  return (
    <div className={styles.wrapper}>
      <span className={styles.percent}>{safePercent}%</span>

      <svg width="26" height="26" viewBox="0 0 26 26" className={styles.circle}>
        <circle
          cx="13"
          cy="13"
          r={radius}
          stroke="#D4F8D3"
          strokeWidth="2"
          fill="none"
        />

        <circle
          cx="13"
          cy="13"
          r={radius}
          stroke="#2BD627"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 13 13)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
    </div>
  );
}