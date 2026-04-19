/* ============================================================
   SAVORIA PREMIUM - MAIN JAVASCRIPT
   File: public/js/app.js
   ============================================================ */

'use strict';

/* ── STATE ─────────────────────────────────────────────────── */
const state = {
  currentCat: 'semua',
  searchQuery: '',
  user: null,
};

/* ── DOM REFS ───────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── NAVBAR SCROLL ──────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const nav = $('.navbar');
  nav.classList.toggle('scrolled', window.scrollY > 10);
  const scrollBtn = $('.scroll-top');
  if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
});

/* ── HAMBURGER MENU ─────────────────────────────────────────── */
function initHamburger() {
  const btn   = $('.hamburger');
  const links = $('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  // Close on link click
  $$('a', links).forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
}

/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ── SCROLL TO TOP ──────────────────────────────────────────── */
function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.innerHTML = '↑';
  btn.title = 'Kembali ke atas';
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);
}

/* ── TOAST NOTIFICATION ─────────────────────────────────────── */
function showToast(message, type = 'success') {
  let toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.innerHTML = (type === 'success' ? '✅' : '❌') + ' ' + message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ── CATEGORY FILTER ─────────────────────────────────────────── */
function filterCategory(cat, btn) {
  state.currentCat = cat;
  $$('.pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts();
}

/* ── SEARCH ─────────────────────────────────────────────────── */
function initSearch() {
  const input = $('#searchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    state.searchQuery = input.value.toLowerCase().trim();
    renderProducts();
  });
}

/* ── PRODUCTS DATA (fallback saat PHP tidak tersedia) ────────── */
const productsData = [
  { id:1,  nama:'Kopi Kenangan Mantan',       harga:20000, category_slug:'minuman',        card_badge:'badge-coffee',  badge_label:'Coffee Shop',     gambar_url:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', rating:4.7, total_terjual:150, nama_vendor:'Cikarang Festival (Cifest)', wilayah:'Cikarang Selatan', maps_url:'https://maps.app.goo.gl/uDafvmhJ1Yyshqgw5' },
  { id:2,  nama:'Seblak Mewek',               harga:10000, category_slug:'makanan-pedas',  card_badge:'badge-pedas',   badge_label:'Makanan Pedas',   gambar_url:'https://nibble-images.b-cdn.net/nibble/original_images/389848189.jpg?class=large', rating:4.8, total_terjual:320, nama_vendor:'Bumi Cikarang Makmur (BCM)', wilayah:'Cikarang Selatan', maps_url:'https://maps.app.goo.gl/R3NP87mG3RtouSR66' },
  { id:3,  nama:'Salad Buah Caramel SBC',     harga:20000, category_slug:'dessert',        card_badge:'badge-dessert', badge_label:'Dessert',         gambar_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWwANnimH7fTHHwvkSi88hgoGqxSn7lzLrpw&s', rating:4.7, total_terjual:400, nama_vendor:'Caramel SBC', wilayah:'Cikarang Selatan', maps_url:'https://maps.app.goo.gl/kCQqgXLuwgpDKbyz9' },
  { id:4,  nama:'Dawet Durian Ratu',          harga:15000, category_slug:'minuman',        card_badge:'badge-minuman', badge_label:'Minuman',         gambar_url:'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/7a23ed74-50ed-4ae2-8a02-257e0ece8a82_Go-Biz_20210830_102906.jpeg', rating:4.6, total_terjual:120, nama_vendor:'Dawet Durian Ratu Cikarang', wilayah:'Cikarang Timur', maps_url:'https://maps.app.goo.gl/TwQ9XNsc4iM2cBVK8' },
  { id:5,  nama:'Lucky Drink & Rokupang',     harga:10000, category_slug:'minuman',        card_badge:'badge-minuman', badge_label:'Minuman',         gambar_url:'https://www.biggerbolderbaking.com/wp-content/uploads/2015/05/BBB71-Homemade-Ice-Cream-Milkshakes-Thumbnail-v.1.jpg', rating:4.9, total_terjual:85, nama_vendor:'Lucky Drink & Rokupang', wilayah:'Cikarang Utara', maps_url:'https://maps.app.goo.gl/QxG8dhD5P6m2Ama39' },
  { id:6,  nama:'Nasi Padang Fahmi',          harga:15000, category_slug:'makanan-berat',  card_badge:'badge-berat',   badge_label:'Makanan Berat',   gambar_url:'https://katasumbar.com/wp-content/uploads/2023/07/Seporsi-Nasi-Padang.jpg', rating:4.8, total_terjual:340, nama_vendor:'Nasi Padang Fahmi', wilayah:'Cikarang Selatan', maps_url:'https://maps.app.goo.gl/KtXBcrNAHr2A5hh38' },
  { id:7,  nama:'Oniisan Japanese Cuisine',   harga:15000, category_slug:'makanan-berat',  card_badge:'badge-berat',   badge_label:'Makanan Berat',   gambar_url:'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400&q=80', rating:4.8, total_terjual:210, nama_vendor:'Oniisan Japanese Cuisine CINITY', wilayah:'Cikarang Utara', maps_url:'https://maps.app.goo.gl/MEUJiZNuoQcqcPAj7' },
  { id:8,  nama:'Es Doger Babang Bayu',       harga:5000,  category_slug:'minuman',        card_badge:'badge-minuman', badge_label:'Minuman',         gambar_url:'https://superapp.id/blog/wp-content/uploads/2022/04/jajansolo_69295374_2443349222573675_3245694075287370282_n-570x468.jpg', rating:4.8, total_terjual:150, nama_vendor:'Es Doger Babang Bayu', wilayah:'Cikarang Utara', maps_url:'https://maps.app.goo.gl/fumrx6rAMSz9SC2u9' },
  { id:9,  nama:'Royal Smoothies',            harga:15000, category_slug:'minuman',        card_badge:'badge-minuman', badge_label:'Minuman',         gambar_url:'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400&q=80', rating:4.8, total_terjual:95, nama_vendor:'Royal Smoothies', wilayah:'Cikarang Selatan', maps_url:'https://maps.app.goo.gl/xi8iwbDUJFzHMC6n8' },
  { id:10, nama:'Surabi Kedai Kang Ade',      harga:5000,  category_slug:'makanan-ringan', card_badge:'badge-ringan',  badge_label:'Makanan Ringan',  gambar_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaZoNOoQQIKwNjbDzVCm5fbEdiOV4tAtJDQA&s', rating:4.8, total_terjual:180, nama_vendor:'Kedai Kang Ade', wilayah:'Cikarang Selatan', maps_url:'https://maps.app.goo.gl/rG7P8nJRzpRQVdKw8' },
  { id:11, nama:'Fuji Matcha',                harga:12000, category_slug:'minuman',        card_badge:'badge-minuman', badge_label:'Minuman',         gambar_url:'https://down-id.img.susercontent.com/file/id-11134207-7ra0m-mckcoi91u6mv36', rating:4.8, total_terjual:120, nama_vendor:'Fuji Matcha Cikarang', wilayah:'Cikarang Pusat', maps_url:'https://maps.app.goo.gl/h4MWbyWuW4pbUQ5d9' },
  { id:12, nama:'Donatsu',                    harga:8000,  category_slug:'dessert',        card_badge:'badge-dessert', badge_label:'Dessert',         gambar_url:'https://i.gojekapi.com/darkroom/gofood-indonesia/v2/images/uploads/e795e40f-8c42-4b32-954a-ba56dde6fc71_Go-Biz_20240608_114524.jpeg', rating:4.8, total_terjual:300, nama_vendor:'Donatsu Jababeka Cikarang', wilayah:'Cikarang Utara', maps_url:'https://maps.app.goo.gl/Ae14iY5XK56S16tHA' },
  { id:13, nama:'Sate Taichan Senayan',       harga:25000, category_slug:'makanan-pedas',  card_badge:'badge-pedas',   badge_label:'Makanan Pedas',   gambar_url:'https://upload.wikimedia.org/wikipedia/commons/1/16/Sate_taichan_jakarta.jpg', rating:4.7, total_terjual:220, nama_vendor:'Sate Taichan Bang Ocit', wilayah:'Cikarang Utara', maps_url:'https://maps.app.goo.gl/kLvHburG86om6PCe6' },
  { id:14, nama:'Queen Es Krim',              harga:10000, category_slug:'minuman',        card_badge:'badge-minuman', badge_label:'Minuman',         gambar_url:'https://tse3.mm.bing.net/th/id/OIP.ZzV83aks5VoTzhzqs3lswwAAAA?pid=Api&h=220&P=0', rating:4.6, total_terjual:150, nama_vendor:'Queen Es Krim', wilayah:'Cikarang Timur', maps_url:'https://maps.app.goo.gl/yeoctNJARvLpQY2b7' },
  { id:15, nama:'Es Sakaw',                   harga:15000, category_slug:'minuman',        card_badge:'badge-minuman', badge_label:'Minuman',         gambar_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLWw7pqD7TiMBk5hinA7Vmrw-ofukFgux9GQ&s', rating:4.6, total_terjual:0, nama_vendor:'Es Sakaw, Es Mujito, Es Boba', wilayah:'Cikarang Barat', maps_url:'https://maps.app.goo.gl/dtruojaStFruUKp96' },
  { id:16, nama:'Sate Maranggi',              harga:30000, category_slug:'makanan-berat',  card_badge:'badge-berat',   badge_label:'Makanan Berat',   gambar_url:'https://images.aws.nestle.recipes/original/c3154a6bd035b2cea65301c7bd7eac83_recipe_website_images_14_juli_1500x700_sate-maranggi.jpg', rating:4.6, total_terjual:0, nama_vendor:'Sate Maranggi OTW Sukses', wilayah:'Cikarang Barat', maps_url:'https://maps.app.goo.gl/rJyNzzeMJdoU8Vg86' },
  { id:17, nama:'Mille Crepes',               harga:15000, category_slug:'dessert',        card_badge:'badge-dessert', badge_label:'Dessert',         gambar_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvuP2b2FU9MpcolDUoTeKAiWoN44eYmvnRGQ&s', rating:4.6, total_terjual:0, nama_vendor:'Mille Crepes', wilayah:'Cikarang Timur', maps_url:'https://maps.app.goo.gl/BmA9bL6ayAHg3eRv6' },
  { id:18, nama:'Bakso & Mie Ayam Mas Dawer', harga:25000, category_slug:'makanan-berat',  card_badge:'badge-berat',   badge_label:'Makanan Berat',   gambar_url:'https://garasijogja.com/wp-content/uploads/2018/12/kulineryogya.jpg', rating:4.6, total_terjual:0, nama_vendor:'Bakso & Mie Ayam Mas Dawer', wilayah:'Cikarang Timur', maps_url:'https://maps.app.goo.gl/kKxGKTsHUtgE3rt29' },
  { id:19, nama:'Korean Milky Snow Ice',      harga:25000, category_slug:'dessert',        card_badge:'badge-dessert', badge_label:'Dessert',         gambar_url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYFDLe7K1Uyc1zJ3eL6XFjjsR03UPLC8pa1A&s', rating:4.6, total_terjual:0, nama_vendor:'Misnow Korean Milky Snow', wilayah:'Cikarang Pusat', maps_url:'https://www.google.com/maps/search/Misnow+Korean+Milky+Snow+Ice+Jayamukti+Cikarang+Pusat' },
];

function formatRupiah(num) {
  return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function getCategoryBadge(slug) {
  const map = {
    'minuman':        ['badge-minuman','Minuman'],
    'makanan-berat':  ['badge-berat',  'Makanan Berat'],
    'dessert':        ['badge-dessert','Dessert'],
    'makanan-ringan': ['badge-ringan', 'Makanan Ringan'],
    'makanan-pedas':  ['badge-pedas',  'Makanan Pedas'],
  };
  return map[slug] || ['badge-ringan', slug];
}

function buildCard(p) {
  const [badgeClass, badgeLabel] = p.card_badge
    ? [p.card_badge, p.badge_label]
    : getCategoryBadge(p.category_slug);
  const terjual = p.total_terjual > 0 ? `· ${p.total_terjual} Terjual` : '';
  return `
    <div class="product-card" data-cat="${p.category_slug}">
      <div class="card-img-wrap">
        <img src="${p.gambar_url}" alt="${p.nama}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80'"/>
        <span class="card-badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="card-body">
        <div class="card-name">${p.nama}</div>
        <div class="card-vendor">${p.nama_vendor}</div>
        <a class="card-location" href="${p.maps_url}" target="_blank" rel="noopener">
          <span>📍</span> ${p.wilayah}
        </a>
        <div class="card-footer">
          <div class="card-meta">⭐ ${p.rating} ${terjual}</div>
          <div class="card-price">${formatRupiah(p.harga)}</div>
        </div>
      </div>
    </div>`;
}

function renderProducts() {
  const grid = $('#productsGrid');
  if (!grid) return;

  let filtered = productsData.filter(p => {
    const matchCat   = state.currentCat === 'semua' || p.category_slug === state.currentCat;
    const matchQuery = !state.searchQuery ||
      p.nama.toLowerCase().includes(state.searchQuery) ||
      p.nama_vendor.toLowerCase().includes(state.searchQuery) ||
      p.wilayah.toLowerCase().includes(state.searchQuery);
    return matchCat && matchQuery;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--gray)">
      <div style="font-size:48px;margin-bottom:12px">🍽️</div>
      <p style="font-size:16px">Produk tidak ditemukan untuk pencarian "<strong>${state.searchQuery}</strong>"</p>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(buildCard).join('');
}

/* ── LOGIN MODAL ─────────────────────────────────────────────── */
function initModal() {
  const overlay  = $('#loginModal');
  const openBtns = $$('[data-open-modal]');
  const closeBtn = $('.modal-close');
  const tabs      = $$('.modal-tab');
  const panels    = $$('.modal-panel');

  if (!overlay) return;

  openBtns.forEach(b => b.addEventListener('click', () => overlay.classList.add('active')));
  closeBtn?.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      panels[i]?.classList.add('active');
    });
  });
}

/* ── AUTH FORMS ──────────────────────────────────────────────── */
function initAuth() {
  // Check stored session
  const saved = sessionStorage.getItem('savoria_user');
  if (saved) {
    state.user = JSON.parse(saved);
    updateNavUser();
  }

  // Login form
  const loginForm = $('#loginForm');
  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email    = $('#loginEmail').value.trim();
    const password = $('#loginPassword').value;
    const btn      = loginForm.querySelector('.btn-primary');

    if (!email || !password) { showToast('Isi semua field!', 'error'); return; }

    btn.textContent = 'Memproses...'; btn.disabled = true;

    try {
      // Try real API first
      const res = await fetch('backend/api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        state.user = data.user;
        sessionStorage.setItem('savoria_user', JSON.stringify(data.user));
        updateNavUser();
        $('#loginModal').classList.remove('active');
        showToast(`Selamat datang, ${data.user.nama}! 👋`);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      // Demo mode fallback
      if (email === 'demo@savoria.com' && password === 'Demo1234') {
        const demoUser = { id: 1, nama: 'Demo User', email, role: 'user' };
        state.user = demoUser;
        sessionStorage.setItem('savoria_user', JSON.stringify(demoUser));
        updateNavUser();
        $('#loginModal').classList.remove('active');
        showToast('Login demo berhasil! 👋');
      } else {
        showToast('Gunakan demo@savoria.com / Demo1234', 'error');
      }
    } finally {
      btn.textContent = 'Masuk'; btn.disabled = false;
    }
  });

  // Register form
  const regForm = $('#registerForm');
  regForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const nama     = $('#regNama').value.trim();
    const email    = $('#regEmail').value.trim();
    const password = $('#regPassword').value;
    const btn      = regForm.querySelector('.btn-primary');

    const passRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passRegex.test(password)) {
      showToast('Password min. 8 karakter, harus ada huruf & angka.', 'error'); return;
    }

    btn.textContent = 'Mendaftar...'; btn.disabled = true;
    try {
      const res = await fetch('backend/api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, password })
      });
      const data = await res.json();
      showToast(data.message, data.success ? 'success' : 'error');
      if (data.success) {
        // Switch to login tab
        $$('.modal-tab')[0].click();
      }
    } catch {
      showToast('Registrasi berhasil (demo)! Silakan login.', 'success');
      $$('.modal-tab')[0].click();
    } finally {
      btn.textContent = 'Daftar Sekarang'; btn.disabled = false;
    }
  });

  // Logout
  const logoutBtn = $('#logoutBtn');
  logoutBtn?.addEventListener('click', () => {
    state.user = null;
    sessionStorage.removeItem('savoria_user');
    updateNavUser();
    showToast('Berhasil logout.');
  });
}

