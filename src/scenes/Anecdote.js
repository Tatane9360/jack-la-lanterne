import Phaser from 'phaser'
import { terminer } from '../logique/progression.js'
import { afficherBulle } from '../ui/bulle.js'
import { fondNuit } from '../ui/fond.js'

// Après un mini-jeu (ou directement pour la chapelle) : Jack raconte l'anecdote du lieu.
export default class Anecdote extends Phaser.Scene {
  constructor() { super('Anecdote') }

  async create({ lieu }) {
    const { width } = this.scale
    fondNuit(this, lieu.nom)
    const illustration = lieu.batiment ?? 'maison'
    const im = this.add.sprite(width / 2, 220, illustration).setScale(3)
    if (this.anims.exists(illustration)) im.play(illustration)
    this.cameras.main.fadeIn(400)

    await afficherBulle(this, lieu.anecdote)
    terminer(this.registry.get('progression'), lieu.id)
    this.scene.start('Village')
  }
}
