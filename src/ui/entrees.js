import Phaser from 'phaser'

// Clavier (flèches, ZQSD, WASD) : direction de norme ≤ 1, et touche d'action (Espace / Entrée).
export function creerEntrees(scene) {
  const k = scene.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,Z,Q,S,D,W,A,SPACE,ENTER')
  return {
    direction() {
      const x = (k.RIGHT.isDown || k.D.isDown) - (k.LEFT.isDown || k.Q.isDown || k.A.isDown)
      const y = (k.DOWN.isDown || k.S.isDown) - (k.UP.isDown || k.Z.isDown || k.W.isDown)
      const d = Math.hypot(x, y)
      return d > 1 ? { x: x / d, y: y / d } : { x, y }
    },
    action: () => Phaser.Input.Keyboard.JustDown(k.SPACE) || Phaser.Input.Keyboard.JustDown(k.ENTER),
  }
}
