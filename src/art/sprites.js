// Tous les sprites du jeu, décrits en chaînes de pixels (voir palette.js pour les lettres).

// --- Petits outils de dessin sur une grille de caractères ---
const grille = (w, h, c = '.') => Array.from({ length: h }, () => Array(w).fill(c))
const lignes = (g) => g.map((l) => l.join(''))
const miroir = (f) => f.map((l) => [...l].reverse().join(''))

function remplir(g, x, y, w, h, c) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (g[j]?.[i] !== undefined) g[j][i] = c
}
function cadre(g, x, y, w, h, c = 'k') {
  remplir(g, x, y, w, 1, c); remplir(g, x, y + h - 1, w, 1, c)
  remplir(g, x, y, 1, h, c); remplir(g, x + w - 1, y, 1, h, c)
}
// Toit triangulaire hachuré à l'encre, pointe en haut.
function toit(g, x, y, w, h) {
  const cx = x + w / 2
  for (let j = 0; j < h; j++) {
    const demi = Math.max(1, Math.round(((j + 1) / h) * (w / 2)))
    const a = Math.floor(cx - demi), b = Math.ceil(cx + demi) - 1
    for (let i = a; i <= b; i++) {
      const bord = i === a || i === b || j === h - 1
      if (g[y + j]?.[i] !== undefined) g[y + j][i] = bord || (i + j) % 3 === 0 ? 'k' : 'q'
    }
  }
}
function fenetre(g, x, y, c = 'o') {
  remplir(g, x, y, 5, 5, c); cadre(g, x, y, 5, 5)
  remplir(g, x + 1, y + 2, 3, 1, 'k'); remplir(g, x + 2, y + 1, 1, 3, 'k')
}
// Pose un motif (chaînes) sur une base ; '.' laisse voir la base.
function calque(base, motif, dx = 0, dy = 0) {
  const g = base.map((l) => [...l])
  motif.forEach((l, y) => [...l].forEach((c, x) => {
    if (c !== '.' && g[y + dy]?.[x + dx] !== undefined) g[y + dy][x + dx] = c
  }))
  return lignes(g)
}

// --- Jack : 16×16, 4 directions × 3 frames (pied gauche, neutre, pied droit) ---
const TETE = {
  face: [
    '...kkkkkkkk.....',
    '..kwwwwwwwwk....',
    '..kwkkwwkkwk....',
    '..kwkkwwkkwk....',
    '..kwwwkkwwwk....',
    '...kwkwwkwk.....',
    '....kkkkkk......',
  ],
  dos: [
    '...kkkkkkkk.....',
    '..kwwwwwwwwk....',
    '..kwwwwwwwwk....',
    '..kwwwwwwwwk....',
    '..kwwwwwwwwk....',
    '...kwwwwwwk.....',
    '....kkkkkk......',
  ],
  cote: [
    '...kkkkkkkk.....',
    '..kwwwwwwwwk....',
    '..kwwwwwkkwk....',
    '..kwwwwwkkwk....',
    '..kwwwwwwwwkk...',
    '...kwwwkwkwk....',
    '....kkkkkk......',
  ],
}
const CORPS = [
  '...oooooooo.....',
  '....kwwwwk......',
  '....kkwwkk......',
  '....kwwwwk......',
  '....kkkkkk......',
]
const ECHARPE = {
  face: { dy: 9, motif: ['...o............', '...o............'] },
  dos: { dy: 9, motif: ['......oo........', '.....o..o.......'] },
  cote: { dy: 8, motif: ['..o.............', '.oo.............'] },
}
const JAMBES = [
  ['.....w..w.......', '....kk..w.......', '........kk......'],
  ['.....w..w.......', '.....w..w.......', '....kk..kk......'],
  ['.....w..w.......', '.....w..kk......', '....kk..........'],
]
const LANTERNE = [
  '............vv..',
  '...........mmmmm',
  '..........wnynyn',
  '...........nnnnn',
  '...........nyyyn',
  '............nnn.',
]
const BALANCEMENT = [1, 0, 1]

