import { PROF, ECRAN } from '../config.js'

// Pluie fine et oblique, par-dessus la nuit, comme dans l'ambiance sonore. Fixe à l'écran.
export function creerPluie(scene) {
  if (!scene.textures.exists('goutte')) {
    scene.make.graphics({ add: false }).fillStyle(0xdcc79a).fillRect(0, 0, 2, 14).generateTexture('goutte', 2, 14).destroy()
  }
  const { width, height } = ECRAN
  return scene.add.particles(0, 0, 'goutte', {
    x: { min: 0, max: width + 120 }, y: -20,
    speedX: { min: -130, max: -110 }, speedY: { min: 620, max: 760 },
    rotate: 10, lifespan: (height + 40) / 0.62, // juste assez pour traverser l'écran
    alpha: { start: 0.3, end: 0.12 }, scaleY: { min: 0.6, max: 1.1 },
    frequency: 12, quantity: 2,
  }).setScrollFactor(0).setDepth(PROF.LUEUR)
}
