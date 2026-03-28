// app/components/ProgressBar/ProgressBar.tsx
import styles from "./ProgressBar.module.css";

type Props = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: Props) {
  const percent = total ? Math.round((current / total) * 100) : 0;

  const radius = 12; 
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * percent) / 100;

  return (
    <div className={styles.wrapper}>
     
      <span className={styles.percent}>{percent}%</span>

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
        />
      </svg>
    </div>
  );
}