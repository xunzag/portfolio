import { App } from "@/components/App"
import { profile, projects, experience, skillGroups } from "@/lib/content"

export default function Page() {
  return (
    <>
      <App />
      {/* Crawlable, screen-reader friendly copy of the room's content. */}
      <main className="sr-only">
        <h1>
          {profile.name} — {profile.role}
        </h1>
        <p>{profile.tagline}</p>
        {profile.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <h2>Projects</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.slug}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p>Built with {p.tech.join(", ")}</p>
              {p.links.github && <a href={p.links.github}>Source code</a>}
              {p.links.live && <a href={p.links.live}>Live site</a>}
            </li>
          ))}
        </ul>
        <h2>Experience</h2>
        <ul>
          {experience.map((e) => (
            <li key={e.hash}>
              {e.role} at {e.company}, {e.period}. {e.desc}
            </li>
          ))}
        </ul>
        <h2>Skills</h2>
        <ul>
          {skillGroups.flatMap((g) => g.items).map((s) => (
            <li key={s.name}>{s.name}</li>
          ))}
        </ul>
        <h2>Contact</h2>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.socials.github}>GitHub</a>
        <a href={profile.socials.linkedin}>LinkedIn</a>
      </main>
    </>
  )
}
