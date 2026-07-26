/**
 * Všetok text webu na jednom mieste.
 *
 * Ak chcete zmeniť akýkoľvek text na stránke, upravte ho tu — nie v komponentoch.
 * Po úprave spustite `npm run build` a nahrajte obsah priečinka `dist/` na FTP.
 */

export const FOUNDED_YEAR = 1996

/** Roky na trhu sa počítajú automaticky — číslo na webe nikdy nezostarne. */
export const yearsInBusiness = () => new Date().getFullYear() - FOUNDED_YEAR

export const company = {
  brand: 'ABMaudit',
  legalName: 'ABM AUDIT s.r.o.',
  foundedYear: FOUNDED_YEAR,
  street: 'Pribinova 1',
  city: 'Topoľčany',
  // TODO: potvrdiť PSČ
  postalCode: '955 01',
  country: 'Slovensko',
  phone: '+421 915 743 058',
  phoneHref: 'tel:+421915743058',
  email: 'abmaudit@abmaudit.sk',
  emailHref: 'mailto:abmaudit@abmaudit.sk',
  mapsUrl:
    'https://www.google.com/maps/place/ABM+AUDIT+s.r.o./@48.5595222,18.1742406,17z/data=!3m1!4b1!4m5!3m4!1s0x476b4aaf9cb8612d:0xc91e500c37a3e994!8m2!3d48.5595187!4d18.1764293',
  lat: 48.5595187,
  lng: 18.1764293,
  // TODO: doplniť od klienta
  ico: '',
  dic: '',
  icDph: '',
  openingHours: '',
} as const

export const credentials = {
  companyLicence: '000242',
  companyLicenceLabel: 'Licencia SKAU',
  auditor: 'Ing. Miroslav Bobocký',
  auditorLicence: '827',
  taxAdvisorLicence: '456/96',
} as const

export const nav = [
  { label: 'Domov', href: '#domov' },
  { label: 'O nás', href: '#o-nas' },
  { label: 'Služby', href: '#sluzby' },
  { label: 'Referencie', href: '#referencie' },
  { label: 'Časté otázky', href: '#faq' },
  { label: 'Kontakt', href: '#kontakt' },
] as const

export const hero = {
  eyebrow: 'Audítorská a účtovná spoločnosť · Topoľčany',
  /** `highlight` sa v nadpise podčiarkne zlatou. */
  titleBefore: 'Čísla, ktorým môžete',
  highlight: 'veriť',
  titleAfter: '.',
  lead:
    'Audit, vedenie účtovníctva, mzdy a daňové poradenstvo pod dohľadom licencovaného daňového poradcu a audítora. Pracujeme u nás v kancelárii, priamo u klienta aj cez vzdialený prístup.',
  primaryCta: { label: 'Nezáväzná konzultácia', href: '#kontakt' },
  secondaryCta: { label: 'Naše služby', href: '#sluzby' },
  chips: [
    { label: 'Audítorská licencia SKAU', value: '000242' },
    { label: 'Na trhu od roku', value: String(FOUNDED_YEAR) },
  ],
}

export const trustStrip = [
  { label: 'Daňový poradca', value: `ev. č. ${credentials.taxAdvisorLicence}` },
  { label: 'Audítor SKAU', value: `č. ${credentials.auditorLicence}` },
  { label: 'Licencia spoločnosti SKAU', value: credentials.companyLicence },
  { label: 'Jednoduché aj podvojné', value: 'účtovníctvo' },
]

export const about = {
  eyebrow: 'O nás',
  titleBefore: 'Dvadsať rokov skúseností je',
  highlight: 'štandard',
  titleAfter: '. My sme tu dlhšie.',
  paragraphs: [
    `Všetky naše služby poskytujeme od roku ${FOUNDED_YEAR} prostredníctvom tímu kvalifikovaných účtovníčok, ktoré pracujú pod dohľadom licencovaného daňového poradcu a audítora Ing. Miroslava Bobockého.`,
    'Naša spoločnosť ABM AUDIT s.r.o. je audítorskou spoločnosťou. Evidenčné číslo licencie spoločnosti, vydanej Slovenskou komorou audítorov a oprávňujúcej na výkon činnosti, je 000242.',
    'Vedenie a kontrolu všetkých typov účtovníctva zabezpečíme u nás v kancelárii, priamo u vás, alebo prostredníctvom vzdialeného prístupu — podľa toho, čo vám najviac vyhovuje.',
  ],
  card: {
    name: credentials.auditor,
    role: 'Daňový poradca a audítor',
    lines: [
      `Daňový poradca — ev. č. ${credentials.taxAdvisorLicence}`,
      `Audítor SKAU — č. ${credentials.auditorLicence}`,
    ],
  },
  bullets: [
    'Kancelária v centre Topoľčian',
    'Pridelená účtovníčka pre každého klienta',
    'Vzdialený prístup k účtovníctvu',
    'Zastupovanie pri daňovej kontrole',
  ],
  photoAlt: 'Konzultácia účtovníctva v kancelárii ABM AUDIT',
}

