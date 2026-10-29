// Citrouille cachée : la lanterne chauffe de 0 (loin) à 1 (dessus) quand on s'approche.
export const chaleur = (distance, portee) => Math.max(0, 1 - distance / portee)
// Passé ce délai (secondes), l'indice se renforce : une flèche montre la cachette.
export const indiceFort = (t, delai) => t >= delai
