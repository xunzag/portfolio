import { arsenal, experience, facts, profile, projects, quotes } from "@/lib/content"

// Everything the film says, as plain HTML for screen readers and crawlers.
export function ScreenReader() {
  return (
    <article className="sr-only">
      <h1>
        {profile.name} — {profile.roles.join(", ")}
      </h1>
      <p>{profile.tagline}</p>
      {profile.bio.map((b) => (
        <p key={b}>{b}</p>
      ))}
      <h2>Case files</h2>
      {projects.map((p) => (
        <section key={p.slug}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p>Built with {p.tech.join(", ")}</p>
          {p.links.live && <a href={p.links.live}>Visit {p.title}</a>}
          {p.links.github && <a href={p.links.github}>{p.title} source</a>}
        </section>
      ))}
      <h2>Experience</h2>
      {experience.map((e) => (
        <p key={e.hash}>
          {e.role} at {e.company}, {e.period}. {e.desc}
        </p>
      ))}
      <h2>Arsenal</h2>
      {arsenal.map((g) => (
        <p key={g.name}>
          {g.name}: {g.items.join(", ")}
        </p>
      ))}
      <h2>Facts</h2>
      <ul>
        {facts.map((f) => (
          <li key={f.label}>
            {f.value} {f.label}
          </li>
        ))}
      </ul>
      <p>
        “{quotes.guts.text}” — {quotes.guts.by}
      </p>
      <h2>Contact</h2>
      <a href={`mailto:${profile.email}`}>{profile.email}</a>
    </article>
  )
}
