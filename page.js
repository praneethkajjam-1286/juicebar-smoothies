/* Shared entry used by all standard pages. */
import "./runtime.js";

{
  /* Editorial homepage: real catalogue statistics, with reduced-motion support. */
  (() => {
    "use strict";
    if (!document.body.classList.contains("page-home2")) return;
    const { products } = window.Cafe;
    const values = {
      products: products.length,
      categories: new Set(products.map((p) => p.category)).size,
      homes: 2,
    };
    document.querySelectorAll("[data-catalog-stat]").forEach((el) => {
      const target = values[el.dataset.catalogStat] || 0;
      if (
        matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)
      ) {
        el.textContent = String(target);
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        let start;
        const frame = (time) => {
          start ??= time;
          const progress = Math.min((time - start) / 350, 1);
          el.textContent = String(Math.round(target * progress));
          if (progress < 1) requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
      observer.observe(el);
    });
  })();
}

{
  /* Menu/category search and personal product ratings. */
  (() => {
    "use strict";
    const {
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
    } = window.Cafe;
    if (document.body.classList.contains("page-services")) {
      const filters = $("[data-filters]");
      if (filters) {
        let category = new URLSearchParams(location.search).get("category") || "All";
        const buttons = $$("[data-filter]", filters);
        if (!buttons.some((b) => b.dataset.filter === category)) category = "All";
        const search = $("[data-search]", filters);
        const entries = $$("article[data-category]");
        function apply() {
          const query = (search?.value || "").trim().toLowerCase();
          let count = 0;
          entries.forEach((el) => {
            el.hidden =
              !(category === "All" || el.dataset.category === category) ||
              !el.textContent.toLowerCase().includes(query);
            if (!el.hidden) count++;
          });
          buttons.forEach((b) =>
            b.setAttribute("aria-pressed", String(b.dataset.filter === category)),
          );
          const empty = $("[data-empty]");
          if (empty) empty.hidden = count > 0;
          const status = $("[data-filter-status]");
          if (status)
            status.textContent = `${count} ${count === 1 ? "result" : "results"} shown`;
        }
        buttons.forEach((b) =>
          b.addEventListener("click", () => {
            category = b.dataset.filter;
            apply();
          }),
        );
        search?.addEventListener("input", apply);
        apply();
      }
    }
    let selectedProduct = "",
      ratingOpener = null;
    const dialog = $("#rating-dialog");
    function renderRatings() {
      const ratings = getRatings();
      $$("[data-rating-label]").forEach((label) => {
        label.textContent = ratings[label.dataset.ratingLabel]
          ? `Your rating: ${ratings[label.dataset.ratingLabel]}/5`
          : "Rate this blend";
      });
      $$("[data-rating-count]").forEach((el) => {
        el.textContent = String(Object.keys(ratings).length);
      });
      const list = $("#dashboard-ratings");
      if (list) {
        list.replaceChildren();
        if (!Object.keys(ratings).length)
          list.append(
            node("p", "No personal ratings yet. Use “Rate this blend” on a menu card."),
          );
        Object.entries(ratings).forEach(([slug, value]) => {
          const card = node("article", undefined, "number-card");
          card.append(
            node("h3", bySlug.get(slug).name),
            node("p", `Your personal rating: ${value}/5`),
          );
          const a = node("a", "View this blend", "text-link");
          a.href = `${slug}.html`;
          card.append(a);
          list.append(card);
        });
      }
    }
    $$("[data-rate]").forEach((button) =>
      button.addEventListener("click", () => {
        selectedProduct = button.dataset.rate;
        ratingOpener = button;
        if (!dialog || !bySlug.has(selectedProduct)) return;
        $("#rating-title").textContent = `Rate ${bySlug.get(selectedProduct).name}`;
        $("#rating-result").textContent = "";
        $$("[data-rating-value]", dialog).forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(Number(b.dataset.ratingValue) === getRatings()[selectedProduct]),
          ),
        );
        dialog.showModal();
      }),
    );
    $$("[data-rating-value]").forEach((button) =>
      button.addEventListener("click", () => {
        if (!bySlug.has(selectedProduct)) return;
        const value = Number(button.dataset.ratingValue),
          ratings = getRatings();
        ratings[selectedProduct] = value;
        save("juice-ratings", ratings);
        renderRatings();
        $$("[data-rating-value]", dialog).forEach((b) =>
          b.setAttribute(
            "aria-pressed",
            String(Number(b.dataset.ratingValue) === value),
          ),
        );
        $("#rating-result").textContent =
          `Your ${value}/5 rating is saved in this browser. It is not a public review.`;
      }),
    );
    dialog?.addEventListener("close", () => ratingOpener?.focus());
    renderRatings();
    $$("[data-dashboard-offer]").forEach((el) => {
      try {
        el.textContent = localStorage.getItem("juice-offer") || "None saved";
      } catch {
        el.textContent = "None saved";
      }
    });
  })();
}

