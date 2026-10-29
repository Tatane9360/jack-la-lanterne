import { POLICE, PROF } from '../../config.js'

// Sortie commune des mini-jeux.
export const gagner = (scene, lieu) => scene.scene.start('Anecdote', { lieu })

// Pas de pénalité : on rejoue tout de suite.
export function rejouer(scene, message = 'Encore une fois !') {
  const { width, height } = scene.scale
  scene.add.text(width / 2, height / 2, message, {
    fontFamily: POLICE, fontSize: 48, color: '#e8731a', stroke: '#0b0705', strokeThickness: 6,
  }).setOrigin(0.5).setDepth(PROF.INTERFACE + 2)
  scene.time.delayedCall(1400, () => scene.scene.restart())
}
