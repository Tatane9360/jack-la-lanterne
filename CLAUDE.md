# Jack et la lanterne

Jeu web 2D (Phaser 3 + Vite) qui raconte l'histoire d'Halloween. Contenu et intentions : `design.md`. Plan de construction : `docs/superpowers/plans/`.

Ce fichier est un sommaire : chaque thème vit dans son propre fichier sous `docs/claude/`. Lire le fichier concerné avant de toucher à ce thème. Une nouvelle règle va dans le fichier de son thème (ou dans un nouveau fichier ajouté ici), jamais en vrac dans ce sommaire.

## Les incontournables

- pnpm uniquement, jamais npm.
- `src/logique/` reste pur, sans Phaser, et testé.
- Aucun fait historique sans source vérifiée.
- Vérifications dans le navigateur : sous-agent sur un modèle léger (Haiku ou Sonnet).

## Sommaire

- [Outils et commandes](docs/claude/outils.md) : pnpm, Phaser 3, Vite, dépendances.
- [Architecture](docs/claude/architecture.md) : rôle des dossiers, enchaînement des scènes, état partagé, profondeurs, mobile.
- [Contenu historique et textes](docs/claude/contenu.md) : vérification des faits, formulations imposées, ton, typographie.
- [Direction artistique](docs/claude/direction-artistique.md) : style encre et parchemin, palette, pixel art en code, images IA.
- [Tests et vérifications](docs/claude/tests.md) : `node --test`, navigateur délégué à un modèle léger, simulation des entrées.
- [Git](docs/claude/git.md) : un commit par tâche, format des messages, rien de poussé sans accord.
