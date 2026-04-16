# Suara Deep UX/UI Audit — Synthesis

**Prepared:** 2026-04-16 (v1.0.2)
**Sources:** three parallel investigations
1. [AAC_COMPETITIVE_ANALYSIS.md](./AAC_COMPETITIVE_ANALYSIS.md) — 9 commercial/open-source AAC apps
2. [AAC_RESEARCH_REVIEW.md](./AAC_RESEARCH_REVIEW.md) — 15 research questions, 2018-2026 literature
3. [CODE_UX_AUDIT.md](./CODE_UX_AUDIT.md) — line-level audit of our current implementation

This document synthesizes those three into a single decision matrix for Abi.

---

## 0. Bottom line

**Suara is in better shape than most personal-project AAC apps.** The research-grounded fundamentals are in place: core words are hardcoded with fixed positions (LAMP-compliant — Thistle & Wilkinson 2018), haptic is consolidated, ErrorBoundaries isolate sections, bundle is under budget (126 kB gzipped), undo + confirm-clear are correctly patterned, Fitzgerald Key palette is WCAG AA verified. Most of the right *decisions* were made.

But the **execution has real gaps**, and some are severe:

- **One critical data pipeline is silently dark.** `logTap` is defined but never called from any component. Frequency model, intent suggestions, milestone detection, and parent dashboard all read from an empty table. This is a one-line fix that unlocks half the app.
- **A few small bugs are user-visible every day.** Ibu's avatar shows "K", the "Tambah" button is disabled-but-looks-tappable, sentence auto-clears 1.5s after Bicara so she can't re-speak.
- **We diverge from commercial AAC on three choices** — two of them defensibly, one not. Small grid (36 cells vs industry 60-144) is defensible because she's an early learner. No embedded core on fringe pages is NOT defensible — every major commercial AAC does this and research backs it. Fitzgerald Key on fills+borders rather than borders-only is cosmetic but makes the grid feel louder.
- **Some features are silent** — VocabPackAdmin toggle does nothing, undo toast never shows up, modeling mode amber ring fades before the caregiver's demo ends.

**Recommended posture:** don't do a complete redesign. Ship the P0 fixes this week (2-4 hours of work unlocks most of the value). Treat P1 as the next sprint. P2+ is discussion material.

---

## 1. Where Suara stands vs. the field

### 1.1 What we're doing right (research-validated, industry-normal)

