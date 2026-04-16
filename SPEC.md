# Suara — Product & Technical Specification

> Last updated: 2026-04-16, corresponds to **v1.1.0** (Deep audit Wave A + B).
> This is the single source of truth for what the app does and why. If the code and this document disagree, the code wins — but then this document is a bug and must be updated.

---

## 1. What this is

**Suara** ("voice" in Bahasa Indonesia) is a tablet-based AAC (Augmentative and Alternative Communication) app built for one specific primary user: a young non-speaking autistic woman in Jakarta. She taps symbol buttons to build Indonesian sentences that the tablet speaks aloud.

This is a personal family tool, not a commercial product. Every design decision is made for her:

- **Her motor needs** → fixed button positions, large targets (≥ 90×90 px at 1280×800 viewport), no dead-zone misses.
- **Her sensory needs** → configurable haptic feedback (off/light/medium/strong), no animations in the grid, warm off-white background (not pure white).
- **Her current vocabulary** → 24 core words + 5 folders × ~10 fringe words + 4 people = ~70 concepts she can already express.
- **Her caregivers (parents)** → admin mode to add her new words from camera photos, parent dashboard to track milestones.

**Target tablet:** Samsung Galaxy Tab A11 (~1000×600 CSS viewport, Android Chrome PWA).
**Language:** Bahasa Indonesia. All UI copy, all TTS, all research-selected vocabulary.
**Deployment:** Installed PWA, works 100% offline for communication. AI features require connectivity but never gate speaking.

---

## 2. Non-negotiable design rules

These come from AAC clinical research (see [RESEARCH.md](./RESEARCH.md)). Violating any of them hurts her ability to communicate — they are not preferences.

| Rule | Why |
|---|---|
| Core word positions NEVER move | LAMP motor planning — muscle memory depends on stable positions |
| AI never speaks for her | Autonomy — she is the communicator; AI only suggests, she taps |
| Core vocabulary works 100% offline | Cloud outage must not silence her |
| No animations in the grid | Autism sensory load — only 80ms scale-tap feedback is allowed |
| All UI text in Bahasa Indonesia | This is her language |
| Undo + confirm-clear on sentence | McNaughton & Light (2013): accidental deletion is the #1 frustration driver in AAC |
| Haptic fires even when muted | Motor confirmation for sensory needs; muting is about audio, not touch |
| Slower TTS rate (0.75–0.85×) | Schlosser et al. (2014): auditory processing in ASD benefits from slower speech |
| Fitzgerald Key color system | Carroll & Fitzgerald (1929): grammatical categories by color aid syntactic development |

---

## 3. User interaction model

### 3.1 Main screen

```
┌─────────────────────────────────────────────────────────────┐
│ [⚡][🔍][🕐][🔊][💬]  word chips ...  [⌫][✕ Hapus][▶ Bicara] │  ← SentenceBar (56 px, blue)
├─────────────────────────────────────────────────────────────┤
│ [intent suggestion 1] [sugg 2] [sugg 3]                     │  ← IntentSuggestions (53 px, amber tint)
├─────────────────────────────────────────────────────────────┤
│  mau    berhenti  bantu   ya      tidak   lagi              │  ← Row 1: verbs + negation + descriptor
│  pergi  suka      makan   minum   aku     kamu              │  ← Row 2: verbs + pronouns
│  ini    itu       ada     bisa    apa     punya             │  ← Row 3: pronouns + descriptor + question + verb
│  ke     di        dan     sama    minta   lihat             │  ← Row 4: prepositions + conjunction + verbs
│  [Ibu]  [Ayah]    [Bibi]  [Kakak] [+ Tambah] [·]            │  ← Row 5: People (max 4 + Tambah + spacer)
│  🍽️     🎮        👕      🫀      ❓      [·]              │  ← Row 6: Folders (Makanan, Aktivitas, Pakaian, Tubuh, Pertanyaan, spacer)
└─────────────────────────────────────────────────────────────┘
```

6-column grid, 10 rows total when visible. No scroll on Tab A11 — everything fits.

### 3.2 Core tap flow

