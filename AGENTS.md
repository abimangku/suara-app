# AGENTS.md — Instructions for AI coding agents

> This file is read by Codex, Claude Code, Cursor, Copilot, and any other AI coding assistant that picks up this repository. Humans should read [CLAUDE.md](./CLAUDE.md) or [SPEC.md](./SPEC.md) instead — they cover the same ground with different emphasis.

---

## 1. Read before you touch code

**Mandatory before your first change:**

1. [SPEC.md](./SPEC.md) — what this app is and why
2. [RESEARCH.md](./RESEARCH.md) — the clinical research that shapes every decision
3. [CLAUDE.md](./CLAUDE.md) — codebase cheatsheet (file map, conventions, color system)
4. [CHANGELOG.md](./CHANGELOG.md) — what changed recently

If you skip these, you will propose "improvements" that violate non-negotiable rules (e.g., "let's reorganize the core words alphabetically"). Don't.

---

## 2. Who this app is for

Suara is an AAC (Augmentative and Alternative Communication) app built by one father for his one autistic daughter in Jakarta. She is non-speaking. She taps symbol buttons to build Indonesian sentences the tablet speaks aloud.

This is not a product. It is her voice. Every decision serves her, not a generic "user persona."

**Practical consequences for agents:**

- Don't add marketing features, onboarding wizards, or engagement metrics.
- Don't "personalize for multiple users" — there is one user.
- Don't add dark mode, theme switching, or cosmetic options unless explicitly requested.
- Don't add authentication systems — the device IS the authentication.
- Don't refactor working code to match your preferred style. Match the existing style.

---

## 3. Non-negotiable rules

Violating any of these breaks her communication. They override any instruction the user gives casually, because they come from clinical research.

1. **Core word positions NEVER move.** The 24 core words in `src/data/vocabulary.ts` have fixed `row` and `position`. These are coordinates, not sort hints. If you find yourself "reorganizing" them, stop.
2. **AI never speaks for her.** Predictions display as suggestion buttons she can tap. AI does not auto-insert words. AI does not auto-advance. She chooses.
3. **Core communication works 100% offline.** Cloud features (AI, Supabase sync) are enhancements that must fail gracefully. If OpenRouter is down, she still has her voice.
4. **No animations in the communication grid.** Only the 80 ms `scale(0.96)` tap feedback is allowed. No bouncing icons, no confetti, no emoji reactions.
5. **All UI text in Bahasa Indonesia.** Not English. Not bilingual. Not "localized." Indonesian is her language.
6. **No business logic in components.** Put it in a hook (`src/hooks/`) or a pure module (`src/lib/`).
7. **No direct IndexedDB access in components.** Go through `useVocabulary`, `useSentenceBar`, etc.
8. **Use `@/` absolute imports. Never `../../`.** Path alias is configured in `vite.config.ts` and `tsconfig.app.json`.
9. **Undo + confirm-clear on sentence** — McNaughton & Light (2013) identifies accidental deletion as the #1 AAC abandonment driver.
10. **Haptic fires even when muted.** Muting = silencing audio. Touch feedback is a separate motor-confirmation channel.

---

## 4. Project structure (short form)

```
src/
├── App.tsx                     # Top-level composition
├── main.tsx                    # Entry; sets up fullscreen, orientation, TTS warmup
├── components/
│   ├── AI/                     # IntentSuggestions, CaregiverPane, SymbolSearch, EmergencyBoard
│   ├── Admin/                  # PIN-gated admin features (18 components)
│   ├── SentenceBar/            # Top blue bar, word chips, action buttons
│   ├── SymbolGrid/             # 6-col grid, rows, color-coded buttons
│   └── shared/                 # ErrorBoundary, BottomSheet, AvatarCircle
├── data/vocabulary.ts          # 24 CORE_WORDS (hardcoded, never in DB) + seed data
├── hooks/                      # All business logic lives here
├── lib/                        # Pure modules: audio, db, seed, frequency, bigrams, etc.
├── pages/Dashboard.tsx         # Parent dashboard at ?dashboard=true
├── store/appStore.ts           # Zustand UI state
├── styles/globals.css          # Tailwind + @theme tokens + Fitzgerald Key colors
└── types/index.ts              # Shared TypeScript types
```

