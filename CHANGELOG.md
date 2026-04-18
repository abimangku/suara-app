# Changelog

All notable changes to the Suara AAC app are documented here.

> For what the app is and how it works, see [SPEC.md](./SPEC.md).
> For the clinical research behind every decision, see [RESEARCH.md](./RESEARCH.md).
> For AI agent conventions, see [AGENTS.md](./AGENTS.md).
> For codebase quick reference, see [CLAUDE.md](./CLAUDE.md).

## v1.3.0 — State persistence + data safety + consistency (2026-04-18)

Major reliability update addressing the "changes come back to normal" bug reported during real-world testing.

### Data persistence
- **Persistent storage requested** (`navigator.storage.persist()` in `main.tsx`). Chrome Android was silently evicting IndexedDB under storage pressure on Tab A11, wiping all user customizations. Installed PWAs typically get persistence auto-granted — data is now protected from storage eviction.
- **Auto-backup system** (`src/lib/auto-backup.ts`). Every admin edit (people, words, phrases, settings) silently snapshots all configurable data to `localStorage` (separate storage pool from IndexedDB). Debounced at 2 seconds so rapid edits batch. If IndexedDB is ever wiped, the auto-backup restores user customizations on next launch — no manual backup file needed. Photos (blobs) are NOT in the auto-backup (localStorage size limit) — manual backup (Admin → 💾 Cadangan Data) still needed for those.
- **Auto-restore on data loss**. `seedDatabase()` now checks: if IndexedDB is empty but an auto-backup exists in localStorage, it seeds defaults THEN overlays the backup data (names, phrases, settings, words) non-destructively.
- **Re-seed guard improved**. If `appVersion` flag is lost but tables have data, the flag is restored without re-seeding — prevents duplicate rows from accumulating.

### State consistency
- **`hapticLevel` now persisted to IndexedDB** (P0 audit finding). Previously Zustand-only — reset to 'light' on every reload. A caregiver setting haptic to 'off' for sensory reasons would see it revert on next app start. Now: `setHapticLevel` writes to `db.settings`, and `init()` reads it back on app launch.
- **Dexie table hooks** trigger auto-backup on any write to people, folders, words, quickPhrases, or settings tables — no admin component needs to call backup explicitly.

### Error handling
- **All admin save operations now have try/catch** (ManagePeople, EditWord, AddWord, AddPerson). Previously, if IndexedDB was full or corrupted, saves failed silently — the UI looked like it worked but data was lost. Now: shows an alert in the user's language ("Gagal menyimpan. Coba lagi.").
- **Duplicate guards** on AddPerson (checks name exists) and AddWord (checks label+folder exists). Prevents double-saves from rapid tapping or accidental repeat submissions.

### Content
- **Tubuh → Rasa Tubuh** folder rename. Contents are physical states (lapar/haus/pusing/dingin/gatal), not body parts. "Tubuh" (body) was misleading — "Rasa Tubuh" (body feelings) matches the actual words. `topUpSeedData` renames the folder on existing installs.

## v1.2.2 — UX cleanup + install UX + icon fix (2026-04-16)

Several small changes shipped as individual commits; consolidating here.

### SentenceBar simplified
- **Removed 🔍 search button** — the primary user never uses it; visual noise.
- **Removed 🔊/🔇 mute button** — device hardware volume buttons handle this.
- SentenceBar actions now: ⚡ quick phrases / 🕐 history / 💬 caregiver pane / ⚙️ admin. One less row of distraction, ~90 px more horizontal space for sentence chips before they scroll.
- Underlying `isSearchOpen` / `isMuted` store state + `SymbolSearch` component are unchanged — just unreachable from the primary UI. Re-adding either button is one line.