function framesJack(vue) {
  const lanterne = vue === 'dos' ? LANTERNE.map((l) => l.replaceAll('y', 'n')) : LANTERNE
  return JAMBES.map((jambes, i) => {
    let f = lignes(grille(16, 16))
    f = calque(f, TETE[vue], 0, 1)
    f = calque(f, CORPS, 0, 8)
    f = calque(f, ECHARPE[vue].motif, 0, ECHARPE[vue].dy)
    f = calque(f, jambes, 0, 13)
    return calque(f, lanterne, 0, 7 + BALANCEMENT[i])
  })
}
const droite = framesJack('cote')
// Ordre des frames : bas 0-2, haut 3-5, gauche 6-8, droite 9-11.
export const JACK = [...framesJack('face'), ...framesJack('dos'), ...droite.map(miroir), ...droite]
export const DIRECTIONS = ['bas', 'haut', 'gauche', 'droite']

// --- Tuiles 16×16 ---
function sol(fond = 'p', tache = 'q') {
  const g = grille(16, 16, fond)
  for (const [x, y] of [[3, 5], [11, 2], [7, 12], [13, 10], [1, 14]]) g[y][x] = tache
  return lignes(g)
}
const HERBE = [
  '................', '...k.k..........', '....k.......k.k.', '.............k..',
  '................', '........k.k.....', '.........k......', '................',
  '..k.k...........', '...k.......k.k..', '............k...', '................',
  '......k.k.......', '.......k........', '................', '................',
]
const ARBRE = [
  '......k.....k...', '.k....k....k....', '..k...k...k.....', '...k..k..k...k..',
  '....k.k.k...k...', '.....kkk...k....', '......kk..k.....', '......kkkk......',
  '......kk........', '......kk........', '......kk........', '.....kkkk.......',
  '....kk..kk......', '...k......k.....', '................', '................',
]
const TOMBE = [
  '................', '................', '................', '.....kkkkk......',
  '....kqqqqqk.....', '....kqqkqqk.....', '....kqkkkqk.....', '....kqqkqqk.....',
  '....kqqkqqk.....', '....kqqqqqk.....', '....kqqqqqk.....', '....kqqqqqk.....',
  '...kkkkkkkkk....', '..k.k..k..k.k...', '................', '................',
]
const CLOTURE = [
  '................', '................', '................', '................',
  '..k....k....k...', '.kkk..kkk..kkk..', '.kqk..kqk..kqk..', 'kkkkkkkkkkkkkkkk',
  '.kqk..kqk..kqk..', '.kqk..kqk..kqk..', 'kkkkkkkkkkkkkkkk', '.kqk..kqk..kqk..',
  '.kkk..kkk..kkk..', '................', '................', '................',
]
function champ() {
  const g = grille(16, 16, 'p')
  for (let y = 1; y < 16; y += 4) { remplir(g, 0, y, 16, 1, 'q'); for (let x = y % 3; x < 16; x += 3) g[y + 1][x] = 'k' }
  return lignes(g)
}
function pave() {
  const g = grille(16, 16, 'q')
  for (let y = 0; y < 16; y += 4) {
    remplir(g, 0, y, 16, 1, 'k')
    for (let x = (y / 4) % 2 ? 0 : 4; x < 16; x += 8) remplir(g, x, y, 1, 4, 'k')
  }
  return lignes(g)
}

// Index des tuiles : l'ordre compte (carte.js s'en sert).
export const TUILES = [
  sol(), calque(sol(), HERBE), sol('q', 'p'), champ(), pave(),
  calque(sol(), ARBRE), calque(sol(), TOMBE), calque(sol(), CLOTURE),
]

