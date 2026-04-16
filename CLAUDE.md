# Suara — AAC Communication App

## What This Is
Suara ("voice" in Indonesian) is a tablet-based AAC app for a young woman with autism in Jakarta. She taps symbol buttons to build sentences the device speaks aloud. Every design decision is research-backed and serves her communication.

## Quick Start
```bash
npm install
npm run dev          # Dev server at localhost:5173
npm run build        # Production build
npm run preview      # Preview production build
npm run download-symbols  # Download ARASAAC pictograms
```

## Architecture
- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 with @theme design tokens
- **State:** Zustand (UI state) + Dexie.js/IndexedDB (persisted data)
- **Audio:** AudioEngine class with browser TTS fallback (Indonesian, 0.85x/0.75x speed)
- **AI:** OpenRouter API (configurable model), frequency-based intent suggestions, Fuse.js search
- **PWA:** vite-plugin-pwa with Workbox caching, installable on Android
- **Sync:** Optional Supabase background sync (every 5 min when configured)

## Critical Rules (NEVER violate)
1. Core word positions NEVER move — motor planning depends on consistency
2. AI NEVER speaks for her — suggestions display only, she taps to accept
3. Core communication works 100% offline — cloud features are optional
4. No animations in the communication grid — only 80ms scale tap feedback
5. All UI text in Bahasa Indonesia
6. No business logic in components — extract to hooks
7. No direct IndexedDB access in components — always through hooks
8. Use @/ absolute imports — never relative ../../

## File Structure
```
src/
  App.tsx                              # Root — SentenceBar + IntentSuggestions + SymbolGrid + overlays
  main.tsx                             # Entry point
  vite-env.d.ts                        # Vite client types
  components/
    AI/
      CaregiverPane.tsx                # AI translation pane for communication partners
      IntentSuggestions.tsx             # 3 prediction buttons after 2+ words
      SymbolSearch.tsx                  # Fuse.js fuzzy search overlay
    Admin/
      AddPerson.tsx                    # Photo capture + name input for new person
      AddWord.tsx                      # Photo + label + folder picker for new word
      AdminHome.tsx                    # Admin home grid (entry to all admin features)
      AdminOverlay.tsx                 # PIN-gated full-screen admin overlay
      BackupRestore.tsx                # Export/import vocabulary as JSON
      EditWord.tsx                     # Edit existing word details
      KioskGuide.tsx                   # Tablet kiosk mode setup instructions
      ManagePeople.tsx                 # Edit/delete people
      OnboardingGuide.tsx              # Family onboarding guide in Bahasa Indonesia
      PhotoCropPreview.tsx             # Center-square crop preview (200px JPEG)
      QuickPhraseAdmin.tsx             # Quick phrase CRUD + reorder
      UsageInsights.tsx                # Top words, dead-ends, milestones
      VocabPackAdmin.tsx               # Vocabulary pack toggles (Dasar/Lengkap)
      VocabSuggestions.tsx             # AI-powered vocabulary expansion suggestions
      VoiceCloneGuide.tsx              # XTTS-v2 voice cloning setup guide
    SentenceBar/
      QuickPhrases.tsx                 # Bottom sheet with preset phrases
      SentenceBar.tsx                  # Top blue bar, word chips, action buttons, Bicara
      WordChip.tsx                     # White pill with flash state for speech animation
    SymbolGrid/
      CoreRow.tsx                      # Renders one row of 6 core words (fixed positions)
      FolderContents.tsx               # Fringe words inside an open folder
      FolderRow.tsx                    # 5 category folders + 1 slot
      PeopleRow.tsx                    # People with avatar initials (max 6)
      SymbolButton.tsx                 # Color-coded button by FK category
      SymbolGrid.tsx                   # 6-col grid container — CoreRows + PeopleRow + FolderRow
    shared/
      AvatarCircle.tsx                 # Circular avatar with initial letter
      BottomSheet.tsx                  # Slide-up sheet component
      ErrorBoundary.tsx                # Independent crash recovery per section
  data/
    vocabulary.ts                      # 24 hardcoded core words + seed data for folders/people/phrases
  hooks/
    useAdmin.ts                        # PIN verify/set, admin state
    useAudio.ts                        # playWord, playSentence (haptic + mute check)
    useCaregiverTranslation.ts         # OpenRouter API interpretation for caregivers
    useIntentSuggestions.ts            # Frequency model computation
    useMilestones.ts                   # Milestone detection and display
    usePhotoCapture.ts                 # Camera/gallery + square crop
    useSentenceBar.ts                  # addWord, removeLastWord (undo), clearSentence (confirm), speak
    useUsageInsights.ts                # Top words, dead-ends, milestones
    useUsageLog.ts                     # Tap event logging (never blocking)
    useVocabulary.ts                   # Reactive reads from IndexedDB (folders, people, phrases)
  lib/
    audio.ts                           # AudioEngine class — preload pool, blob, TTS fallback
    backup.ts                          # JSON export/import of full vocabulary
    bigrams.ts                         # Static bigram predictions for cold start
    dashboard-data.ts                  # Data fetching for parent dashboard
    db.ts                              # Dexie v3 database schema (8 tables)
    frequency.ts                       # Usage-based intent model (recency + time-of-day)
    milestones.ts                      # Milestone detection logic
    openrouter.ts                      # OpenRouter API client (OpenAI-compatible)
    pin.ts                             # SHA-256 PIN hashing
    search.ts                          # Fuse.js search engine setup
    seed.ts                            # Database seed function (5 folders, 50 words, 4 people, 7 phrases)
    slm.ts                             # SLM abstraction layer (API-backed, ready for local WASM)
    supabase.ts                        # Supabase client initialization
    sync.ts                            # Background sync (usage events, milestones, vocab snapshots)
    vocabulary-gaps.ts                 # Vocabulary gap detection (unused folders)
    vocabulary-packs.ts                # Progressive vocabulary masking logic
  pages/
    Dashboard.tsx                      # PIN-protected parent analytics dashboard (?dashboard=true)
  scripts/
    download-symbols.ts                # Build-time ARASAAC pictogram downloader
    vocab-list.ts                      # Vocabulary list for symbol download
  store/
    appStore.ts                        # Zustand store — sentence, folders, modes, settings
  styles/
    globals.css                        # Tailwind @theme tokens, Fitzgerald Key colors, WCAG verified
  types/
    index.ts                           # All TypeScript types (DB + runtime)
```

