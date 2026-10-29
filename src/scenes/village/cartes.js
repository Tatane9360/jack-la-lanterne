import Phaser from 'phaser'
import { POLICE, PROF, TUILE, ECRAN } from '../../config.js'
import { CARTES } from '../../data/cartes.js'
import { afficherBulle } from '../../ui/bulle.js'
import { bruit } from '../../son.js'

const DISTANCE = 30
const pages = (c) => [`« ${c.titre} »`, c.texte]

// Cartes trouvées (ids), gardées d'un retour au village à l'autre ; « Rejouer » les efface.
export const cartesTrouvees = (registry) => {
  if (!registry.has('cartes')) registry.set('cartes', new Set())
  return registry.get('cartes')
}

// Relire les cartes trouvées dans la bulle de Jack.
export function relireCartes(scene) {
  const trouvees = CARTES.filter((c) => cartesTrouvees(scene.registry).has(c.id))
  return afficherBulle(scene, trouvees.length ? trouvees.flatMap(pages) : 'Aucune carte pour l\'instant. Elles brillent faiblement dans le noir…')
}

// Petites cartes de parchemin qui flottent dans le village, et compteur cliquable en haut à droite.
export function creerCartes(scene) {
  const trouvees = cartesTrouvees(scene.registry)
  const restantes = CARTES.filter((c) => !trouvees.has(c.id)).map((c) => {
    const x = c.x * TUILE + TUILE / 2, y = c.y * TUILE + TUILE / 2
    const s = scene.add.rectangle(x, y, 12, 16, 0xdcc79a).setStrokeStyle(2, 0x2b1d10).setDepth(y)
    scene.tweens.add({ targets: s, y: y - 4, angle: 8, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.inOut' })
    return { ...c, sprite: s, lueur: { x, y, r: 26 } }
  })

  const compteur = scene.add.text(ECRAN.width - 16, 64, '', {
    fontFamily: POLICE, fontSize: 20, color: '#dcc79a', backgroundColor: '#0b0705cc', padding: { x: 10, y: 4 },
  }).setOrigin(1, 0).setScrollFactor(0).setDepth(PROF.INTERFACE).setInteractive({ useHandCursor: true })
  const majCompteur = () => compteur.setText(`Cartes ${trouvees.size}/${CARTES.length}`)
  majCompteur()

  return {
    compteur,
    lueurs: () => restantes.map((c) => c.lueur),
    proche: (x, y) => restantes.find((c) => Phaser.Math.Distance.Between(x, y, c.lueur.x, c.lueur.y) < DISTANCE),
    async ramasser(c) {
      restantes.splice(restantes.indexOf(c), 1)
      trouvees.add(c.id)
      bruit('carte')
      scene.tweens.killTweensOf(c.sprite)
      scene.tweens.add({ targets: c.sprite, y: c.sprite.y - 30, alpha: 0, duration: 400, onComplete: () => c.sprite.destroy() })
      majCompteur()
      await afficherBulle(scene, pages(c))
    },
  }
}
