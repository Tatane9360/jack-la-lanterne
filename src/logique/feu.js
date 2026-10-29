export const DUREE_FEU = 20          // secondes à tenir
const DEGAT = 0.25                   // un esprit qui touche le feu

export const creerFeu = () => ({ vie: 1, temps: 0 })
export const majFeu = (f, dt, touches) => ({ vie: Math.max(0, f.vie - touches * DEGAT), temps: f.temps + dt })
export const issueFeu = (f) => (f.vie <= 0 ? 'perdu' : f.temps >= DUREE_FEU ? 'gagne' : null)
