import { afficherBulle } from '../../ui/bulle.js'

const DECALAGE = { x: 56, y: 12 } // à côté de la porte, pas dessus
const PEUR = 70 // il file une fois dans la lanterne (rayon minimal ≈ 78 px), pour qu'on ait le temps de le voir

// Le diable rôde près du prochain lieu : visible seulement dans la lumière, il lance sa réplique et file quand Jack approche.
export function creerDiable(scene, porte, replique) {
  const x = porte.x + DECALAGE.x, y = porte.y + DECALAGE.y
  const d = scene.add.image(x, y, 'diable').setOrigin(0.5, 1).setScale(2).setDepth(y)
  let parti = false
  return (jack) => {
    if (parti || Math.hypot(jack.x - x, jack.y - y) > PEUR) return
    parti = true
    scene.tweens.add({ targets: d, x: x + 90, alpha: 0, duration: 450, ease: 'Quad.in', onComplete: () => d.destroy() })
    if (replique) scene.lire(() => afficherBulle(scene, replique, 'diable'))
  }
}
