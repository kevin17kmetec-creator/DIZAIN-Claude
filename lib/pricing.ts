import { COMPANY } from '../data/company';

// Cene paketov v EUR, ki VKLJUČUJEJO DDV (tako so prikazane obiskovalcu). Vrstni red: Osnovni, Poslovni, Premium.
export const PRICES_INCL_VAT = [490, 990, 1900];
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
  main: string; // cena z DDV, prikazana veliko
  net: string | null; // znesek brez DDV (manjši zapis), null če podjetje ni zavezanec za DDV
}

export const priceView = (index: number, language: 'sl' | 'en'): PriceView => {
  const gross = PRICES_INCL_VAT[index];
  const net = Math.round((gross / (1 + VAT_RATE)) * 100) / 100;
  return { main: formatEur(gross, language), net: COMPANY.vatPayer ? formatEur(net, language) : null };
};
