# Tests et vérifications

## Logique

- Un seul fichier : `test/logique.test.js`, lancé par `pnpm test` (`node --test`, aucun framework).
- Toute nouvelle règle de jeu va dans `src/logique/` avec un test dans ce fichier : écrire le test d'abord et le voir échouer.

## Navigateur (MCP Chrome DevTools)

- **Déléguer à un sous-agent sur un modèle léger** (`model: "haiku"`, ou `"sonnet"` si l'analyse demande plus de finesse), et non au modèle principal : les captures d'écran coûtent cher en contexte.
- Le sous-agent ne renvoie qu'un compte rendu texte court : ce qui s'affiche, les erreurs de la console, ce qui cloche.
- Vérifier aussi en émulation mobile, paysage (`844x390x3,mobile,touch,landscape`) et portrait.

## Simuler les entrées

- En mode dev, le jeu est exposé dans `window.jeu` (exemple : `jeu.scene.getScene('Village').jack`). En production, `window.jeu` désigne la `<div id="jeu">`.
- Clavier : `KeyboardEvent` sur `window`, avec `keyCode` (Espace = 32).
- Souris : envoyer `mousedown` et `mousemove` à la toile (`canvas`), pas à `window`, sinon Phaser les ignore.
- Toucher : chaque `Touch` doit fournir `pageX`/`pageY`, sinon Phaser lit une position nulle.
- Pour aller vite à un lieu : téléporter Jack devant la porte (`jack.setPosition(...)`), puis simuler Espace.