1. User taps `mau`.
2. Chip appears in SentenceBar: `mau`.
3. Audio plays immediately (< 100 ms target from tap to sound).
4. Haptic fires on `onPointerDown` (configured level, even if app is muted).
5. After 2+ chips, IntentSuggestions shows up to 3 predictions (frequency model + bigrams + AI).
6. User taps `▶ Bicara` → full sentence is spoken at 0.75× rate.
7. Sentence is logged to history (accessible via 🕐 button).
8. User taps `✕ Hapus` → first tap shows "Yakin?" in red (1.5 s), second tap clears.

### 3.3 Folders

- Tap 🍽️ Makanan → grid replaces with folder contents (Dasar pack by default), plus a "Kembali" button.
- Tap any fringe word → added to sentence, user is returned home automatically.
- "Lihat semua" inside folder switches to Lengkap pack (full vocabulary).

### 3.4 Emergency surface (new in v1.0.1)

- Long-press `bantu` core word for 1.5 s.
- Full-screen red overlay with 4 large white buttons:
  - **Aku sakit** → opens SMS to Ibu with body "Aku sakit — butuh bantuan."
  - **Panggil Ibu** → opens SMS to Ibu
  - **Panggil Ayah** → opens SMS to Ayah
  - **Panggil Ambulans** → opens SMS to `118` (default) or caregiver-configured number
- Caregiver configures numbers via Admin → 🆘 Kontak Darurat.
- Falls back to browser `alert()` if contact isn't configured.

### 3.5 Quick phrases (⚡ bottom sheet)

Pre-composed multi-word sentences she uses regularly. Tap once → whole sentence enters bar and plays.
13 phrases seeded: 7 original ("mau nonton tv", "mau keluar", "mau tidur", "mau dirumah", "mau makan", "tidak mau", "matikan tv", "lapar", "mau mommy", "mau daddy") + 6 social (new in v1.0.1: "halo", "terima kasih", "maaf", "selamat pagi", "selamat malam", "dadah").

### 3.6 Modeling mode (Aided Language Stimulation)

- Long-press `▶ Bicara` for 2 s to enter.
- Amber banner: "Mode Modeling — suara main, kalimat tidak bertambah."
- Taps highlight with amber ring AND play audio, but do NOT add to sentence bar.
- Used by caregivers to model language alongside natural speech (Binger & Light, 2007).
- Exit by tapping "■ Hentikan" banner button.

### 3.7 Admin mode

- Long-press SentenceBar for 3 s.
- PIN screen (6-digit, SHA-256 hash in IndexedDB).
- Admin home shows cards for:
  - ➕ Tambah Kata (add word)
  - 👤 Tambah Orang (add person)
  - ✏️ Kelola Kata (manage/edit words)
  - 👥 Kelola Orang (manage people)
  - ⚡ Frasa Cepat (quick phrase CRUD)
  - 📦 Paket Kosakata (vocab packs toggle)
  - 📊 Insight Penggunaan (usage insights)
  - 🏅 Milestone (communication milestones)
  - 💡 Saran AI (AI vocab suggestions)
  - 💾 Cadangan Data (backup/restore)
  - 📱 Kiosk Mode (tablet setup guide)
  - 🎙️ Voice Cloning (XTTS-v2 guide)
  - 📘 Panduan Keluarga (family onboarding)
  - 🆘 Kontak Darurat (emergency contacts, new in v1.0.1)

### 3.8 Parent dashboard

