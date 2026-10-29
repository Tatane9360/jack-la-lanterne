import { VITESSE_JACK } from '../config.js'
import { DIRECTIONS } from '../art/sprites.js'

// Jack, piloté par un vecteur de norme ≤ 1. Sert au village et à la rue américaine.
export function creerJack(scene, x, y, direction = 'bas') {
  const jack = scene.physics.add.sprite(x, y, 'jack', DIRECTIONS.indexOf(direction) * 3 + 1)
  jack.body.setSize(20, 10).setOffset(6, 22) // seuls les pieds bloquent
  jack.setCollideWorldBounds(true)
  jack.direction = direction

  jack.piloter = (v) => {
    jack.setVelocity(v.x * VITESSE_JACK, v.y * VITESSE_JACK)
    if (Math.hypot(v.x, v.y) > 0.1) {
      jack.direction = Math.abs(v.x) > Math.abs(v.y) ? (v.x > 0 ? 'droite' : 'gauche') : (v.y > 0 ? 'bas' : 'haut')
      jack.play(`jack-${jack.direction}`, true)
    } else {
      jack.anims.stop()
      jack.setFrame(DIRECTIONS.indexOf(jack.direction) * 3 + 1)
    }
    jack.setDepth(jack.y) // passe devant ou derrière les décors selon sa hauteur
  }
  return jack
}
