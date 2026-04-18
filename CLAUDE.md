# Suara — AAC Communication App

> **Current version:** v2.0.0 (2026-04-18) — Major grid redesign + progressive disclosure
> **Live at:** https://suara-tau.vercel.app
> **Related docs:** [SPEC.md](./SPEC.md) (product+tech spec) · [RESEARCH.md](./RESEARCH.md) (clinical evidence) · [AGENTS.md](./AGENTS.md) (AI agent rules) · [CHANGELOG.md](./CHANGELOG.md) (release history) · [.audit/](./.audit/) (deep-audit reports) · [aac-starter-kit/](./aac-starter-kit/) (shareable kit for other parents)

## What This Is
Suara ("voice" in Indonesian) is a tablet-based AAC app for a young non-speaking autistic woman in Jakarta. She taps symbol buttons to build Bahasa Indonesia sentences the tablet speaks aloud. Every design decision is research-backed (see [RESEARCH.md](./RESEARCH.md)) and serves her communication.

Target device: Samsung Galaxy Tab A11 (1000×600 CSS viewport). Installed as a PWA, works 100% offline for core communication.

## Quick Start
```bash
npm install
npm run dev                   # Dev server at localhost:5173
npm run build                 # Production build (tsc -b && vite build)
npm run preview               # Preview production build
npm run download-symbols      # Download ARASAAC pictograms (build-time only)
npx tsc --noEmit              # Type-check without emit
vercel deploy --prod --yes --scope abimnagari-gmailcoms-projects
```

## Architecture
- **Framework:** React 19 + TypeScript 6 + Vite 8
- **Styling:** Tailwind CSS v4 with `@theme` design tokens
- **State:** Zustand (UI) + Dexie.js/IndexedDB v3 (persisted)
- **Audio:** `AudioEngine` class with Web Speech API fallback (Indonesian, 0.85× word / 0.75× sentence)
- **AI:** OpenRouter API (OpenAI-compatible), frequency+bigram+AI 3-tier intent, Fuse.js search
- **PWA:** vite-plugin-pwa with Workbox, installable on Android, landscape-locked, fullscreen
- **Sync:** Optional Supabase background sync (5 min) — usage events, milestones, vocab snapshots
- **Deploy:** Vercel (free tier), SPA rewrites in `vercel.json`, `.npmrc` has `legacy-peer-deps=true`

## Critical Rules (NEVER violate)
1. **Core word positions NEVER move** — motor planning depends on consistency (LAMP research)
2. **AI NEVER speaks for her** — suggestions display only, she taps to accept
3. **Core communication works 100% offline** — cloud features are optional
4. **No animations in the grid** — only 80 ms `scale(0.96)` tap feedback allowed
5. **All UI text in Bahasa Indonesia**
6. **No business logic in components** — extract to hooks
7. **No direct IndexedDB access in components** — always through hooks
8. **Use `@/` absolute imports** — never relative `../../`
9. **Undo + confirm-clear on sentence bar** — accidental deletion is #1 AAC abandonment cause
10. **Haptic fires even when muted** — muting is audio, not touch. ONE source (`SymbolButton.onPointerDown`).

## File Structure (as of v1.0.1)

