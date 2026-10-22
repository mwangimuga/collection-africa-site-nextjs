import type { CollectionConfig } from "payload";
import { noPublicRead } from "../access";

/** Website enquiries, stored so nothing is lost if an email bounces. */
export const Enquiries: CollectionConfig = {
  slug: "enquiries",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "organisation", "service", "status", "createdAt"],
    group: "Recruitment",
    description: "Enquiries from the contact and service pages.",
  },
  access: { read: noPublicRead, create: () => false, update: noPublicRead, delete: noPublicRead },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    { name: "organisation", type: "text" },
    { name: "service", type: "text" },
    { name: "message", type: "textarea", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Closed", value: "closed" },
      ],
    },
    { name: "notes", type: "textarea" },
  ],
};
