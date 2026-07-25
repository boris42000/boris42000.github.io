# Zdroje a licencie

## Fotografie

Obe fotografie pochádzajú z **Pexels** a sú podľa [Pexels licencie](https://www.pexels.com/license/)
zdarma na komerčné použitie **bez povinnosti uvádzať autora**. Uvádzame ich napriek tomu.

| Súbor | Pexels ID | Pôvod | Použitie |
|---|---|---|---|
| `src-images/about.jpg` | 23496898 | https://www.pexels.com/photo/23496898/ | Sekcia „O nás" |
| `src-images/detail.jpg` | 4476375 | https://www.pexels.com/photo/4476375/ | Pozadie CTA pásu |

> Meno fotografa je uvedené na stránke fotografie na Pexels. Ak ho chcete doplniť,
> otvorte odkaz vyššie a prepíšte tabuľku.

**Odporúčanie:** skutočné fotografie kancelárie alebo tímu by fungovali lepšie než
akákoľvek stocková fotka. Ak ich máte, nahraďte súbory v `src-images/` (rovnaké názvy)
a spustite `npm run images`.

## Písma

| Písmo | Licencia | Zdroj |
|---|---|---|
| Fraunces Variable | SIL Open Font License 1.1 | `@fontsource-variable/fraunces` |
| Plus Jakarta Sans Variable | SIL Open Font License 1.1 | `@fontsource-variable/plus-jakarta-sans` |

Písma sú hosťované lokálne (žiadne volania na Google Fonts), takže web nerobí
**žiadne požiadavky na tretie strany**.

## Ikony

[Lucide](https://lucide.dev) — licencia ISC.

## Logo

`src/components/ui/Logo.tsx` — monogram ABM prekreslený do vektoru (SVG) podľa
pôvodného súboru `OldWeb/assets/img/logo.png`. Originál obsahoval biele artefakty
z nekvalitného exportu; vektorová verzia je čistá, ostrá v každej veľkosti
a prefarbiteľná cez `currentColor`.
