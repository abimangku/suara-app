# How to Build an AAC App for Your Child — Parent Guide

> **Reading time:** 10 minutes
> **Build time:** 2-4 hours (with AI coding assistant)
> **Technical skill required:** None. The AI writes the code. You answer questions about your child.

---

## What is this?

This guide walks you through building a **personal communication app** for your non-speaking child using AI coding tools. The app runs on a tablet — your child taps picture buttons to build sentences, and the tablet speaks them aloud.

This type of app is called **AAC** (Augmentative and Alternative Communication). Commercial AAC apps exist, but most are expensive (USD 100-500), English-first, and don't support Bahasa Indonesia or other Southeast Asian languages well.

With this guide, you can build one yourself — for free — customized specifically for YOUR child's vocabulary, family, and daily life.

**You don't need to know how to code.** An AI coding assistant (Claude Code) writes all the code. Your job is to answer questions about your child — their name, their family, their favorite foods, what they need to say every day. Nobody knows your child better than you.

---

## What you'll need

### Required
| What | Why | Cost |
|---|---|---|
| A computer (laptop or desktop) | Claude Code runs in a terminal on your computer | You probably have one |
| Claude Code subscription | The AI that builds the app | ~USD 20/month at claude.ai/code (you can cancel after building) |
| A tablet for your child | Where the app runs — Android recommended, 10-inch | USD 100-300 (Samsung Tab A series works great) |
| Vercel account | Free hosting for the app | Free at vercel.com |
| Node.js installed | Required for Claude Code and the build tools | Free at nodejs.org |

### Recommended (not required)
| What | Why |
|---|---|
| A speech-language pathologist (SLP) | Can advise on which words to include — especially helpful for the core vocabulary |
| Photos of family members | The app can show real faces instead of generic icons |
| Photos of real food/objects | "Nasi goreng" with a photo of YOUR nasi goreng is more meaningful than a generic icon |

---

## Step-by-step guide

### Step 1: Install Claude Code on your computer

Open your computer's terminal (on Mac: search "Terminal" in Spotlight; on Windows: search "Command Prompt" or "PowerShell") and type:

```
npm install -g @anthropic-ai/claude-code
```

If this fails with a "npm not found" error, you need Node.js first:
- Go to https://nodejs.org
- Download and install the LTS version
- Restart your terminal
- Try the command above again

### Step 2: Create a project folder

In the terminal:
```
mkdir aac-app
cd aac-app
```

### Step 3: Copy the build brief

Copy the file `AAC-BUILD-BRIEF.md` from this kit into your project folder. **Rename it to `CLAUDE.md`**:

```
cp /path/to/AAC-BUILD-BRIEF.md CLAUDE.md
```

Or simply: open `AAC-BUILD-BRIEF.md` in any text editor, select all, copy, create a new file called `CLAUDE.md` in your `aac-app` folder, paste, save.

**Why CLAUDE.md?** Claude Code automatically reads this file when it starts. It's the instruction manual that tells the AI what to build and how.

### Step 4: Start Claude Code

In the terminal, while inside your `aac-app` folder:
```
claude
```

Claude Code starts. Type this as your first message:

> **"Read CLAUDE.md and help me build an AAC app for my child. Start by asking me the discovery questions."**

### Step 5: Answer questions about your child

Claude will ask you ~18 questions about your child — their name, age, communication level, family members, daily routines, favorite things, the tablet you're using, etc.

**Answer honestly and in detail.** These answers determine what the app looks and feels like. There are no wrong answers — you know your child best.

**Tips for answering:**
- If Claude asks something you're not sure about (like "which core vocabulary words"), say: **"I'm not sure, recommend what's best based on research."** Claude has the research built in.
- If you have an SLP, mention their recommendations.
- If your child has sensory sensitivities (hates loud sounds, prefers dim screens, dislikes vibration), tell Claude — the app can be configured for all of these.

### Step 6: Watch Claude build — test after each phase

Claude builds in 6 phases. After each phase, it will say something like "Phase 1 complete — test it now." At that point:

1. Claude will start a local server (usually at `http://localhost:5173`)
2. Open that URL in your computer's browser
3. Try tapping buttons, building sentences, hearing speech
4. Tell Claude if anything looks wrong, sounds wrong, or feels wrong
5. Once you're happy, say "continue to the next phase"

**The 6 phases:**
1. **Grid + buttons** — you see the symbol grid, can tap and hear words
2. **Data + offline** — app stores data, works without internet
3. **Admin panel** — you can add words/people/photos behind a PIN
4. **Smart features** — word predictions, search (optional)
5. **Cloud features** — usage tracking, parent dashboard (optional)
6. **Polish** — install on tablet, fullscreen, orientation lock

### Step 7: Deploy to the internet

When all 6 phases are done, tell Claude:

> **"Help me deploy this to Vercel."**

