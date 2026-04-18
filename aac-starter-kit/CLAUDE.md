# AAC App — Build Specification for AI Coding Assistants

> **Read this entire file before writing any code.**
> **Then ask the parent ALL discovery questions in Section 1 before generating a single component.**

---

## 0. Mission

Build a personal AAC (Augmentative and Alternative Communication) tablet app. The user taps symbol buttons to build sentences the tablet speaks aloud. The parent will answer questions about their child — vocabulary, family, routines, device. Their answers shape everything.

This spec gives you the architecture, component tree, database schema, and code patterns. Fill in the content from the parent's answers.

---

## 1. Discovery — ask before coding

Ask these conversationally. If the parent says "recommend what's best," use defaults from this spec.

**About the child:** name, age, diagnosis/communication profile, motor ability (can they tap reliably? need large targets?), sensory sensitivities (light, sound, vibration), language(s) spoken at home, current communication tools.

**About communication:** words they already use/understand, daily routines, what they request most, important people (names + roles), things they refuse/protest, favorites (food, activities, shows).

**About the device:** tablet brand/model/screen size, dedicated or shared.

**About the family:** who maintains the app, is an SLP involved, preferred TTS language.

**After they answer:** summarize back: "Here's what I'll build: [24 core words], [6 folders with X words each], [these people], [these quick phrases]. Sound right?" Get confirmation before coding.

---

## 2. Project scaffold

```bash
npm create vite@latest aac-app -- --template react-ts
cd aac-app
npm install dexie dexie-react-hooks zustand fuse.js
npm install -D vite-plugin-pwa @vite-pwa/assets-generator
```

### File structure to create

```
src/
├── App.tsx                          # Root composition
├── main.tsx                         # Entry: fullscreen + orientation lock + TTS warmup
├── vite-env.d.ts
├── components/
│   ├── SymbolGrid/
│   │   ├── SymbolGrid.tsx           # 6-col grid container
│   │   ├── SymbolButton.tsx         # Atomic button (color-coded, haptic, long-press)
│   │   ├── CoreRow.tsx              # 24 hardcoded core words
│   │   ├── PeopleRow.tsx            # People from DB + "Add" placeholder
│   │   ├── FolderRow.tsx            # Folder buttons from DB
│   │   └── FolderContents.tsx       # Fringe words when folder is open
│   ├── SentenceBar/
│   │   ├── SentenceBar.tsx          # Top blue bar with chips + actions
│   │   ├── WordChip.tsx             # White pill in sentence
│   │   └── QuickPhrases.tsx         # Bottom sheet with preset phrases
│   ├── Admin/
│   │   ├── AdminOverlay.tsx         # PIN gate + full-screen overlay
│   │   ├── AdminHome.tsx            # Card grid of admin sections
│   │   ├── AddPerson.tsx            # Photo + name flow
│   │   ├── AddWord.tsx              # Photo + label + folder + confirm flow
│   │   ├── ManagePeople.tsx         # Edit/delete people
│   │   ├── EditWord.tsx             # Edit/delete fringe words
│   │   ├── QuickPhraseAdmin.tsx     # Phrase CRUD
│   │   ├── EmergencyContacts.tsx    # Ibu/Ayah/Ambulans phone config
│   │   └── BackupRestore.tsx        # JSON export/import
│   ├── AI/
│   │   ├── IntentSuggestions.tsx    # 3 next-word prediction buttons
│   │   ├── EmergencyBoard.tsx       # Red SOS overlay (long-press "help")
│   │   └── SymbolSearch.tsx         # Fuse.js search overlay (optional)
│   └── shared/
│       ├── ErrorBoundary.tsx        # Per-section crash isolation
│       ├── BottomSheet.tsx          # Slide-up panel
│       ├── AvatarCircle.tsx         # Initial-letter circle for people without photos
│       └── InstallBanner.tsx        # PWA install prompt (beforeinstallprompt)
├── data/
│   └── vocabulary.ts               # CORE_WORDS (hardcoded!) + SEED_FOLDERS + SEED_WORDS + SEED_PEOPLE + SEED_QUICK_PHRASES
├── hooks/
│   ├── useVocabulary.ts             # Reactive reads from IndexedDB
│   ├── useAudio.ts                  # playWord, playSentence
│   ├── useSentenceBar.ts            # addWord, removeLastWord (with undo), clearSentence, speak
│   ├── useUsageLog.ts               # Log every tap to db.usageEvents
│   ├── useAdmin.ts                  # PIN verify/set, admin state
│   └── usePhotoCapture.ts           # Camera/gallery + center-square crop
├── lib/
│   ├── audio.ts                     # AudioEngine class: TTS, preload, vibrate
│   ├── db.ts                        # Dexie database + schema
│   ├── seed.ts                      # Initial seed + idempotent topUpSeedData
│   ├── pin.ts                       # SHA-256 hash + verify
│   ├── frequency.ts                 # Usage-based word frequency model
│   ├── bigrams.ts                   # Word-pair prediction data
│   └── search.ts                    # Fuse.js search wrapper
├── store/
│   └── appStore.ts                  # Zustand UI state
├── styles/
│   └── globals.css                  # Tailwind + @theme tokens + Fitzgerald Key palette
├── types/
│   └── index.ts                     # All shared TypeScript types
└── pages/
    └── Dashboard.tsx                # Parent dashboard (optional)
```

