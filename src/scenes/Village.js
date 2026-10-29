import Phaser from 'phaser'
import { TUILE, PROF } from '../config.js'
import { ORANGE } from '../art/palette.js'
import { CARTE, BLOQUANTES, DECOR, DEPART } from '../data/carte.js'
import { LIEUX } from '../data/lieux.js'
import { creerProgression, prochainLieu, estAccessible, braise } from '../logique/progression.js'
import { creerJack } from '../ui/jack.js'
import { creerEntrees } from '../ui/entrees.js'
import { creerLumiere, lanterneDe } from '../ui/lumiere.js'
import { creerInvite } from '../ui/invite.js'
import { creerFrise } from './village/frise.js'
import { creerCartes, relireCartes } from './village/cartes.js'
import { creerChasse } from './village/chasse.js'
import { creerDiable } from './village/diable.js'
import { creerPluie } from '../ui/pluie.js'

// Tuiles → pixels du monde (centre horizontal de la tuile).
const mx = (x) => x * TUILE + TUILE / 2
const my = (y) => y * TUILE
const porte = (l) => ({ x: mx(l.porte.x), y: my(l.porte.y) + TUILE / 2 })
const DISTANCE_PORTE = 36

export default class Village extends Phaser.Scene {
  constructor() { super('Village') }

  create({ chasse } = {}) {
    if (!this.registry.has('progression')) this.registry.set('progression', creerProgression(LIEUX.map((l) => l.id)))
    this.progression = this.registry.get('progression')

    const carte = this.make.tilemap({ data: CARTE, tileWidth: TUILE, tileHeight: TUILE })
    const sol = carte.createLayer(0, carte.addTilesetImage('tuiles'), 0, 0)
    sol.setCollision(BLOQUANTES)
    this.physics.world.setBounds(0, 0, carte.widthInPixels, carte.heightInPixels)

    // Bâtiments et décors : posés par le bas, seule la base bloque (on passe « derrière » le toit).
    // Chacun garde une petite lueur (fenêtres, feu), sauf les lieux encore verrouillés, pour qu'on devine le village dans le noir.
    const obstacles = this.physics.add.staticGroup()
    this.lueurs = []
    const poser = (cle, x, y, eclaire = true) => {
      const s = obstacles.create(mx(x), my(y), cle).setOrigin(0.5, 1).setDepth(my(y))
      s.refreshBody()
      const h = Math.min(s.height * 0.45, 40)
      s.body.setSize(s.width * 0.9, h).setOffset(s.width * 0.05, s.height - h)
      if (cle !== 'pierre' && eclaire) this.lueurs.push({ x: s.x, y: s.y - s.height * 0.4, r: Math.min(s.width, 70) * 0.7 })
      return s
    }
    const rueOuverte = estAccessible(this.progression, 'rue') // les maisons de la rue s'allument avec elle
    for (const d of DECOR) {
      const s = poser(d.cle, d.x, d.y, d.cle !== 'maison' || rueOuverte)
      if (d.cle === 'maison' && !rueOuverte) s.setFrame(1)
    }
    for (const l of LIEUX.filter((l) => l.batiment)) {
      const s = poser(l.batiment, l.x, l.y, estAccessible(this.progression, l.id)) // lieu verrouillé : éteint
      if (this.anims.exists(l.batiment)) s.play(l.batiment)
    }

    const pos = this.registry.get('positionJack') ?? { x: mx(DEPART.x), y: my(DEPART.y) + TUILE / 2 }
    this.jack = creerJack(this, pos.x, pos.y, 'haut')
    this.physics.add.collider(this.jack, sol)
    this.physics.add.collider(this.jack, obstacles)
    this.cameras.main.setBounds(0, 0, carte.widthInPixels, carte.heightInPixels).startFollow(this.jack, true).setRoundPixels(true)

    this.eclairer = creerLumiere(this)
    creerPluie(this)
    this.creerGuide()
    creerFrise(this, this.progression)
    this.cartes = creerCartes(this)
    this.cartes.compteur.on('pointerdown', (p, x, y, e) => { e.stopPropagation(); this.lire(() => relireCartes(this)) })
    this.enLecture = false

    // Épilogue : plus de lueurs ni de guide, seule la lanterne cherche la citrouille.
    this.chasse = chasse ? creerChasse(this) : null
    const id = prochainLieu(this.progression)
    this.diable = this.chasse || !id ? null : creerDiable(this, porte(LIEUX.find((l) => l.id === id)))
    if (this.chasse) {
      this.lueurs = []
      this.lire(() => this.chasse.intro())
    }
    this.invite = creerInvite(this, () => this.entrer())
    this.entrees = creerEntrees(this)
  }

