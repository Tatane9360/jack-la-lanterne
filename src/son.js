import { zzfx, ZZFX } from 'zzfx'

// Ambiance : musique et pluie en boucle (fichiers CC0 de public/sons, voir public/sons/LICENCES.md),
// jouées par le gestionnaire de sons de Phaser. Bruitages : ZzFX, générés en code (licence MIT).
// Doit démarrer après un geste de l'utilisateur (règle des navigateurs).
const VOLUME_BRUITS = 0.3
let sons = null
let muet = false // Phaser applique mute en différé : on garde notre propre valeur

// Paramètres ZzFX, réglés dans le studio : https://killedbyapixel.github.io/ZzFX
const BRUITS = {
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
export const bruit = (nom) => zzfx(...BRUITS[nom])

export function demarrerAmbiance(scene) {
  if (sons) return
  sons = scene.sound
  sons.play('musique', { loop: true, volume: 0.45 })
  sons.play('pluie', { loop: true, volume: 0.3 })
  ZZFX.volume = VOLUME_BRUITS
  creerBouton()
}

// Bouton HTML (accessible au clavier et aux lecteurs d'écran) en haut à droite.
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
    ZZFX.volume = muet ? 0 : VOLUME_BRUITS
    maj()
    b.blur() // Espace doit rester au jeu
  })
  maj()
  document.body.append(b)
}
