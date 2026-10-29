import Phaser from 'phaser'
import { TUILE } from '../config.js'
import { CARTE, BLOQUANTES, DECOR, DEPART } from '../data/carte.js'
import { LIEUX } from '../data/lieux.js'
import { creerJack } from '../ui/jack.js'
import { creerEntrees } from '../ui/entrees.js'

// Tuiles → pixels du monde (centre horizontal de la tuile).
const mx = (x) => x * TUILE + TUILE / 2
const my = (y) => y * TUILE

export default class Village extends Phaser.Scene {
  constructor() { super('Village') }

  create() {
    const carte = this.make.tilemap({ data: CARTE, tileWidth: TUILE, tileHeight: TUILE })
    const sol = carte.createLayer(0, carte.addTilesetImage('tuiles'), 0, 0)
    sol.setCollision(BLOQUANTES)
    this.physics.world.setBounds(0, 0, carte.widthInPixels, carte.heightInPixels)

    // Bâtiments et décors : posés par le bas, seule la base bloque (on passe « derrière » le toit).
    const obstacles = this.physics.add.staticGroup()
    const poser = (cle, x, y) => {
      const s = obstacles.create(mx(x), my(y), cle).setOrigin(0.5, 1).setDepth(my(y))
      s.refreshBody()
      s.body.setSize(s.width * 0.9, Math.min(s.height * 0.45, 40)).setOffset(s.width * 0.05, s.height - Math.min(s.height * 0.45, 40))
      return s
    }
    for (const d of DECOR) poser(d.cle, d.x, d.y)
    for (const l of LIEUX.filter((l) => l.batiment)) {
      const s = poser(l.batiment, l.x, l.y)
      if (this.anims.exists(l.batiment)) s.play(l.batiment)
    }

    const pos = this.registry.get('positionJack') ?? { x: mx(DEPART.x), y: my(DEPART.y) + TUILE / 2 }
    this.jack = creerJack(this, pos.x, pos.y, 'haut')
    this.physics.add.collider(this.jack, sol)
    this.physics.add.collider(this.jack, obstacles)

    this.cameras.main.setBounds(0, 0, carte.widthInPixels, carte.heightInPixels).startFollow(this.jack, true).setRoundPixels(true)
    this.entrees = creerEntrees(this)
  }

  update() {
    this.jack.piloter(this.entrees.direction())
  }
}
