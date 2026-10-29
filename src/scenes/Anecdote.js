import Phaser from 'phaser'
import { terminer, partieFinie } from '../logique/progression.js'
import { afficherBulle } from '../ui/bulle.js'
import { fondNuit } from '../ui/fond.js'
import { ECRAN } from '../config.js'
import { donnerCarte } from './village/cartes.js'

// Après un mini-jeu (ou directement pour la chapelle) : Jack et le diable se parlent, puis Jack gagne la carte du lieu.
export default class Anecdote extends Phaser.Scene {
  constructor() { super('Anecdote') }

  async create({ lieu }) {
    const { width } = ECRAN
    fondNuit(this, lieu.nom)
    const illustration = lieu.batiment ?? 'maison'
    const im = this.add.sprite(width / 2 - 70, 220, illustration).setScale(3)
    if (this.anims.exists(illustration)) im.play(illustration)
    // Le diable, à côté du lieu, s'il prend part au dialogue.
    if (lieu.recit.some((p) => p.diable)) {
      const d = this.add.image(width / 2 + 150, 300, 'diable').setOrigin(0.5, 1).setScale(4).setAlpha(0)
      this.tweens.add({ targets: d, alpha: 1, duration: 600, delay: 300 })
    }
    this.cameras.main.fadeIn(400)

    await afficherBulle(this, lieu.recit)
    await donnerCarte(this, lieu.id)
    const progression = this.registry.get('progression')
    terminer(progression, lieu.id)
    // Tous les lieux faits : épilogue de la citrouille cachée, puis le récap.
    this.scene.start('Village', { chasse: partieFinie(progression) })
  }
}
