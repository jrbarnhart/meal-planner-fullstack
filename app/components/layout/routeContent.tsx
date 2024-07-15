export default function RouteContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 h-full overflow-hidden">
      {children}
    </div>
  );
}
