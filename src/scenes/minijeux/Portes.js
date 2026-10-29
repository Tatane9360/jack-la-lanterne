import Phaser from 'phaser'
import { POLICE, PROF } from '../../config.js'
import { creerRue, majRue, frapper, issueRue } from '../../logique/portes.js'
import { afficherBulle } from '../../ui/bulle.js'
import { creerJack } from '../../ui/jack.js'
import { creerEntrees } from '../../ui/entrees.js'
import { creerLumiere, lanterneDe } from '../../ui/lumiere.js'
import { creerInvite } from '../../ui/invite.js'
import { gagner, rejouer, boutonQuitter } from './finir.js'

const DELAIS = [14, 20, 26, 32, 38, 44] // secondes avant que chaque maison n'éteigne, mélangées à chaque partie
const OBJECTIF = 4 // = toutes les maisons à bonbons
const SORTS = 2
const BAS_MAISONS = 250
const DISTANCE_PORTE = 44

// Rue américaine : frapper aux portes encore allumées avant qu'elles ne s'éteignent.
// Bonbon ou sort : seules les maisons avec une citrouille allumée devant donnent des bonbons.
export default class Portes extends Phaser.Scene {
  constructor() { super('Portes') }

  async create({ lieu }) {
    this.lieu = lieu
    this.actif = false
    const { width, height } = this.scale
    this.cameras.main.setBackgroundColor('#0b0705')
    this.add.tileSprite(0, 0, width, height, 'tuiles', 0).setOrigin(0)
    boutonQuitter(this)
    this.add.tileSprite(0, BAS_MAISONS + 20, width, 150, 'tuiles', 4).setOrigin(0)

    const sorts = Phaser.Utils.Array.Shuffle(DELAIS.map((_, i) => i)).slice(0, SORTS)
    this.rue = creerRue(Phaser.Utils.Array.Shuffle([...DELAIS]), OBJECTIF, sorts)
    this.maisons = this.rue.restants.map((_, i) =>
      this.add.sprite(80 + i * 160, BAS_MAISONS, 'maison', 0).setOrigin(0.5, 1).setScale(1.6).setDepth(BAS_MAISONS))
    this.citrouilles = this.maisons.map((m, i) =>
      sorts.includes(i) ? null : this.add.image(m.x + 40, m.y + 6, 'citrouille').setOrigin(0.5, 1).setScale(2).setDepth(BAS_MAISONS + 1))

    this.physics.world.setBounds(0, BAS_MAISONS + 5, width, height - BAS_MAISONS - 70)
    this.jack = creerJack(this, width / 2, BAS_MAISONS + 120, 'haut')
    this.eclairer = creerLumiere(this)
    this.invite = creerInvite(this, () => this.frapper())
    this.entrees = creerEntrees(this)

    this.add.text(20, 16, lieu.nom, { fontFamily: POLICE, fontSize: 30, color: '#e8731a' }).setDepth(PROF.INTERFACE)
    this.score = this.add.text(width - 80, 16, '', { fontFamily: POLICE, fontSize: 30, color: '#dcc79a' }).setOrigin(1, 0).setDepth(PROF.INTERFACE)
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
    const avant = this.rue
    this.rue = frapper(this.rue, i)
    if (this.rue === avant) return
    const m = this.maisons[i]
    if (this.rue.sort) return this.ensorceler(m)
    const bonbon = this.add.image(m.x, m.y - 30, 'bonbon').setScale(3).setDepth(PROF.INTERFACE)
    this.tweens.add({ targets: bonbon, y: m.y - 90, alpha: 0, duration: 900, onComplete: () => bonbon.destroy() })
    this.add.image(m.x, m.y - m.displayHeight - 10, 'bonbon').setScale(2).setDepth(PROF.INTERFACE) // déjà visitée
    this.majScore()
  }

  // Pas de citrouille, pas de bonbon : un esprit jaillit de la porte.
  ensorceler(m) {
    const e = this.add.sprite(m.x, m.y - 20, 'esprit').play('esprit').setScale(3).setDepth(PROF.INTERFACE)
    this.tweens.add({ targets: e, y: m.y - 140, scale: 7, alpha: 0.4, duration: 900 })
    this.cameras.main.shake(300, 0.01)
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
      const c = this.citrouilles[i]
      if (c && t > 0) sources.push({ x: c.x, y: c.y - 10, r: 36 })
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
    else rejouer(this, this.rue.sort ? 'Un sort ! On recommence…' : 'Toutes les lumières sont éteintes… on recommence !')
  }
}
