/**
 * Scoop Paradise - Main Application Script
 * State management, interactive builder, cart handling, and smooth page animations.
 */

// --- 1. Product Data (Signature Flavors) ---
const FLAVOR_PRODUCTS = [
  {
    id: 'lavender_honey',
    name: 'Lavender Honey',
    category: 'signature',
    price: 4.50,
    rating: 4.9,
    desc: 'Sweet local honey infused with organic French lavender buds. A soothing, floral masterpiece.',
    colorGradient: 'linear-gradient(135deg, #e3d5ca 0%, #d6ccc2 100%)',
    badge: 'Signature',
    badgeClass: 'badge-signature'
  },
  {
    id: 'dark_chocolate',
    name: 'Midnight Chocolate',
    category: 'classic',
    price: 3.50,
    rating: 4.8,
    desc: 'Rich, dense 72% Belgian dark chocolate ice cream. Deep, indulgent, and velvety smooth.',
    colorGradient: 'linear-gradient(135deg, #9c6644 0%, #5c3d2e 100%)',
    badge: 'Classic',
    badgeClass: 'badge-classic'
  },
  {
    id: 'mint_chip',
    name: 'Garden Mint Chip',
    category: 'classic',
    price: 3.50,
    rating: 4.7,
    desc: 'Fresh garden mint leaves steeped in organic cream, loaded with shaved organic dark chocolate flakes.',
    colorGradient: 'linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 100%)',
    badge: 'Classic',
    badgeClass: 'badge-classic'
  },
  {
    id: 'strawberry_velvet',
    name: 'Classic Dark Chocolate',
    category: 'classic',
    price: 3.50,
    rating: 4.9,
    desc: 'A rich, traditional dark chocolate ice cream churned with organic Dutch-process cocoa.',
    colorGradient: 'linear-gradient(135deg, #6f4e37 0%, #3d2314 100%)',
    badge: 'Classic',
    badgeClass: 'badge-classic'
  },
  {
    id: 'pistachio_baklava',
    name: 'Pistachio Baklava',
    category: 'signature',
    price: 5.00,
    rating: 5.0,
    desc: 'Roasted Mediterranean pistachios with honey-drizzled crispy phyllo pastry folded in.',
    colorGradient: 'linear-gradient(135deg, #e9edc9 0%, #ccd5ae 100%)',
    badge: 'Signature',
    badgeClass: 'badge-signature'
  },
  {
    id: 'matcha_coconut',
    name: 'Matcha Coconut',
    category: 'vegan',
    price: 4.50,
    rating: 4.8,
    desc: 'Organic Uji matcha powder blended with creamy coconut cream and raw maple syrup.',
    colorGradient: 'linear-gradient(135deg, #d8f3dc 0%, #74c69d 100%)',
    badge: 'Vegan',
    badgeClass: 'badge-vegan'
  },
  {
    id: 'mango_chili_sorbet',
    name: 'Mango Chili Sorbet',
    category: 'vegan',
    price: 4.00,
    rating: 4.6,
    desc: 'Sweet, juicy Alphonso mango puree with a subtle, warming pinch of Tajín chili lime salt.',
    colorGradient: 'linear-gradient(135deg, #ffe5ec 0%, #ffb3c6 100%)',
    badge: 'Vegan',
    badgeClass: 'badge-vegan'
  },
  {
    id: 'vanilla_bean',
    name: 'Tahitian Vanilla',
    category: 'classic',
    price: 3.50,
    rating: 4.7,
    desc: 'Pure, flecked Tahitian vanilla bean caviar. Simple, elegant, and classic at its absolute best.',
    colorGradient: 'linear-gradient(135deg, #fffdf0 0%, #f7f1d5 100%)',
    badge: 'Classic',
    badgeClass: 'badge-classic'
  }
];

// --- 2. Global State ---
let cart = [];
let builderState = {
  container: 'cone', // 'cone' or 'cup'
  scoops: [],       // Array of strings (e.g. ['strawberry', 'chocolate'])
  toppings: []      // Array of strings (e.g. ['sprinkles', 'cherry'])
};

const PRICING = {
  cone: 1.50,
  cup: 1.00,
  scoop: 2.00,
  topping: 0.50
};

const FLAVOR_DISPLAY_NAMES = {
  strawberry: 'Classic Dark Chocolate',
  vanilla: 'Vanilla Bean',
  chocolate: 'Midnight Chocolate',
  mint: 'Mint Chip',
  blueberry: 'Blueberry Swirl'
};

// --- 3. DOM Elements ---
const header = document.getElementById('header');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const menuGrid = document.getElementById('menuGrid');
const filterBtns = document.querySelectorAll('.filter-btn');

