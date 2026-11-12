import Image from "next/image";
import { portfolio } from "@/data/portfolio";
import styles from "./About.module.css";

export default function About() {
  const { about, portrait } = portfolio;
  const [lead, ...rest] = about.paragraphs;
  return (
    <section id="about" className={`section ${styles.about}`} data-shape="6" aria-labelledby="about-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.side}>
          <p className="eyebrow" data-fade>
            {about.eyebrow}
          </p>
          <h2 id="about-title" className="heading-lg" data-split="chars">
            A little <span className="serif accent">about</span> me
          </h2>

          {portrait ? (
            <div className={styles.cardWrap} data-parallax="0.08">
              <figure className={styles.card} data-tilt="9" data-cursor="Shohrux">
                <div className={styles.media} data-clip>
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    width={portrait.width}
                    height={portrait.height}
                    sizes="(min-width: 900px) 380px, 80vw"
                  />
                </div>
                <span className={styles.holo} aria-hidden="true" />
                <figcaption className={styles.badge}>
                  <span>Shohrux</span>
                  <span>Uzbekistan</span>
                </figcaption>
              </figure>
            </div>
          ) : null}
        </div>

        <div className={styles.text}>
          <p className={styles.lead} data-highlight>
            {lead}
          </p>
          {rest.map((p, i) => (
            <p key={i} className={styles.para} data-fade>
              {p}
            </p>
          ))}

          <dl className={styles.facts} data-stagger>
            {about.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className={styles.signature} aria-hidden="true" data-fade>
            — Shohrux
          </p>
        </div>
      </div>
    </section>
  );
}
