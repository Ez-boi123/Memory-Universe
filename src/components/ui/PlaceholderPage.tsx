interface PlaceholderPageProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets?: string[];
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  bullets = [],
}: PlaceholderPageProps) {
  return (
    <div className="page-shell">
      <section className="page-card">
        <p className="page-eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-description">{description}</p>
        {bullets.length > 0 ? (
          <ul className="placeholder-list">
            {bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
