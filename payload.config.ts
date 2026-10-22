import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { Users } from "./cms/collections/users";
import { Media } from "./cms/collections/media";
import { Services } from "./cms/collections/services";
import { Posts } from "./cms/collections/posts";
import { Jobs } from "./cms/collections/jobs";
import { Applications } from "./cms/collections/applications";
import { Enquiries } from "./cms/collections/enquiries";
import { Team } from "./cms/collections/team";
import { Settings } from "./cms/globals/settings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: " — Collection Africa",
    },
  },
  // Kept off /api so the site's own form and AI routes stay where they are.
  routes: { admin: "/admin", api: "/api/cms" },
  collections: [Services, Posts, Jobs, Team, Media, Applications, Enquiries, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  // A real secret is required in production; this default only exists so the
  // app still compiles for a developer who has not set up the database yet.
  secret: process.env.PAYLOAD_SECRET || "development-only-secret-change-me",
  typescript: { outputFile: path.resolve(dirname, "cms/payload-types.ts") },
  db: postgresAdapter({
    // No connection is opened until something actually queries the database,
    // so this is inert when DATABASE_URI is unset.
    pool: { connectionString: process.env.DATABASE_URI ?? "postgres://localhost:5432/unset" },
  }),
  // The site itself is served from the same origin, so nothing else needs listing.
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
  upload: { limits: { fileSize: 8 * 1024 * 1024 } },
});
