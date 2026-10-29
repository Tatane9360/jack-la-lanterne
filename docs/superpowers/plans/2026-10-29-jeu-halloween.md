# Plan d'implémentation : jeu Halloween (Jack et la lanterne)

> **Pour l'exécutant :** suivre les tâches dans l'ordre, cocher chaque case. Une tâche = un commit.
> Source de vérité : `design.md` (à la racine). En cas de conflit, `design.md` gagne.

**But :** un petit jeu web 2D vu de dessus (5 à 10 min) où Jack, un mini-squelette à lanterne en navet, éclaire un village sombre et découvre l'histoire d'Halloween à travers 5 lieux, 4 mini-jeux et une scène calme.

**Architecture :** code modulaire en ES modules. Toute la logique de jeu testable (progression, règles des mini-jeux, joystick) vit dans `src/logique/`, sans dépendance à Phaser, et se teste avec `node --test`. Le rendu, les scènes et les entrées vivent dans `src/scenes/` et `src/ui/`. Les textes et données dans `src/data/`. Les sprites sont dessinés en code (`src/art/`), aucun fichier image n'est requis pour jouer.

**Stack :** pnpm (jamais npm), Vite (serveur de dev + build statique), Phaser 3 (scènes, physique Arcade, tilemap, tactile), Web Audio (son d'ambiance généré en code), `node --test` (tests, rien à installer).

---

## Arborescence cible

```
jeux-haloween/
├── package.json          # scripts pnpm : dev, build, preview, test
├── vite.config.js        # base './' pour un hébergement statique
├── index.html
├── src/
│   ├── main.js           # config Phaser + liste des scènes
│   ├── config.js         # constantes (tailles, vitesses, rayon lanterne)
│   ├── son.js            # ambiance Web Audio
│   ├── data/
│   │   ├── lieux.js      # 5 lieux : position, scène, anecdote, phrase récap
│   │   └── carte.js      # carte du village en chaînes ASCII
│   ├── logique/          # PUR : aucune importation de Phaser
│   │   ├── progression.js
│   │   ├── joystick.js
│   │   ├── navet.js
│   │   ├── feu.js
│   │   ├── portes.js
│   │   └── boutique.js
│   ├── art/
│   │   ├── palette.js
│   │   ├── pixels.js     # chaînes de pixels → texture Phaser
│   │   └── sprites.js    # Jack, tuiles, bâtiments, objets
│   ├── ui/
│   │   ├── lumiere.js    # nuit + trou de lanterne
│   │   ├── joystick.js   # joystick tactile (affichage + pointeur)
│   │   └── bulle.js      # bulle de texte de Jack
│   └── scenes/
│       ├── Boot.js       # génère toutes les textures
│       ├── Titre.js
│       ├── Village.js
│       ├── Anecdote.js   # sert aussi de scène calme (chapelle)
│       ├── Recap.js
│       └── minijeux/
│           ├── finir.js  # sortie commune des mini-jeux
│           ├── Navet.js
│           ├── Feu.js
│           ├── Portes.js
│           └── Boutique.js
└── test/
    └── logique.test.js
```

Règle de modularité : un module = une responsabilité. Les scènes importent `logique/` et `data/`, jamais l'inverse.

---

### Tâche 1 : Socle du projet

**Fichiers :** créer `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/config.js`, `src/scenes/Boot.js`, `.gitignore`.

- [ ] **1.1** Initialiser :

```bash
git init
pnpm init
pnpm add phaser
pnpm add -D vite
```

- [ ] **1.2** `package.json` : ajouter `"type": "module"` et les scripts :

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "node --test test/"
}
```

- [ ] **1.3** `vite.config.js` :

```js
export default { base: './' }
```

- [ ] **1.4** `.gitignore` : `node_modules/` et `dist/`.

- [ ] **1.5** `index.html` : fond `#0b0705`, `<div id="jeu"></div>`, police Google Fonts « IM Fell English » (ton vieux livre de contes), `<script type="module" src="/src/main.js">`. Meta viewport sans zoom et `touch-action: none` sur `body` (pas de zoom ni de scroll pendant le jeu).

- [ ] **1.6** `src/config.js` :

```js
export const LARGEUR = 480
export const HAUTEUR = 270
export const TUILE = 16
export const VITESSE_JACK = 70
export const RAYON_LANTERNE = 56
export const POLICE = '"IM Fell English", Georgia, serif'
```

