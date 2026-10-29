// Cartes à collectionner : facultatives, cachées dans le village (x, y en tuiles). Une anecdote drôle chacune.
// Vérifiées le 2026-10-29 (sources en commentaire). Une carte sans source sérieuse n'entre pas.

export const CARTES = [
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
