import type { Project } from "@/data/portfolio";
import { ArrowUpRight } from "./Icons";
import styles from "./ProjectChapter.module.css";

const statusClass: Record<Project["status"], string> = {
  "In development": "status--dev",
  Prototype: "status--proto",
  Concept: "status--concept",
  Live: "status--live",
};

export default function ProjectChapter({
  project,
  side,
  total,
}: {
  project: Project;
  side: "left" | "right";
  total: number;
}) {
  const href = project.links?.demo ?? project.links?.repo;
  const linkLabel = project.links?.demo ? "View live demo" : "View repository";

  return (
    <article
      id={project.id}
      className={`${styles.chapter} ${side === "right" ? styles.right : ""}`}
      data-shape={project.shape}
      aria-labelledby={`${project.id}-title`}
    >
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <span className={styles.bigIndex} aria-hidden="true" data-parallax="0.35">
            {project.index}
          </span>

          <div className={styles.head} data-stagger>
            <p className={`status ${statusClass[project.status]}`}>
              <i aria-hidden="true" />
              <span className="visually-hidden">Status: </span>
              {project.status}
              {project.stage ? <span className="stage"> / {project.stage}</span> : null}
            </p>
            <p className={styles.counter}>
              Project {project.index} <span>/ {String(total).padStart(2, "0")}</span>
            </p>
          </div>

          <h3 id={`${project.id}-title`} className={styles.title} data-split="chars">
            {project.name}
          </h3>

          <p className={styles.summary} data-fade>
            {project.summary}
          </p>

          <ul className={styles.explores} data-stagger aria-label="What it explores">
            {project.explores.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>

          <ul className={styles.tags} data-stagger aria-label="Focus">
            {project.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          {href ? (
            <div data-fade>
              <span data-magnetic="0.3" style={{ display: "inline-block" }}>
                <a
                  href={href}
                  className="btn btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Open"
                >
                  {linkLabel}
                  <span className="visually-hidden"> — {project.name} on GitHub (opens in a new tab)</span>
                  <ArrowUpRight />
                </a>
              </span>
            </div>
          ) : null}
        </div>

        {/* The particle sculpture lands inside this frame. */}
        <div className={styles.stage} aria-hidden="true">
          <span className={`${styles.corner} ${styles.tl}`} />
          <span className={`${styles.corner} ${styles.tr}`} />
          <span className={`${styles.corner} ${styles.bl}`} />
          <span className={`${styles.corner} ${styles.br}`} />
          <span className={styles.caption}>
            Fig. {project.index} — particle study: {project.study}
          </span>
          <span className={styles.scan} />
        </div>
      </div>
    </article>
  );
}
