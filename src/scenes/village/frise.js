import { POLICE, PROF } from '../../config.js'
import { ORANGE } from '../../art/palette.js'
import { LIEUX } from '../../data/lieux.js'
import { prochainLieu } from '../../logique/progression.js'

const LARGEUR_CASE = 150
const Y = 30

// Frise chronologique en haut du village : une case par lieu, allumée une fois le lieu fait.
export function creerFrise(scene, progression) {
  const x0 = scene.scale.width / 2 - ((LIEUX.length - 1) * LARGEUR_CASE) / 2
  const fixer = (o) => o.setScrollFactor(0).setDepth(PROF.INTERFACE)
  const prochain = prochainLieu(progression)

  fixer(scene.add.rectangle(scene.scale.width / 2, Y, LIEUX.length * LARGEUR_CASE, 52, 0x0b0705, 0.75).setStrokeStyle(2, 0xb9a272, 0.5))
  fixer(scene.add.line(0, 0, x0, Y - 8, x0 + (LIEUX.length - 1) * LARGEUR_CASE, Y - 8, 0xb9a272, 0.5).setOrigin(0))

  LIEUX.forEach((l, i) => {
    const x = x0 + i * LARGEUR_CASE
    const fait = progression.faits.has(l.id)
    const icone = fixer(scene.add.image(x, Y - 8, l.batiment ?? 'maison'))
    icone.setScale(26 / Math.max(icone.width, icone.height)).setAlpha(fait ? 1 : 0.3)
    if (!fait) icone.setTintFill(0x6b5a3a)
    fixer(scene.add.text(x, Y + 12, l.epoque, {
      fontFamily: POLICE, fontSize: 15, color: fait ? '#e8731a' : '#7d6a48',
    }).setOrigin(0.5, 0.5))
    if (l.id === prochain) {
      const anneau = fixer(scene.add.circle(x, Y - 8, 17).setStrokeStyle(2, ORANGE))
      scene.tweens.add({ targets: anneau, alpha: 0.2, yoyo: true, repeat: -1, duration: 700 })
    }
  })
}
