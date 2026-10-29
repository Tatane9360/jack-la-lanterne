// Ambiance sonore générée en Web Audio, sans fichier : un bourdon grave et du vent.
// Doit démarrer après un geste de l'utilisateur (règle des navigateurs).
const VOLUME = 0.5
let ctx = null
let general = null
let muet = false

export function demarrerAmbiance() {
  if (ctx) return
  ctx = new AudioContext()
  general = ctx.createGain()
  general.gain.setValueAtTime(0, ctx.currentTime)
  general.gain.linearRampToValueAtTime(VOLUME, ctx.currentTime + 3)
  general.connect(ctx.destination)

  // Bourdon : deux notes graves légèrement désaccordées, et une quinte très discrète.
  for (const [frequence, niveau] of [[55, 0.09], [55.6, 0.09], [82.4, 0.03]]) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.frequency.value = frequence
    g.gain.value = niveau
    o.connect(g).connect(general)
    o.start()
  }

  // Vent : bruit blanc dans un filtre passe-bande qui bouge lentement.
  const bruit = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const donnees = bruit.getChannelData(0)
  for (let i = 0; i < donnees.length; i++) donnees[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = bruit
  source.loop = true
  const filtre = ctx.createBiquadFilter()
  filtre.type = 'bandpass'
  filtre.frequency.value = 450
  filtre.Q.value = 0.8
  const lfo = ctx.createOscillator()
  const ampleur = ctx.createGain()
  lfo.frequency.value = 0.07
  ampleur.gain.value = 300
  lfo.connect(ampleur).connect(filtre.frequency)
  const vent = ctx.createGain()
  vent.gain.value = 0.12
  source.connect(filtre).connect(vent).connect(general)
  source.start()
  lfo.start()

  creerBouton()
}

// Bouton HTML (accessible au clavier et aux lecteurs d'écran) en haut à droite.
function creerBouton() {
  const b = document.createElement('button')
  b.id = 'son'
  b.type = 'button'
  const maj = () => {
    b.textContent = muet ? 'Son : non' : 'Son : oui'
    b.setAttribute('aria-pressed', String(!muet))
  }
  b.addEventListener('click', () => {
    muet = !muet
    general.gain.setTargetAtTime(muet ? 0 : VOLUME, ctx.currentTime, 0.2)
    maj()
    b.blur() // Espace doit rester au jeu
  })
  maj()
  document.body.append(b)
}