  // Lueur orange qui pulse sur le prochain lieu, et flèche au bord de l'écran quand il est hors champ.
  creerGuide() {
    this.guide = this.add.image(0, 0, 'halo').setTint(ORANGE).setBlendMode('ADD').setDepth(PROF.LUEUR).setScale(0.5)
    this.tweens.add({ targets: this.guide, alpha: 0.35, scale: 0.38, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.inOut' })
    this.fleche = this.add.triangle(0, 0, 0, -12, 26, 0, 0, 12, ORANGE).setScrollFactor(0).setDepth(PROF.INTERFACE)
  }

  // Jack s'arrête le temps de lire une carte.
  async lire(bulle) {
    if (this.enLecture) return
    this.enLecture = true
    this.invite.cacher()
    await bulle()
    this.enLecture = false
  }

  entrer() {
    if (this.enLecture) return
    if (!this.lieuProche && this.carteProche) return this.lire(() => this.cartes.ramasser(this.carteProche))
    const l = this.lieuProche
    if (!l || !estAccessible(this.progression, l.id)) return
    this.registry.set('positionJack', { x: this.jack.x, y: this.jack.y })
    this.scene.start(l.scene, { lieu: l })
  }

  update(temps, delta) {
    this.jack.piloter(this.enLecture ? { x: 0, y: 0 } : this.entrees.direction())
    const lanterne = lanterneDe(this.jack, temps)
    lanterne.r *= braise(this.progression)
    this.diable?.(this.jack)
    this.eclairer([this.chasse ? this.chasse.lanterne(lanterne, this.jack, temps) : lanterne, ...this.lueurs, ...this.cartes.lueurs()])
    if (this.enLecture) return
    if (this.chasse?.trouvee(this.jack, delta / 1000)) return this.lire(() => this.chasse.fin())

    this.majGuide()
    this.majInvite()
    if (this.entrees.action()) this.entrer()
  }

  majGuide() {
    const id = prochainLieu(this.progression)
    const cible = this.chasse ? this.chasse.cible() : id && porte(LIEUX.find((l) => l.id === id))
    this.guide.setVisible(!!cible && !this.chasse)
    this.fleche.setVisible(false)
    if (!cible) return
    this.guide.setPosition(cible.x, cible.y - TUILE)

    const cam = this.cameras.main
    const sx = cible.x - cam.scrollX, sy = cible.y - cam.scrollY
    const { width: w, height: h } = this.scale
    const marge = 30, haut = 80 // haut : sous la frise
    if (sx > marge && sx < w - marge && sy > haut && sy < h - marge) return
    const angle = Math.atan2(sy - h / 2, sx - w / 2)
    this.fleche.setVisible(true).setRotation(angle)
      .setPosition(Phaser.Math.Clamp(sx, marge, w - marge), Phaser.Math.Clamp(sy, haut, h - marge))
  }

  majInvite() {
    const pieds = { x: this.jack.x, y: this.jack.y + 12 }
    this.lieuProche = !this.chasse && LIEUX.find((l) => {
      const p = porte(l)
      return Phaser.Math.Distance.Between(pieds.x, pieds.y, p.x, p.y) < DISTANCE_PORTE
    })
    const l = this.lieuProche
    this.carteProche = !l && this.cartes.proche(pieds.x, pieds.y)
    if (this.carteProche) return this.invite.montrer('Une carte ! Lire (toucher ou Espace)')
    if (!l) return this.invite.cacher()
    const ouvert = estAccessible(this.progression, l.id)
    const fait = this.progression.faits.has(l.id)
    this.invite.montrer(ouvert ? `${l.nom} · ${fait ? 'revoir' : 'entrer'} (toucher ou Espace)` : "C'est fermé… pour l'instant.")
  }
}