### PWA install experience
- **New `InstallBanner` component** (`src/components/shared/InstallBanner.tsx`). Many Samsung Chrome builds surface only "Tambahkan ke layar utama" (add shortcut) in the three-dot menu and bury or omit "Install aplikasi" — caregivers end up with a Chrome bookmark that shows the URL bar on top of Suara instead of a true PWA install. The banner listens for `beforeinstallprompt`, shows a "📲 Install" button at the top when installable, and fires Chrome's native install dialog programmatically on tap. Hides automatically when running standalone or after `appinstalled`.
- **Rewrote KioskGuide** (Admin → 📱 Mode Kiosk). Old guide incorrectly told caregivers to use "Tambahkan ke layar utama" which creates the broken shortcut. New guide (10 steps, was 7) clearly distinguishes "Install aplikasi" (correct — true PWA) vs. "Tambahkan ke layar utama" (wrong — Chrome tab shortcut), covers verification, battery background limits, and longer screen timeout.

### Content fix
- **Real ARASAAC pictograms for `minta` / `punya` / `lihat`**. When the core grid expanded from 10 to 24 words in the v0.4.1 improvement sprint, these three got a single shared placeholder PNG (byte-identical files, same MD5). The download script `src/scripts/vocab-list.ts` was never extended to cover the new core words. Downloaded correct pictograms from `static.arasaac.org`:
  - minta → ID 25062 (order / ask / request)
  - punya → ID 7271 (have / hold / own)
  - lihat → ID 6564 (see / look / watch)
- Audit of all 24 core + ~60 fringe symbols for byte duplicates; only remaining dup is `lelah.png = capek.png` (both mean "tired" — semantically correct).

## v1.2.1 — Folder view hotfix (2026-04-16)

Fixes two regressions reported by the primary caregiver testing v1.2.0 on Tab A11:

- **Folder view was showing 4 rows of core words + 1 row of fringe + Kembali.** Opening a folder like Tubuh rendered 24 core words at the top and squeezed only 5 fringe words into a single narrow row. Buttons were small and the folder content felt absent. This was not a v1.2.0 change — the CoreRow was always rendered regardless of folder state — but it became visually worse after v1.2.0's accumulated small-grid changes. Fixed by HIDING core rows when a folder is open. Now folder view uses 5 full rows for fringe words + 1 for Kembali, buttons render at core-size, fringe is the focus. Works because our auto-return-to-home (added earlier this session) means she never needs core while inside a folder.
- **P2-7 spacer padding reverted.** The "pin Kembali to row 6" logic added 30 spacer cells which forced every folder to render as 6 rows regardless of word count, shrinking every button to 1/6 height. Reverted. Motor memory for Kembali position is lower priority than readable button size.

Also removed: `lihat semua` pagination button + `showAll` state. With 5 full rows × 6 cols = 30 visible cells in folder view, all realistic folder word lists fit on the first page.

## v1.2.0 — Deep audit Wave C: P2 refinements (2026-04-16)

Continuation of the deep-audit remediation. Three P2 items landed; two deferred.

- **Quick phrase expansion across the 4 communicative purposes** (P2-5). Added `aku tidak tahu`, `apa itu`, `tunggu sebentar`, `permisi`, `aku sayang kamu`, `aku capek`. Previously she had strong coverage of needs/wants and social closeness; information transfer, repair, and etiquette were under-served. Ganz et al. 2017 systematic review: AAC apps systematically under-support non-requesting communicative acts. `topUpSeedData` pushes these to existing installs.
- **Accessibility pass** (P2-2). Added `focus-visible:ring` on every SymbolButton (WCAG 2.1 SC 2.4.7) + `role="region"` + `aria-live="polite"` + `aria-atomic="true"` on the sentence chip area so assistive tech announces chip changes. No visual cost on touch; large improvement for switch-access or screen-reader-assisted setups.
- **Kembali pinned to row 6** (P2-7). Previously the Kembali button's grid position shifted based on fringe-word count (row 2 for small folders, row 3+ for larger ones). Motor memory needs "Kembali is always here" to be law. Spacer cells now pad between words and Kembali so it's always at the bottom row regardless of folder contents.

Deferred:
- **P2-1 first-launch onboarding modal** — the visible ⚙️ admin affordance (v1.1.0) + the existing in-admin OnboardingGuide cover the same discoverability concern. Revisit if caregiver feedback shows the guide isn't reached.
- **P4-2 typography tightening** — current `clamp(11px, 2.2vw, 18px)` fits Tab A11 comfortably after v1.0.2's gap + padding tightening. No real need.

