# Suara Code UX Audit — v1.0.2

> Auditor: Claude (read-only investigation), 2026-04-16.
> Target codebase: `/Users/abimangkuagent/Desktop/SUARA PROJECT/suara/`
> Scope: every component in `src/components/` + infrastructure, cross-referenced against SPEC.md, RESEARCH.md, CLAUDE.md, CHANGELOG.md.
> Format: code reference → classification → evidence basis → proposed alternative (only for WEAKNESS).
> Classifications: **KEEP** (research-grounded), **REVIEW** (defensible, re-examine), **WEAKNESS** (should improve), **UNKNOWN** (novel, untested).

---

## 1. Executive Summary

The Suara codebase is unusually disciplined for a personal project: 24 hardcoded core words with fixed grid coordinates (LAMP-compliant), WCAG AA-verified Fitzgerald Key palette tokens, haptic consolidation at a single source, confirm-clear + undo on deletion, and per-section ErrorBoundary isolation. Most big-rule decisions in RESEARCH.md are visible in the code and correctly implemented. Bundle is 126 kB gzipped JS / 5.79 kB CSS / 79-entry precache at 1.83 MB — well under stated budgets.

The audit surfaces **seven distinct weakness clusters**, roughly in order of severity:

1. **PeopleRow no longer matches the spec.** SPEC.md §3.1 shows the people row as "up to 4 + Tambah + spacer." The code shows **up to 6 people**, Tambah disabled, and no spacer. This violates both documentation and quietly increases per-row cognitive load (see finding 2.1.3 below).
2. **Caregiver-only Tambah button is permanently disabled** with no visible affordance to reach the admin. It looks tappable and does nothing. (2.1.3)
3. **Admin discovery is hostile.** The ONLY way to reach admin/emergency/modeling/search/dashboard is memorized gestures (3s, 1.5s, 2s, URL param). A new caregiver cannot discover any of them. No onboarding reveals them. (5, 6, 7)
4. **Core-word tap is not logged.** `CoreRow` calls `addWord` but never calls `useUsageLog.logTap`. Frequency model, usage insights, and intent suggestions are built on a log that is **never populated from core taps** — and core taps are the entire expressive surface. This is a silent data pipeline bug, not a UX preference. (11.2)
5. **`SEED_PEOPLE` initials are wrong:** `Ibu` has initial `K` and `Mbak` has initial `M`. The avatar shows "K" for Ibu. (4.3)
6. **Sentence auto-clears 1.5s after `speak()`.** She cannot hear it again, cannot show a partner the sentence, and cannot re-speak it with a tap on ▶ Bicara. This conflicts with McNaughton & Light's undo-is-#1 principle. (3.3)
7. **SMS-only emergency, no real call path.** `sms:` URIs fail silently on desktop and require SMS app on mobile. She can also tap "Panggil Ambulans" expecting a phone call; it opens an SMS composer. Label mismatch. (5.1)

Cross-cutting: **a11y is label-only** (no focus-visible ring, no keyboard nav), admin/edit flows use alert-free multi-step forms with no cancel safety, blob URLs are mostly clean but the photo-cropped JPEG is stored raw in IndexedDB (no thumbnail), and the auto-return-to-home behavior in folders (a strong UX choice) is undocumented in SPEC.md.

Highest-value fixes are (a) logging core-word taps, (b) fixing the PeopleRow spec/code drift, (c) adding a visible admin entry affordance (even a small "⚙" in SentenceBar that requires long-press or double-tap), and (d) removing the auto-clear on ▶ Bicara.

---

## 2. Per-component deep dives

### 2.1 Layout — SymbolGrid family

#### 2.1.1 `SymbolGrid.tsx` (container)

- **What:** 6-col CSS grid, `gap-[6px] p-1.5 min-h-0 overflow-hidden`, `gridAutoRows: minmax(0, 1fr)`, `role="grid"` with `aria-label="Papan komunikasi"`. `src/components/SymbolGrid/SymbolGrid.tsx:10-15`.
- **Classification:** **KEEP**. Matches SPEC.md §3.1 exactly (v1.0.2 tightened from 8px → 6px for Tab A11 fit). Uses CSS grid with fractional rows so all rows share height regardless of content.
- **Why:** Trewin et al. (2013) — ≥90×90 px target. At 1024×600 viewport, 6 cols × 6 rows with 6 px gaps give each button ≈ 160×90 px — at the floor, which is acknowledged in RESEARCH.md §5.
- **Note:** Fringe words use the same grid dimensions via `FolderContents`, so once inside a folder she sees same-sized buttons — good motor consistency.

#### 2.1.2 `SymbolButton.tsx` — the atomic building block

- **What:** ~200 lines. Handles variant styling, FK color override, haptic on `onPointerDown`, long-press timer (1500 ms), scale-tap 80 ms, img error fallback, letter-circle fallback, `role="gridcell"`, `aria-label`. `src/components/SymbolGrid/SymbolButton.tsx:1-197`.
- **Classification:** mostly **KEEP**, two **REVIEW** and one **WEAKNESS**.
- **KEEP — Haptic single-source.** `HAPTIC_DURATIONS` with store-level configuration, only fires for `variant !== 'folder' && variant !== 'kembali'`. Fixes the v1.0.0 double-fire bug. (Line 130-140.)
- **KEEP — Letter-circle fallback.** `label.charAt(0).toUpperCase()` in dashed circle replaces the `?` that would read as "apa". (Line 114-125.) Direct response to a v1.0.1 bug.
- **KEEP — Blob URL lifecycle.** `useMemo` + `useEffect` cleanup properly revokes blob URLs on unmount. (Line 59-66.)
- **REVIEW — Font size `clamp(11px, 2.2vw, 18px)`.** At 1024 px viewport, `2.2vw = 22.5 px`, clamped to 18 px — OK. At 320 px viewport (hypothetical), 2.2vw = 7 px, clamped up to 11 px — barely readable. Mostly fine because landscape-locked tablets never reach 320 px, but the floor is low. `src/components/SymbolGrid/SymbolButton.tsx:190`.
- **REVIEW — Long-press timer uses 1500 ms constant.** Discoverable by only one user (the caregiver who read the spec). 1.5 s is consistent with the SPEC.md 1.5 s emergency spec but creates a conflict with the admin 3s long-press if both happen on overlapping regions. Not currently overlapping — admin uses the SentenceBar — but worth noting the gesture budget is tight.
- **WEAKNESS — No focus-visible styling.** Buttons have no `focus:ring` or `focus-visible:outline` class. Tab A11 has touch-only use, but any caregiver with a keyboard/remote/switch-access setup loses all visual focus. This is a WCAG 2.1 SC 2.4.7 gap.
- **Proposed fix:** Add `focus-visible:ring-2 focus-visible:ring-suara-blue focus-visible:ring-offset-1` to `baseClasses`. No visual cost on touch; large win for switch access.

