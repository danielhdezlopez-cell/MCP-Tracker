import type { SizeMm } from '../lib/simulatorConstants';

// Base sizes keyed by leader ID (from leadersData.ts).
// Sizes from official OP_CrisisProtocol_BaseSizes PDF.
// Characters not listed in PDF default to 35mm.
export const LEADER_BASE_SIZES: Record<string, SizeMm> = {
  'adam-warlock':               35,
  'spider-man':                 50,  // Amazing Spider-Man
  'apocalypse':                 65,
  'baron-strucker':             35,
  'baron-zemo':                 35,  // Baron Helmut Zemo
  'bastion':                    50,  // not in PDF; humanoid-Sentinel estimate
  'black-bolt':                 35,
  'black-panther':              35,
  'blade':                      35,
  'cable':                      50,
  'captain-america':            35,  // Steve Rogers
  'captain-america-first-avenger': 35,
  'corvus-glaive':              50,
  'crimson-dynamo':             50,
  'cyclops':                    35,
  'daredevil':                  35,
  'doctor-strange':             35,
  'dormammu':                   65,
  'dracula':                    50,
  'elsa-bloodstone':            35,
  'emma-frost':                 35,  // White Queen / Emma Frost Normal
  'green-goblin':               50,
  'hulkbuster':                 65,
  'iron-man':                   35,  // Invincible Iron Man
  'jane-foster':                35,  // The Mighty Thor
  'kang':                       50,  // Kang the Conqueror
  'killmonger':                 35,
  'kingpin':                    50,
  'king-tchalla':               35,
  'klaw':                       35,
  'the-leader':                 35,  // not in PDF; humanoid estimate
  'loki':                       35,
  'mbaku':                      35,
  'magik':                      35,
  'magneto':                    50,
  'malekith':                   65,  // Malekith the Accursed
  'maximus':                    35,  // Maximus the Mad
  'medusa':                     35,
  'mephisto':                   50,  // Mephisto (Lord of Temptation)
  'miles-morales':              35,  // Spider-Man Miles Morales
  'modok':                      65,  // M.O.D.O.K.
  'mystique':                   35,
  'namor':                      50,  // Namor (The Sub-Mariner)
  'nick-fury':                  35,
  'doctor-octopus':             50,
  'onslaught':                  65,  // not in PDF; massive entity estimate
  'professor-xavier':           50,  // Professor X
  'red-hulk':                   65,  // not in PDF; Hulk-class estimate
  'red-skull':                  35,
  'red-skull-master-of-hydra':  50,  // listed at 50mm in PDF notes
  'red-skull-master-of-world':  35,
  'sam-wilson':                 35,  // Captain America (Sam Wilson)
  'sentinel':                   65,  // Sentinel Prime MK4
  'shadowlands-daredevil':      35,
  'she-hulk':                   50,
  'sin':                        35,
  'spectrum':                   35,
  'starlord':                   35,
  'storm':                      35,
  'supreme-doctor-strange':     50,  // Doctor Strange (Sorcerer Supreme)
  'thanos':                     50,
  'thor':                       35,  // Thor (Prince of Asgard)
  'weapon-x':                   35,
};

export function getLeaderBaseMm(leaderId: string): SizeMm {
  return LEADER_BASE_SIZES[leaderId] ?? 35;
}
