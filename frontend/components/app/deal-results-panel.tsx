import * as React from 'react';
import type { Deal, DealResultEvent } from '@/hooks/useDealResultEvents';
import { cn } from '@/lib/shadcn/utils';

interface DealResultsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  events: DealResultEvent[];
  hidden?: boolean;
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
                  ranked.map((deal, index) => (
                    <li
                      key={`${id}-${index}`}
                      className="border-border/60 flex items-start gap-2 rounded-md border p-2"
                    >
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
                          <span className="text-foreground font-semibold">{formatPrice(deal)}</span>
                          {index === 0 && (
                            <span className="text-primary text-xs font-medium">Best price</span>
                          )}
                        </span>
                        <span className="text-muted-foreground block truncate leading-snug">
                          {deal.title}
                        </span>
                        {deal.source && (
                          <span className="text-muted-foreground/80 block text-xs">
                            {deal.source}
                          </span>
                        )}
                      </span>
                    </li>
                  ))
                )}
              </ol>
            </details>
          );
        })}
      </div>
    </div>
  );
}
