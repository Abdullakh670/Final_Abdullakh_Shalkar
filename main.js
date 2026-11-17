// Live countdown to the next match: <div data-countdown="2026-11-21T21:00:00+01:00">
(function () {
    const box = document.querySelector('[data-countdown]');
    if (!box) return;
    const target = new Date(box.dataset.countdown).getTime();
    const pad = n => String(n).padStart(2, '0');
    function tick() {
        let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
        if (s === 0) {
            clearInterval(timer);
            box.innerHTML = '<div class="match-day">Match day at the Bernabéu!</div>';
            return;
        }
        const d = Math.floor(s / 86400); s %= 86400;
        const h = Math.floor(s / 3600); s %= 3600;
        const m = Math.floor(s / 60); s %= 60;
        box.innerHTML = [[d, 'days'], [pad(h), 'hours'], [pad(m), 'min'], [pad(s), 'sec']]
            .map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join('');
    }
    const timer = setInterval(tick, 1000);
    tick();
})();

// Count-up numbers when the strip scrolls into view
(function () {
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const end = +e.target.dataset.count, t0 = performance.now();
        (function step(t) {
            const p = Math.min(1, (t - t0) / 1400);
            e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        })(t0);
    }), { threshold: .6 });
    nums.forEach(n => { n.textContent = '0'; io.observe(n); });
})();

// If images/bernabeu.jpg exists, use it as the hero background behind the animated scene
(function () {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const im = new Image();
    im.onload = () => hero.classList.add('has-photo');
    im.src = 'images/bernabeu.jpg';
})();

// Cart counter in the navigation bar (cart is saved in localStorage)
function updateGlobalCartCount() {
    const badge = document.getElementById('globalCartCount');
    if (!badge) return;
    
    let cart = {};
    try {
        cart = JSON.parse(localStorage.getItem('rmCart')) || {};
    } catch (e) {
        cart = {};
    }
    
    let totalCount = 0;
    for (let id in cart) {
        totalCount += Number(cart[id]) || 0;
    }
    
    if (totalCount > 0) {
        badge.textContent = totalCount;
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}
document.addEventListener('DOMContentLoaded', updateGlobalCartCount);

// Image fallback for images marked with data-fallback: try the next file type, then remove the image
(function () {
    const next = { jpg: 'png', png: 'svg' };
    function handle(img) {
        const m = img.getAttribute('src').match(/\.(jpg|png)$/);
        if (!img.dataset.t && m) {
            img.dataset.t = 1;
            img.src = img.getAttribute('src').replace(/\.(jpg|png)$/, '.' + next[m[1]]);
        } else {
            img.remove();
        }
    }
    document.addEventListener('error', e => {
        if (e.target.tagName === 'IMG' && e.target.hasAttribute('data-fallback')) handle(e.target);
    }, true);
    // images that failed before this script ran
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img[data-fallback]').forEach(img => {
            if (img.complete && img.naturalWidth === 0) handle(img);
        });
    });
})();
