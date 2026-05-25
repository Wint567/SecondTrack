export function Field({ label, htmlFor, error, children }) {
  return (
    <label htmlFor={htmlFor} className="block space-y-2">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-400">{error}</span> : null}
    </label>
  );
}