{
  /* Searchable and filterable journal. */
  (() => {
    "use strict";
    const {
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
    } = window.Cafe;
    if (document.body.classList.contains("page-blog")) {
      const filters = $("[data-filters]");
      if (filters) {
        let category = new URLSearchParams(location.search).get("category") || "All";
        const buttons = $$("[data-filter]", filters);
        if (!buttons.some((b) => b.dataset.filter === category)) category = "All";
        const search = $("[data-search]", filters);
        const entries = $$("article[data-category]");
        function apply() {
          const query = search.value.trim().toLowerCase();
          let count = 0;
          entries.forEach((el) => {
            el.hidden =
              !(category === "All" || el.dataset.category === category) ||
              !el.textContent.toLowerCase().includes(query);
            if (!el.hidden) count++;
          });
          buttons.forEach((b) =>
            b.setAttribute("aria-pressed", String(b.dataset.filter === category)),
          );
          const empty = $("[data-empty]");
          if (empty) empty.hidden = count > 0;
          const status = $("[data-filter-status]");
          if (status)
            status.textContent = `${count} ${count === 1 ? "result" : "results"} shown`;
        }
        buttons.forEach((b) =>
          b.addEventListener("click", () => {
            category = b.dataset.filter;
            apply();
          }),
        );
        search.addEventListener("input", apply);
        apply();
      }
    }
  })();
}