- [ ] **1.7** `src/main.js` : `new Phaser.Game({ type: AUTO, parent: 'jeu', width: LARGEUR, height: HAUTEUR, pixelArt: true, backgroundColor: '#0b0705', physics: { default: 'arcade' }, scale: { mode: FIT, autoCenter: CENTER_BOTH }, scene: [Boot] })`. Attendre `document.fonts.load('16px "IM Fell English"')` avant de créer le jeu.

- [ ] **1.8** `src/scenes/Boot.js` : scène vide qui affiche « Boot OK » au centre.

- [ ] **1.9** Vérifier : `pnpm dev`, ouvrir l'URL, le texte s'affiche, la fenêtre se redimensionne sans déformer.

- [ ] **1.10** Commit : `chore: socle pnpm + vite + phaser`.

---

### Tâche 2 : Logique pure et tests

**Fichiers :** créer les 6 modules de `src/logique/` et `test/logique.test.js`.

- [ ] **2.1** Écrire d'abord le test (il doit échouer) :

```js
// test/logique.test.js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { creerProgression, prochainLieu, estAccessible, terminer, partieFinie } from '../src/logique/progression.js'
import { vecteurJoystick } from '../src/logique/joystick.js'
import { visageFini } from '../src/logique/navet.js'
import { creerFeu, majFeu, issueFeu, DUREE_FEU } from '../src/logique/feu.js'
import { creerRue, majRue, frapper, issueRue } from '../src/logique/portes.js'
import { creerRayon, poser, rayonPlein } from '../src/logique/boutique.js'

test("progression : guidée, boutique verrouillée jusqu'à la fin", () => {
  const p = creerProgression(['ferme', 'samhain', 'chapelle', 'rue', 'boutique'])
  assert.equal(prochainLieu(p), 'ferme')
  assert.equal(estAccessible(p, 'rue'), true)
  assert.equal(estAccessible(p, 'boutique'), false)
  for (const id of ['ferme', 'samhain', 'chapelle', 'rue']) terminer(p, id)
  assert.equal(estAccessible(p, 'boutique'), true)
  terminer(p, 'boutique')
  assert.equal(partieFinie(p), true)
})

test('joystick : borné au rayon, nul dans la zone morte', () => {
  assert.deepEqual(vecteurJoystick(2, 1, 24), { x: 0, y: 0 })
  assert.deepEqual(vecteurJoystick(100, 0, 24), { x: 1, y: 0 })
})

test('navet : il faut deux yeux et une bouche', () => {
  assert.equal(visageFini([{ x: .33, y: .4 }, { x: .67, y: .4 }]), false)
  assert.equal(visageFini([{ x: .33, y: .4 }, { x: .67, y: .4 }, { x: .5, y: .7 }]), true)
})

test("feu : gagné si le feu tient jusqu'au bout, perdu s'il s'éteint", () => {
  assert.equal(issueFeu(majFeu(creerFeu(), DUREE_FEU, 0)), 'gagne')
  let g = creerFeu()
  for (let i = 0; i < 5; i++) g = majFeu(g, 0.1, 1)
  assert.equal(issueFeu(g), 'perdu')
})

test('portes : frapper une maison allumée donne un bonbon, éteinte non', () => {
  let r = creerRue([5, 1], 2)
  r = majRue(r, 2)                    // la maison 1 s'éteint
  r = frapper(r, 1)
  assert.equal(r.bonbons, 0)
  r = frapper(r, 0)
  assert.equal(r.bonbons, 1)
  assert.equal(issueRue(r), 'perdu')  // plus de maison allumée à visiter, objectif raté
})

test('boutique : un objet va sur son étagère', () => {
  let r = creerRayon(['citrouille', 'bonbon'])
  assert.equal(poser(r, 0, 'bonbon').ok, false)
  r = poser(r, 0, 'citrouille').rayon
  r = poser(r, 1, 'bonbon').rayon
  assert.equal(rayonPlein(r), true)
})
```

- [ ] **2.2** `pnpm test` → échec attendu (modules absents).

- [ ] **2.3** Implémenter :

