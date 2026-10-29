import { zzfx, ZZFX } from 'zzfx'

// Sons du jeu : fichiers `src/sons/<nom>.mp3` (liste et crédits dans src/sons/A-LIRE.md et LICENCES.md),
// joués par le gestionnaire de sons de Phaser. Un fichier absent : silence pour les ambiances,
// bruitage ZzFX (généré en code, MIT) pour les bruitages qui en ont un.
// Doit démarrer après un geste de l'utilisateur (règle des navigateurs).
const VOLUME_BRUITS = 0.5
// Fichiers déjà coupés, bouclés et normalisés (pic à -1/-3 dB) : ces volumes ne règlent que l'équilibre du mixage.
const AMBIANCES = { musique: 0.15, pluie: 0.2, feu: 0.7, marcher: 0.45 } // en boucle
const VOLUMES = { frapper: 0.8, bonbon: 0.5, sort: 0.55, arrache: 0.9, casse: 0.5, resiste: 0.5, esprit: 0.4, pose: 0.4, carte: 0.6, trouvee: 0.55 }
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
let muet = false // Phaser applique mute en différé : on garde notre propre valeur
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
  if (existe(nom)) return sons.play(nom, { volume: VOLUMES[nom] })
  if (ZZFX_REPLI[nom]) zzfx(...ZZFX_REPLI[nom])
}

// Bruit de pas en boucle tant que Jack marche (un seul pour tout le jeu).
let pasEnCours = null
export function pas(marche) {
  if (!existe('marcher')) return
  pasEnCours ??= sons.add('marcher', { loop: true, volume: AMBIANCES.marcher })
  if (marche && !pasEnCours.isPlaying) pasEnCours.play()
  else if (!marche && pasEnCours.isPlaying) pasEnCours.stop()
}

// Ambiance propre à une scène (le feu de Samhain) : coupée quand la scène s'arrête.
export function ambianceLocale(scene, nom) {
  if (!existe(nom)) return
  const s = sons.add(nom, { loop: true, volume: AMBIANCES[nom] })
  s.play()
  scene.events.once('shutdown', () => s.destroy())
}

export function demarrerAmbiance(scene) {
  if (sons) return
  sons = scene.sound
  for (const nom of ['musique', 'pluie']) if (existe(nom)) sons.play(nom, { loop: true, volume: AMBIANCES[nom] })
  ZZFX.volume = VOLUME_BRUITS * 0.6
  creerBouton()
}

// Bouton HTML (accessible au clavier et aux lecteurs d'écran) en haut à gauche.
function creerBouton() {
  const b = document.createElement('button')
  b.id = 'son'
  b.type = 'button'
  const maj = () => {
    b.textContent = muet ? 'Son : non' : 'Son : oui'
    b.setAttribute('aria-pressed', String(!muet))
  }
  b.addEventListener('click', () => {
    muet = !muet
    sons.mute = muet
    ZZFX.volume = muet ? 0 : VOLUME_BRUITS * 0.6
    maj()
    b.blur() // Espace doit rester au jeu
  })
  maj()
  document.body.append(b)
}