{
  /* Local enquiry functionality, with demo admin enhancements below. */
  (() => {
    "use strict";
    const {
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
    } = window.Cafe;
    function renderDraft() {
      const draft = getDraft();
      $$("[data-order-list]").forEach((list) => {
        list.replaceChildren();
        if (!draft.length) {
          list.append(
            node("p", "Your enquiry list is empty. Add a favourite from the menu."),
          );
          return;
        }
        draft.forEach((item) => {
          const p = bySlug.get(item.slug),
            row = node("div", undefined, "order-row"),
            info = node("div");
          info.append(
            node("strong", p.name),
            node(
              "p",
              `${item.quantity} × ${money(p.price)} · ${money(p.price * item.quantity)} sample subtotal`,
            ),
          );
          const remove = node("button", "Remove", "btn btn-outline");
          remove.type = "button";
          remove.setAttribute("aria-label", `Remove ${p.name} from enquiry`);
          remove.addEventListener("click", () => {
            save(
              "juice-draft",
              getDraft().filter((x) => x.slug !== item.slug),
            );
            renderDraft();
          });
          row.append(info, remove);
          list.append(row);
        });
      });
      const total = draft.reduce(
        (sum, item) => sum + bySlug.get(item.slug).price * item.quantity,
        0,
      );
      $$("[data-order-total]").forEach((el) => {
        el.textContent = `Sample subtotal: ${money(total)}`;
      });
      $$("[data-draft-count]").forEach((el) => {
        el.textContent = String(draft.reduce((sum, item) => sum + item.quantity, 0));
      });
      $$("[data-download-order]").forEach((el) => {
        el.disabled = !draft.length;
      });
    }
    const orderForm = $("#order-form");
    if (orderForm) {
      const requested = new URLSearchParams(location.search).get("product");
      if (bySlug.has(requested)) $("#order-product").value = requested;
      orderForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!orderForm.reportValidity()) return;
        const slug = $("#order-product").value,
          quantity = Number($("#order-quantity").value);
        if (
          !bySlug.has(slug) ||
          !Number.isInteger(quantity) ||
          quantity < 1 ||
          quantity > 20
        )
          return;
        const draft = getDraft(),
          existing = draft.find((x) => x.slug === slug);
        if (existing) existing.quantity = Math.min(20, existing.quantity + quantity);
        else draft.push({ slug, quantity });
        save("juice-draft", draft);
        renderDraft();
        $("#order-result").textContent =
          `${bySlug.get(slug).name} saved to your local enquiry. No order has been sent.`;
      });
    }
    $$("[data-clear-order]").forEach((button) =>
      button.addEventListener("click", () => {
        save("juice-draft", []);
        renderDraft();
      }),
    );
    $$("[data-download-order]").forEach((button) =>
      button.addEventListener("click", () => {
        const draft = getDraft();
        if (!draft.length) return;
        const lines = draft.map((item) => {
          const p = bySlug.get(item.slug);
          return `${p.name}: ${item.quantity} × ${money(p.price)} = ${money(item.quantity * p.price)}`;
        });
        const total = draft.reduce(
          (sum, item) => sum + bySlug.get(item.slug).price * item.quantity,
          0,
        );
        download(
          "juice-bar-order-enquiry.txt",
          [
            config.brand,
            "LOCAL ENQUIRY DRAFT — NOT SENT OR CONFIRMED",
            ...lines,
            `Sample subtotal: ${money(total)}`,
            "Confirm availability, prices, allergens and fulfilment directly with the café.",
          ].join("\n\n"),
        );
      }),
    );
    renderDraft();
  })();

  /* Clearly labelled illustrative admin analytics, orders, messages and local settings. */
  (() => {
    "use strict";
    if (!document.body.classList.contains("page-dashboard")) return;
    const { $, $$, read, save, money, node } = window.Cafe;
    const data = window.CAFE_DASHBOARD;
    if (!data) return;
    const settings = read("cafe-admin-settings", {});
    const select = $("#analytics-period");
    if (data.periods[settings.period]) select.value = settings.period;
    function draw() {
      const period = data.periods[select.value] || data.periods["7"];
      $$("[data-demo-metric]").forEach((el) => {
        const key = el.dataset.demoMetric;
        el.textContent =
          key === "average"
            ? money(Math.round(period.revenue / period.orders))
            : key === "revenue"
              ? money(period.revenue)
              : String(period[key]);
      });
      const chart = $("#revenue-chart");
      chart.replaceChildren();
      const max = Math.max(...period.values);
      period.values.forEach((value, i) => {
        const column = node("div", undefined, "chart-column"),
          bar = node("div", undefined, "chart-bar");
        bar.style.height = `${Math.round((180 * value) / max)}px`;
        bar.title = `Sample interval ${i + 1}: ${money(value)}`;
        bar.setAttribute("aria-hidden", "true");
        column.append(bar, node("span", `Day ${i + 1}`));
        chart.append(column);
      });
      chart.setAttribute(
        "aria-label",
        `Illustrative revenue chart: ${period.values.map((v, i) => `interval ${i + 1}, ${money(v)}`).join("; ")}. Not live business data.`,
      );
      $("#chart-summary").textContent =
        `Demo revenue: ${money(period.revenue)} for the selected ${select.value}-day sample period, shown across seven illustrative intervals.`;
    }
    select.addEventListener("change", draw);
    draw();
    const filter = $("#demo-order-filter");
    filter.addEventListener("change", () => {
      let count = 0;
      $$("[data-demo-order-status]").forEach((row) => {
        row.hidden =
          filter.value !== "All" && row.dataset.demoOrderStatus !== filter.value;
        if (!row.hidden) count++;
      });
      $("#demo-order-count").textContent = `${count} demo orders shown.`;
    });
    let showArchived = false;
    const rawMessages = read("cafe-demo-messages", {});
    let messageState =
      typeof rawMessages === "object" && !Array.isArray(rawMessages) ? rawMessages : {};
    function renderMessages() {
      let count = 0;
      $$("[data-demo-message]").forEach((card) => {
        const state = messageState[card.dataset.demoMessage] || {};
        card.dataset.archived = String(!!state.archived);
        card.dataset.read = String(!!state.read);
        card.hidden = !!state.archived && !showArchived;
        if (!card.hidden) count++;
        $("[data-message-status]", card).textContent = state.archived
          ? "Archived demo"
          : state.read
            ? "Read demo"
            : "Unread demo";
        $("[data-read-message]", card).textContent = state.read
          ? "Mark unread"
          : "Mark read";
        $("[data-archive-message]", card).textContent = state.archived
          ? "Restore"
          : "Archive";
      });
      $("#message-summary").textContent =
        `${count} sample messages visible. Changes are local to this browser.`;
    }
    $$("[data-read-message]").forEach((button) =>
      button.addEventListener("click", () => {
        const id = button.dataset.readMessage;
        messageState[id] = { ...messageState[id], read: !messageState[id]?.read };
        save("cafe-demo-messages", messageState);
        renderMessages();
      }),
    );
    $$("[data-archive-message]").forEach((button) =>
      button.addEventListener("click", () => {
        const id = button.dataset.archiveMessage;
        messageState[id] = {
          ...messageState[id],
          archived: !messageState[id]?.archived,
        };
        save("cafe-demo-messages", messageState);
        renderMessages();
      }),
    );
    $("#toggle-archived").addEventListener("click", (event) => {
      showArchived = !showArchived;
      event.currentTarget.setAttribute("aria-pressed", String(showArchived));
      event.currentTarget.textContent = showArchived
        ? "Hide archived demo messages"
        : "Show archived demo messages";
      renderMessages();
    });
    renderMessages();
    const form = $("#admin-settings");
    if (typeof settings.displayName === "string")
      $("#admin-display-name").value = settings.displayName.slice(0, 60);
    if (data.periods[settings.period]) $("#admin-period").value = settings.period;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const displayName = $("#admin-display-name").value.trim(),
        period = $("#admin-period").value;
      save("cafe-admin-settings", { displayName, period });
      select.value = period;
      draw();
      $("#admin-settings-result").textContent =
        `Local demo settings saved for ${displayName}. No server settings were changed.`;
    });
  })();
}

