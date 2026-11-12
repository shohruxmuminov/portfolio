import Image from "next/image";
import { portfolio } from "@/data/portfolio";
import Clock from "./Clock";
import { ArrowDown, ArrowRight } from "./Icons";
import styles from "./Hero.module.css";

export default function Hero() {
  const { hero, portrait } = portfolio;
  const ring = "Developer • AI Product Builder • Creative Technologist • ";

  return (
    <section id="top" className={styles.hero} data-shape="0" aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.topRow} data-intro>
          <p className={styles.role}>{hero.eyebrow}</p>
          <Clock className={styles.clock} />
        </div>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.name} data-hero-name>
            SHOHRUX
          </span>
          <span className="visually-hidden">, developer and AI product builder from Uzbekistan</span>
        </h1>

        <div className={styles.bottom}>
          <div className={styles.copy}>
            <p className={styles.headline} data-intro>
              {hero.headlineLead} <span className="serif accent">{hero.headlineAccent}</span> {hero.headlineTail}
            </p>
            <p className={styles.lede} data-intro>
              {hero.supporting}
            </p>
            <div className={styles.actions} data-intro>
              <span data-magnetic="0.25">
                <a href={hero.primaryCta.href} className="btn btn--primary btn--down">
                  {hero.primaryCta.label}
                  <ArrowDown />
                </a>
              </span>
              <span data-magnetic="0.25">
                <a href={hero.secondaryCta.href} className="btn btn--ghost">
                  {hero.secondaryCta.label}
                  <ArrowRight />
                </a>
              </span>
            </div>
          </div>

          {portrait ? (
            <div className={styles.lensWrap} data-intro>
              <figure className={styles.lens} data-tilt="14" data-cursor="Hi!">
                <svg className={styles.ring} viewBox="0 0 300 300" aria-hidden="true">
                  <defs>
                    <path id="lens-ring" d="M150,150 m-128,0 a128,128 0 1,1 256,0 a128,128 0 1,1 -256,0" />
                  </defs>
                  <text>
                    <textPath href="#lens-ring" textLength="800" lengthAdjust="spacing">
                      {ring}
                    </textPath>
                  </text>
                </svg>
                <div className={styles.photo}>
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    width={portrait.width}
                    height={portrait.height}
                    priority
                    sizes="240px"
                  />
                  <span className={styles.glare} aria-hidden="true" />
                </div>
              </figure>
            </div>
          ) : null}
        </div>
      </div>

      <a href="#work" className={styles.cue} data-intro aria-label="Scroll to selected work">
        <span className={styles.mouse} aria-hidden="true">
          <i />
        </span>
        <span>Scroll</span>
      </a>
    </section>
  );
}