// Cart Drawer elements
const cartToggleBtn = document.getElementById('cartToggleBtn');
const cartOverlay = document.getElementById('cartOverlay');
const cartCloseBtn = document.getElementById('cartCloseBtn');
const cartItemsList = document.getElementById('cartItemsList');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartTotalSum = document.getElementById('cartTotalSum');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// Builder elements
const containerOptions = document.querySelectorAll('#containerOptions .option-btn');
const flavorBtns = document.querySelectorAll('.flavor-btn');
const toppingBtns = document.querySelectorAll('.topping-btn');
const builderScoopStack = document.getElementById('builderScoopStack');
const builderToppingVisuals = document.getElementById('builderToppingVisuals');
const builderContainerVisual = document.getElementById('builderContainerVisual');

// Summary elements
const summaryContainer = document.getElementById('summaryContainer');
const summaryScoops = document.getElementById('summaryScoops');
const summaryToppings = document.getElementById('summaryToppings');
const summaryTotal = document.getElementById('summaryTotal');
const clearBuilderBtn = document.getElementById('clearBuilderBtn');
const addCustomCartBtn = document.getElementById('addCustomCartBtn');

// Reviews Slider elements
const reviewsTrack = document.getElementById('reviewsTrack');
const prevReviewBtn = document.getElementById('prevReviewBtn');
const nextReviewBtn = document.getElementById('nextReviewBtn');

// --- 4. Event Listeners & Initialize ---
document.addEventListener('DOMContentLoaded', () => {
  renderMenu('all');
  initScrollEffects();
  initReviewsSlider();
  updateBuilderUI();
});

// Scroll Effects (Sticky Header, Reveal elements)
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Navigation Menu Active Link Switch
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let fromTop = window.scrollY + 100;
  
  navLinks.forEach(link => {
    let section = document.querySelector(link.hash);
    if (!section) return;
    
    if (
      section.offsetTop <= fromTop &&
      section.offsetTop + section.offsetHeight > fromTop
    ) {
      navLinks.forEach(n => n.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// Mobile Nav Menu Toggle
mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const icon = mobileToggle.querySelector('i');
  if (navMenu.classList.contains('open')) {
    icon.className = 'fa-solid fa-xmark';
  } else {
    icon.className = 'fa-solid fa-bars-staggered';
  }
});

// Close Mobile Menu on Click outside or Link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    mobileToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
  });
});

