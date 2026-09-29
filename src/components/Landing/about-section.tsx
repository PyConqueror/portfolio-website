import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import AboutPhoto from './about-photo'
import SectionHeading from './section-heading'
import { Reveal, ScrollText } from './motion'
import type { AboutSection as AboutSectionType, AboutMe as AboutMeType, Media, Technology } from '../../payload-types'

const MIN_ITEMS_PER_ROW = 8

const badgeClassName =
  'bg-ultra-gray hover:bg-ultra-orange hover:text-black text-white border-ultra-gray-light px-3 py-1 text-sm'

function fillRow(items: Technology[]) {
  if (items.length === 0) return items
  let row = items
  while (row.length < MIN_ITEMS_PER_ROW) row = row.concat(items)
  return row
}

function MarqueeRow({ items, reverse = false }: { items: Technology[]; reverse?: boolean }) {
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div
        className={cn(
          'flex w-max shrink-0 group-hover:[animation-play-state:paused]',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
        )}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 gap-3 pr-3">
            {items.map((skill, index) => (
              <li key={`${skill.id}-${index}`}>
                <Badge variant="outline" className={badgeClassName}>
                  {skill.name}
                </Badge>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default async function AboutSection({ aboutSectionData }: { aboutSectionData: AboutSectionType }) {
  
  const data = await aboutSectionData.aboutMe as AboutMeType
  const skills = data.skillsAndExpertise as Technology[]
  const image = data.image as Media

  const splitAt = Math.ceil(skills.length / 2)
  const marqueeRows =
    skills.length >= 4 ? [skills.slice(0, splitAt), skills.slice(splitAt)] : [skills, [...skills].reverse()]

  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32 bg-ultra-gray-dark">
      <div
        aria-hidden
        className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
      />
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <AboutPhoto src={image.url as string} alt="Profile" />

          <div className="w-full min-w-0 md:w-1/2 space-y-6">
            <SectionHeading index="01" eyebrow="Introduction" title="About" highlight="Me" align="left" />
            <ScrollText text={data['Paragrah 1']} className="text-gray-200 text-lg" />
            <ScrollText text={data['Paragrah 2']} className="text-gray-200 text-lg" />

            <Reveal delay={0.3} className="pt-4">
              <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
              <ul className="sr-only flex flex-wrap gap-2 motion-reduce:not-sr-only">
                {skills.map((skill) => (
                  <li key={skill.id}>
                    <Badge variant="outline" className={badgeClassName}>
                      {skill.name}
                    </Badge>
                  </li>
                ))}
              </ul>
              <div aria-hidden className="space-y-3 motion-reduce:hidden">
                {marqueeRows.map((row, index) => (
                  <MarqueeRow key={index} items={fillRow(row)} reverse={index % 2 === 1} />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
