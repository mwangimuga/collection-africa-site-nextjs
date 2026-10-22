import { cms } from "@/lib/cms";

/**
 * Stores a form submission in the CMS so nothing is lost if an email bounces,
 * and so enquiries and applications can be worked through a pipeline in the
 * admin panel rather than an inbox.
 *
 * Never throws. Email delivery is the primary channel; this is the backup, and
 * a CMS problem must not cost you the enquiry.
 */
export async function record(
  collection: "enquiries" | "applications",
  data: Record<string, unknown>,
): Promise<string | null> {
  try {
    const client = (await cms()) as unknown as {
      create?: (args: Record<string, unknown>) => Promise<{ id: string | number }>;
    } | null;

    if (!client?.create) return null;

    const doc = await client.create({ collection, data, overrideAccess: true });
    return String(doc.id);
  } catch (err) {
    console.error(`[record] could not save to ${collection}`, err);
    return null;
  }
}
