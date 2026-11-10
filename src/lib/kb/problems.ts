// How a merged ticket splits into the problems its reports describe. Pages explain it; this file is what runs.
//
// It counts the way the desk's cause table (CauseTable.svelte) counts:
// - a report counts under its cause, from the tenant: its locale and its booking form (`causeOf` in
//   causes.ts), never from intake's tag;
// - a report the desk read as a one-day move (desk-notes.json) stays counted where it is filed, and it
//   counts again under `one-day`, its own problem.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

// Table order: the ticket's own problem first.
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'one-day', 'unplaced'];

export function problemsOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem[] {
  const filed: Problem = causeOf(r, t) ?? 'unplaced';
  return oneDayMove.includes(r.id) ? [filed, 'one-day'] : [filed];
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  // What intake tagged these reports as: tag → count.
  taggedAs: Record<string, number>;
  channels: Record<string, number>;
  tenants: number;
  firstSeen: string;
  lastSeen: string;
};

const tally = (xs: string[]) => xs.reduce<Record<string, number>>((n, x) => ({ ...n, [x]: (n[x] ?? 0) + 1 }), {});

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { merged: Report[]; groups: ProblemGroup[]; countedTwice: Report[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const problems = new Map(merged.map((r) => [r.id, problemsOf(r, tenantOf(r), oneDayMove)]));
  const groups = PROBLEMS.map((problem) => {
    const reports = merged.filter((r) => problems.get(r.id)!.includes(problem));
    const days = reports.map((r) => r.receivedAt.slice(0, 10)).sort();
    return {
      problem,
      reports,
      taggedAs: tally(reports.map((r) => r.meta.intakeTag)),
      channels: tally(reports.map((r) => r.channel)),
      tenants: new Set(reports.map((r) => r.tenant)).size,
      firstSeen: days[0],
      lastSeen: days[days.length - 1],
    };
  }).filter((g) => g.reports.length > 0);
  const countedTwice = merged.filter((r) => problems.get(r.id)!.length > 1);
  return { merged, groups, countedTwice };
}
