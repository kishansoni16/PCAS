import AuthBox from '@/components/AuthBox';

export default function Home() {
  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        style={{
          content: '""',
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%)',
          top: '-100px',
          right: '-100px',
          pointerEvents: 'none'
        }}
      />
      <div 
        style={{
          content: '""',
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,92,252,0.08) 0%, transparent 70%)',
          bottom: '-50px',
          left: '-50px',
          pointerEvents: 'none'
        }}
      />
      
      <AuthBox />
    </div>
  );
}
