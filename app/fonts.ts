// app/fonts.ts
import localFont from "next/font/local";

export const myFonts = localFont({
  src: [
    
    { path: "../public/fonts/MacPawFixelDisplay-Thin.otf", weight: "100", style: "normal" },
    { path: "../public/fonts/MacPawFixelDisplay-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/MacPawFixelDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/MacPawFixelDisplay-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/MacPawFixelDisplay-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/MacPawFixelDisplay-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/MacPawFixelDisplay-ExtraBold.otf", weight: "800", style: "normal" },

    
    { path: "../public/fonts/SF-Pro-Display-Ultralight.otf", weight: "200", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Thin.otf", weight: "100", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Semibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Heavy.otf", weight: "800", style: "normal" },
    { path: "../public/fonts/SF-Pro-Display-Black.otf", weight: "900", style: "normal" },

   
    { path: "../public/fonts/SF-Pro-Display-RegularItalic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-MediumItalic.otf", weight: "500", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-SemiboldItalic.otf", weight: "600", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-HeavyItalic.otf", weight: "800", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-BlackItalic.otf", weight: "900", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-LightItalic.otf", weight: "300", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "../public/fonts/SF-Pro-Display-UltralightItalic.otf", weight: "200", style: "italic" },
  ],

  variable: "--font-main",
  display: "swap",
});