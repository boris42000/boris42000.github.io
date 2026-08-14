# Logá klientov

Do tohto priečinka nahrajte logá klientov — na stránke v sekcii **Naši klienti**
sa objavia automaticky, netreba upravovať žiadny kód.

## Ako na to

1. Skopírujte sem súbory s logami. Podporované formáty: **SVG, PNG, JPG, WebP**
   (SVG alebo PNG s priehľadným pozadím vyzerajú najlepšie).
2. **Názov súboru = názov klienta** zobrazený pod logom a v alt texte:
   - `Firma XY.png` → „Firma XY“
   - pomlčky a podčiarkovníky sa zmenia na medzery: `firma-xy.svg` → „firma xy“
3. Poradie na stránke určuje abecedné poradie súborov. Ak chcete poradie riadiť,
   použite číselný prefix, ktorý sa na stránke nezobrazí:
   - `01-Prvá firma.svg`, `02-Druhá firma.png`, …
4. Potom v priečinku `abmaudit-app` spustite `npm run build` a `npm run deploy`
   a nahrajte výsledok (commit + push, prípadne FTP).

## Klienti bez loga

Klientov, ktorí logo nemajú, doplňte ako text do poľa `names` v súbore
`src/content/site.ts` (sekcia `clients`) — zobrazia sa ako textové karty
vedľa lôg.
