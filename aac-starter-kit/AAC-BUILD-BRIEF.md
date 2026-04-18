# AAC App Build Brief — For Claude Code / AI Coding Assistants

> **What this is:** A research-backed specification for building a personal AAC (Augmentative and Alternative Communication) tablet app for a non-speaking child or adult. Hand this file to Claude Code, Codex, Cursor, or any AI coding assistant as the starting prompt.
>
> **What this is NOT:** A finished application, a medical device, or clinical advice. See [Legal Disclaimer](#legal-disclaimer) at the bottom.

---

## 0. Your first instruction

**DO NOT write any code until you have asked the parent ALL questions in Section 1.** Their answers determine the vocabulary, the people, the quick phrases, the folder structure, and the sensory settings. Every child is different. Do not assume.

After the parent answers, confirm the plan back to them before proceeding. They are the expert on their child — you are the engineer.

---

## 1. Discovery questions — ask the parent FIRST

Ask these questions conversationally. If the parent says "I don't know, recommend what's best," use the research defaults from Section 3.

### About the child
1. What is their name (or what they like to be called)?
2. How old are they?
3. What is their diagnosis or communication profile? (autism, cerebral palsy, Down syndrome, apraxia, other)
4. Can they tap a tablet screen reliably? Any motor difficulties? (tremor, limited range, needs large targets)
5. Do they have sensory sensitivities? (bright lights, loud sounds, vibration aversion)
6. What language(s) does the family speak at home?
7. Are they currently using any communication tools? (sign language, PECS, another app, pointing)

### About communication
8. What words or phrases do they already use or understand? (spoken, signed, or gestured)
9. What are their daily routines? (wake up, meals, school, therapy, play, bedtime)
10. What do they request most often? (food, activities, people, objects)
11. Who are the important people in their life? (family members, caregivers, teachers — first names only)
12. Are there things they need to refuse or protest? (common dislikes, things that cause distress)
13. Do they have favorite foods, activities, or shows?

### About the device
14. What tablet will they use? (brand, model, screen size)
15. Is this a dedicated AAC tablet or shared with other uses?

### About the family
16. Who will set up and maintain the app? (parent, therapist, teacher)
17. Is there a speech-language pathologist (SLP) involved? Their input on vocabulary is valuable.
18. What is the preferred language for the app's TTS (text-to-speech)?

---

## 2. What you are building

A **tablet-based AAC app** where the user taps symbol buttons to build sentences that the tablet speaks aloud.

### Core interaction model
1. User sees a grid of symbol buttons (image + label).
2. User taps a button → word is added to a sentence bar at the top + spoken aloud.
3. User taps "Speak" → full sentence is spoken.
4. User taps "Clear" (with confirmation) → sentence is reset.
5. Folders organize additional vocabulary by topic (food, activities, places, feelings, body).
6. Quick phrases give one-tap access to common multi-word sentences.

### Target experience
- **Tap → sound in under 100ms.** They tap, they hear. No loading, no delay.
- **Works 100% offline.** Cloud features (AI, sync) are optional. Communication never depends on internet.
- **Installed as a PWA** on a tablet, running full-screen in landscape, no browser chrome visible.

---

## 3. Non-negotiable design rules (research-backed)

These come from peer-reviewed AAC research. Violating any of them can hurt the user's ability to communicate. They are not preferences — they are evidence.

| # | Rule | Research basis |
|---|---|---|
| 1 | **Core word positions NEVER move.** Once a word is placed at a grid coordinate, it stays there forever. | Thistle & Wilkinson (2018, AJSLP): consistent-location users were nearly 2× faster (3.3s vs 6.0s) by session 5. LAMP motor planning (Halloran & Halloran 2006). |
| 2 | **AI never speaks for the user.** Predictions display as suggestion buttons. The user chooses. AI does not auto-insert. | AAC autonomy principle — the user is the communicator. |
| 3 | **Core communication works 100% offline.** | Moorcroft et al. 2019: reliability is a top-3 factor in AAC adoption. |
| 4 | **No animations in the communication grid.** Only a subtle 80ms scale-tap feedback is allowed. | Autism sensory research: ~90% of autistic individuals have atypical sensory processing. |
| 5 | **Slower TTS rate (0.75×–0.85×).** Single words at 0.85×, full sentences at 0.75×. | Schlosser et al. (2014): auditory processing in ASD benefits from slower speech. |
| 6 | **Fitzgerald Key color coding.** Verbs = green, nouns = orange, pronouns = yellow, negation = pink, descriptors = blue, prepositions = purple. | Carroll & Fitzgerald (1929); Thistle & Wilkinson (2012, 2017) — color as redundant cue on spatial clustering. |
| 7 | **Undo + confirm-clear on sentence.** Backspace shows a visible undo toast for 2 seconds. "Clear all" requires a confirmation tap. | McNaughton & Light (2013): accidental deletion is the #1 AAC abandonment cause. |
| 8 | **Haptic feedback fires even when the app is muted.** Muting is about audio, not touch. Touch is a separate motor-confirmation channel. | Brewster, Chohan & Brown (2007): tactile feedback improves tap accuracy. |
| 9 | **Warm off-white background (#F8F7F4), not pure white.** | Irlen (1991); Rose & Meyer (2002, UDL): pure white causes visual fatigue and can trigger sensory issues. |
| 10 | **Sentence persists after speaking.** User can re-speak. Partners can read it. No auto-clear. | Communication partners need time to process; noisy environments require repeats. |

---

## 4. Recommended tech stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React + Vite + TypeScript | Fast HMR, small bundle, typed safety |
| Styling | Tailwind CSS v4 with `@theme` design tokens | Design system in one place, easy to customize |
| UI state | Zustand | Small, no boilerplate, works with React 19 |
| Persisted data | Dexie.js (IndexedDB) | Works offline, fast queries, no server needed |
| Audio | Web Speech API | Browser-native TTS, no API key needed, supports many languages |
| PWA | vite-plugin-pwa + Workbox | Installable on tablet, precached assets for offline |
| Search | Fuse.js | Fuzzy search over vocabulary (optional) |
| AI | OpenRouter or direct API (optional) | Intent prediction, vocabulary suggestions — NOT required for core |
| Deploy | Vercel (free tier) | One-command deploy, SPA routing, HTTPS |

### Why PWA over native
- No app store approval process — deploy instantly
- Free to host (Vercel free tier)
- Works on Android Chrome, Samsung Internet, Edge
- Installable as a home-screen app with full-screen mode
- One codebase, no Android SDK needed

---

## 5. Grid architecture

### Layout (6-column grid, landscape tablet)
```
┌─────────────────────────────────────────────────────────────┐
│ [⚡][🕐][⚙️]  word chips ...           [⌫][✕ Clear][▶ Speak] │  ← Sentence bar (top, blue)
├─────────────────────────────────────────────────────────────┤
│  [core]  [core]  [core]  [core]  [core]  [core]            │  ← Row 1: core vocabulary
│  [core]  [core]  [core]  [core]  [core]  [core]            │  ← Row 2: core vocabulary
│  [core]  [core]  [core]  [core]  [core]  [core]            │  ← Row 3: core vocabulary
│  [core]  [core]  [core]  [core]  [core]  [core]            │  ← Row 4: core vocabulary
│  [person] [person] [person] [person] [+ Add] [·]           │  ← Row 5: people (photos)
│  [folder] [folder] [folder] [folder] [folder] [folder]     │  ← Row 6: topic folders
└─────────────────────────────────────────────────────────────┘
```

### Core vocabulary (rows 1-4, 24 words)
- These are the most frequently used words in daily communication.
- Based on Banajee et al. (2003) toddler core + Project Core 36 + cross-language AAC research.
- **Hardcode these in the source code, NOT in the database.** Positions are sacred.
- Assign each word a fixed `row` (1-4) and `position` (0-5).
- Color-code by Fitzgerald Key grammatical category.

**Suggested core word categories** (let the parent adjust based on their child's needs):
- Social regulators: want, stop, help, yes, no, more
- Common verbs: go, like, eat, drink, have, ask, see
- Pronouns: I, you, this, that
- Descriptors: exist/there-is, can
- Prepositions/conjunctions: to, in/at, and, with/same

### Folder view
- When a folder is tapped, **hide the core rows entirely**. Show only folder contents (big buttons) + a "Back" button at the bottom.
- After tapping a word inside a folder, **auto-return to home**. This eliminates the need for core-on-fringe-pages (which commercial AAC uses because they DON'T auto-return).
- Up to 30 words visible per folder (5 rows × 6 columns).

### People row
- Up to 6 people with photo avatars.
- The "+" Add button opens the admin panel (PIN-gated).
- Pad with invisible spacer divs to fill 6 cells (prevents grid wrapping bugs).

---

## 6. Audio pipeline

### Text-to-Speech (Web Speech API)
```
User tap → SymbolButton.onPointerDown fires haptic
        → onClick → addWord → playWord
                              ↓
                   SpeechSynthesisUtterance
                   lang = target language (e.g., 'id-ID')
                   rate = 0.85 (single word) or 0.75 (sentence)
                              ↓
          If speaking/pending: cancel() → wait 50ms → speak()
          If idle: speak() directly
```

### Critical audio bugs to avoid
1. **Chrome Android cancel+speak race:** calling `speechSynthesis.speak()` immediately after `cancel()` drops the utterance silently. Add a 50ms `setTimeout` between cancel and speak.
2. **TTS prewarm needs user gesture:** Chrome Android blocks audio initialized without user interaction (autoplay policy). Warm up the TTS engine inside the first touch/click handler, not at app init.
3. **Voice caching:** `speechSynthesis.getVoices()` is slow on some browsers. Cache the resolved voice after first call.
4. **`voiceschanged` event:** some browsers load voices asynchronously. Listen for the `voiceschanged` event, don't assume voices are available at init.

### Haptic feedback
- Fire on `onPointerDown` (not `onClick`) for ~50-100ms earlier perceived response.
- Configurable levels: off (0ms) / light (10ms) / medium (30ms) / strong (50ms).
- Use `navigator.vibrate(ms)` — wrap in try/catch, not all devices support it.
- Do NOT fire on folder/back navigation buttons — only on word buttons (motor confirmation for speech output).

---

## 7. Build phases

Build in 6 phases. **The parent should test after each phase.** Don't proceed until they confirm it works.

### Phase 1: Static UI shell (~1-2 hours)
- Scaffold project (Vite + React + TypeScript + Tailwind)
- Build `SymbolButton` component with Fitzgerald Key colors
- Build `SentenceBar` with word chips
- Build `SymbolGrid` with hardcoded core vocabulary
- Build `PeopleRow` and `FolderRow`
- Browser TTS on button tap
- **Test:** parent can tap buttons, hear words, see chips in sentence bar.

### Phase 2: Data + audio layer (~1-2 hours)
- Install Dexie.js, create IndexedDB schema
- Seed database with folders, fringe words, people, quick phrases
- Wire components to read from IndexedDB (via custom hooks)
- PWA setup (vite-plugin-pwa, manifest.json, service worker)
- **Test:** app works offline, data persists between sessions.

### Phase 3: Admin panel (~2-3 hours)
- PIN-protected admin overlay (long-press sentence bar 3s OR gear icon tap)
- Add person (photo from camera/gallery + name)
- Add word (photo + label + folder picker + TTS preview)
- Edit/delete existing words and people
- Quick phrase management (add, reorder, delete)
- Emergency contacts setup (optional)
- **Test:** parent can add a new person with photo, add a new food word, it appears in the grid.

### Phase 4: Intelligence features — optional (~2-3 hours)
- Frequency-based word prediction (track tap counts, suggest next word)
- Bigram model (word-pair predictions)
- Fuzzy search overlay (Fuse.js)
- Modeling mode / Aided Language Stimulation (caregiver demo without adding to sentence)
- **Test:** after 20+ taps, predictions appear; modeling mode shows amber ring.

### Phase 5: Cloud features — optional (~2-3 hours)
- AI vocabulary expansion suggestions (requires API key)
- Cloud sync of usage data (requires Supabase or similar)
- Parent dashboard (usage analytics, milestones)
- **Test:** parent can see which words are tapped most.

### Phase 6: Polish + tablet optimization (~1-2 hours)
- Error boundaries per UI section
- Fullscreen + orientation lock on first user gesture
- PWA install banner (`beforeinstallprompt`)
- Viewport budget verification (measure total height vs. device viewport)
- Backup/restore vocabulary as JSON
- Kiosk mode guide
- **Test:** install on actual tablet, run in fullscreen landscape, verify everything fits.

---

## 8. Admin system design

### Entry points (must be PIN-gated)
1. Gear icon (⚙️) in sentence bar — visible, tappable, opens PIN pad
2. Long-press sentence bar for 3 seconds — hidden gesture for power users
3. "+" Add button in people row — shortcut to admin

### PIN
- 4-6 digit numeric PIN
- Hash with SHA-256 + salt before storing in IndexedDB settings table
- Never store plaintext

### Admin sections (suggested)
- Add/edit/delete words (with photo from camera/gallery)
- Add/edit/delete people (with photo)
- Quick phrase management
- Emergency contacts (phone numbers for SOS feature)
- Usage insights (top words, session counts)
- Backup/restore (JSON export/import)
- Kiosk mode setup guide
- Family onboarding guide

---

## 9. Deployment + tablet setup

### Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }],
  "headers": [{ "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }]
}
```

Add `.npmrc` with `legacy-peer-deps=true` if Vercel's npm install fails on peer deps.

### PWA manifest essentials
```json
{
  "display": "fullscreen",
  "display_override": ["fullscreen", "standalone"],
  "orientation": "landscape"
}
```

### Install on tablet
Many Android Chrome builds hide the "Install app" menu option. Add a programmatic install banner:
- Listen for `beforeinstallprompt` event
- Show a visible "Install" button at the top of the screen
- On tap, call `event.prompt()` to trigger Chrome's native install dialog
- Hide when running standalone (already installed) or after `appinstalled` event

### Kiosk mode (Android)
1. Install the PWA properly (not "Add to Home screen")
2. Settings → Security → Pin windows → enable
3. Open the app → Overview → Pin
4. Settings → Display → Screen timeout → longest option
5. Settings → Battery → Never sleeping apps → add the PWA

---

## 10. Known pitfalls (from real-world testing)

| Problem | Cause | Fix |
|---|---|---|
| Chrome URL bar visible over the app | Used "Add to Home screen" instead of "Install app" | Use `beforeinstallprompt` programmatic install |
| No sound after someone tapped mute | Removed mute button but left `if (isMuted) return` guard in audio code | When removing a UI toggle, also remove or neutralize the state it controlled |
| Folder row pushed off screen | IntentSuggestions reserved 53px even when empty on a 600px viewport | Measure your viewport budget: SentenceBar + suggestions + grid + gaps must fit |
| Grid rows mixing (people + folders on same row) | Row emitted 5 cells instead of 6 in a 6-column grid | Pad every row to exactly 6 cells with `aria-hidden` spacer divs |
| TTS drops words on rapid taps (Android) | `speechSynthesis.cancel()` + immediate `speak()` race condition | Add 50ms `setTimeout` between cancel and speak |
| App rotates to portrait | Manifest `orientation: landscape` alone isn't enough | Use Screen Orientation API (`screen.orientation.lock('landscape')`) inside a fullscreen request, triggered by first user gesture |
| Identical symbols for different words | ARASAAC download script didn't cover all words | Audit all symbol files with `md5` hash check for byte-duplicates |
| Buttons too small inside folders | Core rows + fringe rows + back button = too many rows | Hide core rows when inside a folder — user auto-returns to home after tapping a fringe word anyway |

---

## 11. Research bibliography

### Core references
- Banajee, M., Dicarlo, C., & Stricklin, S. B. (2003). Core vocabulary determination for toddlers. *AAC* 19(2), 67-73.
- Beukelman, D. R. & Mirenda, P. (2013). *Augmentative and alternative communication* (4th ed.).
- Biggs, E. E., Carter, E. W., & Gilson, C. B. (2018). Systematic review of aided AAC modeling interventions. *AJIDD*.
- Binger, C. & Light, J. (2007). The effect of aided AAC modeling. *AAC* 23(1), 30-43.
- Brewster, S., Chohan, F., & Brown, L. (2007). Tactile feedback for mobile interactions. *CHI '07*.
- Carroll, J. (1929); Fitzgerald, E. (1949). *Straight Language for the Deaf.*
- Halloran, J. & Halloran, C. (2006). *LAMP: Language Acquisition through Motor Planning.*
- Hartley, C. & Allen, M. (2014, 2015, 2020). Symbolic understanding in autism. *JADD*.
- Light, J. & McNaughton, D. (2012, 2013). AAC design principles. *AAC* 28-29.
- McNaughton, D. & Light, J. (2013). The iPad and mobile technology revolution. *AAC* 29(2), 107-116.
- Moorcroft, A. et al. (2019). AAC abandonment factors. *Frontiers*.
- Schlosser, R. W. et al. (2014). Speech rate in ASD. *J Autism Dev Disord* 44(5).
- Thistle, J. J. & Wilkinson, K. M. (2012, 2013, 2017, 2018). Color, layout, and location consistency in AAC displays. *AAC*, *AJSLP*.
- Trnka, K. et al. (2009). User interaction with word prediction. *TACCESS* 1(3).
- Wilkinson, K. M. et al. (2022). Judicious arrangement of symbols. *JSLHR*.

### Industry context
- AssistiveWare Proloquo2Go (industry-leading iOS AAC, 77-button grid recommendation)
- PRC-Saltillo TouchChat + LAMP Words for Life (motor planning focus)
- Tobii Dynavox Snap Core First (core vocabulary emphasis)
- CoughDrop (open-source AAC reference)
- ARASAAC (free symbol set, CC BY-NC-SA license — requires attribution)

---

## Legal disclaimer

**THIS DOCUMENT IS PROVIDED "AS IS" FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY.**

1. **Not medical advice.** This document is a technical build guide created by a parent, not a medical professional. It references peer-reviewed research but does not constitute clinical advice. Consult a qualified speech-language pathologist (SLP) before making clinical decisions about a child's communication needs.

2. **Not a medical device.** Any application built using this guide is a personal communication tool, not a regulated medical device. It has not been evaluated, cleared, or approved by any regulatory body (FDA, CE, or equivalent).

3. **No warranty.** This guide is provided without warranty of any kind, express or implied. The author makes no guarantees about the completeness, accuracy, reliability, or suitability of the information, the recommended technology stack, or any application built from this guide.

4. **No liability.** The author shall not be held liable for any damages, losses, or adverse outcomes arising from the use of this guide or any application built using it, including but not limited to: communication failures, data loss, device damage, or clinical outcomes.

5. **Not a commercial product.** This guide is shared freely for personal, non-commercial use. It is not sold, licensed, or distributed as a product or service.

6. **Symbol licensing.** This guide recommends ARASAAC pictograms, which are licensed under Creative Commons BY-NC-SA 3.0 by the Government of Aragón, Spain. Users must comply with ARASAAC's license terms, including attribution and non-commercial use restrictions. Visit https://arasaac.org for license details.

7. **Third-party services.** This guide references third-party services (Vercel, OpenRouter, Supabase, Google Fonts, Claude Code, etc.). The author has no affiliation with these services and is not responsible for their availability, pricing, terms, or data practices.

8. **Data responsibility.** Any application built from this guide stores personal data (names, photos, communication logs) locally on the user's device. The builder and operator of the application are solely responsible for data handling, privacy, and compliance with applicable laws (including but not limited to GDPR, COPPA, and local data protection regulations).

9. **Professional guidance recommended.** This guide is most effective when used in collaboration with a qualified SLP who can advise on vocabulary selection, communication strategies, and therapeutic integration.

**By using this guide, you acknowledge that you have read, understood, and agreed to these terms.**

---

*Created by a parent. Shared so other families don't have to start from zero.*
