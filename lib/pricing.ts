import { COMPANY } from '../data/company';

// Izhodiščne cene paketov v EUR, brez DDV. Vrstni red: Osnovni, Poslovni, Premium.
export const PRICES_EXCL_VAT = [490, 990, 1900];
// Splošna stopnja DDV v Sloveniji. Preverite, ali je veljavna, ko spreminjate cene.
export const VAT_RATE = 0.22;

export const formatEur = (amount: number, language: 'sl' | 'en') =>
  new Intl.NumberFormat(language === 'sl' ? 'sl-SI' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

export interface PriceView {
  excl: string;
  incl: string | null; // null, če podjetje ni zavezanec za DDV
}

export const priceView = (index: number, language: 'sl' | 'en'): PriceView => {
  const base = PRICES_EXCL_VAT[index];
  const gross = Math.round(base * (1 + VAT_RATE) * 100) / 100;
  return { excl: formatEur(base, language), incl: COMPANY.vatPayer ? formatEur(gross, language) : null };
};
