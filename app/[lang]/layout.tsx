export default function LangLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

export async function generateStaticParams() {
  return [{ lang: 'en' }]
}