---

## 3. TypeScript types

```typescript
// types/index.ts

export type FKColor = 'verb' | 'pronoun' | 'descriptor' | 'negation' | 'noun' | 'preposition'

export interface CoreWord {
  id: string
  label: string
  emoji: string
  symbolPath: string
  audioPath: string
  row: number        // 1-4, NEVER changes
  position: number   // 0-5, NEVER changes
  fkColor: FKColor
}

export interface Word {
  id: string
  label: string
  category: 'core' | 'fringe' | 'people' | 'quickphrase'
  emoji?: string
  symbolPath?: string
  photoBlob?: Blob
  audioPath?: string
  audioBlob?: Blob
}

// Database types
export interface DbWord {
  id?: number
  folderId: number
  label: string
  symbolPath?: string
  photoBlob?: Blob
  audioPath?: string
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
  source: 'bundled' | 'family'
}

export interface DbFolder {
  id?: number
  key: string
  label: string
  emoji: string
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export interface DbPerson {
  id?: number
  name: string
  initial: string    // First letter of name, uppercase
  photoBlob?: Blob
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export interface DbQuickPhrase {
  id?: number
  phrase: string
  words: string[]
  sortOrder: number
  isActive: boolean
  createdAt: number
  updatedAt: number
}

export interface UsageEvent {
  id?: number
  wordId: string
  wordLabel: string
  wordCategory: string
  sentenceContext: string[]
  navigationPath: string[]
  sessionId: string
  timestamp: number
  hourOfDay: number
  dayOfWeek: number
}

export interface DbSetting {
  key: string
  value: unknown
  updatedAt: number
}
```

---

## 4. Database schema (Dexie.js)

```typescript
// lib/db.ts
import Dexie, { type Table } from 'dexie'

class AACDatabase extends Dexie {
  words!: Table<DbWord>
  folders!: Table<DbFolder>
  people!: Table<DbPerson>
  quickPhrases!: Table<DbQuickPhrase>
  usageEvents!: Table<UsageEvent>
  settings!: Table<DbSetting>

  constructor() {
    super('aac-app')
    this.version(1).stores({
      words: '++id, folderId, label, sortOrder, isActive',
      folders: '++id, key, sortOrder, isActive',
      people: '++id, name, sortOrder, isActive',
      quickPhrases: '++id, phrase, sortOrder, isActive',
      usageEvents: '++id, wordId, timestamp, sessionId',
      settings: 'key',
    })
  }
}

export const db = new AACDatabase()
```

---

## 5. Zustand store shape

