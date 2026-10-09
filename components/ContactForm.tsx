import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ROUTES } from '../routes';

interface Props {
  initialProject?: string;
  initialDetails?: string;
}

const inputClass =
  'w-full bg-[var(--bg-main)] border border-[var(--border-color)] p-4 text-[var(--text-main)] focus:outline-none focus:border-[var(--text-main)]/50 focus:bg-[var(--text-main)]/5 transition-all duration-300 placeholder-[var(--text-muted)]';
const labelClass = 'text-xs font-bold uppercase tracking-widest text-[var(--text-main)] mb-2 block';

const ContactForm: React.FC<Props> = ({ initialProject = '', initialDetails = '' }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', project: initialProject, details: initialDetails, website: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData((p) => ({ ...p, project: initialProject || p.project, details: initialDetails || p.details }));
  }, [initialProject, initialDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          website: formData.website,
          lang: language,
          message: `${t.contact.labels.project}: ${formData.project}\n\n${formData.details}`,
        }),
      });

      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.error || t.contact.errorGeneric);
      }

      setStatus('success');
      setFormData({ name: '', email: '', project: '', details: '', website: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error && error.message ? error.message : t.contact.errorGeneric);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="cf-name" className={labelClass}>{t.contact.labels.name}</label>
          <input id="cf-name" name="name" type="text" autoComplete="name" maxLength={120} value={formData.name} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>{t.contact.labels.email}</label>
          <input id="cf-email" name="email" type="email" autoComplete="email" maxLength={200} value={formData.email} onChange={handleChange} required className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="cf-project" className={labelClass}>{t.contact.labels.project}</label>
        <input id="cf-project" name="project" type="text" maxLength={200} value={formData.project} onChange={handleChange} required className={inputClass} />
      </div>

      <div>
        <label htmlFor="cf-details" className={labelClass}>{t.contact.labels.details}</label>
        <textarea id="cf-details" name="details" rows={6} maxLength={4000} value={formData.details} onChange={handleChange} required className={`${inputClass} resize-none`} />
      </div>

      {/* Honeypot: ljudje ga ne vidijo */}
      <div className="absolute left-[-9999px] h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
      </div>

      <button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="w-full py-6 bg-[var(--text-main)] text-[var(--bg-main)] font-display font-bold uppercase tracking-[0.2em] hover:bg-[var(--text-secondary)] disabled:bg-[var(--text-muted)] disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 group"
      >
        {status === 'loading' ? (
          <><Loader2 size={20} className="animate-spin" />{t.contact.sending}</>
        ) : status === 'success' ? (
          <><CheckCircle size={20} />{t.contact.sent}</>
        ) : (
          <>{t.contact.send}<ArrowUpRight size={20} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" /></>
        )}
      </button>

      <p className="text-xs text-[var(--text-muted)]">
        {t.contact.consent} <Link to={ROUTES.privacy} className="underline hover:text-[var(--text-main)]">{t.contact.privacyLink}</Link>.
      </p>

      <div role="status" aria-live="polite">
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 border border-[var(--c1)] text-[var(--c1)] text-sm text-center">
            {t.contact.thanks}
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 border border-[var(--c4)] text-[var(--c4)] text-sm text-center flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            {errorMessage}
          </motion.div>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
