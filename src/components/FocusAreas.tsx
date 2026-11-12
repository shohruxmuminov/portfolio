import { portfolio } from "@/data/portfolio";
import styles from "./FocusAreas.module.css";

/* Small pure-CSS 3D objects, one per focus area. */
function Layers() {
  return (
    <div className={styles.layers}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties}>
          <i />
        </span>
      ))}
    </div>
  );
}

function Atom() {
  return (
    <div className={styles.atom}>
      {[0, 60, 120].map((a) => (
        <span key={a} className={styles.orbit} style={{ "--a": `${a}deg` } as React.CSSProperties}>
          <span className={styles.electronPath} />
        </span>
      ))}
      <span className={styles.core} />
    </div>
  );
}

function Tiles() {
  return (
    <div className={styles.tiles}>
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} style={{ "--d": (i % 3) + Math.floor(i / 3) } as React.CSSProperties} />
      ))}
    </div>
  );
}

function Cube({ size }: { size: "outer" | "inner" }) {
  return (
    <div className={`${styles.cube} ${styles[size]}`}>
      {["front", "back", "left", "right", "top", "bottom"].map((f) => (
        <span key={f} className={styles[f]} />
      ))}
    </div>
  );
}

function Hypercube() {
  return (
    <div className={styles.hyper}>
      <Cube size="outer" />
      <Cube size="inner" />
    </div>
  );
}

const objects: Record<string, () => React.ReactElement> = {
  web: Layers,
  ai: Atom,
  desktop: Tiles,
  "3d": Hypercube,
};

export default function FocusAreas() {
  const { focus } = portfolio;
  return (
    <section id="focus" className="section" aria-labelledby="focus-title">
      <div className="container">
        <header className={styles.head}>
          <p className="eyebrow" data-fade>
            {focus.eyebrow}
          </p>
          <h2 id="focus-title" className="heading-lg" data-split="chars">
            What I’m <span className="serif accent">exploring</span>
          </h2>
          <p className={styles.intro} data-fade>
            {focus.intro}
          </p>
        </header>

        <ul className={styles.grid} data-stagger>
          {focus.areas.map((a, i) => {
            const Obj = objects[a.key];
            return (
              <li key={a.key} className={styles.cardWrap}>
                <article className={styles.card} data-tilt="8" data-inview>
                  <span className={styles.spot} aria-hidden="true" />
                  <div className={styles.scene} aria-hidden="true">
                    <Obj />
                  </div>
                  <span className={styles.n} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className={styles.title}>{a.title}</h3>
                  <p className={styles.body}>{a.body}</p>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
