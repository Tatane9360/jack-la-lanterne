# Jeu Halloween : document de conception

Date : 2026-10-29. Statut : à valider par le porteur du projet.

Légende : **[décidé]** = dit ou validé par le porteur. **[mon choix]** = proposition de l'assistant, à confirmer ou corriger.

## 1. Intention

Un petit jeu web 2D qui fait découvrir l'histoire d'Halloween sans ressembler à un cours. Le joueur doit repartir avec des anecdotes qu'il a envie de raconter. C'est une pièce de portfolio / LinkedIn : elle doit se lancer vite, se comprendre sans mode d'emploi et se démarquer par son originalité et son ambiance. **[décidé]**

**Priorité absolue : raconter l'histoire.** L'ambiance, la lumière et les mini-jeux sont au service des anecdotes, jamais l'inverse. **[décidé]**

## 2. Public et usage

- Public : des gens simplement intrigués par l'histoire d'Halloween, pas un public scolaire. **[décidé]**
- Usage : un visiteur de portfolio ou de LinkedIn qui joue quelques minutes. Durée d'une partie visée : 5 à 10 minutes. **[mon choix]**
- Réaction visée : « j'ai vu ça, c'est sympa, c'est marrant », avec un peu de frisson. **[décidé]**

## 3. Objectifs, non-objectifs, anti-objectifs

Objectifs :
- Ambiance franchement Halloween (nuit, lanterne, orange, brume), sombre-fun, sans gore. **[décidé]**
- Une idée originale qui se démarque. **[décidé]**
- Des faits historiques fiables, vérifiés avant intégration. **[décidé]**

Non-objectifs **[mon choix]** : sauvegarde, comptes, score en ligne, plusieurs langues (français seul), grand monde, plusieurs fins.

