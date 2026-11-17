// Light / dark mode. The saved theme is applied in <head> (inline script) before paint;
// this file handles the toggle button and keeps the choice in localStorage.
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!btn) return;

    const isDark = () => root.getAttribute('data-bs-theme') === 'dark';

    function updateButton() {
        const dark = isDark();
        if (icon) icon.textContent = dark ? '☀️' : '🌙';
        btn.setAttribute('aria-pressed', String(dark));
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    btn.addEventListener('click', () => {
        const next = isDark() ? 'light' : 'dark';
        root.setAttribute('data-bs-theme', next);
        try { localStorage.setItem('rmTheme', next); } catch (e) { /* storage unavailable */ }
        updateButton();
    });

    updateButton();
});
