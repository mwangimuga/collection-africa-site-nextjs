import Link from "next/link";

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {trail.map((t, i) => (
        <span key={t.path} style={{ display: "contents" }}>
          <span aria-hidden="true">/</span>
          {i === trail.length - 1 ? (
            <span aria-current="page">{t.name}</span>
          ) : (
            <Link href={t.path}>{t.name}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
