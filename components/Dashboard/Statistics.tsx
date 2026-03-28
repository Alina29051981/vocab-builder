// components/Dashboard/Statistics.tsx

type Props = {
  totalWords: number;
};

export default function Statistics({ totalWords }: Props) {
  return <div>To study: {totalWords}</div>;
}