// --- Bâtiments ---
function ferme() {
  const g = grille(40, 32)
  remplir(g, 28, 2, 3, 7, 'k')                         // cheminée
  toit(g, 2, 3, 36, 12)
  remplir(g, 5, 15, 30, 16, 'p'); cadre(g, 5, 15, 30, 16)
  for (let y = 17; y < 29; y += 3) for (let x = 7 + (y % 2) * 3; x < 34; x += 6) g[y][x] = 'q'
  remplir(g, 17, 21, 6, 10, 'k')                       // porte
  fenetre(g, 9, 19); fenetre(g, 26, 19)
  return lignes(g)
}
function chapelle() {
  const g = grille(36, 44)
  toit(g, 2, 18, 32, 10)                               // toit de la nef
  remplir(g, 4, 28, 28, 15, 'p'); cadre(g, 4, 28, 28, 15)
  remplir(g, 13, 12, 10, 17, 'p'); cadre(g, 13, 12, 10, 17)  // clocher
  toit(g, 12, 4, 12, 8)                                // flèche
  remplir(g, 17, 0, 2, 4, 'k'); remplir(g, 15, 1, 6, 1, 'k') // croix
  remplir(g, 16, 16, 4, 4, 'o'); cadre(g, 16, 16, 4, 4)
  remplir(g, 7, 31, 3, 6, 'o'); cadre(g, 7, 31, 3, 6)
  remplir(g, 26, 31, 3, 6, 'o'); cadre(g, 26, 31, 3, 6)
  remplir(g, 15, 34, 6, 9, 'k')                        // porte
  return lignes(g)
}
function maison(allumee) {
  const g = grille(28, 28)
  toit(g, 1, 1, 26, 10)
  remplir(g, 3, 11, 22, 16, 'p'); cadre(g, 3, 11, 22, 16)
  for (let y = 13; y < 26; y += 2) remplir(g, 4, y, 20, 1, 'q')  // planches
  fenetre(g, 5, 14, allumee ? 'o' : 'k'); fenetre(g, 18, 14, allumee ? 'o' : 'k')
  remplir(g, 11, 18, 6, 9, 'k')                        // porte
  remplir(g, 1, 26, 26, 2, 'k')                        // perron
  return lignes(g)
}
function boutique() {
  const g = grille(44, 32)
  remplir(g, 2, 6, 40, 25, 'p'); cadre(g, 2, 6, 40, 25)
  remplir(g, 0, 3, 44, 4, 'k')                         // corniche
  for (let x = 1; x < 43; x++) remplir(g, x, 8, 1, 4, Math.floor(x / 3) % 2 ? 'o' : 'p')  // auvent rayé
  remplir(g, 1, 12, 42, 1, 'k')
  remplir(g, 5, 15, 20, 12, 'o'); cadre(g, 5, 15, 20, 12)  // vitrine
  for (const x of [8, 14, 20]) { remplir(g, x, 22, 4, 3, 'k'); g[21][x + 1] = 'k' }  // citrouilles en vitrine
  remplir(g, 29, 15, 9, 15, 'k')                       // porte
  remplir(g, 31, 17, 5, 5, 'o')
  return lignes(g)
}

export const BATIMENTS = {
  ferme: [ferme()],
  chapelle: [chapelle()],
  maison: [maison(true), maison(false)],
  boutique: [boutique()],
}

// --- Objets ---
export const OBJETS = {
  pierre: [[
    '..kkkk..', '.kqqqqk.', '.kqpqqk.', '.kqqqqk.', '.kqqqpk.',
    '.kqqqqk.', '.kqpqqk.', '.kqqqqk.', 'kqqqqqqk', 'kkkkkkkk',
  ]],
  feu: [[
    '....o.....', '....oo....', '...oyo..o.', '..ooyo.oo.', '..oyyoooo.',
    '.ooyyyyoo.', '.oyyyyyyo.', '..oyyyyo..', '.kkkkkkkk.', 'k.k.kk.k.k',
  ], [
    '.....o....', '...oo.....', '..o.oyo...', '.oo.oyoo..', '.ooooyyoo.',
    '.ooyyyyoo.', '.oyyyyyyo.', '..oyyyyo..', '.kkkkkkkk.', 'k.k.kk.k.k',
  ]],
  esprit: [[
    '...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwwk.', '.kwkkwwkkwk.', '.kwkkwwkkwk.', '.kwwwwwwwwk.',
    '.kwwwkkwwwk.', '.kwwwwwwwwk.', '.kwwwwwwwwk.', '.kwwkwwkwwk.', '.kwk.kk.kwk.', '..k......k..',
  ], [
    '...kkkkkk...', '..kwwwwwwk..', '.kwwwwwwwwk.', '.kwkkwwkkwk.', '.kwkkwwkkwk.', '.kwwwwwwwwk.',
    '.kwwwkkwwwk.', '.kwwwwwwwwk.', '.kwwwwwwwwk.', '.kwwwwwwwwk.', '.kkwk..kwkk.', '...k....k...',
  ]],
  bonbon: [['kk.kkkk.kk', 'kokooookok', 'kokooookok', 'kk.kkkk.kk']],
  citrouille: [[
    '.....kv.....', '..kkkkkkkk..', '.koookooook.', 'kooyokooyook', 'koooookooook',
    'kooyyyyyyook', 'koooyooyoook', '.kooookoook.', '..kkkkkkkk..',
  ]],
  chapeau: [[
    '......k.....', '.....kk.....', '.....kkk....', '....kkkk....',
    '....kkkkk...', '...kooooook.', '...kkkkkkk..', 'kkkkkkkkkkkk',
  ]],
}
