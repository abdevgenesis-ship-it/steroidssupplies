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
          background: 'linear-gradient(135deg, #09090b 0%, #1a0608 45%, #0c0407 100%)',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Crimson glow — top-right */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,30,58,0.28) 0%, transparent 70%)',
          }}
        />
        {/* Deep red glow — bottom-left */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(127,29,29,0.22) 0%, transparent 70%)',
          }}
        />
        {/* Red badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(196,30,58,0.18)',
            border: '1px solid rgba(239,68,68,0.45)',
            borderRadius: 8,
            padding: '8px 20px',
            marginBottom: 32,
          }}
        >
          <span style={{ color: '#f87171', fontSize: 18, fontWeight: 700, letterSpacing: 2 }}>
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
              color: '#c41e3a',
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
            color: 'rgba(255,255,255,0.65)',
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
              background: '#c41e3a',
            }}
          />
          <span style={{ color: '#fafafa', fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>
            steroidssupplies.co.uk
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