```
src/
  App.tsx                              # Top-level composition: SentenceBar + IntentSuggestions + SymbolGrid + overlays
  main.tsx                             # Entry; first-gesture fullscreen + orientation + TTS warmup
  vite-env.d.ts
  components/
    AI/
      CaregiverPane.tsx                # AI translation pane for communication partners
      EmergencyBoard.tsx               # v1.0.1 — red SOS overlay (long-press bantu)
      IntentSuggestions.tsx            # 3 prediction buttons after 2+ words; 53px placeholder when empty
      SymbolSearch.tsx                 # Fuse.js fuzzy search overlay
    Admin/
      AddPerson.tsx                    # Photo capture + name for new person
      AddWord.tsx                      # Photo + label + folder picker for new word
      AdminHome.tsx                    # Admin home grid (entry to all admin features)
      AdminOverlay.tsx                 # PIN-gated full-screen admin overlay
      BackupRestore.tsx                # Export/import vocabulary as JSON
      EditWord.tsx                     # Edit existing word details
      EmergencyContacts.tsx            # v1.0.1 — Ibu/Ayah/Ambulans phone number config
      KioskGuide.tsx                   # Tablet kiosk mode setup
      ManagePeople.tsx                 # Edit/delete people
      OnboardingGuide.tsx              # Family onboarding guide in Bahasa Indonesia
      PhotoCropPreview.tsx             # Center-square crop preview (200px JPEG)
      QuickPhraseAdmin.tsx             # Quick phrase CRUD + reorder
      UsageInsights.tsx                # Top words, dead-ends, milestones
      VocabPackAdmin.tsx               # Toggle Dasar/Lengkap per folder
      VocabSuggestions.tsx             # AI vocabulary expansion suggestions
      VoiceCloneGuide.tsx              # XTTS-v2 voice cloning setup guide
    SentenceBar/
      QuickPhrases.tsx                 # Bottom sheet, 13 preset phrases (7 original + 6 social v1.0.1)
      SentenceBar.tsx                  # Top blue bar; minHeight 56, not fixed height
      WordChip.tsx                     # White pill with flash state
    SymbolGrid/
      HomeGrid.tsx                     # v2.0.0 — unified 6×6 grid (core + folders + growth slots + progressive disclosure)
      PeopleContents.tsx               # v2.0.0 — full-screen people folder view with photos
      FolderContents.tsx               # fringe words full-screen, auto-return-to-home
      SymbolButton.tsx                 # FK colors for core+fringe; folder teal gradient; haptic; onLongPress
      SymbolGrid.tsx                   # routes: HomeGrid | FolderContents | PeopleContents
      CoreRow.tsx                      # legacy (retained, not imported by SymbolGrid)
      FolderRow.tsx                    # legacy
      PeopleRow.tsx                    # legacy
    shared/
      AvatarCircle.tsx
      BottomSheet.tsx
      ErrorBoundary.tsx                # Independent crash recovery per section
      InstallBanner.tsx                # v1.2.2 — programmatic PWA install via beforeinstallprompt
  data/
    vocabulary.ts                      # 26 CORE_WORDS (hardcoded) + SEED_FOLDERS + SEED_WORDS + SEED_PEOPLE + SEED_QUICK_PHRASES
  hooks/
    useAdmin.ts
    useAudio.ts                        # playWord, playSentence (no longer double-fires haptic)
    useCaregiverTranslation.ts
    useIntentSuggestions.ts
    useMilestones.ts
    usePhotoCapture.ts
    useSentenceBar.ts                  # addWord, removeLastWord w/ 2s undo toast, clearSentence w/ confirm
    useUsageInsights.ts
    useUsageLog.ts
    useVocabulary.ts                   # Reactive reads via dexie-react-hooks
  lib/
    audio.ts                           # AudioEngine; 50ms setTimeout between cancel+speak on Chrome Android
    backup.ts
    bigrams.ts
    dashboard-data.ts
    db.ts                              # Dexie v3 (8 tables)
    frequency.ts
    milestones.ts
    openrouter.ts
    pin.ts                             # SHA-256
    search.ts
    seed.ts                            # runInitialSeed + topUpSeedData (idempotent migration)
    slm.ts
    supabase.ts
    sync.ts
    vocabulary-gaps.ts
    vocabulary-packs.ts
  pages/
    Dashboard.tsx                      # Parent dashboard (?dashboard=true)
  scripts/
    download-symbols.ts                # Build-time ARASAAC downloader (excluded from browser tsconfig)
    vocab-list.ts
  store/
    appStore.ts                        # Zustand; isEmergencyOpen added v1.0.1
  styles/
    globals.css                        # @theme tokens, Fitzgerald Key palette, WCAG verified
  types/
    index.ts                           # All shared types (DB + runtime)
```

## Color System (Fitzgerald Key)
Per-category color-coding supports grammatical awareness and reduces visual search time (Thistle & Wilkinson 2013). All ratios WCAG AA verified.