```typescript
// store/appStore.ts
interface AppState {
  // Sentence
  sentenceWords: Word[]
  addWord: (word: Word) => void
  removeLastWord: () => void
  clearSentence: () => void

  // Navigation
  activeFolderKey: string | null
  setActiveFolder: (key: string | null) => void

  // Modes
  isAdminOpen: boolean
  openAdmin: () => void
  closeAdmin: () => void
  isModelingMode: boolean
  toggleModelingMode: () => void
  isEmergencyOpen: boolean
  openEmergency: () => void
  closeEmergency: () => void

  // Haptic
  hapticLevel: 'off' | 'light' | 'medium' | 'strong'
  setHapticLevel: (level: 'off' | 'light' | 'medium' | 'strong') => void

  // Predictions
  intentSuggestions: Word[]
  setIntentSuggestions: (words: Word[]) => void

  // History
  sentenceHistory: string[][]
  addToHistory: (words: string[]) => void
}
```

---

## 6. Core vocabulary data

```typescript
// data/vocabulary.ts

// CRITICAL: Core words are HARDCODED, not in the database.
// Positions are FIXED FOREVER — motor memory depends on this.
// The parent's answers determine WHICH words go here.
export const CORE_WORDS: CoreWord[] = [
  // Row 1: social regulators (determined by parent answers)
  { id: 'want', label: '___', emoji: '✋', symbolPath: 'core/want.png',
    audioPath: 'core/want.mp3', row: 1, position: 0, fkColor: 'verb' },
  // ... 23 more, each with fixed row + position
]

// Seed data — populated from parent's answers
export const SEED_FOLDERS = [/* parent-determined folders */]
export const SEED_WORDS = {/* folder_key: [words] */}
export const SEED_PEOPLE = [/* parent's family members */]
export const SEED_QUICK_PHRASES = [/* parent's child's daily phrases */]
```

---

## 7. CSS theme tokens (Fitzgerald Key)

```css
/* styles/globals.css */
@import 'tailwindcss';

@theme {
  /* Fitzgerald Key grammatical colors — WCAG AA verified */
  --color-fk-verb-bg: #DCFCE7;
  --color-fk-verb-text: #166534;
  --color-fk-verb-border: #86EFAC;

  --color-fk-pronoun-bg: #FEF9C3;
  --color-fk-pronoun-text: #854d0e;
  --color-fk-pronoun-border: #FDE047;

  --color-fk-descriptor-bg: #DBEAFE;
  --color-fk-descriptor-text: #1d4ed8;
  --color-fk-descriptor-border: #93C5FD;

  --color-fk-negation-bg: #FCE7F3;
  --color-fk-negation-text: #be185d;
  --color-fk-negation-border: #F9A8D4;

  --color-fk-noun-bg: #FFEDD5;
  --color-fk-noun-text: #c2410c;
  --color-fk-noun-border: #FDBA74;

  --color-fk-preposition-bg: #F3E8FF;
  --color-fk-preposition-text: #7e22ce;
  --color-fk-preposition-border: #C4B5FD;

  /* App semantic colors */
  --color-app-bg: #F8F7F4;          /* warm off-white, NOT pure white */
  --color-bar-bg: #2563EB;          /* sentence bar blue */
  --color-danger: #DC2626;          /* emergency red */

  /* Layout */
  --radius-button: 14px;
}

body {
  font-family: 'Nunito', sans-serif;
  background-color: var(--color-app-bg);
}
```

---

## 8. Key component patterns

### SymbolButton — the atomic building block

