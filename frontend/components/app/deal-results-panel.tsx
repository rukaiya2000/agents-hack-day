import * as React from 'react';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import type { Deal, DealResultEvent } from '@/hooks/useDealResultEvents';
import { cn } from '@/lib/shadcn/utils';

function hostname(url?: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

interface DealResultsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  events: DealResultEvent[];
  hidden?: boolean;
  /**
   * Notified when the user clicks a listing, so the agent knows what "this
   * one" refers to. Fires alongside — never instead of — opening the link.
   */
  onDealSelect?: (deal: Deal) => void;
}

function formatPrice(deal: Deal): string {
  if (typeof deal.price === 'number') {
    return deal.price % 1 === 0 ? `$${deal.price.toFixed(0)}` : `$${deal.price.toFixed(2)}`;
  }
  return deal.priceText ?? '—';
}

export function DealResultsPanel({
  events,
  hidden = false,
  onDealSelect,
  className,
  ...props
}: DealResultsPanelProps) {
  if (hidden || events.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
        Best Prices
      </h3>
      <div className="space-y-2">
        {events.map(({ id, query, count, deals }) => {
          const ranked = deals.slice(0, 5);
          return (
            <details
              key={id}
              className="border-border bg-card text-card-foreground rounded-lg border p-3 shadow-sm"
              open
            >
              <summary className="cursor-pointer text-sm font-semibold">
                {query}
                <span className="text-muted-foreground ml-2 text-xs">
                  {count} {count === 1 ? 'listing' : 'listings'}
                </span>
              </summary>
              <ol className="mt-2 space-y-2 text-sm">
                {ranked.length === 0 ? (
                  <li className="text-muted-foreground italic">No listings found.</li>
                ) : (
                  ranked.map((deal, index) => {
                    const label = deal.source ?? hostname(deal.url);
                    const rowContent = (
                      <>
                        <span
                          className={cn(
                            'mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded px-1 text-xs font-semibold',
                            index === 0
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="flex items-baseline gap-1.5">
                              <span className="text-foreground font-semibold">
                                {formatPrice(deal)}
                              </span>
                              {deal.verified === true && (
                                <span
                                  title="Price confirmed on the listing page"
                                  className="text-primary inline-flex items-center gap-0.5 text-[10px] font-medium"
                                >
                                  <BadgeCheck className="size-3" />
                                  verified
                                </span>
                              )}
                              {deal.verified === false && (
                                <span
                                  title="This price was not found on the listing page — double-check it"
                                  className="text-muted-foreground/70 text-[10px]"
                                >
                                  unconfirmed
                                </span>
                              )}
                            </span>
                            {index === 0 && (
                              <span className="text-primary text-xs font-medium">Best price</span>
                            )}
                          </span>
                          <span className="text-muted-foreground block truncate leading-snug">
                            {deal.title}
                          </span>
                          {label && (
                            <span className="text-primary/90 mt-0.5 flex items-center gap-0.5 text-xs">
                              {label}
                              {deal.url && <ArrowUpRight className="size-3" />}
                            </span>
                          )}
                        </span>
                      </>
                    );

                    return (
                      <li key={`${id}-${index}`}>
                        {deal.url ? (
                          <a
                            href={deal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Open listing: ${deal.title}`}
                            onClick={() => onDealSelect?.(deal)}
                            className="border-border/60 hover:border-primary/50 hover:bg-muted/40 flex items-start gap-2 rounded-md border p-2 transition-colors"
                          >
                            {rowContent}
                          </a>
                        ) : onDealSelect ? (
                          // No link to open, but selecting it still lets the
                          // user say "watch this one" about it.
                          <button
                            type="button"
                            title={`Select listing: ${deal.title}`}
                            onClick={() => onDealSelect(deal)}
                            className="border-border/60 hover:border-primary/50 hover:bg-muted/40 flex w-full items-start gap-2 rounded-md border p-2 text-left transition-colors"
                          >
                            {rowContent}
                          </button>
                        ) : (
                          <div className="border-border/60 flex items-start gap-2 rounded-md border p-2">
                            {rowContent}
                          </div>
                        )}
                      </li>
                    );
                  })
                )}
              </ol>
            </details>
          );
        })}
      </div>
    </div>
  );
}
