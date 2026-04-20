/* =============================================
   CAMPUS MERCH — script.js
   ============================================= */

// ── DOM References ────────────────────────────
const navbar         = document.getElementById("navbar");
const navLinks       = document.getElementById("navLinks");
const hamburger      = document.getElementById("hamburger");
const cartCountEl    = document.getElementById("cartCount");
const toast          = document.getElementById("toast");
const cartSidebar    = document.getElementById("cartSidebar");
const cartOverlay    = document.getElementById("cartOverlay");
const closeCartBtn   = document.getElementById("closeCart");
const cartToggleBtn  = document.getElementById("cartToggle");
const cartItemsEl    = document.getElementById("cartItems");
const cartEmptyEl    = document.getElementById("cartEmpty");
const cartFooterEl   = document.getElementById("cartFooter");
const cartTotalEl    = document.getElementById("cartTotal");
const featuredScroll = document.getElementById("featuredScroll");


let cart = [];                    
let activeCategory = "all";

const products = [
  { id: 1, name: "Campus Hoodie ",    price: 999, cat: "Apparel",     badge: "Bestseller", img: "images/campus hoodie.jfif" },
  { id: 2, name: "Campus T-Shirt",     price: 299,  cat: "Apparel",     badge: "",           img: "images/campus tshirt.jfif" },
  { id: 3, name: "Campus Cap",       price: 199,  cat: "Accessories", badge: "New",        img: "images/campus cap.jfif" },
  { id: 4, name: "College Notebook", price: 99,  cat: "Stationery",  badge: "",           img: "images/notebook-removebg-preview.png" },
  { id: 6, name: "Tote Bag",         price: 249,  cat: "Accessories", badge: "",           img: "images/totebag.jfif" },
  { id: 7, name: "Sticker Pack",     price: 89,  cat: "Stationery",  badge: "Popular",    img: "images/stickers.jfif" },
  { id: 9, name: "Custom ID Straps", price: 159,  cat: "Accessories", badge: "Customizable", img: "images/custom_id_straps-removebg-preview.png" },
  { id: 10, name: "Duty Badges",     price: 199,  cat: "Accessories", badge: "New",          img: "images/badge1.png" },
];


let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ── Scroll: Navbar Styling ─────────────────────
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  updateActiveNavLink();
});

// ── Active Nav Link on Scroll ──────────────────
const sections = ["home", "shop", "customize", "clubs", "bulkorders", "newsletter"];
function updateActiveNavLink() {
  const scrollPos = window.scrollY + 120;
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
      document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });
}

// ── Hamburger / Mobile Menu ────────────────────
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
// Close menu when a link is clicked
navLinks.addEventListener("click", e => {
  if (e.target.classList.contains("nav-link")) {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  }
});

// ── Scroll Reveal (Intersection Observer) ─────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children if the target has multiple reveal kids
      entry.target.style.transitionDelay = `${i * 60}ms`;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// ── Render Featured Products (Horizontal Scroll) ──
function renderFeaturedProducts() {
  if (!featuredScroll) return;
  featuredScroll.innerHTML = "";

  products.forEach((product, i) => {
    const card = document.createElement("div");
    card.classList.add("featured-card");
    card.style.animationDelay = `${i * 80}ms`;

    card.innerHTML = `
      ${product.badge ? `<span class="badge">${product.badge}</span>` : ""}
      <img src="${product.img}" alt="${product.name}" loading="lazy">
      <h3>${product.name}</h3>
      <p class="price">₹${product.price.toLocaleString("en-IN")}</p>
      <div class="card-actions">
        <button class="btn-primary add-btn">Add to Cart</button>
        <button class="wishlist-btn" title="Wishlist">♡</button>
      </div>
    `;

    // Add to Cart
    card.querySelector(".add-btn").addEventListener("click", () => {
      addToCart(product);
    });

    // Wishlist toggle
    const wBtn = card.querySelector(".wishlist-btn");
    wBtn.addEventListener("click", () => {
      wBtn.classList.toggle("active");
      wBtn.textContent = wBtn.classList.contains("active") ? "♥" : "♡";
      showToast(wBtn.classList.contains("active")
        ? `${product.name} added to wishlist 💛`
        : `Removed from wishlist`);
    });

    featuredScroll.appendChild(card);
  });

  // Add the "Search for more" card at the end
  const moreCard = document.createElement("a");
  moreCard.href = "products.html";
  moreCard.classList.add("featured-card", "featured-card-more");
  moreCard.innerHTML = `
    <div class="more-card-icon">🔍</div>
    <h3>Search for More</h3>
    <p class="more-card-desc">Browse our full collection with filters & search</p>
    <span class="btn-outline more-card-btn">View All Products →</span>
  `;
  featuredScroll.appendChild(moreCard);
}

