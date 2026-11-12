import { portfolio } from "@/data/portfolio";
import styles from "./Marquee.module.css";

function Row({ items, dir, outline }: { items: string[]; dir: 1 | -1; outline?: boolean }) {
  const content = (hidden: boolean) => (
    <span className={styles.group} aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <span key={t} className={styles.item}>
          {t}
          <svg className={styles.star} viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
          </svg>
        </span>
      ))}
    </span>
  );
  return (
    <div className={`${styles.row} ${outline ? styles.outline : ""}`} data-marquee={dir} data-inview>
      <div className={styles.track}>
        {content(false)}
        {content(true)}
      </div>
    </div>
  );
}

export default function Marquee() {
  const items = portfolio.marquee;
  return (
    <section className={styles.marquee} aria-label="Areas I work in">
      <div className={styles.tilt}>
        <Row items={items} dir={1} />
        <Row items={[...items].reverse()} dir={-1} outline />
      </div>
    </section>
  );
}
