export function ImageUploader({ previews, onChange }) {
  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onChange}
        className="block w-full rounded-xl border border-dashed border-slate-700 bg-slate-900 p-4 text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
      />

      {previews.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {previews.map((preview) => (
            <img
              key={preview}
              src={preview}
              alt="Предпросмотр вещи"
              className="h-40 w-full rounded-2xl object-cover"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-4 py-8 text-center text-sm text-slate-500">
          Загруженные фотографии появятся здесь перед сохранением.
        </div>
      )}
    </div>
  );
}