/**
 * TODO — ČÍSLA NA POTVRDENIE OD KLIENTA.
 * `Roky na trhu` sa počíta automaticky z FOUNDED_YEAR a je vždy správne.
 * Ostatné hodnoty pochádzajú zo starého webu a treba ich aktualizovať.
 */
export const stats = [
  { value: yearsInBusiness(), suffix: '', label: 'Rokov na trhu', confirmed: true },
  { value: 150, suffix: '+', label: 'Spokojných klientov', confirmed: false },
  { value: 7, suffix: '', label: 'Kvalifikovaných zamestnancov', confirmed: false },
  { value: 4, suffix: '', label: 'Oblasti odbornosti', confirmed: true },
] as const

export type Service = {
  id: string
  icon: 'audit' | 'ledger' | 'payroll' | 'advisory'
  title: string
  summary: string
  body: string
  points: string[]
}

export const services: Service[] = [
  {
    id: 'audit',
    icon: 'audit',
    title: 'Audit',
    summary:
      'Overenie účtovnej závierky pre firmy so zákonnou povinnosťou aj pre tých, ktorí chcú mať istotu.',
    body: 'Táto služba je určená pre klientov, ktorí majú zákonom stanovenú povinnosť overiť účtovnú závierku spoločnosti audítorom, a tiež pre tých klientov, ktorí chcú mať istotu o správnosti vedenia svojho účtovníctva. Poskytne vám čo najpresnejšiu hodnotu vašich aktív a záväzkov k danému dátumu a v neposlednom rade nezávislý a verný obraz o účtovníctve celej spoločnosti pre ostatné subjekty.',
    points: [
      'Overenie riadnej aj mimoriadnej účtovnej závierky',
      'Nezávislý a verný obraz o hospodárení',
      'Presné ocenenie aktív a záväzkov k dátumu závierky',
      'Správa audítora pre banky, investorov a úrady',
    ],
  },
  {
    id: 'uctovnictvo',
    icon: 'ledger',
    title: 'Vedenie účtovníctva',
    summary:
      'Jednoduché aj podvojné účtovníctvo podľa platných slovenských predpisov, s pridelenou účtovníčkou.',
    body: 'Poskytujeme službu vedenia účtovníctva podľa platných slovenských predpisov, na základe zmluvy uzavretej s klientom. Pri poskytovaní tejto služby máte pridelenú účtovníčku, ktorá spracováva vaše účtovníctvo a zároveň s vami komunikuje. Vašou jedinou starosťou bude doručiť nám včas vaše účtovné doklady. Služba zahŕňa aj služby daňového poradcu, ktorý vám bude k dispozícii pri zastupovaní počas daňovej kontroly aj pri optimalizácii vašich daňových odvodov v rámci zákonov platných v SR.',
    points: [
      'Jedna zodpovedná účtovníčka, jeden kontakt',
      'Účtovné výstupy nastavené podľa vašich požiadaviek',
      'Priebežné účtovné a daňové poradenstvo v cene',
      'Zastupovanie pred správcom dane',
    ],
  },
  {
    id: 'mzdy',
    icon: 'payroll',
    title: 'Spracovanie miezd',
    summary:
      'Kompletná mzdová a personálna agenda v systéme MRP — od pracovnej zmluvy po ročné hlásenie.',
    body: 'Pre našich klientov poskytujeme službu vedenia mzdovej a personálnej agendy v systéme MRP. Spolupráca prebieha na podobnom princípe ako vedenie účtovníctva, teda na základe zmluvy s klientom. Máte pridelenú účtovníčku, ktorá spracováva vaše mzdové účtovníctvo a zároveň s vami komunikuje. Vašou jedinou starosťou bude doručiť nám včas podklady, ktoré potrebujeme na výpočet miezd.',
    points: [
      'Pracovné zmluvy a dohody',
      'Výpočet miezd a výplatné listiny',
      'Mesačné výkazy do poisťovní',
      'Ročné zúčtovanie preddavkov na daň',
    ],
  },
  {
    id: 'dane',
    icon: 'advisory',
    title: 'Daňové poradenstvo',
    summary:
      'Od konzultácie cez daňové plánovanie až po zastupovanie pred správcom dane a daňový audit.',
    body: 'Komplexné služby v oblasti daňového poradenstva — od konzultácií cez odborné stanoviská a daňové plánovanie až po zastupovanie pred správcom dane a daňový audit. Pripravíme daňové priznania pre právnické aj fyzické osoby a poradíme pri aplikácii medzinárodných zmlúv o zamedzení dvojitého zdanenia.',
    points: [
      'Daňové priznania pre právnické aj fyzické osoby',
      'Daňové plánovanie a optimalizácia',
      'Zastupovanie pri daňovej kontrole',
      'Zmluvy o zamedzení dvojitého zdanenia',
    ],
  },
]

