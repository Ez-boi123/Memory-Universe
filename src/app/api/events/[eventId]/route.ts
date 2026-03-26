import { notImplementedResponse } from '@/app/api/_shared/response';

export async function GET() {
  return notImplementedResponse('events.detail');
}

export async function PATCH() {
  return notImplementedResponse('events.update');
}

export async function DELETE() {
  return notImplementedResponse('events.delete');
}
