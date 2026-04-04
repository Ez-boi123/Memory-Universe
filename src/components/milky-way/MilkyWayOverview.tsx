'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { MilkyWayPageModel } from '@/types/milky-way';
import { MilkyWayFeed } from '@/components/milky-way/MilkyWayFeed';
import { MilkyWayTimelineNav } from '@/components/milky-way/MilkyWayTimelineNav';
import { MilkyWayUploadPanel } from '@/components/milky-way/MilkyWayUploadPanel';
import { MilkyWayUploadTile } from '@/components/milky-way/MilkyWayUploadTile';

interface MilkyWayOverviewProps {
  model: MilkyWayPageModel;
}

export function MilkyWayOverview({ model }: MilkyWayOverviewProps) {
  const router = useRouter();
  const hasTimeline = model.timeline.length > 0;
  const deleteDialogTitleId = 'milky-way-delete-dialog-title';
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  function handleTogglePhoto(photoId: string) {
    setSelectedPhotoIds((current) =>
      current.includes(photoId)
        ? current.filter((currentId) => currentId !== photoId)
        : [...current, photoId],
    );
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setSelectedPhotoIds([]);
  }

  async function handleConfirmDeleteSelected() {
    if (selectedPhotoIds.length === 0 || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch('/api/photos', {
        body: JSON.stringify({
          photoIds: selectedPhotoIds,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });
      const payload = (await response.json()) as {
        errors?: string[];
      };

      if (!response.ok) {
        throw new Error(payload.errors?.[0] ?? 'Deleting photos failed.');
      }

      setIsDeleteConfirmOpen(false);
      setSelectedPhotoIds([]);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Deleting photos failed.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="milky-way-page">
      <header className="milky-way-page-header">
        <div className="milky-way-page-copy">
          <p className="page-eyebrow">Milky Way</p>
          <h1 className="page-title">{model.title}</h1>
          <p className="page-description">{model.description}</p>
        </div>
      </header>
      <div className={hasTimeline ? 'milky-way-layout' : 'milky-way-layout is-empty'}>
        {hasTimeline ? (
          <aside className="milky-way-sidebar">
            <MilkyWayTimelineNav nodes={model.timeline} />
          </aside>
        ) : null}
        <div className="milky-way-feed-region">
          <MilkyWayUploadTile
            actions={
              hasTimeline ? (
                <div className="milky-way-page-actions">
                  {isEditing ? (
                    <>
                      <button
                        className="milky-way-edit-action is-danger"
                        disabled={selectedPhotoIds.length === 0 || isDeleting}
                        onClick={() => setIsDeleteConfirmOpen(true)}
                        type="button"
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                      <button
                        className="milky-way-edit-action is-secondary"
                        onClick={handleCancelEdit}
                        type="button"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="milky-way-edit-action is-primary"
                      onClick={() => setIsEditing(true)}
                      type="button"
                    >
                      Edit
                    </button>
                  )}
                </div>
              ) : null
            }
            isOpen={isUploadOpen}
            model={model.uploadTile}
            onToggle={() => setIsUploadOpen((current) => !current)}
          />
          {isUploadOpen ? (
            <>
              <button
                aria-label="Close upload dialog"
                className="milky-way-upload-overlay"
                data-testid="milky-way-upload-overlay"
                type="button"
                onClick={() => setIsUploadOpen(false)}
              />
              <div
                aria-modal="true"
                className="milky-way-upload-dialog"
                role="dialog"
                onClick={(event) => event.stopPropagation()}
              >
                <MilkyWayUploadPanel
                  model={model.uploadPanel}
                  onCancel={() => setIsUploadOpen(false)}
                  onConfirm={() => setIsUploadOpen(false)}
                />
              </div>
            </>
          ) : null}
          {model.emptyState ? (
            <section className="milky-way-empty-state">
              <h2>{model.emptyState.title}</h2>
              <p>{model.emptyState.description}</p>
            </section>
          ) : (
            <MilkyWayFeed
              isEditing={isEditing}
              onPhotoToggle={handleTogglePhoto}
              sections={model.sections}
              selectedPhotoIds={new Set(selectedPhotoIds)}
            />
          )}
        </div>
      </div>
      {isDeleteConfirmOpen ? (
        <>
          <button
            aria-label="Close delete confirmation"
            className="milky-way-upload-overlay"
            data-testid="milky-way-delete-overlay"
            onClick={() => setIsDeleteConfirmOpen(false)}
            type="button"
          />
          <div
            aria-labelledby={deleteDialogTitleId}
            aria-modal="true"
            className="milky-way-confirm-dialog"
            role="dialog"
          >
            <p className="milky-way-confirm-kicker">Delete Photos</p>
            <h2 className="milky-way-confirm-title" id={deleteDialogTitleId}>
              Delete selected Milky Way photos?
            </h2>
            <p className="milky-way-confirm-body">
              This will remove the selected photos from Milky Way. Planet event photos will stay in place.
            </p>
            <div className="milky-way-confirm-actions">
              <button
                className="milky-way-edit-action is-secondary"
                onClick={() => setIsDeleteConfirmOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="milky-way-edit-action is-danger"
                disabled={isDeleting}
                onClick={handleConfirmDeleteSelected}
                type="button"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
