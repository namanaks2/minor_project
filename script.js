const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");
const cartCountElement = document.getElementById("cartCount");
const productGrid = document.getElementById("productGrid");

let cartCount = 0;

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const products = [
  {name: "Campus Hoodie", price: 1499, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"},
  {name: "Dept T-Shirt", price: 799, img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a"},
  {name: "Campus Cap", price: 499, img: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10"},
  {name: "College Notebook", price: 299, img: "https://images.unsplash.com/photo-1585386959984-a41552231658"}
];

products.forEach(product => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${product.img}">
    <h3>${product.name}</h3>
    <p>₹${product.price}</p>
    <button class="btn-primary">Add to Cart</button>
  `;

  card.querySelector("button").addEventListener("click", () => {
    cartCount++;
    cartCountElement.textContent = cartCount;
  });

  productGrid.appendChild(card);
});

document.getElementById("previewBtn").addEventListener("click", () => {
  const name = document.getElementById("customName").value;
  const dept = document.getElementById("customDept").value;
  const year = document.getElementById("customYear").value;

  document.getElementById("previewText").textContent =
    `${name || "Your Name"} | ${dept || "Dept"} | ${year || "Year"}`;
});