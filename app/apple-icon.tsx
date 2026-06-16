import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #1a6b3c 0%, #0d5c31 100%)',
          borderRadius: 40,
          gap: 10,
        }}
      >
        {/* Large two-toned pharmaceutical capsule */}
        <div
          style={{
            display: 'flex',
            width: 104,
            height: 44,
            borderRadius: 22,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '50%', height: '100%', background: '#d97706' }} />
          <div style={{ width: '50%', height: '100%', background: '#ffffff' }} />
        </div>
        {/* SS brand initials */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          SS
        </div>
      </div>
    ),
    { ...size },
  )
}
