# next-best-job

> An AI agent that scans job portals, scores roles against your criteria, and prepares application materials — built and actively used during a real job search.

**Live →** [cdavilarios.github.io/next-best-job](https://cdavilarios.github.io/next-best-job)

---

## What this is

Instead of manually scrolling job boards, this agent scans for you and surfaces only the roles worth your time. Configure your criteria once, run it daily.

The public page shows Fantasy Land sample data. Your real pipeline is password-protected and lives only in your browser — nothing private is in this repo.

## Agent architecture

```
┌──────────────────────────────────────────────────────────┐
│                      next-best-job                        │
│  ┌──────────┐    ┌──────────┐    ┌───────────────────┐  │
│  │  Scanner  │───▶│  Scorer  │───▶│  Materials Engine │  │
│  │ Indeed   │    │ Weighted │    │ Resume tailor     │  │
│  │ Dice     │    │ criteria │    │ Cover letter gen  │  │
│  └──────────┘    └──────────┘    └───────────────────┘  │
│                                            │              │
│                                   ┌────────▼───────┐     │
│                                   │    Tracker     │     │
│                                   │ Applied→Offer  │     │
│                                   └────────────────┘     │
└──────────────────────────────────────────────────────────┘
```

### Stage 1 — Scanner
Pulls from Indeed and Dice APIs via MCP (Model Context Protocol) tool calls across your configured role types.

### Stage 2 — Scorer
Each role scored 0–100 against weighted criteria in `src/criteria.js`. Must-haves disqualify. Nice-to-haves add points.

### Stage 3 — Materials Engine
Cover letter voice auto-selected per role type via Claude API:
- **Enterprise delivery** — big tech, financial services, consulting
- **Founder-operator** — startups, early-stage companies

### Stage 4 — Tracker
Kanban: Applied → Screening → Interview → Offer. Encrypted in localStorage, never leaves the browser.

---

## Privacy model

| What | Visible to |
|---|---|
| Agent source code | Everyone (public) |
| Fantasy Land sample data | Everyone (it's fake) |
| Your real applications | Only you (encrypted localStorage) |
| Your real criteria | Only you (private dashboard) |
| Your API key | Only you (never leaves browser) |
| Your password | Nobody (SHA-256 hash only, never stored) |

---

## Run your own instance

1. **Fork this repo**
2. **Set your password** — open `index.html`, find `PASSWORD_HASH`, replace:
   ```bash
   echo -n "yourpassword" | shasum -a 256   # macOS
   echo -n "yourpassword" | sha256sum        # Linux
   ```
3. **Edit `src/criteria.js`** — set your real salary floor, locations, role types
4. **Enable GitHub Pages** — Settings → Pages → Deploy from branch → main → / (root)
5. **Add Claude API key** — private dashboard → Settings → enables AI Generate

---

## Tech stack

- Vanilla HTML/CSS/JS — no framework, no build step, no npm
- Indeed + Dice APIs via MCP for job search
- Claude API (Anthropic) for cover letter generation and interview prep
- SHA-256 client-side auth
- Encrypted localStorage for private pipeline data
- GitHub Pages hosting (free)

---

## What I learned building this

- MCP is the right abstraction for connecting LLMs to external APIs
- Weighted scoring beats vibes — explicit criteria forces honesty about what you actually want
- Cover letter voice matters more than content
- The materials engine is only as good as the context you feed it

---

*Fantasy Land roles are fictional. Real job listings retrieved via AI-powered search — verify all details with employers before applying.*
