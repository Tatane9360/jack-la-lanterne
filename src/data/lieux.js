// Les 5 lieux, dans l'ordre du parcours : l'ordre de l'histoire (epoque : libellé prudent de la frise).
// batiment : sprite posé par le bas au point (x, y) en tuiles. porte : où Jack déclenche le lieu.
// Le jeu met le lore en avant (design.md §12) ; les faits historiques vivent dans les cartes (data/cartes.js).
//   diable : sa réplique quand il file devant le lieu, dans le village.
//   consigne : dialogue d'ouverture du mini-jeu, qui finit par la règle du jeu.
//   recit : dialogue après le mini-jeu (ou directement pour la chapelle). Ensuite, Jack gagne la carte du lieu.
//   recap : le fait du lieu, à raconter ce soir (écran final).
// Pages : une chaîne = Jack, D('…') = le diable. Les dialogues n'affirment aucun fait historique :
// ils racontent la légende (toujours « la légende raconte »), les faits sont dans les cartes.
// Époques de la frise : Toussaint fixée au 1er novembre par les papes Grégoire III puis Grégoire IV (VIIIe-IXe siècles,
// Wikipedia « Toussaint ») ; navets sculptés au XIXe siècle en Irlande et en Écosse (Wikipedia « Jack-o'-lantern »).
// Légende de Stingy Jack (pièce et croix d'argent, un an ; pommier et croix gravée, dix ans ; refusé au paradis,
// braise de l'enfer dans un navet) : History.com, « History of the Jack O'Lantern ».

// Une réplique du diable dans un dialogue (la bulle affiche alors son portrait).
export const D = (texte) => ({ diable: texte })

// Fil rouge (fiction) : un mot signé « D. » lance l'enquête. À la ferme, Jack comprend qu'il est le Jack de la légende.
// La braise brûle tant qu'on parle de lui ; le diable veut la reprendre. Jack le roule une troisième fois (citrouille cachée).
export const INTRO = [
  "La légende raconte qu'un certain Jack, très radin, a roulé le diable. Ni paradis ni enfer pour lui : il erre depuis avec une braise dans un navet.",
  "Moi aussi, je m'appelle Jack. Je ne me souviens de rien avant ce soir. Juste ma lanterne, et ce mot glissé dedans :",
  "« Ta braise s'éteint à minuit. Si tu veux la garder, viens me trouver. Je me cache quelque part dans l'histoire d'Halloween. Signé : D. »",
  "D… comme diable ? Il doit me confondre avec l'autre Jack. Suis la lueur orange : on remonte le temps, et on le trouve.",
]

