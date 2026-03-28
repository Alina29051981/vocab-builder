// lib/validation/utils.ts
export function validateVerbEn(en: string, isIrregular: boolean): boolean {
  if (!isIrregular) return true; 

   const regex = /^[A-Za-z'-]+-[A-Za-z'-]+$/;
  return regex.test(en.trim());
}