export const event = {
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Event Title",
      type: "string",
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    },
    {
      name: "eventDate",
      title: "Event Date",
      type: "datetime",
    },
    {
      name: "location",
      title: "Location",
      type: "string",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Academic",
          "Cultural",
          "Community",
          "Sports",
          "Commencement",
          "Technology",
          "Fundraising",
        ],
      },
    },
    {
      name: "featured",
      title: "Featured Event",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "image",
      title: "Event Image",
      type: "image",
      options: { hotspot: true },
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eventDate",
      media: "image",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toDateString() : "No date set",
      };
    },
  },
};