export const LIEUX = [
  {
    id: 'samhain', nom: 'Le cercle de pierres', epoque: 'Temps des Celtes', batiment: 'feu', x: 8, y: 7, porte: { x: 8, y: 7.5 }, scene: 'Feu',
    diable: 'Toujours ce vieux navet, Jack ? Depuis le temps…',
    consigne: [
      'Un grand feu au milieu des pierres. Il fait bon, pour un squelette.',
      D('Profite. Il ne va pas durer.'),
      'Montre-toi, D. !',
      D("Pas encore. Mes amis vont d'abord souffler ton feu. Sans feu, pas de braise. Et sans braise, plus de Jack."),
      'Les esprits veulent éteindre le feu. Touche-les pour les chasser et tiens bon !',
    ],
    recit: [
      D('Pas mal. Tu tiens à ta braise, hein ?'),
      "Qui es-tu ? Et qu'est-ce que je t'ai fait ?",
      D("Tu ne te souviens vraiment pas ? On a bu un verre ensemble, il y a très longtemps. Tu n'as jamais payé ta tournée."),
      'Ça ne me ressemble pas.',
      D('Ça te ressemble exactement. On se voit à la chapelle. Enfin… devant.'),
      "Ma braise brille un peu plus fort. Et moi, j'ai des questions.",
    ],
    recap: "Le lien entre Halloween et la fête celte de Samhain est bien moins sûr qu'on le dit.",
  },
  {
    id: 'chapelle', nom: 'La chapelle', epoque: 'Moyen Âge', batiment: 'chapelle', x: 20, y: 9, porte: { x: 20, y: 9 }, scene: 'Anecdote',
    diable: 'Ni paradis ni enfer, Jack. Tu te rappelles pourquoi ?',
    recit: [
      "Une chapelle. Il m'attend là, c'est sûr.",
      D('Je suis dehors. Les chapelles, très peu pour moi. Trop de croix.'),
      'Tu as peur des croix ?',
      D("Peur ? Non. Mauvais souvenirs. À cause d'un petit malin qui te ressemblait beaucoup."),
      'Raconte.',
      D("La légende raconte que ce Jack m'a convaincu de me changer en pièce de monnaie, pour payer nos verres. Puis il m'a glissé dans sa bourse, contre une croix d'argent."),
      D("Coincé ! Pour sortir, j'ai dû promettre de le laisser tranquille un an. Et de ne jamais prendre son âme. Un an ! Moi !"),
      "Et ce Jack, c'est moi ?",
      D('Va à la ferme. Tu verras bien.'),
      'Ni paradis ni enfer… et un diable vexé depuis des siècles. Ça commence à me dire quelque chose.',
    ],
    recap: "Halloween, c'est « All Hallows' Eve » : la veille de la Toussaint.",
  },
  {
    id: 'ferme', nom: 'La ferme irlandaise', epoque: 'XIXᵉ siècle', batiment: 'ferme', x: 8, y: 22, porte: { x: 8, y: 22 }, scene: 'Recolte',
    diable: 'Tu reconnais ce champ, Jack ? Moi, oui.',
    consigne: [
      "Une vieille ferme. Ce potager… j'ai déjà marché ici.",
      D('Évidemment. Tu y as même creusé ta première lanterne.'),
      "Il me faut un navet pour ma lanterne. Tire quand la jauge est dans l'orange : trop mou, il résiste ; trop fort, les fanes cassent. Arraches-en 3 !",
    ],
    recit: [
      'Ce navet dans mes mains… je me souviens.',
      D('Enfin. Et le pommier, tu te souviens ?'),
      "Je t'ai fait grimper chercher une pomme. Et j'ai gravé une croix dans l'écorce : tu ne pouvais plus descendre.",
      D('Dix ans de paix, voilà ce que tu m\'as arraché pour me laisser filer. Puis tu es mort, comme tout le monde.'),
      "Le paradis n'a pas voulu d'un tricheur. Et toi, tu avais promis de ne jamais prendre mon âme.",
      D("Alors je t'ai jeté une braise de l'enfer, pour éclairer ta route. Tu l'as mise dans un navet creux."),
      "L'autre Jack, c'est moi. Des siècles d'errance, ça use la mémoire. Et la peau.",
      D('Et ce soir, ma braise, je la reprends. Rendez-vous chez les vivants.'),
    ],
    recap: "Les premières lanternes d'Halloween étaient des navets, pas des citrouilles.",
  },
  {
    id: 'rue', nom: 'La rue américaine', epoque: '1911-1930', batiment: null, porte: { x: 30, y: 23 }, scene: 'Portes',
    diable: 'Joli costume de squelette. Ah non, pardon.',
    consigne: [
      'Une rue pleine d\'enfants déguisés. Des fantômes, des sorcières… et un diable très réussi.',
      D("Merci. C'est du fait maison."),
      'Pourquoi te cacher ici ?',
      D('Ici, tout le monde se déguise. Personne ne remarque un vrai diable. Ni un vrai squelette.'),
      D('Petit jeu : certaines maisons sont à moi. Frappe chez moi, et tu le regretteras.'),
      "Bonbon ou sort ? Il me faut 4 bonbons avant que tout s'éteigne. Attention aux maisons qui jettent des sorts !",
    ],
    recit: [
      D('Tricheur un jour, tricheur toujours.'),
      "Dis-moi pourquoi tu veux ma braise. C'est toi qui me l'as donnée.",
      D("Prêtée. Une braise de l'enfer brûle tant qu'on parle de toi. Et partout où je passe, on t'oublie un peu plus."),
      D('Regarde-les : ils sculptent des citrouilles sans savoir pourquoi.'),
      "Ils les appellent encore des jack-o'-lanterns ! C'est mon nom, ça.",
      D('Plus pour longtemps. Je t\'attends dans ton siècle. Celui où tout s\'achète.'),
    ],
    recap: '« Trick or treat » est né au Canada, en Alberta, en 1927.',
  },
  {
    id: 'boutique', nom: "La boutique d'aujourd'hui", epoque: 'Fin des années 1990', batiment: 'boutique', x: 35, y: 13, porte: { x: 35, y: 13 }, scene: 'Boutique',
    consigne: [
      'Une boutique pleine de citrouilles en plastique. Et un vendeur au drôle de sourire.',
      D('Bienvenue ! Tout pour Halloween. Tu me donnes un coup de main pour le rayon ? Après, on parle affaires.'),
      'Remplis le rayon Halloween : chaque objet sur son étagère, le plus vite possible !',
    ],
    recit: [
      'Le vendeur ôte sa casquette. Deux cornes. Trouvé !',
      D('Bravo. Regarde autour de toi : des costumes, des bonbons, des citrouilles à piles. Plus personne n\'a besoin d\'une vraie braise.'),
      D('Marché conclu ? Rends-moi ma braise, et tu pourras enfin te reposer. En échange : cette citrouille à LED. Garantie deux ans.'),
      "Me reposer ? Et qui racontera Halloween ? Ma braise, c'est toute l'histoire qu'on vient de traverser.",
      D("Plus personne n'écoute les vieilles histoires."),
      'Toi, si. Tiens, un pari : je parie que tu ne tiens pas dans une de ces citrouilles.',
      D('Une pièce, un pommier, et maintenant une citrouille ? Je ne suis pas si bête.'),
      D('… Bon. Juste pour te prouver que si.'),
    ],
    recap: 'Halloween est arrivé en France à la fin des années 1990, poussé par le marketing.',
  },
]
