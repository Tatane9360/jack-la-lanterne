import Phaser from 'phaser'
import { POLICE } from '../config.js'
import { ORANGE } from '../art/palette.js'
import { INTRO } from '../data/lieux.js'
import { afficherBulle } from '../ui/bulle.js'

export default class Titre extends Phaser.Scene {
  constructor() { super('Titre') }

  create() {
    const { width } = this.scale
    this.cameras.main.setBackgroundColor('#0b0705').fadeIn(600)
    this.add.text(width / 2, 50, 'Jack et la lanterne', { fontFamily: POLICE, fontSize: 64, color: '#e8731a' }).setOrigin(0.5, 0)
    this.add.text(width / 2, 128, "Une petite histoire d'Halloween", { fontFamily: POLICE, fontSize: 26, color: '#b9a272', fontStyle: 'italic' }).setOrigin(0.5, 0)

    const halo = this.add.image(width / 2 + 30, 290, 'halo').setTint(ORANGE).setBlendMode('ADD').setScale(1.4).setAlpha(0.6)
    this.tweens.add({ targets: halo, alpha: 0.4, scale: 1.3, yoyo: true, repeat: -1, duration: 140, ease: 'Sine.inOut' })
    this.add.sprite(width / 2, 300, 'jack').play('jack-bas').setScale(7)

    const invite = this.add.text(width / 2, 470, 'Toucher ou Espace pour commencer', { fontFamily: POLICE, fontSize: 28, color: '#dcc79a' }).setOrigin(0.5)
    this.tweens.add({ targets: invite, alpha: 0.3, yoyo: true, repeat: -1, duration: 700 })

    const commencer = async () => {
      this.input.off('pointerdown', commencer)
      this.input.keyboard.off('keydown-SPACE', commencer)
      this.input.keyboard.off('keydown-ENTER', commencer)
      invite.setVisible(false)
      await afficherBulle(this, INTRO)
      this.scene.start('Village')
    }
    this.input.once('pointerdown', commencer)
    this.input.keyboard.once('keydown-SPACE', commencer)
    this.input.keyboard.once('keydown-ENTER', commencer)
  }
}
