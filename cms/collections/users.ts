import type { CollectionConfig } from "payload";
import { adminOnly, staffOnly } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  admin: { useAsTitle: "email", group: "Settings" },
  access: {
    read: staffOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin — manages users and everything else", value: "admin" },
        { label: "Editor — publishes content and reviews applications", value: "editor" },
      ],
    },
  ],
};