#### 2.1.3 `PeopleRow.tsx` — spec/code drift, WEAKNESS

- **What:** Shows up to **6 people** (not 4 as spec says), hides Tambah when full, uses spacer divs when not. `src/components/SymbolGrid/PeopleRow.tsx:14-16`.
- **Classification:** **WEAKNESS**.
- **Why:** SPEC.md §3.1 diagram shows exactly "up to 4 + Tambah + spacer." CLAUDE.md also says "up to 4 people + Tambah + spacer padding to 6 cells." The code uses `.slice(0, 6)`. This silently lets a caregiver add 5+ people, at which point the "Tambah" disappears from the row and the only way to add another is through Admin → Kelola Orang — without any visual indication to the primary user that there used to be a Tambah button there.
- **Secondary weakness:** the Tambah button is `disabled` with `onTap={() => {}}`. It looks like a button (same styling as other people), but tapping does nothing. No route to AddPerson surfaces — that lives behind 3s long-press on SentenceBar → PIN → 👥 Kelola Orang → + Tambah. A user will tap Tambah (it reads "Tambah" = add), get no response, silently habituate that the button is broken, and stop trying.
- **Proposed fix (doc side):** Decide if "4 people" or "6 people" is the spec. If 4, enforce with `.slice(0, 4)` and always render Tambah + spacer. If 6, update SPEC.md and CLAUDE.md §Grid.
- **Proposed fix (UX side):** Tambah should either (a) open a caregiver-gated prompt (same gesture as admin) or (b) be removed entirely from the main grid, moving add-person exclusively to admin. The current middle ground (disabled, visible, labeled "Tambah") is the worst of both worlds.

#### 2.1.4 `FolderRow.tsx`

- **What:** Maps `folders` from IndexedDB, pads to 6 with aria-hidden spacers. `src/components/SymbolGrid/FolderRow.tsx:9-28`.
- **Classification:** **KEEP**.
- **Note:** Uses `emoji` directly from the DB record (set in SEED_FOLDERS). Good — keeps vocabulary of folder icons out of the button code.

#### 2.1.5 `FolderContents.tsx`

- **What:** Shows first 6 words, or first 5 + "lihat semua" if >6 exist. Full-span `Kembali` at bottom. Auto-returns home after tap. `src/components/SymbolGrid/FolderContents.tsx:22-80`.
- **Classification:** mixed.
- **KEEP — Auto-return-to-home after fringe tap** (line 50, `setActiveFolder(null)`). This is great UX — avoids the Kembali tap, her next word is always core. It's not in SPEC.md and should be documented.
- **REVIEW — "lihat semua" button shape.** Rendered as a regular SymbolButton with emoji `➡️` and label "lihat semua". It consumes one of the 6 grid cells. SPEC.md §3.3 says "Lihat semua inside folder switches to Lengkap pack" — but the code does `setShowAll(true)` which just removes the slice limit; it does NOT switch vocabulary packs. `showAll` is local component state; it resets on folder close. So the Lengkap pack admin toggle and the "lihat semua" button live in different worlds and the feature implied by SPEC.md is not actually delivered.
- **Proposed fix:** Either (a) rename "lihat semua" → "Lebih banyak" to match behavior or (b) wire it to pack activation via `togglePack` / `getActivePacksForFolder`. Right now VocabPackAdmin controls which words are seeded but FolderContents shows all active words regardless of pack. This is silent spec drift.
- **WEAKNESS — Pagination math when showAll is true.** `(6 - (allWords.length % 6)) % 6` fills empty cells at the end, but the `Kembali` is `col-span-6` at the end. For 10 words, you get 10 + 2 padding + Kembali (6 cols). For 6 words, you get 6 + 0 padding + Kembali. For 7-12 words, 7-12 + 5-to-0 padding + Kembali. Looks OK visually but Kembali's grid position shifts each time. Motor memory for "Kembali lives at bottom-left" is only partially true.

#### 2.1.6 `CoreRow.tsx` — the motor-memory backbone

- **What:** Maps `CORE_WORDS`, passes `onLongPress={openEmergency}` for `bantu`. `src/components/SymbolGrid/CoreRow.tsx:10-26`.
- **Classification:** **KEEP**, with one **WEAKNESS**.
- **KEEP — Core words from the hardcoded array**, never DB. Per LAMP research, positions are law.
- **WEAKNESS — Core word taps are never logged.** `CoreRow` only calls `addWord` (via `useSentenceBar`), which internally calls `playWord` but **never** calls `useUsageLog.logTap`. Search shows `useUsageLog` is defined but only used by... nothing. Grep for `logTap(` returns 0 matches outside its definition. Implication: `usageEvents` only fills from fringe-word taps (via FolderContents → addWord → ?) — but FolderContents also doesn't log. So `usageEvents` is effectively empty, which means:
  - Frequency model returns empty → intent suggestions fall through to bigrams + AI only.
  - UsageInsights "Top words" always empty.
  - Milestones never trigger (they require the tap stream).
  - Parent dashboard word counts stay at 0.
- **Proposed fix:** Call `logTap` inside `useSentenceBar.addWord` (authoritative choke point) so every tap — core, fringe, people, quickphrase — produces an event. This single change resurrects the entire analytics and learning pipeline.

### 2.2 SentenceBar (top blue bar)

#### 2.2.1 `SentenceBar.tsx` structure

