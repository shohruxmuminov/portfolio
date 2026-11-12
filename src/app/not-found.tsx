import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main"
      className="container"
      style={{ minHeight: "100svh", display: "grid", placeContent: "center", gap: "1.5rem", textAlign: "center" }}
    >
      <p className="eyebrow" style={{ justifySelf: "center" }}>
        404
      </p>
      <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
        This page <span className="serif">wandered off.</span>
      </h1>
      <p style={{ color: "var(--muted)" }}>The page you were looking for doesn’t exist.</p>
      <Link href="/" className="btn btn--ghost" style={{ justifySelf: "center" }}>
        Back to the homepage
      </Link>
    </main>
  );
}
