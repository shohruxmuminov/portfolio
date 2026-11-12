import { site } from "@/config/site";
import { portfolio } from "@/data/portfolio";
import Clock from "./Clock";
import { ArrowUp } from "./Icons";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.bio}>{portfolio.footerBio}</p>
        <div className={styles.meta}>
          <span>
            © {year} {site.name}
            {site.footerCredit ? ` · ${site.footerCredit}` : ""}
          </span>
          <Clock className={styles.clock} />
          <span data-magnetic="0.4" style={{ display: "inline-block" }}>
            <a href="#top" className={styles.top}>
              Back to top
              <ArrowUp />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
