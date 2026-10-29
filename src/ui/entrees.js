import Phaser from 'phaser'
import { creerJoystick } from './joystick.js'

// Clavier (flèches, ZQSD, WASD) ou joystick tactile : direction de norme ≤ 1.
// Action : Espace / Entrée (le tactile passe par des boutons à l'écran).
export function creerEntrees(scene) {
  const k = scene.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,Z,Q,S,D,W,A,SPACE,ENTER')
  const joystick = creerJoystick(scene)
  return {
    direction() {
      const x = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.Q.isDown || k.A.isDown)
      const y = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.Z.isDown || k.W.isDown)
      if (!x && !y) return joystick.vecteur()
      const d = Math.hypot(x, y)
      return { x: x / d, y: y / d }
    },
    action: () => Phaser.Input.Keyboard.JustDown(k.SPACE) || Phaser.Input.Keyboard.JustDown(k.ENTER),
  }
}
