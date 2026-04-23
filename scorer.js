/**
 * next-best-job — Scoring Engine
 *
 * Takes a raw job listing and returns a score 0–100.
 *
 * Score = 0   → disqualified (failed a must-have)
 * Score = 45  → passed all must-haves, zero nice-to-haves matched
 * Score = 100 → all must-haves + all nice-to-haves matched
 *
 * Usage:
 *   const { score, reasons, voice, resumeTrack } = scoreJob(job, CRITERIA);
 */

function scoreJob(job, criteria) {
  const reasons = { pass: [], fail: [], bonus: [] };

  // ── 1. MUST-HAVES — fail fast ─────────────────────────────────────────

  const salary = extractSalary(job.salary || job.compensation || "");
  if (salary && salary < criteria.mustHave.minSalaryUSD) {
    reasons.fail.push(`Salary ${fmt(salary)} below floor ${fmt(criteria.mustHave.minSalaryUSD)}`);
    return { score: 0, reasons, disqualified: true, voice: null, resumeTrack: null };
  }
  if (salary) reasons.pass.push(`Salary ${fmt(salary)} clears floor`);

  const loc = (job.location || job.jobLocation?.displayName || "").toLowerCase();
  const locOk = criteria.mustHave.locations.some(l => loc.includes(l.toLowerCase()));
  if (!locOk) {
    reasons.fail.push(`Location "${job.location}" not in target list`);
    return { score: 0, reasons, disqualified: true, voice: null, resumeTrack: null };
  }
  reasons.pass.push(`Location "${job.location}" valid`);

  const text = ((job.title || "") + " " + (job.summary || "") + " " + (job.description || "")).toLowerCase();
  const aiWords = ["ai", "ml", "machine learning", "generative", "genai", "llm", "artificial intelligence", "nlp"];
  if (criteria.mustHave.aiCoreToRole && !aiWords.some(w => text.includes(w))) {
    reasons.fail.push("Role not AI/ML focused");
    return { score: 0, reasons, disqualified: true, voice: null, resumeTrack: null };
  }
  reasons.pass.push("AI/ML keywords found");

  // ── 2. BASE SCORE ─────────────────────────────────────────────────────

  let score = 45;

  // ── 3. NICE-TO-HAVES ─────────────────────────────────────────────────

  const company = (job.company || job.companyName || "").toLowerCase();

  for (const nic of criteria.niceToHave) {
    let matched = false;

    if (nic.id === "tier1") {
      matched = (nic.companies || []).some(c => company.includes(c.toLowerCase()));
    } else if (nic.id === "workauth") {
      matched = text.includes("sponsor") || text.includes("work authoriz") ||
        text.includes("h-1b") || text.includes("h1b") || job.willingToSponsor === true;
    } else if (nic.id === "bonus") {
      matched = text.includes("bonus");
    } else if (nic.id === "tuition") {
      matched = text.includes("tuition") || text.includes("education reimbursement") ||
        text.includes("learning stipend");
    } else if (nic.id === "latam") {
      matched = text.includes("latin america") || text.includes("latam");
    }

    // Generic fallback for custom criteria added by the user
    if (!matched && nic.keywords) {
      matched = nic.keywords.some(k => text.includes(k.toLowerCase()));
    }

    if (matched) {
      score += nic.points;
      reasons.bonus.push(`+${nic.points} pts: ${nic.label}`);
    }
  }

  return {
    score: Math.min(100, score),
    reasons,
    disqualified: false,
    voice: detectVoice(job),
    resumeTrack: detectResumeTrack(job),
  };
}

// ── HELPERS ───────────────────────────────────────────────────────────────

function extractSalary(str) {
  if (!str) return null;
  const matches = str.replace(/,/g, "").match(/\$?(\d{5,7})/g);
  if (!matches) return null;
  return Math.min(...matches.map(m => parseInt(m.replace(/\$/g, ""))));
}

function fmt(n) {
  return "$" + (n >= 1000000 ? (n / 1000000).toFixed(1) + "M" : (n / 1000).toFixed(0) + "K");
}

function detectVoice(job) {
  const t = ((job.title || "") + " " + (job.company || "")).toLowerCase();
  return ["startup", "series a", "series b", "early stage", "seed"].some(s => t.includes(s))
    ? "startup" : "enterprise";
}

function detectResumeTrack(job) {
  const t = (job.title || "").toLowerCase();
  if (t.includes("program manager") || t.includes("tpm") || t.includes("delivery")) return "tpm";
  if (t.includes("product manager") || t.includes(" pm ")) return "aipm";
  return "strategist";
}

function scoreJobs(jobs, criteria) {
  return jobs
    .map(job => ({ job, ...scoreJob(job, criteria) }))
    .filter(r => !r.disqualified)
    .sort((a, b) => b.score - a.score);
}

if (typeof module !== "undefined") module.exports = { scoreJob, scoreJobs };
