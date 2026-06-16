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
          background: '#1a6b3c',
          borderRadius: 6,
        }}
      >
        {/* Two-toned pharmaceutical capsule */}
        <div
          style={{
            display: 'flex',
            width: 22,
            height: 10,
            borderRadius: 5,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '50%', height: '100%', background: '#d97706' }} />
          <div style={{ width: '50%', height: '100%', background: '#ffffff' }} />
        </div>
      </div>
    ),
    { ...size },
  )
}
