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
  { id: 'apocalypse', name: 'Apocalypse', affiliations: ['Apocalypse'], image: img('Apocalypse.png') },
  { id: 'baron-strucker', name: 'Strucker', affiliations: ['Hydra'], image: img('BaronStrucker_.png') },
  { id: 'baron-zemo', name: 'Baron Zemo', affiliations: ['Cabal', 'Hydra'], image: img('BaronZemo.png') },
  { id: 'bastion', name: 'Bastion', affiliations: ['Sentinels'], image: img('Bastion.png') },
  { id: 'black-bolt', name: 'Black Bolt', affiliations: ['Inhumans'], image: img('BlackBolt.png') },
  { id: 'black-panther', name: 'Black Panther', affiliations: ['Wakanda'], image: img('BlackPanther.png') },
  { id: 'blade', name: 'Blade', affiliations: ['Midnight Sons'], image: img('Blade.png') },
  { id: 'cable', name: 'Cable', affiliations: ['X-Force'], image: img('Cable.png') },
  { id: 'crimson-dynamo', name: 'Crimson Dynamo', affiliations: ['Winter Guard'], image: img('CrimsonDynamo.svg') },
  { id: 'cyclops', name: 'Cyclops', affiliations: ['Uncanny X-Men'], image: img('Cyclops.png') },
  { id: 'daredevil', name: 'Daredevil', affiliations: ['Defenders'], image: img('Daredevil.png') },
  { id: 'doctor-strange', name: 'Doctor Strange', affiliations: ['Defenders'], image: img('DoctorStrange.png') },
  { id: 'dormammu', name: 'Dormammu', affiliations: ['Dark Dimension'], image: img('Dormammu.png') },
  { id: 'dracula', name: 'Dracula', affiliations: ['Dracula'], image: img('Dracula.png') },
  { id: 'elsa-bloodstone', name: 'Elsa Bloodstone', affiliations: ['Midnight Sons'], image: img('ElsaBloodstone.png') },
  { id: 'emma-frost', name: 'Emma Frost', affiliations: ['Hellfire Club'], image: img('EmmaFrost.svg') },
  { id: 'green-goblin', name: 'Green Goblin', affiliations: ['Spider Foes'], image: img('GreenGoblin.png') },
  { id: 'hulkbuster', name: 'Hulkbuster', affiliations: ['Avengers'], image: img('Hulkbuster.png') },
  { id: 'iron-man', name: 'Iron-Man', affiliations: ['Avengers'], image: img('IronMan.png') },
  { id: 'jane-foster', name: 'Jane Foster', affiliations: ['Asgard'], image: img('JaneFoster.png') },
  { id: 'kang', name: 'Kang', affiliations: ['Cabal'], image: img('Kang.png') },
  { id: 'kingpin', name: 'Kingpin', affiliations: ['Criminal Syndicate'], image: img('Kingpin.png') },
  { id: 'klaw', name: 'Klaw', affiliations: ['Criminal Syndicate'], image: img('Klaw.png') },
  { id: 'the-leader', name: 'The Leader', affiliations: ['Intelligencia'], image: img('Leader.png') },
  { id: 'loki', name: 'Loki', affiliations: ['Asgard'], image: img('Loki.png') },
  { id: 'mbaku', name: "M'Baku", affiliations: ['Wakanda'], image: img('MBaku.png') },
  { id: 'magik', name: 'Magik', affiliations: ['New Mutants'], image: img('Magik.png') },
  { id: 'magneto', name: 'Magneto', affiliations: ['Brotherhood'], image: img('Magneto.png') },
  { id: 'malekith', name: 'Malekith', affiliations: ['Cabal'], image: img('Malekith.png') },
  { id: 'maximus', name: 'Maximus', affiliations: ['Inhumans'], image: img('Maximus.png') },
  { id: 'medusa', name: 'Medusa', affiliations: ['Inhumans'], image: img('Medusa.png') },
  { id: 'mephisto', name: 'Mephisto', affiliations: ['Mephisto'], image: img('Mephisto.png') },
  { id: 'miles-morales', name: 'Miles Morales', affiliations: ['Web Spider'], image: img('MilesMorales.png') },
  { id: 'modok', name: 'M.O.D.O.K.', affiliations: ['Criminal Syndicate'], image: img('Modok.png') },
  { id: 'mystique', name: 'Mystique', affiliations: ['Brotherhood'], image: img('Mystique.png') },
  { id: 'namor', name: 'Namor', affiliations: ['SHIELD'], image: img('Namor.png') },
  { id: 'nick-fury', name: 'Nick Fury', affiliations: ['SHIELD'], image: img('NickFury.png') },
  { id: 'octopus', name: 'Octopus', affiliations: ['Spider Foes'], image: img('Octopus.svg') },
  { id: 'onslaught', name: 'Onslaught', affiliations: ["Onslaught's Grip"], image: img('Onslaught.png') },
  { id: 'professor-xavier', name: 'Professor Xavier', affiliations: ['Uncanny X-Men'], image: img('ProfessorX.png') },
  { id: 'red-hulk', name: 'Red Hulk', affiliations: ['Thunderbolts'], image: img('RedHulk.png') },
  { id: 'red-skull', name: 'Red Skull', affiliations: ['Cabal', 'Hydra'], image: img('RedSkull.png') },
  { id: 'sam-wilson', name: 'Sam Wilson', affiliations: ['Avengers'], image: img('SamWilson.png') },
  { id: 'sentinel', name: 'Sentinel', affiliations: ['Sentinels'], image: img('Sentinel.png') },
  { id: 'shadowlands-daredevil', name: 'Shadowlands Daredevil', affiliations: ['Criminal Syndicate'], image: img('ShadowlandsDaredevil.png') },
  { id: 'she-hulk', name: 'She-Hulk', affiliations: ['A-Force'], image: img('SheHulk.png') },
  { id: 'sin', name: 'Sin', affiliations: ['Cabal'], image: img('Sin.png') },
  { id: 'spectrum', name: 'Spectrum', affiliations: ['Mighty Avengers'], image: img('Spectrum.png') },
  { id: 'spider-man', name: 'Spider-Man', affiliations: ['Web Spider'], image: img('SpiderMan.png') },
  { id: 'starlord', name: 'Starlord', affiliations: ['Galaxy Guardians'], image: img('Starlord.png') },
  { id: 'storm', name: 'Storm', affiliations: ['Uncanny X-Men'], image: img('Storm.svg') },
  { id: 'supreme-doctor-strange', name: 'Supreme Doctor Strange', affiliations: ['Convocation'], image: img('SupremeDoctorStrange.png') },
  { id: 'thanos', name: 'Thanos', affiliations: ['Black Order'], image: img('Thanos.svg') },
  { id: 'thor', name: 'Thor', affiliations: ['Asgard'], image: img('Thor.svg') },
  { id: 'weapon-x', name: 'Weapon X', affiliations: ['Weapon X'], image: img('WeaponX.svg') },
];

export const AFFILIATIONS = [
  'A-Force', 'Apocalypse', 'Asgard', 'Avengers', 'Black Order',
  'Brotherhood', 'Cabal', 'Convocation', 'Criminal Syndicate',
  'Dark Dimension', 'Defenders', 'Dracula', 'Galaxy Guardians',
  'Hellfire Club', 'Hydra', 'Inhumans', 'Intelligencia', 'Mephisto',
  'Midnight Sons', 'Mighty Avengers', 'New Mutants', "Onslaught's Grip",
  'Sentinels', 'SHIELD', 'Spider Foes', 'Thunderbolts', 'Uncanny X-Men',
  'Wakanda', 'Weapon X', 'Web Spider', 'Winter Guard', 'X-Force',
];