## v1.1.0 — Deep audit Wave B: P1 improvements (2026-04-16)

Continuation of the deep-audit remediation. Seven P1 items shipped; one deliberately skipped.

- **Fringe words now use Fitzgerald Key colors** (P1-2). Previously `SymbolButton` applied `fkColor` only for `variant === 'core'`, so all fringe words (nasi goreng, rumah, sakit kepala) rendered neutral gray. Now fringe words inherit a folder-level FK mapping: Makanan/Tempat/Tubuh → noun (orange), Aktivitas → verb (green), Perasaan → descriptor (blue), Pertanyaan → preposition (purple — traditional Fitzgerald question color). Research §1 (Wilkinson et al. 2022) supports color as redundant cue across the full grid, not just core.
- **Visible ⚙️ admin affordance in SentenceBar** (P1-1). Long-press 3s was undiscoverable for new caregivers. A gear icon now sits between 💬 and the chip area; tap opens the PIN gate directly. PIN is still the access control — the icon just makes admin reachable.
- **Undo toast now visible after backspace** (P1-4). Previously the 2-second undo window was silent; tapping ⌫ twice was ambiguous ("another delete?" or "undo?"). Now ⌫ always deletes; a pill appears above the chip row for 2 seconds showing "Dihapus: 'X' [↶ Kembalikan]". Explicit restore button, no double-meaning for ⌫.
- **Modeling-mode amber ring persists 2 seconds** (P1-5). Was 500 ms — too short for a caregiver's demo to register if the child looked up partway through. Research: Binger & Light 2007 dose (30 models / 15 min) requires each model to be visually salient.
- **Test-SMS / Test-call buttons in Kontak Darurat admin** (P1-6). Each configured contact now has a "🧪 Uji SMS" or "🧪 Uji panggilan" button that opens the real composer with a harmless test message. Caregivers verify numbers work BEFORE a real emergency.
- **VocabPackAdmin removed** (P1-3). The toggle updated `vocabularyPacks.isActive` but FolderContents never read from that table — silent feature contradicting SPEC.md §3.3. Caregivers can prune unwanted words via "📝 Kelola Kata" instead. Future progressive disclosure can be reintroduced with proper word→pack wiring.
- **"📈 Dashboard Orang Tua" card added to admin** (P2-3 promoted). Previously reachable only via URL `?dashboard=true`. Now a tap from admin opens it in a new tab.
- **SPEC.md + CLAUDE.md drift corrected** (P1-8). PeopleRow cap (6 not 4), admin card count (11 not 14), v1.0.3/v1.1.0 noted, Tambah→admin wiring documented, sentence-persist behavior updated, FK on fringe documented.

Deliberately skipped: **P1-7 (embed core on fringe pages)**. Commercial AAC apps (P2G, TouchChat, Snap) embed core inside folders because they keep the user in the folder after selecting a word. Our auto-return-to-home after fringe tap (shipped earlier in this session) solves the same problem more cleanly — she's always back at core before picking the next word. Documented as a deliberate divergence.

## v1.0.3 — Deep audit Wave A: P0 bug fixes (2026-04-16)

After a comprehensive 3-agent research audit (commercial AAC comparison, academic literature review, code audit), shipped the 5 most critical fixes.

- **Usage logging pipeline lit up.** `logTap` was defined but never called from any component. `useSentenceBar.addWord` and `handleQuickPhrase` now log every tap (core / fringe / people / quickphrase) to `db.usageEvents`. This wakes up: frequency model, intent suggestions, milestone detection, UsageInsights, parent dashboard, AI vocab suggestions. Skips logging in modeling mode (those are caregiver demonstrations, not her expressive data).
- **`Ibu` avatar initial corrected `K` → `I`.** Data bug in `SEED_PEOPLE`.
- **`Tambah` button now opens admin (PIN-gated).** Was `disabled` with no-op onTap, which looked tappable and habituated as broken. Now launches the admin PIN overlay — the PIN still prevents the primary user from accidentally entering admin.
- **Sentence no longer auto-clears after Bicara.** Previously a 1500 ms setTimeout wiped the sentence. She couldn't re-speak, partners couldn't read what she said, noisy environments required 2-tap workarounds through history. Sentence now persists until she taps ✕ Hapus (still confirm-guarded).
- **"Panggil Ambulans" uses `tel:` not `sms:`.** Label said "call" but action opened SMS composer. For medical emergency, a voice call beats a text message. Ibu/Ayah stay on `sms:` (preserves context for personal contacts).

