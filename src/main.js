import Phaser from 'phaser'
import { LARGEUR, HAUTEUR } from './config.js'
import Boot from './scenes/Boot.js'

// La police doit être chargée avant que Phaser ne dessine du texte.
await document.fonts.load('16px "IM Fell English"').catch(() => {})

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'jeu',
  width: LARGEUR,
  height: HAUTEUR,
  pixelArt: true,
  backgroundColor: '#0b0705',
  physics: { default: 'arcade' },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Boot],
})