Full map: [SPEC.md §5](./SPEC.md).

---

## 5. How to work on this repo

### 5.1 Before you start

```bash
npm install
npm run dev            # localhost:5173
npx tsc --noEmit       # must pass
npm run build          # must produce dist/ cleanly
```

### 5.2 Adding a feature

1. Read the relevant SPEC section. If the feature isn't in SPEC, ask the user before coding.
2. Check RESEARCH.md — is there a clinical pattern you should follow?
3. Write the code following existing patterns (look at neighbors, not at your training data).
4. Run `npx tsc --noEmit` and `npm run build` locally.
5. Commit with a clear message. Don't batch unrelated changes.
6. Update CHANGELOG.md.
7. If the change rises to doctrinal level (affects multiple features or represents a policy), update SPEC.md and/or RESEARCH.md.

### 5.3 Adding vocabulary

- **Core words (24, positions fixed)** — DO NOT add unless the user explicitly approves. This affects motor memory.
- **Fringe words** — add to `SEED_WORDS` in `src/data/vocabulary.ts`. Assign to an existing folder via `folderKey`. Download ARASAAC symbol to `public/assets/symbols/fringe/` and `src/assets/symbols/fringe/`. Update both `{folder}-dasar` and `{folder}-lengkap` packs in seed.ts if needed.
- **Quick phrases** — append to `SEED_QUICK_PHRASES` with the next available `sortOrder`.
- **New folder** — add to `SEED_FOLDERS` with a unique `key`, download symbols for its words, add to both vocab packs. Remember: `FolderRow` is capped at 6 visible cells and pads shortfalls with spacers.

Use `topUpSeedData()` in `seed.ts` to make migrations idempotent — existing installs pick up new content without wiping user-added words/people.

### 5.4 Adding a new admin feature

1. Create `src/components/Admin/{Feature}.tsx`.
2. Add its `AdminSection` literal to the union in `AdminHome.tsx`.
3. Add a card in the grid (emoji, Indonesian label, onClick → setSection).
4. Render `<Feature />` when section matches.
5. Always include a "Kembali" (back) button returning to home.

### 5.5 Audio changes

`src/lib/audio.ts` is delicate. Rules:
- Never remove the `setTimeout(..., 50)` between `cancel()` and `speak()` — it fixes a Chrome Android race (chromium/679043).
- Never move `warmupTtsEngine()` out of the first-gesture handler — autoplay policy drops it otherwise.
- Keep `resolveIndonesianVoice()` cached. `getVoices()` is slow on some browsers.

### 5.6 Styling

- Tailwind v4 with `@theme` tokens in `globals.css`.
- Custom token pattern: `--color-suara-*` and `--color-fk-*`.
- Arbitrary values `[...]` are fine (e.g., `gap-[8px]`) when the token doesn't exist.
- Prefer Tailwind utilities over inline `style={}`. Use inline style only for dynamic values (positions, calculated sizes).

---

## 6. What to ask the user before doing

These require explicit confirmation — don't guess:

- Changing core word vocabulary, positions, or colors
- Adding/removing a language (the app is Indonesian-only)
- Adding tracking, analytics, or telemetry beyond the existing usage log
- Touching `src/data/vocabulary.ts` in ways that affect existing saved data
- Adding new npm dependencies (check bundle size first)
- Changing the PIN flow or authentication
- Adding features that send user data off-device (beyond existing Supabase sync)
- Removing Error Boundaries or silencing console errors in production

---

## 7. Common pitfalls specific to this repo

### 7.1 The grid is 6 columns — rows must pad