- **What:** Min-height 56 px, blue `#2563EB`, 5 action icons (`⚡🔍🕐🔊💬`) at w-11 h-11 each, chip scroll area, then `⌫` + `✕ Hapus` + `▶ Bicara`. `src/components/SentenceBar/SentenceBar.tsx:80-179`.
- **Classification:** **KEEP** for architecture; **REVIEW** for density and **WEAKNESS** for a couple of behaviors.
- **REVIEW — 5 icon buttons at 44×44 px in a 1024 px bar.** They're all `w-11 h-11` = 44×44 (WCAG minimum). Symbol is 22 px, so small icon in moderately-sized touch target. On Tab A11 the row of `⚡ 🔍 🕐 🔊 💬` takes ≈ 240 px of horizontal bar, leaving ≈ 520 px for chips before `⌫ ✕ Hapus ▶ Bicara` (another ≈ 280 px). A 3-word sentence with ~80 px chips fits fine; a 7-word sentence overflows into a scrolling row. Overflow scroll is `scrollbar-hide`, horizontally scrollable but provides no visual overflow indicator — the user doesn't see her earliest chips. No clipping handle, no fade-out-left gradient.
- **WEAKNESS — Discoverability and hierarchy of the 5 icons.** All 5 are visually identical (same white/20 bg, same size). They do very different things: ⚡ (opens sheet), 🔍 (opens fullscreen search), 🕐 (opens sheet), 🔊 (toggles state), 💬 (toggles pane). The most-used (likely 🔊 mute and ⚡ quickphrases) sit next to the least-used (💬 interpretation). Her visual/motor map has no hierarchy. For her this probably doesn't matter (she picks what works); for a caregiver introducing the tablet it's a flat plane of emojis.
- **Proposed fix:** Consider demoting 🕐 (history) and 💬 (caregiver pane) to a single "•••" menu; keep ⚡, 🔍, 🔊 visible. This frees ~90 px for chips.
- **WEAKNESS — `onMouseDown/onTouchStart` for the 3s admin long-press fires on ANY tap in the blue bar, including on the 5 icon buttons and the Bicara button.** Because of event propagation, tapping any button starts the 3s timer. Children's `onClick` stops propagation implicitly by running after the long-press completes only if the press was held 3s — but if a caregiver holds the `▶ Bicara` button for 3s (thinking long-press = modeling), they can accidentally trigger admin instead. In practice: Bicara has its OWN `onMouseDown` for the 2s modeling-mode timer, and that also fires. Two long-press timers racing: whichever completes first wins, but the other lingers.
- **Actually:** Looking closer, the Bicara handler doesn't `stopPropagation` on `onMouseDown`, so bar-level handler also runs. 2s timer fires modeling-mode, 3s timer (still running) fires admin. Net: 3-second hold on Bicara = modeling mode AND admin PIN overlay. The admin overlay is z-[100], covers everything. A real user won't encounter this because 3s on Bicara is weird, but it's a latent bug.
- **Proposed fix:** The bar-level long-press timer should start only on `onMouseDown` from the bar itself (use `onMouseDown={e => { if (e.currentTarget === e.target) handlePressStart() }}`), not from descendants.

#### 2.2.2 Confirm-clear (`✕ Hapus`)

- **What:** First tap → `setConfirmClear(true)`, shows "Yakin?" red for 1.5s; second tap → clears. `src/components/SentenceBar/SentenceBar.tsx:53-64`.
- **Classification:** **KEEP**. Directly implements RESEARCH.md §6 (McNaughton & Light 2013 — accidental deletion is #1 abandonment cause).

#### 2.2.3 Undo backspace (`⌫`)

- **What:** Stores last removed word in `undoRef` for 2000 ms; tapping `⌫` again within window restores. `src/hooks/useSentenceBar.ts:15-30`.
- **Classification:** **WEAKNESS**.
- **Why:** No toast, no visual indication that undo is available. The user presses ⌫ once → word gone → presses ⌫ again thinking "remove next one" → instead, the previous word is restored. This is **model-inverted**: ⌫ second-press means either "undo" or "remove another"; it's ambiguous. The 2s window is silent.
- **Proposed fix:** Either (a) separate Undo button with toast (as SPEC.md says "2-second toast" — the code does not implement the toast, just the behavior), or (b) explicit "↶ Kembalikan" chip inline in the sentence area for 2 s. Current code is a silent feature.

#### 2.2.4 `▶ Bicara` behavior + auto-clear

- **What:** Tap → `speak()` → adds to history → sets 1500 ms timeout to auto-clear. `src/hooks/useSentenceBar.ts:52-70`.
- **Classification:** **WEAKNESS**.
- **Why:** The auto-clear is a deliberate choice (keeps the bar fresh for next sentence) but harms use cases:
  - She can't re-speak the same sentence (tap ▶ Bicara again after 1.5s and it's empty).
  - A caregiver can't read what she just said — sentence disappears while they're still processing.
  - In noisy environments (Jakarta café, family dinner), she may need 3-4 repeats. She cannot.
  - The history sheet (🕐) is a workaround but requires 2 taps (open sheet → tap phrase) vs. direct ▶ Bicara.
- **Proposed fix:** Remove the auto-clear. Let the sentence persist until she taps `✕ Hapus` or the chip sequence is modified. OR: only auto-clear if the user taps outside the bar, or after 30+ s of inactivity.

#### 2.2.5 Long-press Bicara → modeling mode

- **What:** `handleBicaraPressStart` sets 2000 ms timer to `toggleModelingMode`. `src/components/SentenceBar/SentenceBar.tsx:27-38`.
- **Classification:** **KEEP + WEAKNESS**.
- **KEEP:** Implements Binger & Light 2007 correctly (banner text "suara main, kalimat tidak bertambah" — fixed in v1.0.1).
- **WEAKNESS:** Discoverability. A caregiver with zero docs has no way to know long-press Bicara enters modeling. Not mentioned in OnboardingGuide section titles, no UI hint. Needs surfacing.

#### 2.2.6 WordChip rendering

