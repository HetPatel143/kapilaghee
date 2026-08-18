# Kapila Dairy Farm — Admin Guide

This guide explains how to manage the Kapila Dairy Farm website day-to-day. No coding
knowledge is required — everything here is done through the Admin dashboard in a browser.

## Logging In

1. Go to `/admin/login` on the website (e.g. `https://www.kapiladairyfarm.com/admin/login`).
2. Enter your admin email and password, then select **Sign In**.
3. If the details are wrong, you'll see "Invalid email or password" — double-check and try again.
4. You'll stay signed in for 7 days on that device. Select **Logout** (top right) to end your session immediately, e.g. on a shared computer.

> The very first admin account is created automatically when the site is set up (see the
> project's `.env` configuration). Ask your developer for your login details, and change
> your password by asking them to update it directly if you ever suspect it's been shared.

## The Dashboard

After logging in you'll land on the **Dashboard**, which shows:
- How many products, sizes, FAQs, and quality documents are currently live on the website.
- How many new enquiries have come in.
- Quick links to the most common tasks.

The left-hand menu (or the menu button on mobile) gets you to every other admin page.

## Managing Products

Go to **Products** in the menu.

- **To edit an existing product**: select **Edit** next to it. You can change its name,
  URL slug, description, and whether it's Active (shown on the site) or Inactive (hidden).
- **To add a new product**: select **Add Product**, fill in the basic details, then select
  **Create Product**. You'll be taken to its edit page to add images and sizes.
- **To take a product off the site without deleting it**: use the **Deactivate** link in the
  products table, or set its Status to Inactive on the edit page. This is safer than
  deleting — it can always be turned back on, and nothing else that references it breaks.

### Managing Pack Sizes (Variants)

On a product's edit page, under **Pack Sizes**:
- Each row shows a size (e.g. "5") and a unit (KG, G, ML, L). Change either and select
  **Save** on that row.
- Use the **↑ / ↓** buttons to reorder sizes — the order here is the order shown on the website.
- Use **Deactivate** to hide a size without deleting it (e.g. temporarily out of stock),
  or **Activate** to bring it back.
- Use **+ Add Size** at the bottom to add a brand-new size — for example a future 500 G or
  20 KG pack. This needs no help from a developer; it appears on the website automatically.

### Managing Product Images

Also on the product's edit page, under **Product Images**:
- The **first image is the primary photo** shown across the website (product cards, the
  homepage, etc). Use the **↑ / ↓** buttons under an image to move it earlier or later.
- Select **Upload** with a chosen file and optional alt text (a short description used for
  accessibility) to add a new image.
- Select **Remove** under an image to take it off the product. This asks for confirmation
  first since it can't be undone.
- Accepted files: JPG, PNG, or WebP, up to 5MB each.

## Managing Homepage / Story / Process / Quality Content

Go to **Content** in the menu, then choose the page you want to edit.

Each page is broken into sections (e.g. "Hero", "Why Kapila — Intro"). Select a section's
title bar to expand it, edit the Title/Description, and select **Save Section**. Sections
with an image also let you pick from previously uploaded images or upload a new one.

- **Homepage**: hero heading/description, the "Why Kapila" points, the quality/story
  teasers, the everyday-use blurb, and the final call-to-action text.
- **Our Story**: the main story text and the "more to come" placeholder note. The
  description field supports light formatting: `**bold**`, `*italic*`,
  `[link text](https://...)`, blank lines for new paragraphs, `"- "` at the start of a
  line for a bullet list, and `"## "` for a heading.
- **Our Process**: see below.
- **Quality & Purity**: the intro text, plus the Food Safety & Product Testing sections,
  each of which can have Documents attached (see Documents below).

### Adding Process Steps

Go to **Content → Our Process**.

- Fill in the **Add a Process Step** form (Title, Description, Status) and select **Add Step**.
- **Important**: new steps default to *Inactive*. The public Our Process page only shows
  *Active* steps — until then it shows an honest "being finalized" message rather than an
  empty or fabricated page. Only set a step to Active once you're sure it accurately
  describes how Kapila Ghee is actually made.
- Reorder steps with **↑ / ↓**, and use **Remove** to delete a step you added by mistake
  (this one is a permanent delete, unlike most other "deactivate" actions in the admin,
  since a process step has nothing else in the system referencing it).

## Managing FAQs

Go to **FAQs**.

- Select a question to expand it and edit the Question/Answer text, then **Save**.
- Use **+ Add a New FAQ** to add a new question and answer.
- Use **Deactivate** / **Activate** to hide or show a question without deleting it.
- Use **↑ / ↓** to change the order questions appear in on the public FAQ page.

## Managing the Media Library

Go to **Media**.

This is a shared library of images used across product listings and content sections.
- Upload an image with a Category (Product, Homepage, Story, Process, Quality, Other) and
  required Alt Text (a description used for accessibility and search).
- **Deactivate** hides an image from being offered when picking images elsewhere, without
  removing it.
- **Delete** permanently removes the file. If the image is still being used somewhere on
  the site, you'll be asked to remove it from that page/product first — this prevents
  broken images appearing on the live site.

## Managing Documents (Certificates, Lab Reports)

Go to **Documents**.

- Select **Upload a Document**, choose a PDF/JPG/PNG file, and fill in a clear Label (e.g.
  "FSSAI License" or "Lab Test Report — March 2025"), who issued it, and the date.
- Only upload documents the business has genuinely received — don't label something a
  "certificate" unless it actually is one.
- To show a document on the public Quality & Purity page, go to **Content → Quality &
  Purity**, open the relevant section (Food Safety & Compliance or Product Testing), and
  attach it there.
- **Deactivate** hides a document from the site without deleting it. **Delete** permanently
  removes it — you'll be asked to detach it from the Quality page first if it's in use.

## Updating Business Settings

Go to **Settings**.

- **Business Name** and **Address** are required — these always show on the site.
- **Phone, WhatsApp, Email, Instagram, Facebook, Google Maps URL** are all optional. Leave
  any of them blank and the corresponding button/link automatically disappears from the
  Contact page, footer, and "Enquire Now" flow — nothing fake is ever shown. Fill one in
  and it appears everywhere automatically, within a few seconds.
- For WhatsApp, enter the number with country code and no symbols, e.g. `919876543210`.

## Seeing Your Changes Live

Every save takes effect on the public website within a few seconds — you don't need to
"publish" separately, and nobody needs to restart anything. If you don't see a change,
wait a few seconds and refresh the public page.

## What You Cannot Change Here (By Design)

The admin controls **content** — text, images, sizes, FAQs, documents, and business
information. It does not control the website's **design** (colors, fonts, layout,
navigation) — that stays consistent and is only changed by a developer. This keeps the
site looking professional and "on brand" no matter how often content changes.

## Getting Help

If something looks broken, or a save isn't working as expected, take a screenshot of the
error message shown (a red banner near the button you pressed) and send it to your
developer — this is far more useful for fixing an issue than "it didn't work."
