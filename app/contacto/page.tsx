import { client } from "@/sanity/lib/client"
import ContactClientPage from "./contact-client"

async function getData() {
  const globalConfig = await client.fetch(`*[_type == "globalConfig"][0]{ content }`)
  return { globalConfig: globalConfig?.content }
}

export default async function ContactoPage() {
  const { globalConfig } = await getData()
  return <ContactClientPage globalConfig={globalConfig} />
}
