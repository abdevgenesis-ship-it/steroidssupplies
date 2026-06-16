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
          background: 'linear-gradient(145deg, #c41e3a 0%, #7f1d1d 100%)',
          borderRadius: 40,
          gap: 10,
        }}
      >
        {/* Large two-toned pharmaceutical capsule — white / near-black */}
        <div
          style={{
            display: 'flex',
            width: 104,
            height: 44,
            borderRadius: 22,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '50%', height: '100%', background: '#ffffff' }} />
          <div style={{ width: '50%', height: '100%', background: '#1a0608' }} />
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
