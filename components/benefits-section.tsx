import { TruckIcon, ShieldCheckIcon, LeafIcon, PhoneIcon } from "./icons"

interface BenefitsProps {
  data?: {
    icon: string
    title: string
    description: string
  }[]
}

const iconMap: Record<string, any> = {
  TruckIcon,
  ShieldCheckIcon,
  LeafIcon,
  PhoneIcon
}

export function BenefitsSection({ data = [] }: BenefitsProps) {
  // Use data from props if available, otherwise use empty array (or fallback to static if needed, but here we assume seeding works)
  // If data is empty/undefined, we could fallback to the original static array, but for migration it's better to show nothing or debug.
  // Let's implement robust handling.

  const displayBenefits = data?.length > 0 ? data : [];

  if (displayBenefits.length === 0) return null;

  return (
    <section className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {displayBenefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon] || TruckIcon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 rounded-full mb-4">
                  <IconComponent className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
