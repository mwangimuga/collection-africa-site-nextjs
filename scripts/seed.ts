/**
 * Pushes the typed content in /content into Payload.
 *
 * Run once after creating the database:  npm run cms:seed
 *
 * Safe to re-run: it skips anything whose slug already exists, so it will
 * never overwrite something an editor has changed in the admin panel.
 */
import "dotenv/config";
import { getPayload } from "payload";
import config from "../payload.config";

import { services } from "../content/services";
import { posts } from "../content/insights";
import { jobs } from "../content/jobs";
import { leadership } from "../content/team";
import { offices, site } from "../content/site";

const list = (values: string[]) => values.map((text) => ({ text }));

async function main() {
  const payload = await getPayload({ config });

  const firstUser = await payload.find({ collection: "users", limit: 1 });
  if (firstUser.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!email || !password) {
      console.log(
        "No admin user yet. Either set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD, " +
          "or just open http://localhost:3000/admin and create the first account there.",
      );
    } else {
      await payload.create({
        collection: "users",
        data: { email, password, name: "Administrator", role: "admin" },
      });
      console.log(`Created admin user ${email}`);
    }
  }

  for (const [index, service] of services.entries()) {
    const existing = await payload.find({
      collection: "services",
      where: { slug: { equals: service.slug } },
      limit: 1,
    });
    if (existing.totalDocs) {
      console.log(`· service "${service.slug}" already exists, skipped`);
      continue;
    }

    await payload.create({
      collection: "services",
      data: {
        ...service,
        order: (index + 1) * 10,
        intro: list(service.intro),
        outcomes: list(service.outcomes),
        keywords: list(service.keywords),
        _status: "published",
      },
    });
    console.log(`✓ service "${service.slug}"`);
  }

  for (const post of posts) {
    const existing = await payload.find({
      collection: "posts",
      where: { slug: { equals: post.slug } },
      limit: 1,
    });
    if (existing.totalDocs) continue;

    await payload.create({
      collection: "posts",
      data: {
        ...post,
        keywords: list(post.keywords),
        body: post.body.map((block) =>
          block.type === "ul"
            ? { blockType: "ul", items: list(block.items) }
            : { blockType: block.type, text: block.text },
        ),
        _status: "published",
      },
    });
    console.log(`✓ insight "${post.slug}"`);
  }

  for (const job of jobs) {
    const existing = await payload.find({
      collection: "jobs",
      where: { slug: { equals: job.slug } },
      limit: 1,
    });
    if (existing.totalDocs) continue;

    await payload.create({
      collection: "jobs",
      data: {
        ...job,
        responsibilities: list(job.responsibilities),
        requirements: list(job.requirements),
        _status: "published",
      },
    });
    console.log(`✓ vacancy "${job.slug}"`);
  }

  for (const [index, member] of leadership.entries()) {
    const existing = await payload.find({
      collection: "team",
      where: { name: { equals: member.name } },
      limit: 1,
    });
    if (existing.totalDocs) continue;

    await payload.create({
      collection: "team",
      data: { ...member, order: (index + 1) * 10 },
    });
    console.log(`✓ team member "${member.name}"`);
  }

  await payload.updateGlobal({
    slug: "settings",
    data: {
      phone: site.phone,
      phoneDisplay: site.phoneDisplay,
      email: site.email,
      careersEmail: site.careersEmail,
      hours: site.hours,
      linkedin: site.linkedin,
      offices: offices.map((o) => ({
        city: o.city,
        label: o.label,
        street: o.street,
        locality: o.locality,
        phone: o.phone,
        isHeadOffice: Boolean(o.isHeadOffice),
      })),
    },
  });
  console.log("✓ company details");

  console.log("\nSeed complete. Open http://localhost:3000/admin");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
