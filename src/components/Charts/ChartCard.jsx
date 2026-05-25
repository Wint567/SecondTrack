export function ChartCard({ title, children }) {
  return (
    <div className="card">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="h-80">{children}</div>
    </div>
  );
}
