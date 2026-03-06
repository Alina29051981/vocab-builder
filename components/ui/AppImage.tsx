import Image, { ImageProps } from "next/image";
import { memo } from "react";

const WordsTable = () => {
  ...
};


export default function AppImage(props: ImageProps) {
  return <Image {...props} sizes="(max-width: 768px) 100vw, 50vw" />;
}

export default memo(WordsTable);