```js
// src/logique/progression.js
export const creerProgression = (ordre) => ({ ordre, faits: new Set() })
export const prochainLieu = (p) => p.ordre.find((id) => !p.faits.has(id)) ?? null
export const terminer = (p, id) => p.faits.add(id)
export const partieFinie = (p) => prochainLieu(p) === null
// Tout est ouvert, sauf le dernier lieu (la boutique) tant que les autres ne sont pas faits.
export const estAccessible = (p, id) =>
  id !== p.ordre.at(-1) || p.ordre.slice(0, -1).every((i) => p.faits.has(i))
```

```js
// src/logique/joystick.js
const ZONE_MORTE = 4
// Écart du doigt → vecteur de norme ≤ 1.
export function vecteurJoystick(dx, dy, rayon) {
  const d = Math.hypot(dx, dy)
  if (d < ZONE_MORTE) return { x: 0, y: 0 }
  const force = Math.min(d, rayon) / rayon
  return { x: (dx / d) * force, y: (dy / d) * force }
}
```

```js
// src/logique/navet.js — coordonnées normalisées 0..1 sur le navet
export const ZONES = {
  oeilG: { x: .33, y: .4, r: .12 },
  oeilD: { x: .67, y: .4, r: .12 },
  bouche: { x: .5, y: .7, r: .18 },
}
export const zonesTouchees = (pts) => Object.keys(ZONES).filter((k) =>
  pts.some((p) => Math.hypot(p.x - ZONES[k].x, p.y - ZONES[k].y) <= ZONES[k].r))
export const visageFini = (pts) => zonesTouchees(pts).length === Object.keys(ZONES).length
```

```js
// src/logique/feu.js
export const DUREE_FEU = 40          // secondes à tenir
const DEGAT = 0.25                   // un esprit qui touche le feu
export const creerFeu = () => ({ vie: 1, temps: 0 })
export const majFeu = (f, dt, touches) => ({ vie: Math.max(0, f.vie - touches * DEGAT), temps: f.temps + dt })
export const issueFeu = (f) => (f.vie <= 0 ? 'perdu' : f.temps >= DUREE_FEU ? 'gagne' : null)
```

```js
// src/logique/portes.js — chaque maison a un délai avant d'éteindre sa lumière
export const creerRue = (delais, objectif) => ({ restants: [...delais], visitees: [], bonbons: 0, objectif })
export const majRue = (r, dt) => ({ ...r, restants: r.restants.map((t) => Math.max(0, t - dt)) })
export function frapper(r, i) {
  if (r.restants[i] <= 0 || r.visitees.includes(i)) return r
  return { ...r, visitees: [...r.visitees, i], bonbons: r.bonbons + 1 }
}
export function issueRue(r) {
  if (r.bonbons >= r.objectif) return 'gagne'
  const encore = r.restants.some((t, i) => t > 0 && !r.visitees.includes(i))
  return encore ? null : 'perdu'
}
```

```js
// src/logique/boutique.js — chaque emplacement attend un type d'objet
export const creerRayon = (types) => types.map((type) => ({ type, plein: false }))
export function poser(rayon, i, type) {
  if (rayon[i].plein || rayon[i].type !== type) return { ok: false, rayon }
  return { ok: true, rayon: rayon.map((e, j) => (j === i ? { ...e, plein: true } : e)) }
}
export const rayonPlein = (rayon) => rayon.every((e) => e.plein)
```

- [ ] **2.4** `pnpm test` → tout passe.

- [ ] **2.5** Commit : `feat: logique pure du jeu + tests`.

---

### Tâche 3 : Art dessiné en code

**Fichiers :** créer `src/art/palette.js`, `src/art/pixels.js`, `src/art/sprites.js`. Modifier `src/scenes/Boot.js`.

- [ ] **3.1** `palette.js` : une lettre par couleur. Style C (encre brune sur parchemin), l'orange est la seule couleur vive.

```js
export const PALETTE = {
  k: '#2b1d10', // encre
  p: '#dcc79a', // parchemin
  q: '#b9a272', // parchemin ombré / hachures
  w: '#f3ecd8', // os
  o: '#e8731a', // orange (écharpe, citrouilles, feu, fenêtres)
  y: '#ffcf6b', // flamme / lueur
  v: '#5a7d3a', // fane de navet
}
export const NUIT = 0x0b0705
```

- [ ] **3.2** `pixels.js` : transforme des frames décrites en chaînes (`.` = transparent) en texture découpée en frames.

