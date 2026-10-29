// Monde logique en 960×540, le pixel art est dessiné à l'échelle PIXEL.
// La toile est ZOOM fois plus grande et les caméras zooment d'autant : le texte reste lisse, le pixel art reste net.
export const LARGEUR = 960
export const HAUTEUR = 540
export const ZOOM = 2
export const ECRAN = { width: LARGEUR, height: HAUTEUR } // à utiliser à la place de scene.scale (qui vaut la toile)
export const PIXEL = 2
export const TUILE = 16 * PIXEL
export const VITESSE_JACK = 140
export const RAYON_LANTERNE = 112
export const POLICE = '"IM Fell English", Georgia, serif'
// Profondeurs d'affichage : le monde se trie par y (< 10 000), la nuit et l'interface passent au-dessus.
export const PROF = { NUIT: 10000, LUEUR: 10001, INTERFACE: 10002 }
