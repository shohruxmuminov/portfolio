import { portfolio } from "@/data/portfolio";
import styles from "./Process.module.css";

export default function Process() {
  const { process } = portfolio;
  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow" data-fade>
            {process.eyebrow}
          </p>
          <h2 id="process-title" className="heading-lg" data-split="chars">
            From first idea to <span className="serif accent">working product</span>
          </h2>
        </header>

        <div className={styles.track} data-draw-scope>
          <svg className={styles.path} viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.ghost} d="M50 0 C 92 125, 92 125, 50 250 S 8 375, 50 500 S 92 625, 50 750 S 8 875, 50 1000" />
            <path
              className={styles.line}
              data-draw
              d="M50 0 C 92 125, 92 125, 50 250 S 8 375, 50 500 S 92 625, 50 750 S 8 875, 50 1000"
            />
          </svg>
          <ol className={styles.steps}>
            {process.steps.map((s) => (
              <li key={s.n} className={styles.step} data-activate>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.card} data-fade>
                  <span className={styles.n} aria-hidden="true">
                    {s.n}
                  </span>
                  <h3 className={styles.title}>{s.title}</h3>
                  <p className={styles.body}>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
