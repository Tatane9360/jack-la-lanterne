# Contenu historique et textes

**Priorité du jeu : raconter l'histoire.** L'ambiance et les mini-jeux servent les anecdotes, jamais l'inverse (`design.md` §1).

## Faits

- Aucun fait n'entre dans le jeu sans source vérifiée. Noter la source en commentaire au-dessus du texte, dans `src/data/lieux.js`.
- Formulations imposées (`design.md` §6) :
  - La légende de Jack est toujours introduite par « la légende raconte ».
  - Campagne France Télécom : « à la fin des années 1990 », sans année précise.
  - Samhain : formulation prudente, car le lien avec Halloween est discuté par les historiens.
- Vérifiés le 2026-10-29 : *All Hallows' Eve* = veille de la Toussaint ; « trick or treat » attesté pour la première fois en Alberta (Canada) en 1927, puis répandu aux États-Unis dans les années 1930 ; guising à Kingston (Canada) en 1911.

## Ton

- Jack parle en phrases courtes et drôles. Le joueur doit pouvoir répéter l'anecdote à quelqu'un.
- Sombre et amusant, jamais gore. Rien qui ressemble à un cours ou à un quiz.
- Le joueur ne doit jamais chercher dans le noir sans rien apprendre : la lueur orange et la flèche indiquent toujours le prochain lieu.
- Français uniquement. Tutoiement du joueur.

## Typographie

- Guillemets français « … ».
- Les espaces insécables avant `: ; ! ? »` et après `«` sont ajoutées automatiquement par `typo()` (`src/ui/bulle.js`). Tout texte affiché qui ne passe pas par la bulle doit passer par `typo()`.