// ── Scroll Arrow Buttons ──────────────────────
const scrollLeftBtn = document.getElementById("scrollLeft");
const scrollRightBtn = document.getElementById("scrollRight");

if (scrollLeftBtn && scrollRightBtn && featuredScroll) {
  scrollLeftBtn.addEventListener("click", () => {
    featuredScroll.scrollBy({ left: -320, behavior: "smooth" });
  });
  scrollRightBtn.addEventListener("click", () => {
    featuredScroll.scrollBy({ left: 320, behavior: "smooth" });
  });

  // Show/hide arrows based on scroll position
  function updateScrollArrows() {
    const { scrollLeft, scrollWidth, clientWidth } = featuredScroll;
    scrollLeftBtn.classList.toggle("hidden-arrow", scrollLeft <= 10);
    scrollRightBtn.classList.toggle("hidden-arrow", scrollLeft + clientWidth >= scrollWidth - 10);
  }
  featuredScroll.addEventListener("scroll", updateScrollArrows);
  // Initial check after render
  setTimeout(updateScrollArrows, 100);
}

// ── Cart Helpers ───────────────────────────────
function addToCart(product) {
  const existing = cart.find(i => i.product.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ product, qty: 1 });
  }
  saveCartToLocalStorage();
  updateCartUI();
  showToast(`🛒 ${product.name} added to cart!`);
}

function saveCartToLocalStorage() {
  // Convert cart objects to simple data for storage
  const cartData = cart.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    cat: item.product.cat,
    img: item.product.img,
    qty: item.qty
  }));
  localStorage.setItem('cart', JSON.stringify(cartData));
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.product.id !== productId);
  saveCartToLocalStorage();
  updateCartUI();
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.product.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCartToLocalStorage();
  updateCartUI();
}

function updateCartUI() {
  // Badge count
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  cartCountEl.textContent = totalQty;

  // Animate badge
  cartCountEl.style.transform = "scale(1.5)";
  setTimeout(() => (cartCountEl.style.transform = "scale(1)"), 200);

  // Cart items
  cartItemsEl.innerHTML = "";
  const isEmpty = cart.length === 0;
  cartEmptyEl.style.display = isEmpty ? "flex" : "none";
  cartFooterEl.classList.toggle("visible", !isEmpty);

  cart.forEach(({ product, qty }) => {
    const row = document.createElement("div");
    row.classList.add("cart-item");
    row.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <div class="cart-item-info">
        <h4>${product.name}</h4>
        <p>₹${(product.price * qty).toLocaleString("en-IN")}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn minus">−</button>
        <span class="qty-num">${qty}</span>
        <button class="qty-btn plus">+</button>
      </div>
    `;
    row.querySelector(".minus").addEventListener("click", () => changeQty(product.id, -1));
    row.querySelector(".plus").addEventListener("click", () => changeQty(product.id, +1));
    cartItemsEl.appendChild(row);
  });

  // Total
  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  cartTotalEl.textContent = `₹${total.toLocaleString("en-IN")}`;
}

// ── Cart Sidebar Open / Close ──────────────────
function openCart()  {
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeCart() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
}

cartToggleBtn.addEventListener("click", e => { e.preventDefault(); openCart(); });
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Checkout - Redirect to Payment Page
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("⚠️ Your cart is empty!");
    return;
  }
  // Save cart and redirect to payment page
  saveCartToLocalStorage();
  window.location.href = "payment.html";
});

// ── Customizer ────────────────────────────────
let selectedColor     = "#ffffff";
let selectedShirt     = "#1a2a5e";
let selectedPlacement = "front-center";

document.querySelectorAll(".shirt-swatch").forEach(swatch => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".shirt-swatch").forEach(s => s.classList.remove("active"));
    swatch.classList.add("active");
    selectedShirt = swatch.dataset.shirt;
  });
});

document.querySelectorAll(".color-swatch").forEach(swatch => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
    swatch.classList.add("active");
    selectedColor = swatch.dataset.color;
  });
});

document.querySelectorAll(".placement-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".placement-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedPlacement = btn.dataset.placement;
  });
});

// Quantity controls
const customQtyInput = document.getElementById("customQty");
document.getElementById("customQtyMinus").addEventListener("click", () => {
  let val = parseInt(customQtyInput.value);
  if (val > 1) customQtyInput.value = val - 1;
});
document.getElementById("customQtyPlus").addEventListener("click", () => {
  let val = parseInt(customQtyInput.value);
  if (val < 100) customQtyInput.value = val + 1;
});

const merchPrices = {
  "T-Shirt": 299,
  "Hoodie": 999,
  "ID Card Strap": 159,
  "Badge": 199,
  "Cap": 4199,
};

// Add custom merch to cart
document.getElementById("addCustomToCart").addEventListener("click", () => {
  const merchType = document.getElementById("customMerchType").value;
  const name = document.getElementById("customName").value.trim();
  const dept = document.getElementById("customDept").value;
  const year = document.getElementById("customYear").value;
  const qty = parseInt(customQtyInput.value) || 1;

  if (!merchType || !name || !dept || !year) {
    showToast("⚠️ Please fill in all customization fields");
    return;
  }

  const customProduct = {
    id: `custom-${Date.now()}`,
    name: `Custom ${merchType}: ${name} | ${dept} | ${year}`,
    price: merchPrices[merchType] || 499,
    img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
  };

  for (let i = 0; i < qty; i++) {
    addToCart(customProduct);
  }
});

document.getElementById("personalReqBtn").addEventListener("click", () => {
  const merchType = document.getElementById("customMerchType").value;
  const name = document.getElementById("customName").value.trim();
  const dept = document.getElementById("customDept").value;
  const year = document.getElementById("customYear").value;
  const qty = document.getElementById("customQty").value;
  const subject = encodeURIComponent("Personal Merch Requirements – Campus Merch");
  const body = encodeURIComponent(
    `Hi Campus Merch Team,\n\nI'd like to share my personal requirements for custom merch:\n\n` +
    `Merch Type: ${merchType || "—"}\nName: ${name || "—"}\nDepartment: ${dept || "—"}\nBatch Year: ${year || "—"}\nQuantity: ${qty || "1"}\n\n` +
    `Additional Requirements:\n[Please describe your design, size, or any special requests here]\n\nThank you!`
  );
  window.open(`mailto:namanaks2@gmail.com?subject=${subject}&body=${body}`, "_blank");
  showToast("📧 Opening your email client…");
});

