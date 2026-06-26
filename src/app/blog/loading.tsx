export default function Loading() {
  return (
    <div className="container py-20">
      <div className="skeleton skeleton-text" style={{ width: '40%', height: '3rem', marginBottom: '2rem' }}></div>
      <div className="skeleton skeleton-text" style={{ width: '60%', height: '1.5rem', marginBottom: '4rem' }}></div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card p-4">
            <div className="skeleton" style={{ width: '100%', height: '200px', borderRadius: '12px', marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '80%', marginBottom: '1rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '100%', height: '0.8rem', marginBottom: '0.5rem' }}></div>
            <div className="skeleton skeleton-text" style={{ width: '90%', height: '0.8rem' }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
