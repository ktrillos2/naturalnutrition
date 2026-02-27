"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import colombiaData from "@/lib/colombia-locations.json"

interface CitySearchSelectProps {
    value: string
    onChange: (city: string) => void
    placeholder?: string
    required?: boolean
    className?: string
}

/** Strip diacritics/accents for accent-insensitive search */
const normalize = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

/** Flat list of all cities with their department, loaded lazily */
interface CityEntry {
    city: string
    department: string
    /** Normalized lowercase string without accents for fast search */
    searchKey: string
}

/** Maximum results to display at once for performance */
const MAX_RESULTS = 20

export function CitySearchSelect({
    value,
    onChange,
    placeholder = "Buscar ciudad...",
    required = false,
    className = "",
}: CitySearchSelectProps) {
    const [query, setQuery] = useState(value)
    const [isOpen, setIsOpen] = useState(false)
    const [highlightIndex, setHighlightIndex] = useState(-1)
    const [isLoaded, setIsLoaded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    // Build the flat city list asynchronously on first focus
    const allCities = useMemo<CityEntry[]>(() => {
        if (!isLoaded) return []
        const entries: CityEntry[] = []
        for (const dept of colombiaData) {
            for (const city of dept.ciudades) {
                entries.push({
                    city,
                    department: dept.departamento,
                    searchKey: normalize(`${city} ${dept.departamento}`),
                })
            }
        }
        // Sort alphabetically by city name
        entries.sort((a, b) => a.city.localeCompare(b.city, "es"))
        return entries
    }, [isLoaded])

    // Filter results based on query
    const filteredCities = useMemo(() => {
        if (!query.trim()) return allCities.slice(0, MAX_RESULTS)
        const normalizedQuery = normalize(query.trim())
        const tokens = normalizedQuery.split(/\s+/)
        return allCities
            .filter((entry) => tokens.every((token) => entry.searchKey.includes(token)))
            .slice(0, MAX_RESULTS)
    }, [query, allCities])

    // Load cities asynchronously on first interaction
    const handleLoadCities = useCallback(() => {
        if (!isLoaded) {
            // Use requestIdleCallback or setTimeout for async-like loading
            if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                (window as any).requestIdleCallback(() => setIsLoaded(true))
            } else {
                setTimeout(() => setIsLoaded(true), 0)
            }
        }
    }, [isLoaded])

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                // If user typed something that doesn't match exactly, revert to last valid value
                if (query !== value) {
                    setQuery(value)
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [query, value])

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll("li")
            items[highlightIndex]?.scrollIntoView({ block: "nearest" })
        }
    }, [highlightIndex])

    // Sync external value changes
    useEffect(() => {
        setQuery(value)
    }, [value])

    const handleSelect = (city: string) => {
        setQuery(city)
        onChange(city)
        setIsOpen(false)
        setHighlightIndex(-1)
        inputRef.current?.blur()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === "ArrowDown" || e.key === "Enter") {
                setIsOpen(true)
                e.preventDefault()
            }
            return
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault()
                setHighlightIndex((prev) =>
                    prev < filteredCities.length - 1 ? prev + 1 : 0
                )
                break
            case "ArrowUp":
                e.preventDefault()
                setHighlightIndex((prev) =>
                    prev > 0 ? prev - 1 : filteredCities.length - 1
                )
                break
            case "Enter":
                e.preventDefault()
                if (highlightIndex >= 0 && filteredCities[highlightIndex]) {
                    handleSelect(filteredCities[highlightIndex].city)
                }
                break
            case "Escape":
                setIsOpen(false)
                setQuery(value)
                inputRef.current?.blur()
                break
        }
    }

    const inputClasses = className ||
        "w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setIsOpen(true)
                        setHighlightIndex(-1)
                    }}
                    onFocus={() => {
                        handleLoadCities()
                        setIsOpen(true)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    required={required}
                    autoComplete="off"
                    className={inputClasses}
                />
                {/* Dropdown chevron */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <ul
                    ref={listRef}
                    className="absolute z-50 mt-1 w-full max-h-56 overflow-auto bg-card border border-border rounded-lg shadow-lg"
                    role="listbox"
                >
                    {!isLoaded ? (
                        <li className="px-4 py-3 text-sm text-muted-foreground text-center">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                                Cargando ciudades...
                            </div>
                        </li>
                    ) : filteredCities.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-muted-foreground text-center">
                            No se encontraron resultados
                        </li>
                    ) : (
                        filteredCities.map((entry, index) => (
                            <li
                                key={`${entry.department}-${entry.city}`}
                                role="option"
                                aria-selected={highlightIndex === index}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    handleSelect(entry.city)
                                }}
                                onMouseEnter={() => setHighlightIndex(index)}
                                className={`px-4 py-2.5 cursor-pointer text-sm transition-colors ${highlightIndex === index
                                    ? "bg-primary/10 text-foreground"
                                    : "text-foreground hover:bg-muted"
                                    } ${value === entry.city ? "font-medium" : ""}`}
                            >
                                <span className="block">{entry.city}</span>
                                <span className="block text-[11px] text-muted-foreground">
                                    {entry.department}
                                </span>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    )
}
