// Chaque maison a un délai avant d'éteindre sa lumière. Les maisons de `sorts` jettent un sort au lieu d'un bonbon.
export const creerRue = (delais, objectif, sorts = []) => ({ restants: [...delais], visitees: [], bonbons: 0, objectif, sorts, sort: false })
export const majRue = (r, dt) => ({ ...r, restants: r.restants.map((t) => Math.max(0, t - dt)) })

export function frapper(r, i) {
  if (r.restants[i] <= 0 || r.visitees.includes(i)) return r
  if (r.sorts.includes(i)) return { ...r, visitees: [...r.visitees, i], sort: true }
  return { ...r, visitees: [...r.visitees, i], bonbons: r.bonbons + 1 }
}

export function issueRue(r) {
  if (r.sort) return 'perdu'
  if (r.bonbons >= r.objectif) return 'gagne'
  const encore = r.restants.some((t, i) => t > 0 && !r.visitees.includes(i) && !r.sorts.includes(i))
  return encore ? null : 'perdu'
}
