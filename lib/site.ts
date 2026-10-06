import { SITE_URL } from './utils';

/** Links back to the main wicklog.in site. Keep in sync with its header/footer. */
export const mainNav = [
  { label: 'Features', href: `${SITE_URL}/#features` },
  { label: 'Ticker AI', href: `${SITE_URL}/features/ticker-ai` },
  { label: 'Tools', href: `${SITE_URL}/tools` },
  { label: 'Pricing', href: `${SITE_URL}/#pricing` },
];

export const footerNav = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: `${SITE_URL}/#features` },
      { label: 'Pricing', href: `${SITE_URL}/#pricing` },
      { label: 'FAQ', href: `${SITE_URL}/#faq` },
      { label: 'About', href: `${SITE_URL}/about` },
      { label: 'Sign up', href: `${SITE_URL}/auth` },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Ticker AI', href: `${SITE_URL}/features/ticker-ai` },
      { label: 'Analytics', href: `${SITE_URL}/features/analytics` },
      { label: 'Backtesting', href: `${SITE_URL}/features/backtesting` },
      { label: 'Trade import', href: `${SITE_URL}/features/trade-import` },
    ],
  },
  {
    title: 'Free tools',
    links: [
      { label: 'Position size calculator', href: `${SITE_URL}/tools/position-size-calculator` },
      { label: 'Risk-reward calculator', href: `${SITE_URL}/tools/risk-reward-calculator` },
      { label: 'Expectancy calculator', href: `${SITE_URL}/tools/trading-expectancy-calculator` },
      { label: 'Journal template', href: `${SITE_URL}/tools/trading-journal-template` },
    ],
  },
];

export const legalNav = [
  { label: 'Terms', href: `${SITE_URL}/terms` },
  { label: 'Privacy', href: `${SITE_URL}/privacy-policy` },
  { label: 'Refunds', href: `${SITE_URL}/refund-policy` },
  { label: 'Cookies', href: `${SITE_URL}/cookie-policy` },
  { label: 'Disclaimer', href: `${SITE_URL}/disclaimer` },
  { label: 'Acceptable use', href: `${SITE_URL}/acceptable-use` },
];

export const SIGNUP_URL = `${SITE_URL}/auth`;
