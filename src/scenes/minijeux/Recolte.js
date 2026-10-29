import Phaser from 'phaser'
import { POLICE, PROF } from '../../config.js'
import { ORANGE } from '../../art/palette.js'
import { jauge, tirer, ZONE, creerRecolte, recolter, issueRecolte } from '../../logique/recolte.js'
import { afficherBulle, typo } from '../../ui/bulle.js'
import { fondNuit } from '../../ui/fond.js'
import { gagner, rejouer, boutonQuitter } from './finir.js'
import { creerPluie } from '../../ui/pluie.js'
import { bruit } from '../../son.js'

const NAVETS = 5
const OBJECTIF = 3
const SOL = 330 // haut de la terre : seules les fanes dépassent
const JAUGE = { x: 280, y: 450, w: 400, h: 22 }

// Navet dessiné à l'encre : fanes, haut violet, chair crème. Origine au pied des fanes.
function dessinerNavet(scene, x, taille) {
  const w = 70 * taille, h = 66 * taille
  const g = scene.add.graphics()
  g.fillStyle(0x5a7d3a).lineStyle(3, 0x2b1d10)
  for (const a of [-0.5, 0, 0.5]) {
    const f = new Phaser.Geom.Ellipse(a * w * 0.35, -22 * taille, 14 * taille, 40 * taille)
    g.fillEllipseShape(f); g.strokeEllipseShape(f)
  }
  g.fillStyle(0x8a5a7a).fillEllipse(0, h / 2, w, h)
  g.fillStyle(0xe6dcc3).fillEllipse(0, h / 2 + h * 0.18, w * 0.94, h * 0.64)
  g.lineStyle(4, 0x2b1d10).strokeEllipse(0, h / 2, w, h).lineBetween(0, h, 4, h + 16 * taille)
  return scene.add.container(x, SOL + 12, [g]).setDepth(1)
}

// Ferme : arracher les navets au bon dosage, garder le plus gros pour la lanterne.
export default class Recolte extends Phaser.Scene {
  constructor() { super('Recolte') }

  async create({ lieu }) {
    this.lieu = lieu
    this.actif = false
    this.recolte = creerRecolte(NAVETS, OBJECTIF)
    fondNuit(this, lieu.nom)
    boutonQuitter(this)
    creerPluie(this)

    this.navets = Array.from({ length: NAVETS }, (_, i) => {
      const taille = Phaser.Math.FloatBetween(0.75, 1.3)
      return Object.assign(dessinerNavet(this, 160 + i * 160, taille), { taille })
    })
    // La terre recouvre le corps des navets.
    this.add.rectangle(0, SOL, this.scale.width, 140, 0x4a3320).setOrigin(0).setDepth(2).setStrokeStyle(4, 0x2b1d10)
    this.halo = this.add.image(0, SOL - 10, 'halo').setTint(ORANGE).setBlendMode('ADD').setScale(0.5).setDepth(0)
    this.message = this.add.text(this.scale.width / 2, 96, '', { fontFamily: POLICE, fontSize: 28, color: '#dcc79a' }).setOrigin(0.5).setDepth(PROF.INTERFACE)

    // Jauge : la zone orange est le bon dosage.
    this.add.rectangle(JAUGE.x, JAUGE.y, JAUGE.w, JAUGE.h, 0xdcc79a, 0.3).setOrigin(0, 0.5).setStrokeStyle(3, 0x2b1d10).setDepth(3)
    this.add.rectangle(JAUGE.x + ZONE.min * JAUGE.w, JAUGE.y, (ZONE.max - ZONE.min) * JAUGE.w, JAUGE.h, ORANGE).setOrigin(0, 0.5).setDepth(3)
    this.curseur = this.add.rectangle(JAUGE.x, JAUGE.y, 6, JAUGE.h + 14, 0x2b1d10).setDepth(4)
    this.add.text(JAUGE.x + JAUGE.w / 2, JAUGE.y + 22, 'Toucher ou Espace pour tirer', {
      fontFamily: POLICE, fontSize: 20, color: '#b9a272', fontStyle: 'italic',
    }).setOrigin(0.5, 0).setDepth(3)

    this.courant = 0
    this.viser()
    await afficherBulle(this, lieu.consigne)
    this.actif = true
    this.temps = 0
    this.input.on('pointerdown', () => this.tirer())
    this.input.keyboard.on('keydown-SPACE', () => this.tirer())
  }

  viser() {
    const n = this.navets[this.courant]
    if (n) this.halo.setPosition(n.x, SOL - 10)
  }

  dire(t) {
    this.message.setText(typo(t)).setAlpha(1)
    this.tweens.killTweensOf(this.message)
    this.tweens.add({ targets: this.message, alpha: 0, delay: 900, duration: 400 })
  }

  tirer() {
    if (!this.actif) return
    const n = this.navets[this.courant]
    const resultat = tirer(jauge(this.temps, this.periode()))
    this.recolte = recolter(this.recolte, resultat)
    bruit(resultat)

    if (resultat === 'resiste') {
      this.dire('Il résiste ! Tire plus fort.')
      this.tweens.add({ targets: n, angle: 6, yoyo: true, repeat: 2, duration: 50 })
      return
    }
    if (resultat === 'casse') {
      this.dire('Trop fort ! Les fanes ont cassé.')
      this.tweens.add({ targets: n, alpha: 0.25, duration: 300 })
    } else {
      n.arrache = true
      this.dire(['Arraché !', 'Et de deux !', 'Joli navet !'][this.recolte.recoltes - 1] ?? 'Arraché !')
      this.tweens.add({ targets: n.setDepth(5), y: SOL - 120, duration: 400, ease: 'Back.out' })
    }
    this.courant++
    this.viser()
    this.temps = 0

    const issue = issueRecolte(this.recolte)
    if (!issue) return
    this.actif = false
    this.halo.setVisible(false)
    if (issue === 'gagne') this.time.delayedCall(700, () => this.allumer())
    else rejouer(this, 'Plus assez de navets… on recommence !')
  }

  // Le plus gros navet devient la lanterne.
  allumer() {
    const gros = this.navets.filter((n) => n.arrache).sort((a, b) => b.taille - a.taille)[0]
    for (const n of this.navets) if (n !== gros) this.tweens.add({ targets: n, alpha: 0, duration: 300 })
    this.dire('Le plus gros fera la lanterne !')
    const { width } = this.scale
    this.tweens.add({
      targets: gros, x: width / 2, y: 210, scale: 2.2 / gros.taille, duration: 700, ease: 'Sine.inOut',
      onComplete: () => {
        const visage = this.add.graphics().fillStyle(0xffcf6b)
        visage.fillTriangle(-18, 22, -6, 22, -12, 10).fillTriangle(6, 22, 18, 22, 12, 10)
        visage.fillTriangle(-16, 36, 16, 36, 0, 48)
        gros.add(visage)
        const flamme = this.add.image(gros.x, gros.y + 70, 'halo').setTint(ORANGE).setBlendMode('ADD').setScale(0.2).setDepth(6)
        this.tweens.add({ targets: flamme, scale: 1.2, duration: 700, ease: 'Back.out' })
        this.time.delayedCall(1600, () => gagner(this, this.lieu))
      },
    })
  }

  periode() { return 1.5 - this.recolte.recoltes * 0.15 } // de plus en plus vif

  update(temps, delta) {
    if (!this.actif) return
    this.temps += delta / 1000
    this.curseur.x = JAUGE.x + jauge(this.temps, this.periode()) * JAUGE.w
  }
}
