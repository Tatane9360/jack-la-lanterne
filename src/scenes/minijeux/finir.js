import { POLICE, PROF, ECRAN } from '../../config.js'
import { typo } from '../../ui/bulle.js'

// Sortie commune des mini-jeux.
export const gagner = (scene, lieu) => scene.scene.start('Anecdote', { lieu })

// ✕ en haut à droite ou Échap : on sort sans valider le lieu (par défaut, retour au village).
export function boutonQuitter(scene, cible = 'Village') {
  const quitter = () => scene.scene.start(cible)
  scene.add.text(ECRAN.width - 16, 16, '✕', {
    fontFamily: POLICE, fontSize: 34, color: '#2b1d10', backgroundColor: '#dcc79a', padding: { x: 12, y: 2 },
  }).setOrigin(1, 0).setScrollFactor(0).setDepth(PROF.INTERFACE + 3)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', (p, x, y, e) => { e.stopPropagation(); quitter() })
  scene.input.keyboard.once('keydown-ESC', quitter)
}

// Pas de pénalité : on rejoue tout de suite.
export function rejouer(scene, message = 'Encore une fois !') {
  const { width, height } = ECRAN
  scene.add.text(width / 2, height / 2, typo(message), {
    fontFamily: POLICE, fontSize: 48, color: '#e8731a', stroke: '#0b0705', strokeThickness: 6,
  }).setOrigin(0.5).setDepth(PROF.INTERFACE + 2)
  scene.time.delayedCall(1400, () => scene.scene.restart())
}
