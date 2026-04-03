import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import {
  getObjectStorageConfigurationError,
  isObjectStorageConfigured,
} from '@/lib/env';

function buildClient() {
  if (!isObjectStorageConfigured()) {
    throw new Error(getObjectStorageConfigurationError());
  }

  return new S3Client({
    credentials: {
      accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY_ID ?? '',
      secretAccessKey: process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY ?? '',
    },
    endpoint: process.env.OBJECT_STORAGE_ENDPOINT,
    forcePathStyle: process.env.OBJECT_STORAGE_FORCE_PATH_STYLE === 'true',
    region: process.env.OBJECT_STORAGE_REGION,
  });
}

function buildPublicUrl(key: string) {
  const publicBaseUrl = process.env.OBJECT_STORAGE_PUBLIC_BASE_URL?.replace(/\/$/, '');

  if (publicBaseUrl) {
    return `${publicBaseUrl}/${key}`;
  }

  const endpoint = process.env.OBJECT_STORAGE_ENDPOINT?.replace(/\/$/, '');
  const bucket = process.env.OBJECT_STORAGE_BUCKET;

  if (!endpoint || !bucket) {
    throw new Error(getObjectStorageConfigurationError());
  }

  return `${endpoint}/${bucket}/${key}`;
}

export const objectStorage = {
  async uploadFile({
    body,
    contentType,
    key,
  }: {
    body: Buffer;
    contentType: string;
    key: string;
  }) {
    const client = buildClient();
    const bucket = process.env.OBJECT_STORAGE_BUCKET;

    if (!bucket) {
      throw new Error(getObjectStorageConfigurationError());
    }

    await client.send(
      new PutObjectCommand({
        Body: body,
        Bucket: bucket,
        ContentType: contentType,
        Key: key,
      }),
    );

    return {
      key,
      url: buildPublicUrl(key),
    };
  },
  async deleteFile(key: string) {
    const client = buildClient();
    const bucket = process.env.OBJECT_STORAGE_BUCKET;

    if (!bucket) {
      throw new Error(getObjectStorageConfigurationError());
    }

    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
  },
};
