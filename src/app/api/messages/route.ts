import { notImplementedResponse } from '@/app/api/_shared/response';

export async function GET() {
  return notImplementedResponse('messages.list');
}

export async function POST() {
  return notImplementedResponse('messages.create');
}
