# AAC Competitive Analysis for Suara

_Prepared 2026-04-16. Scope: 9 commercial/open-source AAC apps benchmarked against the Suara prototype (6×6 grid, ARASAAC symbols, Fitzgerald Key, Bahasa Indonesia, landscape PWA on Galaxy Tab A11)._

---

## 1. Executive summary

Across the nine apps surveyed, a very consistent architectural recipe dominates serious symbol-based AAC: **a large-ish fixed grid (60–144 cells once a user has learned the system), a persistent top-of-screen message/sentence window with speak + backspace + clear, core vocabulary anchored in the same spatial positions on every page (motor-planning), and Fitzgerald-Key colour coding applied to symbol borders rather than fills.** Where apps diverge is on (a) whether to force a single large grid (Proloquo, LAMP) or let caregivers shrink it (Proloquo2Go, Snap, GoTalk NOW) — where the research is unambiguous that users do better with the large grids even though caregivers default to shrinking; (b) the symbol library (SymbolStix dominates the US; PCS dominates Tobii; ARASAAC dominates free/open tools); and (c) sentence-construction assistance — the newest apps (Proloquo 4, Avaz, CoughDrop) are pushing into automatic morphology, related-words side-rails, and cloud-synced usage analytics, while legacy apps (TouchChat, LAMP) still rely on carrier phrases and motor sequences instead.

What's genuinely contested: **how much grammar to automate** (Proloquo auto-inflects; TouchChat makes the user select morphology tiles), **how to handle motor consistency when symbols move between pages** (LAMP/Unity keep the first hit identical everywhere; Proloquo2Go keeps the absolute position identical; Snap lets users choose), and **whether modelling is a dedicated UI surface** (CoughDrop tracks modelled vs. user taps as separate data; P2G/Snap treat modelling as a behavioural practice with no UI). Almost no commercial app ships an "emergency/SOS" surface — that is a Suara-specific design choice, not an industry pattern, and it deserves separate justification. Bahasa Indonesia support is thin: Avaz and SymboTalk are the only mainstream options; local projects (BerKata, VICARA) cover the gap but with small vocabularies.

---

## 2. Per-app detailed tables

### 2.1 Proloquo2Go (AssistiveWare) — industry gold standard

| Dimension | Approach |
|---|---|
| **Grid structure** | 23 pre-programmed grids from 3×3 to 12×12 portrait, 3×5 to 9×16 landscape (9–144 cells). Recommended default: **7×11 = 77 cells** ([AssistiveWare: Adjustable grids][p2g-grids]; [AssistiveWare: Why does Proloquo have a fixed grid size?][p2g-fixedgrid]). |
| **Core vocabulary layout** | ~200–400 core words = 80% of daily speech; each fringe folder *also* contains the core words in the same positions, reducing navigation ([AssistiveWare: Progressive Language][p2g-progressive]). |
| **Sentence bar** | Top-mounted "**message window**" — configurable size, text-above/below image, tap to speak whole message; speak-on-tap is per-button configurable ([AssistiveWare: Change message window appearance][p2g-msgwin]; [AssistiveWare: Using Auto-Clear Message][p2g-autoclear]). Auto-clear modes: Off / Immediate / After Next Activation. |
| **Color coding** | **Modified Fitzgerald Key** by default. Borders carry the colour; "Color Code" setting toggles border-only vs. filled; "Color Intensity" controls shade ([AssistiveWare: Change the color code][p2g-colors]). Nouns orange, verbs green, adjectives blue, pronouns yellow, questions purple, negations red, etc. |
| **Navigation** | Hierarchical folders; automatic back button; 12 core-word-based templates for new fringe folders so core stays in place ([AssistiveWare: Templates][p2g-templates]). |
| **Word prediction** | **PolyPredix™** text-prediction in the keyboard; no symbol prediction in grid mode — acknowledged limitation ([AssistiveWare: PolyPredix][p2g-polypredix]). |
| **People/favorites** | No fixed people row; caregivers add "People" as a fringe folder via built-in template; user photos or SymbolStix faces. |
| **Symbol system** | **SymbolStix** (licensed from n2y) — 25,000+ symbols ([OMazing Kids: Most Widely Used AAC Symbols][omazing-symbols]). |
| **Emergency/SOS** | None native. Caregivers can build one manually. |
| **Customization/admin** | "Edit mode" toggled via pencil icon; can be password-gated via Options → Restrictions → Edit Mode; iOS Guided Access often layered on top ([AssistiveWare: Hide/show Edit and Options buttons][p2g-editlock]). |
| **Modeling mode** | No dedicated UI mode. AssistiveWare heavily promotes **Aided Language Stimulation** as practice but it's behavioural, not a UI toggle ([AssistiveWare: Modeling — Use AAC to teach AAC][p2g-modeling]). |
| **Sentence construction** | Automatic grammar-support popup: tap root form to insert, tap-and-hold to pick plural/past/3rd-person/possessive/comparative etc. — "unique in the AAC world" ([AssistiveWare: Grammar support][p2g-grammar]). |
| **Noteworthy UX** | Research-defended large-grid recommendation; Progressive Language lets caregivers unlock more buttons over time rather than starting small and rebuilding ([AssistiveWare: Progressive Language][p2g-progressive]). |
| **Criticisms** | ~80% of users ignore the 7×11 recommendation; ~40% reduce to <20 buttons, which the developers themselves say limits language growth ([AssistiveWare: Why does Proloquo have a fixed grid size?][p2g-fixedgrid]; [Smiles Therapy: Pros and Cons of Proloquo2Go][p2g-smiles]). Navigation overwhelm and "bugs/glitches" cited in parent reviews ([Educational App Store: Proloquo2Go Review][p2g-eduapp]). No symbol prediction. Cost (~USD 249). |

