export type MissionType = 'Secure' | 'Extract';

export interface Mission {
  id: string;
  name: string;
  threat: number;
  type: MissionType;
}

export const MISSIONS: Mission[] = [
  // EXTRACT
  { id: 'alien-ship', name: 'Alien Ship Crashes In Downtown!', threat: 17, type: 'Extract' },
  { id: 'scientific-samples', name: 'Scientific Samples Found In Discovered Universe', threat: 17, type: 'Extract' },
  { id: 'spider-infected', name: 'Spider-Infected Invade Manhattan', threat: 17, type: 'Extract' },
  { id: 'royal-wedding', name: 'Unexpected Guests Crash Royal Wedding', threat: 17, type: 'Extract' },
  { id: 'inhumans-weaponry', name: 'Inhumans Deploy Advanced Weaponry', threat: 18, type: 'Extract' },
  { id: 'jailbreak', name: 'Jailbreak Leads To Mass Mutant Escape!', threat: 20, type: 'Extract' },
  { id: 'mutant-extremists', name: 'Mutants Extremists Target U.S. Senators!', threat: 19, type: 'Extract' },
  { id: 'experimental-soldiers', name: 'Evidence Of Experimental Soldiers Exposed', threat: 19, type: 'Extract' },
  { id: 'skrulls-infiltrate', name: 'Skrulls Infiltrate World Leadership', threat: 20, type: 'Extract' },
  { id: 'sentinel-schematics', name: 'Sentinel Schematics Sabotaged!', threat: 17, type: 'Extract' },
  { id: 'salvaged-supplies', name: 'Salvaged Supplies Fuel Resistance Efforts', threat: 18, type: 'Extract' },
  { id: 'surprise-assault', name: 'Surprise Assault! Mutant Homes Destroyed', threat: 16, type: 'Extract' },
  // SECURE
  { id: 'lockdown', name: 'Lockdown! Security Systems Stymie Breakout', threat: 18, type: 'Secure' },
  { id: 'xmen-infiltrate', name: 'X-Men Infiltrate Secret Weapons Facility', threat: 17, type: 'Secure' },
  { id: 'power-overload', name: 'Power Overload! Factory Goes Up In Flames', threat: 19, type: 'Secure' },
  { id: 'survivors-shelter', name: 'Survivors Search For Safe Shelter', threat: 20, type: 'Secure' },
  { id: 'assault-ships', name: 'Assault Ships Make Sweeping Search!', threat: 16, type: 'Secure' },
  { id: 'deadly-meteors', name: 'Deadly Meteors Mutate Civilians', threat: 17, type: 'Secure' },
  { id: 'guardians-empress', name: 'Guardians Save Shi\'Ar Empress In Style', threat: 17, type: 'Secure' },
  { id: 'infinity-formula', name: 'Infinity Formula Goes Missing!', threat: 17, type: 'Secure' },
  { id: 'mutant-madman', name: 'Mutant Madman Turns City Into Lethal Amusement Park', threat: 18, type: 'Secure' },
  { id: 'sinister-syndicate', name: 'Super-Powered Scoundrels Form Sinister Syndicate', threat: 20, type: 'Secure' },
  { id: 'wedding-party', name: 'Wedding Party Targeted In Terrible Attack!', threat: 20, type: 'Secure' },
];

export const EXTRACT_MISSIONS = MISSIONS.filter(m => m.type === 'Extract');
export const SECURE_MISSIONS = MISSIONS.filter(m => m.type === 'Secure');
