export const creerProgression = (ordre) => ({ ordre, faits: new Set() })
export const prochainLieu = (p) => p.ordre.find((id) => !p.faits.has(id)) ?? null
export const terminer = (p, id) => p.faits.add(id)
export const partieFinie = (p) => prochainLieu(p) === null
// Tout est ouvert, sauf le dernier lieu (la boutique) tant que les autres ne sont pas faits.
export const estAccessible = (p, id) =>
  id !== p.ordre.at(-1) || p.ordre.slice(0, -1).every((i) => p.faits.has(i))
