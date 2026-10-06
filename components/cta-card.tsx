import { SIGNUP_URL } from '@/lib/site';

export function CtaCard() {
  return (
    <div className="rounded-2xl border border-primary/20 bg-accent/50 p-5">
      <p className="font-serif text-xl font-medium leading-snug text-foreground">Find the patterns costing you money</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Import your Zerodha, Dhan, Groww or Angel One trades and see your real win rate, expectancy and charges.
      </p>
      <a
        href={SIGNUP_URL}
        className="mt-4 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover"
      >
        Start free
      </a>
      <p className="mt-2 text-xs text-muted-foreground">No credit card · Read-only broker access</p>
    </div>
  );
}
