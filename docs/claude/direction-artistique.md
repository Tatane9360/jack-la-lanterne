# Direction artistique

- **Style C** : encre brune sur parchemin, hachures, vieux livre de contes. Tout est sombre, sauf ce que la lanterne révèle.
- **Une seule couleur vive : l'orange** (lanterne, feu, écharpe de Jack, fenêtres allumées, citrouilles). Pas de nouvelle couleur vive.
- **Palette** dans `src/art/palette.js`, une lettre par couleur : `k` encre, `p` parchemin, `q` parchemin ombré, `w` os, `o` orange, `y` lueur, `v` fane, `n` navet, `m` violet du navet. Un sprite n'utilise que ces lettres.
- **Sprites dessinés en code**, sous forme de chaînes de pixels dans `src/art/sprites.js` (`.` = transparent). Les bâtiments sont tracés avec les petits outils de dessin du même fichier (`remplir`, `cadre`, `toit`, `fenetre`). `texturePixels()` vérifie que toutes les lignes d'un sprite ont la même largeur.
- **Lumière** : un calque de nuit percé par la lanterne et par les lueurs des bâtiments (`src/ui/lumiere.js`). Une nouvelle source de lumière s'ajoute à la liste passée à `eclairer()`.
- **Images IA (Canva)** : seulement pour des images fixes (écran-titre, illustrations), jamais pour ce qui bouge ou s'anime. Vérifier les conditions d'usage avant de publier. Pour l'instant, aucune n'est utilisée.
- **Son** (`src/son.js`) : musique et pluie en boucle, fichiers CC0 dans `public/sons/` (crédits dans `LICENCES.md`), jouées par Phaser ; bruitages générés par ZzFX. Tout démarre au premier geste du joueur. Un son ajouté doit être libre (CC0 de préférence) et crédité.
