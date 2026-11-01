import { zzfx, ZZFX } from 'zzfx'

// Sons du jeu : fichiers `src/sons/<nom>.mp3` (liste et crédits dans src/sons/A-LIRE.md et LICENCES.md),
// joués par le gestionnaire de sons de Phaser. Un fichier absent : silence pour les ambiances,
// bruitage ZzFX (généré en code, MIT) pour les bruitages qui en ont un.
// Doit démarrer après un geste de l'utilisateur (règle des navigateurs).
const VOLUME_BRUITS = 0.5
// Fichiers déjà coupés, bouclés et normalisés (pic à -1/-3 dB) : ces volumes ne règlent que l'équilibre du mixage.
const AMBIANCES = { musique: 0.15, pluie: 0.2, feu: 0.7, marcher: 0.45, 'machine-ecrire': 0.3 } // en boucle
const VOLUMES = { frapper: 0.8, bonbon: 0.5, sort: 0.55, arrache: 0.9, casse: 0.5, resiste: 0.5, esprit: 0.4, pose: 0.4, carte: 0.6, trouvee: 0.55, 'chauve-souris': 0.7 }
export const NOMS_SONS = [...Object.keys(AMBIANCES), ...Object.keys(VOLUMES)]

// Repli ZzFX, réglé dans le studio : https://killedbyapixel.github.io/ZzFX
const ZZFX_REPLI = {
  bonbon: [1.2, , 1675, , 0.06, 0.24, 1, 1.82, , , 837, 0.06],
  sort: [1.3, , 180, 0.04, 0.25, 0.45, 3, 1.5, -4, , , , , 0.3, 20, , 0.15, 0.7, 0.1],
  arrache: [1.2, , 400, 0.01, 0.05, 0.15, 1, 1.5, 15, , , , , , , , , 0.7, 0.03],
  casse: [1.5, , 90, , 0.02, 0.1, 4, 2, , , , , , 2],
  resiste: [1, , 70, , 0.04, 0.08, , 2.5, -3],
  carte: [1, , 880, 0.01, 0.04, 0.15, , 1.5, , , 440, 0.05],
  esprit: [0.8, , 500, 0.01, 0.05, 0.2, 4, 1, -10, , , , , 1.5],
  pose: [0.8, , 300, , 0.02, 0.06, , 2],
  trouvee: [1.4, , 523, 0.02, 0.2, 0.4, 1, 2, , , 262, 0.1, 0.1],
}

let sons = null

// Réglages du joueur (0 à 1), gardés dans le navigateur.
const CATEGORIES = { general: 'Général', musique: 'Musique', ambiances: 'Ambiances', bruitages: 'Bruitages' }
const reglages = { general: 0.65, musique: 0.65, ambiances: 0.65, bruitages: 0.65 }
try { Object.assign(reglages, JSON.parse(localStorage.getItem('reglages-son'))) } catch {}
const categorie = (nom) => (nom === 'musique' ? 'musique' : nom in AMBIANCES ? 'ambiances' : 'bruitages')
const vol = (nom) => (AMBIANCES[nom] ?? VOLUMES[nom]) * reglages[categorie(nom)]
const existe = (nom) => sons?.game.cache.audio.exists(nom)

// Vite ne liste que les fichiers présents : on ne charge rien qui manque (pas d'erreur en console).
const FICHIERS = import.meta.glob('./sons/*.mp3', { eager: true, query: '?url', import: 'default' })

// À appeler dans le preload de Boot.
export function chargerSons(scene) {
  for (const nom of NOMS_SONS) {
    const url = FICHIERS[`./sons/${nom}.mp3`]
    if (url) scene.load.audio(nom, url)
  }
}

export function bruit(nom) {
  if (existe(nom)) return sons.play(nom, { volume: vol(nom) })
  if (ZZFX_REPLI[nom]) zzfx(...ZZFX_REPLI[nom])
}

// Sons en boucle tant qu'une action dure : pas de Jack, texte d'un dialogue qui s'écrit (un seul de chaque pour tout le jeu).
const boucles = {}
function boucle(nom, actif) {
  if (!existe(nom)) return
  const s = (boucles[nom] ??= sons.add(nom, { loop: true, volume: vol(nom) }))
  if (actif && !s.isPlaying) s.play()
  else if (!actif && s.isPlaying) s.stop()
}
export const pas = (marche) => boucle('marcher', marche)
export const ecriture = (actif) => boucle('machine-ecrire', actif)

// Ambiance d'un lieu (le feu de Samhain), dosée par la proximité p de 0 (loin) à 1 (dedans) :
// elle monte et couvre peu à peu la musique et la pluie. Coupée, et le reste rétabli, quand la scène s'arrête.
const COUVRE = 0.7 // part de la musique et de la pluie retirée quand p = 1
const locales = new Map()
let couverture = 0
export function ambianceProche(scene, nom, p) {
  if (!existe(nom)) return
  let s = locales.get(scene)
  if (!s) {
    s = sons.add(nom, { loop: true, volume: 0 })
    s.play()
    locales.set(scene, s)
    scene.events.once('shutdown', () => { s.destroy(); locales.delete(scene); couvrir(0) })
  }
  s.setVolume(vol(nom) * p)
  couvrir(p)
}
const couvrir = (p) => {
  couverture = p
  for (const nom of ['musique', 'pluie']) sons.get(nom)?.setVolume(vol(nom) * (1 - COUVRE * p))
}

// Réapplique les réglages aux sons qui jouent déjà (les ambiances locales suivent à leur prochaine mise à jour).
function appliquer() {
  sons.volume = reglages.general
  ZZFX.volume = VOLUME_BRUITS * 0.6 * reglages.general * reglages.bruitages
  for (const [nom, s] of Object.entries(boucles)) s.setVolume(vol(nom))
  couvrir(couverture)
}

export function demarrerAmbiance(scene) {
  if (sons) return
  sons = scene.sound
  for (const nom of ['musique', 'pluie']) if (existe(nom)) sons.play(nom, { loop: true, volume: vol(nom) })
  appliquer()
  creerPanneau()
}

// Panneau HTML (accessible au clavier et aux lecteurs d'écran) en haut à gauche : un curseur par catégorie.
function creerPanneau() {
  const d = document.createElement('details')
  d.id = 'son'
  d.innerHTML = '<summary>Son</summary>'
  for (const [cle, texte] of Object.entries(CATEGORIES)) {
    const l = document.createElement('label')
    const r = Object.assign(document.createElement('input'), { type: 'range', min: 0, max: 100, value: Math.round(reglages[cle] * 100) })
    r.addEventListener('input', () => {
      reglages[cle] = r.value / 100
      appliquer()
      try { localStorage.setItem('reglages-son', JSON.stringify(reglages)) } catch {}
    })
    r.addEventListener('pointerup', () => r.blur()) // à la souris ou au doigt, Espace et les flèches restent au jeu
    l.append(texte, r)
    d.append(l)
  }
  d.querySelector('summary').addEventListener('pointerup', (e) => e.currentTarget.blur())
  document.body.append(d)
}
