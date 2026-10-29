# Outils et commandes

- **pnpm uniquement**, jamais npm ni npx pour le projet.
  - `pnpm dev` : serveur de dev (http://localhost:5173)
  - `pnpm test` : tests de la logique (`node --test`)
  - `pnpm build` : version statique dans `dist/`
  - `pnpm preview` : sert `dist/` en local
- **Phaser 3** (`^3.90`), pas Phaser 4 : son API diffère et le code s'appuie sur celle de Phaser 3 (RenderTexture, `erase`, physique Arcade). pnpm installe Phaser 4 par défaut si on ne précise pas la version.
- **Vite** : `base: './'` dans `vite.config.js` pour que le build marche dans un sous-dossier (GitHub Pages). Le seuil d'alerte de taille est relevé, car Phaser pèse à lui seul environ 1,2 Mo.
- **Pas de nouvelle dépendance** sans raison forte : les tests passent par `node --test` (rien à installer), les sprites sont dessinés en code.
- **ZzFX** (MIT) : seule exception, pour les bruitages générés en code (moins de 1 Ko).
- Police : « IM Fell English » (Google Fonts), chargée avant le démarrage de Phaser dans `src/main.js`.