Deep audit reports are in `.audit/`: `DEEP_AUDIT.md` (synthesis), `AAC_COMPETITIVE_ANALYSIS.md` (9 commercial apps), `AAC_RESEARCH_REVIEW.md` (15 research questions, 60+ citations), `CODE_UX_AUDIT.md` (line-level findings).

Wave B (P1 improvements: Fitzgerald colors on fringe, core on fringe pages, visible admin affordance, undo toast, modeling ring, test-SMS, VocabPack wiring, doc sync) and Wave C (P2 + P4 optimizations) to follow.

## v1.0.2 — Tab A11 viewport fit (2026-04-16)
- **Folder row cut off on Tab A11**: the 53px always-reserved `IntentSuggestions` placeholder added in v1.0.1 ate too much of the 600px landscape viewport, pushing the folder row (Makanan / Aktivitas / Pakaian / Tubuh / Pertanyaan) off the bottom of the screen. Reverted the placeholder — `IntentSuggestions` now returns `null` when empty. When suggestions appear after 2+ taps there's a ~8% button reflow; positions stay fixed so motor memory is preserved.
- Tightened grid spacing: `gap-[8px] p-2` → `gap-[6px] p-1.5`. Saves 18px vertically — enough cushion so the grid stays comfortable even when suggestions are showing.
- `CLAUDE.md` grid spec updated to match.

## v1.0.1-docs — Documentation consolidation (2026-04-16)
- Added **SPEC.md** — single source of truth for what the app does and why
- Added **RESEARCH.md** — all clinical, UX, and accessibility research citations with links to implementing files
- Added **AGENTS.md** — instructions for AI coding agents (Codex, Claude, Cursor, Copilot)
- Refreshed **CLAUDE.md** to reflect v1.0.1 state (emergency surface, new admin sections, v1.0.1 bug fixes, cross-links to sibling docs)
- No code changes in this entry — documentation only

