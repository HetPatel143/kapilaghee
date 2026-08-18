import { test } from "node:test";
import assert from "node:assert/strict";
import { getContactActions } from "../src/lib/contact";

const baseSettings = {
  phone: null as string | null,
  whatsapp: null as string | null,
  email: null as string | null,
  googleMapsUrl: null as string | null,
};

test("no contact actions when nothing is configured", () => {
  assert.deepEqual(getContactActions(baseSettings), []);
});

test("no contact actions for a null settings row", () => {
  assert.deepEqual(getContactActions(null), []);
});

test("only phone appears when only phone is configured", () => {
  const actions = getContactActions({ ...baseSettings, phone: "+91 98765 43210" });
  assert.equal(actions.length, 1);
  assert.equal(actions[0].kind, "phone");
  assert.equal(actions[0].href, "tel:+919876543210");
});

test("WhatsApp link strips non-digits and has no '+' (wa.me expects raw digits)", () => {
  const actions = getContactActions({ ...baseSettings, whatsapp: "+91 98765-43210" });
  assert.equal(actions[0].href, "https://wa.me/919876543210");
});

test("all four actions appear when everything is configured, in a stable order", () => {
  const actions = getContactActions({
    phone: "9876543210",
    whatsapp: "919876543210",
    email: "hello@kapiladairyfarm.com",
    googleMapsUrl: "https://maps.google.com/?q=Kapila+Dairy+Farm",
  });
  assert.deepEqual(actions.map((a) => a.kind), ["phone", "whatsapp", "email", "maps"]);
});

test("removing a field removes only that action", () => {
  const withPhone = getContactActions({ ...baseSettings, phone: "9876543210", email: "a@b.com" });
  assert.deepEqual(withPhone.map((a) => a.kind), ["phone", "email"]);

  const withoutPhone = getContactActions({ ...baseSettings, email: "a@b.com" });
  assert.deepEqual(withoutPhone.map((a) => a.kind), ["email"]);
});
