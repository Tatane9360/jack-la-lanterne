import { NUIT } from '../art/palette.js'
import { PROF } from '../config.js'

// Calque de nuit plein écran, percé par des sources de lumière { x, y, r } en coordonnées du monde.
export function creerLumiere(scene) {
  const { width, height } = scene.scale
  const nuit = scene.add.renderTexture(0, 0, width, height).setOrigin(0).setScrollFactor(0).setDepth(PROF.NUIT)
  const trou = scene.make.image({ key: 'halo', add: false })
  const cam = scene.cameras.main

  return (sources) => {
    nuit.clear().fill(NUIT, 0.94)
    for (const s of sources) {
      trou.setDisplaySize(s.r * 2, s.r * 2)
      nuit.erase(trou, s.x - cam.scrollX, s.y - cam.scrollY)
    }
  }
}
