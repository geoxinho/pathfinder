// app/news/[slug]/page.jsx
import { connectDB } from "@/lib/mongodb";
import News from "@/lib/models/News";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ─── Data ───────────────────────────────────────────────────────────────── */
async function getPostData(slug) {
  try {
    await connectDB();
    const post = await News.findOne({ slug }).lean();
    if (!post) return null;

    const related = await News.find({ slug: { $ne: slug } })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    return { ...post, related };
  } catch (err) {
    console.error("Fetch post error:", err);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const posts = await News.find({}, { slug: 1 }).lean();
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

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default async function NewsPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  if (!post) notFound();

  return (
    <main className="bg-white min-h-screen">
      {/* Cover */}
      <div className="relative h-[420px] bg-gradient-to-br from-primary-light to-primary overflow-hidden">
        {post.coverImage && (
          <>
            <img
              src={post.coverImage}
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
        <article className="prose prose-lg max-w-none">
          {post.body ? (
            <div 
              className="text-gray-700 text-[17px] leading-[1.85] news-content"
              dangerouslySetInnerHTML={{ __html: post.body }} 
            />
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
                  key={rel._id.toString()}
                  href={`/news/${rel.slug}`}
                  className="block group"
                >
                  <div className="premium-card p-0 overflow-hidden">
                    <div className="h-36 bg-gradient-to-br from-primary-light to-primary relative overflow-hidden">
                      {rel.coverImage && (
                        <img
                          src={rel.coverImage}
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

