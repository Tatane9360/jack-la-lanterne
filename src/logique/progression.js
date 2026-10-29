export const creerProgression = (ordre) => ({ ordre, faits: new Set() })
export const prochainLieu = (p) => p.ordre.find((id) => !p.faits.has(id)) ?? null
export const terminer = (p, id) => p.faits.add(id)
export const partieFinie = (p) => prochainLieu(p) === null
// Parcours strict : on ne peut entrer que dans les lieux faits (pour revoir) et dans le prochain.
export const estAccessible = (p, id) => p.faits.has(id) || id === prochainLieu(p)
// Force de la braise de Jack (facteur du rayon de lumière) : 70 % au départ, chaque lieu la ravive, 100 % à la fin.
export const braise = (p) => 0.7 + (0.3 * p.faits.size) / p.ordre.length