## v1.0.1 — Deep AAC Audit + Clinical Content Sprint (2026-04-16)
### Bug fixes (critical)
- **Grid row mixing**: PeopleRow emitted 5 cells instead of 6, causing the first folder (Makanan) to wrap into the people row. Both PeopleRow and FolderRow now pad to 6 cells with `aria-hidden` spacer divs.
- **Haptic double-fire**: tapping fired vibration twice (once from `onPointerDown` hardcoded 10ms, once from `useAudio.playWord`), silently overriding the user's "off" setting. Haptic is now consolidated into `SymbolButton.onPointerDown` with the configured level from the store; folder/kembali navigation no longer vibrates.
- **Modeling banner text wrong**: amber banner said "ketuk tombol untuk menunjukkan, tanpa suara" but modeling mode DOES play audio (per ALgS research). Changed to "suara main, kalimat tidak bertambah".
- **Grid shift when suggestions disappear**: IntentSuggestions returned `null` when empty, causing the grid to reflow. Now returns an invisible 53px placeholder so button sizes stay stable.
- **TTS cancel+speak Android race**: on Chrome Android, calling `speechSynthesis.speak()` immediately after `cancel()` drops the second utterance silently (chromium/679043). `fallbackTTS` and `speakSentence` now add a 50ms setTimeout between cancel and speak.
- **Orientation lock runs without fullscreen**: `screen.orientation.lock('landscape')` threw when fullscreen had failed. Added `if (document.fullscreenElement)` guard. Also added `fullscreenchange` listener to re-acquire the lock when the user re-enters fullscreen (Android back button releases it).
- **TTS prewarm blocked by autoplay policy**: Chrome Android drops prewarm utterances fired outside a user gesture. Split into `loadVoices()` (init) and `warmupTtsEngine()` (first gesture); warmup rate dropped 10 → 2 (some browsers clamp rate > 4).
- **Prod console warnings**: SymbolButton's perf-tap warning now guarded with `import.meta.env.DEV`.
- **Sentence bar height clip**: fixed `height: 56` replaced with `minHeight: 56` so the bar can expand for long chip lists.
- **`ada` FK color wrong**: was `descriptor`, should be `verb` per Fitzgerald Key (existence is a verbal action, not a descriptor).
- **`❓` fallback misread as "apa"**: neutral dashed circle with the first letter of the label replaces the `?` emoji when no symbol/photo/emoji is available.
- **Non-standard `screen-orientation` meta**: removed from `index.html` (it's not a web standard — real orientation lock comes from manifest + Screen Orientation API).
- **Dashboard PIN input**: already had `maxLength={6}` + `inputMode="numeric"` — verified correct.

### New clinical content
- **Pertanyaan folder** with 5 question words (who/where/when/why/how): `siapa`, `dimana`, `kapan`, `kenapa`, `bagaimana`. ARASAAC pictograms downloaded. Vocabulary packs: `Pertanyaan Dasar` (first 3) and `Pertanyaan Lengkap` (all 5).
- **6 social quick phrases**: `halo`, `terima kasih`, `maaf`, `selamat pagi`, `selamat malam`, `dadah`. Teaches greeting and gratitude routines per AAC best practice.
- **Emergency SOS surface**: long-press `bantu` for 1.5s to open a full-screen red overlay with 4 large buttons (Aku sakit / Panggil Ibu / Panggil Ayah / Panggil Ambulans). Each triggers an SMS via `sms:...?body=...` URI to a caregiver-configured contact. Ambulans pre-filled with `118` (Indonesian emergency medical number).
- **Emergency Contacts admin**: new card in AdminHome (🆘 Kontak Darurat) to configure the three phone numbers. Stored in `db.settings` under `emergencyContacts` key.
- **Idempotent top-up seed**: `seedDatabase()` now calls `topUpSeedData()` after initial seed so already-installed users pick up the Pertanyaan folder + social phrases without wiping their custom content.

### Documentation
- `CLAUDE.md` grid spec updated to match reality (8px gap + 8px padding, tightened for Tab A11 viewport). Note added explaining larger viewports have breathing room.

## v1.0.0 — Production Release (2026-04-10)
### Phase 6: Polish & Hardening
- Error boundaries for independent crash recovery per UI section
- Backup/restore vocabulary as JSON (export + import)
- Kiosk mode setup guide for tablet deployment
- Voice cloning guide (XTTS-v2) for personalized speech
- Accessibility audit: ARIA roles, performance monitoring, WCAG contrast documentation
- PWA update notification with improved manifest icons
- Build warning cleanup (BackupRestore, KioskGuide, VoiceCloneGuide)
- Deep audit fixes: 4 critical blob memory leaks, FK color corrections, modeling mode UX, scale consistency, search sizing
- Clinical audit: modeling mode now plays audio per ALgS research, configurable haptic feedback (off/light/medium/strong)

## v0.5.0-phase5 — AI Cloud Layer (2026-04-10)
### Phase 5: AI & Cloud
- OpenRouter API client (OpenAI-compatible gateway)
- CommunicationMilestone type + DB v3 schema migration
- Communication milestone detection: first word, 2-word combo, requests, refusals, comments, greetings
- Caregiver translation pane: OpenRouter interprets tap chains for communication partners
- AI vocabulary expansion suggestions based on usage patterns
- Supabase background sync: usage events, milestones, vocab snapshots every 5 minutes
- SLM abstraction layer: API-backed now, ready for local WASM model
- Parent web dashboard: PIN-protected analytics view via ?dashboard=true
- Build warning cleanup (VocabSuggestions, Dashboard)

## v0.4.1-improvement-sprint — UX Improvement Sprint (2026-04-09)
### Improvements from parallel Lovable prototype learnings
- Restructured to 6-column grid with 24 core words (was 10 in 2 rows)
- Fitzgerald Key color-coding: 6 grammatical categories (verb, pronoun, descriptor, negation, noun, preposition)
- UX safety: slower speech rate (0.85x/0.75x), haptic feedback (10ms), undo-delete with 2s toast, confirm-clear dialog
- Downloaded ARASAAC symbols for 14 new core words: ini, itu, makan, minum, ada, bisa, apa, punya, ke, di, dan, sama, minta, lihat
- UI polish: 18px labels, bigram cold-start predictions, sentence history, mute toggle, portrait orientation warning

## v0.4.0-phase4 — AI On-Device (2026-04-09)
### Phase 4: AI Features (On-Device)
- AI state management in Zustand store + IntentPrediction type
- Fuse.js symbol search engine: fuzzy matching over all vocabulary
- Frequency model: usage-based intent suggestions with recency and time-of-day weighting
- Intent suggestions: frequency-based word predictions after 2+ taps (top 3)
- Symbol search: full-screen Fuse.js fuzzy search overlay
- Modeling mode: long-press Bicara 2s, highlight-only taps, amber indicator
- Vocabulary gap detection + Phase 4 integration polish

## v0.3.0-phase3 — Admin & Customization (2026-04-09)
### Phase 3: Admin Panel
- Photo capture hook: camera/gallery with center-square crop (200px JPEG)
- PIN system + admin overlay shell: long-press sentence bar 3s, PIN keypad, admin home grid
- AddPerson flow: photo capture, name input, save to IndexedDB
- AddWord flow: photo, label, folder picker, TTS preview, save to IndexedDB
- QuickPhraseAdmin + VocabPackAdmin: phrase CRUD, reorder, vocabulary pack toggles
- UsageInsights + OnboardingGuide: usage stats, family onboarding guide in Bahasa Indonesia
- ManagePeople + EditWord: edit names/photos, soft delete, folder-organized word list
- Bug fixes: blob URL memory leaks in SymbolButton and PeopleRow, browser tsconfig exclusion

## v0.2.0-phase2 — Data & Audio Layer (2026-04-09)
### Phase 2: Persistence & Audio
- Installed Phase 2 deps: Dexie, Zustand, vite-plugin-pwa
- Zustand store: UI state for sentence bar, folder navigation, modes
- Dexie database schema + seed function: 5 folders, 50 words, 4 people, 7 phrases
- AudioEngine: preload pool, blob support, browser TTS fallback, sub-100ms target
- ARASAAC symbol download script + vocabulary list for build-time fetching
- All hooks: useVocabulary, useAudio, useSentenceBar, useUsageLog, useAdmin
- Rewired all components from hardcoded data to hooks + store + IndexedDB
- Service Worker via vite-plugin-pwa: full offline caching
- Vocabulary pack system: progressive masking with Dasar/Lengkap packs per folder
- Downloaded 51 ARASAAC pictograms for core and fringe words + image fallback fix
- Bug fix: missing ARASAAC symbols for mual (nausea), ngantuk (yawn), gatal (itch)

## v0.1.0-phase1 — Static UI Shell (2026-04-09)
### Phase 1: UI Components
- Project scaffold: Vite + React + Tailwind with research-optimized design tokens
- TypeScript types: Word, CoreWord, Folder, Person, QuickPhrase
- Shared components: AvatarCircle, BottomSheet
- Hardcoded vocabulary data: 10 core words, 50 fringe words, 4 people, 7 quick phrases
- WordChip: white pill with flash state for Bicara animation
- SymbolButton: color-coded by variant, 80ms tap feedback, research-optimized text sizing
- QuickPhrases: bottom sheet with 7 preset phrases from daily patterns
- CoreRow: core words in fixed positions (rows 1-2)
- PeopleRow: 4 people with avatar initials + disabled Tambah button
- FolderRow + FolderContents: folder open/close with Kembali (back) navigation
- SymbolGrid container: home vs folder state, core rows always frozen at top
- SentenceBar: chips, backspace, clear, Bicara flash, quick phrases trigger
- App.tsx wiring: sentence builder, folder navigation, browser TTS, quick phrases
- TypeScript build fix: vite-env.d.ts and ignoreDeprecations for baseUrl