## Color System (Fitzgerald Key)
| Category     | Text Color | Background | Contrast |
|-------------|-----------|-----------|----------|
| Verbs       | #166534   | #DCFCE7   | 5.8:1    |
| Pronouns    | #854d0e   | #FEF9C3   | 5.1:1    |
| Descriptors | #1d4ed8   | #DBEAFE   | 5.5:1    |
| Negation    | #be185d   | #FCE7F3   | 5.3:1    |
| Nouns       | #c2410c   | #FFEDD5   | 4.9:1    |
| Prepositions| #7e22ce   | #F3E8FF   | 5.6:1    |
| People      | #15803d   | #DCFCE7   | 4.6:1    |
| Folders     | #374151   | #F3F4F6   | 9.4:1    |

- App background: #F8F7F4 (warm off-white, NOT pure white)
- Sentence bar: #2563EB (white text, 5.2:1 contrast)
- All ratios WCAG AA verified (4.5:1+)

## Grid Layout
- 6 columns x variable rows
- 24 core words (rows 1-4) — HARDCODED in src/data/vocabulary.ts, never from database
- People row (row 5) — from IndexedDB, max 6
- Folder row (row 6) — 5 categories + 1 slot
- Grid gap: 8px, padding: 8px
  - Tightened for Samsung Galaxy Tab A11 (~1000x600 CSS viewport). Larger viewports have extra breathing room.
- Button border-radius: 14px, press animation: scale(0.96) for 80ms
- Button labels: 18px bold, 0.4px letter-spacing, Nunito font
- Symbol images: 52x52px within buttons
- All WCAG AA contrast ratios verified (4.5:1+)

## Database (Dexie v3)
Tables: `words`, `folders`, `people`, `usageEvents`, `quickPhrases`, `settings`, `vocabularyPacks`, `communicationMilestones`

- Core words are NOT in the database — hardcoded in `src/data/vocabulary.ts`
- Fringe words linked to folders by `folderId`
- Settings is key-value store (`key` primary)
- Usage events logged on every tap (never blocking UI)
- DB version history: v1 (base), v2 (+vocabularyPacks), v3 (+communicationMilestones)

## Key Components
- **SentenceBar** — top blue bar, word chips, action buttons (quick phrases, search, history, speak, caregiver), Bicara button
- **SymbolGrid** — 6-col grid, renders CoreRow + PeopleRow + FolderRow/FolderContents
- **SymbolButton** — color-coded by variant + Fitzgerald Key fkColor
- **AdminOverlay** — PIN-gated full-screen overlay, long-press sentence bar 3s
- **IntentSuggestions** — 3 prediction buttons after 2+ words in sentence
- **CaregiverPane** — AI translation for communication partners
- **SymbolSearch** — Fuse.js fuzzy search overlay
- **ErrorBoundary** — wraps each major section for independent crash recovery

