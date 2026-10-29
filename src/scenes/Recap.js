import Phaser from 'phaser'
import { POLICE } from '../config.js'
import { LIEUX } from '../data/lieux.js'
import { fondNuit } from '../ui/fond.js'
import { typo } from '../ui/bulle.js'
import { CARTES } from '../data/cartes.js'
import { cartesTrouvees, relireCartes } from './village/cartes.js'

// Écran final : les anecdotes en phrases courtes, faciles à raconter.
export default class Recap extends Phaser.Scene {
  constructor() { super('Recap') }

  create() {
    const { width } = this.scale
    fondNuit(this, 'Ce que tu pourras raconter ce soir')
    this.cameras.main.fadeIn(600)

    LIEUX.forEach((l, i) => {
      const y = 104 + i * 74
      const icone = this.add.image(90, y + 14, l.batiment ?? 'maison').setOrigin(0.5)
      icone.setScale(44 / Math.max(icone.width, icone.height))
      const epoque = this.add.text(140, y - 6, l.epoque, { fontFamily: POLICE, fontSize: 17, color: '#e8731a' })
      const texte = this.add.text(140, y + 14, typo(l.recap), {
        fontFamily: POLICE, fontSize: 22, color: '#dcc79a', wordWrap: { width: width - 200 },
      })
      for (const o of [icone, epoque, texte]) {
        o.setAlpha(0)
        this.tweens.add({ targets: o, alpha: 1, x: o.x + 10, delay: 500 + i * 700, duration: 500 })
      }
    })

    const n = cartesTrouvees(this.registry).size
    const cartes = this.add.text(width / 2 + 90, 506, `Tes cartes ${n}/${CARTES.length}`, {
      fontFamily: POLICE, fontSize: 24, color: '#dcc79a', backgroundColor: '#2b1d10', padding: { x: 16, y: 8 },
    }).setOrigin(0, 0.5).setAlpha(0)
    const rejouer = this.add.text(width / 2 + 70, 506, 'Rejouer', {
      fontFamily: POLICE, fontSize: 28, color: '#2b1d10', backgroundColor: '#e8731a', padding: { x: 20, y: 6 },
    }).setOrigin(1, 0.5).setAlpha(0)
    this.tweens.add({ targets: [rejouer, cartes], alpha: 1, delay: 500 + LIEUX.length * 700, duration: 500 })
    this.time.delayedCall(500 + LIEUX.length * 700, () => {
      rejouer.setInteractive({ useHandCursor: true }).on('pointerdown', (p, x, y, e) => { e.stopPropagation(); this.recommencer() })
      cartes.setInteractive({ useHandCursor: true }).on('pointerdown', async (p, x, y, e) => {
        e.stopPropagation()
        if (this.enLecture) return
        this.enLecture = true
        await relireCartes(this)
        this.enLecture = false
      })
      this.input.keyboard.on('keydown-ENTER', () => this.recommencer())
    })
  }

  recommencer() {
    if (this.enLecture) return // Entrée sert alors à tourner les pages
    this.registry.remove('progression')
    this.registry.remove('positionJack')
    this.registry.remove('cartes')
    this.scene.start('Titre')
  }
}