{
  /* Real endpoint integration only. No insecure fake authenticated state. */
  (() => {
    "use strict";
    const {
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
    } = window.Cafe;
    const auth = $("[data-auth]");
    if (auth) {
      auth.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!auth.reportValidity()) return;
        const endpoint =
          auth.dataset.auth === "register"
            ? config.authRegisterEndpoint
            : config.authLoginEndpoint;
        const result = $("#auth-result");
        if (!endpoint) {
          result.textContent =
            "Account service is not configured. No credentials were sent or stored. Please contact the café for assistance.";
          return;
        }
        const button = $("button[type=submit]", auth);
        button.disabled = true;
        try {
          const response = await fetch(endpoint, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              Object.fromEntries(
                [...new FormData(auth)].filter(([key]) => key !== "confirmPassword"),
              ),
            ),
          });
          if (!response.ok) throw new Error();
          result.textContent =
            auth.dataset.auth === "register"
              ? "Your request was accepted. Follow the account service’s verification process."
              : "The account service accepted your sign-in. Return to the menu to continue.";
          $("#auth-password").value = "";
        } catch {
          result.textContent =
            "The account service could not complete your request. Please check your details or try again later.";
        } finally {
          button.disabled = false;
        }
      });
    }
  })();
}

{
  /* Contact/newsletter delivery plus accessible field validation. */
  (() => {
    "use strict";
    const {
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
    } = window.Cafe;
    const contact = $("#contact-form");
    if (contact) {
      const product = new URLSearchParams(location.search).get("product");
      if (product) {
        $("#subject").value = "Menu & offers";
        $("#message").value = `I would like to ask about ${product
          .split("-")
          .map((s) => s[0].toUpperCase() + s.slice(1))
          .join(" ")}. `;
      }
      if (config.formEndpoint) {
        $("#contact-notice").textContent =
          "Your enquiry will be sent through the café’s configured contact service. Please review the privacy notice.";
        $("#contact-submit").textContent = "Send enquiry";
      }
      contact.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!contact.reportValidity()) return;
        const result = $("#contact-result");
        if (!config.formEndpoint) {
          const form = new FormData(contact);
          const text = [
            `Enquiry to ${config.brand || "Juice Bar & Smoothie Café"}`,
            ...[...form.entries()].map(([key, value]) => `${key}: ${value}`),
            "This is a local draft. It has not been sent.",
          ].join("\n\n");
          const url = URL.createObjectURL(
            new Blob([text], { type: "text/plain;charset=utf-8" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "cafe-enquiry-draft.txt";
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          result.textContent =
            "Your message draft was downloaded. Nothing has been sent.";
          return;
        }
        const button = $("#contact-submit");
        button.disabled = true;
        result.textContent = "Sending your enquiry…";
        try {
          const response = await fetch(config.formEndpoint, {
            method: "POST",
            body: new FormData(contact),
            headers: { Accept: "application/json" },
          });
          if (!response.ok) throw new Error("Delivery failed");
          result.textContent = "Your enquiry was sent successfully.";
          contact.reset();
        } catch {
          result.textContent =
            "Your enquiry could not be sent. Please try again later.";
        } finally {
          button.disabled = false;
        }
      });
    }
    const newsletter = $("#newsletter-form");
    if (newsletter) {
      if (config.newsletterEndpoint) {
        $("#newsletter-notice").textContent =
          "Your email will be sent to the café’s configured newsletter service. Review the privacy policy before subscribing.";
        $("#newsletter-submit").textContent = "Subscribe";
      }
      newsletter.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!newsletter.reportValidity()) return;
        const email = $("#newsletter-email").value.trim(),
          result = $("#newsletter-result");
        if (!config.newsletterEndpoint) {
          download(
            "cafe-newsletter-request.txt",
            `Newsletter signup request for ${config.brand}\nEmail: ${email}\nThis is a local draft. No subscription has been created.`,
          );
          result.textContent =
            "Signup request downloaded. You have not been subscribed.";
          return;
        }
        const button = $("#newsletter-submit");
        button.disabled = true;
        try {
          const response = await fetch(config.newsletterEndpoint, {
            method: "POST",
            body: new FormData(newsletter),
            headers: { Accept: "application/json" },
          });
          if (!response.ok) throw new Error();
          result.textContent =
            "Your signup request was accepted. Check your email for any confirmation step.";
          newsletter.reset();
        } catch {
          result.textContent = "Signup could not be completed. Please try again later.";
        } finally {
          button.disabled = false;
        }
      });
    }

    document.querySelectorAll('form:not([method="dialog"])').forEach((form) => {
      form.noValidate = true;
      const clear = (field) => {
        field.removeAttribute("aria-invalid");
        const error = document.getElementById(field.id + "-error");
        if (error) error.hidden = true;
      };
      $$("input,textarea,select", form).forEach((field) =>
        field.addEventListener("input", () => clear(field)),
      );
      form.addEventListener(
        "submit",
        (event) => {
          const confirmation = $("#auth-confirm", form),
            password = $("#auth-password", form);
          if (confirmation)
            confirmation.setCustomValidity(
              confirmation.value === password.value ? "" : "Passwords must match.",
            );
          if (form.checkValidity()) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          let first = null;
          $$("input,textarea,select", form).forEach((field) => {
            if (field.validity.valid) return;
            if (!first) first = field;
            field.setAttribute("aria-invalid", "true");
            let error = document.getElementById(field.id + "-error");
            if (!error) {
              error = node("p", undefined, "field-error");
              error.id = field.id + "-error";
              error.setAttribute("role", "alert");
              field.insertAdjacentElement("afterend", error);
            }
            error.textContent = field.validity.valueMissing
              ? "Please complete this field."
              : field.validity.typeMismatch
                ? "Please enter a valid email address."
                : field.validity.tooShort
                  ? `Please use at least ${field.minLength} characters.`
                  : field.validity.rangeUnderflow || field.validity.rangeOverflow
                    ? "Please choose a value within the allowed range."
                    : field.validationMessage;
            error.hidden = false;
            field.setAttribute("aria-describedby", error.id);
          });
          first?.focus();
        },
        true,
      );
    });
  })();
}