- **What:** White pill, 16 px bold, `px-4 py-1 rounded-full`. `src/components/SentenceBar/WordChip.tsx:7-18`.
- **Classification:** **KEEP**. Nothing fancy, doesn't need to be.
- **Note:** Not clickable. She can't tap a chip to hear just that word again, or to delete a specific chip. The only deletion path is rightmost-first via `⌫`. This is intentional (keeps model simple, matches LAMP-style grids), but means a mid-sentence error requires multiple backspaces.

#### 2.2.7 Action icon density

Summary table of the 5 action icons:

| Icon | Action | State | Discoverable? | Used how often? |
|------|--------|-------|---------------|-----------------|
| ⚡ | Open quickphrases sheet | stateless | label, yes | high (pre-written sentences) |
| 🔍 | Toggle fullscreen search | stateless | emoji-only | medium |
| 🕐 | Toggle history sheet | stateless | emoji-only | low (workaround for no re-speak) |
| 🔊/🔇 | Toggle mute | stateful icon swap | yes | medium |
| 💬 | Toggle caregiver pane | stateful (bg white/40 when open) | emoji-only | low |

Only 🔊 has visible state. 💬 has weak state (white/40 vs white/20). The others provide no feedback about whether they're "on" or opened. Not a functional problem (they all open overlays) but makes the bar feel flat.

### 2.3 IntentSuggestions

- **What:** Renders a row of up to 3 buttons between SentenceBar and grid, if sentence >= 2 words, not modeling, and there ARE suggestions. Returns `null` otherwise. `src/components/AI/IntentSuggestions.tsx:15-40`.
- **Classification:** **REVIEW**.
- **v1.0.2 change:** The placeholder reservation was reverted to `null` to preserve Tab A11 fit. CHANGELOG.md is clear about the reason.
- **Why REVIEW:** The ~8 % button reflow when suggestions appear contradicts the LAMP "buttons don't move" invariant in a subtle way. Button *identities* don't move (same word lives at same cell), but *positions in screen coordinates* shift downward by ~53 px because the suggestion row appears above. For a user tracking by motor memory, this is like asking a touch-typist to shift down one row mid-sentence. The decision to accept this in exchange for always-visible folders is a tradeoff — but the ~8% figure understates the motor-memory hit because the first 2 taps are precisely when she has the strongest "I know where the next word is" commitment.
- **Proposed alternative (not weakness, open question):** If IntentSuggestions is only valuable after 2 words, and the grid needs to remain stable, consider making suggestions appear as **chip-shaped overlays anchored to the sentence bar** instead of a full row. Then nothing in the grid moves. Tradeoff: they're closer to the sentence, so cognitively "sentence-y" instead of "next-word-y."

### 2.4 EmergencyBoard

- **What:** Long-press `bantu` 1500 ms → `openEmergency()` → fullscreen red overlay with 4 buttons. Each button triggers `window.location.href = 'sms:NUMBER?body=...'`. Falls back to `alert()` if contact not configured. `src/components/AI/EmergencyBoard.tsx:41-98`.
- **Classification:** mixed — **KEEP** intent, **WEAKNESS** execution.

#### 2.4.1 WEAKNESSES

- **W1: "Panggil Ambulans" opens SMS, not a phone call.** The label says "Panggil" (call). The action is SMS. On a panic moment this is a mismatch. An unconfigured number → alert falls through, no SMS, no call.
- **W2: No fallback to `tel:`.** `sms:` URIs require a messaging app. Android Chrome will open Messages; some Samsung devices with Google Messages + Samsung Messages present a chooser. Desktop: silent fail (SPEC.md §9 acknowledges this).
- **W3: Ibu/Ayah/Ambulans contacts come from IndexedDB per-device.** No cloud sync of emergency contacts. If the tablet resets or gets replaced, emergency contacts are lost until a caregiver reconfigures.
- **W4: The overlay uses `z-[95]`.** Admin overlay is `z-[100]`. If admin is already open (unlikely but possible if a caregiver is configuring) and she long-presses bantu, the emergency board renders underneath admin and she can't see it. Not a realistic scenario but z-index ordering is fragile.
- **W5: No recent-message preview or test button.** A caregiver configures the number, never verifies it works. Admin → Kontak Darurat has no "Test SMS" button.
- **W6: The message bodies are static strings** ("Saya sakit, tolong.") — Bahasa Indonesia, good. But no location, no timestamp, no app context. If Ibu receives the SMS she doesn't know the tablet sent it versus a stranger holding the tablet. (Mild concern.)

#### 2.4.2 Proposed alternatives

- Add a "Panggil" variant that uses `tel:` for Ambulans, `sms:` for Ibu/Ayah (keep text path for personal contacts — context preservation matters).
- Add `| Darurat Suara AAC` suffix to SMS bodies so caregivers see it came from the app.
- Add a "🔊 Uji" button in Kontak Darurat admin that sends `sms:` to the current browser (no real send, just verifies the link opens).

### 2.5 Admin interface (long-press SentenceBar 3s → PIN → AdminHome)

#### 2.5.1 Admin discovery path

- **What:** Only entry is long-press SentenceBar for 3000 ms. No visible affordance. `src/components/SentenceBar/SentenceBar.tsx:40-51`.
- **Classification:** **WEAKNESS**.
- **Why:** A new caregiver has no way to discover this except reading SPEC.md or being told. OnboardingGuide mentions "tekan lama bilah kalimat selama 3 detik" (line 20) but OnboardingGuide is itself behind admin. Chicken-and-egg.
- **Proposed fix:** First-launch onboarding modal (tied to `settings.onboardingCompleted = false`) that teaches the gesture once. Currently `onboardingCompleted` is only ever set true from within the admin's OnboardingGuide component, so new installs never see it.

#### 2.5.2 AdminHome card grid

- **What:** 11 cards (not 14 — the spec miscounts) in a 2-col grid. Each card has emoji, label, description. `src/components/Admin/AdminHome.tsx:18-30`.
- **Classification:** **REVIEW**.
- **Mismatch with SPEC.md §3.7:** SPEC lists 14 items (including milestone + AI vocab suggestions). `ADMIN_CARDS` array has 11. `📊 Wawasan Penggunaan` rolls milestone display into UsageInsights. No separate `🏅 Milestone`. No separate `💡 Saran AI` — there's `🤖 Saran Kosakata` which is the same thing with different emoji. SPEC drift.
- **Note:** The cards are well-organized but the labels don't strictly match SPEC (e.g., SPEC uses `📱 Kiosk Mode`; code uses `📱 Mode Kiosk` — this matches but SPEC capitalized inconsistently).