| Category     | Text Color | Background | Contrast | Example words |
|--------------|-----------|-----------|----------|---------------|
| Verbs        | #166534   | #DCFCE7   | 5.8:1    | mau, pergi, makan, minum, lihat, bisa |
| Pronouns     | #854d0e   | #FEF9C3   | 5.1:1    | aku, kamu, ini, itu |
| Descriptors  | #1d4ed8   | #DBEAFE   | 5.5:1    | ya, lagi, ada |
| Negation     | #be185d   | #FCE7F3   | 5.3:1    | tidak |
| Nouns        | #c2410c   | #FFEDD5   | 4.9:1    | (fringe words in Makanan, Pakaian, Tubuh folders) |
| Prepositions | #7e22ce   | #F3E8FF   | 5.6:1    | ke, di, dan, sama |
| People       | #15803d   | #DCFCE7   | 4.6:1    | Ibu, Ayah, Bibi, Kakak |
| Folders      | #374151   | #F3F4F6   | 9.4:1    | 🍽️ Makanan, 🎮 Aktivitas, 👕 Pakaian, 🫀 Tubuh, ❓ Pertanyaan |

- App background: `#F8F7F4` (warm off-white; NOT pure white — reduces autism sensory fatigue)
- Sentence bar: `#2563EB` (white text, 5.2:1)
- Emergency board: `#DC2626` full-screen red overlay with white buttons

## Grid Layout (v2.0.0 — sentence-order columns)

The grid follows sentence order left → right, based on Smartbox Grid Pad + Avaz AAC analysis + Wilkinson et al. 2022 spatial clustering research:

