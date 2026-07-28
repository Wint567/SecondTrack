import { Star } from 'lucide-react';

export function ImageUploader({ previews, selectedIndex = null, onSelect, onChange }) {
  return (
    <div className="space-y-4">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onChange}
        className="block w-full rounded-xl border border-dashed border-slate-700/90 bg-slate-950/50 p-4 text-sm text-slate-400 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-400 file:px-4 file:py-2 file:font-semibold file:text-slate-950"
      />

      {previews.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {previews.map((preview, index) => (
            <button
              key={preview}
              type="button"
              className={`relative overflow-hidden rounded-xl border text-left transition ${
                selectedIndex === index
                  ? 'border-emerald-400 ring-2 ring-emerald-400/20'
                  : 'border-slate-800 hover:border-slate-600'
              }`}
              aria-pressed={selectedIndex === index}
              aria-label={`Выбрать фотографию ${index + 1} главной`}
              onClick={() => onSelect?.(index)}
            >
              <img
                src={preview}
                alt={`Предпросмотр вещи ${index + 1}`}
                className="h-40 w-full object-cover"
              />
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-slate-950/90 px-2 py-1 text-xs font-semibold text-white">
                <Star className={`h-3.5 w-3.5 ${selectedIndex === index ? 'fill-current text-emerald-300' : ''}`} />
                {selectedIndex === index ? 'Главное фото' : 'Сделать главным'}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-700/90 bg-slate-950/50 px-4 py-8 text-center text-sm text-slate-500">
          Загруженные фотографии появятся здесь перед сохранением.
        </div>
      )}
    </div>
  );
}
