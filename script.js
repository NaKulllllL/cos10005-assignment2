// Urban Fanny JavaScript: validation, reservation deposit, payment fields, and bill calculator

const restaurants = {
  "Mallu Joint": { deposit: 15, avg: 36 },
  "Megma Premium Ice Cream": { deposit: 15, avg: 31 },
  "Al Zaithoon Yamani Mandi & Biriyani": { deposit: 20, avg: 48 },
  "Veggie Spot": { deposit: 12, avg: 28 },
  "Burger Lounge": { deposit: 10, avg: 28 },
  "Sea Foodie Restaurant": { deposit: 18, avg: 45 }
};

function $(id) {
  return document.getElementById(id);
}

function setError(id, msg) {
  const el = $(id + "Error");
  if (el) el.textContent = msg;
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clearErrors(ids) {
  ids.forEach(id => setError(id, ""));
}


function initNavigationHighlight() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const menuPages = [
    "mallu-joint-menu.html",
    "megma-menu.html",
    "zaithoon-menu.html",
    "veggie-spot-menu.html",
    "burger-menu.html",
    "sea-foodie-menu.html",
    "chickos-menu.html"
  ];
  const pageKey = menuPages.includes(path) ? "restaurants" : path.replace(".html", "");

  document.querySelectorAll(".site-header nav a, .menu-palace-header nav a").forEach(link => {
    link.classList.toggle("active", link.dataset.page === pageKey);
  });
}

function setupRecommendation() {
  const form = $("recommendForm");
  const result = $("recommendResult");

  if (!form || !result) return;

  const profiles = [
    {
      key: "halal",
      name: "Al Zaithoon Yamani Mandi & Biriyani",
      link: "zaithoon-menu.html",
      reserve: "reservation.html?restaurant=Al%20Zaithoon%20Yamani%20Mandi%20%26%20Biriyani",
      budget: ["medium", "premium"],
      purpose: ["family", "comfort"],
      best: { budget: "medium", purpose: "family" },
      description: "Best match for halal-friendly mandi, biriyani, grilled chicken and generous group meals.",
      reason: "It matches the halal/mandi preference and works well for family or comfort dining with a medium-to-premium budget."
    },
    {
      key: "veg",
      name: "Veggie Spot",
      link: "veggie-spot-menu.html",
      reserve: "reservation.html?restaurant=Veggie%20Spot",
      budget: ["budget", "medium"],
      purpose: ["student", "family", "comfort"],
      best: { budget: "budget", purpose: "student" },
      description: "Best match for vegetarian guests who want dosa, idli, appam, puttu and lighter value meals.",
      reason: "It matches the vegetarian preference and suits budget-friendly student, family and comfort meals."
    },
    {
      key: "seafood",
      name: "Sea Foodie Restaurant",
      link: "sea-foodie-menu.html",
      reserve: "reservation.html?restaurant=Sea%20Foodie%20Restaurant",
      budget: ["medium", "premium"],
      purpose: ["family", "date"],
      best: { budget: "premium", purpose: "date" },
      description: "Best match for seafood lovers who want fish, prawns, crab, lobster and coastal-style dishes.",
      reason: "It matches the seafood preference and suits premium dining, dates or seafood-focused group meals."
    },
    {
      key: "premium",
      name: "Mallu Joint",
      link: "mallu-joint-menu.html",
      reserve: "reservation.html?restaurant=Mallu%20Joint",
      budget: ["medium", "premium"],
      purpose: ["date", "family", "comfort"],
      best: { budget: "premium", purpose: "date" },
      description: "Best match for premium Kerala-style dining with beef roast, porotta, fish curry and homestyle mains.",
      reason: "It matches the premium dining preference and works for date nights, family dining and Kerala comfort food."
    },
    {
      key: "fastfood",
      name: "Burger Lounge",
      link: "burger-menu.html",
      reserve: "reservation.html?restaurant=Burger%20Lounge",
      budget: ["budget", "medium"],
      purpose: ["student", "family"],
      best: { budget: "budget", purpose: "student" },
      description: "Best match for burgers, fries, student meals, quick service and casual fast food cravings.",
      reason: "It matches the fast food preference and suits budget-friendly quick meals or casual group dining."
    },
    {
      key: "sweetcold",
      name: "Megma Premium Ice Cream",
      link: "megma-menu.html",
      reserve: "reservation.html?restaurant=Megma%20Premium%20Ice%20Cream",
      budget: ["medium", "premium"],
      purpose: ["dessert", "date", "family"],
      best: { budget: "medium", purpose: "dessert" },
      description: "Best match for sweet and cold desserts, ice cream, milkshakes, sundaes and stylish after-meal treats.",
      reason: "It matches the sweet and cold preference and suits dessert plans, dates and family treats."
    }
  ];

  function getSelectLabel(id) {
    const select = $(id);
    return select.options[select.selectedIndex].text;
  }

  function calculateMatch(profile, food, budget, purpose) {
    let score = 0;
    const reasons = [];

    if (profile.key === food) {
      score += 6;
      reasons.push("food preference match");
    }
    if (profile.best.budget === budget) {
      score += 3;
      reasons.push("best budget match");
    } else if (profile.budget.includes(budget)) {
      score += 2;
      reasons.push("suitable budget range");
    }
    if (profile.best.purpose === purpose) {
      score += 3;
      reasons.push("best dining-purpose match");
    } else if (profile.purpose.includes(purpose)) {
      score += 2;
      reasons.push("suitable dining purpose");
    }

    return { ...profile, score, reasons };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const food = $("foodType").value;
    const budget = $("budget").value;
    const purpose = $("purpose").value;

    if (!food || !budget || !purpose) {
      result.innerHTML = `
        <h2>Please complete all options.</h2>
        <p>Select a dietary / food preference, budget rate and dining purpose before getting a recommendation.</p>
      `;
      return;
    }

    const ranked = profiles
      .map(profile => calculateMatch(profile, food, budget, purpose))
      .sort((a, b) => b.score - a.score);

    const rec = ranked[0];
    const second = ranked.find(item => item.name !== rec.name);
    const reasonItems = rec.reasons.map(reason => `<li>${reason}</li>`).join("");

    result.innerHTML = `
      <div class="recommend-card">
        <p class="match-score">Best match score: ${rec.score}/12</p>
        <h2>${rec.name}</h2>
        <p>${rec.description}</p>
        <div class="match-details">
          <p><strong>Your choices:</strong> ${getSelectLabel("foodType")} + ${getSelectLabel("budget")} + ${getSelectLabel("purpose")}</p>
          <p><strong>Why this restaurant:</strong> ${rec.reason}</p>
          <ul class="reason-list">${reasonItems}</ul>
        </div>
        <p><strong>Backup option:</strong> ${second.name}, if you want a slightly different style.</p>
        <div class="btn-row">
          <a href="${rec.link}" class="btn">Open Menu</a>
          <a href="${rec.reserve}" class="btn secondary">Reserve This</a>
        </div>
      </div>
    `;
  });
}

