import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MilkyWayUploadPanelModel } from '@/types/milky-way';

interface MilkyWayUploadPanelProps {
  model: MilkyWayUploadPanelModel;
  onCancel: () => void;
  onConfirm: () => void;
}

const CALENDAR_WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatMemoryDateLabel(memoryDate: string) {
  if (!memoryDate) {
    return 'Select date';
  }

  const normalizedDate = new Date(`${memoryDate}T00:00:00`);

  if (Number.isNaN(normalizedDate.getTime())) {
    return memoryDate;
  }

  return normalizedDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function parseMemoryDate(memoryDate: string) {
  if (!memoryDate) {
    return null;
  }

  const normalizedDate = new Date(`${memoryDate}T00:00:00`);

  return Number.isNaN(normalizedDate.getTime()) ? null : normalizedDate;
}

function formatMemoryDateValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createCalendarMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftCalendarMonth(date: Date, offset: number) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function formatCalendarMonthLabel(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function formatCalendarDayLabel(date: Date) {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildCalendarGrid(month: Date) {
  const firstDayOfMonth = createCalendarMonth(month);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const leadingEmptyCells = firstDayOfMonth.getDay();
  const cells: Array<Date | null> = Array.from({ length: leadingEmptyCells }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export function MilkyWayUploadPanel({
  model,
  onCancel,
  onConfirm,
}: MilkyWayUploadPanelProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const datePickerRef = useRef<HTMLDivElement | null>(null);
  const [previews, setPreviews] = useState<Array<{ file: File; name: string; url: string }>>([]);
  const [memoryDate, setMemoryDate] = useState(model.defaultMemoryTime);
  const [eventTitle, setEventTitle] = useState('');
  const [note, setNote] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [visibleCalendarMonth, setVisibleCalendarMonth] = useState(() =>
    createCalendarMonth(parseMemoryDate(model.defaultMemoryTime) ?? new Date()),
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previewSlotCount = previews.length < 9 ? previews.length + 1 : previews.length;
  const calendarDays = useMemo(() => buildCalendarGrid(visibleCalendarMonth), [visibleCalendarMonth]);
  const selectedMemoryDate = parseMemoryDate(memoryDate);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  useEffect(() => {
    if (!isDatePickerOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        datePickerRef.current &&
        event.target instanceof Node &&
        !datePickerRef.current.contains(event.target)
      ) {
        setIsDatePickerOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isDatePickerOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);

    setPreviews((currentPreviews) => {
      const nextPreviews = nextFiles
        .slice(0, Math.max(0, 9 - currentPreviews.length))
        .map((file) => ({
          file,
          name: file.name,
          url: URL.createObjectURL(file),
        }));

      return [...currentPreviews, ...nextPreviews];
    });

    event.target.value = '';
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen((current) => {
      const nextState = !current;

      if (nextState) {
        setVisibleCalendarMonth(createCalendarMonth(parseMemoryDate(memoryDate) ?? new Date()));
      }

      return nextState;
    });
  };

  const handleMemoryDateSelect = (date: Date) => {
    setMemoryDate(formatMemoryDateValue(date));
    setVisibleCalendarMonth(createCalendarMonth(date));
    setIsDatePickerOpen(false);
  };

  const removePreview = (url: string) => {
    setPreviews((currentPreviews) => {
      const previewToRemove = currentPreviews.find((preview) => preview.url === url);

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.url);
      }

      return currentPreviews.filter((preview) => preview.url !== url);
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (previews.length === 0) {
      setErrorMessage('Select at least one photo before uploading.');
      return;
    }

    if (!memoryDate) {
      setErrorMessage('Memory time is required.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      for (const preview of previews) {
        const formData = new FormData();
        formData.append('file', preview.file);
        formData.append('eventTitle', eventTitle.trim());
        formData.append('memoryDate', memoryDate);
        formData.append('note', note.trim());
        formData.append('archiveDirectly', 'true');

        const response = await fetch('/api/photos/upload', {
          body: formData,
          method: 'POST',
        });
        const payload = (await response.json()) as {
          errors?: string[];
          message?: string;
          ok: boolean;
        };

        if (!response.ok || !payload.ok) {
          setErrorMessage(payload.errors?.[0] ?? payload.message ?? 'Unable to upload photos right now.');
          setIsSubmitting(false);
          return;
        }
      }

      onConfirm();
      router.refresh();
    } catch {
      setErrorMessage('Unable to upload photos right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="milky-way-upload-panel"
      id="milky-way-upload-panel"
      onSubmit={handleSubmit}
    >
      <section
        aria-label="Selected photo previews"
        className="milky-way-upload-preview"
        data-state={previews.length > 0 ? 'filled' : 'empty'}
        data-testid="milky-way-upload-preview"
      >
        {previews.length > 0 ? (
          <div className="milky-way-upload-preview-grid" data-count={previewSlotCount}>
            {previews.map((preview) => (
              <div className="milky-way-upload-preview-card" key={preview.url}>
                <div
                  aria-label={preview.name}
                  className="milky-way-upload-preview-image"
                  role="img"
                  style={{ backgroundImage: `url(${preview.url})` }}
                />
                <button
                  aria-label={`Remove ${preview.name}`}
                  className="milky-way-upload-preview-remove"
                  type="button"
                  onClick={() => removePreview(preview.url)}
                >
                  x
                </button>
              </div>
            ))}
            {previews.length < 9 ? (
              <button
                aria-label="Add more photos"
                className="milky-way-upload-preview-add"
                type="button"
                onClick={openFilePicker}
              >
                <span className="milky-way-upload-preview-plus is-compact" aria-hidden="true" />
              </button>
            ) : null}
          </div>
        ) : (
          <button
            aria-label="Choose photos"
            className="milky-way-upload-preview-placeholder"
            type="button"
            onClick={openFilePicker}
          >
            <span className="milky-way-upload-preview-eyebrow">Photo preview</span>
            <strong>Select up to 9 photos</strong>
            <span className="milky-way-upload-preview-plus is-large" aria-hidden="true" />
            <p>Your chosen images will appear here before you add them to the timeline.</p>
          </button>
        )}
      </section>
      <input
        accept="image/*"
        aria-label="Photo file"
        className="milky-way-upload-hidden-input"
        multiple
        name="photo"
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
      />
      <div className="milky-way-upload-field">
        <span id="milky-way-memory-time-label">Memory time</span>
        <div ref={datePickerRef} className="planet-select planet-date-field">
          <button
            aria-controls="milky-way-memory-time-calendar"
            aria-describedby="milky-way-memory-time-label"
            aria-expanded={isDatePickerOpen}
            aria-haspopup="dialog"
            aria-label={formatMemoryDateLabel(memoryDate)}
            className="planet-select-trigger planet-date-trigger"
            onClick={toggleDatePicker}
            type="button"
          >
            <span>{formatMemoryDateLabel(memoryDate)}</span>
          </button>
          <input name="memoryTime" type="hidden" value={memoryDate} />
          {isDatePickerOpen ? (
            <div className="planet-select-menu planet-date-menu" role="presentation">
              <div
                aria-label="Memory time calendar"
                className="planet-date-picker"
                id="milky-way-memory-time-calendar"
                role="dialog"
              >
                <div className="planet-date-picker-header">
                  <button
                    aria-label="Previous month"
                    className="planet-date-picker-nav"
                    onClick={() =>
                      setVisibleCalendarMonth((current) => shiftCalendarMonth(current, -1))
                    }
                    type="button"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <p className="planet-date-picker-month">
                    {formatCalendarMonthLabel(visibleCalendarMonth)}
                  </p>
                  <button
                    aria-label="Next month"
                    className="planet-date-picker-nav"
                    onClick={() =>
                      setVisibleCalendarMonth((current) => shiftCalendarMonth(current, 1))
                    }
                    type="button"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                </div>
                <div className="planet-date-picker-weekdays" aria-hidden="true">
                  {CALENDAR_WEEKDAY_LABELS.map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                  ))}
                </div>
                <div className="planet-date-picker-grid">
                  {calendarDays.map((calendarDate, index) =>
                    calendarDate ? (
                      <button
                        aria-label={formatCalendarDayLabel(calendarDate)}
                        className="planet-date-picker-day"
                        data-selected={
                          selectedMemoryDate
                            ? formatMemoryDateValue(calendarDate) ===
                              formatMemoryDateValue(selectedMemoryDate)
                            : false
                        }
                        key={formatMemoryDateValue(calendarDate)}
                        onClick={() => handleMemoryDateSelect(calendarDate)}
                        type="button"
                      >
                        {calendarDate.getDate()}
                      </button>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="planet-date-picker-day planet-date-picker-day--empty"
                        key={`empty-${visibleCalendarMonth.getTime()}-${index}`}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <label>
        {model.eventLabel}
        <input
          name="eventTitle"
          type="text"
          value={eventTitle}
          onChange={(event) => setEventTitle(event.target.value)}
        />
      </label>
      <label>
        {model.noteLabel}
        <textarea name="note" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      {errorMessage ? <p className="auth-error">{errorMessage}</p> : null}
      <div className="milky-way-upload-actions">
        <button
          className="milky-way-upload-action is-secondary"
          disabled={isSubmitting}
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button className="milky-way-upload-action is-primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Uploading...' : 'Confirm Upload'}
        </button>
      </div>
    </form>
  );
}
