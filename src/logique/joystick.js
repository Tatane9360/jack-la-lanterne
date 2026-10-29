const ZONE_MORTE = 4

// Écart du doigt → vecteur de norme ≤ 1.
export function vecteurJoystick(dx, dy, rayon) {
  const d = Math.hypot(dx, dy)
  if (d < ZONE_MORTE) return { x: 0, y: 0 }
  const force = Math.min(d, rayon) / rayon
  return { x: (dx / d) * force, y: (dy / d) * force }
}