#### 2.5.3 PIN entry UX

- **What:** 4-6 digit PIN, 3-col keypad (10 digits + ⌫ + empty), shows 6 dots for visual filling, error messages. Create-PIN has enter+confirm flow. `src/components/Admin/AdminOverlay.tsx:96-160`.
- **Classification:** **KEEP** overall, with one **REVIEW**.
- **REVIEW — "Masuk" submit button.** User can type PIN and then tap "Masuk", but the PIN also auto-submits when 6 digits are entered? No, actually there's no auto-submit. User must tap "Masuk" after typing. This is slightly annoying for 4-digit PINs that already know to submit.
- **Proposed fix:** Auto-verify when PIN reaches 6 digits (or on 4-digit PIN, debounce 400ms then verify).

#### 2.5.4 AddWord 4-step flow

- **What:** photo → label → folder → confirm. `src/components/Admin/AddWord.tsx`.
- **Classification:** **REVIEW**.
- **Why:** 4 steps is borderline — each step has a back button so recovery is possible. But: photo is optional (can "Lewati foto"), folder is required, label is required. Could be a single form with optional photo + required fields. Wizard flow works well on small screens but this is a tablet; there's room for a single screen.
- **REVIEW — Category choice is a label-based picker** (flat list with emoji + label). No way to create a new category inline. If a caregiver wants to add "dokter" (doctor) but there's no Medis folder, they have to exit, figure out how to add a folder (not in admin), then return. There's actually NO folder-creation UI in admin at all — folders are only ever seeded from SEED_FOLDERS. So custom folders are not possible.
- **Proposed fix:** Add "+ Folder Baru" at top of folder picker list.

#### 2.5.5 ManagePeople + EditWord

- **What:** List view with photo/name + 3 action buttons per row: edit label (inline input), change photo (tap photo), delete (confirm dialog). `src/components/Admin/ManagePeople.tsx`, `EditWord.tsx`.
- **Classification:** **KEEP**.
- **Minor WEAKNESS — Delete confirmation is inline "Hapus | Batal" buttons (not a modal).** Good UX but accidental taps on 🗑️ still require a confirm, so safe.

#### 2.5.6 EmergencyContacts admin

- **What:** 3 cards (Ibu, Ayah, Ambulans) each with name + phone input. Ambulans defaults to 118. Save → shows "✓ Tersimpan" for 2s. `src/components/Admin/EmergencyContacts.tsx`.
- **Classification:** **KEEP + 2 minor WEAKNESS**.
- **W1:** No input validation on phone format. Caregiver can enter letters or empty strings. Error surfaces only when the user long-presses bantu in a real emergency.
- **W2:** No test button (also noted in 2.4.2).

#### 2.5.7 VocabPackAdmin

- **What:** Shows packs per folder with Aktif/Nonaktif toggle. `src/components/Admin/VocabPackAdmin.tsx`.
- **Classification:** **WEAKNESS** (broken promise).
- **Why:** Toggling a pack here updates `vocabularyPacks.isActive` in the DB, but **nothing reads from vocabularyPacks at grid render time**. `FolderContents` uses `useFolderWords(folder?.id)` which queries `db.words.where('folderId').equals(folder.id).filter((w) => w.isActive).sortBy('sortOrder')` — no pack filter. Pack toggling is a no-op on the user-facing grid.
- **Proposed fix:** Either wire FolderContents to honor active packs (read `vocabularyPacks` for folder, union wordIds, filter `db.words` to that set), or remove the VocabPackAdmin UI since it doesn't do anything.

#### 2.5.8 BackupRestore

- **What:** Export vocab as JSON, import with confirm-warning. `src/components/Admin/BackupRestore.tsx`.
- **Classification:** **KEEP**. Has the right pattern: confirm before destructive restore.

#### 2.5.9 VocabSuggestions (AI)

- **What:** Calls OpenRouter with current vocab + 30-day usage. Parses pipe-delimited response. User approves per-word to add. `src/components/Admin/VocabSuggestions.tsx`.
- **Classification:** **KEEP**.
- **Note:** Relies on `usageEvents` being populated. Since core taps aren't logged (finding 2.1.6), AI gets only folder-word usage data, skewing suggestions toward fringe vocabulary.

### 2.6 Modeling mode

- **Discovery:** Long-press ▶ Bicara 2s. `src/components/SentenceBar/SentenceBar.tsx:27-31`.
- **Banner:** "Mode Modeling — suara main, kalimat tidak bertambah" — amber (`suara-amber-light` bg, `suara-amber` text). `src/components/SentenceBar/SentenceBar.tsx:75-79`.
- **Classification:** **KEEP** (content) + **WEAKNESS** (visual).
- **WEAKNESS:** Amber banner is 1 row, xs text, not strongly differentiated. In modeling mode, ▶ Bicara flips to ■ Hentikan (line 177) — that IS a strong signal, but the amber ring on tapped buttons is only 500 ms (`setTimeout(setIsHighlighted(false), 500)`) — then gone. A caregiver demonstrating "mau makan" would tap 2 words; after 500 ms the amber is gone and there's no record "I just modeled these words." For a child watching intermittently, the demo is over before she looks up.
- **Proposed fix:** Persist the amber ring for longer (2s+), or show a trail of last-3-modeled words in an inline mini-row.

### 2.7 Parent dashboard

- **What:** `?dashboard=true` → PIN gate → Dashboard page with taps-per-day chart, top words, milestones, folder usage. `src/pages/Dashboard.tsx`.
- **Classification:** **REVIEW**.
- **Data quality:** As noted, `usageEvents` is effectively empty. Dashboard will show zeros everywhere until the logging bug is fixed.
- **UX:** Clean, single-page, bookmarkable. No auth beyond PIN (same as admin). Parent can also open `?dashboard=true` from a PC.
- **WEAKNESS — URL-parameter-only entry.** There's no link to the dashboard from admin. A parent who forgets the URL trick has to re-read documentation. Easy fix: add a "📊 Dashboard" card or link in AdminHome.

