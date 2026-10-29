// Chaque emplacement du rayon attend un type d'objet.
export const creerRayon = (types) => types.map((type) => ({ type, plein: false }))

export function poser(rayon, i, type) {
  if (rayon[i].plein || rayon[i].type !== type) return { ok: false, rayon }
  return { ok: true, rayon: rayon.map((e, j) => (j === i ? { ...e, plein: true } : e)) }
}

export const rayonPlein = (rayon) => rayon.every((e) => e.plein)
