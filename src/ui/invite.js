import { POLICE, PROF, ECRAN } from '../config.js'

// Bandeau d'action en bas de l'écran (« entrer », « frapper »…). Le toucher déclenche l'action.
export function creerInvite(scene, auToucher) {
  const { width, height } = ECRAN
  const texte = scene.add.text(width / 2, height - 20, '', {
    fontFamily: POLICE, fontSize: 24, color: '#2b1d10', align: 'center',
    backgroundColor: '#dcc79a', padding: { x: 16, y: 8 },
  }).setOrigin(0.5, 1).setScrollFactor(0).setDepth(PROF.INTERFACE).setVisible(false)
    .setInteractive({ useHandCursor: true })
  texte.on('pointerdown', (p, x, y, e) => { e.stopPropagation(); auToucher() })

  return {
    montrer: (t) => texte.setText(t).setVisible(true),
    cacher: () => texte.setVisible(false),
  }
}
