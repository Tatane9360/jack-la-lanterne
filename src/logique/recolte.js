// Jauge de force en aller-retour 0 → 1 → 0, sur une période en secondes.
export function jauge(t, periode) {
  const p = (t / periode) % 1
  return p < 0.5 ? p * 2 : 2 - p * 2
}

// Trop mou : le navet résiste (on retente). Trop fort : les fanes cassent (navet perdu).
export const ZONE = { min: 0.62, max: 0.86 }
export const tirer = (force) => (force < ZONE.min ? 'resiste' : force > ZONE.max ? 'casse' : 'arrache')

export const creerRecolte = (navets, objectif) => ({ restants: navets, recoltes: 0, objectif })

export function recolter(r, resultat) {
  if (resultat === 'resiste') return r
  return { ...r, restants: r.restants - 1, recoltes: r.recoltes + (resultat === 'arrache') }
}

export function issueRecolte(r) {
  if (r.recoltes >= r.objectif) return 'gagne'
  return r.recoltes + r.restants < r.objectif ? 'perdu' : null
}
