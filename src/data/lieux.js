// Les 5 lieux, dans l'ordre du parcours : l'ordre de l'histoire (epoque : libellé prudent de la frise).
// batiment : sprite posé par le bas au point (x, y) en tuiles. porte : où Jack déclenche le lieu.
// consigne : dite à l'ouverture du mini-jeu. anecdote : pages de bulle dites après. recap : à raconter ce soir.
// Faits vérifiés le 2026-10-29 (sources en commentaire). Règles : voir design.md §6.
// Époques de la frise : Toussaint fixée au 1er novembre par les papes Grégoire III puis Grégoire IV (VIIIe-IXe siècles,
// Wikipedia « Toussaint ») ; navets sculptés au XIXe siècle en Irlande et en Écosse (Wikipedia « Jack-o'-lantern »).

// La légende de Jack : toujours présentée comme une légende.
// Fil rouge (fiction, voir design.md §12) : le diable a défié Jack et se cache dans l'histoire d'Halloween.
// diable : sa réplique quand il file devant le lieu. Chaque anecdote finit sur un mot signé « D. ».
// Retournement à la ferme : le Jack de la légende, c'est notre Jack, qui l'avait oublié.
// La boutique révèle le diable, la citrouille cachée le piège.
export const INTRO = [
  "La légende raconte qu'un certain Jack, très radin, a roulé le diable. Ni paradis ni enfer pour lui : il erre depuis avec une braise dans un navet.",
  "Moi aussi, je m'appelle Jack. Et ce soir, quelqu'un a glissé un mot dans ma lanterne.",
  "« Ta braise s'éteint à minuit. Si tu veux la garder, viens me trouver. Je me cache quelque part dans l'histoire d'Halloween. Signé : D. »",
  "D… comme diable ? Il me confond avec l'autre Jack. Suis la lueur orange : on remonte Halloween, du plus ancien au plus récent, et on le trouve.",
]

