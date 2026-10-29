// Cartes à collectionner : les anecdotes historiques du jeu. Vérifiées le 2026-10-29 (sources en commentaire).
// Une carte sans source sérieuse n'entre pas. Règles de formulation : design.md §6.
// Avec lieu : gagnée en finissant ce lieu (le fait principal de l'époque). Sans : facultative, cachée dans le village (x, y en tuiles).

export const CARTES = [
  {
    // Formulation prudente : Hutton (Stations of the Sun), Rogers, Roud jugent le lien mal étayé ;
    // Wikipedia « Halloween » : l'origine païenne est une théorie, d'autres chercheurs la contestent.
    id: 'samhain', lieu: 'samhain', titre: "Samhain, ancêtre d'Halloween ?",
    texte: "Les Celtes fêtaient Samhain à la fin des récoltes, vers le 1er novembre. L'ancêtre d'Halloween ? On le lit partout… mais les historiens restent prudents : les preuves sont minces.",
  },
  {
    // Merriam-Webster et Etymonline : « Hallowe'en », contraction écossaise de « All Hallows' Even », veille de la Toussaint.
    id: 'chapelle', lieu: 'chapelle', titre: 'Le nom « Halloween »',
    texte: "« Halloween » vient de « All Hallows' Eve » : la veille de la Toussaint. Les Écossais l'ont raccourci en « Hallowe'en ». Paresseux, mais efficace.",
  },
  {
    // Wikipedia « Halloween » (jack-o'-lantern) : navets en Irlande et en Écosse, citrouille adoptée en Amérique du Nord.
    id: 'ferme', lieu: 'ferme', titre: 'Les premières lanternes',
    texte: "Les premières lanternes étaient des navets, en Irlande et en Écosse. En Amérique, les immigrants ont trouvé la citrouille : plus grosse, plus tendre. Les doigts en os disent merci.",
  },
  {
    // Souling (au moins XVe siècle) et guising : Wikipedia « Halloween ». Kingston (Ontario) 1911 : N. Rogers.
    // « Trick or treat » : première attestation en Alberta en 1927 (archives d'Edmonton, CBC), répandu aux États-Unis dans les années 1930.
    id: 'rue', lieu: 'rue', titre: 'Bonbon ou sort',
    texte: "Au Moyen Âge, on passait déjà de porte en porte : une prière contre un gâteau. En Amérique du Nord, des enfants déguisés frappent aux portes à Kingston, au Canada, dès 1911. « Trick or treat » apparaît en Alberta en 1927, puis conquiert les États-Unis dans les années 1930.",
  },
  {
    // Arrivée en France par le marketing : vérifié par le porteur. Pas d'année précise (1997 ou 1999 selon les sources).
    id: 'boutique', lieu: 'boutique', titre: 'Halloween en France',
    texte: "En France, Halloween est arrivé à la fin des années 1990… surtout grâce aux publicitaires. Les bonbons d'abord, le folklore ensuite.",
  },
  {
    // Robert Burns, poème « Halloween » (1785) ; Smithsonian Magazine, « Kale as Matchmaker ».
    id: 'noisettes', titre: 'Les noisettes au feu', x: 4, y: 10,
    texte: "En Écosse, on jetait deux noisettes au feu, une pour soi, une pour l'amoureux. Si elles brûlaient tranquilles : mariage heureux. Si elles crépitaient : prévois des assiettes de rechange.",
  },
  {
    // Smithsonian Magazine, « The Halloween Tradition Best Left Dead: Kale as Matchmaker » ; Burns, « Halloween ».
    id: 'chou', titre: 'Le chou fiancé', x: 3, y: 22,
    texte: "Les yeux bandés, on arrachait un chou dans le potager. Racine tordue ? Ton futur sera tordu. Terre collée aux racines ? Il sera riche. Le chou, meilleur que les applis de rencontre.",
  },
  {
    // NPR, « The Secret, Steamy History Of Halloween Apples » (2013) ; collecte folklorique irlandaise Dúchas.
    id: 'pomme', titre: 'La pelure de pomme', x: 22, y: 6,
    texte: "On épluchait une pomme d'un seul ruban, puis on le jetait par-dessus l'épaule. Par terre, il dessinait l'initiale de ton futur amour. Souvent un « S ». Ou un « O ». Bref, une pelure.",
  },
  {
    // National Geographic, « The saccharine history of candy corn » (R. Rupp, 2015).
    id: 'mais', titre: 'Les bonbons pour poules', x: 14, y: 21,
    texte: "Les « candy corn », ces bonbons en forme de grain de maïs, ont d'abord été vendus sous le nom de « Chicken Feed » : nourriture pour poules. Avec un coq sur la boîte. Appétissant.",
  },
  {
    // Dictionary of American Regional English (« cabbage night ») ; WayWord Radio.
    id: 'nuit-chou', titre: 'La nuit du chou', x: 34, y: 19,
    texte: "Dans certaines régions des États-Unis, la veille d'Halloween s'appelle la « Cabbage Night » : les farceurs lançaient des choux pourris sur les portes. Ça sentait moins bon que les bonbons.",
  },
  {
    // Star Tribune, « How Anoka became 'Halloween Capital of the World' » ; Mental Floss.
    id: 'anoka', titre: 'Des vaches dans la rue', x: 25, y: 20,
    texte: "En 1920, la ville d'Anoka, dans le Minnesota, invente un grand défilé d'Halloween pour occuper ses jeunes. Avant, ils lâchaient les vaches dans la rue principale et renversaient les toilettes des jardins.",
  },
  {
    // History.com, « How Donald Duck and Peanuts Saved Trick-or-Treating ».
    id: 'rationnement', titre: 'Halloween rationné', x: 31, y: 11,
    texte: "Pendant la Seconde Guerre mondiale, le sucre est rationné aux États-Unis. Plus de bonbons à distribuer : Halloween se fête en soirées dansantes. Après la guerre, Donald Duck et Charlie Brown ont aidé à relancer la tournée des bonbons.",
  },
]
