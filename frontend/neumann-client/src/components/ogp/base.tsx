export default function OgpTemplate({ contents }: { contents: React.ReactNode }) {
  return (
    <div
      style={{
        color: '#111827',
        background: '#F9FAFB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 840,
          height: 630,
          wordBreak: 'break-all',
        }}
      >
        {contents}
      </div>
    </div>
  )
}
