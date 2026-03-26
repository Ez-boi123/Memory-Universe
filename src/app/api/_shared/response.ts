export function notImplementedResponse(scope: string) {
  return Response.json(
    {
      ok: false,
      scope,
      message: `TODO: ${scope} is not implemented in the scaffold phase.`,
    },
    {
      status: 501,
    }
  );
}
