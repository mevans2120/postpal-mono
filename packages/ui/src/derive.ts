import type { DayContent, MedRail, Next } from '@postpal/content';

export interface DayView {
  medrail: MedRail | undefined;
  next: Next;
  medsLine: string | undefined;
}

/* Pure port of the prototype's logNowDose() (daybook.html lines 635–675):
   strike the NOW dose into the done group, promote the first LATER row into
   NOW, and point next at the following dose. Operates on the mutable clones. */
function applyOneDose(rail: MedRail, next: Next, medsLine: string | undefined): string | undefined {
  const nowGroup = rail.groups.find((g) => g.now);
  if (!nowGroup || !nowGroup.rows.length) return medsLine;
  const [tm, name] = nowGroup.rows.shift()!;
  let doneGroup = rail.groups.find((g) => g.done);
  if (!doneGroup) {
    doneGroup = { label: 'EARLIER TODAY', rows: [], done: true };
    rail.groups.unshift(doneGroup);
  }
  doneGroup.label = 'EARLIER TODAY'; /* "THIS MORNING" no longer covers a 1:00 dose */
  doneGroup.rows.push([tm, name.split('|')[0], 'taken just now ✓']);
  /* first remaining scheduled (non-PRN) row becomes the NOW dose */
  const laterGroup = rail.groups.find(
    (g) => !g.done && !g.now && g.rows.length && g.rows[0][0] !== 'PRN'
  );
  let promoted: [string, string, string] | null = null;
  if (laterGroup) {
    promoted = laterGroup.rows.shift()!;
    if (!laterGroup.rows.length) rail.groups.splice(rail.groups.indexOf(laterGroup), 1);
    nowGroup.rows.push([promoted[0], promoted[1], 'LOG']);
    nowGroup.label = 'NEXT · LATER TODAY';
    next.label = promoted[1].split('|')[0];
    next.sub = `${promoted[0]} · later today`;
  } else {
    rail.groups.splice(rail.groups.indexOf(nowGroup), 1);
    /* terminal: the schedule is finished — don't leave the last medicine's
       name in the Next slot; flip it to a calm pine milestone instead */
    next.label = 'Medicines done';
    next.sub = 'nothing more until morning'; /* the label already says "done" — don't double it */
    next.tone = 'pine';
  }
  /* keep the page's meds chapter in step with the rail */
  if (medsLine !== undefined) {
    const counts = medsLine.match(/^(\d+) of (\d+) doses taken/);
    if (counts) {
      medsLine = promoted
        ? `${Number(counts[1]) + 1} of ${counts[2]} doses taken · next: ` +
          `${promoted[1].split('|')[0].replace(/^./, (c) => c.toLowerCase())} at ${promoted[0]}`
        : 'All scheduled doses taken today';
    }
  }
  return medsLine;
}

export function deriveDayView(day: DayContent, logged: number): DayView {
  const medrail: MedRail | undefined = day.medrail && structuredClone(day.medrail);
  const next: Next = structuredClone(day.next);
  let medsLine = day.meds?.line;
  for (let i = 0; i < logged && medrail; i++) {
    medsLine = applyOneDose(medrail, next, medsLine);
  }
  return { medrail, next, medsLine };
}