// ── Newsletter Form ────────────────────────────
document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("newsletterEmail").value.trim();
  if (!email) return;

  const msg = document.getElementById("newsletterMsg");
  msg.textContent = `🎉 You're subscribed with ${email}! Welcome to the campus crew.`;
  msg.classList.remove("hidden");
  document.getElementById("newsletterEmail").value = "";
  showToast("📬 Subscribed successfully!");
});

// ── Theme Toggle ──────────────────────────────
const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;
const savedTheme = localStorage.getItem("theme") || "dark";

// Set initial theme
if (savedTheme === "light") {
  htmlElement.setAttribute("data-theme", "light");
  themeToggle.textContent = "☀️";
} else {
  htmlElement.removeAttribute("data-theme");
  themeToggle.textContent = "🌙";
}

// Toggle theme on button click
themeToggle.addEventListener("click", (e) => {
  e.preventDefault();
  const currentTheme = htmlElement.getAttribute("data-theme");
  
  if (currentTheme === "light") {
    htmlElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "🌙";
    showToast("🌙 Dark mode enabled");
  } else {
    htmlElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "☀️";
    showToast("☀️ Light mode enabled");
  }
});

// ── Theme Toggle Slide-In from Login ──────────
if (sessionStorage.getItem("themeTransition") === "true") {
  sessionStorage.removeItem("themeTransition");
  themeToggle.classList.add("slide-in");
  themeToggle.addEventListener("animationend", () => {
    themeToggle.classList.remove("slide-in");
  }, { once: true });
}

// ── Profile Dropdown ──────────────────────────
const profileTrigger  = document.getElementById("profileTrigger");
const profileDropdown = document.getElementById("profileDropdown");

if (profileTrigger && profileDropdown) {
  profileTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = profileDropdown.classList.contains("open");
    profileDropdown.classList.toggle("open");
    profileTrigger.classList.toggle("active");
    if (!isOpen) {
      // Close mobile nav menu if it's open
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#profileSection")) {
      profileDropdown.classList.remove("open");
      profileTrigger.classList.remove("active");
    }
  });

  // Close dropdown when clicking a dropdown item (except logout which navigates)
  profileDropdown.querySelectorAll(".profile-dropdown-item:not(.profile-dropdown-logout)").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      profileDropdown.classList.remove("open");
      profileTrigger.classList.remove("active");
      const label = item.querySelector("span:last-child").textContent;
      showToast(`📌 "${label}" coming soon!`);
    });
  });
}

// ── Init ───────────────────────────────────────
renderFeaturedProducts();
updateCartUI();
