// =============================================================================
// GEAR LIBRARY
// =============================================================================
// Add your own gear below by following the same format as the existing entries.
// Each entry needs:
//   name     – Display name shown on the rack item
//   category – Groups items in the library browser (can be anything you like)
//   ruSize   – Rack units tall (1U, 2U, 3U, etc.)
//   color    – Hex color string, e.g. "#1a1a1a"
//   isHeat   – true if the unit generates significant heat (shows heat bar in rack)
//   isBlank  – true for blank panels (shows crosshatch pattern, no label)
// =============================================================================

export interface LibraryEntry {
  name: string;
  category: string;
  ruSize: number;
  color: string;
  isHeat: boolean;
  isBlank: boolean;
}

export const GEAR_LIBRARY: LibraryEntry[] = [

  // ---------------------------------------------------------------------------
  // BLANK PANELS
  // ---------------------------------------------------------------------------
  { name: "1U Blank Panel", category: "Blanks", ruSize: 1, color: "#2a2a2a", isHeat: false, isBlank: true },
  { name: "2U Blank Panel", category: "Blanks", ruSize: 2, color: "#2a2a2a", isHeat: false, isBlank: true },
  { name: "3U Blank Panel", category: "Blanks", ruSize: 3, color: "#2a2a2a", isHeat: false, isBlank: true },
  { name: "4U Blank Panel", category: "Blanks", ruSize: 4, color: "#2a2a2a", isHeat: false, isBlank: true },

  // ---------------------------------------------------------------------------
  // COMPRESSORS
  // ---------------------------------------------------------------------------
  { name: "UA 1176LN",              category: "Compressors", ruSize: 2, color: "#1a1a1a", isHeat: false, isBlank: false },
  { name: "UA LA-2A",               category: "Compressors", ruSize: 3, color: "#595C54", isHeat: true,  isBlank: false },
  { name: "Fairchild 670",          category: "Compressors", ruSize: 8, color: "#33060F", isHeat: true,  isBlank: false },
  { name: "Tube-Tech CL 1B",        category: "Compressors", ruSize: 3, color: "#0F599C", isHeat: true,  isBlank: false },
  { name: "Empirical Labs EL8-X",   category: "Compressors", ruSize: 1, color: "#121212", isHeat: false, isBlank: false },
  { name: "API 2500+",              category: "Compressors", ruSize: 1, color: "#052346", isHeat: false, isBlank: false },
  { name: "Manley Variable MU",     category: "Compressors", ruSize: 2, color: "#3C325B", isHeat: true,  isBlank: false },

  // ---------------------------------------------------------------------------
  // EQUALIZERS
  // ---------------------------------------------------------------------------
  { name: "Maag Audio EQ4M",          category: "Equalizers", ruSize: 1, color: "#3FACE1", isHeat: false, isBlank: false },
  { name: "Manley Massive Passive",   category: "Equalizers", ruSize: 3, color: "#3C325B", isHeat: false, isBlank: false },
  { name: "DW Fearn VT-5",            category: "Equalizers", ruSize: 3, color: "#CC0A09", isHeat: true,  isBlank: false },
  { name: "Chandler Limited TG12345", category: "Equalizers", ruSize: 3, color: "#263139", isHeat: true,  isBlank: false },
  { name: "Pultec EQP-1A",            category: "Equalizers", ruSize: 3, color: "#2F4956", isHeat: true,  isBlank: false },

  // ---------------------------------------------------------------------------
  // PREAMPS
  // ---------------------------------------------------------------------------
  { name: "Neve 1073 OPX",          category: "Preamps", ruSize: 2, color: "#4B635C", isHeat: false, isBlank: false },
  { name: "API 3124V",              category: "Preamps", ruSize: 1, color: "#060606", isHeat: false, isBlank: false },
  { name: "UA LA-610 Mk II",        category: "Preamps", ruSize: 2, color: "#0F0F0F", isHeat: true,  isBlank: false },
  { name: "Focusrite ISA828 Mk II", category: "Preamps", ruSize: 2, color: "#283368", isHeat: false, isBlank: false },
  { name: "DW Fearn VT-2",          category: "Preamps", ruSize: 3, color: "#CC0A09", isHeat: true,  isBlank: false },
  { name: "Chandler Limited TG2",   category: "Preamps", ruSize: 1, color: "#4D6C78", isHeat: false, isBlank: false },

  // ---------------------------------------------------------------------------
  // INTERFACES
  // ---------------------------------------------------------------------------
  { name: "Avid MTRX II",               category: "Interfaces", ruSize: 2, color: "#2D0529", isHeat: false, isBlank: false },
  { name: "Apogee Symphony I/O Mk II",  category: "Interfaces", ruSize: 2, color: "#202020", isHeat: false, isBlank: false },
  { name: "Digital Audio Denmark AX64", category: "Interfaces", ruSize: 2, color: "#E4D5B4", isHeat: false, isBlank: false },
  { name: "Lynx Aurora (n) 32-TB3",     category: "Interfaces", ruSize: 1, color: "#767E90", isHeat: false, isBlank: false },
  { name: "UA Apollo x8p",              category: "Interfaces", ruSize: 1, color: "#C5C5C5", isHeat: false, isBlank: false },

  // ---------------------------------------------------------------------------
  // PATCHBAYS
  // ---------------------------------------------------------------------------
  { name: "Bittree ProStudio PS96DB25i",  category: "Patchbays", ruSize: 1, color: "#0F0F0F", isHeat: false, isBlank: false },
  { name: "Switchcraft StudioPatch 9625", category: "Patchbays", ruSize: 1, color: "#1D90E4", isHeat: false, isBlank: false },
  { name: "Black Lion Audio PBR TT",      category: "Patchbays", ruSize: 1, color: "#161616", isHeat: false, isBlank: false },
  { name: "Flock Audio Patch XT",         category: "Patchbays", ruSize: 3, color: "#262626", isHeat: true,  isBlank: false },
  { name: "Flock Audio Patch VT",         category: "Patchbays", ruSize: 3, color: "#262626", isHeat: true,  isBlank: false },
  { name: "Flock Audio Patch",            category: "Patchbays", ruSize: 1, color: "#262626", isHeat: false, isBlank: false },
  { name: "Wolff Audio ProPatch 200R",    category: "Patchbays", ruSize: 2, color: "#F96B1F", isHeat: false, isBlank: false },
  { name: "Wolff Audio ProPatch 128R",    category: "Patchbays", ruSize: 1, color: "#F96B1F", isHeat: false, isBlank: false },
  { name: "Wolff Audio ProPatch 64R",     category: "Patchbays", ruSize: 1, color: "#F96B1F", isHeat: false, isBlank: false },
  { name: "Wolff Audio ProPatch 32R",     category: "Patchbays", ruSize: 1, color: "#F96B1F", isHeat: false, isBlank: false },

  // ---------------------------------------------------------------------------
  // EFFECTS
  // ---------------------------------------------------------------------------
  { name: "Eventide H9000",         category: "Effects", ruSize: 2, color: "#E1E1E1", isHeat: false, isBlank: false },
  { name: "Bricasti Design M7",     category: "Effects", ruSize: 1, color: "#060606", isHeat: false, isBlank: false },
  { name: "Lexicon PCM96",          category: "Effects", ruSize: 1, color: "#DEC1B8", isHeat: false, isBlank: false },
  { name: "Quantec Yardstick 2492", category: "Effects", ruSize: 1, color: "#1641A2", isHeat: false, isBlank: false },

  // ---------------------------------------------------------------------------
  // POWER
  // ---------------------------------------------------------------------------
  { name: "Furman PL-8C",       category: "Power", ruSize: 1, color: "#0F0F0F", isHeat: false, isBlank: false },
  { name: "Furman CN-2400S",    category: "Power", ruSize: 1, color: "#202020", isHeat: false, isBlank: false },
  { name: "SurgeX UPS-1000-OL", category: "Power", ruSize: 2, color: "#B4AB3C", isHeat: false, isBlank: false },

  // ---------------------------------------------------------------------------
  // Add more gear here — just copy any line above and change the values!
  // ---------------------------------------------------------------------------

];

// Derive the list of unique categories in the order they first appear
export const LIBRARY_CATEGORIES: string[] = Array.from(
  new Set(GEAR_LIBRARY.map((e) => e.category))
);
