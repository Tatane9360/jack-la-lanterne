import Phaser from 'phaser'
import { LARGEUR, HAUTEUR } from './config.js'
import Boot from './scenes/Boot.js'
import Titre from './scenes/Titre.js'
import Village from './scenes/Village.js'
import Anecdote from './scenes/Anecdote.js'
import Recap from './scenes/Recap.js'
import Navet from './scenes/minijeux/Navet.js'
import Feu from './scenes/minijeux/Feu.js'
import Portes from './scenes/minijeux/Portes.js'
import Boutique from './scenes/minijeux/Boutique.js'

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
  scene: [Boot, Titre, Village, Anecdote, Recap, Navet, Feu, Portes, Boutique],
})

// Phaser rate parfois le passage portrait → paysage (le jeu reste à la taille du portrait) : on force le recalcul.
for (const evenement of ['resize', 'orientationchange']) {
  window.addEventListener(evenement, () => setTimeout(() => jeu.scale.refresh(), 150))
}

// Accès depuis la console pour les tests manuels.
if (import.meta.env.DEV) window.jeu = jeu
