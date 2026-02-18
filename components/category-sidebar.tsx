import Link from "next/link"
import { LeafIcon, DropletIcon, FlowerIcon, PlantIcon, PillIcon, BoltIcon, PackageIcon } from "./icons"

interface Category {
  name: string
  slug: string
  count: number
}

interface CategorySidebarProps {
  categories: Category[]
  activeCategory?: string
}

const iconMap: Record<string, any> = {
  "Alimento": LeafIcon,
  "Alimentos": LeafIcon,
  "Cosmético": DropletIcon,
  "Cosméticos": DropletIcon,
  "Esencias Florales": FlowerIcon,
  "Fitoterapéutico": PlantIcon,
  "Medicamento": PillIcon,
  "Medicamentos": PillIcon,
  "Suplemento Dietario": BoltIcon,
  "Suplementos Dietarios": BoltIcon,
  "Combos": PackageIcon,
}

export function CategorySidebar({ categories, activeCategory }: CategorySidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="bg-primary/5 border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wider">Categorías</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link
                href="/tienda"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${!activeCategory
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <span className={`flex-1 text-sm font-medium ${!activeCategory ? "font-semibold" : ""}`}>
                  Todas las categorías
                </span>
              </Link>
            </li>
            {categories.map((category) => {
              const Icon = iconMap[category.name] || PackageIcon
              const isActive = activeCategory === category.slug

              return (
                <li key={category.slug}>
                  <Link
                    href={`/tienda?categoria=${category.slug}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${isActive ? "bg-white/20" : "bg-muted group-hover:bg-accent/10"
                      }`}>
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-accent group-hover:text-primary"}`} />
                    </span>
                    <span className={`flex-1 text-sm font-medium ${isActive ? "font-semibold" : ""}`}>
                      {category.name}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                      }`}>
                      {category.count}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
