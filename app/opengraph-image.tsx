import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'SteroidsSupplies — Premium Anabolic Steroids For Sale UK & Global'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
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
          background: 'linear-gradient(135deg, #0d2b18 0%, #1a6b3c 50%, #0a3d22 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Teal accent circle top-right */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,148,136,0.3) 0%, transparent 70%)',
          }}
        />
        {/* Amber accent bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -60,
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,119,6,0.25) 0%, transparent 70%)',
          }}
        />
        {/* Amber badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(217,119,6,0.2)',
            border: '1px solid rgba(245,158,11,0.5)',
            borderRadius: 8,
            padding: '8px 20px',
            marginBottom: 32,
          }}
        >
          <span style={{ color: '#f59e0b', fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
            CERTIFIED GLOBAL PERFORMANCE SUPPLIER
          </span>
        </div>
        {/* Heading */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: -1,
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            Premium Anabolic Steroids
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: -1,
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            For Sale UK & Worldwide
          </span>
        </div>
        {/* Subheading */}
        <div
          style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: 26,
            marginTop: 28,
            textAlign: 'center',
          }}
        >
          Guaranteed 48h International Delivery · COA Verified · B2C & B2B Wholesale
        </div>
        {/* Brand footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 28,
              borderRadius: 4,
              background: '#d97706',
            }}
          />
          <span style={{ color: '#d6e4da', fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
            steroidssupplies.co.uk
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