```
  Col 0        Col 1        Col 2        Col 3        Col 4        Col 5
  WHO          DOING        DOING        DESCRIBE     CONNECT      TOPICS
  (yellow)     (green)      (green)      (blue/pink)  (purple)     (teal)
┌────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│ aku        │ mau        │ makan      │ ya         │ ke         │👥 Orang   │
│ kamu       │ pergi      │ minum      │ tidak      │ di         │🍽️ Makanan │
│ ini        │ suka       │ lihat      │ lagi       │ dan        │🎮 Aktivitas│
│ itu        │ bantu      │ punya      │ bisa       │ sama       │📍 Tempat  │
│ apa        │ berhenti   │ minta      │ ada        │  [growth]  │😊 Perasaan│
│  [growth]  │ nonton     │ bobo       │  [growth]  │  [growth]  │❓ Pertanyaan│
└────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

- **26 core words** — HARDCODED in `src/data/vocabulary.ts`, NEVER from database. Positions are motor-memory anchors.
- **6 folders** in col 5 — Orang (people as folder, Smartbox/Avaz pattern), Makanan, Aktivitas, Tempat, Perasaan (merged with old Rasa Tubuh), Pertanyaan
- **4 growth slots** (dashed placeholders) — fill with new core words as she grows (e.g., siapa, boleh, sudah). Never reshuffle existing positions.
- **Rendered by `HomeGrid.tsx`** — unified component replaces old CoreRow + PeopleRow + FolderRow separation.
- **Folder view (when folder tapped):** core rows HIDDEN, fringe gets full 5-row grid + Kembali. Auto-return to home after fringe tap. People folder opens `PeopleContents.tsx` (photos + Tambah).
- Grid gap: **6px**, padding: **6px** (via `gap-[6px] p-1.5`)

### Progressive disclosure (v2.0.0)
Caregivers can hide any core word or folder via Admin → 👁️ Atur Tampilan. Hidden items render as subtle dashed placeholders (position preserved for motor memory). Start with ~12 words visible, reveal more as she grows. `hiddenWords` array stored in IndexedDB settings, restored on app init.
- Button border-radius: 14px (`rounded-button` token)
- Press animation: `scale(0.96)` for 80ms (the ONLY allowed grid animation)
- Button labels: 18px bold, 0.4px letter-spacing, Nunito font
- Symbol images: up to 52×52px within buttons
- Fallback glyph: neutral dashed circle with first letter of label (NOT `?` — that would read as "apa")

## Database (Dexie v3)
Tables: `words`, `folders`, `people`, `usageEvents`, `quickPhrases`, `settings`, `vocabularyPacks`, `communicationMilestones`

- Core words are NOT in the database — hardcoded in `src/data/vocabulary.ts` (motor memory depends on them)
- Fringe words linked to folders by `folderId`
- Settings is key-value store (`key` primary). Keys include: `pinHash`, `appVersion`, `hapticLevel`, `emergencyContacts` (v1.0.1)
- Usage events logged on every tap (never blocking UI)
- DB version history: v1 (base), v2 (+vocabularyPacks), v3 (+communicationMilestones)
- Seeding: `seedDatabase()` → `runInitialSeed()` on first install, `topUpSeedData()` on every launch (idempotent migration)

## Key Components
- **SentenceBar** — top blue bar, word chips, action buttons (⚡ quick phrases, 🕐 history, 💬 caregiver, ⚙️ admin). Removed in v1.2.2: 🔍 search (distraction) and 🔊 mute (device volume handles it). ⌫ backspace (with visible undo toast), ✕ Hapus (confirm-clear), ▶ Bicara (long-press 2s → modeling mode).
- **SymbolGrid** — 6-col grid. Home: renders `HomeGrid` (unified 6×6 with core + folders + growth slots). Folder: renders `FolderContents` (fringe words full-screen) or `PeopleContents` (people with photos). Core hidden during folder view. Auto-return-to-home after fringe/person tap.
- **HomeGrid** (v2.0.0) — unified grid component replacing CoreRow + PeopleRow + FolderRow. Renders core words from CORE_WORDS array, folders from SEED_FOLDERS, and dashed growth slots. Reads `hiddenWords` from store for progressive disclosure.
- **PeopleContents** (v2.0.0) — full-screen people view when 👥 Orang folder is tapped. Shows all active people with photos + Tambah (opens admin). Auto-returns to home after tapping a person.
- **InstallBanner** (v1.2.2) — floating top banner that appears when `beforeinstallprompt` fires; tap "Install" to trigger Chrome's native PWA install dialog programmatically.
- **WordVisibility** (v2.0.0) — Admin → 👁️ Atur Tampilan. Toggle core words + folders on/off. Proloquo's "progressive language" model.
- **SymbolButton** — color-coded by variant + Fitzgerald Key `fkColor` (applies to BOTH `core` and `fringe` variants as of v1.1.0); haptic on `onPointerDown`; optional `onLongPress` (1500 ms, used by `bantu` for emergency). Modeling-mode amber ring persists 2s (was 500ms before v1.1.0).
- **IntentSuggestions** — 3 prediction buttons after 2+ words; renders an invisible 53px placeholder when empty to prevent grid reflow
- **EmergencyBoard** — full-screen red overlay with 4 large SMS buttons; triggered by 1.5 s long-press on `bantu`
- **AdminOverlay** — PIN-gated full-screen overlay, long-press SentenceBar 3s to open
- **CaregiverPane** — AI translation for communication partners (OpenRouter)
- **SymbolSearch** — Fuse.js fuzzy search overlay
- **ErrorBoundary** — wraps each major section for independent crash recovery

## Hooks (all business logic lives here)
- **useVocabulary** — reactive reads from IndexedDB (folders, people, phrases) via dexie-react-hooks
- **useAudio** — playWord, playSentence. Syncs `hapticLevel` to AudioEngine but no longer fires vibration (moved to SymbolButton)
- **useSentenceBar** — addWord (with usage logging — v1.0.3), removeLastWord (exposes `undoWord` + `restoreUndo` for the visible 2s toast — v1.1.0), clearSentence (confirm dialog), speak (sentence PERSISTS after speaking as of v1.0.3 — no auto-clear)
- **useUsageLog** — tap event logging with session ID, hour-of-day, day-of-week
- **useAdmin** — PIN verify/set, admin state management
- **useIntentSuggestions** — frequency + bigram + OpenRouter (3-tier fallback)
- **useCaregiverTranslation** — OpenRouter interprets tap chains for caregivers
- **useMilestones** — milestone detection + display
- **usePhotoCapture** — camera/gallery + center-square crop to 200px JPEG
- **useUsageInsights** — top words, dead-end folders, milestone display

## AI Features (all optional; core offline)
1. **Intent suggestions** — frequency model + static bigrams + OpenRouter API (3-tier)
2. **Symbol search** — Fuse.js fuzzy over all vocabulary
3. **Caregiver translation** — OpenRouter interprets her tap chains
4. **Vocabulary expansion** — AI suggests new words based on usage patterns (admin panel)
5. **Milestone detection** — first word, first combo, first request/comment/greeting/refusal, vocab growth
6. **Vocabulary gap detection** — flags unused folders in admin

## Admin Mode (two entry paths)
1. Long-press blue sentence bar for 3 seconds
2. Tap the ⚙️ gear icon in the sentence bar (v1.1.0)
3. Tap the + "Tambah" placeholder in people row (v1.0.3)

All paths land on the PIN gate (SHA-256 hash in IndexedDB). 12 admin sections:
- 👁️ Atur Tampilan (progressive disclosure — hide/show core words + folders)
- 📝 Kelola Kata (edit/add/delete fringe words with photos)
- 👥 Kelola Orang (edit/add/delete people with photos)
- ⚡ Frasa Cepat (phrase CRUD + reorder)
- 📊 Wawasan Penggunaan (usage analytics + milestones)
- 📈 Dashboard Orang Tua (opens parent dashboard in new tab — v1.1.0)
- 📖 Panduan Keluarga (family onboarding in Bahasa Indonesia)
- 🤖 Saran Kosakata (AI vocab expansion suggestions)
- 💾 Cadangan Data (JSON export/import)
- 📱 Mode Kiosk (tablet setup guide)
- 🎙️ Kloning Suara (XTTS-v2 guide for future voice personalization)
- 🆘 Kontak Darurat (Ibu/Ayah/Ambulans config; Ibu/Ayah → `sms:`, Ambulans → `tel:`; test button per contact)

Removed in v1.1.0: 📦 Paket Kosakata — toggle never reached FolderContents (silent feature). Use Kelola Kata for per-word pruning instead.

## Environment Variables
```
VITE_OPENROUTER_API_KEY=               # Required for AI features (intent, caregiver, vocab expansion)
VITE_OPENROUTER_MODEL=                 # Default: anthropic/claude-sonnet-4-20250514
VITE_SUPABASE_URL=                     # Optional: enables cloud sync + parent dashboard
VITE_SUPABASE_ANON_KEY=                # Optional: enables cloud sync
```
All `VITE_` prefixed → baked into client bundle → **public**. Acceptable for personal family use.

## Modeling Mode (Aided Language Stimulation — Binger & Light 2007)
- Long-press `▶ Bicara` for 2 s to toggle
- Amber banner: **"Mode Modeling — suara main, kalimat tidak bertambah"**
- Buttons highlight with amber ring AND play audio (audio IS played — that's the research)
- Words do NOT add to the sentence bar (caregiver is demonstrating, not composing)
- Tap "■ Hentikan" banner button to exit

## Haptic Feedback
- Configurable via `appStore.hapticLevel`: `off` (0) / `light` (10ms) / `medium` (30ms) / `strong` (50ms)
- Fires from a SINGLE source: `SymbolButton.onPointerDown` (was double-firing in v1.0.0; fixed v1.0.1)
- Fires even when muted — motor confirmation is separate from audio
- Does NOT fire on folder/back navigation (not speech output)
- Long-press trigger has an extra 50 ms pulse to confirm the gesture registered

## Emergency Surface (v1.0.1)
- Long-press `bantu` core word for 1.5 s
- Full-screen red overlay with 4 large white buttons: Aku sakit / Panggil Ibu / Panggil Ayah / Panggil Ambulans
- Each triggers `sms:NUMBER?body=ENCODED_MESSAGE` → opens SMS composer
- Caregivers configure numbers in Admin → 🆘 Kontak Darurat
- Ambulans defaults to `118` (Indonesian emergency medical)
- Falls back to alert if contact not configured

## Data Safety (v1.3.0+)

Three layers of data protection:
1. **`navigator.storage.persist()`** — prevents Chrome from evicting IndexedDB under storage pressure. Called in `main.tsx` init.
2. **Auto-backup to localStorage** — every admin edit (people, words, phrases, settings) triggers a debounced (2s) snapshot of all config data to localStorage via Dexie table hooks in `db.ts`. If IndexedDB is wiped, auto-restore overlays user customizations on next launch. Photos NOT included (localStorage size limit). See `src/lib/auto-backup.ts`.
3. **Manual JSON backup** — Admin → 💾 Cadangan Data. Exports everything including photo blobs. The only way to preserve photos across a full data loss.

Re-seed guard: if `appVersion` flag is lost but tables have data, flag is restored without re-seeding (prevents duplicate rows).

## PWA Configuration
- Manifest: `display: 'fullscreen'`, `display_override: ['fullscreen', 'standalone']`, `orientation: 'landscape'`
- Theme color: `#2563EB`, background color: `#F8F7F4`
- Service Worker: Workbox with precaching (79 entries, ~1.83 MB)
- `registerType: 'autoUpdate'` — prompts user with toast when new version available
- First-gesture orientation lock + fullscreen (Screen Orientation API requires fullscreen first on Android Chrome)

