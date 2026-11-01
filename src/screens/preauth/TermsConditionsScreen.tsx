import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  ShieldCheck,
  Building2,
  CreditCard,
  Lock,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Printer,
  Sparkles,
} from 'lucide-react';

interface PolicySection {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  summary: string;
  bullets: string[];
}

const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'tos',
    title: 'Terms of Service',
    badge: 'Platform Rules',
    icon: FileText,
    summary: 'Governs access to FEEDO Restaurant Partner app, merchant POS services, and order fulfillment systems.',
    bullets: [
      'Restaurant partners agree to maintain active business licenses, valid FSSAI certification, and local health permits at all times.',
      'Partner agrees to acknowledge and confirm incoming orders within 60 seconds during operational store hours.',
      'Committed food preparation times must accurately reflect kitchen capacity (standard 12–20 minutes) to prevent delivery partner delays.',
      'All menu items listed must adhere to declared dietary tags (Pure Veg, Non-Veg, Egg, Vegan) and allergy disclosures.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    badge: 'Data Security',
    icon: ShieldCheck,
    summary: 'Ensures strict protection of partner operational records, bank details, and business telemetry.',
    bullets: [
      'Commercial data, financial records, and operational telemetry are stored using industry-grade 256-bit encryption.',
      'FEEDO strictly will not sell, rent, or lease partner business data or proprietary recipes to third parties or advertising brokers.',
      'Telemetry data is used exclusively to optimize kitchen dispatch algorithms, reduce delivery times, and automate payouts.',
      'Partner access is secured via 2-Factor Authentication (OTP), cryptographic session keys, and strict Row Level Security (RLS).',
    ],
  },
  {
    id: 'partner_agreement',
    title: 'Restaurant Partner Agreement',
    badge: 'Commercial Terms',
    icon: Building2,
    summary: 'Master operational SLA standards and marketplace partnership terms between FEEDO and the Restaurant Partner.',
    bullets: [
      'Grants FEEDO the non-exclusive authorization to display restaurant branding, menu items, and pricing across the consumer app.',
      'Restaurant retains full autonomous ownership over menu item additions, pricing, discounts, and opening/closing hours.',
      'Partner commits to using hygienic, tamper-evident packaging and thermal seals for all orders handed over to delivery partners.',
      'Dedicated FEEDO Partner Support and Merchant Dispatch Desks are available 24/7 to resolve live kitchen or rider queries.',
    ],
  },
  {
    id: 'payment_policy',
    title: 'Payment and Commission Policy',
    badge: 'Daily Settlements',
    icon: CreditCard,
    summary: 'Automated 10:00 AM daily NEFT bank payouts, transparent commission deductions, and zero hidden transaction fees.',
    bullets: [
      'All net earnings from fulfilled orders are automatically settled daily at 10:00 AM IST via direct NEFT/IMPS bank transfer.',
      'Platform commission rates are fixed transparently according to agreed merchant category tiers with zero unexpected surcharges.',
      'Itemized settlement invoices, GST tax deductions, and transaction-level breakdowns are accessible anytime in your Finance Ledger.',
      'Bank account changes require dual-factor verification and take effect after 1 business day for maximum merchant safety.',
    ],
  },
  {
    id: 'data_protection',
    title: 'Customer Data Protection',
    badge: 'Privacy Compliance',
    icon: Lock,
    summary: 'Enforces masked virtual numbers and prohibits unauthorized storage or commercial solicitation of customer details.',
    bullets: [
      'Customer phone numbers are permanently masked via virtual routing relays; direct personal contact numbers are never exposed.',
      'Restaurant partners and kitchen staff are strictly prohibited from copying, storing, or exporting customer contact information.',
      'Customer delivery addresses and notes may only be used for immediate order fulfillment and food delivery verification.',
      'Full compliance with the Digital Personal Data Protection (DPDP) Act and standard Indian consumer confidentiality guidelines.',
    ],
  },
  {
    id: 'cancellation_refund',
    title: 'Cancellation and Refund Policy',
    badge: '100% Payout Protection',
    icon: RotateCcw,
    summary: 'Comprehensive 100% kitchen payout protection once preparation starts; customer refunds absorbed by FEEDO.',
    bullets: [
      '100% Kitchen Payout Guarantee: Once order preparation begins ("In Food Preparation"), the restaurant receives full payout even if the customer cancels.',
      'Customer compensations, coupon credits, and cancellation goodwill are absorbed by FEEDO Support without deducting from the restaurant ledger.',
      'If an assigned FEEDO rider is delayed beyond 10 minutes, FEEDO Dispatch reassigns the order with zero penalty to the restaurant score.',
      'Item out-of-stock cancellations should be reported immediately through the dashboard to trigger automated customer refunds.',
    ],
  },
];

