// sanity/schemaTypes/gallery.js
export const gallery = {
  name: "gallery",
  title: "Gallery",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Album Title",
      type: "string",
    },
    {
      name: "subtitle",
      title: "Subtitle / Subheader",
      type: "string",
      description: "A short description of this album e.g. 'Sports Day 2026'",
    },
    {
      name: "publishedAt",
      title: "Date Published",
      type: "date",
      options: {
        dateFormat: "MMMM DD, YYYY",
      },
    },
    {
      name: "images",
      title: "Images",
      description:
        "Click 'Add item' then upload. To add multiple images quickly, add one, then click 'Add item' again repeatedly.",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            storeOriginalFilename: true,
          },
        },
      ],
      options: {
        layout: "grid",
      },
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "images.0",
    },
  },
};
