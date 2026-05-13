// Convert "Marcus Aurelius" → "marcus-aurelius"
export function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Convert "marcus-aurelius" → match against known author names
export function matchAuthor(slug, authors) {
  return authors.find(a => toSlug(a) === slug) ?? null
}

/*
 * Parse the assessment text produced by trait-assessor/SKILL.md.
 *
 * Expected format:
 *   **NEGATIVE TRAITS (VICES)**
 *   traitName (-score) - evidence
 *   ...
 *   **POSITIVE TRAITS (VIRTUES)**
 *   traitName (score) - evidence
 *   ...
 *   **AVERAGE CHARACTER SCORE: -51.0**
 *
 * Returns { traits: [{name, score}], avgScore, raw }
 * sorted by abs(score) desc; top 5 get rank 1-5, rest "NR".
 */
export function parseAssessment(text) {
  if (!text) return { traits: [], avgScore: null, raw: text }

  const traitRe = /^([A-Za-z &]+?)\s*\((-?\d+(?:\.\d+)?)\)\s*-/gm
  const avgRe   = /AVERAGE CHARACTER SCORE:\s*(-?\d+(?:\.\d+)?)/i

  const traits = []
  let m
  while ((m = traitRe.exec(text)) !== null) {
    traits.push({ name: m[1].trim(), score: parseFloat(m[2]) })
  }

  // Sort by abs(score) descending
  traits.sort((a, b) => Math.abs(b.score) - Math.abs(a.score))

  const ranked = traits.map((t, i) => ({
    ...t,
    rank: i < 5 ? String(i + 1) : 'NR',
  }))

  const avgMatch = avgRe.exec(text)
  const avgScore = avgMatch ? parseFloat(avgMatch[1]) : null

  return { traits: ranked, avgScore, raw: text }
}