export const TermsConditionsScreen: React.FC = () => {
  const { setScreen, showToast } = useApp();
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>('tos');

  const toggleSection = (id: string) => {
    setExpandedSectionId((prev) => (prev === id ? null : id));
  };

  const handleContinue = () => {
    if (!hasAcceptedTerms) {
      showToast('Please check the box to agree to the Terms & Conditions and Privacy Policy.', 'error');
      return;
    }

    const timestamp = new Date().toISOString();
    localStorage.setItem('feedo_terms_accepted', 'true');
    localStorage.setItem('feedo_terms_accepted_at', timestamp);

    showToast('Terms & Conditions accepted. Please review app permissions.', 'success');
    setScreen('permissions');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10 mb-6">
        {/* Brand Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shadow-xs shrink-0">
              <img
                src="/feedo-logo.png"
                alt="FEEDO"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 font-heading">
                  FEEDO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-md">
                  Partner
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Terms of Service & Partner Agreements
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Partner Agreement</span>
            </span>
          </div>
        </div>

        {/* Introduction Notice */}
        <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl mb-6 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 leading-relaxed">
            <strong className="text-amber-900 font-bold block mb-0.5">Welcome to FEEDO Restaurant Partner Network</strong>
            Before accessing the restaurant partner portal and order management system, please review and accept our partner agreements, commission policies, and customer privacy guarantees.
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black text-emerald-700 block">100% Payout</span>
            <span className="text-[10px] text-slate-500 font-medium">Food Prep Protected</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black text-feedo-600 block">10:00 AM</span>
            <span className="text-[10px] text-slate-500 font-medium">Daily NEFT Settlement</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black text-indigo-700 block">Masked Numbers</span>
            <span className="text-[10px] text-slate-500 font-medium">Customer Privacy</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-black text-slate-800 block">Zero Hidden Fees</span>
            <span className="text-[10px] text-slate-500 font-medium">Transparent Ledger</span>
          </div>
        </div>

        {/* Policy Sections Accordion */}
        <div className="space-y-3 mb-8">
          {POLICY_SECTIONS.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSectionId === section.id;

            return (
              <div
                key={section.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left bg-white hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Icon className="w-4 h-4 text-slate-800" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xs sm:text-sm font-bold text-slate-900">
                          {section.title}
                        </h2>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                          {section.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {section.summary}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 pb-4 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                    <ul className="space-y-1.5 list-disc list-inside text-slate-700 pl-1">
                      {section.bullets.map((bullet, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="text-slate-700">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mandatory Agreement Checkbox */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-feedo-50/30 to-amber-50/30 border-2 border-feedo-200 rounded-2xl mb-6">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              id="feedo-terms-checkbox"
              checked={hasAcceptedTerms}
              onChange={(e) => setHasAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-5 w-5 rounded-md border-slate-300 text-feedo-600 focus:ring-feedo-500 cursor-pointer accent-feedo-600 shrink-0"
            />
            <div className="text-xs sm:text-sm text-slate-800 leading-snug">
              <span className="font-bold text-slate-900 block sm:inline">
                I have read and agree to the Terms &amp; Conditions and Privacy Policy.
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                By ticking this box, you confirm that you are an authorized representative of the restaurant and accept the partner agreement, payment settlement terms, customer data privacy rules, and cancellation policies.
              </p>
            </div>
          </label>
        </div>

        {/* Continue Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-[11px] text-slate-500 text-center sm:text-left flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Digital partner agreement is securely recorded and timestamped.</span>
          </div>

          <button
            type="button"
            id="terms-continue-btn"
            disabled={!hasAcceptedTerms}
            onClick={handleContinue}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              hasAcceptedTerms
                ? 'bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white shadow-lg shadow-feedo-500/25 active:scale-98'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
            }`}
          >
            <span>Agree &amp; Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-3xl mx-auto w-full text-center text-xs text-slate-400 py-2">
        FEEDO Technologies Private Limited &bull; Restaurant Partner Services &bull; Support: partner@feedodelivery.com
      </div>
    </div>
  );
};

export default TermsConditionsScreen;
