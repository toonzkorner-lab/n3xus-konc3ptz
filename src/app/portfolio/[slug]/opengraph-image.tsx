import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const runtime = 'edge';
export const alt = "N3xUs Konc3pt'z Portfolio Project";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const project = await prisma.portfolioItem.findUnique({ where: { slug } });

  const title = project?.title || 'Portfolio Project';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a1a',
          backgroundImage: 'radial-gradient(circle at 50% 50%, #1a1a3a 0%, #0a0a1a 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255, 0, 255, 0.3)',
            borderRadius: '24px',
            padding: '60px',
            background: 'rgba(0, 0, 0, 0.4)',
            boxShadow: '0 0 80px rgba(255, 0, 255, 0.2)',
            width: '100%',
            height: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#ff00ff', fontSize: '24px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>
            N3xUs Konc3pt'z Portfolio
          </div>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#fff',
              textShadow: '0 0 30px rgba(255, 0, 255, 0.6)',
              marginBottom: '40px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