/**
 * ⚠️ ZÁSTUPNÝ TEXT — NIE SÚ TO SKUTOČNÉ REFERENCIE.
 *
 * Mená klientov aj názvy spoločností sú zámerne v hranatých zátvorkách,
 * aby ich nikto nepovažoval za reálne. Pred spustením webu ich nahraďte
 * skutočnými referenciami, ku ktorým máte súhlas klienta — alebo celú
 * sekciu odstráňte (v `App.tsx` zmažte riadok `<Testimonials />`).
 */
export const testimonialsArePlaceholders = true

export const testimonials = [
  {
    quote:
      'Účtovníctvo sme mali roky rozhádzané medzi dvoma ľuďmi. Prevzatie prebehlo bez výpadku a odvtedy máme mesačné výstupy vždy načas.',
    name: '[Meno klienta]',
    role: 'konateľ',
    org: '[Názov spoločnosti]',
  },
  {
    quote:
      'Pri prvom povinnom audite sme netušili, čo nás čaká. Dostali sme presný zoznam podkladov a celé to prebehlo pokojnejšie, než sme čakali.',
    name: '[Meno klienta]',
    role: 'finančná riaditeľka',
    org: '[Názov spoločnosti]',
  },
  {
    quote:
      'Oceňujem, že mám jednu účtovníčku, ktorá pozná našu firmu. Nemusím pri každej otázke vysvetľovať kontext odznova.',
    name: '[Meno klienta]',
    role: 'majiteľ',
    org: '[Názov spoločnosti]',
  },
  {
    quote:
      'Pri daňovej kontrole nás zastupovali a komunikovali priamo s úradom. Ušetrilo nám to týždne práce a dosť nervov.',
    name: '[Meno klienta]',
    role: 'konateľ',
    org: '[Názov spoločnosti]',
  },
]

export type FaqItem = { q: string; a?: string; list?: string[] }

