import Phaser from 'phaser'
import { POLICE, PROF } from '../../config.js'
import { creerRue, majRue, frapper, issueRue } from '../../logique/portes.js'
import { afficherBulle } from '../../ui/bulle.js'
import { creerJack } from '../../ui/jack.js'
import { creerEntrees } from '../../ui/entrees.js'
import { creerLumiere, lanterneDe } from '../../ui/lumiere.js'
import { creerInvite } from '../../ui/invite.js'
import { gagner, rejouer } from './finir.js'

const DELAIS = [14, 20, 26, 32, 38, 44] // secondes avant que chaque maison n'éteigne, mélangées à chaque partie
const OBJECTIF = 4
const BAS_MAISONS = 250
const DISTANCE_PORTE = 44

// Rue américaine : frapper aux portes encore allumées avant qu'elles ne s'éteignent.
export default class Portes extends Phaser.Scene {
  constructor() { super('Portes') }

  async create({ lieu }) {
    this.lieu = lieu
    this.actif = false
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#0b0705')
    this.add.tileSprite(0, 0, width, height, 'tuiles', 0).setOrigin(0)
    this.add.tileSprite(0, BAS_MAISONS + 20, width, 150, 'tuiles', 4).setOrigin(0)

    this.rue = creerRue(Phaser.Utils.Array.Shuffle([...DELAIS]), OBJECTIF)
    this.maisons = this.rue.restants.map((_, i) =>
      this.add.sprite(80 + i * 160, BAS_MAISONS, 'maison', 0).setOrigin(0.5, 1).setScale(1.6).setDepth(BAS_MAISONS))

    this.physics.world.setBounds(0, BAS_MAISONS + 5, width, height - BAS_MAISONS - 70)
    this.jack = creerJack(this, width / 2, BAS_MAISONS + 120, 'haut')
    this.eclairer = creerLumiere(this)
    this.invite = creerInvite(this, () => this.frapper())
    this.entrees = creerEntrees(this)

    this.add.text(20, 16, lieu.nom, { fontFamily: POLICE, fontSize: 30, color: '#e8731a' }).setDepth(PROF.INTERFACE)
    this.score = this.add.text(width - 20, 16, '', { fontFamily: POLICE, fontSize: 30, color: '#dcc79a' }).setOrigin(1, 0).setDepth(PROF.INTERFACE)
    this.majScore()

    await afficherBulle(this, lieu.consigne)
    this.actif = true
  }

  majScore() { this.score.setText(`Bonbons : ${this.rue.bonbons} / ${OBJECTIF}`) }

  maisonProche() {
    const i = this.maisons.findIndex((m) => Phaser.Math.Distance.Between(this.jack.x, this.jack.y + 12, m.x, m.y + 16) < DISTANCE_PORTE)
    return i < 0 ? null : i
  }

  frapper() {
    const i = this.maisonProche()
    if (!this.actif || i === null) return
    const avant = this.rue.bonbons
    this.rue = frapper(this.rue, i)
    if (this.rue.bonbons === avant) return
    const m = this.maisons[i]
    const bonbon = this.add.image(m.x, m.y - 30, 'bonbon').setScale(3).setDepth(PROF.INTERFACE)
    this.tweens.add({ targets: bonbon, y: m.y - 90, alpha: 0, duration: 900, onComplete: () => bonbon.destroy() })
    this.add.image(m.x, m.y - m.displayHeight - 10, 'bonbon').setScale(2).setDepth(PROF.INTERFACE) // déjà visitée
    this.majScore()
  }

  update(temps, delta) {
    this.jack.piloter(this.actif ? this.entrees.direction() : { x: 0, y: 0 })
    if (this.actif) this.rue = majRue(this.rue, delta / 1000)

    // Une maison s'éteint quand son délai est écoulé ; elle clignote juste avant.
    const sources = [lanterneDe(this.jack, temps)]
    this.maisons.forEach((m, i) => {
      const t = this.rue.restants[i]
      m.setFrame(t > 0 ? 0 : 1)
      const clignote = t > 0 && t < 3 && Math.floor(temps / 150) % 2
      if (t > 0 && !clignote) sources.push({ x: m.x, y: m.y - 40, r: 80 })
    })
    this.eclairer(sources)

    const i = this.maisonProche()
    const allumee = i !== null && this.rue.restants[i] > 0 && !this.rue.visitees.includes(i)
    if (this.actif && allumee) this.invite.montrer('Frapper (toucher ou Espace)')
    else this.invite.cacher()
    if (this.entrees.action()) this.frapper()

    const issue = this.actif && issueRue(this.rue)
    if (!issue) return
    this.actif = false
    if (issue === 'gagne') this.time.delayedCall(900, () => gagner(this, this.lieu))
    else rejouer(this, 'Toutes les lumières sont éteintes… on recommence !')
  }
}
