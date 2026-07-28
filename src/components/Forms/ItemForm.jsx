import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { Field } from './Field';
import { ImageUploader } from './ImageUploader';
import {
  BOUGHT_STATUS,
  CONDITION_OPTIONS,
  ITEM_CATEGORIES,
  ITEM_STATUSES,
  LISTED_STATUS,
  SOLD_STATUS,
} from '../../utils/constants';
import { getItemValidationError } from '../../utils/itemValidation';

export const itemInitialForm = {
  title: '',
  brand: '',
  category: 'Футболки',
  size: '',
  condition: 'Очень хорошее',
  public_description: '',
  is_public: false,
  slug: '',
  vinted_url: '',
  primary_photo_id: null,
  primary_photo_file_index: null,
  purchase_date: new Date().toISOString().slice(0, 10),
  purchase_price: '',
  planned_sale_price: '',
  actual_sale_price: '',
  sold_at: '',
  status: BOUGHT_STATUS,
  source_place: '',
  notes: '',
};

function includeCurrentOption(options, currentValue) {
  if (!currentValue || options.includes(currentValue)) {
    return options;
  }

  return [currentValue, ...options];
}

function getPublicationDescription(isPublic, status) {
  if (!isPublic) {
    return 'Товар остаётся внутренним черновиком';
  }

  if ([BOUGHT_STATUS, LISTED_STATUS].includes(status)) {
    return 'Товар подготовлен к публичному показу';
  }

  return 'Публикация включена, но текущий статус скрывает товар';
}

export function buildItemFormState(item) {
  return {
    title: item?.title ?? '',
    brand: item?.brand ?? '',
    category: item?.category ?? 'Футболки',
    size: item?.size ?? '',
    condition: item?.condition ?? 'Очень хорошее',
    public_description: item?.public_description ?? '',
    is_public: Boolean(item?.is_public),
    slug: item?.slug ?? '',
    vinted_url: item?.vinted_url ?? '',
    primary_photo_id: item?.primary_photo_id ?? item?.item_photos?.[0]?.id ?? null,
    primary_photo_file_index: null,
    purchase_date: item?.purchase_date ?? new Date().toISOString().slice(0, 10),
    purchase_price: item?.purchase_price ?? '',
    planned_sale_price: item?.planned_sale_price ?? '',
    actual_sale_price: item?.actual_sale_price ?? '',
    sold_at: item?.sold_at ? String(item.sold_at).slice(0, 10) : '',
    status: item?.status ?? BOUGHT_STATUS,
    source_place: item?.source_place ?? '',
    notes: item?.notes ?? '',
  };
}

