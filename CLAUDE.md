# Jack et la lanterne

Jeu web 2D (Phaser 3 + Vite). Source de vérité du contenu : `design.md`. Plan : `docs/superpowers/plans/`.

## Règles

- **pnpm uniquement**, jamais npm (`pnpm dev`, `pnpm test`, `pnpm build`).
- **Code modulaire** : `src/logique/` reste pur (aucun import de Phaser) et testé avec `node --test` ; les scènes importent `logique/`, `data/` et `ui/`, jamais l'inverse.
- **Vérifications visuelles dans le navigateur (MCP Chrome DevTools)** : les déléguer à un sous-agent sur un modèle léger (`model: "haiku"`, ou `"sonnet"` si l'analyse demande plus de finesse), et non au modèle principal. Les captures d'écran coûtent cher en contexte. Le sous-agent ne renvoie qu'un compte rendu texte court : ce qui s'affiche, les erreurs de la console, ce qui cloche.
- En mode dev, le jeu est exposé dans `window.jeu` pour les tests depuis la console. Les touchers simulés doivent fournir `pageX`/`pageY`, et les mouvements de souris s'envoient à la toile (`canvas`), pas à `window`.
