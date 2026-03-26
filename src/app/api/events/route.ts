import { notImplementedResponse } from '@/app/api/_shared/response';

export async function GET() {
  return notImplementedResponse('events.list');
}

export async function POST() {
  return notImplementedResponse('events.create');
}
