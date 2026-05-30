// Convert "Marcus Aurelius" → "marcus-aurelius"
export function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Convert "marcus-aurelius" → match against known author names
export function matchAuthor(slug, authors) {
  return authors.find(a => toSlug(a) === slug) ?? null
}

/*
 * Parse the JSON assessment produced by trait-assessor/SKILL.md.
 *
 * Expected shape:
 *   { negative_traits: [{trait, score, evidence}], positive_traits: [...], average_character_score }
 *
 * Returns { traits: [{name, score, rank}], avgScore }
 * sorted by abs(score) desc; top 5 get rank 1-5, rest "NR".
 */
export function parseAssessment(text) {
  if (!text) return { traits: [], avgScore: null }

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { traits: [], avgScore: null }
  }

  const all = [
    ...(parsed.negative_traits ?? []),
    ...(parsed.positive_traits ?? []),
  ].map(t => ({ name: t.trait, score: t.score }))

  all.sort((a, b) => Math.abs(b.score) - Math.abs(a.score))

  const traits = all.map((t, i) => ({ ...t, rank: i < 5 ? String(i + 1) : 'NR' }))

  return { traits, avgScore: parsed.average_character_score ?? null }
}