- Access via URL `?dashboard=true` (bookmark on parent's phone).
- PIN-protected (same PIN as admin).
- Shows:
  - Top 10 most-tapped words
  - Communication milestones timeline
  - Vocabulary growth over time
  - Usage events count by day

---

## 4. Architecture

### 4.1 Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React 19 + Vite 8 + TypeScript 6 | Fast HMR, small bundle, typed |
| Styling | Tailwind v4 (`@theme` tokens) | Design system in one place |
| UI state | Zustand | Small, no boilerplate |
| Persisted data | Dexie.js (IndexedDB, v3 schema) | Works offline, fast queries |
| Audio | Web Speech API + Audio pool | Browser TTS fallback, preloaded MP3s when available |
| PWA | vite-plugin-pwa + Workbox | Installable, precached assets |
| AI | OpenRouter (OpenAI-compatible) | Pluggable model choice, family controls key |
| Cloud sync | Supabase (optional) | Parent dashboard data, 5-min background sync |
| Search | Fuse.js | Fuzzy Indonesian search over vocab |

### 4.2 State boundaries

- **Zustand store** (`src/store/appStore.ts`) — ephemeral UI state: current sentence, open folder, isAdminOpen, isEmergencyOpen, isModelingMode, isMuted, hapticLevel, sentence history, active suggestions.
- **IndexedDB** (`src/lib/db.ts`) — persisted data: 8 tables — `words`, `folders`, `people`, `usageEvents`, `quickPhrases`, `settings`, `vocabularyPacks`, `communicationMilestones`.
- **Static vocabulary** (`src/data/vocabulary.ts`) — 24 core words (hardcoded, NEVER in DB) + seed data for 6 folders, ~60 fringe words, 4 people, 13 quick phrases. Core positions are law.

### 4.3 Layering rules

1. **Components** → never touch IndexedDB directly. Always go through hooks.
2. **Hooks** → never touch Zustand and Dexie at the same time without a clear reason. Most hooks fall on one side.
3. **lib/** → pure functions + single-purpose classes (AudioEngine, frequency model). No React imports.
4. **Business logic** → belongs in hooks or lib, never in components.
5. **Imports** → always `@/` absolute, never relative `../../`.

### 4.4 Audio pipeline

```
User tap → SymbolButton.onPointerDown fires haptic (configured level)
        → onClick handler → addWord/playWord
                           ↓
               audioEngine.play(id, label)
                           ↓
          ┌── MP3 in pool → cloneNode + play() (< 50 ms)
          └── Miss → fallbackTTS(label) → SpeechSynthesisUtterance id-ID @ 0.85×
                                        → If queue busy: cancel() + 50 ms setTimeout + speak()
```

Pre-warming happens on first user gesture (autoplay policy): `warmupTtsEngine()` fires a silent utterance at rate 2 to prime the phoneme engine. Voice resolution is cached (`resolveIndonesianVoice()` only calls `getVoices()` once).

### 4.5 Data lifecycle

- **First launch** → `seedDatabase()` → `runInitialSeed()` writes all 6 folders, ~60 fringe words, 4 people, 13 quick phrases, 2 packs per folder.
- **Subsequent launches** → `seedDatabase()` calls `topUpSeedData()` which idempotently adds new folders/words/phrases released in later versions without wiping user-added content. This is how v1.0.1's Pertanyaan folder + social phrases reach already-installed users.
- **Schema migrations** → Dexie `version().upgrade()` callbacks in `db.ts`. v1 base, v2 +vocabularyPacks, v3 +communicationMilestones.

### 4.6 Error isolation

Each major UI section is wrapped in its own `ErrorBoundary`:
- SentenceBar (if this crashes, she can still tap)
- SymbolGrid
- AdminOverlay
- CaregiverPane
- EmergencyBoard

A crash in one does not crash the others — she keeps her voice even if one piece fails.

---

## 5. File tree (as of v1.0.1)

```
suara/
├── public/
│   ├── assets/
│   │   ├── audio/core/           # 24 MP3s (may be missing → TTS fallback)
│   │   └── symbols/
│   │       ├── core/             # 24 ARASAAC pictograms
│   │       └── fringe/           # ~60 ARASAAC pictograms (incl. siapa/dimana/kapan/kenapa/bagaimana new in v1.0.1)
│   ├── favicon.svg
│   ├── manifest.json             # PWA manifest, landscape, fullscreen, theme #2563EB
│   └── sw.js                     # Generated by Workbox
├── src/
│   ├── App.tsx                   # Composes SentenceBar + IntentSuggestions + SymbolGrid + overlays
│   ├── main.tsx                  # Root; sets up fullscreen + orientation lock + TTS warmup on first gesture
│   ├── components/
│   │   ├── AI/
│   │   │   ├── CaregiverPane.tsx
│   │   │   ├── EmergencyBoard.tsx       # NEW v1.0.1
│   │   │   ├── IntentSuggestions.tsx
│   │   │   └── SymbolSearch.tsx
│   │   ├── Admin/
│   │   │   ├── AddPerson.tsx
│   │   │   ├── AddWord.tsx
│   │   │   ├── AdminHome.tsx
│   │   │   ├── AdminOverlay.tsx
│   │   │   ├── BackupRestore.tsx
│   │   │   ├── EditWord.tsx
│   │   │   ├── EmergencyContacts.tsx    # NEW v1.0.1
│   │   │   ├── KioskGuide.tsx
│   │   │   ├── ManagePeople.tsx
│   │   │   ├── OnboardingGuide.tsx
│   │   │   ├── PhotoCropPreview.tsx
│   │   │   ├── QuickPhraseAdmin.tsx
│   │   │   ├── UsageInsights.tsx
│   │   │   ├── VocabPackAdmin.tsx
│   │   │   ├── VocabSuggestions.tsx
│   │   │   └── VoiceCloneGuide.tsx
│   │   ├── SentenceBar/
│   │   │   ├── QuickPhrases.tsx
│   │   │   ├── SentenceBar.tsx
│   │   │   └── WordChip.tsx
│   │   ├── SymbolGrid/
│   │   │   ├── CoreRow.tsx             # passes onLongPress to bantu for emergency surface
│   │   │   ├── FolderContents.tsx
│   │   │   ├── FolderRow.tsx           # pads to 6 cells with aria-hidden spacers
│   │   │   ├── PeopleRow.tsx           # pads to 6 cells with aria-hidden spacers
│   │   │   ├── SymbolButton.tsx        # haptic from store, onLongPress support, letter-circle fallback
│   │   │   └── SymbolGrid.tsx
│   │   └── shared/
│   │       ├── AvatarCircle.tsx
│   │       ├── BottomSheet.tsx
│   │       └── ErrorBoundary.tsx
│   ├── data/
│   │   └── vocabulary.ts               # 24 CORE_WORDS + SEED_FOLDERS + SEED_WORDS + SEED_PEOPLE + SEED_QUICK_PHRASES
│   ├── hooks/
│   │   ├── useAdmin.ts
│   │   ├── useAudio.ts                 # no longer double-fires haptic
│   │   ├── useCaregiverTranslation.ts
│   │   ├── useIntentSuggestions.ts
│   │   ├── useMilestones.ts
│   │   ├── usePhotoCapture.ts
│   │   ├── useSentenceBar.ts
│   │   ├── useUsageInsights.ts
│   │   ├── useUsageLog.ts
│   │   └── useVocabulary.ts
│   ├── lib/
│   │   ├── audio.ts                    # AudioEngine; 50ms setTimeout between cancel + speak on Android
│   │   ├── backup.ts
│   │   ├── bigrams.ts
│   │   ├── dashboard-data.ts
│   │   ├── db.ts                       # Dexie v3
│   │   ├── frequency.ts
│   │   ├── milestones.ts
│   │   ├── openrouter.ts
│   │   ├── pin.ts
│   │   ├── search.ts
│   │   ├── seed.ts                     # runInitialSeed + topUpSeedData (idempotent)
│   │   ├── slm.ts
│   │   ├── supabase.ts
│   │   ├── sync.ts
│   │   ├── vocabulary-gaps.ts
│   │   └── vocabulary-packs.ts
│   ├── pages/
│   │   └── Dashboard.tsx               # Parent dashboard at ?dashboard=true
│   ├── scripts/
│   │   ├── download-symbols.ts         # Build-time ARASAAC downloader
│   │   └── vocab-list.ts
│   ├── store/
│   │   └── appStore.ts                 # Zustand; isEmergencyOpen added in v1.0.1
│   ├── styles/
│   │   └── globals.css                 # Tailwind + @theme tokens + Fitzgerald Key palette
│   └── types/
│       └── index.ts                    # All shared types
├── AGENTS.md                          # Agent instructions (this sprint)
├── CHANGELOG.md                        # Release notes
├── CLAUDE.md                           # Codebase cheatsheet for Claude sessions
├── README.md
├── RESEARCH.md                         # All clinical + UX research citations
├── SPEC.md                             # This file
├── index.html
├── package.json
├── tsconfig.*.json
├── vercel.json
├── .npmrc                              # legacy-peer-deps for Vercel npm install
└── vite.config.ts
```

---

## 6. Environment variables

```bash
VITE_OPENROUTER_API_KEY=            # Required for AI features (intent, caregiver, vocab expansion)
VITE_OPENROUTER_MODEL=              # Default: anthropic/claude-sonnet-4-20250514
VITE_SUPABASE_URL=                  # Optional: enables cloud sync + parent dashboard
VITE_SUPABASE_ANON_KEY=             # Optional: enables cloud sync
```

All are prefixed `VITE_` so they're baked into the client bundle. That means they are **public** — any OpenRouter key you ship is visible to anyone with devtools. This is acceptable for a personal family app, not for commercial use. Rotate if concerned.

---

## 7. Deployment

- **Platform:** Vercel (free tier).
- **URL:** https://suara-tau.vercel.app
- **Config:** `vercel.json` — SPA rewrites + SW cache headers.
- **Build:** `npm run build` → `dist/` → Vercel serves static + SW.
- **Deploy command:** `vercel deploy --prod --yes --scope abimnagari-gmailcoms-projects`
- **npm compatibility:** `.npmrc` has `legacy-peer-deps=true` because Vercel's npm is stricter about peer deps than local.

### Tablet install flow

1. Open https://suara-tau.vercel.app in Chrome on Tab A11.
2. Chrome menu → "Install app" → confirm.
3. App launches full-screen, landscape-locked.
4. First tap anywhere triggers orientation lock + TTS warmup.
5. For true kiosk: Android Settings → Security → App pinning → pin Suara.

---

## 8. Performance budgets

| Metric | Target | Current |
|---|---|---|
| Tap → audio start | < 100 ms | ~40 ms (cloneNode), ~150 ms (TTS cold) |
| Tap → visible feedback | < 16 ms | 80 ms scale animation (deliberate) |
| First Contentful Paint | < 2 s on 4G | ~1.1 s |
| Bundle size (gzipped) | < 200 kB | 126 kB JS + 6 kB CSS |
| PWA precache | < 2 MB | 1.83 MB (symbols + audio + JS) |
| IndexedDB query (folder read) | < 50 ms | ~5 ms |

Perf warnings in dev console (`import.meta.env.DEV` guarded) when tap exceeds 100 ms.

---

## 9. Known limitations / future work

- **Voice is browser TTS**, not her family's voices. Voice cloning (XTTS-v2) is documented in the admin guide but not implemented. Would require either self-hosted inference or pre-generated per-word MP3s.
- **OpenRouter API key is public** (VITE_ prefix). Acceptable for personal use; for multi-user deployments, move AI calls behind a proxy.
- **No multi-device sync of custom vocabulary.** Admin changes (photos, new words, PIN) are per-device. Supabase sync covers usage events and milestones but not vocabulary content.
- **Search is Indonesian-only** (no Javanese or English fallback).
- **Bigram model is static.** The frequency + bigram + AI 3-tier intent engine is good but doesn't learn her personal phrase patterns. AI layer partially compensates.
- **Emergency surface uses `sms:` URIs**, which only work on mobile. On desktop they silently fail — acceptable because the target is Tab A11.

---

## 10. Versioning

Semantic versioning, but the 1.0.0 line represents "shipped to my daughter." Minor versions (1.1, 1.2) are feature additions; patch versions (1.0.x) are bugfix + small content sprints.

| Version | Date | Scope |
|---|---|---|
| v1.1.0 | 2026-04-16 | Deep audit Wave B (P1): FK colors on fringe, visible ⚙️ admin, undo toast, modeling ring persist, test-SMS/call, VocabPack removed |
| v1.0.3 | 2026-04-16 | Deep audit Wave A (P0): usage logging wired, Ibu initial, Tambah→admin, no auto-clear, Ambulans tel: |
| v1.0.2 | 2026-04-16 | Tab A11 viewport fit |
| v1.0.1 | 2026-04-16 | Clinical content (Pertanyaan folder, social phrases, emergency surface) |
| v1.0.0 | 2026-04-10 | Production release (Phase 6: Polish & Hardening) |
| v0.5.0 | 2026-04-10 | AI cloud layer |
| v0.4.1 | 2026-04-09 | UX improvement sprint (Lovable prototype learnings) |
| v0.4.0 | 2026-04-09 | AI on-device |
| v0.3.0 | 2026-04-09 | Admin & customization |
| v0.2.0 | 2026-04-09 | Data & audio layer |
| v0.1.0 | 2026-04-09 | Static UI shell |

Full details in [CHANGELOG.md](./CHANGELOG.md).
