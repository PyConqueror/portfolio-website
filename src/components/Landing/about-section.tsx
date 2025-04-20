import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { AboutSection as AboutSectionType, AboutMe as AboutMeType, Media, Technology } from '../../payload-types'

export default async function AboutSection({ aboutSectionData }: { aboutSectionData: AboutSectionType }) {
  
  const data = await aboutSectionData.aboutMe as AboutMeType
  const skills = data.skillsAndExpertise as Technology[]
  const image = data.image as Media

  return (
    <section id="about" className="py-24 bg-ultra-gray-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-ultra-gray to-ultra-black rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 border-2 border-ultra-orange/20 rounded-2xl transform rotate-3"></div>
              <Image
                src={image.url as string}
                alt="Profile"
                width={400}
                height={400}
                className="rounded-2xl relative z-10 object-cover"
              />
              <div className="absolute -bottom-4 -right-4 h-24 w-24 bg-ultra-orange/20 rounded-full blur-xl"></div>
            </div>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              About <span className="text-ultra-orange">Me</span>
            </h2>
            <p className="text-gray-400 text-lg">{data['Paragrah 1']}</p>
            <p className="text-gray-400 text-lg">{data['Paragrah 2']}</p>

            <div className="pt-4">
              <h3 className="text-xl font-semibold mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="outline"
                    className="bg-ultra-gray hover:bg-ultra-orange hover:text-black text-white border-ultra-gray-light"
                  >
                    {skill.name}
                  </Badge>
                ))} 
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
