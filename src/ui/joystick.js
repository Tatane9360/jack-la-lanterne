import { vecteurJoystick } from '../logique/joystick.js'

const RAYON = 48

// Joystick tactile : apparaît là où le doigt se pose sur la moitié gauche de l'écran.
export function creerJoystick(scene) {
  const base = scene.add.circle(0, 0, RAYON, 0xdcc79a, 0.25).setStrokeStyle(3, 0x2b1d10, 0.6)
  const manette = scene.add.circle(0, 0, 20, 0xe8731a, 0.7).setStrokeStyle(3, 0x2b1d10, 0.8)
  for (const o of [base, manette]) o.setScrollFactor(0).setDepth(300).setVisible(false)
  let doigt = null
  let v = { x: 0, y: 0 }

  scene.input.addPointer(1) // joystick + un second doigt pour toucher un bouton
  scene.input.on('pointerdown', (p) => {
    if (doigt || p.x > scene.scale.width / 2) return
    doigt = p
    base.setPosition(p.x, p.y).setVisible(true)
    manette.setPosition(p.x, p.y).setVisible(true)
  })
  scene.input.on('pointermove', (p) => {
    if (p !== doigt) return
    v = vecteurJoystick(p.x - base.x, p.y - base.y, RAYON)
    manette.setPosition(base.x + v.x * RAYON, base.y + v.y * RAYON)
  })
  scene.input.on('pointerup', (p) => {
    if (p !== doigt) return
    doigt = null
    v = { x: 0, y: 0 }
    base.setVisible(false); manette.setVisible(false)
  })

  return { vecteur: () => v }
}
