import { POLICE } from '../config.js'

// Fond commun des scènes hors village : nuit, tache de parchemin éclairée au centre, titre orange.
export function fondNuit(scene, titre) {
  const { width, height } = scene.scale
  scene.cameras.main.setBackgroundColor('#0b0705')
  scene.add.image(width / 2, height / 2 - 40, 'halo').setTint(0xdcc79a).setAlpha(0.35).setScale(3.2, 2.2)
  if (titre) scene.add.text(width / 2, 22, titre, { fontFamily: POLICE, fontSize: 34, color: '#e8731a' }).setOrigin(0.5, 0)
}
