import { PROJECT_NAME, PROJECT_TAGLINE } from '@authforge/shared';

export default function HomePage() {
  return (
    <main className="shell">
      <section className="intro">
        <p className="eyebrow">Identity platform lab</p>
        <h1>{PROJECT_NAME}</h1>
        <p>{PROJECT_TAGLINE}</p>
      </section>

      <section className="status" aria-label="Project status">
        <div>
          <span>Phase</span>
          <strong>Base and local infrastructure</strong>
        </div>
        <div>
          <span>API</span>
          <strong>http://localhost:3001/health</strong>
        </div>
        <div>
          <span>Mailpit</span>
          <strong>http://localhost:8025</strong>
        </div>
      </section>
    </main>
  );
}
