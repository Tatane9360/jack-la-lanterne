import Phaser from 'phaser'
import { texturePixels, textureHalo } from '../art/pixels.js'
import { JACK, DIRECTIONS, TUILES, BATIMENTS, OBJETS } from '../art/sprites.js'

// Génère toutes les textures et animations, puis lance le jeu.
export default class Boot extends Phaser.Scene {
  constructor() { super('Boot') }

  create() {
    texturePixels(this, 'jack', JACK)
    texturePixels(this, 'tuiles', TUILES)
    for (const [cle, frames] of Object.entries({ ...BATIMENTS, ...OBJETS })) texturePixels(this, cle, frames)
    textureHalo(this)

    DIRECTIONS.forEach((dir, d) => this.anims.create({
      key: `jack-${dir}`,
      frames: this.anims.generateFrameNumbers('jack', { frames: [0, 1, 2, 1].map((f) => d * 3 + f) }),
      frameRate: 8,
      repeat: -1,
    }))
    this.anims.create({ key: 'feu', frames: this.anims.generateFrameNumbers('feu'), frameRate: 6, repeat: -1 })
    this.anims.create({ key: 'esprit', frames: this.anims.generateFrameNumbers('esprit'), frameRate: 4, repeat: -1 })

    this.galerie()
  }

  // Temporaire : vérifier les sprites à l'échelle réelle.
  galerie() {
    this.cameras.main.setBackgroundColor('#dcc79a')
    DIRECTIONS.forEach((dir, i) => this.add.sprite(60 + i * 60, 60, 'jack').play(`jack-${dir}`))
    TUILES.forEach((_, i) => this.add.image(60 + i * 36, 140, 'tuiles', i))
    let x = 40
    for (const cle of Object.keys(BATIMENTS)) { const im = this.add.image(x, 260, cle).setOrigin(0, 0.5); x += im.width + 20 }
    x = 40
    for (const cle of Object.keys(OBJETS)) { const im = this.add.sprite(x, 400, cle).setOrigin(0, 0.5); if (this.anims.exists(cle)) im.play(cle); x += im.width + 20 }
    this.add.sprite(400, 60, 'jack').play('jack-bas').setScale(4)
  }
}