```js
export function texturePixels(scene, cle, frames, palette) {
  const h = frames[0].length, w = frames[0][0].length
  const tex = scene.textures.createCanvas(cle, w * frames.length, h)
  const ctx = tex.getContext()
  frames.forEach((lignes, f) => lignes.forEach((ligne, y) => [...ligne].forEach((c, x) => {
    if (c === '.') return
    ctx.fillStyle = palette[c]
    ctx.fillRect(f * w + x, y, 1, 1)
  })))
  tex.refresh()
  frames.forEach((_, f) => tex.add(f, 0, f * w, 0, w, h))
}
```

- [ ] **3.3** `sprites.js` : exporter des objets `{ cle, frames }` :
  - `JACK` : 16×16, 12 frames = 4 directions (bas, haut, gauche, droite) × 3 frames de marche. La lanterne-navet se décale d'un pixel d'une frame à l'autre (balancement). Partir du croquis « mini-squelette à écharpe » de `.superpowers/brainstorm/318-1793284035/content/personnage-jack.html`.
  - `TUILES` : 16×16, une frame par type : sol parchemin, chemin pointillé, herbe hachurée, arbre (bloquant), tombe (bloquante), clôture (bloquante).
  - Bâtiments (32×32 ou 48×32) : ferme, cercle de pierres + feu, chapelle, maison américaine, boutique. Fenêtres en `o` pour qu'elles ressortent dans le noir.
  - Objets des mini-jeux : navet (64×64 pour la sculpture), esprit (16×16, 2 frames), bonbon, citrouille, paquet de bonbons, chauve-souris en carton.
- [ ] **3.4** Dans `Boot.js` : boucler sur tous les sprites et appeler `texturePixels`. Générer aussi la texture `halo` (canvas 128×128, dégradé radial blanc opaque → transparent), utilisée par la lumière.
- [ ] **3.5** Créer les animations Phaser `jack-bas`, `jack-haut`, `jack-gauche`, `jack-droite` (3 frames, 8 images/s, en boucle).
- [ ] **3.6** Vérifier : temporairement, `Boot` affiche Jack qui marche dans les 4 directions et une rangée de chaque tuile. Juger la lisibilité à l'échelle réelle.
- [ ] **3.7** Commit : `feat: sprites et tuiles dessinés en code`.

---

### Tâche 4 : Village, Jack, déplacement clavier

**Fichiers :** créer `src/data/carte.js`, `src/scenes/Village.js`. Modifier `src/main.js` (ajouter la scène) et `Boot.js` (enchaîner sur `Village`).

- [ ] **4.1** `data/carte.js` : carte d'environ 40×30 tuiles en chaînes ASCII, une lettre par tuile, plus la légende `lettre → index de frame` et la liste des index bloquants. Disposition reprise de la maquette : ferme en bas à gauche (départ), cercle de pierres en haut à gauche, chapelle en haut au centre, rue américaine en bas à droite, boutique à droite. Chemins entre les lieux, arbres et tombes en bordure.
- [ ] **4.2** `Village.js` :
  - Tilemap depuis le tableau (`this.make.tilemap({ data, tileWidth: TUILE, tileHeight: TUILE })`), `setCollision` sur les index bloquants.
  - Bâtiments posés en sprites aux positions des lieux (tableau temporaire en dur, remplacé par `data/lieux.js` en tâche 7), corps statiques Arcade.
  - Jack : sprite physique, collision avec la carte et les bâtiments, vitesse `VITESSE_JACK` sur le vecteur d'entrée normalisé, animation selon la direction dominante, frame 0 de la dernière direction à l'arrêt.
  - Entrées : flèches + ZQSD + WASD.
  - Caméra : `startFollow(jack)`, bornée à la carte, `roundPixels`.
- [ ] **4.3** Vérifier : Jack se promène, ne traverse ni les arbres ni les bâtiments, la caméra suit sans trembler.
- [ ] **4.4** Commit : `feat: village explorable au clavier`.

---

### Tâche 5 : Joystick tactile

**Fichiers :** créer `src/ui/joystick.js`. Modifier `Village.js`.

