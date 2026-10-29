import Phaser from 'phaser'
import { POLICE, ECRAN } from '../../config.js'
import { creerRayon, poser, rayonPlein } from '../../logique/boutique.js'
import { afficherBulle } from '../../ui/bulle.js'
import { fondNuit } from '../../ui/fond.js'
import { gagner, boutonQuitter } from './finir.js'
import { bruit } from '../../son.js'

const TYPES = ['citrouille', 'bonbon', 'chapeau'] // une étagère par type, de haut en bas
const COLONNES = [570, 680, 790]
const ETAGERES = [200, 310, 420]
const CARTON = { x: 60, y: 250, w: 350, h: 230 }
const AIMANT = 60 // distance à laquelle un objet lâché « colle » à un emplacement
const ECHELLE = 3

// Boutique : glisser chaque objet du carton vers son étagère. Chronométré, pas d'échec.
export default class Boutique extends Phaser.Scene {
  constructor() { super('Boutique') }

  async create({ lieu }) {
    this.lieu = lieu
    fondNuit(this, lieu.nom)
    boutonQuitter(this)
    this.emplacements = TYPES.flatMap((type, r) => COLONNES.map((x) => ({ type, x, y: ETAGERES[r] })))
    this.rayon = creerRayon(this.emplacements.map((e) => e.type))
    this.dessinerMeubles()

    // Silhouettes : ce qui va où.
    for (const e of this.emplacements) this.add.image(e.x, e.y, e.type).setOrigin(0.5, 1).setScale(ECHELLE).setTintFill(0x2b1d10).setAlpha(0.25)

    // Les objets, en vrac dans le carton.
    const objets = Phaser.Utils.Array.Shuffle(this.emplacements.map((e) => e.type)).map((type, i) => {
      const o = this.add.image(
        CARTON.x + 65 + (i % 3) * 110 + Phaser.Math.Between(-10, 10),
        CARTON.y + 95 + Math.floor(i / 3) * 62 + Phaser.Math.Between(-6, 6),
        type,
      ).setScale(ECHELLE).setOrigin(0.5, 1).setAngle(Phaser.Math.Between(-15, 15))
      o.objet = type
      o.depart = { x: o.x, y: o.y, angle: o.angle }
      return o
    })

    this.chrono = this.add.text(ECRAN.width - 80, 24, '', { fontFamily: POLICE, fontSize: 30, color: '#dcc79a' }).setOrigin(1, 0)
    await afficherBulle(this, lieu.consigne)

    this.debut = this.time.now
    for (const o of objets) this.input.setDraggable(o.setInteractive({ useHandCursor: true }))
    // Position suivie via worldX : dragX/dragY de Phaser se trompent avec le zoom de caméra (main.js).
    this.input.on('dragstart', (p, o) => { o.setAngle(0).setDepth(10); o.prise = { x: p.worldX - o.x, y: p.worldY - o.y } })
    this.input.on('drag', (p, o) => o.setPosition(p.worldX - o.prise.x, p.worldY - o.prise.y))
    this.input.on('dragend', (p, o) => this.lacher(o))
  }

  dessinerMeubles() {
    const g = this.add.graphics()
    // Étagères
    g.fillStyle(0x6b4a2b).lineStyle(4, 0x2b1d10)
    for (const y of ETAGERES) { g.fillRect(500, y, 360, 14); g.strokeRect(500, y, 360, 14) }
    g.fillRect(500, 110, 14, 330).strokeRect(500, 110, 14, 330)
    g.fillRect(846, 110, 14, 330).strokeRect(846, 110, 14, 330)
    // Carton
    g.fillStyle(0xb9a272).fillRect(CARTON.x, CARTON.y, CARTON.w, CARTON.h).strokeRect(CARTON.x, CARTON.y, CARTON.w, CARTON.h)
    g.lineStyle(2, 0x2b1d10, 0.5).lineBetween(CARTON.x, CARTON.y + 30, CARTON.x + CARTON.w, CARTON.y + 30)
    this.add.text(CARTON.x + CARTON.w / 2, CARTON.y + CARTON.h + 12, 'Livraison du jour', {
      fontFamily: POLICE, fontSize: 22, color: '#b9a272', fontStyle: 'italic',
    }).setOrigin(0.5, 0)
  }

  lacher(o) {
    // Emplacement libre le plus proche ; la logique dit si c'est le bon type.
    const libres = this.emplacements.map((e, i) => ({ ...e, i })).filter((e) => !this.rayon[e.i].plein)
    const proche = libres.sort((a, b) => Phaser.Math.Distance.Between(o.x, o.y, a.x, a.y) - Phaser.Math.Distance.Between(o.x, o.y, b.x, b.y))[0]
    const res = proche && Phaser.Math.Distance.Between(o.x, o.y, proche.x, proche.y) < AIMANT ? poser(this.rayon, proche.i, o.objet) : { ok: false }
    if (!res.ok) {
      this.tweens.add({ targets: o, x: o.depart.x, y: o.depart.y, angle: o.depart.angle, duration: 250, ease: 'Back.out' })
      return
    }
    this.rayon = res.rayon
    bruit('pose')
    o.setPosition(proche.x, proche.y).setDepth(1).disableInteractive()
    this.tweens.add({ targets: o, scale: ECHELLE * 1.15, yoyo: true, duration: 120 })
    if (rayonPlein(this.rayon)) this.finir()
  }

  async finir() {
    const secondes = ((this.time.now - this.debut) / 1000).toFixed(1).replace('.', ',')
    this.debut = null
    await afficherBulle(this, `Rayon rempli en ${secondes} secondes. Les publicitaires seraient fiers de toi.`)
    gagner(this, this.lieu)
  }

  update() {
    if (this.debut) this.chrono.setText(`${((this.time.now - this.debut) / 1000).toFixed(1).replace('.', ',')} s`)
  }
}
