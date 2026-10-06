/**
 * Permanent redirects for posts merged into a stronger post on the same topic.
 * Paths are relative to basePath (/blog). Never delete an entry: old URLs live
 * on in search results, backlinks and shared messages.
 */
module.exports = [
  // 2026-10-06: duplicate-topic posts consolidated
  { source: '/daily-trading-lessons-journal', destination: '/daily-trading-lessons' },
  { source: '/tradingview-backtest-net-profit-inflated', destination: '/tradingview-backtest-accuracy' },
  { source: '/scaling-out-50-percent-profit-booking-math', destination: '/partial-profit-booking-scaling-out' },
  { source: '/win-rate-by-hour', destination: '/win-rate-by-hour-intraday-trading-india' },
  { source: '/1-percent-risk-rule-position-sizing', destination: '/position-size-nifty-bank-nifty-lots-1-percent-rule' },
];
