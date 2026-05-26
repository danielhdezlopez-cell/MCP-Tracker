export interface Leader {
  id: string;
  name: string;
  affiliations: string[];
  image: string | null;
}

const base = import.meta.env.BASE_URL; // '/MCP-Tracker/' in prod, '/' in dev
const img = (file: string) => `${base}assets/leaders/${file}`;

export const LEADERS: Leader[] = [
  { id: 'adam-warlock', name: 'Adam Warlock', affiliations: ['Galaxy Guardians'], image: img('AdamWarlock.png') },
  { id: 'spider-man', name: 'Amazing Spider-Man', affiliations: ['Web Warriors'], image: img('SpiderMan.png') },
  { id: 'apocalypse', name: 'Apocalypse', affiliations: ['Apocalypse'], image: img('Apocalypse.png') },
  { id: 'baron-strucker', name: 'Baron Strucker', affiliations: ['Hydra'], image: img('BaronStrucker_.png') },
  { id: 'baron-zemo', name: 'Baron Helmut Zemo', affiliations: ['Hydra'], image: img('BaronZemo.png') },
  { id: 'bastion', name: 'Bastion', affiliations: ['Sentinels'], image: img('Bastion.png') },
  { id: 'black-bolt', name: 'Black Bolt', affiliations: ['Inhumans'], image: img('BlackBolt.png') },
  { id: 'black-panther', name: 'Black Panther', affiliations: ['Wakanda'], image: img('BlackPanther.png') },
  { id: 'blade', name: 'Blade', affiliations: ['Midnight Sons'], image: img('Blade.png') },
  { id: 'cable', name: 'Cable', affiliations: ['X-Force'], image: img('Cable.png') },
  { id: 'captain-america', name: 'Captain America', affiliations: ['Avengers'], image: img('CaptainAmerica.webp') },
  { id: 'captain-america-first-avenger', name: 'Captain America, First Avenger', affiliations: ['Avengers'], image: img('CaptainAmericaFirstAvenger.webp') },
  { id: 'corvus-glaive', name: 'Corvus Glaive', affiliations: ['Black Order'], image: img('CorvusGlaive.webp') },
  { id: 'crimson-dynamo', name: 'Crimson Dynamo', affiliations: ['Winter Guard'], image: img('crimson-dynamo.png') },
  { id: 'cyclops', name: 'Cyclops', affiliations: ['Uncanny X-Men'], image: img('Cyclops.png') },
  { id: 'daredevil', name: 'Daredevil', affiliations: ['Defenders'], image: img('Daredevil.png') },
  { id: 'doctor-strange', name: 'Doctor Strange', affiliations: ['Defenders'], image: img('DoctorStrange.png') },
  { id: 'dormammu', name: 'Dormammu', affiliations: ['Dark Dimension'], image: img('Dormammu.png') },
  { id: 'dracula', name: 'Dracula', affiliations: ['Dracula'], image: img('Dracula.png') },
  { id: 'elsa-bloodstone', name: 'Elsa Bloodstone', affiliations: ['Midnight Sons'], image: img('ElsaBloodstone.png') },
  { id: 'emma-frost', name: 'White Queen', affiliations: ['Hellfire Club'], image: img('white-queen.png') },
  { id: 'green-goblin', name: 'Green Goblin', affiliations: ['Spider Foes'], image: img('GreenGoblin.png') },
  { id: 'hulkbuster', name: 'Hulkbuster', affiliations: ['Avengers'], image: img('Hulkbuster.png') },
  { id: 'iron-man', name: 'Invincible Iron Man', affiliations: ['S.H.I.E.L.D.'], image: img('IronMan.png') },
  { id: 'jane-foster', name: 'Jane Foster', affiliations: ['Asgard'], image: img('JaneFoster.png') },
  { id: 'kang', name: 'Kang', affiliations: ['Cabal'], image: img('Kang.png') },
  { id: 'killmonger', name: 'Killmonger', affiliations: ['Wakanda'], image: img('Killmonger.webp') },
  { id: 'kingpin', name: 'Kingpin', affiliations: ['Criminal Syndicate'], image: img('Kingpin.png') },
  { id: 'king-tchalla', name: "King T'Challa", affiliations: ['Wakanda'], image: img('KingTChalla.webp') },
  { id: 'klaw', name: 'Klaw', affiliations: ['Criminal Syndicate'], image: img('Klaw.png') },
  { id: 'the-leader', name: 'Leader', affiliations: ['Intelligencia'], image: img('Leader.png') },
  { id: 'loki', name: 'Loki', affiliations: ['Asgard'], image: img('Loki.png') },
  { id: 'mbaku', name: "M'Baku", affiliations: ['Wakanda'], image: img('MBaku.png') },
  { id: 'magik', name: 'Magik', affiliations: ['New Mutants'], image: img('Magik.png') },
  { id: 'magneto', name: 'Magneto', affiliations: ['Brotherhood'], image: img('Magneto.png') },
  { id: 'malekith', name: 'Malekith', affiliations: ['Cabal'], image: img('Malekith.png') },
  { id: 'maximus', name: 'Maximus the Mad', affiliations: ['Inhumans'], image: img('Maximus.png') },
  { id: 'medusa', name: 'Medusa', affiliations: ['Inhumans'], image: img('Medusa.png') },
  { id: 'mephisto', name: 'Mephisto', affiliations: ['Mephisto'], image: img('Mephisto.png') },
  { id: 'miles-morales', name: 'Miles Morales', affiliations: ['Web Warriors'], image: img('MilesMorales.png') },
  { id: 'modok', name: 'M.O.D.O.K.', affiliations: ['Criminal Syndicate'], image: img('Modok.png') },
  { id: 'mystique', name: 'Mystique', affiliations: ['Brotherhood'], image: img('Mystique.png') },
  { id: 'namor', name: 'Namor', affiliations: ['S.H.I.E.L.D.'], image: img('Namor.png') },
  { id: 'nick-fury', name: 'Nick Fury', affiliations: ['S.H.I.E.L.D.'], image: img('NickFury.png') },
  { id: 'doctor-octopus', name: 'Doctor Octopus', affiliations: ['Spider Foes'], image: img('doctor-octopus.png') },
  { id: 'onslaught', name: 'Onslaught', affiliations: ["Onslaught's Grip"], image: img('Onslaught.png') },
  { id: 'professor-xavier', name: 'Professor X', affiliations: ['Uncanny X-Men'], image: img('ProfessorX.png') },
  { id: 'red-hulk', name: 'Red Hulk', affiliations: ['Thunderbolts'], image: img('RedHulk.png') },
  { id: 'red-skull', name: 'Red Skull', affiliations: ['Cabal'], image: img('RedSkull.png') },
  { id: 'red-skull-master-of-hydra', name: 'Red Skull, Master of Hydra', affiliations: ['Hydra'], image: img('RedSkullMasterOfHydra.webp') },
  { id: 'red-skull-master-of-world', name: 'Red Skull, Master of the World', affiliations: ['Cabal'], image: img('RedSkullMasterOfWorld.webp') },
  { id: 'sam-wilson', name: 'Sam Wilson', affiliations: ['Avengers'], image: img('SamWilson.png') },
  { id: 'sentinel', name: 'Sentinel Prime MK4', affiliations: ['Sentinels'], image: img('Sentinel.png') },
  { id: 'shadowlands-daredevil', name: 'Shadowlands Daredevil', affiliations: ['Criminal Syndicate'], image: img('ShadowlandsDaredevil.png') },
  { id: 'she-hulk', name: 'She-Hulk', affiliations: ['A-Force'], image: img('SheHulk.png') },
  { id: 'sin', name: 'Sin', affiliations: ['Cabal'], image: img('Sin.png') },
  { id: 'spectrum', name: 'Spectrum', affiliations: ['Mighty Avengers'], image: img('Spectrum.png') },
  { id: 'starlord', name: 'Starlord', affiliations: ['Galaxy Guardians'], image: img('Starlord.png') },
  { id: 'storm', name: 'Storm', affiliations: ['Uncanny X-Men'], image: img('Storm.png') },
  { id: 'supreme-doctor-strange', name: 'Supreme Doctor Strange', affiliations: ['Convocation'], image: img('SupremeDoctorStrange.png') },
  { id: 'thanos', name: 'Thanos', affiliations: ['Black Order'], image: img('Thanos.png') },
  { id: 'thor', name: 'Thor', affiliations: ['Asgard'], image: img('Thor.png') },
  { id: 'weapon-x', name: 'Weapon X', affiliations: ['Weapon X'], image: img('WeaponXWolverine.png') },
];

