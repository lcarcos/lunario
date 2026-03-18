import Navigation from '@/components/Navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navigation />
      <main
        style={{ flex: 1, paddingBottom: '5rem' }}
        className="md:ml-[220px] md:pb-0"
      >
        {children}
      </main>
    </div>
  );
}
