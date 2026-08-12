import { ImageResponse } from 'next/og'
import { getPostData, getAllPostSlugs } from '@/lib/blog'
import { site } from '@/lib/site'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ lang: 'en', slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostData(slug)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#000',
          color: '#fff',
          padding: '64px 72px',
        }}
      >
        {/* Top rule + handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #27272a',
            paddingBottom: 24,
            fontSize: 26,
            letterSpacing: 4,
            color: '#a1a1aa',
          }}
        >
          <span>{site.handle.toUpperCase()}</span>
          <span>{post.date}</span>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: post.title.length > 70 ? 62 : 82,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {post.title}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 12,
            borderTop: '1px solid #27272a',
            paddingTop: 24,
            fontSize: 24,
            color: '#a1a1aa',
          }}
        >
          {post.tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{ border: '1px solid #27272a', padding: '6px 14px' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    ),
    size
  )
}
