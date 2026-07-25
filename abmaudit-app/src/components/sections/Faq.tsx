import { faq } from '../../content/site'
import { AccordionItem } from '../ui/Accordion'
import { Reveal } from '../ui/Reveal'
import { Section, SectionHeading } from '../ui/Section'

export function Faq() {
  // Two independent stacks rather than a masonry grid — an 8-item and a 14-item
  // list side by side in one grid produced a very ragged block on the old site.
  const columns: (typeof faq)[] = [[], []]
  faq.forEach((item, i) => columns[i % 2].push(item))

  return (
    <Section id="faq" tone="paper">
      <div className="shell">
        <SectionHeading
          eyebrow="Časté otázky"
          titleBefore="Odpovede, ktoré klienti hľadajú"
          highlight="najčastejšie"
          titleAfter="."
          lead="Kedy je audit povinný, čo presne zahŕňa vedenie účtovníctva a spracovanie miezd, a čo od nás môžete čakať pri daňovom poradenstve."
        />

        <div className="mt-12 grid items-start gap-5 sm:mt-16 lg:grid-cols-2">
          {columns.map((col, colIndex) => (
            <div key={colIndex} className="grid gap-4">
              {col.map((item, i) => (
                <Reveal key={item.q} delay={i * 60}>
                  <AccordionItem
                    question={item.q}
                    defaultOpen={colIndex === 0 && i === 0}
                  >
                    {item.a && (
                      <p className="mb-4 leading-[1.72] text-slate">{item.a}</p>
                    )}
                    {item.list && (
                      <ul className="grid gap-2.5 sm:grid-cols-1">
                        {item.list.map((li) => (
                          <li key={li} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate">
                            <span
                              aria-hidden="true"
                              className="mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-accent"
                            />
                            {li}
                          </li>
                        ))}
                      </ul>
                    )}
                  </AccordionItem>
                </Reveal>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
