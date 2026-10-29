import Phaser from 'phaser'
import { POLICE } from '../../config.js'
import { ORANGE } from '../../art/palette.js'
import { ZONES, zonesTouchees, visageFini } from '../../logique/navet.js'
import { afficherBulle } from '../../ui/bulle.js'
import { fondNuit } from '../../ui/fond.js'
import { gagner } from './finir.js'

// Navet dessiné en grand : boîte englobante (coordonnées 0..1 de logique/navet.js).
const N = { x: 350, y: 150, w: 260, h: 250 }
const versEcran = (z) => ({ x: N.x + z.x * N.w, y: N.y + z.y * N.h })

// Ferme : tracer un visage sur le navet. Pas d'échec possible, bouton « Effacer ».
export default class Navet extends Phaser.Scene {
  constructor() { super('Navet') }

  async create({ lieu }) {
    this.lieu = lieu
    fondNuit(this, lieu.nom)
    this.dessinerNavet()
    this.lueurs = this.add.layer()
    this.traits = this.add.graphics()
    this.points = []
    this.allumees = new Set()

    // Repères discrets : où creuser les yeux et la bouche.
    const reperes = this.add.graphics().lineStyle(2, 0x2b1d10, 0.35)
    for (const z of Object.values(ZONES)) { const p = versEcran(z); reperes.strokeCircle(p.x, p.y, z.r * N.w * 0.8) }

    this.add.text(this.scale.width - 30, 120, 'Effacer', {
      fontFamily: POLICE, fontSize: 26, color: '#2b1d10', backgroundColor: '#dcc79a', padding: { x: 14, y: 6 },
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true }).on('pointerdown', (p, x, y, e) => { e.stopPropagation(); this.effacer() })

    await afficherBulle(this, lieu.consigne)
    this.actif = true
    this.input.on('pointerdown', (p) => { this.precedent = { x: p.x, y: p.y } })
    this.input.on('pointermove', (p) => this.tracer(p))
    this.input.on('pointerup', () => { this.precedent = null })
  }

  dessinerNavet() {
    const g = this.add.graphics()
    const cx = N.x + N.w / 2, cy = N.y + N.h / 2
    // Fanes
    g.fillStyle(0x5a7d3a).lineStyle(4, 0x2b1d10)
    for (const a of [-0.5, 0, 0.5]) {
      const t = new Phaser.Geom.Ellipse(cx + a * 70, N.y - 20, 34, 80)
      g.fillEllipseShape(t); g.strokeEllipseShape(t)
    }
    // Corps : chair crème, haut violet (découpé par la forme du navet)
    g.fillStyle(0xe6dcc3).fillEllipse(cx, cy, N.w, N.h)
    const forme = this.make.graphics({ add: false }).fillStyle(0xffffff).fillEllipse(cx, cy, N.w, N.h)
    this.add.graphics().fillStyle(0x8a5a7a).fillRect(N.x, N.y, N.w, N.h * 0.3).setMask(forme.createGeometryMask())
    // Contour et petite racine à l'encre
    this.add.graphics().lineStyle(5, 0x2b1d10).strokeEllipse(cx, cy, N.w, N.h)
      .lineStyle(4, 0x2b1d10).lineBetween(cx, N.y + N.h, cx + 6, N.y + N.h + 26)
    this.add.text(cx, this.scale.height - 30, 'Trace au doigt ou à la souris', {
      fontFamily: POLICE, fontSize: 22, color: '#b9a272', fontStyle: 'italic',
    }).setOrigin(0.5, 1)
  }

  tracer(p) {
    if (!this.actif || !p.isDown || !this.precedent) return
    const nx = (p.x - N.x) / N.w, ny = (p.y - N.y) / N.h
    if (Math.hypot(nx - 0.5, ny - 0.5) > 0.5) { this.precedent = { x: p.x, y: p.y }; return } // hors du navet
    this.traits.lineStyle(9, 0x2b1d10).lineBetween(this.precedent.x, this.precedent.y, p.x, p.y)
    this.precedent = { x: p.x, y: p.y }
    this.points.push({ x: nx, y: ny })

    // Chaque zone creusée s'éclaire de l'intérieur.
    for (const k of zonesTouchees(this.points)) {
      if (this.allumees.has(k)) continue
      this.allumees.add(k)
      const z = ZONES[k], c = versEcran(z)
      const lueur = this.add.ellipse(c.x, c.y, z.r * N.w * 1.6, z.r * N.h * 1.3, 0xffcf6b).setAlpha(0)
      this.lueurs.add(lueur)
      this.tweens.add({ targets: lueur, alpha: 0.85, duration: 300 })
    }
    if (visageFini(this.points)) this.allumer()
  }

  effacer() {
    if (!this.actif) return
    this.traits.clear(); this.lueurs.removeAll(true)
    this.points = []; this.allumees.clear()
  }

  async allumer() {
    this.actif = false
    const cx = N.x + N.w / 2, cy = N.y + N.h / 2
    const flamme = this.add.image(cx, cy, 'halo').setTint(ORANGE).setBlendMode('ADD').setScale(0.2)
    this.tweens.add({ targets: flamme, scale: 1.2, duration: 700, ease: 'Back.out' })
    this.tweens.add({ targets: flamme, alpha: 0.7, yoyo: true, repeat: -1, duration: 160, delay: 700 })
    this.time.delayedCall(1600, () => gagner(this, this.lieu))
  }
}
