/**
 * next-best-job — Scoring Criteria
 *
 * This is the PUBLIC version. It shows how the scoring engine works.
 * Fork this repo and edit these values to match your own profile.
 *
 * Your real criteria, pipeline, and applications live in your private
 * dashboard (encrypted localStorage) — nothing personal is in this file.
 */

const CRITERIA = {

  // ── MUST-HAVES ─────────────────────────────────────────────────────────
  // Any role that fails a must-have gets score = 0 and is not shown.

  mustHave: {
    minSalaryUSD: 180000,          // Set your salary floor
    locations: ["New York", "NYC", "Remote"],
    maxOfficeDaysPerWeek: 3,       // Hybrid ceiling
    fullTimeOnly: true,
    aiCoreToRole: true,            // AI/ML/GenAI must be central to the role
  },

  // ── NICE-TO-HAVES ──────────────────────────────────────────────────────
  // Each adds points. Base score = 45 (passed must-haves). Max = 100.

  niceToHave: [
    {
      id: "tier1",
      label: "Tier 1 company",
      description: "Top target companies — highest priority",
      points: 15,
      companies: ["Google", "Anthropic", "AWS", "Amazon", "Microsoft", "OpenAI", "DeepMind"],
    },
    {
      id: "workauth",
      label: "Work authorization support",
      description: "Company willing to support work authorization continuity",
      points: 15,
    },
    // Add your own nice-to-haves here — bonus threshold, tuition, location perks, etc.
    // Each one gets an id, label, description, and points value.
  ],

  // ── ROLE TYPES TO SCAN ─────────────────────────────────────────────────

  roleTypes: [
    "Technical Program Manager AI",
    "AI Product Manager",
    "Enterprise AI Strategist",
    "AI Deployment Manager",
    "Strategic Projects AI",
  ],

  // ── COVER LETTER VOICE ─────────────────────────────────────────────────

  coverLetterVoice: {
    enterprise: {
      label: "Enterprise delivery",
      useFor: ["big tech", "financial services", "consulting", "Fortune 500"],
      tone: "Expert operator — lead with cross-functional execution, scale, and reliability.",
    },
    startup: {
      label: "Founder-operator",
      useFor: ["startup", "early-stage", "Series A", "Series B"],
      tone: "Builder — lead with ownership, 0-to-1 experience, and comfort with ambiguity.",
    },
  },

  // ── RESUME TRACKS ──────────────────────────────────────────────────────

  resumeTracks: {
    tpm: {
      label: "TPM / Delivery Manager",
      bestFor: ["Technical Program Manager", "Delivery Manager"],
      emphasis: ["dependency mapping", "milestone tracking", "risk mitigation"],
    },
    aipm: {
      label: "AI Product Manager",
      bestFor: ["AI Product Manager", "Senior PM"],
      emphasis: ["0-to-1 product", "GenAI deployment", "roadmap ownership"],
    },
    strategist: {
      label: "Enterprise AI Strategist",
      bestFor: ["AI Strategist", "Strategic Projects"],
      emphasis: ["enterprise relationships", "AI deployment at scale"],
    },
  },
};

if (typeof module !== "undefined") module.exports = CRITERIA;
