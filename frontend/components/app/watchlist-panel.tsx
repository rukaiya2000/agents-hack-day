import * as React from 'react';
import { ArrowUpRight, Bell, Eye, TrendingDown } from 'lucide-react';
import type { Watch } from '@/hooks/useWatchlistEvents';
import { cn } from '@/lib/shadcn/utils';

interface WatchlistPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /** null = never received a watchlist yet (panel stays hidden) */
  watches: Watch[] | null;
}

function money(value: number): string {
  return value % 1 === 0 ? `$${value.toFixed(0)}` : `$${value.toFixed(2)}`;
}

export function WatchlistPanel({ watches, className, ...props }: WatchlistPanelProps) {
  // Hide entirely until the agent has published a watchlist at least once.
  if (watches === null) {
    return null;
  }

  return (
    <div className={cn('space-y-3', className)} {...props}>
      <h3 className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium tracking-wide uppercase">
        <Eye className="size-3.5" />
        Watching
        {watches.length > 0 && (
          <span className="text-muted-foreground/70 normal-case">({watches.length})</span>
        )}
      </h3>

      {watches.length === 0 ? (
        <p className="text-muted-foreground border-border bg-card rounded-lg border border-dashed p-3 text-sm">
          Nothing on the watchlist yet. Say{' '}
          <span className="text-foreground font-medium">
            &ldquo;watch this and tell me if it drops below 130&rdquo;
          </span>
          .
        </p>
      ) : (
        <ul className="space-y-2">
          {watches.map((watch, index) => {
            const { targetPrice: target, currentPrice: current } = watch;
            const hitTarget = target !== null && current !== null && current <= target;
            const gap = target !== null && current !== null ? current - target : null;

            return (
              <li
                key={`${watch.product}-${index}`}
                className={cn(
                  'bg-card text-card-foreground rounded-lg border p-3 shadow-sm',
                  hitTarget ? 'border-primary/60 ring-primary/20 ring-1' : 'border-border'
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1 text-sm leading-snug font-medium">
                    {watch.product}
                  </span>
                  {hitTarget && (
                    <span className="bg-primary text-primary-foreground flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold">
                      <TrendingDown className="size-3" />
                      Target hit
                    </span>
                  )}
                </div>

                {/* current price vs target */}
                <div className="mt-2 flex items-baseline gap-2">
                  {current !== null ? (
                    <span
                      className={cn(
                        'text-base font-semibold',
                        hitTarget ? 'text-primary' : 'text-foreground'
                      )}
                    >
                      {money(current)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">Price not checked yet</span>
                  )}
                  {target !== null && (
                    <span className="text-muted-foreground text-xs">target {money(target)}</span>
                  )}
                  {gap !== null && gap > 0 && (
                    <span className="text-muted-foreground/80 text-xs">{money(gap)} to go</span>
                  )}
                </div>

                <div className="text-muted-foreground mt-1.5 flex items-center gap-1 text-xs">
                  <Bell className="size-3" />
                  {target !== null ? `Alert under ${money(target)}` : 'Watching for any drop'}
                  {watch.currentSource && <span className="ml-1">· {watch.currentSource}</span>}
                </div>

                {watch.currentUrl && (
                  <a
                    href={watch.currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary mt-2 inline-flex items-center gap-0.5 text-xs font-medium hover:underline"
                  >
                    View listing
                    <ArrowUpRight className="size-3" />
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
