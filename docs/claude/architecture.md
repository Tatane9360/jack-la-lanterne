# Architecture

## Un module, une responsabilité

| Dossier | Rôle | Peut importer |
|---------|------|---------------|
| `src/logique/` | Règles du jeu, pures et testées | rien (surtout pas Phaser) |
| `src/data/` | Carte, lieux, textes et leurs sources | rien |
| `src/art/` | Palette, sprites en chaînes de pixels, génération des textures | `config.js` |
| `src/ui/` | Briques partagées : Jack, entrées, joystick, lumière, bulle, invite, fond, pluie | `logique/`, `art/`, `config.js`, `son.js` |
| `src/scenes/` | Écrans du jeu et mini-jeux | tout le reste |

Les dépendances vont dans un seul sens : une scène importe `logique/`, `data/` et `ui/`, jamais l'inverse. Avant d'écrire une brique, vérifier si `ui/` la contient déjà (exemples : Jack piloté, lanterne, invite d'action).

## Enchaînement des scènes

`Boot` (génère textures et animations) → `Titre` (intro) → `Village` → mini-jeu du lieu → `Anecdote` → retour au `Village`, ou `Recap` quand tous les lieux sont faits.

- Chaque lieu est décrit dans `src/data/lieux.js` (scène à lancer, consigne, anecdote, phrase du récap). Ajouter un lieu = une entrée de plus là, pas de code en dur ailleurs.
- Les mini-jeux sortent toujours par `src/scenes/minijeux/finir.js` : `gagner()` ouvre l'anecdote, `rejouer()` relance sans pénalité.
- Ils ouvrent par leur consigne, affichée avec `afficherBulle()`.
- Toute nouvelle scène doit être déclarée dans `src/main.js`.

## État partagé

- `registry.progression` : lieux faits (voir `logique/progression.js`). Seul le dernier lieu (la boutique) est verrouillé tant que les autres ne sont pas faits.
- `registry.positionJack` : où Jack réapparaît au retour dans le village.
- « Rejouer » efface ces deux clés.

## Repères techniques

- Toile 960×540, pixel art dessiné à l'échelle `PIXEL = 2`. Une tuile fait `TUILE = 32` px.
- Profondeurs : le monde se trie par `y` (moins de 10 000). La nuit, les lueurs et l'interface utilisent les constantes `PROF` de `config.js`.
- Ne jamais écrire dans `gameObject.type` : c'est une propriété interne de Phaser. Utiliser un autre nom (exemple : `o.objet`).

## Mobile

- Joystick tactile sur la moitié gauche de l'écran. Les actions passent par des bandeaux à toucher (`ui/invite.js`).
- En portrait sur écran tactile, un message demande de tourner le téléphone (CSS dans `index.html`).
- `main.js` force `jeu.scale.refresh()` après une rotation, car Phaser garde sinon la taille du portrait.
