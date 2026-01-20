import Link from "next/link"
import { LeafIcon, DropletIcon, FlowerIcon, PlantIcon, PillIcon, BoltIcon } from "./icons"

const categories = [
  { name: "Alimentos", icon: LeafIcon, href: "/categoria/alimentos", count: 24 },
  { name: "Cosméticos", icon: DropletIcon, href: "/categoria/cosmeticos", count: 18 },
  { name: "Esencias Florales", icon: FlowerIcon, href: "/categoria/esencias-florales", count: 12 },
  { name: "Fitoterapéutico", icon: PlantIcon, href: "/categoria/fitoterapeutico", count: 31 },
  { name: "Medicamentos", icon: PillIcon, href: "/categoria/medicamentos", count: 15 },
  { name: "Suplementos Dietarios", icon: BoltIcon, href: "/categoria/suplementos", count: 42 },
]

export function CategorySidebar() {
  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="bg-primary px-5 py-4">
          <h2 className="text-sm font-semibold text-primary-foreground uppercase tracking-wider">Categorías</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-0.5">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-foreground hover:bg-muted hover:text-primary transition-colors group"
                >
                  <span className="flex items-center justify-center w-9 h-9 bg-secondary rounded-lg group-hover:bg-accent/10 transition-colors">
                    <category.icon className="w-5 h-5 text-accent" />
                  </span>
                  <span className="flex-1 text-sm font-medium">{category.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
