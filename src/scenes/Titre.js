import Phaser from 'phaser'
import { POLICE, ECRAN } from '../config.js'
import { ORANGE } from '../art/palette.js'
import { INTRO } from '../data/lieux.js'
import { afficherBulle } from '../ui/bulle.js'
import { demarrerAmbiance, bruit } from '../son.js'

const { FloatBetween, Between } = Phaser.Math
const MOINS_DE_MOUVEMENT = matchMedia('(prefers-reduced-motion: reduce)').matches

// Une chauve-souris traverse l'écran de (x0, y0) à (x1, y1) en zigzaguant.
function voler(scene, x0, y0, x1, y1, duree, echelle, profondeur) {
  const b = scene.add.sprite(x0, y0, 'chauve-souris').play('chauve-souris').setScale(echelle).setDepth(profondeur)
  b.anims.timeScale = FloatBetween(0.8, 1.5)
  const amp = Between(8, 30), tours = FloatBetween(1.5, 4), phase = FloatBetween(0, 6)
  scene.tweens.addCounter({
    duration: duree,
    onUpdate: (tw) => {
      const t = tw.getValue(), ondule = Math.sin((t * tours + phase) * Math.PI * 2) * amp
      b.setPosition(x0 + (x1 - x0) * t + ondule * 0.5, y0 + (y1 - y0) * t + ondule)
    },
    onComplete: () => b.destroy(),
  })
}

// Diagonale d'en bas à gauche à en haut à droite, décalée de o le long de sa perpendiculaire.
function diagonale(scene, o, duree, echelle, profondeur) {
  const { width: w, height: h } = ECRAN
  const n = Math.hypot(w, h), px = (h / n) * o, py = (w / n) * o
  voler(scene, -40 + px, h + 40 + py, w + 40 + px, -40 + py, duree, echelle, profondeur)
}

// La nuée, une seule fois au début : une nuée dense qui balaie l'écran avec son cri, les plus grosses (proches) plus vite.
function nuee(scene) {
  bruit('chauve-souris')
  for (let i = 0; i < (MOINS_DE_MOUVEMENT ? 12 : 70); i++) {
    const proche = Math.random()
    scene.time.delayedCall(Between(0, 1500), () =>
      diagonale(scene, FloatBetween(-260, 260), 2400 - proche * 1200, 1.5 + proche * 2.5, 5 + proche))
  }
}

export default class Titre extends Phaser.Scene {
  constructor() { super('Titre') }

  create() {
    const { width } = ECRAN
    this.cameras.main.setBackgroundColor('#0b0705').fadeIn(600)
    this.add.text(width / 2, 50, 'Jack et la lanterne', { fontFamily: POLICE, fontSize: 64, color: '#e8731a' }).setOrigin(0.5, 0)
    this.add.text(width / 2, 128, "Une petite histoire d'Halloween", { fontFamily: POLICE, fontSize: 26, color: '#b9a272', fontStyle: 'italic' }).setOrigin(0.5, 0)

    const halo = this.add.image(width / 2 + 30, 290, 'halo').setTint(ORANGE).setBlendMode('ADD').setScale(1.4).setAlpha(0.6)
    this.tweens.add({ targets: halo, alpha: 0.4, scale: 1.3, yoyo: true, repeat: -1, duration: 140, ease: 'Sine.inOut' })
    this.add.sprite(width / 2, 300, 'jack').play('jack-bas').setScale(7)

    const invite = this.add.text(width / 2, 470, 'Toucher ou Espace pour commencer', { fontFamily: POLICE, fontSize: 28, color: '#dcc79a' }).setOrigin(0.5)
    this.tweens.add({ targets: invite, alpha: 0.3, yoyo: true, repeat: -1, duration: 700 })

    // Deux éclaireuses à l'arrivée, puis, de temps en temps, une chauve-souris lointaine derrière le titre.
    this.time.delayedCall(700, () => diagonale(this, -120, 2600, 2.5, 5))
    this.time.delayedCall(1300, () => diagonale(this, 60, 2200, 3, 5))
    const auHasard = () => this.time.delayedCall(Between(2500, 6000), () => {
      const versDroite = Math.random() < 0.5, y = Between(30, 260)
      voler(this, versDroite ? -30 : width + 30, y, versDroite ? width + 30 : -30, y + Between(-80, 40), Between(3500, 5500), FloatBetween(1, 1.8), -1)
      auHasard()
    })
    this.time.delayedCall(3000, auHasard)

    const commencer = async () => {
      this.input.off('pointerdown', commencer)
      this.input.keyboard.off('keydown-SPACE', commencer)
      this.input.keyboard.off('keydown-ENTER', commencer)
      invite.setVisible(false)
      demarrerAmbiance(this)
      nuee(this)
      await new Promise((fini) => this.time.delayedCall(1400, fini)) // le dialogue s'ouvre quand la nuée s'éclaircit
      await afficherBulle(this, INTRO)
      this.scene.start('Village')
    }
    this.input.once('pointerdown', commencer)
    this.input.keyboard.once('keydown-SPACE', commencer)
    this.input.keyboard.once('keydown-ENTER', commencer)
  }
}
