
/* ============================================================
   Переключатель темы
   ============================================================ */

var root = document.documentElement;

function setTheme(theme) {
    root.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);

    var icon = document.getElementById('themeIcon');
    if (icon) {
        icon.classList.toggle('bi-moon-stars', theme === 'dark');
        icon.classList.toggle('bi-sun', theme === 'light');
    }
}

setTheme(localStorage.getItem('theme') || 'dark');

document.addEventListener('click', function (event) {
    var button = event.target.closest('#themeToggle');
    if (!button) return;

    var next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
});