function SectionHeading({ title, description }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
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

  const previews = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos]);
  const categoryOptions = useMemo(
    () => includeCurrentOption(ITEM_CATEGORIES, form.category),
    [form.category],
  );
  const conditionOptions = useMemo(
    () => includeCurrentOption(CONDITION_OPTIONS, form.condition),
    [form.condition],
  );
  const statusOptions = useMemo(
    () => includeCurrentOption(ITEM_STATUSES, form.status),
    [form.status],
  );
  const publicationDescription = getPublicationDescription(form.is_public, form.status);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  useEffect(() => {
    setForm((current) => {
      if (
        !current.primary_photo_id
        || existingPhotos.some((photo) => photo.id === current.primary_photo_id)
      ) {
        return current;
      }

      return {
        ...current,
        primary_photo_id: existingPhotos[0]?.id ?? null,
      };
    });
  }, [existingPhotos]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePhotosChange(event) {
    const selectedPhotos = Array.from(event.target.files ?? []);
    setPhotos(selectedPhotos);
    setForm((current) => {
      const selectedIndex = Number.isInteger(current.primary_photo_file_index)
        && current.primary_photo_file_index < selectedPhotos.length
        ? current.primary_photo_file_index
        : null;

      return {
        ...current,
        primary_photo_file_index: selectedIndex
          ?? (!current.primary_photo_id && selectedPhotos.length ? 0 : null),
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLocalError('');

    const validationError = getItemValidationError(
      form,
      existingPhotos.length + photos.length,
    );

    if (validationError) {
      setLocalError(validationError);
      return;
    }

    await onSubmit({
      ...form,
      photos,
      existing_photo_count: existingPhotos.length,
    });
  }

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="grid items-start gap-6 xl:grid-cols-[1.2fr,0.8fr]">
      <div className="space-y-6">
        <section className="card space-y-5">
          <SectionHeading
            title="Информация для магазина"
            description="Публичные данные товара и его готовность к показу в будущей витрине."
          />

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
                {categoryOptions.map((category) => (
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
                {conditionOptions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
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

            <div className="md:col-span-2">
              <Field label="Публичное описание" htmlFor="public-description">
                <textarea
                  id="public-description"
                  className="textarea"
                  value={form.public_description}
                  onChange={(event) => updateField('public_description', event.target.value)}
                  placeholder="Описание, которое увидит покупатель в карточке товара"
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Ссылка на Vinted" htmlFor="vinted-url">
                <input
                  id="vinted-url"
                  className="input"
                  type="text"
                  inputMode="url"
                  value={form.vinted_url}
                  onChange={(event) => updateField('vinted_url', event.target.value)}
                  placeholder="https://www.vinted.pl/items/..."
                />
              </Field>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={form.is_public}
            className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-700/90 bg-slate-950/45 px-4 py-3 text-left transition hover:border-slate-600"
            onClick={() => updateField('is_public', !form.is_public)}
          >
            <span>
              <span className="block text-sm font-semibold text-slate-100">Показывать в магазине</span>
              <span className="mt-1 block text-xs text-slate-400">
                {publicationDescription}
              </span>
            </span>
            <span
              className={`relative h-6 w-11 flex-none rounded-full transition ${
                form.is_public ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
              aria-hidden="true"
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  form.is_public ? 'left-6' : 'left-1'
                }`}
              />
            </span>
          </button>
        </section>

        <section className="card space-y-5">
          <SectionHeading
            title="Внутренний учёт"
            description="Закупка, продажа и заметки остаются только во внутреннем интерфейсе."
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Статус" htmlFor="status">
              <select
                id="status"
                className="select"
                value={form.status}
                onChange={(event) => updateField('status', event.target.value)}
              >
                {statusOptions.map((status) => (
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

            <Field label="Место покупки" htmlFor="source-place">
              <input
                id="source-place"
                className="input"
                value={form.source_place}
                onChange={(event) => updateField('source_place', event.target.value)}
                placeholder="Например, секонд-хенд или маркетплейс"
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
          </div>

          <Field label="Внутренние заметки" htmlFor="notes">
            <textarea
              id="notes"
              className="textarea"
              value={form.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Дефекты, замеры, особенности вещи или комментарии для учёта"
            />
          </Field>

          {form.is_public && form.status === LISTED_STATUS ? (
            <p className="text-xs text-slate-400">
              Для публичного товара со статусом «Выставлено» потребуется ссылка на Vinted.
            </p>
          ) : null}

          {displayError ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {displayError}
            </div>
          ) : null}

          <button type="submit" className="button-primary w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? submitPendingLabel : submitLabel}
          </button>
        </section>
      </div>

      <section className="card space-y-5 xl:sticky xl:top-24">
        <SectionHeading
          title="Фотографии"
          description={
            mode === 'edit'
              ? 'Выберите главное фото, удаляйте старые и добавляйте новые.'
              : 'Загрузите фотографии и выберите главное изображение товара.'
          }
        />

        {existingPhotos.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {existingPhotos.map((photo) => {
              const isPrimary = form.primary_photo_file_index === null
                && form.primary_photo_id === photo.id;

              return (
                <div key={photo.id} className="relative rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                  {isPrimary ? (
                    <span className="absolute left-5 top-5 z-10 rounded-full bg-emerald-500 px-2 py-1 text-xs font-semibold text-slate-950">
                      Главное фото
                    </span>
                  ) : null}
                  <img
                    src={photo.image_url}
                    alt="Фото вещи"
                    className="h-44 w-full rounded-lg object-cover"
                  />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="button-secondary gap-2 px-3 py-2 text-xs"
                      aria-pressed={isPrimary}
                      onClick={() => {
                        updateField('primary_photo_id', photo.id);
                        updateField('primary_photo_file_index', null);
                      }}
                    >
                      <Star className={`h-4 w-4 ${isPrimary ? 'fill-current' : ''}`} />
                      {isPrimary ? 'Главное' : 'Выбрать'}
                    </button>
                    <button
                      type="button"
                      className="button-secondary px-3 py-2 text-xs"
                      onClick={() => onDeletePhoto?.(photo)}
                      disabled={deletingPhotoId === photo.id}
                    >
                      {deletingPhotoId === photo.id ? 'Удаление...' : 'Удалить'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4">
          <p className="mb-3 text-sm font-medium text-slate-200">{onAddPhotosLabel}</p>
          <ImageUploader
            previews={previews}
            selectedIndex={form.primary_photo_file_index}
            onSelect={(index) => updateField('primary_photo_file_index', index)}
            onChange={handlePhotosChange}
          />
        </div>
      </section>
    </form>
  );
}
