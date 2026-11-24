export default function ListingsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_55%] md:h-[calc(100dvh-4.5rem)] md:p-6 gap-4">
      <p>Loading listings...</p>

      <div className="h-[50vh] md:h-full hidden md:inline p-2">
        <div className="h-full w-full bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}
