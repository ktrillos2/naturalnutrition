import { TruckIcon } from "./icons"

interface TopBarProps {
  message?: string
}

export function TopBar({ message }: TopBarProps) {
  return (
    <div className="bg-primary text-primary-foreground py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm">
        <TruckIcon className="w-4 h-4 shrink-0" />
        <p className="text-center leading-relaxed">
          {message || "Envíos a todo el país. Envíos a Bogotá y Cundinamarca súper económicos, resto del país a precios excelentes."}
        </p>
      </div>
    </div>
  )
}
