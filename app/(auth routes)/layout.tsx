// app/(auth routes)/layout.tsx
"use client";

import Image from "next/image";
import css from "./AuthLayout.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={css.wrapper}>
      <div className={css.container}>
       
        <div className={css.logo}>
          <svg width="36" height="36">
            <use href="#icon" />
          </svg>
          <p className={css.text}>VocabBuilder</p>
        </div>

                <div className={`${css.illustration} ${css.mobile}`}>
          <Image
            src="/image.webp"
            alt="Learning illustration mobile"
            width={247}
            height={191}
            priority
          />
        
        </div>
  <p className={css.mobileText}>
  Word · Translation · Grammar · Progress
</p>
               {children}
        <p className={css.desktopText}>
  Word · Translation · Grammar · Progress
</p>
      </div>

            <div className={`${css.illustration} ${css.desktop}`}>
        <div className={css.imageWrapper}>
          <Image
            src="/image.webp"
            alt="Learning illustration desktop"
            width={498}
            height={435}
            priority
          />
        </div>
         <p className={css.tabletText}>
        Word · Translation · Grammar · Progress
      </p>
      </div>

      <svg
        className={css.bgGradient}
        viewBox="0 0 564 466"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="bg-gradient"
            x1="543.72"
            y1="395.96"
            x2="281.79"
            y2="223.489"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#85AA9F" stopOpacity="0.51" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M58.7119 2.23114e-05L754.006 75.8887L508.059 629.844L2.1427e-05 235.481L58.7119 2.23114e-05Z"
          fill="url(#bg-gradient)"
        />
      </svg>
    </div>
  );
}