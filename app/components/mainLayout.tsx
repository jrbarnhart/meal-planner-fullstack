export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <p>This is a main layout!</p>
      {children}
    </div>
  );
}
