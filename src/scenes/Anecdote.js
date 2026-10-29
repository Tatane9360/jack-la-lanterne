import Phaser from 'phaser'
import { terminer, partieFinie } from '../logique/progression.js'
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
    const progression = this.registry.get('progression')
    terminer(progression, lieu.id)
    // Tous les lieux faits : épilogue de la citrouille cachée, puis le récap.
    this.scene.start('Village', { chasse: partieFinie(progression) })
  }
}