## Parent Dashboard
- Access via `?dashboard=true` URL parameter (bookmark on parent phone)
- PIN-protected (same PIN as admin)
- Shows: usage analytics, word frequency, communication milestones, vocab growth
- Separate page component (`src/pages/Dashboard.tsx`), not part of main AAC interface

## Build Tags
- `v2.0.0` — **MAJOR: Grid redesign** (2026-04-18) — Column-organized layout (sentence order), progressive disclosure (hide/show words), People as folder, Perasaan+Tubuh merged, nonton+bobo as core, growth slots, HomeGrid unified component
- `v1.3.0` — **State persistence** (2026-04-18) — navigator.storage.persist(), auto-backup to localStorage, hapticLevel persisted, error handling on admin saves, duplicate guards, Tubuh→Rasa Tubuh rename
- `v1.2.2` — **UX cleanup** (2026-04-16) — removed 🔍 + 🔊 buttons, InstallBanner, KioskGuide rewrite, real ARASAAC icons for minta/punya/lihat
- `v1.2.1` — **Folder view hotfix** (2026-04-16) — hide core in folder view, revert spacer bug
- `v1.2.0` — **Deep audit Wave C** (2026-04-16) — quick phrase expansion, a11y focus-visible + ARIA live
- `v1.1.0` — **Deep audit Wave B** (2026-04-16) — visible ⚙️ admin, test-SMS, VocabPack removal
- `v1.0.3` — **Deep audit Wave A** (2026-04-16) — usage logging wired, no auto-clear, Ambulans tel:
- `v1.0.2` — Tab A11 viewport fit (grid gap 8→6, IntentSuggestions placeholder removed)
- `v1.0.1` — Clinical content sprint — Pertanyaan folder, social phrases, emergency SOS, bug fixes
- `v1.0.0` — Production Release (Phase 6: Polish & Hardening)
- `v0.5.0-phase5` — AI Cloud Layer
- `v0.4.1-improvement-sprint` — UX Improvement Sprint
- `v0.4.0-phase4` — AI On-Device
- `v0.3.0-phase3` — Admin & Customization
- `v0.2.0-phase2` — Data & Audio Layer
- `v0.1.0-phase1` — Static UI Shell

