import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { CheckCircleIcon } from "@/components/icons"
import { ShieldCheckIcon, StarIcon, ZapIcon, HeartIcon, AwardIcon } from "lucide-react"
import Image from "next/image"
import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"

async function getData() {
  const data = await client.fetch(`{
    "about": *[_type == "about"][0],
    "globalConfig": *[_type == "globalConfig"][0]{ content }
  }`)
  return data
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'Shield': ShieldCheckIcon,
  'Star': StarIcon,
  'Zap': ZapIcon,
  'Heart': HeartIcon,
  'Award': AwardIcon,
  'Check': CheckCircleIcon
}

export default async function NosotrosPage() {
  const { about, globalConfig } = await getData()

  if (!about) return null

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar message={globalConfig?.content?.topBarMessage} />
      <Header logo={globalConfig?.content?.logo} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                  {about.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {about.description}
                </p>
                {about.mission && (
                  <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg">
                    <h2 className="text-lg font-semibold text-primary mb-2">{about.mission.title}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {about.mission.description}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-center">
                <Image
                  src="/images/about-group.png"
                  alt={about.title}
                  width={800}
                  height={600}
                  className="w-full max-w-lg rounded-lg shadow-lg object-contain bg-white p-4"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {about.features && (
          <section className="py-16 lg:py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">{about.features.title}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {about.features.description}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {about.features.items?.map((item: any) => (
                  <div
                    key={item._key}
                    className="bg-background p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <CheckCircleIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        {about.stats && (
          <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {about.stats.map((stat: any) => (
                  <div key={stat._key}>
                    <p className="text-4xl lg:text-5xl font-bold text-accent mb-2">{stat.value}</p>
                    <p className="text-sm text-primary-foreground/80">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer data={globalConfig?.content} />
      <WhatsAppButton />
    </div>
  )
}
