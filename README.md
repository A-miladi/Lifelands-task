## Approach

AI tools were used selectively, as **scaffolding aids and second opinions**,
not as authors. Every architectural decision, TypeScript model, and
component was written by me. Where AI contributed, it accelerated specific
tasks: enumerating edge cases, explaining unfamiliar React APIs, and
formalizing statistical reasoning.

This document lists which tools were used for which tasks, with the actual
prompts and how I validated or overrode the output.

---

## Tools

| Tool         | Purpose                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------- |
| **Claude**   | Decomposition of the assignment into a requirement checklist                             |
| **DeepSeek** | Targeted help on: search/filter clearing, unit tests, bot detection, particle background |

---

## 1. Assignment Decomposition — Claude

Before writing code, I asked Claude to enumerate every requirement, warning,
and grading criterion from the assignment text.

**Prompt:**

> "Here is a frontend technical assignment. Read it carefully and produce:
> (1) a checklist of every functional requirement with an ID,
> (2) every 'critical' item flagged as non-negotiable,
> (3) every warning that could cause rejection,
> (4) the exact list of deliverables.
> Do not summarize. Do not interpret. List literally."

**Output used:** A 30-item checklist that became the project's working TODO.

**Rejected:** Claude suggested shadcn/ui for faster UI. The assignment
explicitly forbids prebuilt templates — I built every UI primitive from
scratch.

---

## 2. Search & Filter Clearing — DeepSeek

**Prompt 1 — Debounced search:**

> "I'm building a search input in React 19 that debounces user input by
> 300ms. The debounced value must be lifted to a parent. React 19 flags
> `setState` inside `useEffect` as a cascading-render anti-pattern. How do
> I write a debounce hook that avoids this?"

**Prompt 2 — Clearing multiple URL params:**

> "I have a `useUrlState(key, defaultValue)` hook built on Next.js
> `useSearchParams` and `router.replace`. When I call six setters in
> sequence to clear all filters, only the last one is applied. Explain why,
> and show me two fixes: one reading live URL state, one using `useRef`."

**Output used:** The stale-snapshot diagnosis was correct. I adopted:

- `useDebounce` with effect only managing the timer.
- `useUrlState` setter reads `window.location.search` directly.
- `clearFilters` uses a `useRef`-batching pattern to apply all changes in
  one `router.replace`.

**Rewritten:** The initial `useDebounce` still triggered React 19's warning.
I rewrote it using the derived-state-during-render pattern.

---

## 3. Unit Tests — DeepSeek

**Prompt:**

> "Below is my `normalizePersian` function [paste]. It unifies ی/ي, ک/ك,
> converts Persian/Arabic digits to Latin, removes ZWNJ and tatweel, and
> collapses whitespace. I've tested the happy path. Enumerate edge cases I
> might have missed — do not write assertions yet. Focus on: Arabic vs
> Persian Unicode ranges, mixed digits, tatweel in the middle of words."

**Output used:** A list of 14 edge cases. I turned 12 into assertions and
discarded 2 as unreachable from API data.

---

## 4. Type Derivation

I fetched the live API with `curl`, inspected the response, and derived
every field manually. AI was not used to invent or copy the `Game` type.

I did use DeepSeek as a **reviewer** to check whether I'd missed any
nested fields worth keeping. Its suggestions were limited to flagging
Mongoose internals (`__v`, `reviewHistory`) — I rejected both as dead
weight.

---

## 5. Bot Detection — DeepSeek

The `/challenge` page implements two independent bot detectors.

**Prompt:**

> "I'm building a bot detector for a click-based game. Two signals:
> (1) timing — mean and standard deviation of intervals between clicks;
> (2) spatial — standard deviation of click coordinates relative to the
> button center. What thresholds plausibly separate human from bot
> behavior, and what statistical failure mode would each signal have if
> used alone?"

**Output used:** The idea of combining mean + std-dev for timing. Thresholds
were calibrated manually through testing.

**Rewritten:** DeepSeek's first draft fused both signals into one score. I
split them into two independent detectors so the UI can show _which_
pattern triggered.

---

## 6. Particle Background — DeepSeek

**Prompt 1 — Learning the tool:**

> "Explain `useLayoutEffect` in React 19. When does it fire relative to
> paint? When is it the correct choice versus when is it a mistake?"

**Prompt 2 — Applying it:**

> "I want a background of small dots that drift from top to bottom, loop
> indefinitely, and never cause a React re-render. I'm considering
> `useLayoutEffect` for setup and `requestAnimationFrame` for the loop,
> moving particles with `transform: translate3d`. Critique this approach.
> What am I missing around `prefers-reduced-motion`, page visibility,
> and cleanup?"

**Output used:** The `% 1` modulo reset pattern, `visibilitychange` pause,
and `prefers-reduced-motion` handling.

**Wrote myself:** Particle creation loop, SVG connection mesh, fade-in/out
at edges.

---

## Where AI Was Not Used

- **Architecture** — server/client split, data layer, hook design, file
  layout.
- **TypeScript** — discriminated union for filter state, mapped types for
  sort keys, `satisfies` on `SORT_KEY_CANDIDATES`, vendor union, type guard.
- **Server Component + Suspense strategy** — including CLS-safe skeleton.
- **Race-condition guard** — `AbortController`, dedup by `_id`, end-of-list
  detection via `eachPerPage`.
- **Image fallback strategy** — `alt=""` + `role="img"` wrapper.
- **Debugging** — image 404s, hydration mismatch, `useUrlState` bug,
  React 19 setState-in-effect error.
- **All CSS, design tokens, and visual design.**

---

## Summary

AI was used as an accelerator for specific tasks: enumerating edge cases,
explaining unfamiliar React APIs, formalizing statistics, and generating
test boilerplate. Every output was reviewed; several were rejected or
rewritten. The architecture, TypeScript model, debugging, and final
implementation were done by me.
