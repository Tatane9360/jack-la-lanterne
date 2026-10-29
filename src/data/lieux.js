// Les 5 lieux, dans l'ordre du parcours.
// batiment : sprite posé par le bas au point (x, y) en tuiles. porte : où Jack déclenche le lieu.
// consigne : dite à l'ouverture du mini-jeu. anecdote : pages de bulle dites après. recap : à raconter ce soir.
// Faits vérifiés le 2026-10-29 (sources en commentaire). Règles : voir design.md §6.

// La légende de Jack : toujours présentée comme une légende.
export const INTRO = [
  "La légende raconte qu'un certain Jack, très radin, a roulé le diable. Ni paradis ni enfer pour lui : il erre depuis avec une braise dans un navet.",
  "Moi aussi, je m'appelle Jack. Suis la lueur orange : je te raconte d'où vient Halloween.",
]

export const LIEUX = [
  {
    id: 'ferme', nom: 'La ferme irlandaise', batiment: 'ferme', x: 8, y: 22, porte: { x: 8, y: 22 }, scene: 'Navet',
    consigne: 'Sculpte la lanterne : trace deux yeux et une bouche sur le navet.',
    // Wikipedia « Halloween » (jack-o'-lantern) : navets en Irlande et en Écosse, citrouille adoptée en Amérique du Nord.
    anecdote: [
      "Les premières lanternes étaient des navets, en Irlande et en Écosse. En Amérique, les immigrants ont trouvé la citrouille : plus grosse, plus tendre.",
      'Mes doigts en os disent merci.',
    ],
    recap: "Les premières lanternes d'Halloween étaient des navets, pas des citrouilles.",
  },
  {
    id: 'samhain', nom: 'Le cercle de pierres', batiment: 'feu', x: 8, y: 7, porte: { x: 8, y: 7.5 }, scene: 'Feu',
    consigne: 'Les esprits veulent éteindre le feu. Touche-les pour les chasser et tiens bon !',
    // Formulation prudente : Hutton (Stations of the Sun), Rogers, Roud jugent le lien mal étayé ;
    // Wikipedia « Halloween » : l'origine païenne est une théorie, d'autres chercheurs la contestent.
    anecdote: [
      'Les Celtes fêtaient Samhain à la fin des récoltes, vers le 1er novembre.',
      "L'ancêtre d'Halloween ? On le lit partout… mais les historiens restent prudents : les preuves sont minces.",
    ],
    recap: "Le lien entre Halloween et la fête celte de Samhain est bien moins sûr qu'on le dit.",
  },
  {
    id: 'chapelle', nom: 'La chapelle', batiment: 'chapelle', x: 20, y: 9, porte: { x: 20, y: 9 }, scene: 'Anecdote',
    // Merriam-Webster et Etymonline : « Hallowe'en », contraction écossaise de « All Hallows' Even », veille de la Toussaint.
    anecdote: [
      "Ici, c'est calme. Le nom « Halloween » vient de « All Hallows' Eve » : la veille de la Toussaint.",
      "Les Écossais l'ont raccourci en « Hallowe'en ». Paresseux, mais efficace.",
    ],
    recap: "Halloween, c'est « All Hallows' Eve » : la veille de la Toussaint.",
  },
  {
    id: 'rue', nom: 'La rue américaine', batiment: null, porte: { x: 30, y: 23 }, scene: 'Portes',
    consigne: "Frappe aux portes encore allumées : il te faut 4 bonbons avant que tout s'éteigne !",
    // Souling (au moins XVe siècle) et guising : Wikipedia « Halloween ». Kingston (Ontario) 1911 : N. Rogers.
    // « Trick or treat » : première attestation en Alberta en 1927 (archives d'Edmonton, CBC), répandu aux États-Unis dans les années 1930.
    anecdote: [
      'Au Moyen Âge, on passait déjà de porte en porte : une prière contre un gâteau, ou un déguisement contre quelques douceurs.',
      "En Amérique du Nord, des enfants déguisés frappent aux portes à Kingston, au Canada, dès 1911. Et « trick or treat » apparaît en Alberta en 1927, avant de conquérir les États-Unis dans les années 1930.",
    ],
    recap: '« Trick or treat » est né au Canada, en Alberta, en 1927.',
  },
  {
    id: 'boutique', nom: "La boutique d'aujourd'hui", batiment: 'boutique', x: 35, y: 13, porte: { x: 35, y: 13 }, scene: 'Boutique',
    consigne: 'Remplis le rayon Halloween : chaque objet sur son étagère, le plus vite possible !',
    // Arrivée en France par le marketing : vérifié par le porteur. Pas d'année précise (1997 ou 1999 selon les sources).
    anecdote: [
      'En France, Halloween est arrivé à la fin des années 1990… surtout grâce aux publicitaires.',
      "Les bonbons d'abord, le folklore ensuite. Fin de l'histoire. Enfin, de la mienne.",
    ],
    recap: 'Halloween est arrivé en France à la fin des années 1990, poussé par le marketing.',
  },
]