### 2.8 Visual design

#### 2.8.1 Typography

- **What:** Nunito 500/600/700/800, loaded from Google Fonts in `index.html:15`. Labels: 18 px bold, letter-spacing 0.4 px, `font-variant` default. CSS var `--font-sans` in globals.css.
- **Classification:** **KEEP**. Matches RESEARCH.md §12 exactly (open apertures, letterform distinction).
- **REVIEW:** Google Fonts load at runtime. On first launch without cache this is ~30 kB of font data. Workbox runtime cache stores it after first load (vite.config.ts lines 17-32). On a slow 4G launch the first render will briefly use fallback `sans-serif`. Acceptable.

#### 2.8.2 Color system

- **What:** 8 categorical palettes + `suara-*` semantic, all WCAG AA verified per globals.css comment. `src/styles/globals.css:1-12`.
- **Classification:** **KEEP**. The contrast audit is solid.
- **Minor concern:** People variant `#15803d on #DCFCE7` = 4.6:1 — just barely passes AA (4.5:1). A 0.1 degradation via browser font rendering or dim screen = fail. All others have more headroom.

#### 2.8.3 Background

- **#F8F7F4** — warm off-white per Irlen/UDL research. Applied at body + root.
- **Classification:** **KEEP**.

#### 2.8.4 Folder color consistency

- **What:** Folder variant = gray (`bg-suara-gray-light`). Fringe variant also = gray-ish (`bg-suara-content-bg` = `#F9FAFB`). `src/components/SymbolGrid/SymbolButton.tsx:22-28`.
- **Classification:** **WEAKNESS**.
- **Why:** Fitzgerald Key assigns **nouns** (e.g., nasi goreng, sekolah) → orange. The fringe words in Makanan/Tempat/Tubuh/etc. are nouns, but they render in neutral gray-white (`suara-content-bg`), not orange. The `fkColor` prop is only used when `variant === 'core'` (line 129). Fringe never gets FK color. So a tapped noun in sentence context shows up alongside verbs and has no visual "noun-ness." RESEARCH.md §1 is explicit that color coding should apply across the full grid.
- **Proposed fix:** Map folder → FK color (e.g., Makanan/Pakaian/Tempat → `noun`, Perasaan → maybe its own emotion palette or map to `descriptor`, Aktivitas → `verb`, Tubuh → `noun`, Pertanyaan → `descriptor`). Then in SymbolButton, honor `fkColor` for `variant === 'fringe'` too.

#### 2.8.5 Border radius and shadows

- **Radius:** `14 px` via `--radius-button`. Consistent across all buttons.
- **Shadow:** No shadows anywhere. This matches the "no animations, no fancy visual" aesthetic. But it also means elevation cues (e.g., which surface is "above" the grid) are color-only.
- **Classification:** **KEEP**.

### 2.9 Responsive behavior

- **1280×800:** Comfortable. Each button ≈ 200×110 px. Font at clamp max (18 px).
- **1024×600 (Tab A11):** Target. Each button ≈ 160×90 px. Grid fits tightly with gap-6px (v1.0.2 change).
- **800×600:** Still works; gap=6px padding=6px. Buttons ≈ 125×90.
- **Smaller:** Portrait warning kicks in at `@media (orientation: portrait)` → root hidden, `#portrait-warning` shown.
- **Classification:** **KEEP**. Portrait warning is a reasonable choice.
- **WEAKNESS — Portrait warning applies to caregivers too.** If a caregiver picks up the tablet to configure admin in portrait (they often will, because SMS apps default to portrait), the entire app is hidden with a "Putar perangkat ke landscape" message. No admin-only override. They must rotate just to enter admin.
- **Proposed fix:** Allow portrait for admin only. Requires refactoring — admin is inside the same DOM that's hidden in portrait. Alternative: add a discreet "Lewati" link under the portrait warning that unblocks the root but keeps a muted hint.

### 2.10 Performance

- **Bundle:** `423.67 kB JS → 126.34 kB gzipped` + `26.44 kB CSS → 5.79 kB gzipped`. **Under SPEC's 200 kB target.** PWA precache 1.83 MB (79 entries). Confirmed by `npm run build`.
- **Blob URLs:** Created + revoked in SymbolButton, PersonPhoto, WordImage, PhotoCropPreview, AddWord, AddPerson. All have `useEffect` cleanup pairs. Audit: I found no blob URL leaks in the components I read.
- **Audio:** AudioEngine preloads on first `preloadFromPaths` call. Core words not preloaded on app init — only on first tap. `audioEngine.play(id, label)` is called *after* `preloadFromPaths` in `useAudio.playWord:16-20`, so first tap of each word misses the pool, calls the audio from file (should load), then falls through to `fallbackTTS` if it rejects. Actually the flow creates `new Audio()` and calls `load()` — but `play()` is called synchronously, before `load()` completes. Mostly browsers will handle this (play waits for canPlay), but cold-start latency can be 100-300 ms.
- **IndexedDB on home:** useVocabulary fires 3 `useLiveQuery`s (folders, people, quickPhrases). Each is a table scan + sort. Dexie handles with IDB cursor. Runs on every mount + table invalidation. Home render = ~3 queries + ~0 if cached.
- **Classification:** **KEEP**. 3 queries is fine; 126 kB gzipped JS for a React 19 + Dexie + Fuse.js + OpenRouter client + Tailwind + Zustand + vite-pwa app is respectable.

### 2.11 Interaction physics

- **Tap target size:** 90 px target met per RESEARCH.md §5; smaller icons (44 px) in SentenceBar are at WCAG minimum.
- **Gesture budget:** long-press used for 3 things: admin (3s on bar), emergency (1.5s on bantu), modeling (2s on Bicara). Plus standard click for 4 icon toggles. Reasonable. No two gestures overlap spatially (bantu is in grid, Bicara is in bar, admin long-press is bar excluding child buttons — though see 2.2.1 note about propagation).
- **Scroll:** WordChip row scrolls horizontally; folder contents scroll is handled by pagination (lihat semua); Admin overlays scroll vertically. `scrollbar-hide` class removes scroll indicators (webkit + firefox). **WEAKNESS**: no scroll indicator means user can't see overflow in the chip row.

