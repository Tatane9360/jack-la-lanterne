import Phaser from 'phaser'
import { ORANGE } from '../../art/palette.js'
import { creerFeu, majFeu, issueFeu, DUREE_FEU } from '../../logique/feu.js'
import { afficherBulle } from '../../ui/bulle.js'
import { fondNuit } from '../../ui/fond.js'
import { gagner, rejouer, boutonQuitter } from './finir.js'
import { creerPluie } from '../../ui/pluie.js'
import { bruit, ambianceLocale } from '../../son.js'

const CENTRE = { x: 480, y: 300 }
const PORTEE_FEU = 50 // un esprit plus proche que ça touche le feu

// Samhain : chasser les esprits avant qu'ils n'atteignent le feu de joie.
export default class Feu extends Phaser.Scene {
  constructor() { super('Feu') }

  async create({ lieu }) {
    this.lieu = lieu
    this.feu = creerFeu()
    this.actif = false
    fondNuit(this, lieu.nom)
    boutonQuitter(this)
    creerPluie(this)
    ambianceLocale(this, 'feu')

    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2
      this.add.image(CENTRE.x + Math.cos(a) * 190, CENTRE.y + 20 + Math.sin(a) * 110, 'pierre').setScale(2.5).setOrigin(0.5, 1)
    }
    this.halo = this.add.image(CENTRE.x, CENTRE.y, 'halo').setTint(ORANGE).setBlendMode('ADD').setScale(1.6).setAlpha(0.8)
    this.flamme = this.add.sprite(CENTRE.x, CENTRE.y + 30, 'feu').play('feu').setOrigin(0.5, 1).setScale(7)
    this.barre = this.add.rectangle(180, 80, 600, 10, ORANGE).setOrigin(0, 0.5)
    this.add.rectangle(180, 80, 600, 10).setOrigin(0, 0.5).setStrokeStyle(2, 0xdcc79a, 0.6)
    this.esprits = this.add.group()

    await afficherBulle(this, lieu.consigne)
    this.actif = true
    this.prochainEsprit = 0
  }

  apparaitre() {
    // Depuis un bord au hasard, vers le feu.
    const { width, height } = this.scale
    const a = Math.random() * Math.PI * 2
    const r = Math.hypot(width, height) / 2 + 20
    const e = this.add.sprite(CENTRE.x + Math.cos(a) * r, CENTRE.y + Math.sin(a) * r, 'esprit').play('esprit').setScale(4).setAlpha(0.85)
    e.setInteractive({ useHandCursor: true }).on('pointerdown', () => this.chasser(e))
    e.phase = Math.random() * 10
    this.esprits.add(e)
  }

  chasser(e) {
    if (!this.actif || !e.active || e.chasse) return
    e.chasse = true
    bruit('esprit')
    e.disableInteractive()
    this.tweens.add({ targets: e, alpha: 0, scale: 6, duration: 250, onComplete: () => e.destroy() })
  }

  update(temps, delta) {
    if (!this.actif) return
    const dt = delta / 1000
    let touches = 0

    this.prochainEsprit -= dt
    if (this.prochainEsprit <= 0) {
      this.apparaitre()
      this.prochainEsprit = Math.max(0.55, 1.5 - this.feu.temps * 0.025)
    }
    const vitesse = 70 + this.feu.temps * 2.5
    for (const e of this.esprits.getChildren()) {
      if (e.chasse) continue
      const a = Math.atan2(CENTRE.y - e.y, CENTRE.x - e.x)
      e.x += Math.cos(a) * vitesse * dt
      e.y += Math.sin(a) * vitesse * dt + Math.sin(temps / 200 + e.phase) * 0.8
      e.setFlipX(Math.cos(a) < 0)
      if (Phaser.Math.Distance.Between(e.x, e.y, CENTRE.x, CENTRE.y) < PORTEE_FEU) { touches++; e.destroy() }
    }

    this.feu = majFeu(this.feu, dt, touches)
    if (touches) this.cameras.main.shake(150, 0.006)
    this.flamme.setScale(3 + 4 * this.feu.vie)
    this.halo.setScale(0.6 + this.feu.vie).setAlpha(0.3 + 0.5 * this.feu.vie)
    this.barre.width = 600 * Math.max(0, 1 - this.feu.temps / DUREE_FEU)

    const issue = issueFeu(this.feu)
    if (!issue) return
    this.actif = false
    for (const e of this.esprits.getChildren()) this.chasser(e)
    if (issue === 'gagne') this.time.delayedCall(800, () => gagner(this, this.lieu))
    else rejouer(this, "Le feu s'est éteint… on recommence !")
  }
}
