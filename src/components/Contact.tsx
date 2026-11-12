import { getContactLinks } from "@/config/site";
import { portfolio } from "@/data/portfolio";
import { ArrowUpRight } from "./Icons";
import styles from "./Contact.module.css";

export default function Contact() {
  const { contact, projects } = portfolio;
  const links = getContactLinks();
  const repoProject = projects.find((p) => p.links?.repo);

  return (
    <section id="contact" className={styles.contact} data-shape="7" aria-labelledby="contact-title">
      <div className={`container ${styles.inner}`}>
        <p className="eyebrow" data-fade>
          {contact.eyebrow}
        </p>
        <h2 id="contact-title" className="heading-xl" data-split="chars">
          Have an idea <span className="serif accent">worth building?</span>
        </h2>
        <p className={styles.body} data-fade>
          {contact.body}
        </p>

        {links.length ? (
          <ul className={styles.links} data-stagger>
            {links.map((l) => (
              <li key={l.href}>
                <span data-magnetic="0.3" style={{ display: "inline-block" }}>
                  <a
                    href={l.href}
                    className="btn btn--primary"
                    {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label}
                    <ArrowUpRight />
                  </a>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.placeholder} data-fade>
            <p>{contact.placeholder}</p>
            {repoProject?.links?.repo ? (
              <span data-magnetic="0.3" style={{ display: "inline-block" }}>
                <a
                  href={repoProject.links.repo}
                  className="btn btn--ghost"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Open"
                >
                  Browse the IELTS platform repo
                  <span className="visually-hidden"> on GitHub (opens in a new tab)</span>
                  <ArrowUpRight />
                </a>
              </span>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
