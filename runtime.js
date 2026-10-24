window.CAFE_CONFIG = {
  "brand": "Juice Bar & Smoothie Café",
  "email": "juicebarandsmmothcafe@gmail.com",
  "phone": "765432198",
  "address": "Hiteck City",
  "hours": "9 to 11 o’clock",
  "mapEmbedUrl": "",
  "formEndpoint": "",
  "authLoginEndpoint": "",
  "authRegisterEndpoint": "",
  "demo": true,
  "tagline": "Fresh sips. Happy moments.",
  "socialLinks": {
    "instagram": "https://www.instagram.com/",
    "facebook": "https://www.facebook.com/",
    "x": "https://x.com/",
    "linkedin": "https://www.linkedin.com/",
    "youtube": "https://www.youtube.com/",
  },
  "newsletterEndpoint": "",
};
window.CAFE_PRODUCTS = [
  {
    "slug": "citrus-sunrise",
    "name": "Citrus Sunrise",
    "category": "Juices",
    "image": "orange.jpg",
    "alt": "Fresh orange juice being poured into a glass beside sliced oranges",
    "description":
      "A bright, refreshing squeeze of orange with a little lemon and a lively ginger finish.",
    "ingredients": ["Orange", "Lemon", "Ginger"],
    "price": 149,
    "size": "300 ml",
    "allergens":
      "No major allergens in the sample recipe; shared equipment may cause cross-contact.",
    "tags": ["Citrusy", "Refreshing", "Plant-based"],
  },
  {
    "slug": "green-glow",
    "name": "Green Glow",
    "category": "Smoothies",
    "image": "green.jpg",
    "alt": "Green smoothie in a tall glass with a black straw",
    "description":
      "A mellow blend of spinach, banana and apple with a squeeze of lime. Fresh, green and beautifully balanced.",
    "ingredients": ["Spinach", "Banana", "Apple", "Lime", "Water"],
    "price": 189,
    "size": "350 ml",
    "allergens":
      "No major allergens in the sample recipe; shared equipment may cause cross-contact.",
    "tags": ["Green blend", "Creamy", "Plant-based"],
  },
  {
    "slug": "berry-bliss",
    "name": "Berry Bliss",
    "category": "Smoothies",
    "image": "berry.jpg",
    "alt": "Creamy pink strawberry smoothie in a glass on a wooden table",
    "description":
      "Strawberries and banana meet creamy oat milk in a berry-bright blend made for a little everyday joy.",
    "ingredients": ["Strawberries", "Banana", "Oat milk"],
    "price": 199,
    "size": "350 ml",
    "allergens":
      "Oats; gluten status depends on the oat milk used. Shared equipment may cause cross-contact.",
    "tags": ["Berry bright", "Oat milk", "Creamy"],
  },
  {
    "slug": "mango-mood",
    "name": "Mango Mood",
    "category": "Smoothies",
    "image": "mango.jpg",
    "alt": "Golden mango smoothie topped with freshly sliced mango",
    "description":
      "Golden mango, banana and coconut milk blended into a sunny, tropical escape.",
    "ingredients": ["Mango", "Banana", "Coconut milk"],
    "price": 209,
    "size": "350 ml",
    "allergens": "Contains coconut. Shared equipment may cause cross-contact.",
    "tags": ["Tropical", "Coconut milk", "Plant-based"],
  },
  {
    "slug": "cocoa-cloud",
    "name": "Cocoa Cloud",
    "category": "Shakes",
    "image": "chocolate.jpg",
    "alt": "Chocolate milkshake with whipped cream and chocolate drizzle",
    "description":
      "A rich chocolate shake with milk, vanilla ice cream and a swirl of cocoa. A small moment of indulgence.",
    "ingredients": [
      "Milk",
      "Vanilla ice cream",
      "Cocoa",
      "Chocolate sauce",
      "Whipped cream",
    ],
    "price": 229,
    "size": "350 ml",
    "allergens":
      "Contains milk; chocolate sauce may contain soy. Shared equipment may cause cross-contact.",
    "tags": ["Chocolate", "Dairy", "Treat yourself"],
  },
  {
    "slug": "avocado-crunch",
    "name": "Avocado Crunch",
    "category": "Healthy Snacks",
    "image": "toast.jpg",
    "alt": "Avocado toast on a white plate with a green napkin",
    "description":
      "Creamy avocado on crisp sourdough, finished with lemon, chilli flakes and a pinch of sea salt.",
    "ingredients": ["Sourdough bread", "Avocado", "Lemon", "Chilli flakes", "Sea salt"],
    "price": 179,
    "size": "1 serving",
    "allergens": "Contains wheat and gluten. Shared equipment may cause cross-contact.",
    "tags": ["Savoury", "Sourdough", "Plant-based"],
  },
];
window.CAFE_DASHBOARD = {
  "label": "Illustrative admin data. Not connected to a live business.",
  "periods": {
    "7": {
      "revenue": 42860,
      "orders": 148,
      "customers": 96,
      "values": [4200, 6100, 4800, 7600, 5400, 6900, 7860],
    },
    "30": {
      "revenue": 168450,
      "orders": 586,
      "customers": 344,
      "values": [19000, 23500, 21000, 28600, 22400, 24950, 29000],
    },
    "90": {
      "revenue": 482900,
      "orders": 1698,
      "customers": 912,
      "values": [51000, 62000, 58000, 71000, 68000, 74900, 98000],
    },
  },
  "orders": [
    {
      "id": "DEMO-1048",
      "customer": "Demo customer 01",
      "product": "Berry Bliss",
      "total": 398,
      "status": "Pending",
    },
    {
      "id": "DEMO-1047",
      "customer": "Demo customer 02",
      "product": "Mango Mood",
      "total": 418,
      "status": "Completed",
    },
    {
      "id": "DEMO-1046",
      "customer": "Demo customer 03",
      "product": "Citrus Sunrise",
      "total": 149,
      "status": "Completed",
    },
    {
      "id": "DEMO-1045",
      "customer": "Demo customer 04",
      "product": "Cocoa Cloud",
      "total": 229,
      "status": "Pending",
    },
  ],
  "messages": [
    {
      "id": "demo-message-1",
      "sender": "Demo visitor 01",
      "subject": "Ingredient question",
      "body": "Does the sample Berry Bliss recipe contain oat milk?",
    },
    {
      "id": "demo-message-2",
      "sender": "Demo visitor 02",
      "subject": "Opening information",
      "body": "Where will the opening date be announced?",
    },
    {
      "id": "demo-message-3",
      "sender": "Demo visitor 03",
      "subject": "Group enquiry",
      "body": "I would like information about a small café gathering.",
    },
  ],
};

