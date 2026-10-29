# Plan : évolutions (frise, cartes, portes, ferme, citrouille cachée)

Conception : `docs/superpowers/specs/2026-10-29-evolutions-design.md`. Un commit par tâche, une fois `pnpm test` passé.

1. **Quitter un mini-jeu** : `boutonQuitter(scene, cible)` dans `minijeux/finir.js` (✕ en haut à droite + Échap), branché dans chaque mini-jeu.
2. **Ordre chronologique et frise** : `LIEUX` réordonnés (Samhain, Chapelle, Ferme, Rue, Boutique) avec un champ `epoque` ; frise en haut du village (`scenes/village/frise.js`) ; époques reprises au récap.
3. **Portes, bonbon ou sort** : `logique/portes.js` gère des maisons à sort (frapper = perdu) ; indice : citrouille allumée devant les maisons à bonbons. Test d'abord.
4. **Ferme, arracher les navets** : `logique/recolte.js` (jauge, tirer, issue) testé ; scène `Recolte` ; suppression de `Navet` et `logique/navet.js`.
5. **Cartes à collectionner** : vérification web de chaque carte, `data/cartes.js` sourcé, ramassage dans le village (`scenes/village/cartes.js`), compteur cliquable qui relit les cartes, bouton au récap.
6. **Citrouille cachée** : `logique/chasse.js` (chaleur selon la distance, indice qui se renforce) testé ; mode chasse du village (`scenes/village/chasse.js`) lancé après la dernière anecdote ; ✕ mène au récap.
7. **Vérification navigateur** par un sous-agent léger (bureau + mobile paysage).