```
Props:
  label: string
  variant: 'core' | 'fringe' | 'people' | 'folder' | 'kembali'
  fkColor?: FKColor           // Fitzgerald Key override (for core + fringe)
  emoji?: string
  symbolPath?: string
  photoBlob?: Blob
  disabled?: boolean
  onTap: () => void
  onLongPress?: () => void    // 1500ms timer, fires haptic on trigger

Behavior:
  - onPointerDown: fire haptic (configured level, NOT for folder/kembali variant)
  - onClick: fire onTap (skip if onLongPress just fired)
  - Modeling mode: show amber ring for 2000ms, play audio, do NOT add to sentence
  - Color: if fkColor provided AND variant is 'core' or 'fringe', use FK palette; else use variant palette
  - Image fallback chain: photoBlob → symbolPath asset → emoji → letter-circle (first letter of label)
  - Press animation: scale(0.96) for 80ms — the ONLY allowed animation
  - Accessibility: focus-visible:ring, role="gridcell", aria-label={label}
```

### SymbolGrid — conditional rendering

```
When activeFolderKey === null (home):
  <CoreRow />        ← 24 buttons in rows 1-4
  <PeopleRow />      ← up to 6 people + spacers to fill 6 cells
  <FolderRow />      ← folders + spacers to fill 6 cells

When activeFolderKey !== null (inside folder):
  <FolderContents /> ← ONLY fringe words + Kembali. NO core rows.
                       Fringe gets full 5-row grid. Auto-return home after tap.
```

### SentenceBar — top blue bar

```
Layout (left to right):
  [⚡ quick phrases] [🕐 history] [⚙️ admin]
  | word chips (horizontal scroll) |
  [⌫ backspace] [✕ Clear (confirm)] [▶ Speak]

Behaviors:
  - ▶ Speak: plays full sentence at 0.75× rate. Sentence PERSISTS (no auto-clear).
  - ✕ Clear: first tap → "Yakin?" red text for 1.5s; second tap → clear.
  - ⌫ Backspace: removes last word. Shows undo toast "Dihapus: 'X' [↶ Kembalikan]" for 2s.
  - ⚙️: opens admin PIN overlay.
  - Long-press ▶ Speak 2s → toggle modeling mode (amber banner).
```

### PeopleRow — defensive padding

```
const visiblePeople = peopleList.slice(0, 6)
const showAdd = visiblePeople.length < 6
const usedSlots = visiblePeople.length + (showAdd ? 1 : 0)
const padCount = Math.max(0, 6 - usedSlots)

// Render: people buttons + Add (opens admin) + aria-hidden spacer divs
// CRITICAL: always emit exactly 6 cells. Otherwise the next row wraps into this row.
```

### FolderContents — auto-return + full grid

```
const visibleWords = allWords.slice(0, 30)  // 5 rows × 6 cols

onTap for each word:
  addWord(word)         // adds to sentence + plays audio + logs tap
  setActiveFolder(null) // auto-return to home — the user picks a word, they're back at core

// Kembali button at the end: col-span-6, for manual exit without picking
```

---

## 9. Audio engine pattern

```typescript
// lib/audio.ts

class AudioEngine {
  private voiceCache: SpeechSynthesisVoice | null = null

  resolveVoice(lang: string): SpeechSynthesisVoice | null {
    if (this.voiceCache) return this.voiceCache
    const voices = speechSynthesis.getVoices()
    this.voiceCache = voices.find(v => v.lang.startsWith(lang)) ?? null
    return this.voiceCache
  }

  fallbackTTS(text: string, rate = 0.85): void {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'id-ID'  // ← parent's language
    utterance.rate = rate
    const voice = this.resolveVoice('id')
    if (voice) utterance.voice = voice

    // CRITICAL: Chrome Android cancel+speak race condition.
    // Calling speak() immediately after cancel() drops the utterance silently.
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel()
      setTimeout(() => speechSynthesis.speak(utterance), 50)  // 50ms delay fixes it
    } else {
      speechSynthesis.speak(utterance)
    }
  }

  speakSentence(text: string): void {
    this.fallbackTTS(text, 0.75)  // slower for full sentences
  }
}

export const audioEngine = new AudioEngine()
```

---

## 10. Seed + migration pattern