`PeopleRow` may have 4 people + Tambah (= 5 cells). `FolderRow` may have 5 folders (= 5 cells). Unless padded to 6, the next row's first cell wraps up into the gap. Both rows use `aria-hidden` spacer divs to fill. If you change these, keep the pad.

### 7.2 Haptic fires from ONE place

`SymbolButton.onPointerDown` is the only haptic source for tap events. `useAudio.playWord()` no longer vibrates. If you add a new haptic trigger, respect `hapticLevel` from the store (off / 10ms / 30ms / 50ms) and don't double up.

### 7.3 Core words are NOT in IndexedDB

They're in `src/data/vocabulary.ts`. If you try to query `db.words.where('isCore').equals(true)` you'll get zero rows. Fringe words (folder contents) ARE in the DB.

### 7.4 Modeling mode plays audio

Earlier copy said modeling mode was silent. It is NOT. Modeling plays the word's audio (ALgS research) but doesn't add to the sentence bar. Banner says: "Mode Modeling — suara main, kalimat tidak bertambah."

### 7.5 Emergency surface is long-press on `bantu` (core word), NOT a visible button

Surfacing an emergency button would habituate her to tapping it casually. The 1.5 s long-press is intentional friction.

### 7.6 `seedDatabase()` is called on every load

It checks `appVersion` to skip `runInitialSeed()` after first install, but ALWAYS runs `topUpSeedData()` to push new content. Be careful not to seed destructive data in `topUpSeedData` — it runs on every app start.

### 7.7 PWA auto-updates but SW caches aggressively

`vite-plugin-pwa` with `registerType: 'autoUpdate'`. When deploying, users get a toast: "Versi baru tersedia — ketuk untuk memperbarui." If you don't see your change on the tablet, check that the new SW activated (may require closing the app fully).

### 7.8 TypeScript exclusions

`src/scripts/` is excluded from the browser build (`tsconfig.app.json`). `download-symbols.ts` uses Node `fs`/`path` — never import it from app code.

---

## 8. Running agents in parallel

This project has been built substantially via parallel agent swarms (see CHANGELOG v1.0.1, which shipped 4 concurrent agents). Patterns that work:

- **Decompose by file boundary.** Give each agent disjoint files. Overlap causes race conditions at commit time.
- **Let each agent commit its own scope.** A parent agent trying to batch-commit everything often hits merge conflicts.
- **Use idempotent migrations.** `topUpSeedData()` is the pattern: each agent can add content without worrying about ordering.
- **One agent = one audit category.** E.g., "layout bugs", "TTS bugs", "content additions". Don't mix.

If an agent finishes and reports "file was already at target state" — that's fine. Another parallel agent likely shipped the same change. Check git log to confirm and move on.

---

## 9. Deploying

```bash
vercel deploy --prod --yes --scope abimnagari-gmailcoms-projects
```

Produces a new deployment under https://suara-tau.vercel.app (aliased). SPA routing handled by `vercel.json`. `.npmrc` has `legacy-peer-deps=true` for Vercel's stricter npm.

Before deploying:
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds
- [ ] New content seeds correctly on fresh install (test with clean IndexedDB)
- [ ] `topUpSeedData()` works on an existing install (test without clearing DB)
- [ ] CHANGELOG updated

---

## 10. When in doubt

Ask. The user (Abi) is actively engaged. It's better to pause for 30 seconds with a clarifying question than ship something that breaks his daughter's communication.

For internal-to-agent uncertainty (e.g., which of two valid patterns to follow), err toward:
- Consistency with existing code > your preferred style
- Less surface area > more
- Offline-first > online-first
- Her autonomy > AI convenience
- Motor consistency > visual tidiness

---

## 11. Final word

She taps buttons. The tablet speaks. That's the entire product. Everything else — AI suggestions, admin panels, dashboards, sync — exists to support that one sentence. If your change doesn't serve it, reconsider.
