import { portfolio } from "@/data/portfolio";
import ToolSphere from "./ToolSphere";
import styles from "./Toolkit.module.css";

export default function Toolkit() {
  const { toolkit } = portfolio;
  const items = toolkit.groups.flatMap((g, gi) => g.items.map((label) => ({ label, group: gi })));
  return (
    <section className="section" aria-labelledby="toolkit-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className="eyebrow" data-fade>
            {toolkit.eyebrow}
          </p>
          <h2 id="toolkit-title" className="heading-lg" data-split="chars">
            Tools &amp; technologies <span className="serif accent">explored</span>
          </h2>
          <p className={styles.note} data-fade>
            {toolkit.note}
          </p>
          <div className={styles.groups} data-stagger>
            {toolkit.groups.map((g, gi) => (
              <div key={g.title} className={styles.group} data-group={gi}>
                <h3>{g.title}</h3>
                <p>{g.items.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.sphereWrap} data-fade>
          <ToolSphere items={items} />
          <p className={styles.hint} aria-hidden="true">
            Drag to spin
          </p>
        </div>
      </div>
    </section>
  );
}
