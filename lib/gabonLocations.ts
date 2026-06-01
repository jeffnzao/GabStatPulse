/**
 * lib/gabonLocations.ts
 * Données géographiques du Gabon : Provinces → Villes → Communes
 */

export interface GabonCommune {
  name: string;
}

export interface GabonVille {
  name: string;
  communes: GabonCommune[];
}

export interface GabonProvince {
  name: string;
  villes: GabonVille[];
}

export const gabonLocations: Record<string, GabonProvince> = {
  estuaire: {
    name: "Estuaire",
    villes: [
      {
        name: "Libreville",
        communes: [
          { name: "1er Arrondissement" },
          { name: "2e Arrondissement" },
          { name: "3e Arrondissement" },
          { name: "4e Arrondissement" },
          { name: "5e Arrondissement" },
          { name: "6e Arrondissement" },
        ],
      },
      {
        name: "Akanda",
        communes: [
          { name: "Angondjé" },
          { name: "Akanda Centre" },
          { name: "Ntoum Est" },
        ],
      },
      {
        name: "Owendo",
        communes: [
          { name: "Owendo Centre" },
          { name: "Nzeng-Ayong" },
          { name: "Louis" },
        ],
      },
      {
        name: "Ntoum",
        communes: [
          { name: "Ntoum Centre" },
          { name: "Bikélé" },
        ],
      },
      {
        name: "Cocobeach",
        communes: [
          { name: "Cocobeach Centre" },
        ],
      },
    ],
  },

  haut_ogooue: {
    name: "Haut-Ogooué",
    villes: [
      {
        name: "Franceville",
        communes: [
          { name: "Franceville Centre" },
          { name: "Mvengue" },
          { name: "Okondja" },
        ],
      },
      {
        name: "Moanda",
        communes: [
          { name: "Moanda Centre" },
          { name: "Mounana" },
        ],
      },
      {
        name: "Mounana",
        communes: [
          { name: "Mounana Centre" },
        ],
      },
      {
        name: "Bakoumba",
        communes: [{ name: "Bakoumba Centre" }],
      },
      {
        name: "Bongoville",
        communes: [{ name: "Bongoville Centre" }],
      },
    ],
  },

  moyen_ogooue: {
    name: "Moyen-Ogooué",
    villes: [
      {
        name: "Lambaréné",
        communes: [
          { name: "Lambaréné Centre" },
          { name: "Lambaréné Nord" },
          { name: "Lambaréné Sud" },
        ],
      },
      {
        name: "Ndjolé",
        communes: [{ name: "Ndjolé Centre" }],
      },
    ],
  },

  ngounie: {
    name: "Ngounié",
    villes: [
      {
        name: "Mouila",
        communes: [
          { name: "Mouila Centre" },
          { name: "Mouila Nord" },
          { name: "Mouila Sud" },
        ],
      },
      {
        name: "Fougamou",
        communes: [{ name: "Fougamou Centre" }],
      },
      {
        name: "Ndendé",
        communes: [{ name: "Ndendé Centre" }],
      },
      {
        name: "Mbigou",
        communes: [{ name: "Mbigou Centre" }],
      },
    ],
  },

  nyanga: {
    name: "Nyanga",
    villes: [
      {
        name: "Tchibanga",
        communes: [
          { name: "Tchibanga Centre" },
          { name: "Tchibanga Nord" },
        ],
      },
      {
        name: "Mayumba",
        communes: [{ name: "Mayumba Centre" }],
      },
      {
        name: "Gamba",
        communes: [{ name: "Gamba Centre" }],
      },
    ],
  },

  ogooue_ivindo: {
    name: "Ogooué-Ivindo",
    villes: [
      {
        name: "Makokou",
        communes: [
          { name: "Makokou Centre" },
          { name: "Makokou Nord" },
        ],
      },
      {
        name: "Booué",
        communes: [{ name: "Booué Centre" }],
      },
      {
        name: "Mékambo",
        communes: [{ name: "Mékambo Centre" }],
      },
    ],
  },

  ogooue_lolo: {
    name: "Ogooué-Lolo",
    villes: [
      {
        name: "Koulamoutou",
        communes: [
          { name: "Koulamoutou Centre" },
          { name: "Koulamoutou Nord" },
        ],
      },
      {
        name: "Lastoursville",
        communes: [{ name: "Lastoursville Centre" }],
      },
    ],
  },

  ogooue_maritime: {
    name: "Ogooué-Maritime",
    villes: [
      {
        name: "Port-Gentil",
        communes: [
          { name: "1er Arrondissement" },
          { name: "2e Arrondissement" },
          { name: "3e Arrondissement" },
        ],
      },
      {
        name: "Omboué",
        communes: [{ name: "Omboué Centre" }],
      },
      {
        name: "Gamba",
        communes: [{ name: "Gamba Centre" }],
      },
    ],
  },

  woleu_ntem: {
    name: "Woleu-Ntem",
    villes: [
      {
        name: "Oyem",
        communes: [
          { name: "Oyem Centre" },
          { name: "Oyem Nord" },
          { name: "Oyem Sud" },
        ],
      },
      {
        name: "Bitam",
        communes: [{ name: "Bitam Centre" }],
      },
      {
        name: "Mitzic",
        communes: [{ name: "Mitzic Centre" }],
      },
      {
        name: "Minvoul",
        communes: [{ name: "Minvoul Centre" }],
      },
    ],
  },
};

/** Liste triée des noms de provinces */
export const GABON_PROVINCES: string[] = Object.values(gabonLocations).map(
  (p) => p.name
);

/** Retourne les villes d'une province (par nom affiché) */
export function getVillesByProvince(provinceName: string): GabonVille[] {
  const entry = Object.values(gabonLocations).find(
    (p) => p.name === provinceName
  );
  return entry?.villes ?? [];
}

/** Retourne les communes d'une ville dans une province */
export function getCommunesByVille(
  provinceName: string,
  villeName: string
): GabonCommune[] {
  const ville = getVillesByProvince(provinceName).find(
    (v) => v.name === villeName
  );
  return ville?.communes ?? [];
}
