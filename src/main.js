import Phaser from 'phaser'
import { LARGEUR, HAUTEUR } from './config.js'
import Boot from './scenes/Boot.js'
import Village from './scenes/Village.js'
import Anecdote from './scenes/Anecdote.js'

// La police doit être chargée avant que Phaser ne dessine du texte.
await document.fonts.load('16px "IM Fell English"').catch(() => {})

const jeu = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'jeu',
  width: LARGEUR,
  height: HAUTEUR,
  pixelArt: true,
  backgroundColor: '#0b0705',
  physics: { default: 'arcade' },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Boot, Village, Anecdote],
})

// Accès depuis la console pour les tests manuels.
if (import.meta.env.DEV) window.jeu = jeu
