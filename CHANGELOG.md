# Changelog

All notable changes to the Suara AAC app are documented here.

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
