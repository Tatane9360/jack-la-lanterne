import { NUIT, ORANGE } from '../art/palette.js'
import { PROF, RAYON_LANTERNE, ECRAN } from '../config.js'

// Calque de nuit plein écran, percé par des sources de lumière { x, y, r } en coordonnées du monde.
// La première source est la lanterne : elle reçoit en plus une chaleur orange.
// loupe : grossissement du monde par rapport à l'écran (village sur mobile), le calque restant à l'échelle de l'écran.
export function creerLumiere(scene, loupe = 1) {
  const { width, height } = ECRAN
  const nuit = scene.add.renderTexture(0, 0, width, height).setOrigin(0).setScrollFactor(0).setDepth(PROF.NUIT)
  const chaleur = scene.add.image(0, 0, 'halo').setTint(ORANGE).setBlendMode('ADD').setDepth(PROF.LUEUR).setAlpha(0.18).setScale(0.9)
  const trou = scene.make.image({ key: 'halo', add: false })
  const cam = scene.cameras.main

  return (sources) => {
    nuit.clear().fill(NUIT, 0.94)
    for (const s of sources) {
      trou.setDisplaySize(s.r * 2 * loupe, s.r * 2 * loupe)
      nuit.erase(trou, (s.x - cam.scrollX) * loupe, (s.y - cam.scrollY) * loupe)
    }
    chaleur.setPosition(sources[0].x, sources[0].y)
  }
}

// La lanterne de Jack, qui vacille.
export const lanterneDe = (jack, temps) => ({
  x: jack.x + 10, y: jack.y,
  r: RAYON_LANTERNE + Math.sin(temps / 120) * 3 + Math.sin(temps / 47) * 1.5,
})
