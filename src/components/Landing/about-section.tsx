import AboutPhoto from './about-photo'
import { Reveal, ScrollText } from './motion'
import type {
  AboutSection as AboutSectionType,
  AboutMe as AboutMeType,
  Media,
  Technology,
} from '../../payload-types'

const MIN_ITEMS_PER_ROW = 8

const labelClassName = 'text-[11px] uppercase tracking-[0.12em] text-white/50'

function fillRow(items: Technology[]) {
  if (items.length === 0) return items
  let row = items
  while (row.length < MIN_ITEMS_PER_ROW) row = row.concat(items)
  return row
}

function SkillsMarquee({ items }: { items: Technology[] }) {
  return (
    <div className="group flex overflow-hidden">
      <div className="flex w-max shrink-0 animate-marquee [animation-duration:120s] group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((skill, index) => (
              <li
                key={`${skill.id}-${index}`}
                className="flex items-center whitespace-nowrap text-[clamp(3rem,8vw,6rem)] font-light leading-[1.1] tracking-[-0.03em]"
              >
                {skill.name}
                <span className="mx-[0.4em] text-[0.45em] italic text-white/40">/</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}

export default async function AboutSection({
  aboutSectionData,
}: {
  aboutSectionData: AboutSectionType
}) {
  const data = (await aboutSectionData.aboutMe) as AboutMeType
  const skills = data.skillsAndExpertise as Technology[]
  const image = data.image as Media

  return (
    <section id="about" className="relative overflow-hidden py-28 text-white md:py-40">
      <div className="mx-auto max-w-[1078px] px-6">
        <Reveal className="flex items-baseline justify-between border-t border-white/30 pt-4">
          <span className={labelClassName}>(01)</span>
          <h2 className={labelClassName}>About</h2>
          <span className={labelClassName}>Introduction</span>
        </Reveal>

        <ScrollText
          text={data['Paragrah 1']}
          className="mt-16 text-[clamp(2rem,5.2vw,4.875rem)] font-light leading-[1.1] tracking-[-0.02em] md:mt-24"
        />

        <div className="mt-24 grid gap-12 md:mt-36 md:grid-cols-12 md:gap-8">
          <AboutPhoto
            src={image.url as string}
            alt="Profile"
            caption={['Wan Aqim', 'Creative Engineer']}
            className="md:col-span-5"
          />
          <Reveal className="flex flex-col justify-end md:col-span-5 md:col-start-8">
            <p className="text-lg leading-[1.58] text-white/80">{data['Paragrah 2']}</p>
          </Reveal>
        </div>
      </div>

      <div className="mt-28 md:mt-40">
        <div className="mx-auto max-w-[1078px] px-6">
          <Reveal className="flex items-baseline justify-between border-t border-white/30 pt-4">
            <h3 className={labelClassName}>Skills &amp; Expertise</h3>
            <span className={labelClassName}>({skills.length})</span>
          </Reveal>
          <ul className="sr-only mt-10 flex-wrap gap-2 motion-reduce:not-sr-only motion-reduce:flex">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="rounded-full border border-white/30 px-4 py-1.5 text-sm"
              >
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
        <Reveal className="mt-10 motion-reduce:hidden">
          <div aria-hidden>
            <SkillsMarquee items={fillRow(skills)} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
