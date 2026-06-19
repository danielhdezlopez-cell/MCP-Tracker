import type { MoveKey } from '../lib/simulatorConstants';

// Default movement type per leader ID, derived from official MCP card data.
// Leaders not listed here default to 'M'.
export const LEADER_MOVEMENTS: Record<string, MoveKey> = {
  'adam-warlock':                  'M',
  'spider-man':                    'L',  // Amazing Spider-Man
  'apocalypse':                    'M',
  'baron-strucker':                'M',
  'baron-zemo':                    'M',  // Baron Helmut Zemo
  'bastion':                       'M',
  'black-bolt':                    'M',
  'black-panther':                 'L',
  'blade':                         'M',
  'cable':                         'M',
  'captain-america':               'M',  // Steve Rogers
  'captain-america-first-avenger': 'M',
  'corvus-glaive':                 'M',
  'crimson-dynamo':                'S',
  'cyclops':                       'M',
  'daredevil':                     'M',
  'doctor-strange':                'M',
  'dormammu':                      'M',
  'dracula':                       'M',
  'elsa-bloodstone':               'M',
  'emma-frost':                    'M',
  'green-goblin':                  'L',
  'hulkbuster':                    'S',
  'iron-man':                      'M',  // Invincible Iron Man
  'jane-foster':                   'M',  // The Mighty Thor
  'kang':                          'M',  // Kang the Conqueror
  'killmonger':                    'M',
  'kingpin':                       'S',
  'king-tchalla':                  'L',
  'klaw':                          'M',
  'the-leader':                    'M',
  'loki':                          'M',
  'mbaku':                         'M',
  'magik':                         'M',
  'magneto':                       'M',
  'malekith':                      'M',  // Malekith the Accursed
  'maximus':                       'M',
  'medusa':                        'M',
  'mephisto':                      'M',
  'miles-morales':                 'M',  // Spider-Man Miles Morales
  'modok':                         'S',
  'mystique':                      'M',
  'namor':                         'M',
  'nick-fury':                     'M',
  'doctor-octopus':                'M',
  'onslaught':                     'M',
  'professor-xavier':              'M',
  'red-hulk':                      'M',
  'red-skull':                     'M',
  'red-skull-master-of-hydra':     'M',
  'red-skull-master-of-world':     'M',
  'sam-wilson':                    'L',  // Captain America (Sam Wilson)
  'sentinel':                      'S',  // Sentinel Prime MK4
  'shadowlands-daredevil':         'M',
  'she-hulk':                      'M',
  'sin':                           'M',
  'spectrum':                      'L',
  'starlord':                      'M',
  'storm':                         'L',
  'supreme-doctor-strange':        'M',
  'thanos':                        'M',
  'thor':                          'M',  // Thor, Prince of Asgard
  'weapon-x':                      'M',
};

export function getLeaderMove(leaderId: string): MoveKey {
  return LEADER_MOVEMENTS[leaderId] ?? 'M';
}
