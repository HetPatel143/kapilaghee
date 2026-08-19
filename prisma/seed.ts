import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const db = new PrismaClient();

/**
 * Seed data for local development / demo purposes.
 *
 * Content rules followed here (see docs/requirements.md §2 and Prompt 2 §30):
 * - Only confirmed facts are seeded as published content.
 * - Where business content (story narrative, process steps) has not been confirmed,
 *   nothing is fabricated — those sections are either left empty (and the UI shows an
 *   honest "coming soon" state) or seeded with an explicit, honest placeholder statement.
 * - Contact fields the business hasn't supplied (phone/WhatsApp/email/social) are left null.
 *
 * This script plays the role Admin will play once the CMS (Phase 2 of implementation) exists —
 * it is not itself the CMS.
 */

async function main() {
  // ---------- Business Settings ----------
  const existingSettings = await db.businessSettings.findFirst();
  if (!existingSettings) {
    await db.businessSettings.create({
      data: {
        businessName: "Kapila Dairy Farm",
        address:
          "Block No. 197/A, Plot No. 71/3, Anjani Industrial Estate,\nVillage Masma, Taluka Olpad,\nSurat – 394540, Gujarat, India",
        phone: null,
        whatsapp: null,
        email: null,
        instagram: null,
        facebook: null,
        googleMapsUrl: null,
      },
    });
  }

  // ---------- Admin user ----------
  // Dev-only default credentials — see docs/admin-guide.md. Change ADMIN_EMAIL/ADMIN_PASSWORD
  // env vars before seeding a real deployment.
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@kapiladairyfarm.com";
  const existingAdmin = await db.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const adminPassword = process.env.ADMIN_PASSWORD ?? "KapilaAdmin@123";
    const passwordHash = await hashPassword(adminPassword);
    await db.adminUser.create({ data: { email: adminEmail, passwordHash } });
    console.log(`Seeded admin user: ${adminEmail} / ${adminPassword} (change this before going live)`);
  }

  // ---------- Media ----------
  // Auto-cropped to each product's bounding box and re-centered on a shared 900x1600
  // cream canvas (matching the page background) so all three gallery images render at a
  // consistent visual scale with no leftover background-box artifacts.
  const jarMedia = await db.media.upsert({
    where: { id: "media-ghee-jar" },
    update: { width: 900, height: 1600, fileSize: 160373 },
    create: {
      id: "media-ghee-jar",
      url: "/images/product/ghee-jar.jpeg",
      altText: "Kapila Dairy Farm Desi Cow Ghee glass jar on a plain background",
      width: 900,
      height: 1600,
      fileType: "image/jpeg",
      fileSize: 160373,
    },
  });

  const tin5kgMedia = await db.media.upsert({
    where: { id: "media-ghee-tin-5kg" },
    update: { width: 900, height: 1600, fileSize: 196066 },
    create: {
      id: "media-ghee-tin-5kg",
      url: "/images/product/ghee-tin-5kg.jpeg",
      altText: "Kapila Dairy Farm Desi Cow Ghee, 5 KG tin",
      width: 900,
      height: 1600,
      fileType: "image/jpeg",
      fileSize: 196066,
    },
  });

  const tin15kgMedia = await db.media.upsert({
    where: { id: "media-ghee-tin-15kg" },
    update: { width: 900, height: 1600, fileSize: 217085 },
    create: {
      id: "media-ghee-tin-15kg",
      url: "/images/product/ghee-tin-15kg.jpeg",
      altText: "Kapila Dairy Farm Desi Cow Ghee, 15 KG tin",
      width: 900,
      height: 1600,
      fileType: "image/jpeg",
      fileSize: 217085,
    },
  });

  const cowMedallionMedia = await db.media.upsert({
    where: { id: "media-cow-medallion" },
    update: {},
    create: {
      id: "media-cow-medallion",
      url: "/images/brand/cow-medallion.jpg",
      altText: "Kapila Dairy Farm wordmark with the Gir cow medallion, from the product label",
      width: 330,
      height: 245,
      fileType: "image/jpeg",
      fileSize: 30000,
    },
  });

  // ---------- Documents (real, verified — see docs/requirements.md §1) ----------
  const fssaiDoc = await db.document.upsert({
    where: { id: "doc-fssai-license" },
    update: {},
    create: {
      id: "doc-fssai-license",
      url: "/documents/fssai-license-form-c.jpg",
      label: "FSSAI License (Form C)",
      fileType: "image/jpeg",
      fileSize: 149964,
      issuedBy: "Food Safety and Standards Authority of India / Govt. of Gujarat",
      issuedDate: new Date("2024-09-12"),
    },
  });

  const labReportDoc = await db.document.upsert({
    where: { id: "doc-lab-report" },
    update: {},
    create: {
      id: "doc-lab-report",
      url: "/documents/lab-test-report-2025-03-27.jpg",
      label: "Ghee Purity Test Report",
      fileType: "image/jpeg",
      fileSize: 128461,
      issuedBy: "Pollucon Laboratories Pvt. Ltd.",
      issuedDate: new Date("2025-03-27"),
    },
  });

  // ---------- Product ----------
  const product = await db.product.upsert({
    where: { slug: "kapila-a2-gir-cow-ghee" },
    update: {},
    create: {
      name: "Kapila A2 Gir Cow Ghee",
      slug: "kapila-a2-gir-cow-ghee",
      description:
        "Kapila A2 Gir Cow Ghee is pure ghee made from Gir cow milk, with no added ingredients. It is prepared at our FSSAI-licensed facility in Surat, Gujarat, and tested for purity by an independent laboratory.",
      status: "active",
    },
  });

  const variantSeed: Array<{ id: string; size: number; unit: "kg"; sortOrder: number }> = [
    { id: "variant-1kg", size: 1, unit: "kg", sortOrder: 0 },
    { id: "variant-5kg", size: 5, unit: "kg", sortOrder: 1 },
    { id: "variant-15kg", size: 15, unit: "kg", sortOrder: 2 },
  ];

  for (const v of variantSeed) {
    await db.productVariant.upsert({
      where: { id: v.id },
      update: {},
      create: {
        id: v.id,
        productId: product.id,
        size: v.size,
        unit: v.unit,
        status: "active",
        sortOrder: v.sortOrder,
      },
    });
  }

  // jar photo has no pack-size text on it, so it stays "general" (variantId: null) and is
  // the fallback shown for the 1kg size, which has no dedicated photo of its own yet.
  const productMediaSeed = [
    { mediaId: jarMedia.id, sortOrder: 0, variantId: null },
    { mediaId: tin5kgMedia.id, sortOrder: 1, variantId: "variant-5kg" },
    { mediaId: tin15kgMedia.id, sortOrder: 2, variantId: "variant-15kg" },
  ];
  for (const pm of productMediaSeed) {
    await db.productMedia.upsert({
      where: { productId_mediaId: { productId: product.id, mediaId: pm.mediaId } },
      update: { variantId: pm.variantId },
      create: { productId: product.id, mediaId: pm.mediaId, sortOrder: pm.sortOrder, variantId: pm.variantId },
    });
  }

  // ---------- FAQs (grounded only in confirmed information) ----------
  const faqs = [
    {
      id: "faq-fssai",
      question: "Is Kapila Ghee FSSAI licensed?",
      answer:
        "Yes. Kapila Dairy Farm holds FSSAI License Number 10724022000260, issued 12 September 2024 and valid through 11 September 2027.",
      sortOrder: 0,
    },
    {
      id: "faq-lab-tested",
      question: "Is the ghee lab tested?",
      answer:
        "Yes. Our ghee has been tested by Pollucon Laboratories Pvt. Ltd. for purity parameters — including moisture, milk fat, and free fatty acid content — and the results are within FSSAI limits. See the Quality & Purity page for the full report.",
      sortOrder: 1,
    },
    {
      id: "faq-sizes",
      question: "What pack sizes are available?",
      answer: "Kapila A2 Gir Cow Ghee is currently available in 1 KG, 5 KG, and 15 KG packs.",
      sortOrder: 2,
    },
    {
      id: "faq-ingredients",
      question: "Does the ghee contain any added ingredients?",
      answer: "No. Kapila Ghee is pure ghee with no added ingredients.",
      sortOrder: 3,
    },
    {
      id: "faq-how-to-buy",
      question: "How can I purchase Kapila Ghee?",
      answer:
        "We're currently a brand and product showcase website. Reach out via our Contact page with your enquiry, and our team will help you from there.",
      sortOrder: 4,
    },
    {
      id: "faq-location",
      question: "Where is Kapila Dairy Farm located?",
      answer: "We're located in Village Masma, Taluka Olpad, Surat, Gujarat.",
      sortOrder: 5,
    },
  ];
  for (const f of faqs) {
    await db.fAQ.upsert({
      where: { id: f.id },
      update: {},
      create: { ...f, status: "active" },
    });
  }

  // ---------- Page Sections ----------

  // Home
  await upsertSection("home", "hero", {
    title: "Pure A2 Gir Cow Ghee",
    body: "Pure ghee. Nothing added.",
  });
  await upsertSection("home", "why-kapila-intro", {
    title: "Why Kapila",
    body: "A simple standard: pure Gir cow ghee, made with no added ingredients, backed by real documentation.",
  });
  await upsertSection("home", "why-point-gir-cow", {
    title: "Gir Cow Milk",
    body: "Our ghee is made from the milk of Gir cows, a heritage Indian breed.",
  });
  await upsertSection("home", "why-point-purity", {
    title: "Pure Ghee",
    body: "No added ingredients — just ghee, made simply.",
  });
  await upsertSection("home", "why-point-quality", {
    title: "Verified Quality",
    body: "FSSAI licensed and independently lab tested for purity.",
  });
  await upsertSection("home", "quality-teaser", {
    title: "Quality & Purity",
    body: "Transparent product information, backed by real documentation and food safety compliance.",
  });
  await upsertSection("home", "story-teaser", {
    title: "Our Story",
    body: "Kapila Dairy Farm is based in Surat, Gujarat. We're still writing the full story of how Kapila came to be — check back soon.",
  });
  await upsertSection("home", "everyday-use-intro", {
    title: "Everyday Use",
    body: "A spoonful of Kapila Ghee is a simple way to bring pure, traditional ghee into everyday cooking.",
  });
  await upsertSection("home", "benefits-intro", {
    title: "Why Ghee, Every Day",
    body: "A few reasons Kapila Ghee earns a place in Indian kitchens every day.",
  });
  await upsertSection("home", "benefits-point-1", {
    title: "Rich, Traditional Flavor",
    body: "Deepens the flavor of everyday dishes — rotis, dals, and rice — the way ghee has for generations in Indian kitchens.",
  });
  await upsertSection("home", "benefits-point-2", {
    title: "High Smoke Point",
    body: "Well suited to Indian cooking methods like tempering and frying, without breaking down at high heat.",
  });
  await upsertSection("home", "benefits-point-3", {
    title: "A Traditional Staple",
    body: "A calorie-dense, traditional fat that has been part of Indian diets for generations.",
  });
  await upsertSection("home", "benefits-point-4", {
    title: "Free From Additives",
    body: "Just ghee — nothing added, nothing artificial.",
  });
  await upsertSection("home", "final-cta", {
    title: "Have questions about Kapila Ghee?",
    body: "We'd be happy to help.",
  });

  // Story page
  await upsertSection("story", "story-intro", {
    title: "Our Story",
    body: "Kapila Dairy Farm is a Gir cow ghee business based in Village Masma, Taluka Olpad, Surat, Gujarat.",
  });
  await upsertSection("story", "story-placeholder", {
    title: "More to Come",
    body: "We're putting together the full story of Kapila Dairy Farm — our journey, our philosophy, and the people behind it. Check back soon.",
  });

  // Process page — confirmed by the business (2026-08-19) as an accurate description of
  // how Kapila Ghee is made, resolving the open item flagged in docs/requirements.md §2.
  await upsertSection("process", "process-step-1", {
    title: "Milk Collection",
    body: "Fresh Gir cow milk is collected as the starting point for our ghee.",
  });
  await upsertSection("process", "process-step-2", {
    title: "Curd Making",
    body: "The milk is slowly heated and left to set into curd.",
  });
  await upsertSection("process", "process-step-3", {
    title: "Hand Churning",
    body: "The curd is churned by hand with a traditional wooden bilona to separate the butter.",
  });
  await upsertSection("process", "process-step-4", {
    title: "Ghee Preparation",
    body: "The butter is slow-heated until it becomes the ghee you receive.",
  });

  // Quality page
  await upsertSection("quality", "quality-intro", {
    title: "Quality & Purity",
    body: "Kapila Dairy Farm is FSSAI licensed and has its ghee independently lab tested. Here is the actual documentation.",
  });
  await upsertSection(
    "quality",
    "quality-compliance",
    {
      title: "Food Safety & Compliance",
      body: "Kapila Dairy Farm holds FSSAI License Number 10724022000260 (State License), issued 12 September 2024 and valid through 11 September 2027.",
    },
    [fssaiDoc.id]
  );
  await upsertSection(
    "quality",
    "quality-testing",
    {
      title: "Product Testing",
      body: "Our ghee was tested by Pollucon Laboratories Pvt. Ltd. on 27 March 2025. Moisture, milk fat, and free fatty acid content were all within FSSAI's limits for ghee.",
    },
    [labReportDoc.id]
  );

  console.log("Seed complete.");
  console.log({ productId: product.id, cowMedallionMediaId: cowMedallionMedia.id });
}

const sectionSortCounters = new Map<string, number>();

async function upsertSection(
  page: "home" | "story" | "process" | "quality",
  key: string,
  data: { title: string; body: string },
  documentIds: string[] = []
) {
  const sortOrder = sectionSortCounters.get(page) ?? 0;
  sectionSortCounters.set(page, sortOrder + 1);

  const section = await db.pageSection.upsert({
    where: { page_key: { page, key } },
    update: { title: data.title, body: data.body, sortOrder },
    create: { page, key, title: data.title, body: data.body, status: "active", sortOrder },
  });

  for (let i = 0; i < documentIds.length; i++) {
    await db.pageSectionDocument.upsert({
      where: { pageSectionId_documentId: { pageSectionId: section.id, documentId: documentIds[i] } },
      update: {},
      create: { pageSectionId: section.id, documentId: documentIds[i], sortOrder: i },
    });
  }

  return section;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
