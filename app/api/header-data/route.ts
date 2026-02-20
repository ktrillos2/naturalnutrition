import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET() {
    try {
        const categories = await client.fetch(`*[_type == "category"] | order(name asc) { 
      name, 
      "slug": slug.current 
    }`);

        const products = await client.fetch(`*[_type == "product"]{
      _id,
      name,
      "slug": slug.current,
      price,
      "image": images[0].asset->url
    }`);

        return NextResponse.json({ categories, products });
    } catch (error) {
        console.error("Error fetching header data:", error);
        return NextResponse.json({ error: 'Failed to fetch header data' }, { status: 500 });
    }
}
