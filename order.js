/* Standalone Order Now: reference-style form, local enquiry list, accessible review and download. */
import "./runtime.js";

const { products, bySlug, getDraft, save, money, download, node } = window.Cafe;
const $ = (selector) => document.querySelector(selector);
const form = $("#fresh-order-form");
const category = $("#order-category");
const product = $("#order-product");
const quantity = $("#order-quantity");
const dialog = $("#order-review");
let reviewed = null;
let savedReview = false;

function renderProducts(preferred) {
  product.replaceChildren();
  products
    .filter((item) => item.category === category.value)
    .forEach((item) => {
      const option = node("option", `${item.name} — ${money(item.price)}`);
      option.value = item.slug;
      product.append(option);
    });
  if (bySlug.has(preferred) && bySlug.get(preferred).category === category.value)
    product.value = preferred;
  updateSelection();
}
function updateSelection() {
  const item = bySlug.get(product.value);
  const count = Number(quantity.value);
  const validCount = Number.isInteger(count) && count >= 1 && count <= 20;
  $("#selected-name").textContent = item?.name || "Choose a favourite";
  $("#selected-quantity").textContent = validCount
    ? `${count} ${count === 1 ? "item" : "items"}`
    : "Choose 1–20 items";
  $("#selected-total").textContent =
    item && validCount ? money(item.price * count) : "—";
  $("#quantity-less").disabled = validCount && count <= 1;
  $("#quantity-more").disabled = validCount && count >= 20;
}
function setError(field, message) {
  const error = document.getElementById(
    field.id === "order-quantity" ? "quantity-error" : `${field.id}-error`,
  );
  field.setAttribute("aria-invalid", String(!!message));
  field.setCustomValidity(message);
  if (error) {
    error.textContent = message;
    error.hidden = !message;
  }
}
const requiredFields = [
  quantity,
  $("#order-name"),
  $("#order-phone"),
  $("#order-pickup"),
];
requiredFields.forEach((field) =>
  field.addEventListener("input", () => setError(field, "")),
);
category.addEventListener("change", () => renderProducts());
product.addEventListener("change", updateSelection);
quantity.addEventListener("input", updateSelection);
for (const [selector, delta] of [
  ["#quantity-less", -1],
  ["#quantity-more", 1],
]) {
  $(selector).addEventListener("click", () => {
    const current = Number(quantity.value);
    quantity.value = String(
      Math.max(1, Math.min(20, (Number.isInteger(current) ? current : 1) + delta)),
    );
    setError(quantity, "");
    updateSelection();
  });
}
function localDateTime(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
$("#order-pickup").min = localDateTime(new Date());
function validate() {
  requiredFields.forEach((field) => setError(field, ""));
  const count = Number(quantity.value);
  const phone = $("#order-phone").value.trim();
  if (!Number.isInteger(count) || count < 1 || count > 20)
    setError(quantity, "Choose a whole number from 1 to 20.");
  if ($("#order-name").value.trim().length < 2)
    setError($("#order-name"), "Enter your full name using at least two characters.");
  const digits = phone.replace(/\D/g, "");
  if (!/^\+?[\d\s()-]+$/.test(phone) || digits.length < 7 || digits.length > 15)
    setError($("#order-phone"), "Enter a phone number with 7–15 digits.");
  const pickup = $("#order-pickup");
  if (
    !pickup.value ||
    !Number.isFinite(new Date(pickup.value).getTime()) ||
    new Date(pickup.value).getTime() <= Date.now()
  )
    setError(pickup, "Choose a pickup time in the future.");
  const invalid = requiredFields.find((field) => !field.validity.valid);
  if (invalid) {
    invalid.focus();
    return false;
  }
  return bySlug.has(product.value);
}
function row(label, value) {
  const element = node("div", undefined, "review-row");
  element.append(node("dt", label), node("dd", value));
  return element;
}
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validate()) return;
  const item = bySlug.get(product.value);
  reviewed = {
    slug: item.slug,
    quantity: Number(quantity.value),
    name: $("#order-name").value.trim(),
    phone: $("#order-phone").value.trim(),
    pickup: $("#order-pickup").value,
    notes: $("#order-notes").value.trim(),
  };
  savedReview = false;
  $("#save-reviewed").disabled = false;
  $("#review-result").textContent = "";
  const details = node("dl");
  details.append(
    row("Favourite", item.name),
    row("Quantity", String(reviewed.quantity)),
    row("Subtotal", `${money(item.price * reviewed.quantity)} · sample price`),
    row("Full name", reviewed.name),
    row("Phone", reviewed.phone),
    row("Pickup", new Date(reviewed.pickup).toLocaleString()),
    row("Notes", reviewed.notes || "No notes"),
  );
  $("#review-details").replaceChildren(details);
  dialog.showModal();
});
$("#close-review").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => $(".order-review-button").focus());
$("#save-reviewed").addEventListener("click", () => {
  if (!reviewed || savedReview) return;
  const draft = getDraft();
  const existing = draft.find((item) => item.slug === reviewed.slug);
  if (existing) existing.quantity = Math.min(20, existing.quantity + reviewed.quantity);
  else draft.push({ slug: reviewed.slug, quantity: reviewed.quantity });
  save("juice-draft", draft);
  savedReview = true;
  $("#save-reviewed").disabled = true;
  const message = `${bySlug.get(reviewed.slug).name} added to your local enquiry list (maximum 20 per product). Nothing has been sent. Contact details were not saved.`;
  $("#review-result").textContent = message;
  $("#order-result").textContent = message;
  renderDraft();
});
$("#download-reviewed").addEventListener("click", () => {
  if (!reviewed) return;
  const item = bySlug.get(reviewed.slug);
  download(
    "juice-bar-order-enquiry.txt",
    [
      window.CAFE_CONFIG.brand,
      "LOCAL ENQUIRY DRAFT — NOT SENT OR CONFIRMED",
      `${item.name}: ${reviewed.quantity} × ${money(item.price)} = ${money(item.price * reviewed.quantity)}`,
      `Full name: ${reviewed.name}`,
      `Phone: ${reviewed.phone}`,
      `Preferred pickup: ${new Date(reviewed.pickup).toLocaleString()}`,
      `Notes: ${reviewed.notes || "None"}`,
      "Confirm prices, allergens, pickup time and availability directly with the café.",
    ].join("\n\n"),
  );
  $("#review-result").textContent =
    "Enquiry downloaded. Nothing has been sent or confirmed.";
});
function renderDraft() {
  const draft = getDraft();
  const list = $("#saved-order-list");
  list.replaceChildren();
  if (!draft.length)
    list.append(
      node(
        "p",
        "Your enquiry list is empty. Review a favourite to add it.",
        "order-help",
      ),
    );
  draft.forEach((item) => {
    const info = bySlug.get(item.slug);
    const line = node("div", undefined, "saved-item");
    const text = node("div");
    text.append(
      node("strong", info.name),
      node(
        "p",
        `${item.quantity} × ${money(info.price)} · ${money(info.price * item.quantity)}`,
      ),
    );
    const remove = node("button", "Remove", "btn btn-outline");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${info.name} from enquiry`);
    remove.addEventListener("click", () => {
      save(
        "juice-draft",
        getDraft().filter((entry) => entry.slug !== item.slug),
      );
      renderDraft();
    });
    line.append(text, remove);
    list.append(line);
  });
  const count = draft.reduce((sum, item) => sum + item.quantity, 0);
  $("#saved-count").textContent = `${count} ${count === 1 ? "item" : "items"}`;
  $("#saved-order-total").textContent =
    `Sample subtotal: ${money(draft.reduce((sum, item) => sum + bySlug.get(item.slug).price * item.quantity, 0))}`;
  $("#download-saved").disabled = !draft.length;
  $("#clear-saved").disabled = !draft.length;
}
$("#clear-saved").addEventListener("click", () => {
  save("juice-draft", []);
  renderDraft();
  $("#order-result").textContent = "Local enquiry list cleared.";
});
$("#download-saved").addEventListener("click", () => {
  const draft = getDraft();
  if (!draft.length) return;
  download(
    "juice-bar-order-enquiry.txt",
    [
      window.CAFE_CONFIG.brand,
      "LOCAL ENQUIRY DRAFT — NOT SENT OR CONFIRMED",
      ...draft.map(
        (item) =>
          `${bySlug.get(item.slug).name}: ${item.quantity} × ${money(bySlug.get(item.slug).price)} = ${money(bySlug.get(item.slug).price * item.quantity)}`,
      ),
      $("#saved-order-total").textContent,
      "Confirm availability, prices, allergens and fulfilment directly with the café.",
    ].join("\n\n"),
  );
  $("#order-result").textContent = "Enquiry list downloaded. Nothing has been sent.";
});
const requested = new URLSearchParams(location.search).get("product");
if (bySlug.has(requested)) category.value = bySlug.get(requested).category;
renderProducts(requested);
renderDraft();
window.addEventListener("storage", (event) => {
  if (event.key === "juice-draft") renderDraft();
});