Anti-objectifs :
- Que ça ressemble à un cours ou à un quiz scolaire. **[décidé]**
- Une peur qui prend le pas sur l'histoire : le joueur ne doit jamais chercher dans le noir sans rien apprendre. **[décidé]**
- Un jeu sans identité, du pixel art orange et noir déjà vu. **[mon choix, à partir de l'envie de se démarquer]**

## 4. Le jeu

**Vue et contrôles :** monde 2D vu de dessus, déplacement libre dans les quatre directions (à la Pokémon). Joystick tactile sur mobile, flèches ou touches sur ordinateur. **[décidé pour la vue]** **[mon choix pour les contrôles]**

**Personnage :** Jack, un mini-squelette à écharpe orange qui porte une lanterne en navet. Il est inspiré de la légende de Stingy Jack, présentée comme « la légende raconte ». Il est animé en sprite (marche dans les quatre directions, lanterne qui se balance). **[décidé]**

**Mécanique centrale :** la lumière. Le monde est sombre, la lanterne révèle ce qui est autour de Jack, et les anecdotes se découvrent là où il éclaire. **[décidé]**

**Parcours :** guidé. Tout le village est accessible, mais une lueur indique le prochain lieu. La boutique finale ne s'éclaire qu'après les autres. **[décidé]**

**Lieux, dans l'ordre :** **[décidé]**

| # | Lieu | Rôle |
|---|------|------|
| 1 | Ferme irlandaise | Départ, anecdote d'ouverture (le navet) |
| 2 | Cercle de pierres (Samhain) | Origines celtiques, avec nuance |
| 3 | Chapelle | Scène calme, sans mini-jeu |
| 4 | Rue américaine | Du *guising* au *trick-or-treat* |
| 5 | Boutique d'aujourd'hui | Chute finale (le marketing en France) |

La carte de la maquette (`.superpowers/brainstorm/`) n'est qu'une idée artistique : le plan définitif est à détailler par le builder.

## 5. Mini-jeux et anecdotes

Chaque mini-jeu dure environ une à deux minutes, sans pénalité en cas d'échec (on rejoue). **[mon choix]** Jack dit ensuite l'anecdote en une phrase courte et drôle. **[décidé pour le principe, mon choix pour la durée]**

| Lieu | Mini-jeu **[décidé]** | Anecdote (à vérifier) |
|------|----------------------|------------------------|
| Ferme | Sculpter son navet en traçant un visage | Les premières lanternes étaient des navets (Irlande, Écosse), pas des citrouilles. Les immigrants ont adopté la citrouille en Amérique. |
| Samhain | Garder le feu de joie allumé face aux esprits | Le lien Samhain-Halloween est plus fragile qu'on le dit. À présenter avec nuance. |
| Chapelle | Aucun, scène calme avec Jack | Halloween vient de *All Hallows' Eve*, la veille de la Toussaint. |
| Rue américaine | Frapper aux portes avant que les lumières ne s'éteignent | Souling et guising médiévaux, première mention nord-américaine de *guising* à Kingston (1911), « trick-or-treat » imposé vers les années 1930. |
| Boutique | Remplir le rayon Halloween le plus vite possible | Halloween est arrivé en France par le marketing à la fin des années 1990. |

**Écran final [mon choix] :** après la boutique, un récapitulatif des anecdotes en phrases courtes, faciles à raconter à quelqu'un. Il sert l'objectif « avoir envie de les partager ».

## 6. Faits historiques : état de vérification

Un premier contrôle a donné ce statut (le porteur l'a fait, l'assistant ne l'a pas refait) :

| Affirmation | Statut |
|-------------|--------|
| Lanternes d'abord en navet | Vrai |
| Citrouille adoptée en Amérique | Vrai |
| Légende de Jack à l'origine certaine | À nuancer |
| Souling et guising médiévaux | Vrai |
| Première mention nord-américaine du guising, Kingston, 1911 | Vrai |
| Trick-or-treat imposé vers 1930 | Vrai |
| Halloween arrivé en France par le marketing fin 1990 | Vrai |
| Campagne France Télécom « Olaween » | Incertain : 1997 souvent avancé, parfois 1999 |
| Lien Samhain-Halloween plus fragile qu'on le dit | Vrai, mais à sourcer prudemment |

Règles pour le texte :
- Légende de Jack : toujours « la légende raconte ».
- Campagne France Télécom : écrire « à la fin des années 1990 », sans année précise.
- Samhain : formulation prudente, avec une source à confirmer avant intégration.
- La veille de la Toussaint (*All Hallows' Eve*) et le chiffre « 1930 » sont à confirmer avant intégration.

## 7. Direction artistique

- Style C : encre brune sur parchemin, hachures, vieux livre de contes. Tout est sombre sauf ce que la lanterne révèle. **[décidé]**
- Touche de couleur vive unique, l'orange (citrouilles, feu, lanterne, écharpe de Jack, fenêtres allumées), pour garder un vrai côté Halloween. **[mon choix]**
- Décors par lieu : tombes, brume, corbeaux, toiles d'araignée, etc. **[mon choix]**
- Sprites et tuiles : pixel art dessiné en code avec une petite palette (encre, parchemin, orange). Aucun outil de dessin n'est disponible chez le porteur. **[mon choix]**
- Images fixes (écran-titre, illustrations d'anecdotes, portrait de Jack) : générées par IA (outil d'images de Canva). Un test a montré une bonne ambiance mais des variations d'une image à l'autre, donc **pas d'images IA pour ce qui se déplace ou s'anime** : sprites, tuiles et animations restent dessinés en code. Les conditions d'usage de l'outil sont à vérifier avant publication. **[décidé]**

## 8. Technique (propositions de l'assistant, non validées)

- Jeu dans le navigateur, joué depuis un simple lien. **[mon choix]**
- Bibliothèque Phaser (cartes vues de dessus, sprites animés, tactile). **[mon choix]**
- Hébergement gratuit (par exemple GitHub Pages ou Netlify). **[mon choix]**
- Le porteur délègue la technique à l'assistant, qui conseille. **[décidé]**

## 9. Périmètre MVP

Dedans : une partie linéaire guidée, cinq lieux, quatre mini-jeux, une scène calme, un écran final, un son d'ambiance simple, du texte en français.

Dehors : sauvegarde, score, plusieurs langues, bouton de partage, monde plus grand, nouveaux mini-jeux. **[mon choix]**

## 10. Laissé au builder

- Plan exact de la carte et tailles de tuiles et de sprites.
- Règles précises, difficulté et durée exacte de chaque mini-jeu.
- Palette exacte, effet de lumière, sons.
- Rédaction finale des anecdotes (courtes, drôles, vérifiées).
- Choix d'hébergement.

## 11. Questions ouvertes

- Conditions d'usage des images générées, à vérifier avant publication sur le portfolio.
- Faits à confirmer : Samhain, *All Hallows' Eve*, date « 1930 ».

## 12. Fil rouge : « Le pacte de Jack » **[décidé le 2026-10-29]**

But : donner une raison d'aller jusqu'au bout, une intrigue en plus des anecdotes.

- **Départ :** un mot signé « D. » dans la lanterne de Jack : « Ta braise s'éteint à minuit. Si tu veux la garder, viens me trouver. Je me cache quelque part dans l'histoire d'Halloween. » Le diable confond notre Jack avec celui de la légende.
- **Enjeu lié à la lumière :** le rayon de la lanterne démarre à 70 % et chaque lieu terminé le ravive, jusqu'à 100 % (`braise()` dans `logique/progression.js`). Il n'y a pas d'échec et le guide reste visible.
- **Fil rouge :** une silhouette à cornes rôde près du prochain lieu, visible seulement dans la lumière, et file quand Jack approche. Après chaque anecdote, un mot signé « D. » reprend le fait du lieu (Samhain : « je n'étais même pas invité » ; chapelle : il ne peut pas entrer ; ferme : la braise et le navet de la légende ; rue : déguisé parmi les enfants).
- **Révélation :** le vendeur de la boutique est le diable. Il revendique le marketing de la fin des années 1990 et propose une citrouille en plastique contre la braise. Jack refuse.
- **Fin :** le diable se cache dans une citrouille du village (la chasse finale). Jack le trouve et le piège : « roulé deux fois ».
- **Règle :** tout ce que dit le diable est de la fiction. Les faits qu'il cite restent ceux de §6, avec les mêmes formulations imposées.
