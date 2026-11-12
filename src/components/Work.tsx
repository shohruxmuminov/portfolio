import { portfolio } from "@/data/portfolio";
import ProjectChapter from "./ProjectChapter";
import styles from "./Work.module.css";

export default function Work() {
  const { work, projects } = portfolio;
  return (
    <section id="work" aria-labelledby="work-title">
      <header
        className={`container ${styles.intro}`}
        data-shape="0"
        data-lx="0.62"
        data-ly="0.42"
        data-ls="0.5"
        data-mx="0.5"
        data-my="0.72"
        data-ms="0.32"
        data-mo="0.8"
      >
        <p className="eyebrow" data-fade>
          {work.eyebrow}
        </p>
        <h2 id="work-title" className="heading-xl" data-split="chars">
          Ideas, made <span className="serif accent">tangible.</span>
        </h2>
        <div className={styles.meta} data-stagger>
          <p>{work.intro}</p>
          <ol className={styles.index} aria-label="Project index">
            {projects.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`}>
                  <span>{p.index}</span>
                  {p.name}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </header>

      {projects.map((p, i) => (
        <ProjectChapter key={p.id} project={p} side={i % 2 === 0 ? "left" : "right"} total={projects.length} />
      ))}
    </section>
  );
}