## Hooks (all business logic lives here)
- **useVocabulary** — reactive reads from IndexedDB (folders, people, phrases) via dexie-react-hooks
- **useAudio** — playWord, playSentence (with haptic + mute check)
- **useSentenceBar** — addWord, removeLastWord (with 2s undo toast), clearSentence (with confirm dialog), speak
- **useUsageLog** — tap event logging with session ID, hour-of-day, day-of-week
- **useAdmin** — PIN verify/set, admin state management
- **useIntentSuggestions** — frequency model computation (top 3 predictions)
- **useCaregiverTranslation** — OpenRouter API interpretation of tap chains
- **useMilestones** — milestone detection and display
- **usePhotoCapture** — camera/gallery + center-square crop to 200px JPEG
- **useUsageInsights** — top words, dead-end detection, milestone display

## AI Features
1. **Intent suggestions:** frequency model + static bigrams + OpenRouter API (3-tier fallback)
2. **Symbol search:** Fuse.js fuzzy matching over all vocabulary
3. **Caregiver translation:** OpenRouter interprets tap chains for communication partners
4. **Vocabulary expansion:** AI suggests new words in admin based on usage patterns
5. **Milestone detection:** tracks first word, first combo, first request, first comment, first greeting, first refusal, vocabulary growth
6. **Vocabulary gap detection:** identifies unused folders

## Admin Mode (long-press sentence bar 3s)
- PIN-protected (SHA-256 hash stored in IndexedDB settings)
- Manage words (add/edit/delete with photos)
- Manage people (add/edit/delete with photos)
- Quick phrases (CRUD + reorder)
- Vocabulary packs (toggle Dasar/Lengkap per folder)
- Usage insights + milestones
- Vocabulary expansion suggestions (AI)
- Backup/restore (JSON export/import)
- Kiosk mode guide + voice cloning guide (XTTS-v2)
- Family onboarding guide (Bahasa Indonesia)

## Environment Variables
```
VITE_OPENROUTER_API_KEY=               # Required for AI features (intent, caregiver, vocab expansion)
VITE_OPENROUTER_MODEL=                 # Default: anthropic/claude-sonnet-4-20250514
VITE_SUPABASE_URL=                     # Optional: enables cloud sync
VITE_SUPABASE_ANON_KEY=                # Optional: enables cloud sync
```

## Modeling Mode (Aided Language Stimulation)
- Long-press Bicara 2s to toggle
- Buttons highlight with amber ring AND play audio (ALgS research)
- Words do NOT add to sentence bar
- Click "Hentikan" banner to exit
- Purpose: caregiver demonstrates language by tapping words alongside natural speech

## Haptic Feedback
- Configurable: off / light (10ms) / medium (30ms) / strong (50ms)
- Fires even when muted (motor confirmation for sensory needs)
- Set via `appStore.hapticLevel`
- Default: light (10ms)

## PWA Configuration
- Orientation: landscape (locked)
- Display: standalone
- Background color: #F8F7F4
- Theme color: #2563EB
- Service Worker: Workbox with precaching
- Update notification: prompts user when new version available

## Parent Dashboard
- Access via `?dashboard=true` URL parameter
- PIN-protected (same PIN as admin)
- Shows usage analytics, word frequency, communication milestones
- Separate page component, not part of main AAC interface

## Build Tags
- `v1.0.0` — Production Release (Phase 6: Polish & Hardening)
- `v0.5.0-phase5` — AI Cloud Layer
- `v0.4.1-improvement-sprint` — UX Improvement Sprint
- `v0.4.0-phase4` — AI On-Device
- `v0.3.0-phase3` — Admin & Customization
- `v0.2.0-phase2` — Data & Audio Layer
- `v0.1.0-phase1` — Static UI Shell

## Research References
- **Fitzgerald Key (1929)** — color-coding standard for grammatical categories
- **LAMP** — motor planning, fixed positions (why core words never move)
- **Binger & Light (2007)** — Aided Language Stimulation (modeling mode)
- **Schlosser et al. (2014)** — speech rate for ASD (0.85x/0.75x speed)
- **Trewin et al. (PMC3572909)** — button sizing for motor impairment
- **WCAG 2.1** — contrast ratios (4.5:1+), touch targets (44px+)
- **McNaughton & Light (2013)** — accidental deletion frustration (why we have undo + confirm-clear)
