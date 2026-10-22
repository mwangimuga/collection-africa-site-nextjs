import Link from "next/link";
import { notFound } from "next/navigation";
import { type Block } from "@/content/insights";
import { getPost, getPosts } from "@/lib/cms";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { articleSchema, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { assetExists } from "@/lib/assets";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/insights/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.date,
  });
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "h2":
      return <h2 key={index}>{block.text}</h2>;
    case "h3":
      return <h3 key={index}>{block.text}</h3>;
    case "ul":
      return (
        <ul key={index}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote key={index}>
          <p>{block.text}</p>
        </blockquote>
      );
    default:
      return <p key={index}>{block.text}</p>;
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) notFound();

  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  const banner = `/assets/banners/banner-insights-${post.slug}.jpg`;
  const hasBanner = assetExists(banner);

  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: post.title,
            description: post.description,
            path: `/insights/${post.slug}`,
            date: post.date,
            author: post.author,
          }),
          breadcrumbSchema([
            { name: "Insights", path: "/insights" },
            { name: post.title, path: `/insights/${post.slug}` },
          ]),
        ]}
      />

      <section
        className={`page-head${hasBanner ? " page-head--photo" : ""}`}
        style={hasBanner ? ({ "--banner-image": `url(${banner})` } as React.CSSProperties) : undefined}
      >
        <div className="shell">
          <Breadcrumbs
            trail={[
              { name: "Insights", path: "/insights" },
              { name: post.title, path: `/insights/${post.slug}` },
            ]}
          />
          <h1>{post.title}</h1>
          <p className="meta">
            <span className="tag">{post.category}</span>{" "}
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>{" "}
            · {post.readingMinutes} minute read
          </p>
        </div>
      </section>

      <article className="band">
        <div className="shell">
          <div className="prose">{post.body.map(renderBlock)}</div>

          <div
            className="panel"
            style={{ marginTop: "3rem", maxWidth: "68ch", background: "var(--paper)" }}
          >
            <h3>Facing this in your own portfolio?</h3>
            <p>
              We&apos;ll give you an honest read on what&apos;s recoverable before you commit to anything.
            </p>
            <div className="btn-row">
              <Link href="/contact" className="btn btn--primary">Request a briefing</Link>
            </div>
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="band band--paper band--tight">
          <div className="shell">
            <h2 style={{ fontSize: "var(--step-2)" }}>More insights</h2>
            <div className="ledger">
              {more.map((p) => (
                <Link key={p.slug} href={`/insights/${p.slug}`} className="ledger-row">
                  <p className="ledger-row__name">{p.title}</p>
                  <span className="ledger-row__value">{p.readingMinutes} min</span>
                  <p className="ledger-row__note">{p.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
