/**
 * next-best-job — Scoring Criteria
 *
 * This file defines how roles are scored. Edit this to match your own
 * target profile. The agent uses these weights to rank every role it finds.
 *
 * Must-haves: disqualify any role that fails these.
 * Nice-to-haves: add points up to a max of 100.
 */

const CRITERIA = {

  // ── MUST-HAVES ─────────────────────────────────────────────────────────────
  // Any role that fails a must-have gets score = 0 and is not shown.

  mustHave: {
    minSalaryUSD: 180000,          // Base salary floor
    locations: ["New York", "NYC", "Remote"],
    maxOfficeDaysPerWeek: 3,       // Hybrid ceiling
    requiresNoSponsorship: true,   // L-2 EAD covers this; set false if you have H-1B
    aiCoreTo Role: true,           // Role must be AI/ML/GenAI focused
    fullTimeOnly: true,
  },

  // ── NICE-TO-HAVES ──────────────────────────────────────────────────────────
  // Each adds points to the score. Max total from nice-to-haves = 55.

  niceToHave: [
    {
      id: "tier1",
      label: "Tier 1 company",
      description: "Google, Anthropic, AWS, Microsoft, OpenAI",
      points: 15,
      companies: ["Google", "Anthropic", "AWS", "Amazon", "Microsoft", "OpenAI", "DeepMind"],
    },
    {
      id: "h1b",
      label: "H-1B sponsorship offered",
      description: "Company willing to sponsor H-1B after OPT",
      points: 15,
    },
    {
      id: "bonus",
      label: "Bonus ≥ $30K",
      description: "Annual performance bonus at or above $30,000",
      points: 10,
    },
    {
      id: "tuition",
      label: "Tuition reimbursement",
      description: "Company pays for continued education (~$150K)",
      points: 10,
    },
    {
      id: "latam",
      label: "LATAM market exposure",
      description: "Role involves Latin American market or clients",
      points: 5,
    },
  ],

  // ── ROLE TYPES ─────────────────────────────────────────────────────────────
  // What to search for. Add or remove as needed.

  roleTypes: [
    "Technical Program Manager AI",
    "AI Product Manager",
    "Enterprise AI Strategist",
    "AI Deployment Manager",
    "Strategic Projects AI",
  ],

  // ── COVER LETTER VOICE ─────────────────────────────────────────────────────
  // Determines tone of generated cover letters.

  coverLetterVoice: {
    enterprise: {
      label: "Enterprise delivery",
      useFor: ["big tech", "financial services", "consulting", "Fortune 500"],
      tone: "Expert operator — lead with cross-functional execution, scale, and reliability. 3 paragraphs, metrics-first.",
    },
    startup: {
      label: "Founder-operator",
      useFor: ["startup", "early-stage", "Series A", "Series B"],
      tone: "Builder — lead with ownership, 0-to-1 experience, and comfort with ambiguity. Show you'll run toward problems.",
    },
  },

  // ── RESUME TRACKS ──────────────────────────────────────────────────────────

  resumeTracks: {
    tpm: {
      label: "TPM / Delivery Manager",
      bestFor: ["Technical Program Manager", "Delivery Manager", "Engineering Program Manager"],
      emphasis: ["dependency mapping", "milestone tracking", "risk mitigation", "distributed team management"],
    },
    aipm: {
      label: "AI Product Manager",
      bestFor: ["AI Product Manager", "Senior PM", "Product Lead"],
      emphasis: ["0-to-1 product", "GenAI deployment", "user research", "roadmap ownership"],
    },
    strategist: {
      label: "Enterprise AI Strategist",
      bestFor: ["AI Strategist", "Strategic Projects", "Enterprise AI"],
      emphasis: ["enterprise relationships", "AI deployment at scale", "cross-functional influence"],
    },
  },
};

// Export for use in the agent
if (typeof module !== 'undefined') module.exports = CRITERIA;
