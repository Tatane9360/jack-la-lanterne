// Carte du village, en tuiles (index de TUILES dans art/sprites.js).
// Générée par code plutôt qu'à la main : plus facile à retoucher, taille toujours juste.
export const T = { SOL: 0, HERBE: 1, CHEMIN: 2, CHAMP: 3, PAVE: 4, ARBRE: 5, TOMBE: 6, CLOTURE: 7 }
export const BLOQUANTES = [T.ARBRE, T.TOMBE, T.CLOTURE]
export const LARGEUR_CARTE = 40
export const HAUTEUR_CARTE = 28

const c = Array.from({ length: HAUTEUR_CARTE }, (_, y) =>
  Array.from({ length: LARGEUR_CARTE }, (_, x) => ((x * 7 + y * 13) % 5 === 0 ? T.HERBE : T.SOL)))

const poser = (x, y, t) => { if (c[y]?.[x] !== undefined) c[y][x] = t }
const rect = (x, y, w, h, t) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) poser(i, j, t) }
const ligneH = (x1, x2, y, t) => rect(Math.min(x1, x2), y, Math.abs(x2 - x1) + 1, 1, t)
const ligneV = (x, y1, y2, t) => rect(x, Math.min(y1, y2), 1, Math.abs(y2 - y1) + 1, t)

// Bordure de forêt morte (deux rangs, le second clairsemé).
for (let x = 0; x < LARGEUR_CARTE; x++) for (let y = 0; y < HAUTEUR_CARTE; y++) {
  const bord = Math.min(x, y, LARGEUR_CARTE - 1 - x, HAUTEUR_CARTE - 1 - y)
  if (bord === 0 || (bord === 1 && (x * 3 + y * 5) % 4 === 0)) poser(x, y, T.ARBRE)
}

// Chemins : une grande allée (y = 16) qui relie tous les lieux.
ligneH(8, 35, 16, T.CHEMIN)
ligneV(8, 9, 16, T.CHEMIN)    // pierres
ligneV(8, 22, 24, T.CHEMIN); ligneH(8, 11, 24, T.CHEMIN); ligneV(11, 16, 24, T.CHEMIN)  // ferme (contourne le bâtiment)
ligneV(20, 9, 16, T.CHEMIN)   // chapelle
ligneV(35, 13, 16, T.CHEMIN)  // boutique
ligneV(30, 16, 22, T.CHEMIN)  // rue

// Ferme : champs labourés et clôture.
rect(2, 20, 4, 5, T.CHAMP); rect(12, 20, 4, 5, T.CHAMP)
ligneH(2, 5, 19, T.CLOTURE); ligneH(12, 15, 19, T.CLOTURE)

// Cimetière autour de la chapelle.
for (const [x, y] of [[15, 4], [16, 6], [15, 8], [17, 10], [24, 4], [25, 6], [24, 8], [23, 10], [13, 6], [26, 9]]) poser(x, y, T.TOMBE)

// Rue américaine pavée.
rect(22, 23, 17, 2, T.PAVE)

// Bosquets pour casser les grands vides.
for (const [x, y] of [[13, 13], [14, 13], [26, 12], [3, 13], [30, 5], [31, 6], [33, 4], [17, 22], [19, 25], [37, 20]]) poser(x, y, T.ARBRE)

export const CARTE = c

// Décors avec collision, posés par le bas (x, y en tuiles).
export const DECOR = [
  // Cercle de pierres de Samhain, ouvert vers le bas.
  ...[-150, -110, -70, -30, 10, 50, 130, 170].map((a) => ({
    cle: 'pierre', x: 8 + 2.6 * Math.cos((a * Math.PI) / 180), y: 6.2 + 2.2 * Math.sin((a * Math.PI) / 180),
  })),
  // Maisons de la rue américaine.
  ...[24, 28, 32, 36].map((x) => ({ cle: 'maison', x, y: 23 })),
]
export const DEPART = { x: 8, y: 23.5 }
