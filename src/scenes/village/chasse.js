import Phaser from 'phaser'
import { TUILE } from '../../config.js'
import { CACHETTES } from '../../data/carte.js'
import { chaleur, indiceFort } from '../../logique/chasse.js'
import { afficherBulle } from '../../ui/bulle.js'
import { boutonQuitter } from '../minijeux/finir.js'
import { bruit } from '../../son.js'

const PORTEE = 360 // distance à partir de laquelle la lanterne commence à s'agiter
const TROUVEE = 30
const DELAI_INDICE = 30

// Épilogue : la dernière citrouille est cachée dans le village, seule la lanterne la révèle.
export function creerChasse(scene) {
  const c = Phaser.Utils.Array.GetRandom(CACHETTES)
  const pos = { x: c.x * TUILE + TUILE / 2, y: c.y * TUILE + TUILE / 2 }
  const citrouille = scene.add.image(pos.x, pos.y, 'citrouille').setOrigin(0.5, 1).setScale(2).setDepth(pos.y)
  boutonQuitter(scene, 'Recap')
  let t = 0, finie = false

  return {
    intro: () => afficherBulle(scene, [
      "Attends… une dernière citrouille s'est cachée dans le village.",
      "Ma lanterne s'agite quand on s'en approche. Trouve-la !",
    ]),
    // Flèche vers la cachette seulement si on tarde.
    cible: () => (indiceFort(t, DELAI_INDICE) ? pos : null),
    // Plus on est près, plus la lanterne grandit et vacille.
    lanterne(source, jack, temps) {
      const ch = chaleur(Phaser.Math.Distance.Between(jack.x, jack.y, pos.x, pos.y), PORTEE)
      return { ...source, r: source.r * (1 + 0.4 * ch) + Math.sin(temps / 35) * 10 * ch }
    },
    // Vrai une seule fois : quand Jack arrive sur la citrouille.
    trouvee(jack, dt) {
      t += dt
      if (finie || Phaser.Math.Distance.Between(jack.x, jack.y + 12, pos.x, pos.y) > TROUVEE) return false
      return (finie = true)
    },
    async fin() {
      bruit('trouvee')
      scene.tweens.add({ targets: citrouille, y: pos.y - 20, scale: 3, yoyo: true, duration: 300, ease: 'Back.out' })
      await afficherBulle(scene, 'Trouvée ! Toi, tu ferais une excellente lanterne.')
      scene.scene.start('Recap')
    },
  }
}
