// Chaque maison a un délai avant d'éteindre sa lumière.
export const creerRue = (delais, objectif) => ({ restants: [...delais], visitees: [], bonbons: 0, objectif })
export const majRue = (r, dt) => ({ ...r, restants: r.restants.map((t) => Math.max(0, t - dt)) })

export function frapper(r, i) {
  if (r.restants[i] <= 0 || r.visitees.includes(i)) return r
  return { ...r, visitees: [...r.visitees, i], bonbons: r.bonbons + 1 }
}

export function issueRue(r) {
  if (r.bonbons >= r.objectif) return 'gagne'
  const encore = r.restants.some((t, i) => t > 0 && !r.visitees.includes(i))
  return encore ? null : 'perdu'
}
