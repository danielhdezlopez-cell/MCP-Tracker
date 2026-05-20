export type MissionType = 'Secure' | 'Extract';

export interface Mission {
  id: string;
  name: string;
  threat: number;
  type: MissionType;
  image?: string;
}

const base = import.meta.env.BASE_URL;
const card = (file: string) =>
  `${base}assets/mission-cards/${encodeURIComponent(file)}`;

export const MISSIONS: Mission[] = [
  // EXTRACT
  { id: 'alien-ship',            name: 'Alien Ship Crashes In Downtown!',                  threat: 17, type: 'Extract', image: card('Alien Ship Crashes In Downtown!.png') },
  { id: 'scientific-samples',    name: 'Scientific Samples Found In Discovered Universe',   threat: 17, type: 'Extract', image: card('Scientific Samples Found In Discovered Universe.png') },
  { id: 'spider-infected',       name: 'Spider-Infected Invade Manhattan',                  threat: 17, type: 'Extract', image: card('Spider-Infected Invade Manhattan.png') },
  { id: 'royal-wedding',         name: 'Unexpected Guests Crash Royal Wedding',             threat: 17, type: 'Extract', image: card('Unexpected Guests Crash Royal Wedding.png') },
  { id: 'inhumans-weaponry',     name: 'Inhumans Deploy Advanced Weaponry',                 threat: 18, type: 'Extract', image: card('Inhumans Deploy Advanced Weaponry.png') },
  { id: 'jailbreak',             name: 'Jailbreak Leads To Mass Mutant Escape!',            threat: 20, type: 'Extract', image: card('Jailbreak Leads To Mass Mutant Escape!.webp') },
  { id: 'mutant-extremists',     name: 'Mutants Extremists Target U.S. Senators!',          threat: 19, type: 'Extract', image: card('Mutants Extremists Target U.S. Senators!.png') },
  { id: 'experimental-soldiers', name: 'Evidence Of Experimental Soldiers Exposed',         threat: 19, type: 'Extract', image: card('Evidence Of Experimental Soldiers Exposed.webp') },
  { id: 'skrulls-infiltrate',    name: 'Skrulls Infiltrate World Leadership',               threat: 20, type: 'Extract', image: card('Skrulls Infiltrate World Leadership.png') },
  { id: 'sentinel-schematics',   name: 'Sentinel Schematics Sabotaged!',                    threat: 17, type: 'Extract', image: card('Sentinel Schematics Sabotaged!.webp') },
  { id: 'salvaged-supplies',     name: 'Salvaged Supplies Fuel Resistance Efforts',         threat: 18, type: 'Extract', image: card('Salvaged Supplies Fuel Resistance Efforts.webp') },
  { id: 'surprise-assault',      name: 'Surprise Assault! Mutant Homes Destroyed',          threat: 16, type: 'Extract', image: card('Surprise Assault! Mutant Homes Destroyed.webp') },
  // SECURE
  { id: 'lockdown',              name: 'Lockdown! Security Systems Stymie Breakout',        threat: 18, type: 'Secure',  image: card('Lockdown! Security Systems Stymie Breakout.webp') },
  { id: 'xmen-infiltrate',       name: 'X-Men Infiltrate Secret Weapons Facility',          threat: 17, type: 'Secure',  image: card('X-Men Infiltrate Secret Weapons Facility.webp') },
  { id: 'power-overload',        name: 'Power Overload! Factory Goes Up In Flames',         threat: 19, type: 'Secure',  image: card('Power Overload! Factory Goes Up In Flames.webp') },
  { id: 'survivors-shelter',     name: 'Survivors Search For Safe Shelter',                 threat: 20, type: 'Secure',  image: card('Survivors Search For Safe Shelter.webp') },
  { id: 'assault-ships',         name: 'Assault Ships Make Sweeping Search!',               threat: 16, type: 'Secure',  image: card('Assault Ships Make Sweeping Search!.webp') },
  { id: 'deadly-meteors',        name: 'Deadly Meteors Mutate Civilians',                   threat: 17, type: 'Secure',  image: card('Deadly Meteors Mutate Civilians.png') },
  { id: 'guardians-empress',     name: "Guardians Save Shi'Ar Empress In Style",            threat: 17, type: 'Secure',  image: card("Guardians Save Shi'Ar Empress In Style.png") },
  { id: 'infinity-formula',      name: 'Infinity Formula Goes Missing!',                    threat: 17, type: 'Secure',  image: card('Infinity Formula Goes Missing!.png') },
  { id: 'mutant-madman',         name: 'Mutant Madman Turns City Into Lethal Amusement Park', threat: 18, type: 'Secure', image: card('Mutant Madman Turns City Into Lethal Amusement Park.png') },
  { id: 'sinister-syndicate',    name: 'Super-Powered Scoundrels Form Sinister Syndicate',  threat: 20, type: 'Secure',  image: card('Super-Powered Scoundrels Form Sinister Syndicate.png') },
  { id: 'wedding-party',         name: 'Wedding Party Targeted In Terrible Attack!',        threat: 20, type: 'Secure',  image: card('Wedding Party Targeted In Terrible Attack!.png') },
];

const sortMissions = (a: Mission, b: Mission) =>
  a.threat !== b.threat ? a.threat - b.threat : a.name.localeCompare(b.name);

export const EXTRACT_MISSIONS = MISSIONS.filter(m => m.type === 'Extract').sort(sortMissions);
export const SECURE_MISSIONS  = MISSIONS.filter(m => m.type === 'Secure').sort(sortMissions);