// Display labels for renamed affiliations.
// Internal keys in LEADERS.affiliations stay unchanged so filtering
// and localStorage persistence continue to work.
export const AFFILIATION_DISPLAY_LABELS: Record<string, string> = {
  'Apocalypse': 'Servants of the Apocalypse',
  'Mephisto':   'Legion of the Lost',
  'Dracula':    'Thralls of Dracula',
};

export function getAffilDisplay(key: string): string {
  return AFFILIATION_DISPLAY_LABELS[key] ?? key;
}

export const AFFILIATIONS = [
  'A-Force', 'Apocalypse', 'Asgard', 'Avengers', 'Black Order',
  'Brotherhood', 'Cabal', 'Convocation', 'Criminal Syndicate',
  'Dark Dimension', 'Defenders', 'Dracula', 'Galaxy Guardians',
  'Hellfire Club', 'Hydra', 'Inhumans', 'Intelligencia', 'Mephisto',
  'Midnight Sons', 'Mighty Avengers', 'New Mutants', "Onslaught's Grip",
  'Sentinels', 'S.H.I.E.L.D.', 'Spider Foes', 'Thunderbolts', 'Uncanny X-Men',
  'Wakanda', 'Weapon X', 'Web Warriors', 'Winter Guard', 'X-Force',
];
