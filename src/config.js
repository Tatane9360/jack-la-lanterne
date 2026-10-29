// Toile en 960×540 : le texte reste net, le pixel art est dessiné à l'échelle PIXEL.
export const LARGEUR = 960
export const HAUTEUR = 540
export const PIXEL = 2
export const TUILE = 16 * PIXEL
export const VITESSE_JACK = 140
export const RAYON_LANTERNE = 112
export const POLICE = '"IM Fell English", Georgia, serif'
// Profondeurs d'affichage : le monde se trie par y (< 10 000), la nuit et l'interface passent au-dessus.
export const PROF = { NUIT: 10000, LUEUR: 10001, INTERFACE: 10002 }
