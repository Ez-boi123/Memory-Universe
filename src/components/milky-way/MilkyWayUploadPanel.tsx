import React, { useEffect, useRef, useState } from 'react';
import type { MilkyWayUploadPanelModel } from '@/types/milky-way';

interface MilkyWayUploadPanelProps {
  model: MilkyWayUploadPanelModel;
  onCancel: () => void;
  onConfirm: () => void;
}

export function MilkyWayUploadPanel({
  model,
  onCancel,
  onConfirm,
}: MilkyWayUploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<Array<{ name: string; url: string }>>([]);
  const previewSlotCount = previews.length < 9 ? previews.length + 1 : previews.length;

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, [previews]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);

    setPreviews((currentPreviews) => {
      const nextPreviews = nextFiles
        .slice(0, Math.max(0, 9 - currentPreviews.length))
        .map((file) => ({
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

  const removePreview = (url: string) => {
    setPreviews((currentPreviews) => {
      const previewToRemove = currentPreviews.find((preview) => preview.url === url);

      if (previewToRemove) {
        URL.revokeObjectURL(previewToRemove.url);
      }

      return currentPreviews.filter((preview) => preview.url !== url);
    });
  };

  return (
    <form
      className="milky-way-upload-panel"
      id="milky-way-upload-panel"
      onSubmit={(event) => {
        event.preventDefault();
        onConfirm();
      }}
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
      <label>
        Memory time
        <input defaultValue={model.defaultMemoryTime} name="memoryTime" type="datetime-local" />
      </label>
      <label>
        {model.eventLabel}
        <input defaultValue="" name="eventName" type="text" />
      </label>
      <label>
        {model.noteLabel}
        <textarea name="note" rows={3} />
      </label>
      <div className="milky-way-upload-actions">
        <button className="milky-way-upload-action is-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="milky-way-upload-action is-primary" type="submit">
          Confirm Upload
        </button>
      </div>
    </form>
  );
}