// --- 5. Menu Rendering & Filtering ---
function renderMenu(filter = 'all') {
  menuGrid.innerHTML = '';
  
  const filteredProducts = filter === 'all' 
    ? FLAVOR_PRODUCTS 
    : FLAVOR_PRODUCTS.filter(item => item.category === filter);
    
  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'menu-card reveal active'; // Auto-reveal initially loaded items
    
    card.innerHTML = `
      <div class="menu-img-wrapper" style="background: ${product.colorGradient}; display: flex; align-items: center; justify-content: center; position: relative;">
        <span class="menu-badge ${product.badgeClass}">${product.badge}</span>
        <!-- Visual Stylized representation of flavor -->
        <div style="font-size: 5.5rem; color: rgba(255, 255, 255, 0.4); text-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); transition: transform 0.4s ease; transform-origin: bottom center;" class="flavor-svg-rep">
          <i class="fa-solid fa-ice-cream"></i>
        </div>
      </div>
      <div class="menu-info">
        <div class="menu-title-row">
          <h3 class="menu-item-title">${product.name}</h3>
          <span class="menu-item-price">$${product.price.toFixed(2)}</span>
        </div>
        <p class="menu-item-desc">${product.desc}</p>
        <div class="menu-card-footer">
          <div class="rating">
            <i class="fa-solid fa-star"></i>
            <span>${product.rating}</span>
          </div>
          <button class="add-cart-btn" onclick="addSignatureToCart('${product.id}')" aria-label="Add ${product.name} to Cart">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    
    // Add visual interactive scale effect on scoop display icon on hover
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.flavor-svg-rep');
      if(icon) icon.style.transform = 'scale(1.15) rotate(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.flavor-svg-rep');
      if(icon) icon.style.transform = 'scale(1) rotate(0deg)';
    });
    
    menuGrid.appendChild(card);
  });
}

// Menu Filters Switch
filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderMenu(btn.dataset.filter);
  });
});

// --- 6. Ice Cream Builder Logic ("Scoop Artisan") ---

// Vessel Selection
containerOptions.forEach(btn => {
  btn.addEventListener('click', () => {
    containerOptions.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    builderState.container = btn.dataset.container;
    
    // Update container visual representation
    if (builderState.container === 'cone') {
      builderContainerVisual.innerHTML = `<div class="cone-shape"></div>`;
    } else {
      builderContainerVisual.innerHTML = `<div class="cup-shape"></div>`;
    }
    
    updateBuilderUI();
  });
});

// Scoop Flavor Toggle / Adding
flavorBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const flavor = btn.dataset.flavor;
    
    if (builderState.scoops.length >= 3) {
      alert("A max of 3 scoops can be stacked on one cone/cup!");
      return;
    }
    
    // Add scoop to stack
    builderState.scoops.push(flavor);
    updateBuilderUI();
    renderScoopStack();
  });
});

// Render the visual Stack of Scoops
function renderScoopStack() {
  builderScoopStack.innerHTML = '';
  
  builderState.scoops.forEach((flavor, index) => {
    const scoop = document.createElement('div');
    scoop.className = `scoop-visual-item ${flavor}-scoop`;
    
    // Position/Z-index stacking
    scoop.style.zIndex = 5 + index;
    scoop.style.marginBottom = index === 0 ? '-35px' : '-45px';
    
    // Add click to remove scoop from the top/selected item
    scoop.setAttribute('title', 'Click to remove this scoop');
    scoop.addEventListener('click', () => {
      builderState.scoops.splice(index, 1);
      updateBuilderUI();
      renderScoopStack();
    });
    
    builderScoopStack.appendChild(scoop);
  });
}

// Toppings Toggle
toppingBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const topping = btn.dataset.topping;
    
    if (builderState.toppings.includes(topping)) {
      builderState.toppings = builderState.toppings.filter(t => t !== topping);
      btn.classList.remove('active');
    } else {
      builderState.toppings.push(topping);
      btn.classList.add('active');
    }
    
    updateBuilderUI();
    renderToppingsVisual();
  });
});

// Render the visual toppings overlay
function renderToppingsVisual() {
  builderToppingVisuals.innerHTML = '';
  
  builderState.toppings.forEach(topping => {
    const visual = document.createElement('div');
    visual.className = `${topping}-topping`;
    
    // Stagger/Overlay on top of the scoops
    if (builderState.scoops.length > 0) {
      const topScoopOffset = (builderState.scoops.length - 1) * 45; // stack height calculation
      visual.style.transform = `translateY(-${topScoopOffset}px)`;
    } else {
      visual.style.transform = 'translateY(20px)'; // if no scoops, render relative to cone base
    }
    
    builderToppingVisuals.appendChild(visual);
  });
}

// Update pricing and description outputs
function updateBuilderUI() {
  const containerCost = PRICING[builderState.container];
  const scoopsCost = builderState.scoops.length * PRICING.scoop;
  const toppingsCost = builderState.toppings.length * PRICING.topping;
  const total = containerCost + scoopsCost + toppingsCost;
  
  // Format summary texts
  const vesselText = builderState.container === 'cone' ? 'Waffle Cone' : 'Artisan Cup';
  summaryContainer.textContent = `${vesselText} ($${containerCost.toFixed(2)})`;
  
  if (builderState.scoops.length > 0) {
    const flavorNames = builderState.scoops.map(f => FLAVOR_DISPLAY_NAMES[f] || f);
    summaryScoops.textContent = `${flavorNames.join(', ')} ($${scoopsCost.toFixed(2)})`;
  } else {
    summaryScoops.textContent = 'None';
  }
  
  if (builderState.toppings.length > 0) {
    const toppingNames = builderState.toppings.map(t => t.charAt(0).toUpperCase() + t.slice(1));
    summaryToppings.textContent = `${toppingNames.join(', ')} ($${toppingsCost.toFixed(2)})`;
  } else {
    summaryToppings.textContent = 'None';
  }
  
  summaryTotal.textContent = `$${total.toFixed(2)}`;
}

// Reset Builder
clearBuilderBtn.addEventListener('click', resetBuilder);

function resetBuilder() {
  builderState = {
    container: 'cone',
    scoops: [],
    toppings: []
  };
  
  // Reset Vessel Option state
  containerOptions.forEach(btn => {
    if (btn.dataset.container === 'cone') btn.classList.add('active');
    else btn.classList.remove('active');
  });
  
  builderContainerVisual.innerHTML = `<div class="cone-shape"></div>`;
  
  // Clear topping button toggles
  toppingBtns.forEach(btn => btn.classList.remove('active'));
  
  builderScoopStack.innerHTML = '';
  builderToppingVisuals.innerHTML = '';
  
  updateBuilderUI();
}

// Add custom Stack to Shopping Cart
addCustomCartBtn.addEventListener('click', () => {
  if (builderState.scoops.length === 0) {
    alert("Please stack at least one delicious scoop to add to your cart!");
    return;
  }
  
  const containerCost = PRICING[builderState.container];
  const scoopsCost = builderState.scoops.length * PRICING.scoop;
  const toppingsCost = builderState.toppings.length * PRICING.topping;
  const total = containerCost + scoopsCost + toppingsCost;
  
  const vesselName = builderState.container === 'cone' ? 'Cone' : 'Cup';
  const scoopNames = builderState.scoops.map(f => FLAVOR_DISPLAY_NAMES[f] || f).join(' + ');
  const toppingsString = builderState.toppings.length > 0 
    ? ` with ${builderState.toppings.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}`
    : '';
    
  const item = {
    id: `custom_${Date.now()}`,
    name: `Custom ${vesselName}`,
    details: `${scoopNames}${toppingsString}`,
    price: total,
    quantity: 1,
    isCustom: true
  };
  
  cart.push(item);
  updateCart();
  resetBuilder();
  openCartDrawer();
});

// --- 7. Shopping Cart Operations ---

// Open Cart Overlay
cartToggleBtn.addEventListener('click', openCartDrawer);
function openCartDrawer() {
  cartOverlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Lock background scrolling
}

// Close Cart Overlay
cartCloseBtn.addEventListener('click', closeCartDrawer);
cartOverlay.addEventListener('click', (e) => {
  if (e.target === cartOverlay) closeCartDrawer();
});

function closeCartDrawer() {
  cartOverlay.classList.remove('open');
  document.body.style.overflow = 'auto'; // Unlock background scrolling
}

// Add Signature Flavor to Cart
window.addSignatureToCart = function(productId) {
  const product = FLAVOR_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  // Check if item already in cart
  const existingItem = cart.find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: `sig_${productId}_${Date.now()}`,
      productId: productId,
      name: product.name,
      details: 'Signature Single Scoop',
      price: product.price,
      quantity: 1,
      isCustom: false
    });
  }
  
  updateCart();
  
  // Add animation pulse to cart icon
  cartToggleBtn.style.transform = 'scale(1.25)';
  setTimeout(() => {
    cartToggleBtn.style.transform = 'scale(1)';
  }, 200);
};

// Remove item from Cart
window.removeItemFromCart = function(itemId) {
  cart = cart.filter(item => item.id !== itemId);
  updateCart();
};

// Update Cart Display details
function updateCart() {
  // Empty State Toggle
  if (cart.length === 0) {
    emptyCartMessage.style.display = 'flex';
    cartItemsList.querySelectorAll('.cart-item').forEach(el => el.remove());
  } else {
    emptyCartMessage.style.display = 'none';
    
    // Remove existing items and rebuild list
    cartItemsList.querySelectorAll('.cart-item').forEach(el => el.remove());
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name} ${item.quantity > 1 ? `x${item.quantity}` : ''}</h4>
          <p>${item.details}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="remove-item-btn" onclick="removeItemFromCart('${item.id}')" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      cartItemsList.appendChild(cartItem);
    });
  }
  
  // Calculate Totals
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartCount.textContent = totalCount;
  cartTotalSum.textContent = `$${totalPrice.toFixed(2)}`;
  
  // Animation bounce on badge
  if (totalCount > 0) {
    cartCount.style.animation = 'scale-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2)';
    setTimeout(() => {
      cartCount.style.animation = 'none';
    }, 300);
  }
}

// Checkout Button Click
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Your cart is empty! Build a stack or pick signature flavors first.");
    return;
  }
  
  alert(`Thank you for choosing Scoop Paradise! Your order of ${cart.reduce((s, i) => s + i.quantity, 0)} items total ($${cartTotalSum.textContent}) has been received. Churning it fresh!`);
  cart = [];
  updateCart();
  closeCartDrawer();
});

// --- 8. Testimonials / Reviews Slider ---
function initReviewsSlider() {
  let currentIndex = 0;
  const cards = document.querySelectorAll('.review-card');
  const totalCards = cards.length;
  
  function updateSliderPosition() {
    // Determine screen sizing/flex layout spacing
    const screenWidth = window.innerWidth;
    let cardWidthPercent = 100; // Mobile view default
    let gap = 30;
    
    if (screenWidth > 992) {
      cardWidthPercent = 33.333; // Desktop
    } else if (screenWidth > 768) {
      cardWidthPercent = 50; // Tablet
    }
    
    // We adjust flex track layout
    const itemOffset = cards[0].getBoundingClientRect().width + gap;
    reviewsTrack.style.transform = `translateX(-${currentIndex * itemOffset}px)`;
  }
  
  nextReviewBtn.addEventListener('click', () => {
    const maxVisible = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
    if (currentIndex < totalCards - maxVisible) {
      currentIndex++;
    } else {
      currentIndex = 0; // loop back to first
    }
    updateSliderPosition();
  });
  
  prevReviewBtn.addEventListener('click', () => {
    const maxVisible = window.innerWidth > 992 ? 3 : (window.innerWidth > 768 ? 2 : 1);
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalCards - maxVisible; // go to end
    }
    updateSliderPosition();
  });
  
  // Recalculate slider sizing on window resize
  window.addEventListener('resize', updateSliderPosition);
}

// --- 9. IntersectionObserver Reveal Animation ---
function initScrollEffects() {
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep layout light
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
}
