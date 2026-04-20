export const news = {
  name: "news",
  title: "News & Announcements",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    {
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    },
    { name: "body", title: "Body", type: "text" },
    { name: "publishedAt", title: "Published At", type: "datetime" },
  ],
};