Claude will:
1. Ask you to create a free Vercel account (if you haven't)
2. Run the deploy command
3. Give you a URL like `https://your-app-name.vercel.app`

This URL is where the app lives. You'll open it on the tablet next.

### Step 8: Install on the tablet

1. Open Chrome on the tablet
2. Go to your app's URL
3. **Wait 5-10 seconds** for the page to fully load
4. A blue banner should appear at the top: **"Install [App Name]"** — tap **Install**
5. If no banner appears: tap Chrome's menu (⋮) → look for **"Install app"** (NOT "Add to Home screen")
6. Open the app from the tablet's app drawer (not Chrome)
7. Verify: no Chrome URL bar, full screen, landscape orientation

### Step 9: Set up kiosk mode (recommended)

To prevent your child from accidentally leaving the app:

1. Settings → Security → Pin windows → enable
2. Open the app
3. Overview button (recent apps) → tap the app icon → "Pin this app"
4. Now the tablet is locked to the app
5. To exit: hold Back + Overview buttons for 2 seconds

### Step 10: Start communicating

The app is ready. Here's how to introduce it:

1. **Model first, expect later.** Tap buttons yourself while talking to your child. Show them that tapping = speaking. Research says 30 models per 15-minute session is effective (Binger & Light, 2007).
2. **Don't test them.** Never say "what's this? tap it!" Use the app alongside natural speech.
3. **Celebrate any tap.** Even accidental taps are communication attempts.
4. **Add new words as they need them.** Open admin (gear icon or long-press the sentence bar), enter your PIN, add words with real photos.

---

## After the app is built

### Adding new words
Admin (⚙️) → Add Word → take photo → type label → pick folder → save.

### Adding new people
Admin (⚙️) → Manage People → + Add → photo → name → save.

### Changing names
Admin (⚙️) → Manage People → pencil icon → edit → save.

### Replacing icons with real photos
Admin (⚙️) → Manage Words → pick folder → tap the image → pick new photo.

### Backing up
Admin (⚙️) → Backup → Export. Save the JSON file somewhere safe. If the tablet breaks, you can restore from this file.

### Updating the app
If you want new features later:
1. Open Claude Code on your computer
2. Navigate to your `aac-app` folder
3. Describe what you want: "Add a new folder for school vocabulary" or "Make the buttons bigger"
4. Claude makes the changes
5. Deploy again: `vercel deploy --prod`

---

## Troubleshooting

| Problem | Solution |
|---|---|
| "No sound" | Check tablet's media volume (press volume up while app is open). If still silent, close the app completely (swipe away from recent apps) and reopen. |
| "Chrome bar showing on top" | The app was bookmarked, not installed. Remove the icon, go back to the URL in Chrome, wait for the Install banner, tap Install. |
| "Buttons too small" | Tell Claude Code: "The buttons are too small on my [tablet model]. The screen is [X × Y] pixels. Make them bigger." |
| "Words in wrong language" | Tell Claude Code: "Change the TTS language to [your language code]." Common codes: `id-ID` (Indonesian), `ms-MY` (Malay), `en-US` (English). |
| "App disappeared" | It may have been uninstalled. Re-open the URL in Chrome and install again. Your data might be gone — restore from backup if you have one. |
| "Want to add a feature" | Open Claude Code, describe what you want in plain language. Claude will implement it. |

---

## Important notes

- **This is not a replacement for therapy.** This app is a communication TOOL. Work with your child's therapist to integrate it into their communication plan.
- **Your child's data stays on the tablet.** Nothing is sent to any server unless you explicitly set up cloud sync (Phase 5, which is optional).
- **The app is free to run.** Vercel free tier, ARASAAC symbols are free (with attribution), browser TTS is free. The only cost is the Claude Code subscription during the build phase.
- **You own everything.** The code, the data, the app — it's yours. No subscription, no vendor lock-in, no company that can shut it down.

---

## Credits and attribution

- **ARASAAC pictograms** — free symbols by the Government of Aragón, Spain. Licensed CC BY-NC-SA 3.0. https://arasaac.org
- **Research foundation** — see the bibliography in `AAC-BUILD-BRIEF.md` for the full list of studies that inform this guide.
- **Inspired by** families who build what doesn't exist for their children.

---

## Legal disclaimer

**THIS GUIDE IS PROVIDED "AS IS" FOR EDUCATIONAL AND INFORMATIONAL PURPOSES ONLY.**

This is a technical build guide created by a parent, not a medical professional. It is not medical advice, not a medical device, and not a regulated product. Any application built using this guide is a personal tool — it has not been evaluated or approved by any regulatory body.

The author provides no warranty and accepts no liability for any outcomes arising from the use of this guide or applications built from it. Consult a qualified speech-language pathologist for clinical decisions about your child's communication needs.

This guide references third-party services (Claude Code, Vercel, ARASAAC, etc.). The author has no affiliation with these services.

**By using this guide, you acknowledge these terms.**

---

*Built by a parent. Shared so other parents don't have to start from zero.*
