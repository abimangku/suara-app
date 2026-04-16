# AAC Research Review for Suara

**Prepared:** 2026-04-16
**Context:** Personal AAC PWA ("Suara") for a young non-speaking autistic woman, Bahasa Indonesia, 10-inch landscape tablet
**Scope:** Peer-reviewed and practitioner-cited AAC research, primarily 2012–2025
**Conventions used in this doc:**
- *Strong citation* = I have verified the paper exists in a reputable database (PubMed, ASHA journals, T&F, Springer, academic PDF).
- *Community convention* = widely repeated by clinicians/vendors but not backed by a specific study I could verify in this pass.
- *Inference* = my reading of cross-study patterns. Marked explicitly.

A key structural limitation of this review: many of the most influential AAC papers (JSLHR, AJSLP, AAC journal) are behind paywalls. I relied on abstracts, author-posted preprints (Penn State's aac.psu.edu repository, for example), ResearchGate uploads, systematic-review write-ups, and AssistiveWare's research-literate practitioner content. Where a specific numeric claim could not be verified from an abstract, I say so.

---

## 1. Executive Summary

### What is well-established (high confidence)

1. **Core vocabulary dominates everyday speech.** Across toddlers, preschoolers, school-aged children, adolescents, adults, and elderly speakers, roughly 200–400 high-frequency words account for about 80% of what people say. This has been replicated in multiple languages (English, Hebrew, Korean) and age cohorts (Banajee et al., 2003; Stuart, Beukelman & King studies on elderly adults; Hebrew preschoolers, Ingber et al., 2023).
2. **Consistent symbol location helps motor learning.** Thistle & Wilkinson (2018, AJSLP) showed preschoolers without disabilities in a "consistent location" condition were nearly twice as fast (3.3s vs 6.0s) by session 5 compared to a "variable location" condition. This is the strongest single piece of evidence for the LAMP-style "keep core words in fixed places" principle.
3. **Aided AAC modeling (ALgS) improves expressive communication.** Systematic review by Biggs, Carter & Gilson (2018, AJIDD) of 48 studies, 267 participants found modeling interventions broadly effective. Binger & Light (2007) recommended a dose of ~30 models per 15-minute session.
4. **Tablet-based AAC is at least as effective as dedicated SGDs for ASD, and often preferred** (Alzrayer et al., iPad meta-analysis; multiple case studies).
5. **AAC abandonment is common (30–50%) and driven by poor fit, insufficient training, stigma, and mismatch between device features and user capabilities** — not by the underlying language representation system (Moorcroft et al., 2019; Baxter et al.; Frontiers 2024 stakeholder review).

### What is contested

1. **Grid density.** AssistiveWare's internal data supports "as dense as the user can perceive and touch" (they recommend 77-button grids for Proloquo2Go), but there is no published RCT showing 77 > 45 > 15 buttons for outcomes in autistic users specifically. Clinical practice ranges from 9 to 144 buttons.
2. **Color coding (Fitzgerald Key vs. none).** Thistle & Wilkinson (2012, 2017) consistently found that *background* color does not speed search in typically developing preschoolers, and sometimes slows it. But *clustering* by internal color or spatial grouping does help (Wilkinson et al., 2022, Down syndrome; Wilkinson & Snell on emotions). The Modified Fitzgerald convention is ubiquitous but its empirical effect is small and depends on the cueing mechanism.
3. **Symbol sets (PCS vs. SymbolStix vs. ARASAAC vs. photos).** No head-to-head RCT establishes one system as superior. Iconicity helps low-functioning autistic learners (Hartley & Allen 2014, 2015), but color photographs are not always better than line drawings once the symbol is learned.
4. **Word prediction.** Trnka et al. and others show keystroke savings do not always translate to faster communication — the cognitive load of scanning the prediction list can cancel out the savings. Evidence is stronger for adults with physical disabilities (fatigue reduction) than for children.

### What is missing

1. **Bahasa Indonesia core-word corpus.** There is no published peer-reviewed core-vocabulary list for Indonesian AAC users comparable to Banajee (toddler English) or Stuart (elderly English). TpT-distributed Indonesian core boards exist but are clinician-translated, not corpus-derived.
2. **AAC UX research on autistic adolescent girls and young women specifically.** The bulk of autism-AAC studies are on boys and younger children. Adolescent/young-adult women are systematically under-represented.
3. **PWA/web-native AAC research.** Nearly all research is on native apps (iOS) or dedicated SGDs. PWA-specific constraints (offline reliability, audio latency on iOS Safari, haptics support) are an engineering problem with no academic literature.
4. **Confirm-clear vs. undo-timer UX research.** This is a pure HCI question; I found no AAC-specific empirical study.
5. **Sentence bar position.** Near-universal "top" convention but no comparative study on whether top or bottom (ergonomically closer to thumbs on a 10-inch tablet) is better.

---

## 2. Question-by-Question Review

### Q1. Grid density: columns × rows

**Current consensus.** The prevailing clinical position, articulated most clearly by AssistiveWare based on their (non-peer-reviewed) analysis of ~10,000 Proloquo2Go users, is that grid size should be chosen based on what the user *can see and touch*, not on perceived cognitive level. Offering fewer buttons than the user can handle means fewer opportunities to model and combine language.

**Key sources:**
- AssistiveWare, *Choosing an AAC grid size* (practitioner article): recommends the largest grid the user can physically operate; their proprietary data reportedly shows Proloquo users (60 buttons/page) and Proloquo2Go users (77 buttons/page) reach "the same language outcomes" but Proloquo2Go grids *smaller than 77* show "poorer outcomes." Caveat: this is vendor data, not peer-reviewed.
- Wilkinson, Light & Drager (2012, *Augmentative and Alternative Communication* supplement) — review on composition of Visual Scene Displays, notes evidence for grouping/chunking to reduce visual search load.
- Thistle & Wilkinson (2017) — clustering and arrangement cues *do* help multi-symbol message construction; density alone without organization is a problem.
- Choi, O'Reilly, Sigafoos et al. / *AAC* journal (Vol. 36 no. 4, 2020) — "Dynamic assessment of augmentative and alternative communication application grid formats and communicative targets for children with autism spectrum disorder" — six children with ASD; individual variability was large. Three participants did well with small arrays and no navigation; three didn't establish independence with any format. **Key finding: no single grid size is universal; dynamic assessment is needed.**
- Babb et al., 2024 (T&F *AAC* journal) — "A comparison of differing organizational formats for teaching requesting skills to children with autism" — supports the same individualized conclusion.

**Contested.** The "bigger is better" AssistiveWare position vs. the "match to current capability" position common in ABA-heavy settings. No RCT I could find compares 4×4 vs 6×5 vs 8×7 head-to-head for communication rate or language growth in autistic users.

**Gap analysis.** The peer-reviewed evidence for any specific grid size is weaker than the confidence with which clinicians recommend one. We lack long-term (12-month+) outcome data comparing density levels.

**Recommendation for Suara.** For a young adult non-speaking autistic woman who is Suara's target, a **6×5 or 7×6 core page (30–42 buttons) with a clear path to scale up to 8×7 (56 buttons)** is well within the ranges supported by AssistiveWare's data and the dynamic-assessment literature. Build the UI so grid size is a setting, not a hard-coded constant, and start conservatively — adding density is easy, but reorganizing after the user has motor-learned positions breaks the Q3 principle.

---

### Q2. Core vocabulary selection and layout

**Current consensus.**
- Banajee, Dicarlo & Stricklin (2003), *AAC* journal 19: 67–73 — 50 toddlers observed in snack and play routines. A core list of 26 words. Nine words appeared across both routines. This is *the* foundational toddler list and still widely cited.
- Stuart, Beukelman & King studies on elderly women's conversational vocabulary — the Banajee-like finding repeats at the other end of the age spectrum: a few hundred core words cover the majority of conversational output.
- Project Core (Center for Literacy and Disability Studies, UNC) — Universal Core of 36 words, defined from prior corpus research, validated with students with significant cognitive disabilities. Geist et al. (2021, ATIA proceedings) reported positive communication gains when teachers were trained to use the 36-word board.
- Robillard et al. (2014) — analysis confirming the 80/20 generalization: ~200–400 words covering ~80% of utterances across cohorts.
- Ingber et al. (2023, T&F) — Hebrew preschoolers: "Frequency of word usage by Hebrew preschoolers: implications for AAC core vocabulary." Confirms pattern transfers across languages.
- Crestani et al. (2024, AJSLP) — "How Toddlers Use Core and Fringe Vocabulary: What's in an Utterance?" — quantifies co-occurrence of core and fringe in natural utterances.

**Contested.** Whether a *fixed* core grid with fringe in folders is better than activity-based topic boards (e.g., visual scene displays). Light & Drager's work (2007 onward) makes a strong case that for beginners, VSDs and activity-based organization are easier than semantic/syntactic core grids, because categorization skills develop around age 6–7 (Drager & Light; Crestani et al.).

**Gap analysis — critical for Suara.** **No peer-reviewed Bahasa Indonesia core-word corpus** exists that I could verify. Available resources are translations of English core (commercial, TpT) or tourist lists (IndonesianPod101). This is a significant gap for any Indonesian AAC project. A pragmatic substitute: derive an Indonesian core list from:
1. Banajee-style observation of Indonesian toddlers/adolescents in routine activities, OR
2. Frequency analysis of Indonesian CHILDES corpora (if they exist) or adult conversational corpora (e.g., subtitle corpora used in the OpenSubtitles project), OR
3. Structured translation of the Project Core 36 words + Banajee 26, reviewed by Indonesian SLPs for naturalness (e.g., "aku" vs "saya" for "I").

**Recommendation for Suara.**
- Anchor on a ~60–80-word Indonesian core, derived by cross-referencing English core lists (Banajee 26, Project Core 36, Pixon, Unity, Crescendo top 100) and having an Indonesian SLP (or Abi's family) review naturalness and register. Flag this as a project-specific research artifact worth publishing separately.
- Plan for 4:1 core-to-fringe ratio per Banajee-era convention.
- Given the user is an adolescent/young adult, include adult-register social words (iya, tidak, mau, boleh, nggak usah, capek, sebentar) — these are well-attested in adult core work.

---

### Q3. Motor planning / consistent positions

**Current consensus.**
- **Thistle & Wilkinson (2018), *American Journal of Speech-Language Pathology***, "Consistent Symbol Location Affects Motor Learning in Preschoolers Without Disabilities: Implications for Designing Augmentative and Alternative Communication Displays." PubMed ID 29860450. Preschoolers in the *consistent-location* condition reached 3.3s response time by session 5; variable-location group was at 6.0s. **This is the cleanest empirical support for the "fixed positions" principle.**
- Bruno & Trembath (LAMP research, 2015, *Cogent Education*) — 5-week LAMP intervention with 8 ASD participants. All participants showed vocabulary gains; 100% were commenting post-intervention vs. 25% at baseline. Small N, no RCT, but consistent with motor-planning theory.
- Center for AAC & Autism research compilation — summarizes consistent-location findings across multiple small studies.

**Durability of the principle.** The consistent-location evidence is robust enough that almost every major AAC vocabulary (Crescendo, Unity, LAMP Words for Life, WordPower) treats it as a design axiom. Proloquo intentionally has a *fixed* grid size precisely so users don't lose motor patterns when they scale up.

**When to break it.** There is no strong research on this, but AssistiveWare's "progressive language" model lets users *reveal* more buttons without *moving* existing ones — the motor path to a known word stays stable while new words fill previously hidden slots. This is the responsible way to grow.

**Contested.** Whether motor planning benefits generalize to users who primarily process visually rather than kinesthetically. The Wilkinson eye-tracking work (2020, Down syndrome and ASD) found that visual fixation patterns correlate with motor selection — suggesting the "motor" in motor planning is inseparable from visual memory of layout.

**Recommendation for Suara.** Fix core positions rigidly. If you must add core words, reveal them in *previously empty* positions; never reshuffle. The fringe folders can change, but the core grid's topology is sacred. This is the single most empirically supported UX principle in this review.

---

### Q4. Color coding

**Current consensus (surprising).**
- Thistle & Wilkinson (2012, *AAC* journal; 2015, PMC4599784; 2017, PubMed 28617614) — background color on AAC symbols does **not** reliably speed visual search for typically developing preschoolers. In some conditions white backgrounds were *faster*.
- Wilkinson, Light & Drager (2012) — *spatial arrangement by category* (grouping foods together, people together) *does* speed search, especially for individuals with Down syndrome. Color as a redundant cue on top of spatial arrangement can add value.
- Wilkinson et al. (2022, *JSLHR*) — "Judicious Arrangement of Symbols on a Simulated AAC Display Optimizes Visual Attention by Individuals With Down Syndrome." Confirms arrangement > color alone.
- Smarty Symbols, PrAACtical AAC, and most vendors use **Modified Fitzgerald Key** (yellow pronouns, green verbs, orange nouns, blue adjectives/descriptors, pink social words, purple questions, white conjunctions/prepositions, brown adverbs). Consistency within a user's ecosystem matters more than which scheme you pick.

**Impact on autistic users with visual sensitivities.** I found no autism-specific RCT on Fitzgerald Key coloration. Given ~90% of autistic individuals have atypical sensory processing (cited in multiple sensory-processing reviews), and some are hypersensitive to saturated colors, the prudent course is:
- Offer the Modified Fitzgerald Key as a *switchable* theme, not hard-coded.
- Use lower-saturation tints (pastel variants) as the default; let caregivers switch to high-saturation if desired.
- Never use color as the *only* distinguishing feature — always pair with position and symbol.

**Contested.** Whether the Fitzgerald Key helps grammatical skill development (by teaching categories visually) or simply helps search. Most evidence supports the latter; the former is aspirational.

**Recommendation for Suara.** Implement Modified Fitzgerald Key with moderate saturation as default, make it toggleable, and do not rely on color as the primary distinguishing cue. Spatial clustering (all verbs in one zone, all pronouns in another) is better-supported than background color.

---

### Q5. Symbol selection

**Current consensus.**
- SymbolStix (N2Y) and PCS (Tobii Dynavox / Boardmaker) are the two dominant commercial symbol sets; ARASAAC (Spanish government, free with attribution) is the leading open set.
- **Hartley & Allen (2014, 2015), *Journal of Autism and Developmental Disorders*** (Springer DOI 10.1007/s10803-013-2007-4; PubMed 24293039 and 24916452) — studied symbolic understanding in low-functioning children with ASD. Iconicity (how much the symbol visually resembles the referent) facilitated comprehension; colored photographs helped more than line drawings for some tasks. **But naming/language did not compensate for low iconicity**, which matters for minimally verbal users.
- Hartley & Allen (2020, PMC7374469) — iPad-based replication: iconicity and engagement both matter; higher iconicity → better word-picture-referent mapping in ASD.

**Photos vs. line drawings.** Photos are more transparent initially, but once a symbol is learned, line drawings are easier to produce, share across contexts, and render consistently at small sizes. The "use photos for personally meaningful items (family, home, specific foods) and iconic symbols for abstract concepts" hybrid is common clinical practice.

**Contested.** The generalization "photos are always easier than line drawings" is an overgeneralization (Talking Mats; see also nwacs.info and various practitioner reviews). Individual learning style matters.

**Recommendation for Suara.** Use **ARASAAC** as primary symbol set (free, culturally adaptable, has Indonesian-locale customs like the jilbab in some symbols) with fallback to **personal photos** for fringe items that are specific to the user's family/home. Avoid mixing SymbolStix and PCS in the same deployment (breaks consistency); pick one style family. For an adolescent/adult user, choose line-drawing styles that avoid infantilizing depictions — ARASAAC's adult symbols, not the child-coded ones.

---

### Q6. Prediction and autocomplete

**Current consensus.**
- Trnka et al. (2008), "Word Prediction and Communication Rate in AAC," EECIS Delaware tech report — classic finding: naive word prediction saves keystrokes but may *reduce* communication rate because the cognitive/perceptual cost of scanning, recognizing, and selecting from the prediction list can exceed the time saved. Advanced prediction with context models can reverse this (they reported up to 58.6% rate improvement with a smart model).
- Koester & Levine (classic, 1994–1998) — keystroke savings ≠ time savings for users with limited cognitive bandwidth.
- Adapting prediction to youth language (Pradel et al., 2023, Springer "What You Need is What You Get") — age-appropriate corpora materially improve keystroke savings and accuracy.
- Communication rate plateaus at a list length of ~5 predictions; longer lists don't help.

**Impact on fluency vs. keystrokes.** For users with motor fatigue (CP, ALS, late-stage MS), prediction reduces physical effort even if it doesn't speed output — this is a legitimate win. For users whose bottleneck is cognitive/linguistic rather than motor, prediction's value is less clear.

**Timing.** Show prediction after 1–2 characters, not immediately. Update on each keystroke.

**Gap analysis.** Prediction for symbol-based (not text-based) AAC is substantially less studied. Most literature assumes a keyboard + text flow, not a grid-tap flow. For a symbol-driven app like Suara, predictions are more useful for *next-word* (bigram) suggestions than character-level completion.

**Recommendation for Suara.** Offer **context-aware next-word suggestions** (e.g., after "aku", suggest "mau", "tidak", "ingin") rather than character-level prediction. Show a small row (3–5 items) above the grid. Make this toggleable — for some users, the extra visual element is noise. Start with a bigram model trained on Indonesian conversational text; evaluate with real use.

---

### Q7. Navigation models

**Current consensus.**
- **Light, Drager & Wilkinson (2007, 2012)** — VSDs (Visual Scene Displays) outperform traditional grids for very young children (2.5-year-olds) on concept location. Infants 9–12 months look longer at VSDs than grids (Light, Drager, Wilkinson 2012 eye-tracking study).
- For users beyond the beginner stage, **taxonomic / categorical grids** (semantic categories) are harder than **activity-based** grids for children younger than ~6, because taxonomic categorization develops around age 6–7.
- Folder depth: no AAC-specific study, but HCI heuristics (file-navigation research; Henderson & Card; Bergman et al.) and practitioner guidance converge on **≤3 levels of depth** before user confusion becomes significant. PrAACtical AAC and AssistiveWare both publish in this range.
- Dietz et al. (2013, PubMed 23692409) on layout effects for aphasia users — navigation design materially affects content-location success for users with language-processing challenges.

**Contested.** Whether a single persistent page with scrolling (e.g., Proloquo4Text's long word lists) is better than a shallow folder hierarchy. For text-literate users, scrolling may win; for symbol users, structured folders seem to dominate in practice.

**Gap analysis.** No study I found compares single-page vs. 2-level-folder vs. 3-level-folder for autism specifically.

**Recommendation for Suara.** Use a **single-page core + 1 level of topic folders + VSD-style scenes for personally meaningful activities** (home, school, favorite restaurant). Hard-cap depth at 2. Always offer a "Home" button that returns to core in one tap. If a fringe word is used often, surface it onto the home page rather than making the user navigate to it every time.

---

### Q8. Sentence bar UX

**Current consensus.** Near-universal convention across Proloquo2Go, TouchChat, TD Snap, CoughDrop, LAMP Words for Life: sentence bar at the **top**, full-width, taller than grid buttons, auto-clears after speak action. This convention is not backed by a comparative RCT I could locate; it's a de facto standard.

**Rationale given by practitioners (not a study):** top placement keeps the sentence in the line of gaze while the user looks down at the grid; auto-clear avoids the cognitive load of manual cleanup.

**Contested / under-studied:**
- Bottom vs. top on a 10-inch landscape tablet. Ergonomically, the bottom-thumb reach is better, but the top-gaze convention dominates. No comparative study.
- Single utterance vs. persistent history. Some research-adjacent work (COMPA, CHI 2024) on conversation context suggests keeping history helps communication partners; practically most AAC apps auto-clear.
- Auto-clear vs. manual clear. Again convention, not research.

**Recommendation for Suara.** Top sentence bar, full-width, 1.5× button height. Auto-clear on speak by default, but offer a "keep" mode that preserves the last utterance. Store a local history (last 20 utterances) accessible via a history button — this is valuable for communication repair ("I meant what I said earlier").

---

### Q9. Caregiver modeling / Aided Language Stimulation

**Current consensus (strong).**
- **Biggs, Carter & Gilson (2018), *American Journal on Intellectual and Developmental Disabilities*, PubMed 30198767** — systematic review of 48 studies, 267 participants, children/youth birth-21 with CCN. Aided AAC modeling interventions were broadly effective across three sub-approaches: augmented input, models as prompts, and models within instructional demonstrations.
- **Binger & Light (2007)** — recommended dose of ~30 models per 15-min session. Still cited as operative guidance.
- Drager et al. (multiple) — aided language modeling with preschool ASD: symbol comprehension gains (larger) and symbol production gains (smaller).
- Harris & Reichle — large gains in symbol and word comprehension in preschoolers with moderate ID after ALgS intervention.
- Sennott, Light & McNaughton (2016) review — modeling is one of the few practices with consistent across-study support in AAC.
- O'Neill, Light & Pope (2023, systematic review / scoping review) — augmented input interventions continue to show positive outcomes with larger effects when paired with expectant pauses, prompting, and aided responding.

**Research on how apps should support modeling.**
- Apps that let a caregiver *model on the user's own device* without triggering speech or without filling up the user's sentence bar help fluent modeling.
- "Guided access" / "lock to app" features reduce modeling friction by keeping the device in AAC mode.
- Shared-device vs. partner-device modeling: no strong comparative evidence but partner-device modeling seems to produce faster parent adoption (Biggs et al. notes).

**Recommendation for Suara.**
- Build a **"model mode"** toggle: caregiver can tap buttons to show without triggering TTS, or have TTS play quietly at a separate volume. Binger's ~30 models/15 min only works if modeling is friction-free.
- Include a **parent dashboard** with usage stats (buttons tapped, sentences spoken) — not for surveillance but so caregivers can identify under-modeled core words.
- Offer a **"word of the week" prompt** aligned to the Sennott/Light modeling literature, giving caregivers structured targets.

---

### Q10. Autism-specific UX considerations

**Current consensus.**
- ~90% of autistic individuals have atypical sensory processing (multiple PMC-indexed reviews; Marco et al., 2011; DSM-5 diagnostic criterion). Hyper- and hypo-reactivity can coexist.
- Visual triggers include bright lights, flashing, cluttered/busy displays, LED/fluorescent spectra.
- Motor planning differences in autism are well-documented (Fournier et al. meta-analysis; Gowen & Hamilton). This is what makes consistent-position AAC principles especially useful for this population — but also makes new motor patterns harder to learn, so design decisions become more permanent.
- **Eye-tracking research** (Wilkinson et al., 2020, PMC7251596) — "Eye Tracking Measures Reveal How Changes in the Design of Displays for AAC Influence Visual Search in Individuals With Down Syndrome or ASD" — display design measurably changes visual search patterns.
- **Visual fixation correlates with motor selection** (Wilkinson et al., 2025 follow-up, PMC12180136) — for DS and ASD individuals, where they look predicts where they tap.
- Attention: autistic users often show narrower visual attention ("tunnel" tendency) but can be highly selective within that tunnel — supports spatial clustering and reducing peripheral distraction.

**Gap analysis.** Most autism AAC research is on children 3–10. Adolescent/young-adult autistic women (Suara's target) are a systematically under-studied intersection.

**Recommendation for Suara.**
- **Calm palette by default** (lower saturation, no pure whites, no high-contrast red/green combinations).
- **No animations** on button presses except optional subtle haptics.
- **Consistent spatial grouping** of verbs, pronouns, social words — visual fixation patterns show this matters.
- **Dark-mode option** for light-sensitive users.
- **"Reduce motion" honoring** the OS-level setting.
- Avoid infantilizing symbol styles — choose ARASAAC's adult-coded symbols given the user is a young woman, not a child.

---

### Q11. Error recovery

**Current consensus (limited).**
- There is no single seminal study on AAC error recovery that I could verify. Clinical practice norms are:
  - **Undo** the last added symbol (single-button) — universal.
  - **Clear all** — always confirm, because losing a long composition is frustrating.
  - **Delete/trash icons** guarded behind a long-press or confirm.
- Light & McNaughton have written on communicative breakdowns and repair, but this is about *conversational* repair (ask for clarification, rephrase), not UI-level error correction.
- Senner & Baud's pragmatics work (2011 onward) puts "repair strategies" on the list of pragmatic skill pages.

**Contested.** Confirm-clear modal vs. undo-timer (snackbar) vs. trash-with-restore. Each trades off cognitive load, friction, and recovery:
- Confirm-clear (modal): stops accidents but interrupts flow.
- Undo-timer: low friction, but if user misses the 3–5 second window, data is gone.
- Trash: keeps data but adds a "second step" to ever truly delete.

**Gap analysis.** AAC-specific UX research on this is essentially absent. The tradeoffs are pure HCI and need app-specific usability testing.

**Recommendation for Suara.**
- Single-tap **undo** on last added symbol (no confirm).
- **Confirm-clear** modal for "clear all" — this is the highest-regret action.
- **Long-press** required to delete a custom button from the fringe.
- **Local history of last 20 utterances**, retrievable, so "accidental speak-then-clear" isn't catastrophic.

---

### Q12. Button size, spacing, touch targets

**Current consensus.**
- WCAG 2.1 SC 2.5.5 (AAA): 44×44 CSS px target.
- WCAG 2.2 SC 2.5.8 (AA): 24×24 CSS px minimum, or sufficient spacing.
- Apple HIG: 44×44 pt.
- Google Material: 48×48 dp.
- **Kittl et al. (cerebral palsy model, PMC6101246)** — for users with dyskinetic CP, information rate depends on button size, number, spacing, and error probability. Optimally matching parameters to the child's abilities improves communication. This model-based result generalizes: **larger buttons with more spacing reduce errors, at the cost of fewer buttons per page.**
- Mean adult finger pad: 10–14 mm; translates to ~40–57 px on standard mobile; children's fingers are smaller but not hugely (8–11 mm).

**AAC-specific research beyond WCAG.** Limited. Most AAC apps use button sizes well above WCAG AAA (typically 80–150 px on a 10-inch tablet at standard density). Spacing of 8–12 px between buttons is standard.

**Recommendation for Suara.** On a 10-inch landscape tablet (~1280×800 to 2160×1620 logical px), for a 6×5 grid with a top sentence bar taking ~20% of height:
- Button size: approximately 140–180 px square — this is 3× the WCAG AAA minimum and gives room for the symbol + label.
- Spacing: 10–14 px between buttons (not zero — eliminates visual tap-error).
- Row/column gaps matter more than corner rounding; don't make buttons touch.

---

### Q13. Fringe word access

**Current consensus.**
- Two dominant organizational schemes:
  1. **Activity/place-based** (food, bathroom, school, home) — developmentally appropriate for <6 year olds and intellectually younger users.
  2. **Taxonomic/semantic** (animals, vehicles, people) — requires categorization skills that emerge around age 6–7 (Drager & Light; Crestani et al.).
- Park et al. (2017) preliminary study on elementary students — activity-based organization outperformed categorical for users with ID and young LA.
- Modern vocabularies (Crescendo, Unity, CoreWord) blend both: topic folders (food, places) at the top level, sub-organized semantically where helpful.

**Pragmatic framing.** Social/pragmatic framing (greetings, refusal, protest, request) is a legitimate third axis. Senner & Baud's pragmatic-skills pages (starters, closers, repair, manners) make explicit pragmatic categories first-class.

**Recommendation for Suara.**
- Top level: **Core (single page)** + a **small number of topic folders** (Orang / people, Makanan / food, Tempat / places, Aktivitas / activities, Perasaan / feelings, Tubuh / body, Waktu / time, Sekolah / school, Rumah / home).
- Add a pragmatic row in core: greetings, "please/thank you", refusal, "I don't know", "wait" — Light & McNaughton argue these are essential for social competence.
- For personally meaningful places/people, use **VSD-style photos** (Q7).

---

### Q14. Quick phrases / communication repair

**Current consensus.**
- Senner et al. and Baud have written on pragmatic skill intervention — pre-built phrase pages for starters, closers, conversation maintainers, repair ("I don't understand", "Say that again"), regulation vocabulary, manners, social questions.
- Systematic review of AAC for ASD adolescents/adults (Holyfield et al., 2017 or Ganz et al., 2017, *AAC*) — significant gap in interventions targeting communicative functions *other than requesting* (e.g., social closeness, information transfer). Apps should explicitly support more than requesting.
- Light & McNaughton's "four communicative purposes" framework (needs/wants, social closeness, information, social etiquette) has been the reference for 15+ years.

**Recommendation for Suara.**
- Include a **Quick Phrases page** with: repair ("Tunggu sebentar", "Bukan itu", "Ulangi"), social closeness ("Aku sayang kamu"), information ("Aku mau cerita"), etiquette ("Terima kasih", "Maaf", "Permisi"), emergencies ("Sakit", "Tolong").
- On a 10-inch landscape, keep Quick Phrases accessible as a pinned row or one-tap tab, not buried in a folder.
- Pre-composed is good for speed *and* for consistent delivery of high-stakes phrases (refusal, "no", "stop"), but should supplement, not replace, core-word composition.

---

### Q15. AAC adoption failure modes

**Current consensus (strong).**
- Adoption abandonment rate: **30–50%** across populations (Moorcroft et al., 2019, PubMed 30070927; Baxter et al. 2012). For tablet-based AAC specifically, the figures may be better because of generic-tech familiarity and aesthetics.
- Rethinking Device Abandonment (Light, Pope, Holyfield et al., 2023, T&F) — reframes "abandonment" as the user/family *choosing* multimodal communication.
- **Five stakeholder-common barrier themes (Frontiers 2024):** Stakeholder Knowledge, Stakeholder Attitudes & Stigma, Resources, User Engagement, Device Fit.
- Parent training strongly moderates adoption — Douglas et al. and others show caregiver training increases device use (thesis-level evidence, etd.ohiolink.edu and others).
- **Autism-specific abandonment factors (Frontiers 2024, PMC11197385)** — stigma within family, partner non-response to device-initiated communication, insufficient modeling, device not matching sensory needs.

**UX factors correlating with long-term use** (inferred from the barrier literature, *not* a single longitudinal RCT):
1. **Low-friction onboarding** for caregivers (not just users).
2. **Personalization** that reflects the user's identity and age.
3. **Reliability** (crashes, audio failures are devastating).
4. **Family/community buy-in** (out of scope for the app itself but the app can help by making communication partners' role visible).
5. **Gradual vocabulary growth path** that doesn't force mid-stream reorganizations.

**Recommendation for Suara.**
- Treat abandonment risk as a first-class design concern, not a secondary concern.
- Onboarding must be <5 minutes for a caregiver to get to their first modeling session.
- Offline-first reliability (PWA quirks notwithstanding) — no "loading" during a conversation.
- Identity: this app is for a specific young woman. Her photos, her voice for recordings, her name-specific phrases. Generic-user defaults should be replaceable on day one.
- Family-mode: a way for Abi and the rest of the household to see what she's said today (with her consent; flag as a privacy design topic).

---

## 3. Research the Field Lacks

These are questions I expected to find direct peer-reviewed answers to, and could not.

1. **Bahasa Indonesia core-word corpus for AAC.** Nothing equivalent to Banajee exists. Highest-priority gap for Indonesian AAC work.
2. **Autistic adolescent/young-adult women and AAC UX.** Under-researched demographic intersection.
3. **Comparative RCT of 4×4 vs 6×5 vs 8×7 grid density** on long-term language outcomes in autistic users.
4. **Sentence bar top vs. bottom** on tablets — no comparative UX study.
5. **Confirm-clear vs. undo-timer vs. trash-with-restore** — pure HCI question with no AAC-specific evidence.
6. **Dark mode in AAC** for light-sensitive autistic users — no published study on outcomes.
7. **PWA-specific AAC research** — offline reliability, iOS Safari audio quirks, service-worker cache behavior have no academic literature.
8. **Bigram/next-word prediction in symbol-driven AAC** (not text-driven) — under-studied.
9. **Pragmatic-function dispersion** — how often do real non-speaking autistic users actually use refusal, repair, information-sharing vs. requesting? Ganz 2017 noted this gap; it has not been fully filled.
10. **Haptic feedback on AAC tap** — no empirical study I could find on whether haptic confirmation reduces missed or double taps.

---

## 4. Bibliography

Paywalled papers are flagged with [PAYWALL]; open-access or abstract-available sources have direct links.

### Primary empirical papers

- Banajee, M., Dicarlo, C., & Stricklin, S. B. (2003). **Core Vocabulary Determination for Toddlers.** *Augmentative and Alternative Communication*, 19(2), 67–73. Open-access via Liberator archive: https://www.liberator.co.uk/media/wysiwyg/Documents/Wordlist_Banajee_2003.pdf ; ResearchGate summary: https://www.researchgate.net/publication/232041093
- Binger, C., & Light, J. (2007). The effect of aided AAC modeling on the expression of multi-symbol messages by preschoolers who use AAC. *AAC*, 23(1), 30–43. [PAYWALL in AAC journal, widely cited]
- Biggs, E. E., Carter, E. W., & Gilson, C. B. (2018). **Systematic Review of Interventions Involving Aided AAC Modeling for Children With Complex Communication Needs.** *American Journal on Intellectual and Developmental Disabilities*, 123(5), 443–473. PubMed: https://pubmed.ncbi.nlm.nih.gov/30198767/
- Bruno, J., & Trembath, D. (2006/2015). **Augmentative and alternative communication for children with autism spectrum disorder: An evidence-based evaluation of the LAMP programme.** *Cogent Education*, 2(1). https://www.tandfonline.com/doi/full/10.1080/2331186X.2015.1045807
- Choi, H., O'Reilly, M., Sigafoos, J. et al. (2020). **Dynamic assessment of AAC application grid formats and communicative targets for children with autism spectrum disorder.** *AAC*, 36(4). Abstract: https://www.tandfonline.com/doi/abs/10.1080/07434618.2020.1845236 ; PubMed 33238754.
- Crestani, A. et al. (2024). **How Toddlers Use Core and Fringe Vocabulary: What's in an Utterance?** *American Journal of Speech-Language Pathology*. https://pubs.asha.org/doi/10.1044/2024_AJSLP-23-00366
- Dietz, A. et al. (2013). Effect of two layouts on high technology AAC navigation and content location by people with aphasia. *Disability and Rehabilitation: Assistive Technology*. PubMed: https://pubmed.ncbi.nlm.nih.gov/23692409/ [PAYWALL for full text]
- Ganz, J. B. et al. (2017). **Systematic review of AAC intervention research for adolescents and adults with autism spectrum disorder.** *AAC*, 33(4). PubMed: https://pubmed.ncbi.nlm.nih.gov/28884601/ [PAYWALL for full]
- Geist, L., Erickson, K., Hatch, P., & Quick, N. (2021). **Initial Evaluation of the Project Core Implementation Model.** ATIA proceedings. Open access: https://www.atia.org/wp-content/uploads/2021/03/V15_Geist_etal.pdf
- Hartley, C., & Allen, M. L. (2014). **Iconicity influences how effectively minimally verbal children with autism and ability-matched typically developing children use pictures as symbols in a search task.** PubMed: https://pubmed.ncbi.nlm.nih.gov/24916452/
- Hartley, C., & Allen, M. L. (2015). **Symbolic Understanding of Pictures in Low-Functioning Children with Autism: The Effects of Iconicity and Naming.** *Journal of Autism and Developmental Disorders*. Springer: https://link.springer.com/article/10.1007/s10803-013-2007-4 ; PubMed 24293039.
- Hartley, C., & Allen, M. L. (2020). **Symbolic Understanding and Word–Picture–Referent Mapping from iPads in Autism Spectrum Condition: The Roles of Iconicity and Engagement.** *JADD*. PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC7374469/
- Ingber, S. et al. (2023). **Frequency of word usage by Hebrew preschoolers: implications for AAC core vocabulary.** *AAC*. https://www.tandfonline.com/doi/full/10.1080/07434618.2023.2210671 [PAYWALL, abstract available]
- Light, J., & Drager, K. (2007). AAC technologies for young children with complex communication needs: State of the science and future research directions. *AAC*, 23(3), 204–216. [PAYWALL]
- Light, J., & McNaughton, D. (2014). Communicative competence for individuals who require AAC: A new definition for a new era of communication. *AAC*, 30(1). [PAYWALL]; related Penn State PDF: https://aac.psu.edu/wp-content/uploads/2015/05/Light-McNaughton-2015-Outcomes-_-AAC.pdf
- Light, J., & McNaughton, D. (2015). **Designing AAC Research and Intervention to Improve Outcomes for Individuals with Complex Communication Needs.** *AAC*, 31(2). PDF: https://aac.psu.edu/wp-content/uploads/2015/05/Light-McNaughton-2015-Outcomes-_-AAC.pdf
- Light, J., McNaughton, D., Beukelman, D. et al. (2019). Challenges and opportunities in AAC research and technology development. Open-access PDF via OHSU: https://www.ohsu.edu/sites/default/files/2019-05/Challenges%20and%20opportunities%20in%20augmentative%20and%20alternative%20communication%20Research%20and%20technology%20development%20to%20enhance%20communication%20and.pdf
- Moorcroft, A., Scarinci, N., & Meyer, C. (2019). **A systematic review of the barriers and facilitators to the provision and use of low-tech and unaided AAC systems.** PubMed: https://pubmed.ncbi.nlm.nih.gov/30070927/
- O'Neill, T., Light, J., & Pope, L. (2023). **A Systematic Review of Augmented Input Interventions and Exploratory Analysis of Moderators.** PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC10110354/
- Robillard, M. et al. (2014). Core vocabulary analysis. *AAC* — see ASHA core-vocabulary guidance.
- Senner, J. E. (2011). **Parent Perceptions of Pragmatic Skills in Teens and Young Adults Using AAC.** Sage: https://journals.sagepub.com/doi/abs/10.1177/1525740109351570
- Stuart, S., Beukelman, D. R., & King, J. Vocabulary use during extended conversations by two cohorts of older adults. (Cited in ASHA core-vocab literature.)
- Stuart, S., Vanderhoof, D., & Beukelman, D. Topic and vocabulary use patterns of elderly women. *AAC*. [PAYWALL]
- Thistle, J. J., & Wilkinson, K. M. (2015). **Preliminary Exploration of the Effect of Background Color on the Speed and Accuracy of Search for an Aided Symbol Target by Typically Developing Preschoolers.** PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC4599784/
- Thistle, J. J., & Wilkinson, K. M. (2017). **Effects of background color and symbol arrangement cues on construction of multi-symbol messages by young children without disabilities: implications for aided AAC design.** *AAC*, 33(3). PubMed: https://pubmed.ncbi.nlm.nih.gov/28617614/ ; open PDF: https://mellanarkiv-offentlig.vgregion.se/.../Thistle-and-Wilkinson-2017-Effects-of-background-color.pdf
- Thistle, J. J., & Wilkinson, K. M. (2018). **Consistent Symbol Location Affects Motor Learning in Preschoolers Without Disabilities: Implications for Designing AAC Displays.** *AJSLP*. PubMed: https://pubmed.ncbi.nlm.nih.gov/29860450/
- Trnka, K., McCaw, J., Yarrington, D., McCoy, K., & Pennington, C. (2008). **Word Prediction and Communication Rate in AAC.** EECIS tech report: https://www.eecis.udel.edu/~mccoy/publications/2008/trnka08at.pdf
- Wilkinson, K. M., & Snell, J. (multiple). Facilitating children's ability to distinguish symbols for emotions: background color cues and spatial arrangement. Semantic Scholar: https://www.semanticscholar.org/paper/Facilitating-children's-ability-to-distinguish-for-Wilkinson-Snell/0d7d3080c6247d4e0dcedb5cdb7a8d1c65152d83
- Wilkinson, K. M. et al. (2020). **Eye Tracking Measures Reveal How Changes in the Design of Displays for AAC Influence Visual Search in Individuals With Down Syndrome or ASD.** PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC7251596/
- Wilkinson, K. M. et al. (2022). **Judicious Arrangement of Symbols on a Simulated AAC Display Optimizes Visual Attention by Individuals With Down Syndrome.** *JSLHR*. https://pubs.asha.org/doi/10.1044/2021_JSLHR-21-00278 ; PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC9132148/
- Wilkinson, K. M. et al. (2025). **Visual Fixation Patterns to AAC Displays Are Significantly Correlated with Motor Selection for Individuals with Down Syndrome or Individuals on the Autism Spectrum.** PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC12180136/

### Systematic reviews, scoping reviews, and mega-reviews

- **A Systematic and Quality Review of AAC Interventions that use Core Vocabulary** (2023). Springer: https://link.springer.com/article/10.1007/s40489-023-00399-x
- **Augmentative and Alternative Communication for Children with Intellectual and Developmental Disability: A Mega-Review of the Literature.** PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC8009928/
- **Comparing and contrasting barriers in AAC use in nonspeaking autism and complex communication needs: multi-stakeholder perspectives** (Frontiers 2024). https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1385947/full
- **Dismantling societal barriers that limit people who need or use AAC** (2025). PubMed: https://pubmed.ncbi.nlm.nih.gov/40418145/
- **Rethinking device abandonment: a capability approach focused model** (T&F 2023). https://www.tandfonline.com/doi/full/10.1080/07434618.2023.2199859
- **Developing AAC Systems in Languages Other Than English: A Scoping Review** (*AJSLP* 2022). https://pubs.asha.org/doi/10.1044/2022_AJSLP-21-00396
- **AAC Interventions for Individuals with ASD: State of the Science** (2015). PubMed: https://pubmed.ncbi.nlm.nih.gov/25995080/

### Practitioner-literate sources (non-peer-reviewed but research-literate)

- AssistiveWare, *Choosing an AAC grid size*: https://www.assistiveware.com/learn-aac/choosing-a-grid-size
- AssistiveWare, *Why does Proloquo have a fixed grid size?*: https://www.assistiveware.com/blog/why-does-proloquo-have-a-fixed-grid-size
- PrAACtical AAC: https://praacticalaac.org/
- Project Core / Universal Core Vocabulary: https://project-core.com/
- The Center for AAC & Autism (LAMP): https://aacandautism.com/lamp/research
- ASHA Practice Portal on AAC: https://www.asha.org/practice-portal/professional-issues/augmentative-and-alternative-communication/

### HCI / touch-target references (adjacent, not AAC-specific)

- WCAG 2.2 SC 2.5.8 Target Size (Minimum) — W3C: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Kittl, Paulus et al. — model for AAC touchscreen layout in dyskinetic CP. PMC: https://pmc.ncbi.nlm.nih.gov/articles/PMC6101246/

---

**End of review. Report authored as a literature synthesis, not a clinical recommendation. Any Suara design decision grounded here should be validated through user testing with Abi's daughter and an Indonesian SLP where possible.**