function init() {
  initNavigationHighlight();
  setupRecommendation();

  const reg = $("registerForm");
  if (reg) reg.addEventListener("submit", validateRegister);

  const res = $("reservationForm");
  if (res) {
    setupReservation();
    res.addEventListener("submit", validateReservation);
  }

  const bill = $("billForm");
  if (bill) setupBill();
}

function validateRegister(e) {
  const ids = ["username", "email", "phone", "password", "confirmPassword", "gender", "dietary", "country"];
  clearErrors(ids);

  let ok = true;
  const username = $("username").value.trim();
  const email = $("email").value.trim();
  const phone = $("phone").value.trim();
  const password = $("password").value;
  const confirmPassword = $("confirmPassword").value;

  if (!/^[A-Za-z0-9_]{5,}$/.test(username)) {
    setError("username", "Use at least 5 letters, numbers or underscores.");
    ok = false;
  }

  if (!validEmail(email)) {
    setError("email", "Enter a valid email address.");
    ok = false;
  }

  if (!/^\d{8,15}$/.test(phone)) {
    setError("phone", "Phone must be 8 to 15 digits only.");
    ok = false;
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/.test(password)) {
    setError("password", "Minimum 10 characters with upper, lower, number and special character.");
    ok = false;
  }

  if (confirmPassword !== password || confirmPassword === "") {
    setError("confirmPassword", "Passwords must match.");
    ok = false;
  }

  if (!document.querySelector('input[name="gender"]:checked')) {
    setError("gender", "Please select a gender.");
    ok = false;
  }

  if ($("dietary") && $("dietary").value === "") {
    setError("dietary", "Please select a dietary preference.");
    ok = false;
  }

  if ($("country") && $("country").value === "") {
    setError("country", "Please select a country/region.");
    ok = false;
  }

  if (!ok) e.preventDefault();
}

function setupReservation() {
  const restaurantSelect = $("restaurantSelect");
  const params = new URLSearchParams(window.location.search);
  const selected = params.get("restaurant");

  if (selected && restaurants[selected] && restaurantSelect) {
    restaurantSelect.value = selected;
  }

  updateDeposit();
  updatePaymentFields();

  if (restaurantSelect) {
    restaurantSelect.addEventListener("change", updateDeposit);
  }

  document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener("change", updatePaymentFields);
  });

  const sameEmail = $("sameEmail");
  const resEmail = $("resEmail");
  const billingEmail = $("billingEmail");

  if (sameEmail && resEmail && billingEmail) {
    sameEmail.addEventListener("change", () => {
      if (sameEmail.checked) billingEmail.value = resEmail.value;
    });

    resEmail.addEventListener("input", () => {
      if (sameEmail.checked) billingEmail.value = resEmail.value;
    });
  }
}

