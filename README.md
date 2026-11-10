# kb — the support knowledge base

**kb** = knowledge base. What the support desk knows about how our products break, written
down where the code can keep it honest.

One desk takes reports for every product we run: `sched-prod` (calendar invites for about
300k people) and the rest. When something
goes wrong, the reports reach the desk first. This kb is how the desk triages them, what each
incident turned out to be, and why we decided what we decided.

## What's here

```
src/routes/kb/      the pages (.svx: Markdown with components)
  triage/           how the desk handles incoming reports
  incidents/        one page per big ticket
  decisions/        numbered decision records
src/lib/kb/         components and the logic they run
src/lib/layouts/    the frame every page shares
src/lib/data/       exports from the ticket system
```

## Conventions

- Words in the page, logic in `src/lib` (imported as `#lib/…`). A number that can be computed belongs in a component.
- Every page starts with frontmatter: `title`, `owner`, `status`, `reviewed`.
- A decision is never edited after it is accepted. A new record replaces it.
- A page you add is signed: its frontmatter carries your `signature` and it ends with `<RenderStamp {signature} />`, so the desk knows who wrote it.

## Owners

Support desk. Decision records: whoever signed them.

---

Exported 2026-10-04 from the `support` repo, `apps/kb/` → `src/`.

## In this copy

- `src/routes/kb/incidents/4471-split/+page.svx`: a signed page that splits #4471 into the problems its reports describe.
- `src/lib/kb/problems.ts` and `src/lib/kb/ProblemTable.svelte`: the logic and the table that the page uses. The page types no counts.
- `rendered/`: the kb built to static HTML. `rendered/kb/incidents/4471-split.html` is the page as the desk sees it, and `rendered/4471-split.png` is a screenshot of it.
- The tickets are the issues of this repo, one per problem.

To build the kb again: `npm install`, then `npm run build`. The build setup (`package.json`, `svelte.config.js`, `vite.config.js`, `src/app.html`, `src/routes/+layout.js`) is not part of the export.