- [ ] **5.1** `ui/joystick.js` exporte `creerJoystick(scene)` qui retourne `{ vecteur() }`. Au toucher sur la moitié gauche de l'écran : base dessinée là où le doigt se pose, manette qui suit le doigt, vecteur calculé avec `logique/joystick.js` (rayon 24). Rien n'est affiché tant qu'on ne touche pas.
- [ ] **5.2** `Village.js` additionne le vecteur clavier et le vecteur joystick, puis normalise.
- [ ] **5.3** Vérifier en émulation mobile dans les outils de développement, puis sur un vrai téléphone via `pnpm dev --host`.
- [ ] **5.4** Commit : `feat: joystick tactile`.

---

### Tâche 6 : La lumière (mécanique centrale)

**Fichiers :** créer `src/ui/lumiere.js`. Modifier `Village.js`.

- [ ] **6.1** `ui/lumiere.js` :

```js
import { NUIT } from '../art/palette.js'

// Calque de nuit plein écran percé par la lanterne.
// ponytail: un seul trou (Jack) ; ajouter d'autres sources (fenêtres, feu) ici si le rendu le demande.
export function creerLumiere(scene, rayon) {
  const { width, height } = scene.scale
  const nuit = scene.add.renderTexture(0, 0, width, height)
    .setOrigin(0).setScrollFactor(0).setDepth(100)
  const trou = scene.make.image({ key: 'halo', add: false })
  return (xEcran, yEcran, vacillement = 0) => {
    trou.setDisplaySize((rayon + vacillement) * 2, (rayon + vacillement) * 2)
    nuit.clear().fill(NUIT, 0.94).erase(trou, xEcran, yEcran)
  }
}
```

- [ ] **6.2** Dans `Village.update` : appeler la lumière avec la position écran de Jack (`jack.x - cam.scrollX`, idem en y), vacillement léger (`Math.sin(temps / 120) * 2`).
- [ ] **6.3** Lueur guide : un sprite `halo` teinté orange, `blendMode: ADD`, profondeur 101 (au-dessus de la nuit), posé sur `prochainLieu(progression)`, alpha qui pulse en tween. La boutique n'a pas de lueur tant qu'elle n'est pas accessible.
- [ ] **6.4** Chaque lieu a une zone de déclenchement devant sa porte. Quand Jack y entre, afficher l'invite « Espace / toucher : entrer » au-dessus de la nuit. Lieu non accessible (boutique trop tôt) : Jack dit « C'est fermé… pour l'instant. »
- [ ] **6.5** Garder la progression dans `this.registry` (`progression`, `positionJack`) pour qu'elle survive aux changements de scène.
- [ ] **6.6** Vérifier : la nuit couvre tout sauf autour de Jack, la lueur guide se voit de loin, le joueur ne cherche jamais dans le noir sans savoir où aller (anti-objectif du design).
- [ ] **6.7** Commit : `feat: lanterne, nuit et lueur guide`.

---

### Tâche 7 : Faits vérifiés et textes

**Fichiers :** créer `src/data/lieux.js`.

- [ ] **7.1** Avant d'écrire les textes, confirmer avec des sources fiables les trois points ouverts du design (§6 et §11) : lien Samhain-Halloween (formulation prudente), *All Hallows' Eve* = veille de la Toussaint, « trick-or-treat » vers les années 1930. Noter les sources en commentaire au-dessus de chaque anecdote.
- [ ] **7.2** Respecter les règles du design : légende de Jack toujours introduite par « la légende raconte » ; France Télécom → « à la fin des années 1990 », sans année.
- [ ] **7.3** Structure :

```js
export const LIEUX = [
  { id: 'ferme',    nom: 'La ferme irlandaise',       tuile: { x: 8,  y: 22 }, scene: 'Navet',    anecdote: '…', recap: '…' },
  { id: 'samhain',  nom: 'Le cercle de pierres',      tuile: { x: 9,  y: 5 },  scene: 'Feu',      anecdote: '…', recap: '…' },
  { id: 'chapelle', nom: 'La chapelle',               tuile: { x: 20, y: 4 },  scene: 'Anecdote', anecdote: '…', recap: '…' },
  { id: 'rue',      nom: 'La rue américaine',         tuile: { x: 26, y: 24 }, scene: 'Portes',   anecdote: '…', recap: '…' },
  { id: 'boutique', nom: "La boutique d'aujourd'hui", tuile: { x: 34, y: 12 }, scene: 'Boutique', anecdote: '…', recap: '…' },
]
export const INTRO = 'La légende raconte que…'
```

  `anecdote` : ce que Jack dit après le mini-jeu, une ou deux phrases courtes et drôles. `recap` : une phrase à raconter à quelqu'un, pour l'écran final. Coordonnées à aligner sur la carte de la tâche 4.