```typescript
// lib/seed.ts

export async function seedDatabase() {
  const existing = await db.settings.get('appVersion')
  if (!existing) {
    await runInitialSeed()   // First install: seed everything
    await db.settings.put({ key: 'appVersion', value: '1.0.0', updatedAt: Date.now() })
  }
  await topUpSeedData()       // Every launch: add new content without wiping user data
}

async function runInitialSeed() {
  // Insert all SEED_FOLDERS, SEED_WORDS, SEED_PEOPLE, SEED_QUICK_PHRASES
}

async function topUpSeedData() {
  // For each new word/folder/phrase added in later versions:
  //   check if it already exists → skip if yes, insert if no
  // This lets updates reach existing installs without destructive reseed
}
```

---

## 11. PWA configuration

### vite.config.ts
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AAC App',           // ← parent names this
        short_name: 'AAC',
        display: 'fullscreen',
        display_override: ['fullscreen', 'standalone'],
        orientation: 'landscape',
        background_color: '#F8F7F4',
        theme_color: '#2563EB',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2}'],
      },
    }),
  ],
})
```

### main.tsx — first-gesture setup
```typescript
function setupOnFirstTouch() {
  let done = false
  const handler = async () => {
    if (done) return
    done = true

    // 1. Request fullscreen
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      }
    } catch {}

    // 2. Lock orientation (ONLY if fullscreen succeeded)
    try {
      if (document.fullscreenElement) {
        await screen.orientation?.lock?.('landscape')
      }
    } catch {}

    // 3. Warm up TTS engine (needs user gesture for autoplay policy)
    try {
      const u = new SpeechSynthesisUtterance('')
      u.volume = 0
      u.rate = 2
      speechSynthesis.speak(u)
    } catch {}

    document.removeEventListener('click', handler)
    document.removeEventListener('touchstart', handler)
  }
  document.addEventListener('click', handler, { once: true })
  document.addEventListener('touchstart', handler, { once: true })
}
```

### InstallBanner.tsx — programmatic PWA install
```
Listen for 'beforeinstallprompt' event → store the deferred prompt.
Show a "📲 Install" button at the top of the screen.
On click: call deferredPrompt.prompt() → await userChoice.
Hide if already running standalone: window.matchMedia('(display-mode: fullscreen)').matches
Hide after 'appinstalled' event.
```

---

## 12. Usage logging — wire into addWord

```typescript
// In useSentenceBar.addWord:
addWordToStore(word)
playWord(word)
logTap(word, {
  sentenceContext: state.sentenceWords.map(w => w.label),
  activeFolderKey: state.activeFolderKey,
}).catch(() => {})  // silent fail — logging NEVER blocks communication

// DO NOT log in modeling mode — those are caregiver demonstrations, not the child's speech
```

This single `logTap` call powers:
- Frequency model (most-tapped words surface as predictions)
- Usage insights (parent sees top words)
- Milestone detection (first word, first 2-word combo, first request/refusal)
- AI vocabulary suggestions (if connected)

---

## 13. Emergency surface (optional but recommended)

```
Trigger: long-press the "help" core word for 1500ms
Result: full-screen red overlay with 4 large buttons:
  - "I'm sick" → sms: to configured Ibu contact
  - "Call Mom" → sms: to Ibu
  - "Call Dad" → sms: to Ayah
  - "Call Ambulance" → tel: to configured number (default: local emergency)

Emergency contacts are configured in Admin → Emergency Contacts.
Each contact has a "Test" button so caregivers verify numbers work BEFORE a real emergency.
```

---

## 14. Admin system

### Entry points (all PIN-gated)
1. ⚙️ gear icon in SentenceBar (visible, tappable)
2. Long-press SentenceBar for 3 seconds (hidden)
3. "+" Add button in PeopleRow (shortcut)

### PIN
- 4-6 digit numeric, hashed with SHA-256 + salt
- First-time: create flow (enter + confirm)
- Subsequent: verify flow

### Admin sections
Build these as separate components, rendered by AdminHome based on active section:
- Add/edit/delete words (with camera/gallery photo)
- Add/edit/delete people (with photo)
- Quick phrase management
- Emergency contacts
- Backup/restore (JSON export/import of all DB tables)
- Usage insights (top 10 words, tap counts)
- Family onboarding guide (how to use the app, in parent's language)

---

## 15. Deployment

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

**vercel.json:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "headers": [{ "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }]
}
```

