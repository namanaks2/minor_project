/* =============================================
   CAMPUS MERCH — script.js
   ============================================= */

// ── DOM References ────────────────────────────
const navbar         = document.getElementById("navbar");
const navLinks       = document.getElementById("navLinks");
const hamburger      = document.getElementById("hamburger");
const cartCountEl    = document.getElementById("cartCount");
const productGrid    = document.getElementById("productGrid");
const toast          = document.getElementById("toast");
const cartSidebar    = document.getElementById("cartSidebar");
const cartOverlay    = document.getElementById("cartOverlay");
const closeCartBtn   = document.getElementById("closeCart");
const cartToggleBtn  = document.getElementById("cartToggle");
const cartItemsEl    = document.getElementById("cartItems");
const cartEmptyEl    = document.getElementById("cartEmpty");
const cartFooterEl   = document.getElementById("cartFooter");
const cartTotalEl    = document.getElementById("cartTotal");
const searchInput    = document.getElementById("searchInput");
const noResults      = document.getElementById("noResults");

// ── State ─────────────────────────────────────
let cart = [];                     // [{ product, qty }]
let activeCategory = "all";
let selectedColor  = "#5b8cff";

// ── Product Data ───────────────────────────────
const products = [
  { id: 1, name: "Campus Hoodie",    price: 1499, cat: "Apparel",     badge: "Bestseller", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
  { id: 2, name: "Dept T-Shirt",     price: 799,  cat: "Apparel",     badge: "",           img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400" },
  { id: 3, name: "Campus Cap",       price: 499,  cat: "Accessories", badge: "New",        img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400" },
  { id: 4, name: "College Notebook", price: 299,  cat: "Stationery",  badge: "",           img: "https://images.unsplash.com/photo-1585386959984-a41552231658?w=400" },
  { id: 5, name: "Varsity Jacket",   price: 2499, cat: "Apparel",     badge: "Limited",    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" },
  { id: 6, name: "Tote Bag",         price: 399,  cat: "Accessories", badge: "",           img: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400" },
  { id: 7, name: "Sticker Pack",     price: 149,  cat: "Stationery",  badge: "Popular",    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400" },
  { id: 8, name: "Campus Polo",      price: 899,  cat: "Apparel",     badge: "",           img: "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400" },
];

// ── Toast Notification ─────────────────────────
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
const sections = ["home", "shop", "customize", "clubs", "newsletter"];
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

// ── Render Products ────────────────────────────
function renderProducts(list) {
  productGrid.innerHTML = "";
  noResults.classList.toggle("hidden", list.length > 0);

  list.forEach((product, i) => {
    const card = document.createElement("div");
    card.classList.add("product-card");
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

    productGrid.appendChild(card);
  });
}

// ── Filter & Search Logic ──────────────────────
function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = products.filter(p => {
    const matchCat  = activeCategory === "all" || p.cat === activeCategory;
    const matchName = p.name.toLowerCase().includes(query);
    return matchCat && matchName;
  });
  renderProducts(filtered);
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    applyFilters();
  });
});

// Search input (debounced)
let searchTimer;
searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(applyFilters, 250);
});

// ── Cart Helpers ───────────────────────────────
function addToCart(product) {
  const existing = cart.find(i => i.product.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ product, qty: 1 });
  }
  updateCartUI();
  showToast(`🛒 ${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.product.id !== productId);
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

// Checkout placeholder
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return;
  showToast("🎉 Order placed successfully!");
  cart = [];
  updateCartUI();
  closeCart();
});

// ── Customizer ────────────────────────────────
// Color swatches
document.querySelectorAll(".color-swatch").forEach(swatch => {
  swatch.addEventListener("click", () => {
    document.querySelectorAll(".color-swatch").forEach(s => s.classList.remove("active"));
    swatch.classList.add("active");
    selectedColor = swatch.dataset.color;
    document.getElementById("previewText").style.color = selectedColor;
  });
});

document.getElementById("previewBtn").addEventListener("click", () => {
  const name = document.getElementById("customName").value.trim();
  const dept = document.getElementById("customDept").value;
  const year = document.getElementById("customYear").value;
  const label = `${name || "Your Name"} | ${dept || "Dept"} | ${year || "Year"}`;
  const previewText = document.getElementById("previewText");
  previewText.textContent = label;
  previewText.style.color = selectedColor;
  showToast("✅ Preview updated!");
});

// Add custom merch to cart
document.getElementById("addCustomToCart").addEventListener("click", () => {
  const name = document.getElementById("customName").value.trim();
  const dept = document.getElementById("customDept").value;
  const year = document.getElementById("customYear").value;

  if (!name || !dept || !year) {
    showToast("⚠️ Please fill in all customization fields");
    return;
  }

  const customProduct = {
    id: `custom-${Date.now()}`,
    name: `Custom: ${name} | ${dept} | ${year}`,
    price: 999,
    img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400",
  };
  addToCart(customProduct);
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

// ── Init ───────────────────────────────────────
renderProducts(products);
updateCartUI();
