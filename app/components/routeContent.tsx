export default function RouteContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center p-3 h-full overflow-hidden">
      {children}
    </div>
  );
}
