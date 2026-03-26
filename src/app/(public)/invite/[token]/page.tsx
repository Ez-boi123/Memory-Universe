interface InviteAcceptPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function InviteAcceptPage({ params }: InviteAcceptPageProps) {
  const { token } = await params;

  return (
    <div className="page-shell">
      <section className="page-card">
        <p className="page-eyebrow">Invite</p>
        <h1 className="page-title">Accept Invite</h1>
        <p className="page-description">
          TODO: implement invite validation, relationship activation, and graceful invalid / expired
          handling. Current invite token: <strong>{token}</strong>.
        </p>
      </section>
    </div>
  );
}
