// Les 5 lieux, dans l'ordre du parcours.
// batiment : sprite posé par le bas au point (x, y) en tuiles. porte : où Jack déclenche le lieu.
// Textes : voir tâche 7 du plan (faits vérifiés).
export const LIEUX = [
  { id: 'ferme', nom: 'La ferme irlandaise', batiment: 'ferme', x: 8, y: 22, porte: { x: 8, y: 22 }, scene: 'Navet' },
  { id: 'samhain', nom: 'Le cercle de pierres', batiment: 'feu', x: 8, y: 7, porte: { x: 8, y: 7.5 }, scene: 'Feu' },
  { id: 'chapelle', nom: 'La chapelle', batiment: 'chapelle', x: 20, y: 9, porte: { x: 20, y: 9 }, scene: 'Anecdote' },
  { id: 'rue', nom: 'La rue américaine', batiment: null, porte: { x: 30, y: 23 }, scene: 'Portes' },
  { id: 'boutique', nom: "La boutique d'aujourd'hui", batiment: 'boutique', x: 35, y: 13, porte: { x: 35, y: 13 }, scene: 'Boutique' },
]