| Decision | Evidence |
|---|---|
| Fixed core positions (24 words, rows 1-4) | Thistle & Wilkinson 2018: 3.3s vs 6.0s response in consistent-location group. Every major AAC follows this. |
| Top sentence bar | Universal in P2G, TouchChat, LAMP, Snap, CoughDrop, Avaz, Proloquo. |
| ARASAAC symbols | Industry norm for open-source (CoughDrop, Cboard). Free, adult-coded variants available. |
| PIN-gated admin | P2G, TouchChat, Avaz all use caregiver lockout. |
| Undo + confirm-clear on deletion | McNaughton & Light 2013: #1 AAC abandonment cause. |
| Warm off-white (#F8F7F4) background | Irlen / UDL research — reduces sensory fatigue. |
| Configurable haptic | Brewster et al. 2007 — tactile confirmation helps. |
| Modeling mode (ALgS) | Biggs, Carter & Gilson 2018 systematic review: most reliably effective AAC intervention. Unique to us — CoughDrop is closest. |
| Error boundaries per section | Reliability engineering; keeps communication working if one section crashes. |
| Offline-first | Design-against-abandonment: Moorcroft et al. 2019 names reliability as top retention factor. |

### 1.2 Where we diverge (and whether it's defensible)

| Our choice | Industry norm | Defensible? |
|---|---|---|
| **6×6 grid (36 cells visible)** | P2G 7×11 (77), LAMP 7×12 (84), Snap 8×10 (80), TouchChat up to 108 | **Partly.** Our target is an early AAC learner, not a fluent user. But we have no documented path to scale up without breaking motor memory. **Fix: add a scaling plan.** |
| **No core on fringe pages** | P2G, TouchChat, Snap all embed core when inside a folder | **No.** This is a pure usability regression. She has to come back to core to modify a fringe selection. **Fix: add core row to fringe view.** |
| **Fitzgerald Key on fills + borders** | P2G, TouchChat, Snap use borders only (fills neutral); adjustable intensity | **Cosmetic, but not evidence-backed.** Spatial clustering does more than color anyway (Wilkinson et al. 2022). **Optional fix: offer border-only mode.** |
| **Emergency/SOS surface** | Zero commercial AAC apps have this | **Yes — genuine innovation, worth defending in our own research note.** |
| **Modeling mode UI toggle** | CoughDrop analytics only; P2G treats as practice | **Yes — novel and research-backed (Biggs 2018). Needs better execution (amber ring too short).** |
| **Bahasa Indonesia native** | Only Avaz supports it commercially | **Yes — genuine gap fill. Flagged: no peer-reviewed BI core vocab corpus exists. Ours is synthesized.** |
| **Auto-clear 1.5s after Bicara** | P2G offers Off/Immediate/After-Next; most default to "After Next Activation" (keep until next word added) | **No — our 1.5s erases before a communication partner can read it.** |
| **PWA deployment** | Nearly all research is on native apps | **Yes — deliberate choice for cost/flexibility. Accept small risks (iOS Safari audio, haptics support).** |

### 1.3 What the research says we should measure but don't

- **Tap → audio latency on real device.** Target <100 ms. Audited as ~40-150 ms but never measured on Tab A11.
- **Time-to-first-word after install** (design-against-abandonment metric).
- **Core word coverage %** (what % of her utterances come from the 24 core?).
- **Modeling events per session** (Binger's 30/15min target).

---

## 2. Findings by priority

### 🔴 P0 — Critical bugs (ship this week, 2-4 hours work)

Each of these is silently breaking something for her right now.

**P0-1. Core taps are not logged.**
- File: `src/hooks/useSentenceBar.ts:37` (where logging should call) / `src/hooks/useUsageLog.ts:12` (where `logTap` is defined)
- Impact: frequency model, intent suggestions, milestones, parent dashboard, AI vocab suggestions all dependent on a table that is **always empty**. These features appear to work but produce no learning over time.
- Fix: call `logTap` inside `useSentenceBar.addWord` so every tap (core/fringe/people/quickphrase) produces an event.
- Effort: ~10 lines.

**P0-2. SEED_PEOPLE initials bug.**
- File: `src/data/vocabulary.ts:51`
- Impact: Ibu's avatar shows "K" instead of "I" on every launch (until replaced with a photo).
- Fix: change `initial: 'K'` to `initial: 'I'`.
- Effort: 1 line.

**P0-3. PeopleRow "Tambah" button is disabled-but-visible.**
- File: `src/components/SymbolGrid/PeopleRow.tsx:27-34`
- Impact: it looks tappable (same style as Ibu/Ayah/Nenek/Mbak), does nothing, habituates "broken button."
- Fix options:
  1. Make it open admin directly with PIN gate — best discoverability
  2. Remove entirely (keep add-person in admin) — cleaner grid
  3. Style it differently (dashed border, grayed) so it reads as "caregiver-only placeholder"
- Effort: 15-30 min depending on choice.

**P0-4. Auto-clear after Bicara.**
- File: `src/hooks/useSentenceBar.ts:67-69`
- Impact: she cannot re-speak the same sentence (empty by the time she retaps). A partner can't read what she said. Noisy environments require workaround through 🕐 History (2 taps).
- Fix: remove the `setTimeout` that auto-clears. Let the sentence persist until she taps ✕ Hapus or modifies the chip sequence. Optionally add a setting: "Hapus setelah dibicara" in Admin → general settings.
- Effort: ~5 lines + a toggle if added.

**P0-5. "Panggil Ambulans" uses `sms:` not `tel:`.**
- File: `src/components/AI/EmergencyBoard.tsx:84-90`
- Impact: label says "call" (Panggil), action opens SMS composer. Panic-moment mismatch.
- Fix: use `tel:118?` for Ambulans, keep `sms:` for Ibu/Ayah (text preserves context for personal contacts).
- Effort: 5 lines.

### 🟠 P1 — High-value improvements (next sprint, ~1 week)

**P1-1. Add a visible admin entry affordance.**
- Problem: long-press SentenceBar 3s is undiscoverable for a new caregiver. OnboardingGuide exists but lives inside admin (chicken-and-egg).
- Options:
  1. Small ⚙ icon in bottom-right of grid (long-press or double-tap opens PIN gate)
  2. First-launch one-screen reveal modal (shows all gestures once, then stores `onboardingCompleted`)
  3. Hidden corner-tap — e.g., 3 taps on Suara logo
- Evidence: Moorcroft et al. 2019 names "caregiver knowledge" as top-3 abandonment driver.
- Effort: 1-2 hours.

**P1-2. Fringe words should use Fitzgerald Key colors.**
- Problem: `SymbolButton.tsx:129` applies `fkColor` only for `variant === 'core'`. Fringe words (nasi goreng, rumah, sakit kepala) all render neutral gray. Research says color-code across the full grid.
- Fix: map each folder to a dominant FK category (Makanan/Pakaian/Tubuh → noun orange; Aktivitas → verb green; Pertanyaan → question purple). Apply in SymbolButton for `variant === 'fringe'`.
- Evidence: Wilkinson et al. 2022, Thistle & Wilkinson 2012 — color-as-redundant-cue on spatial clusters helps search.
- Effort: 1-2 hours (includes data migration for seed folders + per-word fkColor field).

**P1-3. VocabPackAdmin — wire it up or remove it.**
- Problem: toggling a pack updates `vocabularyPacks.isActive` in DB, but `FolderContents` never reads from `vocabularyPacks`. Silent feature. SPEC.md §3.3 promises Dasar/Lengkap functionality.
- Fix options:
  1. Wire FolderContents to honor active packs (the spec-faithful fix)
  2. Remove VocabPackAdmin from AdminHome (honest pruning)
- Choose based on: does the family want the progressive Dasar→Lengkap teaching path? If yes, wire it. If no, remove.
- Effort: 2-3 hours if wiring; 10 min if removing.

**P1-4. Undo backspace needs a visible toast.**
- Problem: `useSentenceBar.ts:15-30` implements undo behavior but SPEC promises "2-second toast showing 'Kata dihapus' + undo button" that doesn't exist. Second ⌫ tap within 2s is ambiguous (undo? next backspace?).
- Fix: add a small inline toast anchored above the ⌫ button showing "↶ Kembalikan 'nasi' " for 2 s. Tap restores.
- Evidence: matches SPEC.md §3.2 + McNaughton & Light 2013.
- Effort: 30-60 min.

**P1-5. Modeling mode amber ring should persist longer.**
- Problem: `SymbolButton.tsx:173` clears highlight after 500ms. A caregiver modeling "mau makan" loses the visual trace before the child looks up.
- Fix: bump to 2000ms. Optionally add a trailing ring of last 3 modeled words above the grid.
- Evidence: Binger 2007 dose (30 models/15min) only works if each model is visually persistent.
- Effort: 10 min for simple bump; 1-2 hours for trailing ring.

**P1-6. Add a "Test SMS" button in Kontak Darurat admin.**
- Problem: caregiver configures Ibu's number, never verifies it works until a real emergency.
- Fix: in `EmergencyContacts.tsx`, add a "🧪 Uji SMS" button per contact that fires `sms:NUMBER?body=Uji coba dari Suara.`
- Effort: 20 min.

**P1-7. Core vocabulary embedded on fringe pages.**
- Problem: when inside Makanan, she sees only fringe food words + Kembali. She can't add "mau" or "tidak" without going home first.
- Fix: in `FolderContents`, render one row of core words (either the 6 most-used per frequency, or a fixed "pragmatic" core row: mau / tidak / lagi / ya / bantu / berhenti) at the top.
- Evidence: P2G templates, TouchChat WordPower, Snap all do this. Reduces navigation taps per sentence.
- Tradeoff: takes one row of fringe-word real estate. Currently we show 6 fringe words + Kembali (or 5 + "lihat semua" + Kembali). Adding 6 core = we'd show 4-5 fringe + core row + Kembali. Need a visual test to confirm it fits the viewport.
- Effort: 2-3 hours including visual testing on Tab A11.

**P1-8. SEED/CLAUDE/SPEC drift.**
- Problem: CLAUDE.md says "up to 4 people + Tambah + spacer." Code allows 6 people with Tambah hidden when full. Admin card count is 11 in code vs 14 in SPEC. Labels inconsistent. 
- Fix: one doc-editing pass to align SPEC.md + CLAUDE.md with current code behavior.
- Effort: 30-45 min.

### 🟡 P2 — Optimizations (one sprint, ~2 weeks)

**P2-1. Discoverability system.**
- First-launch onboarding flow (2-3 screens): grid tour, sentence bar, long-press gestures. Store `onboardingCompleted` correctly.
- Caregiver reveal: first time admin opens → hint about emergency long-press + modeling mode.
- Tooltip hints on admin gestures the first 3 times.

**P2-2. Accessibility pass (WCAG 2.1 SC 2.4.7 + keyboard nav).**
- `focus-visible:ring` on all buttons
- Arrow-key grid navigation (useful for switch access, not for her)
- ARIA live region on SentenceBar so chip changes are announced for screen reader
- Optional: switch-access support for caregivers helping other users

**P2-3. Dashboard admin link.**
- Currently only URL-param entry (`?dashboard=true`). Add a "📊 Dashboard" card in AdminHome.
- Effort: 15 min.

**P2-4. Photo-based people preferred over initials.**
- Already supported via admin. Consider a first-launch nudge: "Tambahkan foto keluarga untuk pengenalan yang lebih cepat."
- Eye-tracking research (Wilkinson 2025): faces attract fixation and improve selection time.

**P2-5. Quick phrase expansion per Light & McNaughton's 4 communicative purposes.**
- We have: needs/wants (mau nonton tv), some social closeness (halo, terima kasih).
- Missing: information transfer (aku ingin tahu / ceritakan / kamu tahu...), social etiquette (permisi, maaf sebentar).
- Ganz et al. 2017 systematic review: interventions that go beyond "requesting" are systematically under-represented.
- Effort: 1-2 hours data entry + ARASAAC symbol downloads.

**P2-6. Modeling dose telemetry.**
- Log modeling-mode taps separately from user taps (CoughDrop does this).
- Parent dashboard card: "Minggu ini: 120 model, 45 per sesi (target 30/15min)."
- Effort: 2-4 hours.

**P2-7. Pagination consistency in folders.**
- Current: 6 words, or 5 + "lihat semua" if >6. When expanded, Kembali position shifts.
- Fix: always render Kembali in the same position (e.g., fixed bottom-left). Motor memory needs "Kembali is here" to be law.
- Effort: 1 hour.

**P2-8. SentenceBar action-icon hierarchy.**
- 5 equal-weight icons (⚡🔍🕐🔊💬). Demote 🕐 and 💬 to a "•••" menu; keep primary 3 visible.
- Frees ~90px horizontal for longer chips.
- Effort: 1-2 hours.

### 🔵 P3 — Architectural discussions (decide before building)

**P3-1. Grid density escalation path.**
- Current: 6×6 = 36 cells, hardcoded.
- Research: AssistiveWare says denser grids → better language outcomes but 80% of caregivers defy the recommendation.
- Options:
  1. Stay at 6×6 forever — defensible for early learners but caps language growth
  2. Add a "grid size" admin setting (6×6 → 7×6 → 8×7) with motor-preserving expansion (only add to empty slots, never reshuffle)
  3. Progressive Language model (P2G-style): start 6×6, unlock more as usage shows readiness
- This is a conversation with Abi + an SLP, not a unilateral decision.

**P3-2. Core embedded on fringe pages — trade-off.**
- P1-7 above is the conservative version (add 1 row of core).
- Fuller version: P2G-style "every fringe folder contains all core + folder words." Requires rethinking folder capacity.
- Research: Wilkinson/Drager evidence that core-embedded reduces navigation load.
- Effort difference: 2-3h (P1-7) vs. 1-2 weeks (full P2G model).

**P3-3. Auto-morphology (grammar assist).**
- Tap-and-hold a verb → pick -kan/-lah/-nya/me-/di-/ber- variants for Indonesian morphology.
- Research: P2G's grammar support is cited as the single biggest differentiator vs. TouchChat. Communication rate 1.6 taps/word.
- Indonesian-specific: needs a morphology engine or a hand-curated inflection table.
- Effort: 1-2 months of linguistic + UX work.

**P3-4. Photo-centric fringe vs. symbol-centric.**
- Abi asked earlier about "real food photos." Hartley & Allen 2014/2020 support personal photos for highly meaningful items (family, home, specific foods) and iconic symbols for abstract.
- Current implementation supports both (ARASAAC + photo override). The question is: should the default be "add a photo when you add a word" prompt?
- Effort: 30 min prompt UX.

**P3-5. Bahasa Indonesia core vocabulary — research investment.**
- No peer-reviewed BI core corpus exists. Our 24 words are synthesized from English research.
- Option: partner with an Indonesian SLP to review and adjust. Potentially publishable as open research artifact.
- Effort: several weeks of collaboration, not a code task.

### 🎨 P4 — Visual overhauls (optional, for delight not necessity)

**P4-1. Fitzgerald Key — borders-only mode.**
- Industry norm: colored border + neutral fill with adjustable intensity.
- Current: colored fill + colored border. Feels "louder" than commercial AAC.
- Offer as a setting; ours on by default (inherited from v0.4.1 UX sprint).
- Effort: 2-3 hours.

**P4-2. Typography tightening on Tab A11.**
- Current: `clamp(11px, 2.2vw, 18px)`. At Tab A11 viewport this renders 18px bold with 0.4px tracking. Research-backed but borderline tight vertical at 85px button height.
- Consider: go to 16px with tighter leading to free ~4px per row.
- Effort: 20 min + visual test.

**P4-3. Dark mode / high-contrast mode.**
- ~90% of autistic users have atypical sensory processing. Some are photophobic.
- Snap's "Core First High Contrast" variant is cited as a first-class accessibility feature competitors lack.
- Not urgent if she's comfortable with current palette.
- Effort: 4-6 hours (token swap + testing).

**P4-4. Calmer empty state for fringe.**
- Current fringe fallback `❓` was changed to letter-circle in v1.0.1. Good. Next level: show a muted ARASAAC silhouette or a dashed-line icon specific to the folder's dominant FK color.
- Cosmetic.

---

## 3. Things we should NOT change (defensive list)

Research and competitive analysis validate these — agents might propose changing them, don't let them.

| Keep | Why |
|---|---|
| Fixed core word positions | Thistle & Wilkinson 2018 — strongest single evidence in AAC |
| ARASAAC over SymbolStix/PCS | Free, open license, adult-coded variants, Indonesian-friendly |
| Modeling mode as UI toggle | Evidence-backed, unique among AAC apps |
| Emergency SOS surface | Genuine innovation; no commercial equivalent |
| Bahasa Indonesia native | Fills a real market gap (only Avaz supports BI) |
| PWA deployment | Cost, flexibility, offline-first |
| 24 core words (not more) | Banajee 26 validated; our count is inside the evidence band |
| PIN-gated admin with long-press entry | Prevents accidental edits by primary user — but add a second visible affordance |
| Warm off-white background | UDL / Irlen evidence |
| Haptic configurable levels | Brewster 2007 — research-backed |
| Ay language: Indonesian only | It's her language, not a "localization" |
| No animations in grid | Autism sensory research |

---

## 4. Recommended path forward

I'd suggest three waves:

**Wave A (this week, ~4 hours total):**
All P0 fixes. Ship as v1.0.3. She gets:
- Working analytics pipeline (logging lights up insights/dashboard/AI vocab suggestions)
- Correct "I" avatar for Ibu
- Cleaner people row (no dead button)
- Persistent sentences after Bicara (re-speak, show partner)
- Real phone call to Ambulans, not SMS

**Wave B (next 1-2 weeks, ~10-15 hours):**
All P1 fixes. Ship as v1.1.0. She gets:
- Fitzgerald colors on fringe words (e.g., food words turn orange)
- Core row embedded on fringe pages (fewer navigation taps per sentence)
- Visible admin affordance
- Undo toast
- Modeling amber ring persists
- Test-SMS button in Kontak Darurat
- VocabPackAdmin either wired or removed

**Wave C (discuss before building):**
P3 architectural decisions. Need your input:
- Grid density escalation plan?
- Auto-morphology for Indonesian grammar?
- BI core vocabulary collaboration with an SLP?

P2 optimizations + P4 visual polish can interleave with Wave B/C as time allows.

---

## 5. What the agents couldn't verify

Honest limits of this audit:
- **No real-device testing.** All findings are code + research level. Tap → audio latency, haptic strength, orientation-lock survival on Android back button — all unverified on the actual Tab A11.
- **OpenRouter + Supabase dark.** Client wrappers read; actual API behavior not exercised.
- **PWA update cycle on live device** not simulated.
- **Low-end Android performance** not profiled.
- **Fuse.js search quality on Indonesian synonyms** not evaluated.
- **Milestone detection thresholds** not reviewed for reasonableness.
- **Bigrams linguistic quality** — may mirror English AAC templates rather than Indonesian child patterns.
- **Safe-area padding on notched devices** not verified.

---

## 6. My recommendation as her dad's engineer

If this were my call: **ship Wave A (P0) immediately, do Wave B (P1) over the next week, and let Wave C (P3) breathe.** Don't redesign anything. The research validates most of our architectural choices; the bugs are the real problem, and they're cheap to fix.

The one thing I'd push hardest on is **P0-1 (usage logging)** — fixing that one line turns a half-dark app into a fully-learning app. Everything downstream of tap data (insights, suggestions, milestones) starts working.

The one thing I'd push back on is **any grid redesign**. Changing grid density or layout breaks motor memory, and the evidence for larger grids is softer than commercial AAC marketing suggests. Stay at 6×6 unless she outgrows it.

---

*Reports backing this synthesis:*
- [AAC_COMPETITIVE_ANALYSIS.md](./AAC_COMPETITIVE_ANALYSIS.md) — 38 KB, 9 apps, 14 dimensions each
- [AAC_RESEARCH_REVIEW.md](./AAC_RESEARCH_REVIEW.md) — 46 KB, 15 research questions, 60+ citations
- [CODE_UX_AUDIT.md](./CODE_UX_AUDIT.md) — 46 KB, per-component deep dive with file:line references
