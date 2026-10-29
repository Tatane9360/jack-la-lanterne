import { POLICE, PROF, ECRAN } from '../config.js'
import { ORANGE } from '../art/palette.js'

const HAUTEUR_BULLE = 170
const VITESSE_ECRITURE = 22 // ms par lettre

// Espaces insécables de la typographie française : «, », : ! ? ne se retrouvent jamais seuls en bout de ligne.
export const typo = (t) => t.replace(/ ([:;!?»])/g, '\u00a0$1').replace(/« /g, '«\u00a0')

// Jack parle (ou le diable, avec portrait = 'diable') : cadre parchemin en bas de l'écran, texte écrit lettre par lettre.
// Toucher / Espace / Entrée : termine la page, puis passe à la suivante. Résout la promesse à la fin.
export function afficherBulle(scene, pages, portrait = 'jack') {
  pages = [].concat(pages).map(typo)
  const { width, height } = ECRAN
  const y0 = height - HAUTEUR_BULLE - 16
  const z = PROF.INTERFACE + 1
  const objets = [
    scene.add.rectangle(16, y0, width - 32, HAUTEUR_BULLE, 0xdcc79a).setOrigin(0).setStrokeStyle(4, 0x2b1d10),
    scene.add.image(90, y0 + HAUTEUR_BULLE / 2, 'halo').setTint(ORANGE).setAlpha(0.5).setScale(0.6),
    scene.add.sprite(90, y0 + HAUTEUR_BULLE / 2, portrait, portrait === 'jack' ? 1 : 0).setScale(4),
  ]
  const texte = scene.add.text(170, y0 + 18, '', {
    fontFamily: POLICE, fontSize: 26, color: '#2b1d10', lineSpacing: 4, wordWrap: { width: width - 220 },
  })
  const suite = scene.add.text(width - 36, y0 + HAUTEUR_BULLE - 12, '▼', { fontFamily: POLICE, fontSize: 20, color: '#e8731a' }).setOrigin(1)
  scene.tweens.add({ targets: suite, alpha: 0.2, yoyo: true, repeat: -1, duration: 400 })
  objets.push(texte, suite)
  for (const o of objets) o.setScrollFactor(0).setDepth(z)

  return new Promise((resoudre) => {
    let page = 0, lettres = 0, minuterie = null

    const ecrire = () => {
      lettres = 0
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
