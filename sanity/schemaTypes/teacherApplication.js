export const teacherApplication = {
  name: "teacherApplication",
  title: "Teacher Applications",
  type: "document",
  fields: [
    {
      name: "jobPosting",
      title: "Applied For",
      type: "reference",
      to: [{ type: "jobPosting" }],
    },
    {
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "email",
      title: "Email Address",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "phone",
      title: "Phone Number",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "highestQualification",
      title: "Highest Qualification",
      type: "string",
      options: {
        list: [
          "NCE",
          "OND",
          "HND",
          "B.Ed",
          "B.Sc",
          "B.A",
          "PGDE",
          "M.Sc / M.A / M.Ed",
          "Ph.D",
          "Other",
        ],
      },
    },
    {
      name: "yearsOfExperience",
      title: "Years of Teaching Experience",
      type: "string",
      options: {
        list: [
          "Less than 1 year",
          "1 – 3 years",
          "3 – 5 years",
          "5 – 10 years",
          "10+ years",
        ],
        layout: "radio",
      },
    },
    {
      name: "coverLetter",
      title: "Cover Letter / Brief Statement",
      type: "text",
      rows: 5,
    },
    {
      name: "cvLink",
      title: "CV / Resume Link (Google Drive, Dropbox, etc.)",
      type: "url",
    },
    {
      name: "status",
      title: "Application Status",
      type: "string",
      options: {
        list: ["Pending", "Shortlisted", "Interviewed", "Hired", "Rejected"],
        layout: "radio",
      },
      initialValue: "Pending",
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],

  preview: {
    select: {
      title: "fullName",
      subtitle: "status",
      job: "jobPosting.subject",
    },
    prepare({ title, subtitle, job }) {
      const emoji =
        subtitle === "Hired"
          ? "✅"
          : subtitle === "Shortlisted"
          ? "⭐"
          : subtitle === "Rejected"
          ? "❌"
          : "📋";
      return {
        title: title || "Unknown Applicant",
        subtitle: `${emoji} ${subtitle ?? "Pending"} · ${job ?? "General Application"}`,
      };
    },
  },
};
