export const seniorAdmission = {
  name: "seniorAdmission",
  title: "Senior Admissions",
  type: "document",
  fields: [
    // Payment info
    {
      name: "paymentReference",
      title: "Payment Reference",
      type: "string",
    },
    {
      name: "paymentStatus",
      title: "Payment Status",
      type: "string",
      initialValue: "paid",
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
    },

    // Child Biodata
    {
      name: "surname",
      title: "Surname",
      type: "string",
    },
    {
      name: "otherNames",
      title: "Other Names",
      type: "string",
    },
    {
      name: "dateOfBirth",
      title: "Date of Birth",
      type: "date",
    },
    {
      name: "sex",
      title: "Sex",
      type: "string",
      options: {
        list: ["Male", "Female"],
        layout: "radio",
      },
    },
    {
      name: "nationality",
      title: "Nationality",
      type: "string",
    },
    {
      name: "state",
      title: "State",
      type: "string",
    },
    {
      name: "homeTown",
      title: "Home Town",
      type: "string",
    },
    {
      name: "lga",
      title: "LGA",
      type: "string",
    },
    {
      name: "religion",
      title: "Religion",
      type: "string",
    },
    {
      name: "language",
      title: "Language",
      type: "string",
    },
    {
      name: "schoolLastAttended",
      title: "School Last Attended",
      type: "string",
    },
    {
      name: "classCompleted",
      title: "Class Completed",
      type: "string",
    },

    // Parent/Guardian Info
    {
      name: "parentSurname",
      title: "Surname of Parent/Guardian",
      type: "string",
    },
    {
      name: "parentOtherNames",
      title: "Parent Other Names",
      type: "string",
    },
    {
      name: "relationshipToChild",
      title: "Relationship to Child",
      type: "string",
    },
    {
      name: "parentSignature",
      title: "Parent Signature",
      type: "string",
    },
    {
      name: "fatherPhone",
      title: "Father's Phone Number",
      type: "string",
    },
    {
      name: "motherPhone",
      title: "Mother's Phone Number",
      type: "string",
    },
    {
      name: "officeAddress",
      title: "Office Address",
      type: "text",
      rows: 2,
    },
    {
      name: "contactAddress",
      title: "Contact Address",
      type: "text",
      rows: 2,
    },
    {
      name: "residentialAddress",
      title: "Detailed Residential Address",
      type: "text",
      rows: 3,
    },
    {
      name: "medicalHistory",
      title: "Medical History",
      type: "text",
      rows: 3,
    },
    {
      name: "medicalPractitioner",
      title: "Name & Address of Medical Practitioner",
      type: "text",
      rows: 2,
    },
    // Exam date preference
    {
      name: "examDate",
      title: "Preferred Examination Date",
      type: "string",
      options: {
        list: ["9 May 2026", "11 July 2026", "8 August 2026"],
        layout: "radio",
      },
    },
    // Passport photograph (base64)
    {
      name: "passportPhoto",
      title: "Passport Photograph (base64)",
      type: "text",
    },
  ],

  preview: {
    select: {
      title: "surname",
      subtitle: "otherNames",
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title || "Unknown"} ${subtitle || ""}`,
        subtitle: "Senior Admission",
      };
    },
  },
};