- [ ] **7.4** Brouillons de départ (à reprendre après vérification) :
  - Intro : « La légende raconte que Jack a roulé le diable. Résultat : ni paradis ni enfer, juste une braise dans un navet pour errer. »
  - Ferme : « Avant les citrouilles, on creusait des navets. Arrivés en Amérique, les Irlandais ont trouvé plus facile à sculpter. »
  - Samhain : « Les Celtes fêtaient Samhain à la fin des récoltes. L'ancêtre d'Halloween ? On le dit souvent. Les historiens, eux, restent prudents. »
  - Chapelle : « Halloween, c'est *All Hallows' Eve* : la veille de la Toussaint. Le nom, au moins, n'a rien de mystérieux. »
  - Rue : « Au Moyen Âge, on chantait ou on se déguisait contre des gâteaux. En Amérique, ça devient "trick-or-treat" dans les années 1930. »
  - Boutique : « En France, Halloween est arrivé à la fin des années 1990… surtout par la publicité. Rayon bonbons : 1, folklore : 0. »
- [ ] **7.5** Remplacer le tableau temporaire de `Village.js` par `LIEUX`.
- [ ] **7.6** Commit : `feat: anecdotes vérifiées`.

---

### Tâche 8 : Bulle de Jack et scène calme

**Fichiers :** créer `src/ui/bulle.js`, `src/scenes/Anecdote.js`, `src/scenes/minijeux/finir.js`.

- [ ] **8.1** `ui/bulle.js` : `afficherBulle(scene, texte)` dessine un cadre parchemin bordé d'encre en bas de l'écran, Jack en grand à gauche, texte en `POLICE` qui s'écrit lettre par lettre. Toucher / Espace : termine l'écriture, puis ferme. Retourne une promesse résolue à la fermeture.
- [ ] **8.2** `Anecdote.js` : reçoit `{ lieu }`, fond parchemin sombre avec halo, `await afficherBulle(this, lieu.anecdote)`, puis `terminer(progression, lieu.id)` et retour au `Village`. La chapelle passe directement par cette scène (pas de mini-jeu).
- [ ] **8.3** `minijeux/finir.js` : sortie commune des mini-jeux.

```js
import { POLICE } from '../../config.js'

export const gagner = (scene, lieu) => scene.scene.start('Anecdote', { lieu })

// Pas de pénalité : on rejoue tout de suite.
export function rejouer(scene, message = 'Encore une fois !') {
  const { width, height } = scene.scale
  scene.add.text(width / 2, height / 2, message, { fontFamily: POLICE, color: '#e8731a' }).setOrigin(0.5)
  scene.time.delayedCall(1200, () => scene.scene.restart())
}
```

- [ ] **8.4** Vérifier : entrer dans la chapelle → bulle → retour au village, la lueur passe au lieu suivant.
- [ ] **8.5** Commit : `feat: bulle de Jack et scène de la chapelle`.

---

### Tâches 9 à 12 : les mini-jeux

Règles communes : 1 à 2 minutes, consigne en une phrase à l'ouverture (via `afficherBulle`), échec = `rejouer`, réussite = `gagner`. Toute la règle passe par `src/logique/` ; la scène ne fait qu'afficher et lire les entrées. Jouable au doigt et à la souris. Un commit par mini-jeu.

