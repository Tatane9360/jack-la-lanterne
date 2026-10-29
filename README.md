# Jack et la lanterne

Petit jeu web 2D (5 à 10 minutes) : Jack, un mini-squelette à lanterne en navet, éclaire un village dans la nuit et découvre l'histoire d'Halloween, de la ferme irlandaise à la boutique d'aujourd'hui.

## Lancer

```bash
pnpm install
pnpm dev       # http://localhost:5173
pnpm test      # logique du jeu (node --test)
pnpm build     # version statique dans dist/
pnpm preview   # sert dist/ en local
```

Commandes : flèches, ZQSD ou WASD, Espace pour entrer ou frapper. Sur mobile : joystick à gauche de l'écran, toucher les bandeaux.

## Structure

- `src/logique/` : règles du jeu, pures et testées (aucune dépendance à Phaser)
- `src/data/` : carte du village, lieux et anecdotes (avec leurs sources)
- `src/art/` : sprites dessinés en code (palette encre, parchemin, orange)
- `src/ui/` : briques partagées (Jack, entrées, joystick, lumière, bulle, invite)
- `src/scenes/` : titre, village, anecdote, récapitulatif et les quatre mini-jeux

## Mettre en ligne

`pnpm build`, puis l'un ou l'autre :

- **Netlify** : glisser le dossier `dist/` sur app.netlify.com/drop.
- **GitHub Pages** : pousser le dépôt, puis publier `dist/` (par exemple avec un workflow qui fait `pnpm install` et `pnpm build`).

Le build utilise des chemins relatifs (`base: './'`) : il marche aussi dans un sous-dossier.
