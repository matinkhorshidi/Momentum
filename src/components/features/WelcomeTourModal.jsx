// src/features/WelcomeTourModal.jsx

// A simple, zero-dependency modal component
export const WelcomeTourModal = ({ onStart, onDecline }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9998, // Should be below the tour's zIndex
      }}
    >
      <div
        style={{
          background: '#2d2d2d',
          padding: '2rem 2.5rem',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          maxWidth: '450px',
          border: '1px solid #444',
        }}
      >
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
          به Momentum خوش آمدید!
        </h2>
        <p style={{ fontSize: '1rem', color: '#ccc', marginBottom: '2rem' }}>
          آیا مایلید یک تور کوتاه برای آشنایی با ویژگی‌های اصلی داشته باشید؟
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onStart}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#8A2BE2',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            بله، تور را نشان بده
          </button>
          <button
            onClick={onDecline}
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #555',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              color: 'white',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            شاید بعداً
          </button>
        </div>
      </div>
    </div>
  );
};
