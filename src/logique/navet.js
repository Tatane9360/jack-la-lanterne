// Coordonnées normalisées 0..1 sur le navet.
export const ZONES = {
  oeilG: { x: .33, y: .4, r: .12 },
  oeilD: { x: .67, y: .4, r: .12 },
  bouche: { x: .5, y: .7, r: .18 },
}

export const zonesTouchees = (pts) => Object.keys(ZONES).filter((k) =>
  pts.some((p) => Math.hypot(p.x - ZONES[k].x, p.y - ZONES[k].y) <= ZONES[k].r))

export const visageFini = (pts) => zonesTouchees(pts).length === Object.keys(ZONES).length