### 2.12 Copy / Bahasa Indonesia text

- **Classification:** **KEEP** overall.
- Tone is warm-and-practical throughout. OnboardingGuide section "Yang tidak boleh dilakukan" is excellent caregiver coaching.
- **Minor WEAKNESS — inconsistent capitalization in admin labels.** AdminHome uses `Wawasan Penggunaan` (Title Case); CLAUDE.md and SPEC.md use `Insight Penggunaan`. Live code wins, SPEC is behind.
- **Minor WEAKNESS — "Foto (opsional)" vs "Lewati foto".** Using "opsional" and "Lewati" in the same step is double-coded. "Lewati foto" alone is clearer.
- **Observation:** Error copy is sparse. `'Gagal membuat cadangan'` is fine but offers no next step. OpenRouter errors in VocabSuggestions are `'Terjadi kesalahan'` (generic). A parent can't debug.

### 2.13 Error handling

- **ErrorBoundary:** Wraps each major section in `App.tsx`. Good isolation — grid crash doesn't kill SentenceBar.
- **Fallback UI:** "Terjadi masalah kecil" + "Coba lagi" button. Warm, non-scary.
- **Audio failure:** `audioEngine.play` returns silent on rejection; `fallbackTTS` wrapped in try/catch. Silent failure is intended (speech must never throw).
- **IndexedDB failure:** `useVocabulary` uses `useLiveQuery` which returns undefined on failure; components handle `?? []`. Good.
- **OpenRouter 500:** `chatCompletion` (inferred behavior from callers — returns null on failure; components show generic error or fallback to joined words).
- **Camera permission denied:** `usePhotoCapture` uses `<input type="file">` with no explicit permission handling. On Android Chrome, tapping file input opens a picker; denial returns no file → resolve(null) → caller shows "photo skipped." Graceful.
- **Classification:** **KEEP**.
- **WEAKNESS — No error reporting.** `componentDidCatch` logs to console. No telemetry, no Sentry, no anything. For a production-ish personal deployment that's fine, but if something breaks on the tablet, the parent sees "Terjadi masalah kecil" and has no way to forward the stack to the developer.
- **Proposed fix (optional):** Add `navigator.serviceWorker.postMessage` to queue errors in IndexedDB, with an admin → "Diagnostik" card that lets a parent export the error log.

### 2.14 Data seeding & migrations

- **What:** `seedDatabase()` runs on every app launch. `runInitialSeed` on first install; `topUpSeedData` always. `src/lib/seed.ts`.
- **Classification:** **KEEP + MINOR REVIEW**.
- **KEEP:** Idempotent top-up is a good migration pattern. v1.0.1 got Pertanyaan folder + social phrases to existing installs without wipe.
- **REVIEW:** `topUpSeedData` has hardcoded logic for each sprint (Pertanyaan + social phrases). Each future sprint will add to this list until it becomes a massive conditional pile. Consider refactoring to a declarative schema with checked IDs.
- **Bug — `SEED_PEOPLE`:** `Ibu` has `initial: 'K'` and `Mbak` has `initial: 'M'`. Clearly wrong — should be `I` and `M`. Avatar circle will show "K" for Ibu. This is a trivial data bug. `src/data/vocabulary.ts:50-53`.

---

## 3. Cross-cutting observations

### 3.1 Logging pipeline is broken end-to-end (top finding)

No core tap is logged. `useUsageLog.logTap` is defined but never called from any component or hook. Search `grep -r "logTap" src/` returns only the definition file. Implication: frequency model, intent suggestions, milestone detection, dashboard word counts all depend on `db.usageEvents` which is **empty** in production. The code is effectively dark.

### 3.2 Spec-vs-code drift

- PeopleRow cap (4 per spec vs 6 in code).
- Admin card count (14 in SPEC / 11 in code).
- `VocabPackAdmin` toggles isActive but `FolderContents` ignores it.
- `lihat semua` doesn't switch to Lengkap pack.
- SEED_PEOPLE initials wrong.

All of these are cheap to fix (line-level), but their presence suggests SPEC.md and code are maintained independently.

### 3.3 Inherited-from-prototype tells

Several patterns look inherited from the Lovable prototype and never revisited:

