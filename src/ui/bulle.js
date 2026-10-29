import { POLICE, PROF, ECRAN } from '../config.js'
import { ORANGE } from '../art/palette.js'

const HAUTEUR_BULLE = 170
const VITESSE_ECRITURE = 22 // ms par lettre

// Espaces insécables de la typographie française : «, », : ! ? ne se retrouvent jamais seuls en bout de ligne.
export const typo = (t) => t.replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0')

const NOMS = { jack: 'Jack', diable: 'Le diable' }
// Pages : une chaîne est dite par le personnage par défaut (portrait), { diable: '…' } par le diable (voir D() dans data/lieux.js).

// Dialogue : cadre parchemin en bas de l'écran, portrait et nom de qui parle, texte écrit lettre par lettre.
// Toucher / Espace / Entrée : termine la page, puis passe à la suivante. Résout la promesse à la fin.
export function afficherBulle(scene, pages, portrait = 'jack') {
  pages = [].concat(pages)
  const qui = pages.map((p) => (typeof p === 'string' ? portrait : 'diable'))
  pages = pages.map((p) => typo(typeof p === 'string' ? p : p.diable))
  const { width, height } = ECRAN
  const y0 = height - HAUTEUR_BULLE - 16
  const z = PROF.INTERFACE + 1
  const objets = [
    scene.add.rectangle(16, y0, width - 32, HAUTEUR_BULLE, 0xdcc79a).setOrigin(0).setStrokeStyle(4, 0x2b1d10),
    scene.add.image(90, y0 + HAUTEUR_BULLE / 2, 'halo').setTint(ORANGE).setAlpha(0.5).setScale(0.6),
  ]
  const visage = scene.add.sprite(90, y0 + HAUTEUR_BULLE / 2, 'jack').setScale(4)
  const nom = scene.add.text(170, y0 + 10, '', { fontFamily: POLICE, fontSize: 20, color: '#e8731a', fontStyle: 'italic' })
  const texte = scene.add.text(170, y0 + 36, '', {
    fontFamily: POLICE, fontSize: 26, color: '#2b1d10', lineSpacing: 4, wordWrap: { width: width - 220 },
  })
  const suite = scene.add.text(width - 36, y0 + HAUTEUR_BULLE - 12, '▼', { fontFamily: POLICE, fontSize: 20, color: '#e8731a' }).setOrigin(1)
  scene.tweens.add({ targets: suite, alpha: 0.2, yoyo: true, repeat: -1, duration: 400 })
  objets.push(visage, nom, texte, suite)
  for (const o of objets) o.setScrollFactor(0).setDepth(z)

  return new Promise((resoudre) => {
    let page = 0, lettres = 0, minuterie = null

    const ecrire = () => {
      lettres = 0
      visage.setTexture(qui[page], qui[page] === 'jack' ? 1 : 0)
      nom.setText(NOMS[qui[page]])
      suite.setVisible(false)
      minuterie = scene.time.addEvent({
        delay: VITESSE_ECRITURE, repeat: pages[page].length - 1,
        callback: () => {
          texte.setText(pages[page].slice(0, ++lettres))
          if (lettres === pages[page].length) suite.setVisible(true)
        },
      })
    }
    const avancer = () => {
      if (lettres < pages[page].length) {               // finir la page d'un coup
        minuterie.remove()
        lettres = pages[page].length
        texte.setText(pages[page])
        suite.setVisible(true)
        return
      }
      if (++page < pages.length) return ecrire()
      scene.input.off('pointerdown', avancer)
      scene.input.keyboard.off('keydown-SPACE', avancer)
      scene.input.keyboard.off('keydown-ENTER', avancer)
      for (const o of objets) o.destroy()
      resoudre()
    }

    scene.input.on('pointerdown', avancer)
    scene.input.keyboard.on('keydown-SPACE', avancer)
    scene.input.keyboard.on('keydown-ENTER', avancer)
    ecrire()
  })
}
