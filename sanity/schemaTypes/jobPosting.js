export const jobPosting = {
  name: "jobPosting",
  title: "Teaching Job Postings",
  type: "document",
  fields: [
    {
      name: "subject",
      title: "Subject / Position",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          "Sciences",
          "Humanities",
          "Mathematics",
          "ICT & Technology",
          "Languages",
          "Social Sciences",
          "Arts & Creative",
          "Physical Education",
          "Administration & Support",
          "Other",
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "level",
      title: "School Level",
      type: "string",
      options: {
        list: ["Junior School (JSS)", "Senior School (SSS)", "Both"],
        layout: "radio",
      },
      initialValue: "Both",
    },
    {
      name: "type",
      title: "Employment Type",
      type: "string",
      options: {
        list: ["Full-Time", "Part-Time", "Contract"],
        layout: "radio",
      },
      initialValue: "Full-Time",
    },
    {
      name: "description",
      title: "Job Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "requirements",
      title: "Requirements",
      type: "text",
      rows: 4,
      description: "List qualifications and experience required (one per line)",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "deadline",
      title: "Application Deadline",
      type: "date",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "status",
      title: "Posting Status",
      type: "string",
      options: {
        list: ["Open", "Closed", "Filled"],
        layout: "radio",
      },
      initialValue: "Open",
    },
    {
      name: "postedAt",
      title: "Date Posted",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],

  preview: {
    select: {
      title: "subject",
      subtitle: "status",
      dept: "department",
    },
    prepare({ title, subtitle, dept }) {
      const emoji =
        subtitle === "Open" ? "🟢" : subtitle === "Filled" ? "🔵" : "🔴";
      return {
        title: title || "Untitled Position",
        subtitle: `${emoji} ${subtitle ?? ""} · ${dept ?? ""}`,
      };
    },
  },
};