- The 5-icon row in SentenceBar (equal visual weight for unequal function).
- `BottomSheet` close-on-outside-click only handles `mousedown`, not `touchstart` (on touch devices the outside-tap closes only after a mouse-event-compatible event fires — in Chrome Android this usually works via synthesized events, but it's fragile).
- `Dashboard.tsx` uses a different visual style (p-4, different chart shapes) than the main app — feels like a separate codebase region.

### 3.4 A11y is declarative but not interactive

`role="grid"` and `aria-label` are present everywhere. But:
- No `aria-rowindex` / `aria-colindex` on gridcells.
- No `focus-visible:` styling (mentioned above).
- No keyboard navigation (arrow keys don't move between cells).
- No screen reader live region for the sentence bar (chip changes aren't announced).

For the primary user this doesn't matter (she uses touch). For switch-access caregivers or screen-reader-assisted setups it's a real gap.

### 3.5 Haptic correctness

Haptic is consolidated to `SymbolButton.onPointerDown`. `useAudio.playWord` syncs `hapticLevel` to AudioEngine but does NOT fire (line 9-10, commented). Good.

However, `audioEngine.vibrate()` still exists (audio.ts:16-20) and can be called externally. Nobody calls it in the current tree, but it's a loaded gun.

### 3.6 Blob URL discipline

I audited every `URL.createObjectURL` call: SymbolButton, PhotoCropPreview, AddWord, AddPerson, PersonPhoto (in ManagePeople), WordImage (in EditWord). All have matching `useEffect` cleanup. ✓

One **risk**: `PhotoCropPreview.tsx:16` creates a URL directly in `useMemo` — cleanup in `useEffect`. If the component re-renders with a different blob, the old URL is revoked when the effect cleanup runs. If the blob is the same, `useMemo` returns the same URL. OK.

### 3.7 Z-index stacking

- `AdminOverlay`: z-[100]
- `SymbolSearch`: z-[90]
- `EmergencyBoard`: z-[95]
- `BottomSheet`: z-50
- PWA update toast: z-[200]

EmergencyBoard (95) sits below AdminOverlay (100). If admin is open and emergency fires, admin wins. Unrealistic but fragile.

---

## 4. Top 15 findings ranked by impact × effort

| # | Finding | Impact | Effort | Priority |
|---|---------|--------|--------|----------|
| 1 | Core taps never logged → entire analytics pipeline empty (2.1.6 / 3.1) | HIGH | LOW | **P0** |
| 2 | PeopleRow "Tambah" dead button, spec/code 4-vs-6 drift (2.1.3) | HIGH | LOW | **P0** |
| 3 | SEED_PEOPLE initials wrong (K for Ibu, M for Mbak) (2.14) | MED | VERY LOW | **P0** |
| 4 | "Panggil Ambulans" opens SMS not call; label mismatch (2.4.1) | HIGH | LOW | **P1** |
| 5 | Sentence auto-clears 1.5s after ▶ Bicara → can't re-speak (2.2.4) | HIGH | LOW | **P1** |
| 6 | VocabPackAdmin toggle is a no-op; silent feature (2.5.7) | MED | MED | **P1** |
| 7 | Admin entry has zero visible affordance; first-launch reveal missing (2.5.1) | HIGH | MED | **P1** |
| 8 | Fringe words don't use Fitzgerald Key colors (2.8.4) | MED | LOW | **P1** |
| 9 | No focus-visible styling / no keyboard nav (2.1.2, 3.4) | MED | LOW | **P2** |
| 10 | Undo backspace has no toast/affordance — silent feature (2.2.3) | MED | LOW | **P2** |
| 11 | Modeling mode amber ring too brief (500ms) (2.6) | MED | LOW | **P2** |
| 12 | No test-SMS button in Kontak Darurat admin (2.4.2) | MED | LOW | **P2** |
| 13 | Dashboard only reachable via URL param; no admin link (2.7) | LOW | VERY LOW | **P2** |
| 14 | `lihat semua` doesn't switch to Lengkap pack (2.1.5) | LOW | MED | **P3** |
| 15 | Portrait warning blocks admin too (2.9) | LOW | MED | **P3** |

Rationale for top 3:
- **#1** silently breaks 4 downstream features (frequency, milestones, insights, dashboard) that the whole spec depends on. One-line fix in `useSentenceBar.addWord`.
- **#2** is a user-visible broken button every day, plus documentation drift that will keep confusing contributors.
- **#3** is a data bug visible on every app launch for 2 out of 4 avatars.

---

## 5. Impact × Effort Heatmap (2×2)

```
                        IMPACT
                 LOW              HIGH
        ┌─────────────────┬──────────────────────┐
        │                 │  #1 Core-tap logging │
   LOW  │ #13 Dashboard   │  #2 PeopleRow drift  │
   EFFT │    admin link   │  #3 SEED_PEOPLE init │
        │                 │  #4 Ambulans call    │
        │                 │  #5 Auto-clear speak │
        │                 │  #8 Fringe FK colors │
        │                 │  #9 focus-visible    │
        │                 │  #10 Undo toast      │
        │                 │  #11 Modeling ring   │
        │                 │  #12 SMS test button │
        ├─────────────────┼──────────────────────┤
        │ #14 lihat-semua │  #6 VocabPack wiring │
   HIGH │     → Lengkap   │  #7 Admin discover-  │
   EFFT │ #15 Portrait    │      ability         │
        │     admin OK    │                      │
        └─────────────────┴──────────────────────┘
```

The "high impact / low effort" quadrant is packed — ship those first.

---

## 6. What I didn't check

- **Actual tablet behavior.** All findings are code-level. I did not boot the app on a Tab A11, time the tap → audio latency, verify haptic strength at each level, or check that landscape lock actually survives an Android back-button press on the physical device.
- **OpenRouter / Supabase integration.** I read the client wrappers but did not hit either API. Caregiver translation, vocab suggestions, milestone cloud sync are dark boxes beyond their client interfaces.
- **PWA update flow on live device.** Workbox config looks correct (autoUpdate + update toast in main.tsx), but I did not simulate an update cycle.
- **`sw.js` behavior.** Generated by Workbox; not inspected.
- **Security of OpenRouter key exposure.** SPEC.md §6 acknowledges it's public. I did not audit that the key can't be abused beyond the scoped quota.
- **IndexedDB schema integrity.** Dexie v3 migrations look fine; I did not simulate upgrade from v1 to v3 with pre-existing user data.
- **Fuse.js search quality.** I read the SymbolSearch component and saw it uses a `searchSymbols` helper, but I did not read `src/lib/search.ts` or evaluate recall/precision on Indonesian synonyms.
- **Performance on low-end Android.** Bundle size is fine, but I did not profile First Contentful Paint on a real Tab A11. Tailwind v4 is very new; runtime CSS-in-JS cost on old Chrome Android is uncharacterized.
- **Voice cloning (XTTS-v2).** Only a guide document; no implementation to audit.
- **Milestones detection logic.** I saw `checkForNewMilestones` is called from `useSentenceBar.speak`, but did not read `src/lib/milestones.ts` to evaluate whether the detection thresholds are reasonable.
- **Bigrams linguistic quality.** The 33 bigram entries look plausible but I did not evaluate whether they cover common toddler/preteen AAC patterns in Bahasa Indonesia vs. simply mirroring English AAC templates.
- **Fringe-word audio.** Core words have `audioPath` → `.mp3`. Fringe words in SEED_WORDS have no `audioPath` field, so they always fall through to TTS. Fine per SPEC but unreviewed.
- **Safe-area padding on actual notched devices.** `env(safe-area-inset-*)` is applied to body; I did not verify on devices with physical cutouts.

---

*End of audit. No code was modified during this investigation.*
