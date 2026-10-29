import { test } from 'node:test'
import assert from 'node:assert/strict'
import { creerProgression, prochainLieu, estAccessible, terminer, partieFinie } from '../src/logique/progression.js'
import { vecteurJoystick } from '../src/logique/joystick.js'
import { visageFini } from '../src/logique/navet.js'
import { creerFeu, majFeu, issueFeu, DUREE_FEU } from '../src/logique/feu.js'
import { creerRue, majRue, frapper, issueRue } from '../src/logique/portes.js'
import { creerRayon, poser, rayonPlein } from '../src/logique/boutique.js'

test("progression : guidée, boutique verrouillée jusqu'à la fin", () => {
  const p = creerProgression(['ferme', 'samhain', 'chapelle', 'rue', 'boutique'])
  assert.equal(prochainLieu(p), 'ferme')
  assert.equal(estAccessible(p, 'rue'), true)
  assert.equal(estAccessible(p, 'boutique'), false)
  for (const id of ['ferme', 'samhain', 'chapelle', 'rue']) terminer(p, id)
  assert.equal(estAccessible(p, 'boutique'), true)
  terminer(p, 'boutique')
  assert.equal(partieFinie(p), true)
})

test('joystick : borné au rayon, nul dans la zone morte', () => {
  assert.deepEqual(vecteurJoystick(2, 1, 24), { x: 0, y: 0 })
  assert.deepEqual(vecteurJoystick(100, 0, 24), { x: 1, y: 0 })
})

test('navet : il faut deux yeux et une bouche', () => {
  assert.equal(visageFini([{ x: .33, y: .4 }, { x: .67, y: .4 }]), false)
  assert.equal(visageFini([{ x: .33, y: .4 }, { x: .67, y: .4 }, { x: .5, y: .7 }]), true)
})

test("feu : gagné si le feu tient jusqu'au bout, perdu s'il s'éteint", () => {
  assert.equal(issueFeu(majFeu(creerFeu(), DUREE_FEU, 0)), 'gagne')
  let g = creerFeu()
  for (let i = 0; i < 5; i++) g = majFeu(g, 0.1, 1)
  assert.equal(issueFeu(g), 'perdu')
})

test('portes : frapper une maison allumée donne un bonbon, éteinte non', () => {
  let r = creerRue([5, 1], 2)
  r = majRue(r, 2)                    // la maison 1 s'éteint
  r = frapper(r, 1)
  assert.equal(r.bonbons, 0)
  r = frapper(r, 0)
  assert.equal(r.bonbons, 1)
  assert.equal(issueRue(r), 'perdu')  // plus de maison allumée à visiter, objectif raté
})

test('portes : une maison à sort fait perdre, on attend pas les maisons à sort', () => {
  let r = creerRue([5, 5, 5], 2, [2])
  assert.equal(frapper(r, 2).sort, true)
  assert.equal(issueRue(frapper(r, 2)), 'perdu')
  r = frapper(r, 0)
  r = majRue(r, 1)
  assert.equal(issueRue(r), null)
  r = frapper(creerRue([5, 0, 5], 2, [2]), 0) // la seule autre maison à bonbons est éteinte
  assert.equal(issueRue(r), 'perdu')
})

test('boutique : un objet va sur son étagère', () => {
  let r = creerRayon(['citrouille', 'bonbon'])
  assert.equal(poser(r, 0, 'bonbon').ok, false)
  r = poser(r, 0, 'citrouille').rayon
  r = poser(r, 1, 'bonbon').rayon
  assert.equal(rayonPlein(r), true)
})
