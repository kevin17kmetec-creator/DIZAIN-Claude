import React from 'react';
import { COMPANY } from '../data/company';
import { useLanguage } from '../contexts/LanguageContext';

// Zakonsko obvezni podatki o ponudniku v nogi strani. Prazna polja se ne prikažejo.
const LegalLine: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useLanguage();
  const l = t.legal.labels;
  const parts = [
    `${COMPANY.legalName}, ${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}`,
    `${l.reg}: ${COMPANY.registrationNumber}`,
    `${l.tax}: ${COMPANY.taxNumber}`,
    COMPANY.vatId && `${l.vat}: ${COMPANY.vatId}`,
    COMPANY.shareCapital && `${l.capital}: ${COMPANY.shareCapital}`,
    COMPANY.register && `${l.register}: ${COMPANY.register}`,
    COMPANY.representative && `${l.rep}: ${COMPANY.representative}`,
  ].filter(Boolean) as string[];
  return <p className={className}>{parts.join(' · ')}</p>;
};

export default LegalLine;
