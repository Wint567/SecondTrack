import { useEffect, useMemo, useState } from 'react';
import { Field } from './Field';
import { ImageUploader } from './ImageUploader';
import { CONDITION_OPTIONS, ITEM_CATEGORIES, ITEM_STATUSES, SOLD_STATUS } from '../../utils/constants';

export const itemInitialForm = {
  title: '',
  brand: '',
  category: 'Куртка',
  size: '',
  condition: 'Очень хорошее',
  purchase_date: new Date().toISOString().slice(0, 10),
  purchase_price: '',
  planned_sale_price: '',
  actual_sale_price: '',
  sold_at: '',
  status: 'Куплено',
  source_place: '',
  notes: '',
};

export function buildItemFormState(item) {
  return {
    title: item?.title ?? '',
    brand: item?.brand ?? '',
    category: item?.category ?? 'Куртка',
    size: item?.size ?? '',
    condition: item?.condition ?? 'Очень хорошее',
    purchase_date: item?.purchase_date ?? new Date().toISOString().slice(0, 10),
    purchase_price: item?.purchase_price ?? '',
    planned_sale_price: item?.planned_sale_price ?? '',
    actual_sale_price: item?.actual_sale_price ?? '',
    sold_at: item?.sold_at ? String(item.sold_at).slice(0, 10) : '',
    status: item?.status ?? 'Куплено',
    source_place: item?.source_place ?? '',
    notes: item?.notes ?? '',
  };
}

export function ItemForm({
  mode = 'create',
  initialValues = itemInitialForm,
  existingPhotos = [],
  submitLabel,
  submitPendingLabel,
  onSubmit,
  onDeletePhoto,
  onAddPhotosLabel = 'Добавить фото',
  isSubmitting = false,
  deletingPhotoId = null,
  error = '',
}) {
  const [form, setForm] = useState(initialValues);
  const [photos, setPhotos] = useState([]);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const previews = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError('');

    if (!form.title.trim()) {
      setLocalError('Введите название вещи.');
      return;
    }

    if (form.purchase_price === '' || Number(form.purchase_price) < 0) {
      setLocalError('Укажите корректную цену покупки.');
      return;
    }

    if (form.status === SOLD_STATUS) {
      if (!form.actual_sale_price || Number(form.actual_sale_price) <= 0) {
        setLocalError('Для проданного товара укажите фактическую цену продажи.');
        return;
      }

      if (!form.sold_at) {
        setLocalError('Для проданного товара укажите дату продажи.');
        return;
      }
    }

    await onSubmit({
      ...form,
      photos,
    });
  }

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <section className="card space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Название" htmlFor="title">
            <input
              id="title"
              className="input"
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="Например, винтажная куртка Carhartt"
              required
            />
          </Field>

          <Field label="Бренд" htmlFor="brand">
            <input
              id="brand"
              className="input"
              value={form.brand}
              onChange={(event) => updateField('brand', event.target.value)}
              placeholder="Например, Carhartt"
            />
          </Field>

          <Field label="Категория" htmlFor="category">
            <select
              id="category"
              className="select"
              value={form.category}
              onChange={(event) => updateField('category', event.target.value)}
            >
              {ITEM_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Размер" htmlFor="size">
            <input
              id="size"
              className="input"
              value={form.size}
              onChange={(event) => updateField('size', event.target.value)}
              placeholder="Например, M / 32 / EU 42"
            />
          </Field>

          <Field label="Состояние" htmlFor="condition">
            <select
              id="condition"
              className="select"
              value={form.condition}
              onChange={(event) => updateField('condition', event.target.value)}
            >
              {CONDITION_OPTIONS.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Статус" htmlFor="status">
            <select
              id="status"
              className="select"
              value={form.status}
              onChange={(event) => updateField('status', event.target.value)}
            >
              {ITEM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Дата покупки" htmlFor="purchase-date">
            <input
              id="purchase-date"
              className="input"
              type="date"
              value={form.purchase_date}
              onChange={(event) => updateField('purchase_date', event.target.value)}
              required
            />
          </Field>

          <Field label="Дата продажи" htmlFor="sold-at">
            <input
              id="sold-at"
              className="input"
              type="date"
              value={form.sold_at}
              onChange={(event) => updateField('sold_at', event.target.value)}
              disabled={form.status !== SOLD_STATUS}
              required={form.status === SOLD_STATUS}
            />
          </Field>

          <Field label="Цена покупки" htmlFor="purchase-price">
            <input
              id="purchase-price"
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={form.purchase_price}
              onChange={(event) => updateField('purchase_price', event.target.value)}
              required
            />
          </Field>

          <Field label="Планируемая цена продажи" htmlFor="planned-sale-price">
            <input
              id="planned-sale-price"
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={form.planned_sale_price}
              onChange={(event) => updateField('planned_sale_price', event.target.value)}
            />
          </Field>

          <Field label="Фактическая цена продажи" htmlFor="actual-sale-price">
            <input
              id="actual-sale-price"
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={form.actual_sale_price}
              onChange={(event) => updateField('actual_sale_price', event.target.value)}
              disabled={form.status !== SOLD_STATUS}
              required={form.status === SOLD_STATUS}
            />
          </Field>

          <Field label="Место покупки" htmlFor="source-place">
            <input
              id="source-place"
              className="input"
              value={form.source_place}
              onChange={(event) => updateField('source_place', event.target.value)}
              placeholder="Например, секонд-хенд или маркетплейс"
            />
          </Field>
        </div>

        {displayError ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {displayError}
          </div>
        ) : null}

        <Field label="Заметки" htmlFor="notes">
          <textarea
            id="notes"
            className="textarea"
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Дефекты, замеры, особенности вещи или комментарии для перепродажи"
          />
        </Field>

        <button type="submit" className="button-primary w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? submitPendingLabel : submitLabel}
        </button>
      </section>

      <section className="card space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Фотографии</h3>
          <p className="mt-1 text-sm text-slate-400">
            {mode === 'edit'
              ? 'Удаляйте старые фото и добавляйте новые без потери остальных данных.'
              : 'Загрузите одну или несколько фотографий, чтобы сохранить их в Supabase Storage и прикрепить к вещи.'}
          </p>
        </div>

        {existingPhotos.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {existingPhotos.map((photo) => (
              <div key={photo.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3">
                <img
                  src={photo.image_url}
                  alt="Фото вещи"
                  className="h-44 w-full rounded-xl object-cover"
                />
                <button
                  type="button"
                  className="button-secondary mt-3 w-full"
                  onClick={() => onDeletePhoto?.(photo)}
                  disabled={deletingPhotoId === photo.id}
                >
                  {deletingPhotoId === photo.id ? 'Удаление...' : 'Удалить фото'}
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-4">
          <p className="mb-3 text-sm font-medium text-slate-200">{onAddPhotosLabel}</p>
          <ImageUploader
            previews={previews}
            onChange={(event) => setPhotos(Array.from(event.target.files ?? []))}
          />
        </div>
      </section>
    </form>
  );
}