### 2.2 Proloquo (newer sentence-first app, AssistiveWare)

| Dimension | Approach |
|---|---|
| **Grid structure** | **Fixed grid**, single level — explicitly rejects "small to big" progression in favour of one motor-planned layout users grow into ([AssistiveWare: How we designed Proloquo to grow][proloquo-grow]). |
| **Core vocabulary layout** | "Two static top rows" of most-frequent words always visible; Home organized to align with sentence word order; auto-clear after speech ([AssistiveWare: How we designed Proloquo to grow][proloquo-grow]). |
| **Sentence bar** | Sentence-first composition with "**1.6 taps per word**" efficiency metric ([AssistiveWare: How we designed Proloquo to grow][proloquo-grow]). |
| **Color coding** | Tabs colour-coded by grammatical function — orange pronouns/subjects, light-pink helpers, dark-pink action verbs, green prepositions, blue adjectives/adverbs, grey questions, purple interjections, yellow fringe ([AssistiveWare: How is the Proloquo vocabulary organized?][proloquo-org]). |
| **Navigation** | **No back button**; same motor plan to reach any symbol regardless of where you are ([AssistiveWare: How we designed Proloquo to grow][proloquo-grow]). |
| **Word prediction** | **Related Words™** side-rail: text-only alternatives (e.g., "go" shows "drive/explore/walk") ([AssistiveWare: How is the Proloquo vocabulary organized?][proloquo-org]). |
| **People/favorites** | Not documented as a fixed surface. |
| **Symbol system** | SymbolStix. Vocabulary counts: 4,500+ for young users, 5,000+ school-age, 16,000+ adults ([AssistiveWare: How we designed Proloquo to grow][proloquo-grow]). |
| **Emergency/SOS** | None documented. |
| **Customization/admin** | **Base vocabulary is not user-editable** — AssistiveWare explicitly defends this as quality control ([AssistiveWare: Why can't I change the base vocabulary of Proloquo?][proloquo-nobase]). |
| **Modeling mode** | Dedicated blog positions Proloquo as "easier to model" because of fixed layout and shallow hierarchy ([AssistiveWare: How does Proloquo make modeling easy?][proloquo-modeling]). |
| **Sentence construction** | Grammatical forms always available on the side of display; auto-inflection with tap-and-hold. |
| **Noteworthy UX** | Opinionated: no grid-size options, no custom base vocab, no back button. The defence is motor efficiency and cognitive load. |
| **Criticisms** | Subscription pricing (USD 99/year); restricted customization; only English initially. |

### 2.3 TouchChat HD with WordPower (PRC-Saltillo)

| Dimension | Approach |
|---|---|
| **Grid structure** | WordPower comes in **25, 42 Basic, 42, 48 Basic, 48, 60 Basic, 60, 80, 108-with-keyboard, 108, 140 Scan & Touch** layouts ([PRC-Saltillo: WordPower Vocabulary][tc-wordpower]; [Saltillo: Device Options WordPower][sal-wordpower]). |
| **Core vocabulary layout** | Core embedded in category/activity pages too; word-based motor planning so the same word is in the same position across pages; pronouns pinned to the left, colour-coded yellow, and if missing, the PEOPLE button opens ([PRC-Saltillo: WordPower Vocabulary][tc-wordpower]). |
| **Sentence bar** | **Speech Display Bar (SDB)** at top; tap to speak, tap again to move cursor; Cycle button toggles cursor step Character/Word/Sentence; Share via email/social supported ([TouchChat: Programming Button Actions][tc-buttonactions]; [TouchChat: Editing the SDB][tc-editsdb]). |
| **Color coding** | Modified Fitzgerald within WordPower; pronouns yellow, nouns orange, verbs green, etc. |
| **Navigation** | Category pages + activity pages; optional Navigation Bar positionable left or right ([Unity AAC Settings Overview][unity-settings]). |
| **Word prediction** | Keyboard pages have text prediction; symbol-level prediction not a default feature. |
| **People/favorites** | Dedicated **PEOPLE** button in core; fringe page holds named contacts. |
| **Symbol system** | SymbolStix (shared with P2G). |
| **Emergency/SOS** | None native. |
| **Customization/admin** | Fully customizable pages, grid layouts, buttons, messages, symbols; pages locked via iOS Guided Access. |
| **Modeling mode** | None UI-level. |
| **Sentence construction** | **Carrier phrases** pre-built ("I want…", "I don't like…"); manual morphology via -s/-ed/-ing tiles. |
| **Noteworthy UX** | WordPower's hallmark is **word-based** motor planning (vs. LAMP's icon-sequence motor planning) — supports users who read some text. |
| **Criticisms** | 60-level granularity means SLPs must choose well or re-do later; manual morphology is slower than P2G's auto-inflect; cost (~USD 299). |

### 2.4 LAMP Words for Life (PRC-Saltillo)

| Dimension | Approach |
|---|---|
| **Grid structure** | **84 locations** (7×12) at full level; also 1-hit 83-word intro level and 3,000+ word full vocabulary ([PRC-Saltillo: LAMP WFL][lamp-prc]; [LAMP WFL app page][lamp-app]). |
| **Core vocabulary layout** | Core is reached via **unique motor sequence** per word; every word in 3 hits or less at 84-level ([PRC-Saltillo: LAMP WFL][lamp-prc]). Motor plans never change as vocabulary grows. |
| **Sentence bar** | Top message window with speak/clear; standard PRC Chat style. |
| **Color coding** | Minspeak/Unity colour scheme — yellow pronouns, green verbs, orange nouns etc. similar to Fitzgerald. |
| **Navigation** | Icon-sequence navigation: tap a category icon → reveals subset. Consistent motor pattern is the feature. |
| **Word prediction** | Not a primary feature; LAMP is about memorized motor patterns. |
| **People/favorites** | Nouns category; caregiver-customizable. |
| **Symbol system** | Unity/Minspeak icons (PRC proprietary) + PCS. |
| **Emergency/SOS** | None. |
| **Customization/admin** | Edit mode protected; SLPs add photos for named people. |
| **Modeling mode** | None UI-level; LAMP methodology is a therapy approach trained by clinicians ([PRC-Saltillo LAMP site][lamp-prc]). |
| **Sentence construction** | Minspeak morphology icons (-s, -ing, -ed). |
| **Noteworthy UX** | Designed specifically around autism research — predictable motor plans, consistent auditory signal, natural consequence of communication (Halloran & Halloran principles); adult users reportedly achieve fluent grammatical output ([London Speech and Feeding Practice: LAMP Words for Life review][lamp-london]). |
| **Criticisms** | "Does not teach analytical thinking" — critics claim symbols are taught as building blocks; limited long-term research; may not suit literate users who read text faster than they can memorize icon sequences ([EBSCO Research Starters: LAMP][lamp-ebsco]; [Just Keep Stimming: AAC Reviews][jks-reviews]). |

### 2.5 Snap Core First (Tobii Dynavox, now "TD Snap")

| Dimension | Approach |
|---|---|
| **Grid structure** | Expandable grids **1×1, 1×2, 2×2, 2×3, 3×3, 3×4, 4×4, 5×5, 6×6, 7×7, 7×9, 8×10** ([Tobii Dynavox: Understanding pages and button grids in TD Snap][snap-grids]). Two growth strategies documented: increase grid size, OR start large and hide buttons. |
| **Core vocabulary layout** | Core page organized left-to-right by part of speech: **Questions (blue), Pronouns (yellow), Verbs (green), Little Words (orange)** ([Tobii Dynavox: TD Snap Core First page set][snap-corefirst]; [The Story of Core, Tobii Dynavox][snap-coreresearch]). |
| **Sentence bar** | **Message Window** at top; also a **Toolbar** with Core / QuickFires / Topics / Keyboard / Dashboard ([Snap Core First User's Manual v1.5][snap-manual]). |
| **Color coding** | **Modified Fitzgerald Key** — explicitly cited as originating 1972 ([The Story of Core, Tobii Dynavox][snap-coreresearch]). |
| **Navigation** | Back button (browser-like); Toolbar always visible; separate page sets: **Core First, Motor Plan, Express, Text, Scanning, Aphasia, Gateway (IAP), PODD (IAP)** ([Tobii Dynavox: TD Snap Page Set Comparison][snap-comparison]). |
| **Word prediction** | Keyboard has prediction; not in symbol grid. |
| **People/favorites** | Topics page set contains Personal (People) topic. |
| **Symbol system** | **PCS (Picture Communication Symbols)** + SymbolStix + Widgit available; **Core First High Contrast** variant with dark background and reduced visual complexity for low-vision users ([Tobii Dynavox: TD Snap Core First page set][snap-corefirst]). |
| **Emergency/SOS** | None core-first; "Repairs" QuickFire category covers communication breakdown messaging, not physical emergency. |
| **Customization/admin** | Edit mode protectable; Dashboard is caregiver hub. |
| **Modeling mode** | No UI toggle; practice-level. |
| **Sentence construction** | **QuickFires** = predictable short messages for turn-taking/greetings/feelings/repairs ([Snap Core First User's Manual][snap-manual]). |
| **Noteworthy UX** | QuickFires is a distinctive design — fast-access phrase library for the "little words" that keep conversation alive; **High Contrast page set** is a first-class accessibility feature competitors lack. |
| **Criticisms** | Expensive (USD 499 app, thousands more on a dedicated device); Dashboard complexity overwhelms many caregivers; page-set switching is a learning curve in itself. |

### 2.6 CoughDrop (open source)

| Dimension | Approach |
|---|---|
| **Grid structure** | Fully user-defined grid size — **"Grid +/-" button adds/removes rows and columns**; starter boards include small-and-large-button variants ([CoughDrop Support: editing boards][cd-edit]; [CoughDrop site][cd-site]). |
| **Core vocabulary layout** | Depends on loaded board; CoughDrop hosts **CommuniKate 20 (4×5 grid)** and others ([CoughDrop blog: Introducing CommuniKate 20][cd-ck20]). |
| **Sentence bar** | Top message bar; speak/clear/back. |
| **Color coding** | Inherited from whichever board is loaded; not prescribed. |
| **Navigation** | Boards link to boards (Open Board Format); "books" of linked boards ([Open Board Format][obf]). |
| **Word prediction** | Yes — keyboard-style. |
| **People/favorites** | Board-dependent. |
| **Symbol system** | Multi — SymbolStix, ARASAAC, Mulberry, OpenSymbols, user photos, recorded audio ([IntuitionLabs: CoughDrop][cd-intuition]). Auto-search symbols for unlabelled buttons. |
| **Emergency/SOS** | Not native; can be built. |
| **Customization/admin** | **Cloud-synced**, multi-device edit access; supervisor role for SLPs/teachers/parents to edit from their own device without taking the communicator's ([CoughDrop: About][cd-about]). |
| **Modeling mode** | **First-class feature.** Modeled input tracked separately from user input ("user AND modeling data separately") ([CoughDrop: research][cd-research]; [CoughDrop Blog: modeling in home][cd-model]). |
| **Sentence construction** | Per-button overrides for vocalization text vs. label; inflection handled via separate buttons. |
| **Noteworthy UX** | **Goals & badges** gamify AAC acquisition ([PRWeb: CoughDrop adds Goals and Badges][cd-goals]); **usage analytics** with trend reports for IEP tracking ([CoughDrop: reports][cd-reports]); cloud sync; open source (AGPL). |
| **Criticisms** | Web-first UI feels dated; reliance on internet for sync; smaller clinical footprint than the dominant commercial apps; fewer out-of-the-box vocabularies. |

### 2.7 GoTalk NOW (Attainment Company)

| Dimension | Approach |
|---|---|
| **Grid structure** | **1, 2, 4, 9, 16, 25, or 36 locations** per page ([Attainment: GoTalk NOW][gt-main]). |
| **Core vocabulary layout** | Pre-built core pages by SLP Gisele Morin-Connolly, based on **Project CORE** research (UNC Center for Literacy and Disability Studies) ([Attainment: GoTalk NOW][gt-main]). |
| **Sentence bar** | **Express pages** = dedicated accumulator speech bar; tap to play the accumulated sequence. Standard pages speak on tap only. |
| **Color coding** | User-defined; no enforced scheme. |
| **Navigation** | Page → page linking; four page styles: **Standard, Express, Visual Scene, Keyboard** ([Attainment: GoTalk NOW][gt-main]). |
| **Word prediction** | In Keyboard pages; added globally via on-screen keyboard in v5.0.16+ ([App Store: GoTalk NOW][gt-appstore]). |
| **People/favorites** | User-built pages, often using device photos. |
| **Symbol system** | Built-in symbol library + camera + **internet image search** built into editor ([Attainment: GoTalk NOW][gt-main]). |
| **Emergency/SOS** | None native. |
| **Customization/admin** | Easy to build; explicitly marketed as the simpler AAC option. |
| **Modeling mode** | **Video modelling supported** — can embed instructional videos on pages. |
| **Sentence construction** | Express pages accumulate; no morphology automation. |
| **Noteworthy UX** | **Visual Scene Pages** with hotspots over a single image — strong for emergent communicators, toddlers, and aphasia; **Hybrid Visual Scene** links to related scenes. |
| **Criticisms** | Ceiling is low — users outgrow it; no automatic grammar; no motor planning guarantee; symbol set basic. |

### 2.8 Avaz AAC (Avaz Inc., now PRC-Saltillo as of 2025)

| Dimension | Approach |
|---|---|
| **Grid structure** | **60–117 pictures per screen** ([Avaz AAC product page][avaz-product]); 3 vocabulary levels (Beginner/Intermediate/Advanced). |
| **Core vocabulary layout** | Consistent pattern across pages for motor memory; **bottom row houses Describe, Quantity, People, Actions** essential folders; fringe folders occupy the rightmost column on every page ([Avaz blog: How Vocabulary Layout Shapes Communication][avaz-layout]). |
| **Sentence bar** | **Message box at top of screen**; tap tiles to speak-and-add to box; tap box itself to speak full sentence ([Avaz blog: How Vocabulary Layout Shapes Communication][avaz-layout]). |
| **Color coding** | Fitzgerald-derived palette; category-based. |
| **Navigation** | Category folder hierarchy; fringe always on right column. |
| **Word prediction** | Advanced predictive text; toggle picture ↔ keyboard mode instantly. |
| **People/favorites** | **People folder pinned in bottom row** — the only surveyed app that treats People as a fixed core-row slot. |
| **Symbol system** | **SymbolStix (40,000+)** ([Avaz AAC product page][avaz-product]) plus user photos/video. |
| **Emergency/SOS** | **"Mistake" and "Alert" buttons** to seek caregiver attention — closest thing to SOS among surveyed apps ([Avaz features][avaz-features]). |
| **Customization/admin** | Drag-and-drop; copy-paste between pages; caregiver training module built in. |
| **Modeling mode** | Training modules for caregivers; no dedicated in-app modelling mode. |
| **Sentence construction** | Picture→keyboard switch is the big feature; morphology manual. |
| **Noteworthy UX** | **Multilingual leader**: Hindi, Tamil, Kannada, Malayalam, Telugu, Marathi (also Gujarati, Bengali, Indonesian, Sinhala, Faroese) ([Avaz Support: Languages][avaz-langs]); "zoom in" animation on tapped tiles to attract visual attention ([Avaz features][avaz-features]). |
| **Criticisms** | Historically less research backing than P2G/LAMP; UI feels denser than AssistiveWare products; pricing high for Indian market it originally targeted. 2025 PRC-Saltillo acquisition may alter direction ([PRC-Saltillo: Avaz Acquisition][avaz-acq]). |

### 2.9 Cboard / CommuniKate (open source)

| Dimension | Approach |
|---|---|
| **Grid structure** | Fully user-defined; **CommuniKate 20 = 4×5** reference grid ([CoughDrop blog: CommuniKate 20][cd-ck20]). Cboard itself uses responsive grid. |
| **Core vocabulary layout** | Board-dependent; Cboard is a builder more than a curated vocabulary. |
| **Sentence bar** | Top message accumulator; speak on tap. |
| **Color coding** | User-defined; Fitzgerald templates available. |
| **Navigation** | Board→board linking (OBF); root board in each book. |
| **Word prediction** | Not a prominent feature in Cboard. |
| **People/favorites** | User-built. |
| **Symbol system** | **ARASAAC primary**, also Mulberry, OpenSymbols, Global Symbols — all open-licensed ([OpenDirective: The Open Communication Symbols Ecosystem][open-ecosystem]). |
| **Emergency/SOS** | None native. |
| **Customization/admin** | **46 languages** supported ([Cboard.io homepage][cboard-home]); web-based; offline PWA on Chrome. Dark mode free. |
| **Modeling mode** | None formal. |
| **Sentence construction** | Basic; no automatic grammar. |
| **Noteworthy UX** | Browser-first PWA, screen-lock, dark mode, cross-platform, **registered vs. non-registered access tiers** with persistence only for registered. |
| **Criticisms** | Lightweight — lacks the curated vocabularies, analytics, and grammar support of commercial apps; relies on caregivers/SLPs to build a usable system from scratch; smaller community than CoughDrop. |

---

## 3. Cross-cutting patterns table

| Dimension | Proloquo2Go | Proloquo | TouchChat WP | LAMP WFL | Snap Core First | CoughDrop | GoTalk NOW | Avaz | Cboard |
|---|---|---|---|---|---|---|---|---|---|
| **Default grid** | 7×11 (77) | Fixed single large | 60 common | 84 (7×12) | 8×10 top | User-defined | 16/25/36 | 60–117 | User-defined |
| **Grid adaptive?** | 23 sizes | No (opinionated) | 11 layouts | 3 levels | 12 sizes | Yes | 7 sizes | 3 levels | Yes |
| **Message bar pos** | Top | Top | Top | Top | Top | Top | Top (Express) | Top | Top |
| **Speak on bar tap** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Auto-clear modes** | 3 | Auto | Config | Config | Config | Config | Manual | Config | Basic |
| **Color coding** | Mod. Fitzgerald | Fitzgerald+ | Mod. Fitzgerald | Unity/Minspeak | Mod. Fitzgerald | Board-dep. | User | Fitzgerald-ish | User |
| **Core consistency** | Same absolute pos across pages | Fixed layout, no back | Same-position across pages | Motor sequence | Same-position across pages | Board-dep. | Page-dep. | Bottom-row + right-col | Board-dep. |
| **Symbol library** | SymbolStix | SymbolStix | SymbolStix | Unity+PCS | PCS+SymbolStix+Widgit | Multi | Built-in+web | SymbolStix 40k | ARASAAC+Mulberry |
| **Word prediction** | Text only (PolyPredix) | Related Words side-rail | Keyboard only | No | Keyboard only | Keyboard | Keyboard | Yes | No |
| **People row** | Fringe folder | Not fixed | PEOPLE btn | Nouns | Topics | Board-dep. | User | **Bottom core row** | User |
| **Emergency/SOS** | None | None | None | None | None | None | None | Mistake+Alert | None |
| **Admin lock** | Pencil+Restrictions | N/A (fixed base) | Guided Access | Edit mode | Edit mode | Supervisor roles | Edit mode | Drag-lock | Auth tiers |
| **Modeling UI** | None (practice) | None (fixed aids) | None | None | None | **Tracked separately** | Video embed | Training module | None |
| **Grammar auto** | **Tap-and-hold popup** | **Side-rail inflections** | Manual tiles | Manual Minspeak | Manual | Per-btn override | None | Manual | None |
| **Platform** | iOS/iPadOS | iOS/iPadOS | iOS | iOS+Android+Chrome | iOS+Win+Android | Web+iOS+Android+Win+Chromebook | iOS | iOS+Android | **Web PWA + iOS + Android + Win** |
| **Price (~USD)** | 249 | 99/yr | 299 | 299 | 499 | Subscription / free open source | 79 | 249 (lifetime) | **Free** |
| **Bahasa Indonesia** | No | No | No | No | No | Via TTS only | Via TTS only | **Yes** | Yes |
| **Open license** | Proprietary | Proprietary | Proprietary | Proprietary | Proprietary | **Yes (AGPL)** | Proprietary | Proprietary | **Yes** |

Prices are approximate US retail as of 2024–2025 and shift frequently; verify before quoting to users.

---

## 4. What commercial AAC does that Suara doesn't (gaps to consider)

1. **Automatic morphology/grammar inflection.** P2G, Proloquo, and Snap all offer tap-and-hold or side-rail access to plurals, tenses, comparatives, possessives. In Bahasa Indonesia the morphology is lighter (affixation: meN-, di-, ter-, -kan, -i, -an, -nya; reduplication for plural) but still meaningful. Suara currently has none.

2. **Large-grid escalation path.** Every research-backed app defaults to ≥60 cells. Suara's 6×6 = 36 is below the clinically recommended range for language growth per AssistiveWare's own field data. A documented progression plan (6×6 → 7×9 → 8×12) protects against the "80% of caregivers shrink it" failure mode.

3. **Configurable auto-clear behaviour.** Off/Immediate/After-Next is universal. Suara should expose this rather than hard-coding.

4. **Text-only "Related Words" side-rail.** Proloquo's innovation: surface synonym richness without burning grid real-estate on symbols. Useful in Indonesian where many verbs have register-specific alternatives (makan/santap/sarapan).

5. **QuickFires / carrier phrases.** Snap Core First's QuickFires category (greetings, repairs, feelings) drops users straight into social scripts. Suara's intent suggestions overlap conceptually but not structurally.

6. **Modelled-input vs. user-input analytics.** CoughDrop is alone in separating these but it's exemplary — enables caregivers to know whether progress is "she tapped" or "I tapped while she watched." Worth considering for Suara's modeling mode.

7. **Supervisor/caregiver cloud edit.** CoughDrop lets the SLP/parent edit from their own phone without removing the communicator's tablet. For a PWA architecture this is natural.

8. **High-contrast accessibility page set.** Only Snap Core First ships this natively. For a user with visual processing differences it's table stakes.

9. **Visual Scene Display option.** GoTalk NOW's Visual Scene + hotspot approach is a validated pattern for emergent communicators and aphasia. Suara's symbol-grid-only model closes this door.

10. **Video-modelling embedment.** GoTalk NOW allows videos of caregivers using the AAC embedded on pages. Pairs well with Aided Language Stimulation.

11. **Open Board Format interchange.** CoughDrop and Cboard share OBF so users can port vocabularies. Suara's user base is small enough that OBF import alone (not export) would open access to curated community boards.

---

## 5. What Suara does that commercial AAC doesn't — and the defence

| Suara choice | Commercial precedent | Defence needed |
|---|---|---|
| **Dedicated Emergency/SOS surface** | None (Avaz's Mistake/Alert is closest) | Commercial apps serve 5-year-olds to adults in controlled settings; Suara's user is a young woman in Jakarta with specific safety/independence needs. Decision is user-research-driven, not industry-derived. Defend it by citing the family's specific use case and keeping it off by default for users who don't need it. |
| **Fixed 1-people-row** | Only Avaz pins People in core; P2G/Snap keep it in fringe | Photo-based People row is well-motivated for autism research (familiar face salience), but 1 row in a 6-row grid is 17% of screen for what may be 4–5 contacts. If the user adds 8+ contacts this breaks; plan overflow (swipe? grid-in-grid?). |
| **ARASAAC as primary symbol system** | Cboard/open only — no commercial app relies on ARASAAC | ARASAAC is free, Creative Commons, has good BIPOC and non-Western representation compared to SymbolStix/PCS, and supports Spanish/Portuguese/many languages including Indonesian prototyping. Defend by licensing argument and representation; acknowledge SymbolStix has more symbols. |
| **PWA on one Android tablet** | No commercial app is PWA-primary | Install cost, offline via service-worker, update cadence, no app-store gating — but also: text-to-speech quality on Android WebView is the weak link. Document which TTS engines you tested. |
| **6×6 grid default** | P2G recommends 7×11; Snap caps at 8×10; LAMP is 7×12; Avaz 60+; only GoTalk and Proloquo-beginners go lower | This is the biggest divergence from evidence. Defend via user-specific feature match, but plan the escalation path explicitly: what triggers the move to 7×9 or 8×10? Time-based? Tap-rate? Caregiver-initiated? |
| **Intent suggestions** (LLM-powered?) | CoughDrop "suggested words" and Proloquo Related Words approximate this | If LLM-backed, disclose how; handle offline; prevent unsolicited suggestions from steering the user's voice. |
| **Bigrams (per feedback learnings)** | Text prediction exists but not symbol-level bigrams | Novel. Evaluate with usage data: are the next-word suggestions accepted >20% of the time? If not, the real estate is better used for Related Words or QuickFires. |
| **Modeling mode is a first-class UI toggle** | None commercial do this via UI; CoughDrop tracks data | Good direction. Log modeled taps separately (borrow CoughDrop's separation). |
| **No word prediction in grid (but bigrams instead)** | All commercial apps have some prediction somewhere | Acceptable if bigrams perform; reevaluate after real use. |
| **Fitzgerald Key on ARASAAC symbols (not SymbolStix)** | Commercial apps apply Fitzgerald to the symbol library they own | Works fine — Fitzgerald is a colour system, symbol-agnostic. Just publish the exact hex palette and grammatical-category mapping so caregivers can replicate when adding custom tiles. |

---

## 6. Citations

### Proloquo2Go / AssistiveWare
- [p2g-grids]: https://assistiveware.com/blog/adjustable-grids "AssistiveWare: Adjustable grids"
- [p2g-fixedgrid]: https://www.assistiveware.com/blog/why-does-proloquo-have-a-fixed-grid-size "AssistiveWare: Why does Proloquo have a fixed grid size?"
- [p2g-progressive]: https://www.assistiveware.com/support/proloquo2go/vocabulary-grammar/introduce-core-words "AssistiveWare: Gradually introduce core words with Progressive Language"
- [p2g-msgwin]: https://www.assistiveware.com/support/proloquo2go/appearance/message-window "AssistiveWare: Change the message window appearance"
- [p2g-autoclear]: https://www.assistiveware.com/support/proloquo2go/alternative-access/using-auto-clear-message "AssistiveWare: Using Auto-Clear Message"
- [p2g-colors]: https://www.assistiveware.com/support/proloquo2go/appearance/color-code-page-background "AssistiveWare: Change the color code and page background"
- [p2g-templates]: https://www.assistiveware.com/blog/templates "AssistiveWare: Templates"
- [p2g-polypredix]: https://assistiveware.com/blog/polypredix "AssistiveWare: PolyPredix"
- [p2g-editlock]: https://www.assistiveware.com/support/proloquo2go/protect-share/hide-show-edit-options "AssistiveWare: Hide or show Edit and Options buttons"
- [p2g-modeling]: https://www.assistiveware.com/learn-aac/start-modeling "AssistiveWare: Modeling — Use AAC to teach AAC"
- [p2g-grammar]: https://www.assistiveware.com/blog/grammar-support "AssistiveWare: Grammar support"
- [p2g-smiles]: https://www.smilestherapy.com/pros-and-cons-of-the-proloquo2go-aac-app/ "Smiles Therapy: Pros and Cons of the Proloquo2Go AAC App"
- [p2g-eduapp]: https://www.educationalappstore.com/app/proloquo2go "Educational App Store: Proloquo2Go Review"

### Proloquo (newer)
- [proloquo-grow]: https://www.assistiveware.com/blog/proloquo-4-grows-with-users "AssistiveWare: How we designed Proloquo to grow with the AAC user"
- [proloquo-org]: https://www.assistiveware.com/blog/how-is-the-vocabulary-in-proloquo-organized "AssistiveWare: How is the Proloquo vocabulary organized?"
- [proloquo-nobase]: https://www.assistiveware.com/blog/base-vocabulary-of-proloquo "AssistiveWare: Why can't I change the base vocabulary of Proloquo?"
- [proloquo-modeling]: https://www.assistiveware.com/blog/how-does-proloquo-make-modeling-easy "AssistiveWare: How does Proloquo make modeling easy?"

### TouchChat / PRC-Saltillo
- [tc-wordpower]: https://prc-saltillo.com/vocabularies/wordpower "PRC-Saltillo: WordPower"
- [sal-wordpower]: https://saltillo.com/products/option/wordpower "Saltillo: Device Options — WordPower"
- [tc-buttonactions]: https://touchchatapp.com/support/touchchat-button-actions "TouchChat: Programming Button Actions"
- [tc-editsdb]: https://touchchatapp.com/support/editing-SDB "TouchChat: Editing the Speech Display Bar"
- [unity-settings]: https://documentation.prc-saltillo.com/docs/unity-aac-settings-overview "PRC-Saltillo: Unity AAC Settings Overview"

### LAMP Words for Life
- [lamp-prc]: https://prc-saltillo.com/apps/lamp-wfl "PRC-Saltillo: LAMP Words for Life"
- [lamp-app]: https://lampwflapp.com/ "LAMP Words for Life app"
- [lamp-london]: https://londonspeechandfeeding.co.uk/post/lamp-words-for-life-a-revolutionary-aac-system/ "London Speech and Feeding Practice: LAMP WFL review"
- [lamp-ebsco]: https://www.ebsco.com/research-starters/language-and-linguistics/language-acquisition-through-motor-planning-lamp "EBSCO Research Starters: LAMP"
- [jks-reviews]: https://justkeepstimming.com/2022/01/07/aac-reviews/ "Just Keep Stimming: AAC Reviews"

### Snap Core First / Tobii Dynavox
- [snap-grids]: https://www.tobiidynavox.com/blogs/support-articles/understanding-pages-and-button-grids-in-td-snap "Tobii Dynavox: Understanding pages and button grids in TD Snap"
- [snap-corefirst]: https://us.tobiidynavox.com/pages/td-snap-core-first "Tobii Dynavox US: TD Snap Core First page set"
- [snap-manual]: http://tdvox.web-downloads.s3.amazonaws.com/Snap/documents/TobiiDynavox_SnapCoreFirst_UsersManual_v1-5_en-US_WEB.pdf "Snap Core First User's Manual v1.5"
- [snap-comparison]: https://download.mytobiidynavox.com/Snap/documents/TDSnap_PageSetComparison_en-INT.pdf "TD Snap Page Set Comparison"
- [snap-coreresearch]: https://download.mytobiidynavox.com/Compass/documents/Articles%20and%20References/The%20Story%20of%20Core.pdf "Tobii Dynavox: The Story of Core"

### CoughDrop
- [cd-site]: https://www.coughdrop.com/ "CoughDrop"
- [cd-edit]: https://coughdrop.zendesk.com/hc/en-us/articles/201366809 "CoughDrop Support: editing boards"
- [cd-research]: https://www.coughdrop.com/research.html "CoughDrop: Research"
- [cd-goals]: https://www.prweb.com/releases/coughdrop_adds_goals_and_badges_to_help_motivate_developing_communicators/prweb13986594.htm "PRWeb: CoughDrop adds Goals and Badges"
- [cd-reports]: https://coughdrop.zendesk.com/hc/en-us/articles/201366699 "CoughDrop Support: What reports are available"
- [cd-model]: https://blog.mycoughdrop.com/aacinthehome/ "CoughDrop Blog: Modeling AAC in the Home"
- [cd-about]: https://www.coughdrop.com/about "CoughDrop: About"
- [cd-ck20]: https://blog.mycoughdrop.com/introducing-communikate-20-for-coughdrop/ "CoughDrop Blog: Introducing CommuniKate 20"
- [cd-intuition]: https://intuitionlabs.ai/software/speech-language-pathology/aac-augmentativealternative-communication/coughdrop "IntuitionLabs: CoughDrop overview"

### GoTalk NOW / Attainment
- [gt-main]: https://www.attainmentcompany.com/gotalk-now "Attainment: GoTalk NOW"
- [gt-appstore]: https://apps.apple.com/us/app/gotalk-now/id454176457 "App Store: GoTalk NOW"

### Avaz
- [avaz-product]: https://avazapp.com/products/avaz-aac-app/ "Avaz AAC product page"
- [avaz-layout]: https://everyday.avazapp.com/blog/how-vocabulary-layout-shapes-communication-a-peek-inside-avaz-aac/ "Avaz Blog: How Vocabulary Layout Shapes Communication"
- [avaz-features]: https://avazapp.com/features/ "Avaz Features"
- [avaz-langs]: https://avazapp.freshdesk.com/support/solutions/articles/11000024972 "Avaz Support: In what languages is Avaz available?"
- [avaz-acq]: https://www.prc-saltillo.com/articles/avaz-acquisition "PRC-Saltillo: Avaz Acquisition"

### Cboard / CommuniKate / Open ecosystem
- [cboard-home]: https://www.cboard.io/en/ "Cboard.io"
- [obf]: https://www.openboardformat.org/examples "Open Board Format"
- [open-ecosystem]: https://opendirective.net/posts/2020-04-17-the-open-communication-symbols-ecosystem/ "OpenDirective: The Open Communication Symbols Ecosystem"
- [omazing-symbols]: https://omazingkidsllc.com/2021/04/11/most-widely-used-aac-symbols/ "OMazing Kids: Most Widely Used AAC Symbols"

### Research / evidence
- [p2g-asha]: https://pubs.asha.org/doi/10.1044/aac18.4.137 "Sennott & Bowker 2009: Autism, AAC, and Proloquo2Go — ASHA Perspectives on AAC"
- [p2g-eric]: https://files.eric.ed.gov/fulltext/ED577783.pdf "The Proloquo2Go app in reducing echolalia in autism (ERIC)"
- [aac-review]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8620483/ "Implementation of application software to improve verbal communication in children with ASD: A review (PMC)"
- [gosnell-feature]: https://www.forbesaac.com/post/feature-matching-in-aac-assessment-voice-features "Forbes AAC: Feature-Matching in AAC Assessment"
- [asha-leader]: https://leader.pubs.asha.org/doi/10.1044/leader.FTR1.16122011.10 "ASHA Leader: Apps — An emerging tool for SLPs"
- [praacaac]: https://praacticalaac.org/praactical/teach-me-tuesday-coughdrop/ "PrAACtical AAC: Teach Me Tuesday — CoughDrop"
- [towson]: https://towson.libguides.com/speech-language-pathology/aac-apps "Towson University Library: AAC Apps"

### Indonesian-specific AAC
- [vicara]: https://www.lspr.ac.id/developing-augmentative-and-alternative-communication-aac-apps-for-nonspeaking-autistics-in-indonesian-language-vicara-visually-interactive-and-communication-reading-aid/ "LSPR: VICARA — Indonesian AAC"
- [berkata]: https://aacberkata.com/ "BerKata AAC (Indonesian)"

---

_End of report._
