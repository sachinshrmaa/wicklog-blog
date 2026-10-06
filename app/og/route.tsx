import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/utils';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get('title') ?? `${SITE_NAME} Blog`).slice(0, 140);
  const description = (searchParams.get('description') ?? '').slice(0, 220);

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '64px',
          backgroundColor: '#f9f8ff',
          backgroundImage:
            'radial-gradient(circle at 20% 80%, rgba(31, 88, 9, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(179, 163, 194, 0.12) 0%, transparent 50%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Site badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1f5809', // brand primary, hsl(103 81% 19%) — satori can't parse space-separated hsl()
              color: '#fff',
              fontSize: '13px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '999px',
              letterSpacing: '0.02em',
            }}
          >
            wicklog.in/blog
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? '36px' : '48px',
            fontWeight: '700',
            color: '#0f0e14',
            lineHeight: '1.2',
            maxWidth: '900px',
            marginBottom: '20px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              fontSize: '20px',
              color: '#5a5560',
              lineHeight: '1.5',
              maxWidth: '800px',
              marginBottom: '32px',
              display: 'block',
              lineClamp: 2,
            }}
          >
            {description}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#8a8490',
            fontSize: '15px',
          }}
        >
          <span style={{ fontWeight: '600', color: '#0f0e14' }}>{SITE_NAME}</span>
          <span>·</span>
          <span>wicklog.in</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
