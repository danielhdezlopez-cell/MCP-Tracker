import { type Theme } from '../store/useMcpStore';

const ASSETS_BASE = (import.meta.env.VITE_ASSETS_BASE as string | undefined) ?? 'https://danielhdezlopez-cell.github.io/MCP-Tracker/';

interface VideoThemeEntry {
  src: string;
  modifier: string;
  smoothLoop?: boolean;
  /** Vertical anchor for object-position. '0%'/'top' = show top, '50%' = center, '100%' = bottom. */
  objectPositionY?: string;
  /** Uniform scale factor applied via transform (e.g. 1.2 = 20% zoom in, keeps subject centered). */
  scale?: number;
}

export const VIDEO_THEMES: Partial<Record<Theme, VideoThemeEntry>> = {
  apocalypse:          { src: `${ASSETS_BASE}assets/backgrounds/BG_Apocalypse2.mp4`,                  modifier: 'anim-theme-bg--apocalypse', smoothLoop: true },
  'black-bolt':    { src: `${ASSETS_BASE}assets/backgrounds/BG_BlackBolt.mp4`,    modifier: 'anim-theme-bg--black-bolt',    smoothLoop: true, scale: 1.25 },
  'black-panther': { src: `${ASSETS_BASE}assets/backgrounds/BG_BlackPanther.mp4`, modifier: 'anim-theme-bg--black-panther', smoothLoop: true },
  cable:               { src: `${ASSETS_BASE}assets/backgrounds/BG_Cable.mp4`,                    modifier: 'anim-theme-bg--cable', smoothLoop: true },
  'captain-america':   { src: `${ASSETS_BASE}assets/backgrounds/BG_CaptainAmerica.mp4`,            modifier: 'anim-theme-bg--captain-america', objectPositionY: '20%' },
  'cap-first-avenger': { src: `${ASSETS_BASE}assets/backgrounds/BG_CaptainAmericaFirstAvenger.mp4`, modifier: 'anim-theme-bg--cap-first-avenger' },
  convocation:         { src: `${ASSETS_BASE}assets/backgrounds/BG_Convocation.mp4`,                modifier: 'anim-theme-bg--convocation'       },
  corbus:              { src: `${ASSETS_BASE}assets/backgrounds/BG_Corbus.mp4`,                    modifier: 'anim-theme-bg--corbus',            smoothLoop: true },
  cyclops:             { src: `${ASSETS_BASE}assets/backgrounds/BG_Cyclops.mp4`,                    modifier: 'anim-theme-bg--cyclops', smoothLoop: true, scale: 1.25 },
  'dark-dimension':    { src: `${ASSETS_BASE}assets/backgrounds/BG_Dormammu.mp4`,                   modifier: 'anim-theme-bg--dark-dimension'    },
  daredevil:           { src: `${ASSETS_BASE}assets/backgrounds/BG_Daredevil.mp4`,                  modifier: 'anim-theme-bg--daredevil', smoothLoop: true, scale: 1.25 },
  'doc-ock':           { src: `${ASSETS_BASE}assets/backgrounds/BG_DocOck.mp4`,                     modifier: 'anim-theme-bg--doc-ock', objectPositionY: '40%', scale: 1.1 },
  'dr-strange':        { src: `${ASSETS_BASE}assets/backgrounds/BG_DrStrange.mp4`,                  modifier: 'anim-theme-bg--dr-strange', objectPositionY: '30%' },
  dracula:             { src: `${ASSETS_BASE}assets/backgrounds/BG_Dracula.mp4`,                    modifier: 'anim-theme-bg--dracula'           },
  'elsa-bloodstone':   { src: `${ASSETS_BASE}assets/backgrounds/BG_ElsaBloodstone.mp4`,           modifier: 'anim-theme-bg--elsa-bloodstone',   smoothLoop: true },
  'emma-frost':        { src: `${ASSETS_BASE}assets/backgrounds/BG_EmmaFrost2.mp4`,               modifier: 'anim-theme-bg--emma-frost',         smoothLoop: true, scale: 1.1 },
  'green-goblin':      { src: `${ASSETS_BASE}assets/backgrounds/BG_GreenGoblin.mp4`,              modifier: 'anim-theme-bg--green-goblin', smoothLoop: true, objectPositionY: '15%' },
  'hellfire-club':     { src: `${ASSETS_BASE}assets/backgrounds/BG_Hellfireclub.mp4`,              modifier: 'anim-theme-bg--hellfire-club'     },
  mephisto:            { src: `${ASSETS_BASE}assets/backgrounds/BG_Mephisto.mp4`,                  modifier: 'anim-theme-bg--mephisto'          },
  'midnight-sons':     { src: `${ASSETS_BASE}assets/backgrounds/BG_MidnightSons.mp4`,             modifier: 'anim-theme-bg--midnight-sons'     },
  modok:               { src: `${ASSETS_BASE}assets/backgrounds/BG_MODOK.mp4`,                    modifier: 'anim-theme-bg--modok', smoothLoop: true },
  mystique:            { src: `${ASSETS_BASE}assets/backgrounds/BG_Mystique.mp4`,                 modifier: 'anim-theme-bg--mystique'          },
  namor:               { src: `${ASSETS_BASE}assets/backgrounds/BG_Namor.mp4`,                   modifier: 'anim-theme-bg--namor',             smoothLoop: true, objectPositionY: '20%' },
  hulkbuster: { src: `${ASSETS_BASE}assets/backgrounds/BG_Avengers_Hulkbuster.mp4`, modifier: 'anim-theme-bg--hulkbuster' },
  hydra:  { src: `${ASSETS_BASE}assets/backgrounds/BG_HYDRA.mp4`,       modifier: 'anim-theme-bg--hydra'      },
  'invincible-ironman': { src: `${ASSETS_BASE}assets/backgrounds/BG_InvincibleIronman.mp4`, modifier: 'anim-theme-bg--invincible-ironman', smoothLoop: true },
  'jane-foster':        { src: `${ASSETS_BASE}assets/backgrounds/BG_JaneFoster.mp4`,        modifier: 'anim-theme-bg--jane-foster',        smoothLoop: true },
  kang:                 { src: `${ASSETS_BASE}assets/backgrounds/BG_Kang.mp4`,              modifier: 'anim-theme-bg--kang',              smoothLoop: true },
  'kill-monger':  { src: `${ASSETS_BASE}assets/backgrounds/BG_KillMonger.mp4`,  modifier: 'anim-theme-bg--kill-monger',  smoothLoop: true },
  'king-tchalla': { src: `${ASSETS_BASE}assets/backgrounds/BG_KingTChalla.mp4`, modifier: 'anim-theme-bg--king-tchalla', smoothLoop: true },
  kingpin: { src: `${ASSETS_BASE}assets/backgrounds/BG_Kingpin.mp4`,     modifier: 'anim-theme-bg--kingpin', smoothLoop: true },
  klaw:   { src: `${ASSETS_BASE}assets/backgrounds/BG_Klaw.mp4`,        modifier: 'anim-theme-bg--klaw', smoothLoop: true, objectPositionY: '10%' },
  loki:    { src: `${ASSETS_BASE}assets/backgrounds/BG_Loki.mp4`,     modifier: 'anim-theme-bg--loki', smoothLoop: true },
  magik:   { src: `${ASSETS_BASE}assets/backgrounds/BG_Magik.mp4`,    modifier: 'anim-theme-bg--magik', smoothLoop: true, objectPositionY: '30%' },
  malekith: { src: `${ASSETS_BASE}assets/backgrounds/BG_Malekith.mp4`, modifier: 'anim-theme-bg--malekith', smoothLoop: true },
  magneto: { src: `${ASSETS_BASE}assets/backgrounds/BG_Magneto.mp4`, modifier: 'anim-theme-bg--magneto', smoothLoop: true },
  'maximus-the-mad': { src: `${ASSETS_BASE}assets/backgrounds/BG_MaximusTheMad.mp4`, modifier: 'anim-theme-bg--maximus-the-mad', smoothLoop: true },
  mbaku:             { src: `${ASSETS_BASE}assets/backgrounds/BG_MBaku.mp4`,          modifier: 'anim-theme-bg--mbaku',          smoothLoop: true },
  medusa:  { src: `${ASSETS_BASE}assets/backgrounds/BG_Medusa.mp4`,  modifier: 'anim-theme-bg--medusa',  smoothLoop: true },
  shield: { src: `${ASSETS_BASE}assets/backgrounds/BG_SHIELD.mp4`,      modifier: 'anim-theme-bg--shield'     },
  sin:    { src: `${ASSETS_BASE}assets/backgrounds/BG_Sin.mp4`,          modifier: 'anim-theme-bg--sin',         smoothLoop: true },
  asgard:       { src: `${ASSETS_BASE}assets/backgrounds/BG_Asgard.mp4`,      modifier: 'anim-theme-bg--asgard'     },
  'spider-man': { src: `${ASSETS_BASE}assets/backgrounds/BG_SpiderMan.mp4`, modifier: 'anim-theme-bg--spider-man', smoothLoop: true },
  spectrum:     { src: `${ASSETS_BASE}assets/backgrounds/BG_Spectrum.mp4`,    modifier: 'anim-theme-bg--spectrum',  smoothLoop: true },
  starlord:     { src: `${ASSETS_BASE}assets/backgrounds/BG_Starlord.mp4`,   modifier: 'anim-theme-bg--starlord', smoothLoop: true },
  'she-hulk':   { src: `${ASSETS_BASE}assets/backgrounds/BG_SheHulk.mp4`,   modifier: 'anim-theme-bg--she-hulk', smoothLoop: true },
  storm:        { src: `${ASSETS_BASE}assets/backgrounds/BG_Storm.mp4`,      modifier: 'anim-theme-bg--storm', smoothLoop: true },
  'miles-morales': { src: `${ASSETS_BASE}assets/backgrounds/BG_MilesMorales.mp4`, modifier: 'anim-theme-bg--miles-morales', smoothLoop: true, scale: 1.25 },
  thanos:          { src: `${ASSETS_BASE}assets/backgrounds/BG_Thanos.mp4`,        modifier: 'anim-theme-bg--thanos', smoothLoop: true },
  thor:            { src: `${ASSETS_BASE}assets/backgrounds/BG_Thor.mp4`,          modifier: 'anim-theme-bg--thor', smoothLoop: true },
  onslaught:       { src: `${ASSETS_BASE}assets/backgrounds/BG_Onslaught.mp4`,   modifier: 'anim-theme-bg--onslaught', smoothLoop: true, scale: 1.2 },
  'professor-x':   { src: `${ASSETS_BASE}assets/backgrounds/BG_ProfessorX2.mp4`, modifier: 'anim-theme-bg--professor-x', smoothLoop: true },
  'the-leader':    { src: `${ASSETS_BASE}assets/backgrounds/BG_TheLeader.mp4`,    modifier: 'anim-theme-bg--the-leader', smoothLoop: true },
  thunderbolts:    { src: `${ASSETS_BASE}assets/backgrounds/BG_Thunderbolts_RedHulk.mp4`, modifier: 'anim-theme-bg--thunderbolts' },
  ultron:       { src: `${ASSETS_BASE}assets/backgrounds/BG_Ultron.mp4`,      modifier: 'anim-theme-bg--ultron'     },
  'weapon-x':    { src: `${ASSETS_BASE}assets/backgrounds/BG_WeaponX.mp4`,      modifier: 'anim-theme-bg--weapon-x'    },
  'winter-guard': { src: `${ASSETS_BASE}assets/backgrounds/BG_WinterGuard.mp4`, modifier: 'anim-theme-bg--winter-guard', objectPositionY: '30%' },
  'adam-warlock': { src: `${ASSETS_BASE}assets/backgrounds/BG_AdamWarlock.mp4`, modifier: 'anim-theme-bg--adam-warlock', smoothLoop: true, objectPositionY: '10%' },
  'red-skull':                     { src: `${ASSETS_BASE}assets/backgrounds/BG_RedSkull.mp4`,                    modifier: 'anim-theme-bg--red-skull',                    smoothLoop: true },
  'red-skull-master-of-hydra':     { src: `${ASSETS_BASE}assets/backgrounds/BG_RedSkullMasterOfHydra.mp4`,     modifier: 'anim-theme-bg--red-skull-master-of-hydra',     smoothLoop: true, scale: 1.2 },
  'red-skull-master-of-the-world': { src: `${ASSETS_BASE}assets/backgrounds/BG_RedSkullMasterOfTheWorld.mp4`, modifier: 'anim-theme-bg--red-skull-master-of-the-world', smoothLoop: true },
  'sam-wilson': { src: `${ASSETS_BASE}assets/backgrounds/BG_SamWilson.mp4`, modifier: 'anim-theme-bg--sam-wilson' },
  sentinels:    { src: `${ASSETS_BASE}assets/backgrounds/BG_Sentinels.mp4`,  modifier: 'anim-theme-bg--sentinels'  },
  'baron-strucker':       { src: `${ASSETS_BASE}assets/backgrounds/BG_BaronStrucker.mp4`,      modifier: 'anim-theme-bg--baron-strucker', smoothLoop: true, objectPositionY: '65%' },
  'baron-zemo':           { src: `${ASSETS_BASE}assets/backgrounds/BG_BaronZemo.mp4`,           modifier: 'anim-theme-bg--baron-zemo', smoothLoop: true },
  'bastion':              { src: `${ASSETS_BASE}assets/backgrounds/BG_Bastion.mp4`,             modifier: 'anim-theme-bg--bastion' },
  'blade':                { src: `${ASSETS_BASE}assets/backgrounds/BG_Blade.mp4`,               modifier: 'anim-theme-bg--blade', smoothLoop: true },
  'nick-fury':            { src: `${ASSETS_BASE}assets/backgrounds/BG_NickFury.mp4`,            modifier: 'anim-theme-bg--nick-fury', smoothLoop: true, objectPositionY: '30%' },
  'shadowland-daredevil': { src: `${ASSETS_BASE}assets/backgrounds/BG_ShadowlandDaredevil.mp4`, modifier: 'anim-theme-bg--shadowland-daredevil', smoothLoop: true },
};

export function getThemeVideoSrc(theme: Theme): string | null {
  return VIDEO_THEMES[theme]?.src ?? null;
}

export function getThemeVideoConfig(theme: Theme): VideoThemeEntry | null {
  return VIDEO_THEMES[theme] ?? null;
}