- [ ] **9. Navet (`minijeux/Navet.js`, ferme)** : grand navet au centre. Le joueur trace au doigt ou à la souris ; les traits sont dessinés à l'encre, les points convertis en coordonnées 0..1 du navet. Les zones touchées s'éclairent en orange de l'intérieur. `visageFini` → une flamme s'allume dans le navet, puis `gagner`. Pas d'échec possible ; bouton « Effacer » pour recommencer.
- [ ] **10. Feu (`minijeux/Feu.js`, Samhain)** : feu de joie au centre, esprits qui arrivent des bords vers le feu, de plus en plus vite. Toucher un esprit le dissipe. Un esprit qui atteint le feu → `majFeu(f, dt, 1)`. Taille de la flamme = `vie`. Barre de temps discrète en haut. `issueFeu` décide.
- [ ] **11. Portes (`minijeux/Portes.js`, rue)** : rue vue de dessus, 6 maisons aux fenêtres orange. Jack s'y déplace (réutiliser joystick + clavier). Chaque maison s'éteint après son délai (variés, de 12 à 40 s environ) ; frapper (Espace / toucher devant la porte) → `frapper`. Objectif : 4 bonbons. Une maison éteinte devient noire.
- [ ] **12. Boutique (`minijeux/Boutique.js`)** : rayon de 8 emplacements typés (citrouilles en haut, bonbons au milieu, déguisements en bas). Les objets arrivent dans un carton ; on les glisse (`setInteractive({ draggable: true })`) vers le bon emplacement. Mauvaise place → l'objet revient au carton. Chrono affiché ; `rayonPlein` → temps final dans la bulle, puis `gagner`. Pas d'échec.
- [ ] **Pour chacun** : vérifier sur ordinateur et en émulation mobile, avec une durée réelle de 1 à 2 minutes.

---

### Tâche 13 : Écran-titre et récapitulatif

**Fichiers :** créer `src/scenes/Titre.js`, `src/scenes/Recap.js`.

- [ ] **13.1** `Titre.js` : titre du jeu en `POLICE`, Jack en grand avec sa lanterne qui vacille, « Toucher pour commencer ». Le premier toucher démarre le son (tâche 14), affiche `INTRO` dans la bulle, puis lance le `Village`. `Boot` enchaîne désormais sur `Titre`.
- [ ] **13.2** `Village` lance `Recap` quand `partieFinie(progression)`.
- [ ] **13.3** `Recap.js` : parchemin, titre « Ce que tu pourras raconter ce soir », les 5 `recap` apparaissent un par un, chacun avec un petit pictogramme du lieu. Bouton « Rejouer » (remet la progression à zéro).
- [ ] **13.4** Commit : `feat: écran-titre et récapitulatif`.

---

### Tâche 14 : Son d'ambiance

**Fichiers :** créer `src/son.js`.

- [ ] **14.1** `demarrerAmbiance()` : Web Audio, sans fichier. Un bourdon grave (deux oscillateurs légèrement désaccordés, volume faible) et un vent (bruit blanc dans un filtre passe-bande dont la fréquence varie lentement). Fondu d'entrée sur 3 s.
- [ ] **14.2** Bouton son discret (coin haut droit) qui coupe ou remet le volume.
- [ ] **14.3** Démarrer uniquement après un geste de l'utilisateur (règle des navigateurs).
- [ ] **14.4** Commit : `feat: ambiance sonore`.

---

### Tâche 15 : Images fixes générées par IA (optionnel)

- [ ] **15.1** Avant tout : vérifier les conditions d'usage de l'outil d'images de Canva pour une publication sur un portfolio (question ouverte du design). Si ce n'est pas clair, garder l'écran-titre dessiné en code.
- [ ] **15.2** Si c'est permis : uniquement des images fixes (écran-titre, illustrations du récapitulatif). Rien qui bouge. Les placer dans `public/images/`, en WebP, moins de 200 Ko chacune, chargées dans `Boot`.
- [ ] **15.3** Commit : `feat: illustrations fixes`.

---

### Tâche 16 : Finitions, build et mise en ligne

- [ ] **16.1** Partie complète chronométrée : 5 à 10 minutes visées. Ajuster les durées des mini-jeux si besoin.
- [ ] **16.2** Test sur un vrai téléphone (portrait et paysage) : texte lisible, joystick confortable, ni scroll ni zoom parasite.
- [ ] **16.3** `pnpm test` et `pnpm build` passent ; `pnpm preview` permet une partie complète sans erreur dans la console.
- [ ] **16.4** Mise en ligne : Netlify (glisser `dist/` sur app.netlify.com/drop, le plus simple) ou GitHub Pages (workflow avec `pnpm/action-setup`, `pnpm install`, `pnpm build`, publication de `dist/`).
- [ ] **16.5** Commit : `chore: mise en ligne`.

---

## Hors périmètre (rappel du design §9)

Sauvegarde, score, plusieurs langues, bouton de partage, monde plus grand, nouveaux mini-jeux.
