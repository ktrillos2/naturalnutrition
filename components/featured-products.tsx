import { ProductCard } from "./product-card"

const featuredProducts = [
  {
    id: 1,
    name: "Miel de Abejas Orgánica 500g",
    price: 45000,
    originalPrice: 52000,
    image: "/organic-honey-jar-natural-golden.jpg",
    category: "Alimentos",
  },
  {
    id: 2,
    name: "Proteína Vegetal Premium 1kg",
    price: 89000,
    image: "/vegan-protein-powder-supplement.jpg",
    category: "Suplementos",
  },
  {
    id: 3,
    name: "Aceite de Coco Extra Virgen 500ml",
    price: 32000,
    originalPrice: 38000,
    image: "/coconut-oil-jar-organic.jpg",
    category: "Alimentos",
  },
  {
    id: 4,
    name: "Esencia Floral Bach Rescue 20ml",
    price: 65000,
    image: "/bach-flower-essence-bottle.jpg",
    category: "Esencias Florales",
  },
  {
    id: 5,
    name: "Colágeno Hidrolizado 400g",
    price: 78000,
    originalPrice: 95000,
    image: "/collagen-powder-supplement.jpg",
    category: "Suplementos",
  },
  {
    id: 6,
    name: "Crema Facial Natural Aloe 100ml",
    price: 42000,
    image: "/aloe-vera-face-cream-natural.jpg",
    category: "Cosméticos",
  },
  {
    id: 7,
    name: "Té Verde Orgánico Premium 250g",
    price: 28000,
    image: "/organic-green-tea-leaves.jpg",
    category: "Alimentos",
  },
  {
    id: 8,
    name: "Vitamina C + Zinc 60 Cápsulas",
    price: 35000,
    originalPrice: 42000,
    image: "/vitamin-c-zinc-supplement-capsules.jpg",
    category: "Suplementos",
  },
]

interface FeaturedProductsProps {
  data?: {
    title: string
    subtitle: string
    products: any[]
  }
}

export function FeaturedProducts({ data }: FeaturedProductsProps) {
  if (!data) return null;

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{data.title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.products && data.products.length > 0 ? (
            data.products.map((product) => (
              <ProductCard key={product._id} product={{
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                slug: product.slug?.current // Ensure slug is handled if needed by card
              }} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-10">
              No hay productos destacados seleccionados.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