export const faq: FaqItem[] = [
  {
    q: 'Čo zahŕňa vedenie účtovníctva?',
    list: [
      'Priebežné vedenie jednoduchého a podvojného účtovníctva',
      'Spracovanie a podanie priznania k DPH, prípadne podanie súhrnného výkazu',
      'Nastavenie účtovných výstupov (účtovných zostáv a reportov) podľa požiadaviek klienta',
      'Priebežné účtovné a daňové poradenstvo',
      'Vypracovanie daňového priznania vrátane príloh a jeho podanie na daňový úrad',
      'Zostavenie účtovnej závierky podľa slovenských zákonov',
      'Zverejnenie účtovnej závierky v zbierke listín (len pri právnických osobách)',
      'Zastupovanie klienta pred správcom dane',
    ],
  },
  {
    q: 'Potrebujem účtovnú závierku overenú audítorom?',
    a: 'Riadnu individuálnu účtovnú závierku a mimoriadnu individuálnu účtovnú závierku musí mať overenú audítorom účtovná jednotka, ktorá je obchodnou spoločnosťou, ak povinne vytvára základné imanie, a družstvo — ak ku dňu, ku ktorému sa zostavuje účtovná závierka, a za bezprostredne predchádzajúce účtovné obdobie sú splnené aspoň dve z týchto podmienok:',
    list: [
      'Celková suma majetku presiahla 1 000 000 €, pričom sumou majetku sa rozumie suma majetku zistená zo súvahy v ocenení neupravenom o položky podľa § 26 ods. 3',
      'Čistý obrat presiahol 2 000 000 €, pričom čistým obratom sú na tento účel výnosy dosiahnuté z predaja výrobkov, tovarov a poskytnutých služieb a iné výnosy súvisiace s bežnou činnosťou účtovnej jednotky po odpočítaní zliav',
      'Priemerný prepočítaný počet zamestnancov v jednom účtovnom období presiahol 30',
    ],
  },
  {
    q: 'Čo zahŕňa spracovanie miezd?',
    list: [
      'Vyhotovenie pracovnej zmluvy',
      'Vyhotovenie dohody o pracovnej činnosti',
      'Vyhotovenie dohody o vykonaní práce',
      'Výpočet miezd podľa evidencie dochádzky',
      'Vyhotovenie výplatných listín',
      'Vedenie mzdových listov',
      'Spracovanie mesačných výkazov do poisťovní',
      'Vystavenie príkazu na úhradu miezd, poistného a zrazenej dane',
      'Vystavenie potvrdenia o zdaniteľnej mzde',
      'Ročné zúčtovanie zrazených preddavkov na daň z príjmov zo závislej činnosti',
      'Vystavenie zápočtového listu',
      'Vypracovanie štvrťročného prehľadu o zrazených a odvedených preddavkoch na daň zo závislej činnosti',
      'Vypracovanie ročného hlásenia o vyúčtovaní dane z príjmov fyzických osôb zo závislej činnosti',
      'Podanie mesačných prehľadov a ročných hlásení k dani z príjmov zo závislej činnosti na príslušný daňový úrad',
    ],
  },
  {
    q: 'Čo ponúka daňové poradenstvo?',
    list: [
      'Daňové poradenstvo podľa jednotlivých druhov daní pre právnické a fyzické osoby',
      'Odborné stanoviská na posúdenie daňových aspektov významných hospodárskych operácií',
      'Konzultácie o súvisiacich predpisoch v kombinácii s daňovými povinnosťami klienta',
      'Daňové plánovanie',
      'Daňový audit — podrobná dokladová kontrola účtovníctva a vyčíslenie základu dane',
      'Vypracovanie daňových priznaní k dani z príjmov pre právnické a fyzické osoby, k DPH, dani z motorových vozidiel, dani z nehnuteľností a ďalším',
      'Zastupovanie pred správcom dane pri daňovom konaní (registrácie, podanie žiadostí, pomoc pri obhajobe počas daňovej kontroly a pod.)',
      'Aplikácia medzinárodných zmlúv o zamedzení dvojitého zdanenia',
      'Služby v oblasti fúzií a akvizícií u domácich aj zahraničných klientov',
      'Vypracovanie kompletnej agendy pre vedenie daňových súdnych sporov',
      'Informácie o aktuálnych zmenách daňových predpisov',
      'Vybavovanie vrátenia DPH zahraničným osobám',
    ],
  },
]

export const contact = {
  eyebrow: 'Kontakt',
  titleBefore: 'Povedzte nám, čo',
  highlight: 'potrebujete',
  titleAfter: '.',
  lead:
    'Napíšte nám alebo rovno zavolajte. Ozveme sa vám s návrhom, ako vaše účtovníctvo, mzdy či audit prevziať bez výpadku.',
  formNote:
    'Formulár otvorí váš e-mailový program s predvyplnenou správou. Ak vám to nevyhovuje, zavolajte nám — vybavíme to rýchlejšie.',
  fields: {
    name: 'Meno a priezvisko',
    email: 'E-mail',
    phone: 'Telefón (nepovinné)',
    company: 'Spoločnosť (nepovinné)',
    message: 'Ako vám môžeme pomôcť?',
  },
  submit: 'Odoslať správu',
  subjectPrefix: 'Dopyt z webu',
}

export const footer = {
  blurb:
    'Audítorská a účtovná spoločnosť v Topoľčanoch. Audit, účtovníctvo, mzdy a daňové poradenstvo od roku 1996.',
  navHeading: 'Stránka',
  contactHeading: 'Kontakt',
}