/* Coconut Cream: shared theme, navigation, preference and runtime helpers. */
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const config = window.CAFE_CONFIG || {};
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {}
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {}
    },
  };
  let toastTimer;
  function notify(text) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.hidden = true;
    }, 4500);
  }
  const menu = $(".menu-toggle"),
    nav = $("#main-nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-label", "Open navigation");
        menu.focus();
      }
    });
  }
  document.addEventListener("click", (event) => {
    $$(".nav-dropdown[open]").forEach((d) => {
      if (!d.contains(event.target)) d.open = false;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape")
      $$(".nav-dropdown[open]").forEach((d) => {
        d.open = false;
        $("summary", d).focus();
      });
  });
  const products = window.CAFE_PRODUCTS || [];
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };
  const save = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };
  const money = (value) => `₹${value.toLocaleString("en-IN")}`;
  const download = (filename, text) => {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  function getDraft() {
    const raw = read("juice-draft", []);
    return Array.isArray(raw)
      ? raw.filter(
          (item) =>
            bySlug.has(item.slug) &&
            Number.isInteger(item.quantity) &&
            item.quantity >= 1 &&
            item.quantity <= 20,
        )
      : [];
  }
  function getRatings() {
    const raw = read("juice-ratings", {});
    return Object.fromEntries(
      Object.entries(raw).filter(
        ([slug, value]) =>
          bySlug.has(slug) && Number.isInteger(value) && value >= 1 && value <= 5,
      ),
    );
  }
  const node = (tag, text, cls) => {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (cls) el.className = cls;
    return el;
  };

  window.Cafe = {
    $,
    $$,
    config,
    store,
    notify,
    products,
    bySlug,
    read,
    save,
    money,
    download,
    getDraft,
    getRatings,
    node,
  };
  const saved = $("#saved-offer");
  function showOffer() {
    if (saved)
      saved.textContent = store.get("juice-offer")
        ? `Saved sample code: ${store.get("juice-offer")}. This demonstration code is not yet redeemable.`
        : "No offer saved yet. Choose a sample code above.";
  }
  $$("[data-save-offer]").forEach((b) =>
    b.addEventListener("click", async () => {
      const code = b.dataset.saveOffer;
      store.set("juice-offer", code);
      showOffer();
      try {
        await navigator.clipboard.writeText(code);
        notify(`${code} saved and copied. Sample promotion only.`);
      } catch {
        notify(`${code} saved in this browser. Sample promotion only.`);
      }
    }),
  );
  $("#clear-offer")?.addEventListener("click", () => {
    store.remove("juice-offer");
    showOffer();
    notify("Saved offer cleared.");
  });
  showOffer();
  $("#clear-preferences")?.addEventListener("click", () => {
    [
      "juice-theme",
      "juice-direction",
      "juice-offer",
      "juice-draft",
      "juice-ratings",
      "cafe-admin-settings",
      "cafe-demo-messages",
    ].forEach((k) => store.remove(k));
    window.CafePreferences?.reset();
    notify("Saved preferences cleared.");
  });

  if (
    "IntersectionObserver" in window &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.classList.add("scroll-ready");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.04 },
    );
    $$(".reveal").forEach((el) => observer.observe(el));
  }
})();
