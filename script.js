function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart successfully!");
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartContainer = document.getElementById("cartItems");
    let totalElement = document.getElementById("total");

    if (!cartContainer || !totalElement) return;

    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    }

    cart.forEach((item, index) => {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        cartContainer.innerHTML += `
            <div class="card p-3 mb-3">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <img src="${item.image}"
                             class="img-fluid"
                             alt="${item.name}">
                    </div>

                    <div class="col-md-6">
                        <h5>${item.name}</h5>
                        <p>Price: ₹${item.price}</p>
                        <div class="d-flex align-items-center gap-2">
                            <span>Quantity:</span>

                            <button class="btn btn-sm btn-secondary"
                                     onclick="updateQuantity(${index}, -1)">−</button>

                            <span>${item.quantity}</span> 

                            <button class="btn btn-sm btn-secondary"
                                    onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <p>Subtotal: ₹${subtotal}</p>
                    </div>

                    <div class="col-md-3">
                        <button class="btn btn-danger"
                                onclick="removeItem(${index})">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    totalElement.innerText = "Total Amount: ₹" + total;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    displayCart();
}
function displayCheckoutSummary() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let container = document.getElementById("checkoutItems");
    let totalElement = document.getElementById("checkoutTotal");

    if (!container || !totalElement) return;

    container.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        let subtotal = item.price * item.quantity;
        total += subtotal;

        container.innerHTML += `
            <p>${item.name} × ${item.quantity}
            - ₹${subtotal}</p>
        `;
    });

    totalElement.innerText = "Total: ₹" + total;
}
document.getElementById("checkoutForm")?.addEventListener("submit", function(event) {

    event.preventDefault();

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let order = {
        name: document.getElementById("customerName").value,
        phone: document.getElementById("phone").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        pincode: document.getElementById("pincode").value,
        items: cart,
        total: cart.reduce((sum, item) =>
            sum + item.price * item.quantity, 0),
        date: new Date().toLocaleString()
    };

    // Generate Order ID
    order.orderId = "SE" + Date.now();

    // Get previous orders
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Save new order
    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    // Save latest order
    localStorage.setItem("lastOrder", JSON.stringify(order));

    // Clear cart
    localStorage.removeItem("cart");

    alert("Your order has been placed successfully!");

    window.location.href = "order-success.html";

});

// ShopEasy Customer Profiles

document.addEventListener("DOMContentLoaded", function () {

    const profileForm = document.getElementById("profileForm");

    if (!profileForm) return;

    // Load saved profile
    let savedProfile = JSON.parse(localStorage.getItem("customerProfile")) || {};

    document.getElementById("profileName").value = savedProfile.name || "";
    document.getElementById("profileEmail").value = savedProfile.email || "";
    document.getElementById("profilePhone").value = savedProfile.phone || "";
    document.getElementById("profileAddress").value = savedProfile.address || "";

    // Save profile
    profileForm.addEventListener("submit", function (event) {

        event.preventDefault();

        let profile = {
            name: document.getElementById("profileName").value,
            email: document.getElementById("profileEmail").value,
            phone: document.getElementById("profilePhone").value,
            address: document.getElementById("profileAddress").value
        };

        localStorage.setItem("customerProfile", JSON.stringify(profile));

        document.getElementById("profileMessage").textContent =
            "Profile saved successfully!";
    });

});
function clearProfile() {
    localStorage.removeItem("customerProfile");

    const profileForm = document.getElementById("profileForm");
    const profileMessage = document.getElementById("profileMessage");

    if (profileForm) {
        profileForm.reset();
    }

    if (profileMessage) {
        profileMessage.textContent = "Profile cleared successfully!";
    }
}

// ShopEasy Profile Dashboard
document.addEventListener("DOMContentLoaded", function () {

    let savedProfile = JSON.parse(
        localStorage.getItem("customerProfile")
    ) || {};

    let dashName = document.getElementById("dashName");
    let dashEmail = document.getElementById("dashEmail");
    let dashPhone = document.getElementById("dashPhone");
    let dashAddress = document.getElementById("dashAddress");

    if (dashName && dashEmail && dashPhone && dashAddress) {
        dashName.textContent = savedProfile.name || "Not provided";
        dashEmail.textContent = savedProfile.email || "Not provided";
        dashPhone.textContent = savedProfile.phone || "Not provided";
        dashAddress.textContent = savedProfile.address || "Not provided";
    }

});
// ShopEasy Product Search
function searchProducts() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let selectedCategory = window.selectedCategory || "all";

    let products = document.querySelectorAll(".product-item");
    let noProductsMessage = document.getElementById("noProductsMessage");

    let visibleCount = 0;

    products.forEach(function(product) {
        let productName = product.querySelector("h5").textContent.toLowerCase();
        let productCategory = product.getAttribute("data-category");

        let matchesSearch = productName.includes(searchValue);
        let matchesCategory = selectedCategory === "all" || productCategory === selectedCategory;

        if (matchesSearch && matchesCategory) {
            product.style.display = "";
            visibleCount++;
        } else {
            product.style.display = "none";
        }
    });

    if (noProductsMessage) {
        noProductsMessage.style.display = visibleCount === 0 ? "block" : "none";
    }
}
// ShopEasy Product Category Filter
function filterCategory(category) {
    window.selectedCategory = category;
    searchProducts();
}
// ShopEasy Product Sorting
function sortProducts() {
    const sortValue = document.getElementById("sortProducts").value;
    const productList = document.getElementById("productList");

    const products = Array.from(
        productList.querySelectorAll(".product-item")
    );

    products.sort(function(a, b) {
        const priceA = Number(
            a.querySelector(".card-body p").textContent.replace(/[^\d.]/g, "")
        );

        const priceB = Number(
            b.querySelector(".card-body p").textContent.replace(/[^\d.]/g, "")
        );

        const nameA = a.querySelector("h5").textContent.trim().toLowerCase();
        const nameB = b.querySelector("h5").textContent.trim().toLowerCase();

        if (sortValue === "low-high") return priceA - priceB;
        if (sortValue === "high-low") return priceB - priceA;
        if (sortValue === "name") return nameA.localeCompare(nameB);

        return 0;
    });

    products.forEach(function(product) {
        productList.appendChild(product);
    });
}
// ShopEasy Product Reviews

function addReview() {
    const name = document.getElementById("reviewName").value.trim();
    const rating = document.getElementById("reviewRating").value;
    const reviewText = document.getElementById("reviewText").value.trim();

    if (name === "" || reviewText === "") {
        alert("Please enter your name and review!");
        return;
    }

    let reviews = JSON.parse(localStorage.getItem("sportsShoesReviews")) || [];

    reviews.push({
        name: name,
        rating: rating,
        review: reviewText
    });

    localStorage.setItem("sportsShoesReviews", JSON.stringify(reviews));

    document.getElementById("reviewName").value = "";
    document.getElementById("reviewText").value = "";

    displayReviews();
    alert("Review submitted successfully!");
}

function displayReviews() {
    const reviewList = document.getElementById("reviewList");

    if (!reviewList) return;

    let reviews = JSON.parse(localStorage.getItem("sportsShoesReviews")) || [];

    reviewList.innerHTML = "";

    reviews.forEach(function(item) {
        const review = document.createElement("div");
        review.className = "border rounded p-2 mb-2";

        const name = document.createElement("strong");
        name.textContent = item.name;

        const stars = document.createElement("p");
        stars.className = "text-warning mb-1";
        stars.textContent = "★".repeat(Number(item.rating));

        const comment = document.createElement("p");
        comment.textContent = item.review;

        review.append(name, stars, comment);
        reviewList.appendChild(review);
    });
}

document.addEventListener("DOMContentLoaded", displayReviews);
// ShopEasy Wishlist

function addToWishlist(name, price, image) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let existingProduct = wishlist.find(item => item.name === name);

    if (existingProduct) {
        alert("Product is already in your Wishlist!");
        return;
    }

    wishlist.push({
        name: name,
        price: price,
        image: image
    });

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    alert("Product added to Wishlist successfully!");
}
// Display ShopEasy Wishlist

function displayWishlist() {
    const wishlistItems = document.getElementById("wishlistItems");

    if (!wishlistItems) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlistItems.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistItems.innerHTML =
            '<p class="text-center">Your Wishlist is empty!</p>';
        return;
    }

    wishlist.forEach(function(item, index) {
        wishlistItems.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${item.image}" class="card-img-top"
                         alt="${item.name}">
                    <div class="card-body">
                        <h5>${item.name}</h5>
                        <p>Price: ₹${item.price}</p>
                        <button class="btn btn-danger"
                                onclick="removeFromWishlist(${index})">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Remove Wishlist Product

function removeFromWishlist(index) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist.splice(index, 1);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    displayWishlist();
}

document.addEventListener("DOMContentLoaded", displayWishlist);
// ShopEasy Contact Form

document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const contact = {
            name: document.getElementById("contactName").value.trim(),
            email: document.getElementById("contactEmail").value.trim(),
            subject: document.getElementById("contactSubject").value.trim(),
            message: document.getElementById("contactMessage").value.trim()
        };

        let messages = JSON.parse(localStorage.getItem("contactMessages")) || [];

        messages.push(contact);

        localStorage.setItem("contactMessages", JSON.stringify(messages));

        document.getElementById("contactStatus").textContent =
            "Thank you! Your message has been submitted successfully.";

        contactForm.reset();
    });

});
// ShopEasy Registration

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;

    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const phone = document.getElementById("registerPhone").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const message = document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match!";
            message.className = "text-danger text-center mt-3";
            return;
        }

        let users = JSON.parse(localStorage.getItem("shopEasyUsers")) || [];

        if (users.some(user => user.email === email)) {
            message.textContent = "This email is already registered!";
            message.className = "text-danger text-center mt-3";
            return;
        }

        users.push({ name, email, phone, password });

        localStorage.setItem("shopEasyUsers", JSON.stringify(users));

        message.textContent = "Registration successful! You can now login.";
        message.className = "text-success text-center mt-3";

        registerForm.reset();
    });

});
// ShopEasy Login

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        let users = JSON.parse(localStorage.getItem("shopEasyUsers")) || [];

        const loggedInUser = users.find(function(user) {
            return user.email === email && user.password === password;
        });

        if (loggedInUser) {
            localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

            message.textContent = "Login successful! Welcome to ShopEasy.";
            message.className = "text-success text-center mt-3";
        } else {
            message.textContent = "Invalid email or password. Please try again.";
            message.className = "text-danger text-center mt-3";
        }
    });

});