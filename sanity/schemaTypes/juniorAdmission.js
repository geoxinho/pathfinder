export const juniorAdmission = {
  name: "juniorAdmission",
  title: "Junior Admissions",
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

    // Section A: Child's Biodata
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
      name: "positionInFamily",
      title: "Position in Family",
      type: "string",
    },
    {
      name: "foodAllergy",
      title: "Food Allergy",
      type: "string",
    },
    {
      name: "drugAllergy",
      title: "Drug Allergy",
      type: "string",
    },
    {
      name: "exclusiveBreastfeeding",
      title: "Exclusive Breastfeeding",
      type: "string",
      options: {
        list: ["Yes", "No"],
        layout: "radio",
      },
    },
    {
      name: "noWater",
      title: "No Water",
      type: "string",
      options: {
        list: ["Yes", "No"],
        layout: "radio",
      },
    },
    {
      name: "immunizationCompleted",
      title: "Has Immunization Been Completed",
      type: "string",
      options: {
        list: ["Yes", "No"],
        layout: "radio",
      },
    },
    {
      name: "anyReaction",
      title: "Any Reaction",
      type: "string",
      options: {
        list: ["Yes", "No"],
        layout: "radio",
      },
    },
    {
      name: "levelOfSchooling",
      title: "Level of Schooling",
      type: "string",
      options: {
        list: ["Creche", "Nursery", "Primary"],
        layout: "radio",
      },
    },

    // Section B: Parent/Guardian Biodata
    {
      name: "parentSurname",
      title: "Parent Surname",
      type: "string",
    },
    {
      name: "parentOtherNames",
      title: "Parent Other Names",
      type: "string",
    },
    {
      name: "fatherSignature",
      title: "Father's Name & Signature",
      type: "string",
    },
    {
      name: "fatherPhone",
      title: "Father's Phone Number",
      type: "string",
    },
    {
      name: "motherSignature",
      title: "Mother's Name & Signature",
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
      name: "residentialAddress",
      title: "Residential Address",
      type: "text",
      rows: 3,
    },
    {
      name: "parentsOccupation",
      title: "Parents Occupation",
      type: "string",
    },
    {
      name: "contactPerson",
      title: "Contact Person in Case of Urgent Information",
      type: "string",
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
  ],

  preview: {
    select: {
      title: "surname",
      subtitle: "otherNames",
    },
    prepare({ title, subtitle }) {
      return {
        title: `${title || "Unknown"} ${subtitle || ""}`,
        subtitle: "Junior Admission",
      };
    },
  },
};
