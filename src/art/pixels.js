import { PIXEL } from '../config.js'
import { PALETTE } from './palette.js'

// Dessine des frames décrites en chaînes ('.' = transparent) dans une texture découpée en frames.
// Chaque pixel d'art fait PIXEL×PIXEL pixels écran.
export function texturePixels(scene, cle, frames, palette = PALETTE) {
  const h = frames[0].length, w = frames[0][0].length
  frames.flat().forEach((l, i) => { if (l.length !== w) throw new Error(`${cle} : ligne ${i} de ${l.length} au lieu de ${w}`) })
  const tex = scene.textures.createCanvas(cle, w * frames.length * PIXEL, h * PIXEL)
  const ctx = tex.getContext()
  frames.forEach((lignes, f) => lignes.forEach((ligne, y) => [...ligne].forEach((c, x) => {
    if (c === '.') return
    ctx.fillStyle = palette[c]
    ctx.fillRect((f * w + x) * PIXEL, y * PIXEL, PIXEL, PIXEL)
  })))
  tex.refresh()
  frames.forEach((_, f) => tex.add(f, 0, f * w * PIXEL, 0, w * PIXEL, h * PIXEL))
}

// Halo blanc → transparent : sert de trou dans la nuit et de lueur.
export function textureHalo(scene, cle = 'halo', taille = 256) {
  const tex = scene.textures.createCanvas(cle, taille, taille)
  const ctx = tex.getContext()
  const r = taille / 2
  const g = ctx.createRadialGradient(r, r, 0, r, r, r)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.75)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, taille, taille)
  tex.refresh()
}
