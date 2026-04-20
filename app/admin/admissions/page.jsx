// app/admin/admissions/page.jsx
import { client } from "@/lib/sanity";
import AdminClient from "./AdminClient";

async function getSubmissions() {
  const junior = await client.fetch(
    `*[_type == "juniorAdmission"] | order(submittedAt desc) {
      _id, _type, surname, otherNames, dateOfBirth, sex,
      nationality, state, homeTown, lga, religion, positionInFamily,
      foodAllergy, drugAllergy, exclusiveBreastfeeding, noWater,
      immunizationCompleted, anyReaction, levelOfSchooling,
      parentSurname, parentOtherNames, fatherSignature, fatherPhone,
      motherSignature, motherPhone, officeAddress, residentialAddress,
      parentsOccupation, contactPerson, medicalHistory, medicalPractitioner,
      paymentReference, paymentStatus, submittedAt, passportPhoto, examDate
    }`,
  );

  const senior = await client.fetch(
    `*[_type == "seniorAdmission"] | order(submittedAt desc) {
      _id, _type, surname, otherNames, dateOfBirth, sex,
      nationality, state, homeTown, lga, religion, language,
      schoolLastAttended, classCompleted, parentSurname, parentOtherNames,
      relationshipToChild, parentSignature, fatherPhone, motherPhone,
      officeAddress, contactAddress, residentialAddress,
      medicalHistory, medicalPractitioner,
      paymentReference, paymentStatus, submittedAt, passportPhoto
    }`,
  );

  return { junior, senior };
}

export default async function AdminPage() {
  const { junior, senior } = await getSubmissions();
  return <AdminClient junior={junior} senior={senior} />;
}