**If npm install fails on Vercel:** add `.npmrc` with `legacy-peer-deps=true`.

---

## 16. Testing checklist (run through with the parent)

After each phase, verify with the parent:

- [ ] All core buttons tap → hear word → chip appears in sentence bar
- [ ] Tap ▶ Speak → full sentence spoken → sentence stays (no auto-clear)
- [ ] ⌫ backspace → word removed → undo toast visible for 2 seconds
- [ ] ✕ Clear → "Yakin?" confirmation → second tap clears
- [ ] Open folder → core hidden → fringe buttons are big → tap word → auto-return home
- [ ] People row shows correct names/photos → pad to 6 cells
- [ ] ⚙️ gear → PIN pad → admin sections work
- [ ] Add a new person with photo → appears in grid
- [ ] Add a new word with photo → appears in folder
- [ ] Quick phrases → one tap → sentence spoken
- [ ] App works offline (airplane mode)
- [ ] Install as PWA → no Chrome bar → fullscreen → landscape
- [ ] Emergency long-press "help" → red overlay → SMS/call works

---

## 17. Known pitfalls

| # | Bug | Fix |
|---|---|---|
| 1 | Chrome Android drops speech after cancel() | 50ms setTimeout between cancel and speak |
| 2 | TTS blocked without user gesture | Warm up inside first click/touch handler |
| 3 | Rows with <6 cells cause grid wrapping | Pad every row to 6 with aria-hidden spacers |
| 4 | Removing a UI toggle without removing its state guard | Always grep for every reference to the state |
| 5 | Samsung Chrome hides "Install app" | Use beforeinstallprompt programmatic install |
| 6 | Fullscreen request fails → orientation lock throws | Guard with if(document.fullscreenElement) |
| 7 | Button image files byte-identical (wrong download) | Audit with md5 hash after bulk download |
| 8 | Core visible inside folder → buttons too small | Hide core rows entirely when folder is open |
| 9 | Reserved placeholder eats viewport on small screens | Measure: bar + suggestions + grid + gaps must fit |
| 10 | voiceschanged fires async | addEventListener, don't assume voices exist at init |

---

## 18. Research rules (non-negotiable)

1. Core positions NEVER move (Thistle & Wilkinson 2018)
2. AI never speaks for the user (autonomy)
3. Works 100% offline (Moorcroft 2019 — reliability = adoption)
4. No grid animations (autism sensory — only 80ms scale-tap)
5. Slower TTS 0.75-0.85× (Schlosser 2014)
6. Fitzgerald Key colors across ALL words (Wilkinson 2022)
7. Undo + confirm-clear (McNaughton & Light 2013 — #1 abandonment cause)
8. Haptic even when muted (Brewster 2007)
9. Warm off-white background (Irlen/UDL)
10. Sentence persists after speaking (partner reading, re-speak)

---

## Legal disclaimer

THIS DOCUMENT IS PROVIDED "AS IS" FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY. It is not medical advice, not a medical device specification, and not a commercial product. Any application built using this document is a personal communication tool that has not been evaluated by any regulatory body. The author provides no warranty and accepts no liability. Consult a qualified speech-language pathologist for clinical decisions. ARASAAC symbols are licensed CC BY-NC-SA 3.0 by the Government of Aragón. See AAC-BUILD-BRIEF.md for the full legal disclaimer.

---

*This specification is distilled from real-world development of a personal AAC app, informed by peer-reviewed research (Banajee 2003, Binger & Light 2007, Biggs et al. 2018, Halloran 2006, Light & McNaughton 2012-2013, Moorcroft 2019, Schlosser 2014, Thistle & Wilkinson 2012-2018, Wilkinson 2022) and competitive analysis of 9 commercial AAC applications. Created by a parent. Shared freely.*
