import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "N3xUs Konc3pt'z Digital Design Studio";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '24px',
            padding: '60px 80px',
            background: 'rgba(0, 0, 0, 0.4)',
            boxShadow: '0 0 80px rgba(0, 240, 255, 0.2)',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#fff',
              textShadow: '0 0 30px rgba(0, 240, 255, 0.8), 0 0 10px rgba(0, 240, 255, 0.4)',
              marginBottom: '20px',
            }}
          >
            N3xUs Konc3pt'z
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#00f0ff',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Digital Design Studio
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
