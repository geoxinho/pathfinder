// app/news/[slug]/page.jsx
import { client, urlFor } from "@/lib/sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";

/* ─── Data ───────────────────────────────────────────────────────────────── */
async function getPost(slug) {
  try {
    return await client.fetch(
      `*[_type == "news" && slug.current == $slug][0] {
        _id, title, slug, body, coverImage, publishedAt, category, author,
        "related": *[_type == "news" && slug.current != $slug] | order(publishedAt desc)[0..2] {
          _id, title, slug, coverImage, publishedAt, category
        }
      }`,
      { slug },
    );
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const posts = await client.fetch(
      `*[_type == "news"] { "slug": slug.current }`,
    );
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const categoryColors = {
  Announcement: "bg-blue-50 text-blue-600",
  Achievement: "bg-emerald-50 text-emerald-600",
  Academic: "bg-purple-50 text-purple-600",
  Sports: "bg-amber-50 text-amber-600",
  Community: "bg-rose-50 text-rose-600",
};

/* ─── Portable Text ──────────────────────────────────────────────────────── */
const ptComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-gray-700 text-[17px] leading-[1.85] mb-6 ">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-poppins font-black text-primary text-2xl mt-10 mb-4 leading-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-poppins font-bold text-primary text-xl mt-8 mb-3 leading-snug">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gold/40 pl-5 my-8 text-gray-500 italic text-[17px] leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="pl-6 mb-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="pl-6 mb-6 space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-gray-700 text-base leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="text-gray-700 text-base leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-primary font-bold">{children}</strong>
    ),
    em: ({ children }) => <em className="text-gray-500">{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        className="text-primary underline font-semibold"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-9">
          <img
            src={urlFor(value).width(900).url()}
            alt={value.alt || ""}
            className="w-full rounded-2xl block"
          />
          {value.caption && (
            <figcaption className="text-center text-gray-400 text-xs mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function NewsPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const hasPortableText = Array.isArray(post.body);

  return (
    <main className="bg-white min-h-screen">
      {/* Cover */}
      <div className="relative h-[420px] bg-gradient-to-br from-primary-light to-primary overflow-hidden">
        {post.coverImage && (
          <>
            <img
              src={urlFor(post.coverImage).width(1400).height(500).url()}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
          </>
        )}

        {/* Back link */}
        <div className="absolute top-7 left-8 z-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-white/85 text-sm font-poppins font-semibold bg-white/12 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            ← Back to News
          </Link>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[820px] px-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.category && (
              <span
                className={`text-xs font-poppins font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${categoryColors[post.category] || "bg-gray-100 text-gray-600"}`}
              >
                {post.category}
              </span>
            )}
            <span className="text-white/65 text-sm">
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <h1 className="font-poppins font-black text-white text-3xl md:text-4xl leading-tight">
            {post.title}
          </h1>
          {post.author && (
            <p className="text-white/60 text-sm mt-3">
              By{" "}
              <span className="text-white/85 font-semibold">{post.author}</span>
            </p>
          )}
        </div>
      </div>

      {/* Article Body */}
      <div className="max-w-[820px] mx-auto px-8 py-14">
        <article>
          {hasPortableText ? (
            <PortableText value={post.body} components={ptComponents} />
          ) : typeof post.body === "string" ? (
            post.body.split("\n").map((para, i) =>
              para.trim() ? (
                <p
                  key={i}
                  className="text-gray-700 text-[17px] leading-[1.85] mb-6"
                >
                  {para}
                </p>
              ) : null,
            )
          ) : (
            <p className="text-gray-400 text-center py-10">
              No content available for this post.
            </p>
          )}
        </article>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/news"
            className="btn-outline inline-flex items-center gap-2 text-sm"
          >
            ← All News
          </Link>
          <p className="text-gray-400 text-xs">
            Published {formatDate(post.publishedAt)}
          </p>
        </div>
      </div>

      {/* Related Posts */}
      {post.related?.length > 0 && (
        <section className="bg-light-gray border-t border-gray-100 section-padding">
          <div className="container-custom">
            <h2 className="font-poppins font-bold text-primary text-xl mb-8">
              More from Pathfinder
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {post.related.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/news/${rel.slug?.current}`}
                  className="block group"
                >
                  <div className="premium-card p-0 overflow-hidden">
                    <div className="h-36 bg-gradient-to-br from-primary-light to-primary relative overflow-hidden">
                      {rel.coverImage && (
                        <img
                          src={urlFor(rel.coverImage)
                            .width(400)
                            .height(200)
                            .url()}
                          alt={rel.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-1.5">
                        {formatDate(rel.publishedAt)}
                      </p>
                      <p className="font-poppins font-bold text-primary text-sm leading-snug group-hover:text-gold transition-colors">
                        {rel.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
