/**
 * next-best-job — Scoring Engine
 *
 * Takes a raw job listing and returns a score 0–100.
 * Score = 0 means disqualified (failed a must-have).
 * Score = 45 means passed must-haves, zero nice-to-haves matched.
 * Score = 100 means passed all must-haves + all nice-to-haves.
 *
 * Usage:
 *   const { score, reasons, voice, resumeTrack } = scoreJob(job, CRITERIA);
 */

function scoreJob(job, criteria) {
  const reasons = { pass: [], fail: [], bonus: [] };

  // ── 1. MUST-HAVES ──────────────────────────────────────────────────────────

  // Salary check
  const salary = extractSalary(job.salary || job.compensation || "");
  if (salary && salary < criteria.mustHave.minSalaryUSD) {
    reasons.fail.push(`Salary ${fmtSalary(salary)} below floor ${fmtSalary(criteria.mustHave.minSalaryUSD)}`);
    return { score: 0, reasons, disqualified: true, voice: null, resumeTrack: null };
  }
  if (salary) reasons.pass.push(`Salary ${fmtSalary(salary)} meets floor`);

  // Location check
  const locationStr = (job.location || job.jobLocation?.displayName || "").toLowerCase();
  const locationOk = criteria.mustHave.locations.some(l => locationStr.includes(l.toLowerCase()));
  if (!locationOk) {
    reasons.fail.push(`Location "${job.location}" not in target list`);
    return { score: 0, reasons, disqualified: true, voice: null, resumeTrack: null };
  }
  reasons.pass.push(`Location "${job.location}" is valid`);

  // AI core check — simple keyword scan on title + summary
  const text = ((job.title || "") + " " + (job.summary || "") + " " + (job.description || "")).toLowerCase();
  const aiKeywords = ["ai", "ml", "machine learning", "generative", "genai", "llm", "artificial intelligence", "nlp"];
  const aiMatch = aiKeywords.some(k => text.includes(k));
  if (criteria.mustHave.aiCoreTo_Role && !aiMatch) {
    reasons.fail.push("Role does not appear to be AI/ML focused");
    return { score: 0, reasons, disqualified: true, voice: null, resumeTrack: null };
  }
  if (aiMatch) reasons.pass.push("AI/ML keywords found in role");

  // ── 2. BASE SCORE ──────────────────────────────────────────────────────────
  // Passed all must-haves → start at 45
  let score = 45;

  // ── 3. NICE-TO-HAVES ───────────────────────────────────────────────────────
  const company = (job.company || job.companyName || "").toLowerCase();

  for (const nic of criteria.niceToHave) {
    let matched = false;

    if (nic.id === "tier1") {
      matched = nic.companies.some(c => company.includes(c.toLowerCase()));
    } else if (nic.id === "h1b") {
      matched = job.willingToSponsor === true ||
        text.includes("sponsor") || text.includes("h-1b") || text.includes("h1b");
    } else if (nic.id === "bonus") {
      matched = text.includes("bonus") && (text.includes("30,000") || text.includes("$30k") ||
        extractSalary(text) >= 30000);
    } else if (nic.id === "tuition") {
      matched = text.includes("tuition") || text.includes("education reimbursement") ||
        text.includes("learning stipend");
    } else if (nic.id === "latam") {
      matched = text.includes("latin america") || text.includes("latam") ||
        text.includes("latin american") || locationStr.includes("miami");
    }

    if (matched) {
      score += nic.points;
      reasons.bonus.push(`+${nic.points} pts: ${nic.label}`);
    }
  }

  score = Math.min(100, score);

  // ── 4. VOICE + RESUME TRACK ────────────────────────────────────────────────
  const voice = detectVoice(job, criteria);
  const resumeTrack = detectResumeTrack(job, criteria);

  return { score, reasons, disqualified: false, voice, resumeTrack };
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

function extractSalary(str) {
  if (!str) return null;
  // Handle ranges like "$180,000 - $220,000" → take the lower
  const matches = str.replace(/,/g, "").match(/\$?(\d{5,7})/g);
  if (!matches) return null;
  const nums = matches.map(m => parseInt(m.replace(/\$/g, "")));
  return Math.min(...nums);
}

function fmtSalary(n) {
  return "$" + (n / 1000).toFixed(0) + "K";
}

function detectVoice(job, criteria) {
  const text = ((job.title || "") + " " + (job.company || "")).toLowerCase();
  const startupSignals = ["startup", "series a", "series b", "early stage", "seed"];
  const isStartup = startupSignals.some(s => text.includes(s)) ||
    (job.companySize && job.companySize < 200);
  return isStartup ? "startup" : "enterprise";
}

function detectResumeTrack(job, criteria) {
  const title = (job.title || "").toLowerCase();
  if (title.includes("program manager") || title.includes("tpm") || title.includes("delivery")) {
    return "tpm";
  }
  if (title.includes("product manager") || title.includes(" pm ") || title.includes("cpo")) {
    return "aipm";
  }
  return "strategist";
}

// ── BATCH SCORER ─────────────────────────────────────────────────────────────

function scoreJobs(jobs, criteria) {
  return jobs
    .map(job => ({ job, ...scoreJob(job, criteria) }))
    .filter(r => !r.disqualified)
    .sort((a, b) => b.score - a.score);
}

if (typeof module !== 'undefined') {
  module.exports = { scoreJob, scoreJobs };
}