function updateNavUser() {
  const navActions = $('.nav-actions');
  if (!navActions) return;
  if (state.user) {
    const initials = state.user.nama.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
    navActions.innerHTML = `
      <div class="user-pill">
        <div class="avatar">${initials}</div>
        <span>${state.user.nama}</span>
      </div>
      <button class="btn btn-secondary" id="logoutBtn" style="padding:9px 18px;font-size:13px">Keluar</button>`;
    document.getElementById('logoutBtn').addEventListener('click', () => {
      state.user = null;
      sessionStorage.removeItem('savoria_user');
      updateNavUser();
      showToast('Berhasil logout.');
    });
  } else {
    navActions.innerHTML = `<a href="#" class="nav-login-btn" data-open-modal>Login</a>`;
    $$('[data-open-modal]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('loginModal')?.classList.add('active');
    }));
  }
}

/* ── CONTACT FORM ────────────────────────────────────────────── */
function initContact() {
  const form = $('#contactForm');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const nama  = $('#contactNama').value.trim();
    const email = $('#contactEmail').value.trim();
    const pesan = $('#contactPesan').value.trim();
    const msg   = $('#contactMsg');
    const btn   = form.querySelector('.btn-primary');

    if (!nama || !email || !pesan) { showToast('Isi semua field!', 'error'); return; }

    btn.textContent = 'Mengirim...'; btn.disabled = true;
    try {
      const res = await fetch('backend/api/contact.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, pesan })
      });
      const data = await res.json();
      msg.className = `form-msg ${data.success ? 'success' : 'error'}`;
      msg.textContent = data.message;
      if (data.success) form.reset();
    } catch {
      msg.className = 'form-msg success';
      msg.textContent = 'Pesan berhasil dikirim! (Demo mode)';
      form.reset();
    } finally {
      btn.textContent = 'Kirim Pesan'; btn.disabled = false;
      setTimeout(() => { msg.className = 'form-msg'; }, 5000);
    }
  });
}

/* ── INTERSECTION OBSERVER (animation on scroll) ────────────── */
function initAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('.product-card').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.05}s`;
    el.style.animationPlayState = 'paused';
    io.observe(el);
  });
}

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initSmoothScroll();
  initScrollTop();
  initSearch();
  initModal();
  initAuth();
  initContact();
  renderProducts();
  setTimeout(initAnimations, 100);
});

// Expose global functions for inline HTML
window.filterCategory = filterCategory;
