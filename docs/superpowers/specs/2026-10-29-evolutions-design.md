# Évolutions de « Jack et la lanterne » : document de conception

Date : 2026-10-29. Complète `design.md` (qui reste la référence pour le ton, la direction artistique et les règles sur les faits).

## Intention

Le jeu est une pièce de portfolio / LinkedIn. Il doit paraître **original** à quelqu'un qui le lance depuis un lien, sans mode d'emploi. Le jeu actuel est jugé trop court, un peu plat, et frustrant (on ne peut pas sortir d'un mini-jeu). Ces évolutions visent : un fil narratif clair (une frise chronologique), plus de contenu facultatif drôle (des cartes à collectionner), des mini-jeux plus amusants, et une vraie fin ludique.

La priorité absolue de `design.md` reste valable : raconter l'histoire. Tout fait historique doit être sourcé (commentaire de source dans `src/data/`, comme aujourd'hui).

## Ce qui a été décidé avec le porteur

1. **Quitter un mini-jeu.** Chaque mini-jeu a un bouton « ✕ » (coin haut droit) et la touche Échap. Ils ramènent au village sans anecdote ; le lieu reste à faire.
2. **Frise chronologique.** Le parcours suit l'ordre historique : Samhain → Chapelle → Ferme → Rue américaine → Boutique. Une frise s'affiche dans le village et se remplit à chaque lieu terminé (une date ou une époque + un petit pictogramme). Elle sert aussi de support au récap final.
3. **Portes : « bonbon ou sort ».** Frapper à une porte donne soit un bonbon, soit un sort. Un sort = mini-jeu perdu (on rejoue, sans pénalité, comme aujourd'hui). Il faut un **indice visuel** pour que ce ne soit pas du pur hasard (proposition retenue : une citrouille allumée devant les maisons qui donnent des bonbons).
4. **Nouveau jeu de la ferme.** Le jeu « sculpter le navet » est remplacé par **arracher les navets** : des fanes dépassent de la terre ; on tire avec une jauge de force au bon moment ; on garde le plus gros pour en faire la lanterne. L'anecdote du navet est conservée.
5. **Cartes à collectionner.** Des petites cartes facultatives sont cachées dans le décor du village. En cliquer une ouvre une anecdote **drôle**. Un compteur (« 3/6 ») et un petit carnet consultable. Les cartes trouvées apparaissent au récap final.
6. **Mini-jeu final : la citrouille cachée.** Après la boutique, avant le récap : la carte est plongée dans le noir, seule la lanterne (cône de lumière qui suit le joueur ou le pointeur) éclaire. Jack s'agite / la lanterne vacille plus fort quand on s'approche. La cachette est tirée au hasard parmi quelques emplacements.

## Contenu des cartes (candidats)

À **revérifier chacune** sur une source sérieuse avant intégration ; une carte non confirmée est retirée, pas inventée. Ton : une phrase courte et drôle, dite par Jack ou écrite sur la carte.

| Carte | Anecdote | État |
|---|---|---|
| Bonbons « maïs » | Les *candy corn* se vendaient d'abord sous le nom de « nourriture pour poules » (*Chicken Feed*), avec un coq sur la boîte. | Fond solide ; pas de date précise (1880-1900 selon les sources) |
| Noisettes au feu | Irlande et Écosse : deux noisettes jetées au feu prédisent le mariage ; calmes = heureux, qui crépitent = orageux. | Solide (XIXᵉ) |
| Pelure de pomme | Jetée par-dessus l'épaule, elle dessinerait l'initiale du futur époux. | Solide |
| Vaches dans la rue | Anoka (Minnesota) lance un défilé d'Halloween en 1920 pour occuper les jeunes, qui lâchaient des vaches dans la rue et renversaient les toilettes au fond des jardins. | Solide ; date exacte du premier défilé à préciser |
| La blague du chou | On traînait un chou au bout d'une ficelle dans les champs la nuit pour faire peur. | À vérifier |
| Halloween rationné | Seconde Guerre mondiale, sucre rationné aux États-Unis ; un journal de 1942 qualifie Halloween de « victime de la guerre ». | Solide |

Pistes de sources : History.com (rationnement), Star Tribune / Mental Floss (Anoka), Atlas Obscura / RTÉ (divinations), The Takeout (candy corn).

## Non-objectifs

- Pas de sauvegarde, de score global, de partage, de multilingue (inchangé depuis `design.md`).
- Pas de nouveau lieu.
- Pas d'image IA pour ce qui bouge (règle de `design.md` §7).

## Anti-objectifs (échec même si ça marche)

- Un fait inventé ou daté sans source.
- Un mini-jeu des portes qui se joue à pile ou face.
- Des cartes obligatoires ou qui bloquent la progression.
- Un mini-jeu final si long ou si difficile qu'on n'atteint pas le récap.

## Contraintes

- pnpm, Phaser 3, Vite ; `src/logique/` pur, sans Phaser, testé avec `node --test`.
- Mobile : tout doit se jouer au toucher (le bouton ✕ remplace Échap sur mobile).
- Vérifications navigateur par un sous-agent sur un modèle léger.
- Un commit par tâche, rien de poussé sans accord.

## Choix laissés au builder (marqués comme choix de l'assistant)

- Emplacement des cartes sur la carte et forme visuelle (petite carte qui brille faiblement). **[choix de l'assistant]**
- Forme exacte de la frise (bandeau en bas du village, cases vides puis remplies). Libellés d'époque prudents : « Antiquité celte », « Moyen Âge », « XIXᵉ siècle », « 1911-1930 », « fin des années 1990 ». **[choix de l'assistant]**
- Portes : nombre de maisons, proportion de sorts, objectif de bonbons ; l'indice doit être fiable mais demander de regarder. **[choix de l'assistant]**
- Ferme : nombre de navets, réglage de la jauge, condition de victoire (par exemple récolter 3 navets et un gros). **[choix de l'assistant]**
- Citrouille cachée : 4 à 6 cachettes, durée cible inférieure à une minute ; si le joueur tarde, l'indice se renforce (pas d'échec possible). **[choix de l'assistant]**
- Carnet des cartes : accessible depuis un bouton du village. **[choix de l'assistant]**
- Le récap final liste les anecdotes des lieux puis les cartes trouvées. **[choix de l'assistant]**

## Précisions issues de la relecture (choix de l'assistant)

- **Vérification des cartes** : c'est une tâche du plan, avec accès web. Une carte non confirmée est retirée. Le compteur se calcule à partir des données (`x/N`), il n'est pas fixé à 6. Minimum visé : 4 cartes.
- **Ancien jeu du navet** : la scène `Navet.js` et `src/logique/navet.js` (avec leurs tests) sont supprimés. Le nouveau jeu garde l'`id` `ferme`, la consigne change, et l'anecdote et le récap du navet restent tels quels dans `src/data/lieux.js`.
- **Portes** : c'est un mini-jeu comme les autres (bouton ✕ et Échap). Un sort fait perdre : on rejoue la scène sur place avec `rejouer()`, sans retourner au village.
- **Citrouille cachée** : c'est un épilogue, pas un lieu. La frise garde 5 cases. Le bouton ✕ ou Échap y mène directement au récap, pour qu'on ne soit jamais bloqué.
- **Dates de la frise** : elles reprennent uniquement des faits déjà sourcés dans `src/data/lieux.js` (Kingston 1911, Alberta 1927, années 1930, fin des années 1990). Le libellé de la rue devient « 1911-1930 », et sa source est déjà en commentaire.
