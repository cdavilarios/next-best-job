# next-best-job

> An AI agent that scans job portals, scores roles against your criteria, and prepares application materials — built and actively used during my own job search.

**Live →** [cdavilarios.github.io/next-best-job](https://cdavilarios.github.io/next-best-job)

---

## What this is

I built this during my MBA job search (Cornell Tech → NYC AI roles, $180K+ target, June 15 deadline). Instead of manually scrolling job boards, I wrote an agent that does it for me and surfaces only the roles worth my time.

The architecture is simple enough to understand in an afternoon, powerful enough to run a real job search.

## Agent architecture

```
┌─────────────────────────────────────────────────────────┐
│                      next-best-job                       │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────────────┐  │
│  │  Scanner  │───▶│  Scorer  │───▶│ Materials Engine │  │
│  │          │    │          │    │                  │  │
│  │ Indeed   │    │ Weighted │    │ Resume tailor    │  │
│  │ Dice     │    │ criteria │    │ Cover letter gen │  │
│  │ Web      │    │ Must/nice│    │ Interview prep   │  │
│  └──────────┘    └──────────┘    └──────────────────┘  │
│                                           │              │
│                                  ┌────────▼───────┐     │
│                                  │    Tracker     │     │
│                                  │                │     │
│                                  │ Applied        │     │
│                                  │ Screening      │     │
│                                  │ Interview      │     │
│                                  │ Offer          │     │
│                                  └────────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### Stage 1 — Scanner
Pulls from Indeed and Dice APIs using MCP (Model Context Protocol) tool calls. Runs keyword searches across role types: TPM, AI PM, Enterprise AI Strategist, Strategic Projects.

### Stage 2 — Scorer
Each role is scored 0–100 against a weighted criteria set:

| Criterion | Type | Weight |
|---|---|---|
| NYC / hybrid ≤ 3x/week | Must-have | Disqualify if missing |
| Base salary ≥ $180K | Must-have | Disqualify if missing |
| No sponsorship required | Must-have | Disqualify if missing |
| AI/GenAI core to role | Must-have | Disqualify if missing |
| Tier 1 company | Nice-to-have | +15 pts |
| H-1B sponsorship offered | Nice-to-have | +15 pts |
| Bonus ≥ $30K | Nice-to-have | +10 pts |
| Tuition reimbursement | Nice-to-have | +10 pts |
| LATAM exposure | Nice-to-have | +5 pts |

### Stage 3 — Materials Engine
Two cover letter voices, selected per role type:
- **Enterprise delivery** — for big tech, financial services, consulting
- **Founder-operator** — for startups and early-stage companies

Resume track selected per role:
- TPM/Delivery track
- AI PM track
- Enterprise AI Strategist track

### Stage 4 — Tracker
Kanban pipeline: Applied → Screening → Interview → Offer. Encrypted in localStorage, never leaves the browser.

---

## How to run your own instance

### Prerequisites
- A GitHub account
- Basic comfort with copy/paste

### Steps

**1. Fork this repo**
Click "Fork" top-right → give it any name.

**2. Set your password**
Open `index.html`, find this line near the top of the `<script>` block:
```js
const PASSWORD_HASH = "YOUR_HASH_HERE";
```
Generate your hash:
```bash
echo -n "your-password" | sha256sum
```
Paste the hash value (without the trailing ` -`) into the file.

**3. Update your criteria**
Edit `src/criteria.js` — set your target salary, location, role types, and nice-to-haves.

**4. Enable GitHub Pages**
`Settings → Pages → Source: Deploy from branch → Branch: main → / (root) → Save`

Your site will be live at `https://yourusername.github.io/next-best-job` within a few minutes.

**5. (Optional) Connect Claude API for live job scanning**
In the private dashboard, paste your Anthropic API key in Settings. This enables the live agent — job scanning, scoring, and materials generation. The key is stored only in your browser and never sent anywhere except Anthropic's API.

---

## Privacy model

| What | Where | Who can see it |
|---|---|---|
| Agent code | GitHub (public) | Everyone |
| Scoring criteria | GitHub (public) | Everyone |
| Your applications | Browser localStorage | Only you |
| Your API key | Browser localStorage | Only you |
| Your password | Never stored — hash only | Nobody |
| Your real name/data | Not in this repo | Nobody |

---

## Tech stack

- **Frontend:** Vanilla HTML/CSS/JS — no framework, no build step, no npm
- **Job search:** Indeed API + Dice API via MCP
- **AI engine:** Claude API (Anthropic) — scoring, cover letter generation, interview prep
- **Auth:** SHA-256 password hash checked client-side
- **Storage:** Encrypted localStorage (no backend, no database)
- **Hosting:** GitHub Pages (free)

---

## What I learned building this

- MCP (Model Context Protocol) is the right abstraction for connecting LLMs to external APIs — cleaner than raw function calling
- Weighted scoring beats vibes — having explicit criteria forces you to be honest about what you actually want
- The materials generation is only as good as the role context you feed it — garbage in, garbage out
- Cover letter voice matters more than content — same bullet points, completely different reception

---

## About

Built by [Claudia Davila Rios](https://linkedin.com/in/claudavilarios) — CPO & co-founder of Sociate AI, Cornell Tech MBA '26, formerly AI TPM at Rimac Seguros and PM at Interbank. I built this to run my own job search systematically. Goal: 3 offers ≥ $180K in NYC by June 15, 2026.

---

*Job listings retrieved via AI-powered search. Verify all details directly with employers before applying.*
