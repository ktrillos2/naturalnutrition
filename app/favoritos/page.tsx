import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { FavoritesList } from "@/components/favorites-list"
import { client } from "@/sanity/lib/client"

export const dynamic = "force-dynamic"

async function getData() {
    const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`)
    return { globalConfig }
}

export default async function FavoritesPage() {
    const { globalConfig } = await getData()
    const configContent = globalConfig?.content

    return (
        <div className="min-h-screen flex flex-col">
            <TopBar message={configContent?.topBarMessage} />
            <Header logo={configContent?.logo} />
            <main className="flex-1 py-8 lg:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <FavoritesList />
                </div>
            </main>
            <Footer data={configContent} />
            <WhatsAppButton />
        </div>
    )
}