export const LIEUX = [
  {
    id: 'samhain', nom: 'Le cercle de pierres', epoque: 'Temps des Celtes', batiment: 'feu', x: 8, y: 7, porte: { x: 8, y: 7.5 }, scene: 'Feu',
    diable: "« Toujours ce vieux navet, Jack ? Depuis le temps… »",
    consigne: 'Les esprits veulent éteindre le feu. Touche-les pour les chasser et tiens bon !',
    // Formulation prudente : Hutton (Stations of the Sun), Rogers, Roud jugent le lien mal étayé ;
    // Wikipedia « Halloween » : l'origine païenne est une théorie, d'autres chercheurs la contestent.
    anecdote: [
      'Les Celtes fêtaient Samhain à la fin des récoltes, vers le 1er novembre.',
      "L'ancêtre d'Halloween ? On le lit partout… mais les historiens restent prudents : les preuves sont minces.",
      "Un mot coincé sous une pierre : « On dit que cette fête vient de chez moi. Faux. Je n'étais même pas invité. D. »",
      "« Depuis le temps » ? Je ne me souviens de rien avant ce soir. Bizarre. Ma braise reprend des forces, en tout cas.",
    ],
    recap: "Le lien entre Halloween et la fête celte de Samhain est bien moins sûr qu'on le dit.",
  },
  {
    id: 'chapelle', nom: 'La chapelle', epoque: 'Moyen Âge', batiment: 'chapelle', x: 20, y: 9, porte: { x: 20, y: 9 }, scene: 'Anecdote',
    diable: "« Ni paradis ni enfer, Jack. Tu te rappelles pourquoi ? »",
    // Merriam-Webster et Etymonline : « Hallowe'en », contraction écossaise de « All Hallows' Even », veille de la Toussaint.
    anecdote: [
      "Ici, c'est calme. Le nom « Halloween » vient de « All Hallows' Eve » : la veille de la Toussaint.",
      "Les Écossais l'ont raccourci en « Hallowe'en ». Paresseux, mais efficace.",
      "Un mot cloué sur la porte, côté dehors : « La veille de la Toussaint ? Très peu pour moi. Je t'attends plus loin. D. »",
      "Ni paradis ni enfer… c'est l'histoire de l'autre Jack. Pourquoi il me la répète à moi ?",
    ],
    recap: "Halloween, c'est « All Hallows' Eve » : la veille de la Toussaint.",
  },
  {
    id: 'ferme', nom: 'La ferme irlandaise', epoque: 'XIXᵉ siècle', batiment: 'ferme', x: 8, y: 22, porte: { x: 8, y: 22 }, scene: 'Recolte',
    diable: '« Tu reconnais ce champ, Jack ? Moi, oui. »',
    consigne: "Il me faut un navet pour ma lanterne. Tire quand la jauge est dans l'orange : trop mou, il résiste ; trop fort, les fanes cassent. Arraches-en 3 !",
    // Wikipedia « Halloween » (jack-o'-lantern) : navets en Irlande et en Écosse, citrouille adoptée en Amérique du Nord.
    anecdote: [
      "Les premières lanternes étaient des navets, en Irlande et en Écosse. En Amérique, les immigrants ont trouvé la citrouille : plus grosse, plus tendre.",
      'Mes doigts en os disent merci.',
      "La légende raconte que le diable a jeté à Jack une braise de l'enfer, et qu'il l'a posée dans un navet.",
      "Ce potager, cette braise… je m'en souviens. L'autre Jack, c'est moi. Des siècles d'errance, ça use la mémoire. Et la peau.",
      "Un mot sous les fanes : « Bon retour, Jack. Ta braise est à moi, et je viens la reprendre. D. »",
    ],
    recap: "Les premières lanternes d'Halloween étaient des navets, pas des citrouilles.",
  },
  {
    id: 'rue', nom: 'La rue américaine', epoque: '1911-1930', batiment: null, porte: { x: 30, y: 23 }, scene: 'Portes',
    diable: '« Joli costume de squelette. Ah non, pardon. »',
    consigne: "Bonbon ou sort ? Il me faut 4 bonbons avant que tout s'éteigne. Mais attention : certaines maisons jettent des sorts…",
    // Souling (au moins XVe siècle) et guising : Wikipedia « Halloween ». Kingston (Ontario) 1911 : N. Rogers.
    // « Trick or treat » : première attestation en Alberta en 1927 (archives d'Edmonton, CBC), répandu aux États-Unis dans les années 1930.
    anecdote: [
      'Au Moyen Âge, on passait déjà de porte en porte : une prière contre un gâteau, ou un déguisement contre quelques douceurs.',
      "En Amérique du Nord, des enfants déguisés frappent aux portes à Kingston, au Canada, dès 1911. Et « trick or treat » apparaît en Alberta en 1927, avant de conquérir les États-Unis dans les années 1930.",
      "Parmi les enfants, un costume de diable très réussi. Trop réussi. Il a filé en laissant un mot sur un bonbon : « Je t'attends dans ton siècle. D. »",
      'Mon siècle ? Le dernier arrêt, alors. Celui où on vend Halloween en rayon.',
    ],
    recap: '« Trick or treat » est né au Canada, en Alberta, en 1927.',
  },
  {
    id: 'boutique', nom: "La boutique d'aujourd'hui", epoque: 'Fin des années 1990', batiment: 'boutique', x: 35, y: 13, porte: { x: 35, y: 13 }, scene: 'Boutique',
    consigne: 'Le vendeur a un drôle de sourire. Aide-le à remplir le rayon Halloween : chaque objet sur son étagère, le plus vite possible !',
    // Arrivée en France par le marketing : vérifié par le porteur. Pas d'année précise (1997 ou 1999 selon les sources).
    anecdote: [
      'Le vendeur ôte sa casquette. Deux cornes. Trouvé !',
      "« En France, Halloween est arrivé à la fin des années 1990… surtout grâce aux publicitaires. Les bonbons d'abord, le folklore ensuite. Joli travail, non ? »",
      "« Rends-moi ma braise, Jack. Sans elle, tu pourrais enfin te reposer. En échange : cette citrouille en plastique. À piles. Garantie deux ans. »",
      "Me reposer ? Et qui racontera Halloween ? Ma braise, c'est toute l'histoire qu'on vient de traverser.",
      'Et la légende raconte que Jack roule toujours le diable.',
    ],
    recap: 'Halloween est arrivé en France à la fin des années 1990, poussé par le marketing.',
  },
]