## Research References (summary — full in [RESEARCH.md](./RESEARCH.md))
- **Fitzgerald Key (1929, Carroll/Fitzgerald)** — color-coding by grammatical category
- **LAMP (Halloran 2006)** — motor planning, why core positions never move
- **Binger & Light (2007)** — Aided Language Stimulation = modeling mode
- **Schlosser et al. (2014)** — speech rate 0.75–0.85× for autism
- **Trewin et al. (PMC3572909)** — button sizing for motor impairment
- **WCAG 2.1** — contrast (≥4.5:1), touch targets (≥44px)
- **McNaughton & Light (2013)** — accidental deletion as #1 AAC abandonment cause
- **Banajee, Dicarlo, Stricklin (2003)** — core vocabulary research (70-80% expressive coverage)
- **Trnka et al. (2009)** — intent prediction, frequency + recency + bigrams
- **Brewster et al. (2007)** — tactile feedback for motor confirmation

## When something's broken on the tablet
1. Check browser console (Chrome Android remote debug via `chrome://inspect`)
2. Clear site data → reinstall PWA → tests `runInitialSeed()` path
3. Don't clear DB → reload → tests `topUpSeedData()` migration path
4. Check `registration.waiting` in dev tools to confirm SW update state
5. If audio silent: verify TTS warmup fired (needs first user gesture), voices loaded, not muted
6. If grid looks wrong: check `useVocabulary` is returning expected folder/people counts — padding should fill to 6

## Deployment checklist
- [ ] `npx tsc --noEmit` clean
- [ ] `npm run build` succeeds with no warnings
- [ ] CHANGELOG.md updated
- [ ] Tag new version (`git tag -a vX.Y.Z -m "..."`)
- [ ] `vercel deploy --prod --yes --scope abimnagari-gmailcoms-projects`
- [ ] Verify live URL, check PWA update toast appears on existing install
- [ ] Test on Tab A11: fullscreen, orientation locked, audio plays, haptic respects setting
