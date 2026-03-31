# Equipt Dashboard — Project Brief for Claude Code

## What This Project Is
A marketing operations dashboard for Equipt, a commercial gym equipment
installation and maintenance company based in Qatar and Dubai.
Built for Kosta Bouzopoulos (Marketing).

## Purpose
A standalone web app that tracks tasks, content plans, email actions,
and Drive folder links. It replaces a Claude.ai artifact and needs to
live as a fully deployable, polished website.

## Tech Stack
- React with Vite as the build tool
- Plain CSS (no Tailwind) — hand-crafted for full design control
- localStorage for saving task statuses
- Deployed via Vercel, version controlled on GitHub
- No external database, no backend — fully static

## Design Philosophy
Think Apple.com meets Rolex.com. Dark, luxurious, minimal, and precise.
Every element should feel intentional. Nothing cluttered, nothing cheap.
Lots of breathing room. Typography does the heavy lifting.
Subtle animations only — nothing flashy or distracting.

## Colour Palette

### Core Backgrounds
- Primary background:     #0A0A0A  (near black — base layer)
- Surface / cards:        #111111  (slightly lifted dark)
- Elevated surface:       #1A1A1A  (hover states, modals)
- Border:                 #222222  (subtle dividers)
- Border highlight:       #2E2E2E  (active/hover borders)

### Brand Accent Colours
- Rolex Green:            #006039  (primary brand accent)
- Rolex Green light:      #00784A  (hover state of green)
- Gold:                   #C9A84C  (premium highlight, headings, icons)
- Gold muted:             #A8893D  (secondary gold, subtext)
- Navy Blue:              #0D1F3C  (used for info states, backgrounds)
- Navy Blue light:        #1A3A6B  (navy hover, badges)

### Status Colours
- To Do:                  #555555  (muted grey)
- In Progress:            #C9A84C  (gold — active, in motion)
- Done:                   #006039  (Rolex green — complete, positive)
- Priority / Urgent:      #8B1A1A  (deep red — warning, not aggressive)

### Text
- Primary text:           #F0EDE8  (warm white — easier on eyes than pure white)
- Secondary text:         #999999  (muted descriptions)
- Muted text:             #555555  (placeholders, disabled)

## Typography
- Font family: SF Pro Display, Inter, -apple-system, sans-serif
- Headings: light weight (300–400), wide letter spacing (0.05em+)
- Body: regular weight (400), relaxed line height (1.6)
- Labels/badges: bold (700), tight letter spacing, uppercase, small size
- Load Inter from Google Fonts as fallback

## Layout & Spacing
- Max content width: 900px, centred
- Generous padding: 24px minimum on all sides
- Cards: subtle border, no heavy shadows — use border + slight bg lift
- Border radius: 8px for cards, 5px for buttons/badges, 3px for inputs
- Hover transitions: 150ms ease — fast and snappy, not sluggish

## Component Style Guide

### Navigation Tabs
- Horizontal tab bar below the header
- Active tab: Gold (#C9A84C) underline + gold text
- Inactive: muted grey text, no underline
- Badge showing done/total count per tab (e.g. 3/12)

### Task Cards
- Dark card (#111111) with a left border accent in the section colour
- Task label: warm white, semibold
- Note/description: muted grey, smaller font
- Status toggles: three small pill buttons (To Do / In Progress / Done)
- Active status pill is filled with its status colour
- Completed tasks: strikethrough label, card opacity 50%
- Priority badge: small, deep red, uppercase

### Buttons
- Primary (Generate Report): Gold background (#C9A84C), near-black text
  Hover: slightly brighter gold
- Secondary: transparent background, border in current accent colour
- All buttons: uppercase, bold, tight letter spacing, 8px border radius

### Progress Bar
- Thin (5px), full width, dark grey track
- Fill: Rolex green when under 100%, gold pulse when exactly 100%
- Percentage shown in gold next to bar

### Report Panel
- Slides open below the header when generated
- Dark green tinted background (#0A1F15)
- Border: Rolex green
- Monospace font for the report text (Courier, monospace)
- Copy button: gold, turns green with checkmark on success

## Structure — 5 Tabs

### 1. Day 1 Agenda (12 tasks)
Orientation checklist for first day onboarding.
Left border accent: Gold (#C9A84C)

### 2. Week 1 Content (10 posts)
Mon–Fri social media content plan with day + platform badges.
Left border accent: Navy Blue light (#1A3A6B)

### 3. Email Actions (5 items)
Follow-ups and email reviews needed.
Left border accent: Deep Red (#8B1A1A)

### 4. Tools & Access (7 items)
Software logins and tools needed to get set up.
Left border accent: Rolex Green (#006039)

### 5. Drive Quick Links (12 items)
Shortcuts to Google Drive folders — reference only, no status needed.
Left border accent: Gold muted (#A8893D)

## Key Features
- Status toggle on every task: To Do / In Progress / Done
- Overall progress bar at top (% complete across all tasks)
- Per-tab progress counter badge (done/total)
- Filter bar per tab: All / To Do / In Progress / Done
- Generate Report button — formatted text grouped by status,
  copyable to clipboard in one click
- All Drive links open in a new tab
- Auto-save to localStorage on every status change
- Storage key: equipt_statuses_v2 — NEVER change this key

## Animation & Interaction Details
- Card hover: border brightens slightly (150ms transition)
- Status button press: subtle scale down (0.97) on click
- Progress bar fill: smooth width transition (400ms)
- Report panel: slides down smoothly (200ms ease)
- Tab switch: instant — no transition needed
- Completed card: fades to 50% opacity (200ms)

## Header
- Top left: "EQUIPT" in gold, wide letter spacing, bold
  Subtitle: "Marketing Ops Dashboard" in muted grey
- Top right: Progress bar + percentage + Generate Report button
- Thin gold bottom border on header

## Footer
- Minimal one-line footer
- Left: "Equipt · Built to Perform · [current date]"
- Right: "[X/Y] tasks complete · Progress auto-saves"
- Both in muted grey, small font

## Design Inspiration
- Apple.com — breathing room, typography-led, premium feel
- Rolex.com — dark elegance, gold accents, nothing wasted
- Linear.app — clean task UI, subtle status colours, fast interactions
- Avoid: Bootstrap defaults, bright neons, heavy drop shadows,
  rounded pill shapes everywhere, stock SaaS blue (#2563EB everywhere)

## Rules for Claude Code
- Never change the localStorage key (equipt_statuses_v2)
- Keep all data hardcoded in the app — no external API calls
- All Google Drive links must open in a new tab (target="_blank")
- Do not add features that were not asked for
- Keep component files clean and commented
- After every change, remind the user to run:
  git add . && git commit -m "description" && git push
- Always check CLAUDE.md before starting any new task

## Brand Context
- Company: Equipt (equipt.shop / equipt.qa)
- Tagline: Built to Perform
- Industry: Commercial gym equipment supply, installation & maintenance
- Location: Doha, Qatar + Dubai, UAE
- Managing Partner: Ivan Kruger (ivan@equipt.shop)
- Head of Sales & Ops: Yazan Hammad (yazan@equipt.shop)
- Marketing: Kosta Bouzopoulos (kosta@equipt.qa)

## Current Status
Project freshly initialised. Only README.md exists.
No app code has been written yet.
Vercel is connected to this GitHub repo and will auto-deploy on every push.
Build the full app from scratch based on this brief. 