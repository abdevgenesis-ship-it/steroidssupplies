import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a0608 0%, #09090b 100%)',
          borderRadius: 6,
        }}
      >
        {/* Two-toned pharmaceutical capsule — crimson / white */}
        <div
          style={{
            display: 'flex',
            width: 22,
            height: 10,
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '50%', height: '100%', background: '#c41e3a' }} />
          <div style={{ width: '50%', height: '100%', background: '#f5f5f5' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
