export const routes = {
    '/': 'home.html',
    '/profile': 'profile.html',
    '/login': 'auth/login.html',
    '/profile/': 'profile.html',
    '/login/': 'auth/login.html',
    '/register_db': 'auth/connect_db.html',
    '/register_db/': 'auth/connect_db.html',
    '/admin_reg': 'auth/admin_reg.html',
    '/admin_reg/': 'auth/admin_reg.html',
    '/about': 'about.html',
    '/about/': 'about.html',
};

export const titles = {
    '/': 'Главная',
    '/profile': 'Профиль',
    '/login': 'Вход',
    '/about': 'About',
    '/register_db': 'Настройка базы данных',
    '/admin_reg': 'Регистрация',
};

export const PUBLIC_ROUTES = [
    '/login', 
    '/login/',
    '/register_db', 
    '/register_db/', 
    '/admin_reg', 
    '/admin_reg/'
];
