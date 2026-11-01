import Phaser from 'phaser'
import { texturePixels, textureHalo } from '../art/pixels.js'
import { JACK, DIRECTIONS, TUILES, BATIMENTS, OBJETS } from '../art/sprites.js'
import { chargerSons } from '../son.js'

// Génère toutes les textures et animations, puis lance le jeu.
export default class Boot extends Phaser.Scene {
  constructor() { super('Boot') }

  preload() {
    chargerSons(this)
  }

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
    this.anims.create({ key: 'chauve-souris', frames: this.anims.generateFrameNumbers('chauve-souris'), frameRate: 10, repeat: -1 })
    this.anims.create({ key: 'esprit', frames: this.anims.generateFrameNumbers('esprit'), frameRate: 4, repeat: -1 })

    this.scene.start('Titre')
  }
}
