import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const endpoint = requireEnv('OBJECT_STORAGE_ENDPOINT');
const region = requireEnv('OBJECT_STORAGE_REGION');
const bucket = requireEnv('OBJECT_STORAGE_BUCKET');
const accessKeyId = requireEnv('OBJECT_STORAGE_ACCESS_KEY_ID');
const secretAccessKey = requireEnv('OBJECT_STORAGE_SECRET_ACCESS_KEY');
const forcePathStyle = process.env.OBJECT_STORAGE_FORCE_PATH_STYLE === 'true';
const ttlHours = Number(process.env.EVENT_PHOTO_UPLOAD_TTL_HOURS ?? '24');

const client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint,
  forcePathStyle,
  region,
});

async function main() {
  const olderThan = new Date(Date.now() - ttlHours * 60 * 60 * 1000);
  const expiredUploads = await prisma.eventPhotoUpload.findMany({
    orderBy: {
      uploadedAt: 'asc',
    },
    where: {
      status: 'pending',
      uploadedAt: {
        lt: olderThan,
      },
    },
  });

  if (expiredUploads.length === 0) {
    console.log('No expired temporary event photo uploads found.');
    return;
  }

  for (const upload of expiredUploads) {
    await client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: upload.storageKey,
      }),
    );
  }

  await prisma.eventPhotoUpload.deleteMany({
    where: {
      id: {
        in: expiredUploads.map((upload) => upload.id),
      },
    },
  });

  console.log(`Deleted ${expiredUploads.length} expired temporary event photo upload(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
