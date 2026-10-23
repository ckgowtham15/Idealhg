import { Injectable, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
import { Order, STEPS } from './models';

@Injectable({ providedIn: 'root' })
export class OrderStore {
  private readonly key = 'ideal-hg-orders';
  /** live clock (1s) used by every running timer */
  readonly now = toSignal(interval(1000).pipe(map(() => Date.now())), { initialValue: Date.now() });
  readonly orders = signal<Order[]>(JSON.parse(localStorage.getItem(this.key) ?? '[]'));

  constructor() {
    effect(() => localStorage.setItem(this.key, JSON.stringify(this.orders())));
  }

  add(v: { customer: string; project: string; product: string }): string {
    const t = Date.now();
    const id = 'ORD-' + t.toString(36).toUpperCase().slice(-5);
    this.orders.update(l => [{ id, ...v, created: t, idx: 0, log: [{ stepId: STEPS[0].id, start: t }] }, ...l]);
    return id;
  }

  remove(id: string) { this.orders.update(l => l.filter(o => o.id !== id)); }

  /** Completes the running step (stamping its end time) and starts the next one. */
  advance(id: string, outcome: 'yes' | 'no', remark: string) {
    const now = Date.now();
    this.orders.update(l => l.map(o => {
      if (o.id !== id || o.closed) return o;
      const step = STEPS[o.idx];
      const decision = step.kind === 'decision';
      const log = o.log.map((e, i) => i === o.log.length - 1
        ? { ...e, end: now, remark, outcome: decision ? outcome : undefined } : e);
      const next = decision && outcome === 'no' ? STEPS.findIndex(s => s.id === step.backTo) : o.idx + 1;
      if (next >= STEPS.length) return { ...o, log, closed: now };
      return { ...o, idx: next, log: [...log, { stepId: STEPS[next].id, start: now }] };
    }));
  }
}