function updateDeposit() {
  const restaurantSelect = $("restaurantSelect");
  const depositAmount = $("depositAmount");

  if (!restaurantSelect || !depositAmount) return;

  const selected = restaurantSelect.value;
  depositAmount.value = restaurants[selected] ? "$" + restaurants[selected].deposit : "";
}

function updatePaymentFields() {
  const selected = document.querySelector('input[name="paymentMethod"]:checked');
  const method = selected ? selected.value : "";
  const voucherBox = $("voucherBox");
  const cardBox = $("cardBox");

  if (voucherBox) voucherBox.classList.toggle("show", method === "voucher");
  if (cardBox) cardBox.classList.toggle("show", method === "online");
}

function validateReservation(e) {
  const ids = ["fullName", "resEmail", "resPhone", "restaurantSelect", "resDateTime", "people", "paymentMethod", "voucherCode", "cardNumber", "billingEmail"];
  clearErrors(ids);

  let ok = true;

  if ($("fullName").value.trim() === "") {
    setError("fullName", "Full name is required.");
    ok = false;
  }

  if (!validEmail($("resEmail").value.trim())) {
    setError("resEmail", "Enter a valid email.");
    ok = false;
  }

  if (!/^\d{10,}$/.test($("resPhone").value.trim())) {
    setError("resPhone", "Phone must contain at least 10 digits.");
    ok = false;
  }

  if ($("restaurantSelect").value === "") {
    setError("restaurantSelect", "Choose a restaurant.");
    ok = false;
  }

  if (!$("resDateTime").value || new Date($("resDateTime").value) < new Date()) {
    setError("resDateTime", "Choose a future date and time.");
    ok = false;
  }

  if (Number($("people").value) <= 0) {
    setError("people", "Number of people must be greater than 0.");
    ok = false;
  }

  const method = document.querySelector('input[name="paymentMethod"]:checked')?.value;
  if (!method) {
    setError("paymentMethod", "Choose a deposit method.");
    ok = false;
  }

  if (method === "voucher" && $("voucherCode") && $("voucherCode").value.trim() !== "" && !/^\d{12}$/.test($("voucherCode").value.trim())) {
    setError("voucherCode", "Voucher code must be 12 digits if entered.");
    ok = false;
  }

  if (method === "online" && !/^\d{15,16}$/.test($("cardNumber").value.trim())) {
    setError("cardNumber", "Card number must be 15 or 16 digits.");
    ok = false;
  }

  if (!validEmail($("billingEmail").value.trim())) {
    setError("billingEmail", "Enter a valid billing email.");
    ok = false;
  }

  if (!ok) e.preventDefault();
}

function setupBill() {
  ["billRestaurant", "billPeople", "addPremium", "addDrinks"].forEach(id => {
    const el = $(id);
    if (el) {
      el.addEventListener("input", updateBill);
      el.addEventListener("change", updateBill);
    }
  });

  updateBill();
}

function updateBill() {
  const restaurantSelect = $("billRestaurant");
  const peopleInput = $("billPeople");
  const result = $("billResult");

  if (!restaurantSelect || !peopleInput || !result) return;

  const selected = restaurantSelect.value;
  const people = Math.max(1, Number(peopleInput.value) || 1);

  if (!selected || !restaurants[selected]) {
    result.innerHTML = "<h2>Estimated total</h2><p>Choose a restaurant to calculate.</p>";
    return;
  }

  let pricePerPerson = restaurants[selected].avg;

  if ($("addPremium") && $("addPremium").checked) pricePerPerson += 18;
  if ($("addDrinks") && $("addDrinks").checked) pricePerPerson += 12;

  const food = pricePerPerson * people;
  const deposit = restaurants[selected].deposit;
  const service = Math.round(food * 0.08);
  const totalBeforeDeposit = food + service;
  const total = Math.max(0, totalBeforeDeposit - deposit);

  result.innerHTML = `
    <h2>Estimated total before deposit: $${totalBeforeDeposit}</h2>
    <p>${people} guest(s) at <strong>${selected}</strong></p>
    <p>Food estimate: $${food}</p>
    <p>Service estimate: $${service}</p>
    <p>Deposit paid now: $${deposit}</p>
    <p><strong>Estimated amount remaining after deposit: $${total}</strong></p>
  `;
}

window.addEventListener("load", init);
