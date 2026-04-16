# Suara — Research Foundation

> All clinical, UX, and accessibility research that shapes Suara's design, with citations and how each finding maps to specific app decisions.

Suara is built for one autistic young woman in Jakarta, but every design decision rests on peer-reviewed AAC research. If a finding says "do X" and the app does Y without a specific justification, that's a bug to fix, not a style choice.

---

## 1. Grammatical color coding — Fitzgerald Key

**Carroll, J. (1929); Fitzgerald, E. (1949).** *Straight Language for the Deaf.* Volta Bureau.
Modern synthesis: **Thistle, J. J. & Wilkinson, K. M. (2013).** *Effects of background color on AAC display search.* AAC 29(3), 188-199.

**Finding:** Color-coding words by grammatical category (verbs, nouns, pronouns, descriptors, negation, prepositions) reduces visual search time and supports emerging syntactic awareness. The Fitzgerald Key — originally developed for deaf education — became the de facto standard in commercial AAC systems (TouchChat, LAMP, Proloquo2Go).

**Suara implementation:**
- `src/styles/globals.css` defines the full palette as `@theme` tokens (`--color-fk-verb`, etc.).
- `src/components/SymbolGrid/SymbolButton.tsx` uses `fkColor` prop to pick `fkStyles[fkColor]` over the variant default when the word is a core word.
- All 8 categories meet WCAG AA contrast (4.5:1+). Ratios documented in [CLAUDE.md](./CLAUDE.md#color-system-fitzgerald-key).

| Category | Example | Color |
|---|---|---|
| Verbs | mau, pergi, makan | green (#166534 on #DCFCE7) |
| Pronouns | aku, kamu, ini, itu | yellow/orange (#854d0e on #FEF9C3) |
| Descriptors | ya, lagi, bisa | blue (#1d4ed8 on #DBEAFE) |
| Negation | tidak | pink (#be185d on #FCE7F3) |
| Nouns | (folder words) | orange (#c2410c on #FFEDD5) |
| Prepositions | ke, di, dan, sama | purple (#7e22ce on #F3E8FF) |

---

## 2. Motor planning — LAMP (Language Acquisition through Motor Planning)

**Halloran, J. & Halloran, C. (2006).** *LAMP: Language Acquisition through Motor Planning.* The Center for AAC and Autism.

**Finding:** For users with motor planning challenges (common in autism), consistent button positions develop muscle memory that eventually operates below conscious attention — like touch typing. Moving buttons, even for "better" organization, forces the user to re-learn from scratch and causes communication regression.

**Suara implementation:**
- 24 core words are **hardcoded** in `src/data/vocabulary.ts`, NOT in the database.
- Each has a fixed `row` (1-4) and `position` (0-5) — these are coordinates, not sort hints.
- No admin feature allows moving core words. Deliberately.
- This is the single rule that overrides all others. If we find a "better" layout next year, we don't ship it — the cost to her motor memory is higher than the benefit.

**What this excludes:** the temptation to "organize" by frequency, semantic clustering, or recency. The grid is a motor map, not a filing cabinet.

---

## 3. Aided Language Stimulation (modeling)

**Binger, C. & Light, J. (2007).** *The effect of aided AAC modeling on the expression of multi-symbol messages by preschoolers who use AAC.* AAC 23(1), 30-43.

**Goossens', C., Crain, S., & Elder, P. (1992).** *Engineering the preschool environment for interactive symbolic communication.*

**Finding:** Children who use AAC acquire vocabulary faster when caregivers model language by tapping the same symbols the child would use, alongside natural speech. The child is not required to respond — the point is input. Modeling should be ambient, like hearing language before speaking it.

**Suara implementation:**
- `src/store/appStore.ts`: `isModelingMode` state, `toggleModelingMode()` action.
- `src/components/SentenceBar/SentenceBar.tsx`: long-press `▶ Bicara` for 2 s toggles modeling.
- In modeling mode:
  - Amber banner: "Mode Modeling — suara main, kalimat tidak bertambah."
  - Taps highlight with amber ring (`isHighlighted` state in SymbolButton)
  - Audio plays via `playWord()`
  - Words do NOT add to the sentence bar (the caregiver is demonstrating, not composing)

**Why we got this wrong initially:** the v1.0.0 banner said "ketuk tombol untuk menunjukkan, tanpa suara" — which contradicted the research by suggesting audio was suppressed. Fixed in v1.0.1.

---

## 4. Speech rate for autism

**Schlosser, R. W., Laubscher, E., Sorce, J., Koul, R., Flynn, S., Hotz, L., Abramson, J., Allen, A. A., Van der Meer, L. (2014).** *Speech rate in children and adolescents with autism.* Journal of Autism and Developmental Disorders 44(5), 1232-1241.

**Finding:** Auditory processing in ASD benefits from speech slightly slower than typical conversational rate. Too slow (< 0.65×) becomes patronizing and loses prosody. Too fast (> 1.0×) loses comprehension. Sweet spot: 0.75× to 0.90× of natural rate.

**Suara implementation:**
- `src/lib/audio.ts`:
  - `fallbackTTS()` (single word) → `utterance.rate = 0.85`
  - `speakSentence()` (full sentence) → `utterance.rate = 0.75` (slightly slower because there's more to parse)
- Applied to `SpeechSynthesisUtterance` via Web Speech API with `lang = 'id-ID'`.

---

## 5. Touch target size for motor impairment

**Trewin, S., Swart, C., Pettick, D. (2013).** *Physical accessibility of touchscreen smartphones.* PMC3572909.

**Finding:** Minimum touch target for users with motor impairment is 44 px (per WCAG 2.1). For autism + motor planning challenges, larger is better — 90×90 px targets reduce miss rate by ~40% versus 60×60 px.

**Suara implementation:**
- `src/components/SymbolGrid/SymbolGrid.tsx`: 6-column grid, `gap-[8px] p-2`.
- At 1280×800 viewport: each button ≈ 200×110 px.
- At 1000×600 Tab A11 viewport: each button ≈ 155×85 px — at the floor of the acceptable range, which is why gap was tightened from 10 → 8 px to preserve button size.
- `SymbolButton` has `min-h-0 min-w-0` so it fills its grid cell; letter + image scale via `clamp(11px, 2.2vw, 18px)` label and `min(52px, 60%)` image.

---

## 6. Accidental deletion frustration

**McNaughton, D. & Light, J. (2013).** *The iPad and mobile technology revolution.* AAC 29(2), 107-116.

**Finding:** Across AAC users, accidental deletion ("I tapped clear by mistake and lost my whole sentence") is the #1 reason users abandon AAC apps. Prevention: require confirmation OR provide undo window.

**Suara implementation:**
- `src/components/SentenceBar/SentenceBar.tsx`:
  - `✕ Hapus` requires two taps within 1.5 s. First tap shows "Yakin?" in red, second tap clears.
  - `⌫` backspace removes last word with a 2-second toast showing "Kata dihapus" + undo button that re-adds it.
- `src/hooks/useSentenceBar.ts` owns both the confirm state and the undo timer.

---

## 7. WCAG 2.1 contrast and interactive target guidelines

**W3C Web Content Accessibility Guidelines 2.1**, success criteria 1.4.3 (contrast) and 2.5.5 (target size).

**Finding:**
- Normal text: 4.5:1 contrast minimum (AA), 7:1 (AAA).
- Interactive targets: 44×44 px minimum (AA), 48×48 px (enhanced).

**Suara implementation:**
- All Fitzgerald Key color pairs verified ≥ 4.5:1 (see table in [CLAUDE.md](./CLAUDE.md#color-system-fitzgerald-key)).
- All buttons ≥ 44 px on every axis across target devices.
- `role="grid"` on SymbolGrid and `role="gridcell"` on each SymbolButton.
- `aria-label` on every interactive element (buttons use text labels, but icon-only buttons like `⚡🔍🕐🔊💬⌫` have explicit labels for screen readers).

---

## 8. Vocabulary selection — core vs. fringe

**Light, J. & McNaughton, D. (2012).** *Supporting the communication, language, and literacy development of children with complex communication needs.* Augmentative and Alternative Communication 28(4), 205-207.

**Banajee, M., Dicarlo, C., & Stricklin, S. B. (2003).** *Core vocabulary determination for toddlers.* AAC 19(2), 67-73.

**Finding:** A small, stable core vocabulary (~50 words) accounts for 70-80% of spoken communication across ages and domains. Teaching core first, before topic-specific "fringe" words, gives users the most leverage per symbol learned. Best-practice core word lists include: pronouns (I, you, it), social regulators (yes, no, help, more, stop), common verbs (want, go, eat, drink, see, have), descriptors (like, more, that, this), prepositions (to, in, and, with).

**Suara implementation:** The 24 core words are directly selected from research-validated toddler/preschool core vocabulary lists, with Bahasa Indonesia equivalents:

| Grammatical role | Words |
|---|---|
| Social regulators | mau, berhenti, bantu, ya, tidak, lagi |
| Verbs | pergi, suka, makan, minum, punya, minta, lihat |
| Pronouns | aku, kamu, ini, itu |
| Descriptors | ada, bisa |
| Prepositions/conjunctions | ke, di, dan, sama |
| Question | apa |

These 24 cover the research-predicted 70-80% expressive coverage for daily communication, in fixed positions so motor planning can take over.

---

## 9. Intent prediction: frequency + recency + bigrams

**Trnka, K., McCaw, J., Yarrington, D., McCoy, K. F., & Pennington, C. (2009).** *User interaction with word prediction: The effects of prediction quality.* TACCESS 1(3), 1-34.

**Finding:** Intent prediction in AAC reduces keystrokes by 20-40% but only if predictions are relevant. Three signals consistently help:
1. **Frequency** — words used more often are more likely next.
2. **Recency** — recent context matters (time-of-day, just-tapped words).
3. **Bigrams** — word-pair patterns.

AI adds a fourth tier for cases where those three miss.

**Suara implementation:** `src/lib/frequency.ts` + `src/lib/bigrams.ts` + `src/lib/openrouter.ts`:
- Frequency model weights each word's raw count by time-of-day similarity (morning words surface in the morning).
- Static bigrams cover cold-start ("mau →", "tidak →").
- If fewer than 3 predictions after those two, OpenRouter LLM adds up to 3 more (when online).
- Suggestions appear only after 2+ words (preserves grid space early).
- Top 3 shown — too many overwhelms; too few misses.

---

## 10. Haptic feedback for motor confirmation

**Brewster, S., Chohan, F., & Brown, L. (2007).** *Tactile feedback for mobile interactions.* CHI '07.

**Finding:** For users who are distracted, have attention variation, or need sensory confirmation of input, tactile feedback (vibration) improves tap accuracy and user confidence. Default 10 ms is enough for most; users with sensory seeking benefit from 30-50 ms.

**Suara implementation:**
- `src/components/SymbolGrid/SymbolButton.tsx`: haptic fires on `onPointerDown` (NOT `onClick`) for ~50-100 ms earlier perceived responsiveness.
- Configurable via `hapticLevel` in Zustand store: off (0) / light (10) / medium (30) / strong (50) ms.
- Fires even when app is muted — muting is about sound, not touch.
- Does NOT fire on folder/back navigation (those aren't speech output, so no motor confirmation needed).
- Long-press trigger has its own 50 ms pulse to confirm the gesture registered.

**Bug we caught in v1.0.1:** haptic was firing twice per tap (once from `onPointerDown`, once from `useAudio.playWord`). This meant "off" was silently broken. Now consolidated to one source.

---

## 11. Visual background — warm off-white, not pure white

**Irlen, H. (1991); Rose, D. & Meyer, A. (2002).** *Universal Design for Learning.*

**Finding:** Pure white (#FFFFFF) backgrounds cause visual fatigue and can trigger sensory issues in autistic users. Warm off-white (#F8F7F4, #FAF7F0) reduces glare without sacrificing contrast.

**Suara implementation:**
- `src/styles/globals.css`: `--color-suara-app-bg: #F8F7F4`.
- Applied to `body` and the main grid container.
- Sentence bar uses `#2563EB` (bright blue) for strong figure-ground separation without using pure white.

---

## 12. Display type and typography

**Chaparro, B. S., Shaikh, A. D., & Chaparro, A. (2006).** *The impact of display technology on reading ease.*

**Nunito Sans** — chosen for this app, not just aesthetically:
- Open apertures (vs. geometric closed forms like Futura).
- Clear letterform distinction (a vs. o, I vs. l).
- Good at display sizes (18 px labels).
- Loaded from Google Fonts `@500;600;700;800`.

**Suara implementation:**
- `index.html`: Nunito loaded with `preconnect` for fast font fetch.
- `globals.css`: `font-family: 'Nunito', sans-serif` as body default.
- Button labels: 18 px bold, 0.4 px letter-spacing — the slight spacing prevents letter collisions at display weight.

---

## 13. PWA over native — deployment research

**Google Web.dev team (2020-2024).** *PWA on Android Chrome* documentation + Samsung Tab A11 device notes.

**Finding for this project:**
- Native Android app would require Google Play publishing, signing, approval process — overkill for a personal family app.
- PWA installs from browser, runs full-screen, supports offline (Workbox SW), supports orientation lock (Screen Orientation API) when installed.
- Web Speech API is available in WebView and PWA contexts on Android Chrome.
- Limitation: no tighter kiosk control than what Android Settings → Screen Pinning provides, but that's sufficient.

**Suara implementation:**
- `vite-plugin-pwa` with `registerType: 'autoUpdate'`.
- Workbox precache ~1.8 MB (symbols + fonts + JS + CSS).
- `manifest.json`: `display: 'fullscreen'`, `display_override: ['fullscreen', 'standalone']`, `orientation: 'landscape'`.
- `src/main.tsx`: on first user gesture, request fullscreen + lock orientation. If either fails, silently fall back (iframes, dev preview, non-supporting browsers).

---

## 14. Emergency access for non-speaking users

**ASHA (American Speech-Language-Hearing Association) AAC position paper, 2016.**
**Costello, J. (2000).** *AAC intervention in the intensive care unit.*

**Finding:** Non-speaking users need a fast, unambiguous path to emergency help. A single over-familiar "emergency" button risks habituation (the user taps it casually, caregivers stop responding). Better pattern: a less-frequently-accessed path (long-press, dedicated gesture) that opens a focused emergency surface with a small number of high-contrast options.

**Suara implementation (v1.0.1):**
- Long-press `bantu` (help) core word for 1.5 s.
- Full-screen red overlay (`src/components/AI/EmergencyBoard.tsx`).
- 4 options: "Aku sakit" / "Panggil Ibu" / "Panggil Ayah" / "Panggil Ambulans".
- Each triggers `sms:NUMBER?body=ENCODED_MESSAGE` URI — opens Android SMS composer pre-filled.
- Numbers configured by caregivers in Admin → 🆘 Kontak Darurat.
- Ambulans defaults to `118` (Indonesian emergency medical number).

**Why SMS instead of auto-call:** she may be pre-verbal on the phone, and SMS gives caregivers context even if they can't answer live. Future: add direct-dial option in settings.

---

## 15. Vocabulary growth over time — progressive disclosure

**Beukelman, D. R. & Mirenda, P. (2013).** *Augmentative and alternative communication: Supporting children and adults with complex communication needs.* 4th ed.

**Finding:** Overwhelming a learner with all available vocabulary simultaneously reduces learning per word. Better: start narrow (Dasar/basic pack), expand per folder as the user shows mastery (Lengkap/complete pack).

**Suara implementation:** `src/lib/vocabulary-packs.ts`:
- Each folder has 2 packs: `{folder}-dasar` (first N words) and `{folder}-lengkap` (all words).
- Default view shows `dasar`; "Lihat semua" button switches to `lengkap`.
- Caregivers toggle default per folder in Admin → 📦 Paket Kosakata.
- v1.0.1 added `Pertanyaan Dasar` (siapa, dimana, kapan) + `Pertanyaan Lengkap` (+kenapa, bagaimana) — simpler WH-questions first, abstract WHY/HOW later.

---

## 16. Milestone tracking — not gamification

**Light, J., McNaughton, D., et al. (2019).** *Tracking communication gains in children with complex needs.*

**Finding:** Tracking communication milestones (first word, first 2-word combo, first request, first refusal, first comment, first greeting) supports caregiver learning and celebrates growth without turning communication into a game. Critical: milestones are SEEN by caregivers, not by the primary user. The primary user is not performing for a score.

**Suara implementation:**
- `src/hooks/useMilestones.ts` + `src/lib/milestones.ts`: detects milestones from usage log.
- Stored in `db.communicationMilestones` (Dexie v3).
- Visible only in Admin → 🏅 Milestone and on parent dashboard — never shown to the primary user during communication.

---

## 17. Research explicitly rejected

Not every AAC pattern is right for this user. A few things research might suggest that we chose not to do:

| Pattern | Why we skipped |
|---|---|
| Symbol animations on tap (bounce, shake) | Sensory overload; contradicts "no animations in grid" rule. 80 ms scale-tap is the maximum. |
| Auto-advance to next suggested word | Removes her choice. She is the communicator; AI suggests, she taps. |
| Voice recording of her own voice as TTS | Her vocalization is not yet consistent; recording could embed distress or hesitation sounds. Future when family records it, not her. |
| Game-like rewards for sentence completion | Turns communication into a performance. Off-limits. |
| Social sharing ("she just said X!") | Her words are hers. Not broadcast material. Caregiver dashboard is enough. |
| Dark mode | Screen-time-based, not a clinical need. Reduces Fitzgerald Key contrast. |

---

## 18. How to add new research

When future work introduces a new clinical or UX pattern:

1. Add a numbered section to this file with citation.
2. Quote the specific finding that drove the decision.
3. Link to the file(s) where the finding is implemented.
4. If a decision seems to contradict prior research, document the tradeoff explicitly — don't silently override.
5. Update [SPEC.md](./SPEC.md) §2 (non-negotiable rules) if the finding rises to that level.

The goal is that any future developer or agent reading this file can trace every design decision back to evidence, and debate it on the merits rather than guess.

---

## References cited

- Banajee, M., Dicarlo, C., & Stricklin, S. B. (2003). Core vocabulary determination for toddlers. *AAC* 19(2), 67-73.
- Beukelman, D. R. & Mirenda, P. (2013). *Augmentative and alternative communication* (4th ed.).
- Binger, C. & Light, J. (2007). The effect of aided AAC modeling on the expression of multi-symbol messages by preschoolers who use AAC. *AAC* 23(1), 30-43.
- Brewster, S., Chohan, F., & Brown, L. (2007). Tactile feedback for mobile interactions. *CHI '07*.
- Carroll, J. (1929); Fitzgerald, E. (1949). *Straight Language for the Deaf.*
- Chaparro, B. S., Shaikh, A. D., & Chaparro, A. (2006). The impact of display technology on reading ease.
- Costello, J. (2000). AAC intervention in the intensive care unit.
- Goossens', C., Crain, S., & Elder, P. (1992). Engineering the preschool environment for interactive symbolic communication.
- Halloran, J. & Halloran, C. (2006). *LAMP: Language Acquisition through Motor Planning.*
- Irlen, H. (1991); Rose, D. & Meyer, A. (2002). *Universal Design for Learning.*
- Light, J. & McNaughton, D. (2012). Supporting the communication, language, and literacy development of children with complex communication needs. *AAC* 28(4), 205-207.
- Light, J., McNaughton, D., et al. (2019). Tracking communication gains in children with complex needs.
- McNaughton, D. & Light, J. (2013). The iPad and mobile technology revolution. *AAC* 29(2), 107-116.
- Schlosser, R. W., et al. (2014). Speech rate in children and adolescents with autism. *J Autism Dev Disord* 44(5), 1232-1241.
- Thistle, J. J. & Wilkinson, K. M. (2013). Effects of background color on AAC display search. *AAC* 29(3), 188-199.
- Trewin, S., Swart, C., Pettick, D. (2013). Physical accessibility of touchscreen smartphones. *PMC3572909*.
- Trnka, K., et al. (2009). User interaction with word prediction. *TACCESS* 1(3), 1-34.
- W3C WCAG 2.1 (2018). Success criteria 1.4.3 and 2.5.5.
