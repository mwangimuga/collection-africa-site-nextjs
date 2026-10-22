import type { GlobalConfig } from "payload";
import { publicRead, staffOnly } from "../access";

/**
 * Company details that appear in the header, footer, contact page, structured
 * data and the AI assistant's knowledge. Change once here, changes everywhere.
 */
export const Settings: GlobalConfig = {
  slug: "settings",
  label: "Company details",
  admin: { group: "Settings" },
  access: { read: publicRead, update: staffOnly },
  fields: [
    { name: "phoneDisplay", type: "text", required: true, defaultValue: "+254 116 028 888" },
    {
      name: "phone",
      type: "text",
      required: true,
      defaultValue: "+254116028888",
      admin: { description: "Dialling format, no spaces. Used by the tap-to-call links." },
    },
    { name: "email", type: "email", required: true, defaultValue: "marketing@collectionafrica.co.ke" },
    { name: "careersEmail", type: "email", required: true, defaultValue: "hr@collectionafrica.co.ke" },
    { name: "hours", type: "text", required: true, defaultValue: "Monday to Friday, 8:00am – 5:00pm EAT" },
    { name: "linkedin", type: "text" },
    {
      name: "offices",
      type: "array",
      minRows: 1,
      fields: [
        { name: "city", type: "text", required: true },
        { name: "label", type: "text", required: true, admin: { description: "e.g. Head office, Western region" } },
        { name: "street", type: "textarea", required: true },
        { name: "locality", type: "text", required: true },
        { name: "phone", type: "text" },
        { name: "isHeadOffice", type: "checkbox" },
      ],
    },
  ],
};
