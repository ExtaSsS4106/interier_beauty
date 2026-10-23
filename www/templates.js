(function (global) {
  var templates = {};
  var env = null;

  (function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["about.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "about.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"row g-4\">\n\n    <div class=\"col-12\">\n        <div class=\"card border-0 shadow-sm\">\n            <div class=\"card-body p-4\">\n                <div class=\"d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3\">\n                    <a href=\"#/\">\n                        main\n                    </a>\n                    \n                    <div class=\"row g-3\">\n                        <div class=\"col-auto\">\n                            <p>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "extraData")),"message"), env.opts.autoescape);
output += "</p>\n                        </div>\n                        <div class=\"col-auto\">\n                            <input id=\"inputText\" type=\"text\" class=\"form-control\"  placeholder=\"text\">\n                        </div>\n                        <div class=\"col-auto\">\n                            <button id=\"sendText\" class=\"btn btn-primary mb-3\">send message</button>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    \n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/_layout.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "\n<div class=\"container\">\n    <div class=\"row justify-content-center align-items-center min-vh-100 py-5\">\n        <div class=\"col-12 col-sm-10 col-md-8 col-lg-10 col-xl-6\">\n            ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
output += t_1;
output += "\n        </div>\n    </div>\n</div>\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
output += t_3;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 5;
var colno = 15;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 10;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/admin_reg.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("auth/_layout.html", true, "auth/admin_reg.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("title"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
output += t_8;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_title(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "Регистрация — ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 4;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"card shadow-lg border-0 rounded-4\">\n    <div class=\"card-body p-4 p-md-5\">\n\n        <div class=\"text-center mb-4\">\n            <div class=\"d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3\"\n                 style=\"width:64px;height:64px;\">\n                <i class=\"bi bi-person-plus fs-2\"></i>\n            </div>\n            <h1 class=\"h3 fw-bold mb-2\">Создать аккаунт</h1>\n            <p class=\"text-body-secondary small mb-0\">Заполните форму, чтобы начать</p>\n        </div>\n\n        <div class=\"alert alert-success d-none align-items-center gap-2\"\n             id=\"successAlert\" role=\"alert\">\n            <i class=\"bi bi-check-circle-fill\"></i>\n            <div>Аккаунт создан! Перенаправляем…</div>\n        </div>\n\n        <div class=\"alert alert-danger d-none align-items-center gap-2 py-2 small\"\n             id=\"nonFieldAlert\" role=\"alert\">\n            <i class=\"bi bi-exclamation-triangle-fill\"></i>\n            <div id=\"nonFieldText\"></div>\n        </div>\n\n        <form id=\"registerForm\" novalidate>\n\n            <!-- Имя и фамилия -->\n            <div class=\"row g-3 mb-3\">\n                <div class=\"col-12 col-sm-6\">\n                    <label for=\"firstName\" class=\"form-label\">Имя</label>\n                    <input type=\"text\" class=\"form-control form-control-lg\" id=\"firstName\"\n                           name=\"first_name\" placeholder=\"Иван\" maxlength=\"255\" required>\n                    <div class=\"invalid-feedback\" id=\"firstNameError\">Введите имя.</div>\n                </div>\n                <div class=\"col-12 col-sm-6\">\n                    <label for=\"lastName\" class=\"form-label\">Фамилия</label>\n                    <input type=\"text\" class=\"form-control form-control-lg\" id=\"lastName\"\n                           name=\"last_name\" placeholder=\"Иванов\" maxlength=\"255\" required>\n                    <div class=\"invalid-feedback\" id=\"lastNameError\">Введите фамилию.</div>\n                </div>\n            </div>\n\n            <!-- Email -->\n            <div class=\"mb-3\">\n                <label for=\"email\" class=\"form-label\">Email</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-envelope\"></i></span>\n                    <input type=\"email\"\n                           class=\"form-control\"\n                           id=\"email\"\n                           name=\"email\"\n                           placeholder=\"name@example.com\"\n                           maxlength=\"255\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"emailError\">\n                        Введите корректный email.\n                    </div>\n                </div>\n            </div>\n            <!-- Роль -->\n            <div class=\"mb-3\">\n                <label for=\"role\" class=\"form-label\">Роль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person-badge\"></i></span>\n                    <select class=\"form-select\" id=\"role\" name=\"role\" required>\n                        <option value=\"\" disabled selected>Выберите роль…</option>\n                        <option value=\"user\">Пользователь</option>\n                        <option value=\"admin\">Администратор</option>\n                    </select>\n                    <div class=\"invalid-feedback\" id=\"roleError\">\n                        Выберите роль.\n                    </div>\n                </div>\n            </div>\n            <!-- Пароль -->\n            <div class=\"mb-3\">\n                <label for=\"password\" class=\"form-label\">Пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-key\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password\"\n                           name=\"password\"\n                           placeholder=\"••••••••\"\n                           minlength=\"8\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"passwordError\">\n                        Пароль должен содержать минимум 8 символов.\n                    </div>\n                </div>\n\n                <div class=\"progress mt-2\" style=\"height:6px;\" role=\"progressbar\"\n                     aria-label=\"Надёжность пароля\" aria-valuemin=\"0\" aria-valuemax=\"4\" aria-valuenow=\"0\">\n                    <div class=\"progress-bar\" id=\"strengthBar\" style=\"width:0%\"></div>\n                </div>\n                <div class=\"form-text\" id=\"strengthText\">Минимум 8 символов, буквы и цифры</div>\n            </div>\n\n            <!-- Подтверждение пароля (только проверка на клиенте, на сервер не отправляется) -->\n            <div class=\"mb-3\">\n                <label for=\"password2\" class=\"form-label\">Подтвердите пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-shield-check\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password2\"\n                           placeholder=\"••••••••\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword2\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon2\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"password2Error\">\n                        Пароли не совпадают.\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"submit\" class=\"btn btn-primary btn-lg w-100 mb-3\" id=\"submitBtn\">\n                <span class=\"spinner-border spinner-border-sm me-2 d-none\"\n                      id=\"submitSpinner\" role=\"status\" aria-hidden=\"true\"></span>\n                <i class=\"bi bi-person-plus me-1\" id=\"submitIcon\"></i>\n                <span id=\"submitText\">Зарегистрироваться</span>\n            </button>\n        </form>\n\n        <div class=\"text-center\">\n            <span class=\"text-body-secondary small\">Уже есть аккаунт?</span>\n            <a href=\"#/login\" class=\"text-decoration-none small\">Войти</a>\n        </div>\n\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 148;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const form = document.getElementById('registerForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const nonFieldAlert = document.getElementById('nonFieldAlert');\n    const nonFieldText  = document.getElementById('nonFieldText');\n\n    function showNonField(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    const fields = {\n        first_name: document.getElementById('firstName'),\n        last_name:  document.getElementById('lastName'),\n        email:      document.getElementById('email'),\n        role:       document.getElementById('role'),        // ← новое\n        password:   document.getElementById('password'),\n        password2:  document.getElementById('password2'),\n    };\n\n    const errors = {\n        first_name: document.getElementById('firstNameError'),\n        last_name:  document.getElementById('lastNameError'),\n        email:      document.getElementById('emailError'),\n        role:       document.getElementById('roleError'),   // ← новое\n        password:   document.getElementById('passwordError'),\n        password2:  document.getElementById('password2Error'),\n    };\n\n    const names = Object.keys(fields);\n\n    const strengthBar  = document.getElementById('strengthBar');\n    const strengthText = document.getElementById('strengthText');\n\n    const submitBtn     = document.getElementById('submitBtn');\n    const submitSpinner = document.getElementById('submitSpinner');\n    const submitIcon    = document.getElementById('submitIcon');\n    const submitText    = document.getElementById('submitText');\n    const successAlert  = document.getElementById('successAlert');\n\n    // ----- Просмотр пароля -----\n    function setupToggle(btnId, iconId, input) {\n        const btn  = document.getElementById(btnId);\n        const icon = document.getElementById(iconId);\n        btn.addEventListener('click', () => {\n            const hidden = input.type === 'password';\n            input.type = hidden ? 'text' : 'password';\n            icon.classList.toggle('bi-eye', !hidden);\n            icon.classList.toggle('bi-eye-slash', hidden);\n            btn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n        });\n    }\n    setupToggle('togglePassword',  'toggleIcon',  fields.password);\n    setupToggle('togglePassword2', 'toggleIcon2', fields.password2);\n\n    // ----- Валидаторы -----\n    const validators = {\n        first_name() {\n            const v = fields.first_name.value.trim();\n            if (!v) return 'Введите имя.';\n            if (v.length > 255) return 'Максимум 255 символов.';\n            return '';\n        },\n        last_name() {\n            const v = fields.last_name.value.trim();\n            if (!v) return 'Введите фамилию.';\n            if (v.length > 255) return 'Максимум 255 символов.';\n            return '';\n        },\n        email() {\n            const v = fields.email.value.trim();\n            if (!v) return 'Введите email.';\n            if (v.length > 255) return 'Максимум 255 символов.';\n            if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return 'Введите корректный email.';\n            return '';\n        },\n        role() {\n            const v = fields.role.value;\n            if (!v) return 'Выберите роль.';\n            if (v !== 'admin' && v !== 'user') return 'Недопустимая роль.';\n            return '';\n        },\n        password() {\n            const v = fields.password.value;\n            if (!v) return 'Введите пароль.';\n            if (v.length < 8) return 'Минимум 8 символов.';\n            if (!/[a-zA-Zа-яА-Я]/.test(v) || !/\\d/.test(v)) return 'Пароль должен содержать буквы и цифры.';\n            return '';\n        },\n        password2() {\n            const v = fields.password2.value;\n            if (!v) return 'Подтвердите пароль.';\n            if (v !== fields.password.value) return 'Пароли не совпадают.';\n            return '';\n        }\n    };\n\n    function setFieldState(name, message) {\n        const input   = fields[name];\n        const errorEl = errors[name];\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            if (errorEl) errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const msg = validators[name]();\n        setFieldState(name, msg);\n        return !msg;\n    }\n\n    // ----- Индикатор надёжности -----\n    function calcStrength(pwd) {\n        let score = 0;\n        if (pwd.length >= 8) score++;\n        if (pwd.length >= 12) score++;\n        if (/[a-zа-я]/.test(pwd) && /[A-ZА-Я]/.test(pwd)) score++;\n        if (/\\d/.test(pwd)) score++;\n        if (/[^A-Za-zА-Яа-я0-9]/.test(pwd)) score++;\n        return Math.min(score, 4);\n    }\n\n    function updateStrength() {\n        const pwd = fields.password.value;\n        const score = calcStrength(pwd);\n        const colors = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'];\n        const labels = ['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Надёжный'];\n        const widths = [0, 25, 50, 75, 100];\n\n        strengthBar.className = 'progress-bar ' + colors[score];\n        strengthBar.style.width = widths[score] + '%';\n        strengthBar.parentElement.setAttribute('aria-valuenow', score);\n        strengthText.textContent = pwd\n            ? 'Надёжность: ' + labels[score]\n            : 'Минимум 8 символов, буквы и цифры';\n    }\n\n    // ----- Слушатели -----\n    names.forEach(name => {\n        const input = fields[name];\n        input.addEventListener('blur', () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    fields.password.addEventListener('input', () => {\n        updateStrength();\n        if (fields.password2.value) validateField('password2');\n    });\n\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n\n        const results = names.map(validateField);\n        const firstInvalid = names.find((n, i) => !results[i]);\n\n        if (firstInvalid) {\n            fields[firstInvalid].focus();\n            return;\n        }\n\n        submitBtn.disabled = true;\n        submitIcon.classList.add('d-none');\n        submitSpinner.classList.remove('d-none');\n        submitText.textContent = 'Создаём аккаунт…';\n\n        try {\n            // Отправляем ровно поля модели employees\n            await window.db_requests.adminReg({\n                first_name: fields.first_name.value.trim(),\n                last_name:  fields.last_name.value.trim(),\n                email:      fields.email.value.trim(),\n                role:       fields.role.value,  \n                password:   fields.password.value,\n            });\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/'), 500);\n        } catch (error) {\n            showNonField(error.message || 'Не удалось зарегистрироваться');\n            submitBtn.disabled = false;\n            submitSpinner.classList.add('d-none');\n            submitIcon.classList.remove('d-none');\n            submitText.textContent = 'Зарегистрироваться';\n        }\n    });\n})();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_title: b_title,
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/connect_db.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("auth/_layout.html", true, "auth/connect_db.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("title"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
output += t_8;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_title(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "Авторизация — ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 4;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"card shadow-lg border-0 rounded-4\">\n    <div class=\"card-body p-4 p-md-5\">\n        <div class=\"text-center mb-4\">\n            <div class=\"d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3\"\n                style=\"width:64px;height:64px;\">\n                <i class=\"bi bi-shield-lock fs-2\"></i>\n            </div>\n            <h1 class=\"h3 fw-bold mb-2\">Подключение к базе данных</h1>\n            <p class=\"text-body-secondary small mb-0\">Введите свои данные для входа</p>\n        </div>\n        <!-- Общая ошибка -->\n        <div class=\"alert alert-danger d-none align-items-center gap-2 py-2 small\"\n            id=\"nonFieldAlert\" role=\"alert\">\n            <i class=\"bi bi-exclamation-triangle-fill\"></i>\n            <div id=\"nonFieldText\"></div>\n        </div>\n        <!-- Успех -->\n        <div class=\"alert alert-success d-none align-items-center gap-2\"\n            id=\"successAlert\" role=\"alert\">\n            <i class=\"bi bi-check-circle-fill\"></i>\n            <div>Успешный вход! Перенаправляем…</div>\n        </div>\n        <form id=\"loginForm\" novalidate>\n          <!-- Тип БД -->\n          <div class=\"mb-3\">\n              <label for=\"dialect\" class=\"form-label\">Тип базы данных</label>\n              <div class=\"input-group input-group-lg has-validation\">\n                  <span class=\"input-group-text\"><i class=\"bi bi-database\"></i></span>\n                  <select class=\"form-select\" id=\"dialect\" name=\"dialect\" required>\n                      <option value=\"\" selected disabled>Выберите тип БД</option>\n                      <option value=\"mysql\">MySQL</option>\n                      <option value=\"postgres\">PostgreSQL</option>\n                  </select>\n                  <div class=\"invalid-feedback\" id=\"dialectError\">\n                      Выберите тип базы данных.\n                  </div>\n              </div>\n          </div>\n            <div class=\"mb-3\">\n                <label for=\"host\" class=\"form-label\">Хост сервера</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person\"></i></span>\n                    <input type=\"text\"\n                          class=\"form-control\"\n                          id=\"host\"\n                          name=\"host\"\n                          placeholder=\"localhost\"\n                          autocomplete=\"off\"\n                          required>\n                    <div class=\"invalid-feedback\" id=\"hostError\">\n                        Введите имя айпи хоста.\n                    </div>\n                </div>\n            </div>\n            <div class=\"mb-3\">\n                <label for=\"port\" class=\"form-label\">Порт</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person\"></i></span>\n                    <input type=\"text\" inputmode=\"numeric\"\n                          class=\"form-control\"\n                          id=\"port\"\n                          name=\"port\"\n                          placeholder=\"3306\" autocomplete=\"off\" required>\n                    <div class=\"invalid-feedback\" id=\"portError\">\n                        Введите имя порт хоста.\n                    </div>\n                </div>\n            </div>\n            <!-- Логин -->\n            <div class=\"mb-3\">\n                <label for=\"username\" class=\"form-label\">Имя пользователя</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-person\"></i></span>\n                    <input type=\"text\"\n                          class=\"form-control\"\n                          id=\"username\"\n                          name=\"username\"\n                          placeholder=\"username\"\n                          autocomplete=\"username\"\n                          required>\n                    <div class=\"invalid-feedback\" id=\"usernameError\">\n                        Введите имя пользователя.\n                    </div>\n                </div>\n            </div>\n            <!-- Пароль -->\n            <div class=\"mb-3\">\n                <label for=\"password\" class=\"form-label\">Пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-key\"></i></span>\n                    <input type=\"password\"\n                          class=\"form-control\"\n                          id=\"password\"\n                          name=\"password\"\n                          placeholder=\"••••••••\"\n                          minlength=\"6\"\n                          autocomplete=\"current-password\"\n                          required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"passwordError\">\n                        Пароль должен содержать минимум 6 символов.\n                    </div>\n                </div>\n            </div>\n            <button type=\"submit\" class=\"btn btn-primary btn-lg w-100 mb-3\" id=\"submitBtn\">\n                <span class=\"spinner-border spinner-border-sm me-2 d-none\"\n                      id=\"submitSpinner\" role=\"status\" aria-hidden=\"true\"></span>\n                <i class=\"bi bi-box-arrow-in-right me-1\" id=\"submitIcon\"></i>\n                <span id=\"submitText\">Подключиться</span>\n            </button>\n        </form>\n        <div class=\"text-center\">\n            <a id=\"sqlite_render\" class=\"text-decoration-none small\">Использовать SQLite</a>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 128;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const form = document.getElementById('loginForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const $ = (id) => document.getElementById(id);\n\n    const toggleBtn     = $('togglePassword');\n    const toggleIcon    = $('toggleIcon');\n    const submitBtn     = $('submitBtn');\n    const submitSpinner = $('submitSpinner');\n    const submitIcon    = $('submitIcon');\n    const submitText    = $('submitText');\n    const successAlert  = $('successAlert');\n    const nonFieldAlert = $('nonFieldAlert');\n    const nonFieldText  = $('nonFieldText');\n\n    // Порты по умолчанию для каждого типа БД\n    const DEFAULT_PORTS = {\n        mysql: '3306',\n        mariadb: '3306',\n        postgres: '5432',\n        mssql: '1433',\n    };\n\n    // ----- Поля и их валидаторы -----\n    const fields = {\n        dialect: {\n            input: $('dialect'),\n            error: $('dialectError'),\n            validate: (v) => (v ? '' : 'Выберите тип базы данных.'),\n        },\n        host: {\n            input: $('host'),\n            error: $('hostError'),\n            validate: (v) => (v.trim() ? '' : 'Введите адрес хоста.'),\n        },\n        port: {\n            input: $('port'),\n            error: $('portError'),\n            validate: (v) => {\n                v = v.trim();\n                if (!v) return 'Введите порт.';\n                if (!/^\\d+$/.test(v)) return 'Порт должен быть числом.';\n                const n = Number(v);\n                if (n < 1 || n > 65535) return 'Порт должен быть от 1 до 65535.';\n                return '';\n            },\n        },\n        username: {\n            input: $('username'),\n            error: $('usernameError'),\n            validate: (v) => (v.trim() ? '' : 'Введите имя пользователя.'),\n        },\n        password: {\n            input: $('password'),\n            error: $('passwordError'),\n            validate: (v) => (v ? '' : 'Введите пароль.'),\n        },\n    };\n\n    function setFieldState(input, errorEl, message) {\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const { input, error, validate } = fields[name];\n        const msg = validate(input.value);\n        setFieldState(input, error, msg);\n        return !msg;\n    }\n\n    // Обработчики blur / input / change для всех полей\n    Object.entries(fields).forEach(([name, { input }]) => {\n        const eventName = input.tagName === 'SELECT' ? 'change' : 'blur';\n        input.addEventListener(eventName, () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    // Порт — только цифры\n    fields.port.input.addEventListener('input', (e) => {\n        e.target.value = e.target.value.replace(/\\D/g, '').slice(0, 5);\n    });\n\n    // ----- Смена типа БД: подставляем порт по умолчанию -----\n    let lastDefaultPort = '';\n    fields.dialect.input.addEventListener('change', () => {\n        const portInput = fields.port.input;\n        const newPort = DEFAULT_PORTS[fields.dialect.input.value] || '';\n\n        // Подставляем, только если порт пуст или пользователь его не менял\n        if (!portInput.value || portInput.value === lastDefaultPort) {\n            portInput.value = newPort;\n            if (newPort) validateField('port');\n        }\n        portInput.placeholder = newPort || '3306';\n        lastDefaultPort = newPort;\n    });\n\n    // ----- Показать/скрыть пароль -----\n    toggleBtn.addEventListener('click', () => {\n        const pwd = fields.password.input;\n        const hidden = pwd.type === 'password';\n        pwd.type = hidden ? 'text' : 'password';\n        toggleIcon.classList.toggle('bi-eye', !hidden);\n        toggleIcon.classList.toggle('bi-eye-slash', hidden);\n        toggleBtn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n    });\n\n    // ----- Общая ошибка -----\n    function showError(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    function hideError() {\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n    }\n\n    function setLoading(loading) {\n        submitBtn.disabled = loading;\n        submitSpinner.classList.toggle('d-none', !loading);\n        submitIcon.classList.toggle('d-none', loading);\n        submitText.textContent = loading ? 'Подключаемся…' : 'Подключиться';\n    }\n    document.addEventListener('click', async (e) => {\n        if (e.target.matches('#sqlite_render')) {\n            e.preventDefault();\n            hideError();\n            \n            try{\n                setLoading(true);\n                await window.db_requests.login({\n                    dialect: \"sqlite\"\n                });\n                await window.db_requests.clear();\n                successAlert.classList.remove('d-none');\n                successAlert.classList.add('d-flex');\n                setTimeout(() => window.navigate('/admin_reg'), 400);\n            } catch (error) {\n                showError(error.message || 'Не удалось подключиться');\n                setLoading(false);\n            }\n        }\n    });\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n        hideError();\n\n        // Проверяем все поля и фокусируемся на первом с ошибкой\n        let firstInvalid = null;\n        Object.keys(fields).forEach((name) => {\n            if (!validateField(name) && !firstInvalid) {\n                firstInvalid = fields[name].input;\n            }\n        });\n        if (firstInvalid) {\n            firstInvalid.focus();\n            return;\n        }\n\n        setLoading(true);\n\n        const cfg = {\n            dialect:  fields.dialect.input.value,\n            host:     fields.host.input.value.trim(),\n            port:     Number(fields.port.input.value),\n            username: fields.username.input.value.trim(),\n            password: fields.password.input.value,\n        };\n\n        try {\n            await window.db_requests.login(cfg);\n            window.app.states.setDBmeta(cfg);        // сохраняем конфиг БД в хранилище\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/admin_reg'), 400);\n        } catch (error) {\n            showError(error.message || 'Не удалось подключиться');\n            setLoading(false);\n        }\n    });\n})();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_title: b_title,
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["auth/login.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("auth/_layout.html", true, "auth/login.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("title"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_9,t_8) {
if(t_9) { cb(t_9); return; }
output += t_8;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_title(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "Авторизация — ";
output += runtime.suppressValue(runtime.contextOrFrameLookup(context, frame, "appName"), env.opts.autoescape);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 4;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"card shadow-lg border-0 rounded-4\">\n    <div class=\"card-body p-4 p-md-5\">\n\n        <div class=\"text-center mb-4\">\n            <div class=\"d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3\"\n                 style=\"width:64px;height:64px;\">\n                <i class=\"bi bi-shield-lock fs-2\"></i>\n            </div>\n            <h1 class=\"h3 fw-bold mb-2\">Вход в аккаунт</h1>\n            <p class=\"text-body-secondary small mb-0\">Введите свои данные для входа</p>\n        </div>\n\n        <!-- Общая ошибка -->\n        <div class=\"alert alert-danger d-none align-items-center gap-2 py-2 small\"\n             id=\"nonFieldAlert\" role=\"alert\">\n            <i class=\"bi bi-exclamation-triangle-fill\"></i>\n            <div id=\"nonFieldText\"></div>\n        </div>\n\n        <!-- Успех -->\n        <div class=\"alert alert-success d-none align-items-center gap-2\"\n             id=\"successAlert\" role=\"alert\">\n            <i class=\"bi bi-check-circle-fill\"></i>\n            <div>Успешный вход! Перенаправляем…</div>\n        </div>\n\n        <form id=\"loginForm\" novalidate>\n\n            <!-- Email -->\n            <div class=\"mb-3\">\n                <label for=\"email\" class=\"form-label\">Email</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-envelope\"></i></span>\n                    <input type=\"email\"\n                           class=\"form-control\"\n                           id=\"email\"\n                           name=\"email\"\n                           placeholder=\"name@example.com\"\n                           autocomplete=\"email\"\n                           required>\n                    <div class=\"invalid-feedback\" id=\"emailError\">\n                        Введите корректный email.\n                    </div>\n                </div>\n            </div>\n\n            <!-- Пароль -->\n            <div class=\"mb-3\">\n                <label for=\"password\" class=\"form-label\">Пароль</label>\n                <div class=\"input-group input-group-lg has-validation\">\n                    <span class=\"input-group-text\"><i class=\"bi bi-key\"></i></span>\n                    <input type=\"password\"\n                           class=\"form-control\"\n                           id=\"password\"\n                           name=\"password\"\n                           placeholder=\"••••••••\"\n                           minlength=\"6\"\n                           autocomplete=\"current-password\"\n                           required>\n                    <button class=\"btn btn-outline-secondary\"\n                            type=\"button\"\n                            id=\"togglePassword\"\n                            aria-label=\"Показать пароль\">\n                        <i class=\"bi bi-eye\" id=\"toggleIcon\"></i>\n                    </button>\n                    <div class=\"invalid-feedback\" id=\"passwordError\">\n                        Пароль должен содержать минимум 6 символов.\n                    </div>\n                </div>\n            </div>\n\n            <button type=\"submit\" class=\"btn btn-primary btn-lg w-100 mb-3\" id=\"submitBtn\">\n                <span class=\"spinner-border spinner-border-sm me-2 d-none\"\n                      id=\"submitSpinner\" role=\"status\" aria-hidden=\"true\"></span>\n                <i class=\"bi bi-box-arrow-in-right me-1\" id=\"submitIcon\"></i>\n                <span id=\"submitText\">Войти</span>\n            </button>\n        </form>\n\n        <div class=\"text-center\">\n            <span class=\"text-body-secondary small\">Нет аккаунта?</span>\n            <a href=\"#/register\" class=\"text-decoration-none small\">Зарегистрироваться</a>\n        </div>\n\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 93;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const form = document.getElementById('loginForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const email         = document.getElementById('email');\n    const password      = document.getElementById('password');\n    const emailError    = document.getElementById('emailError');\n    const passwordError = document.getElementById('passwordError');\n\n    const toggleBtn     = document.getElementById('togglePassword');\n    const toggleIcon    = document.getElementById('toggleIcon');\n\n    const submitBtn     = document.getElementById('submitBtn');\n    const submitSpinner = document.getElementById('submitSpinner');\n    const submitIcon    = document.getElementById('submitIcon');\n    const submitText    = document.getElementById('submitText');\n\n    const successAlert  = document.getElementById('successAlert');\n    const nonFieldAlert = document.getElementById('nonFieldAlert');\n    const nonFieldText  = document.getElementById('nonFieldText');\n\n    // ----- Показать/скрыть пароль -----\n    toggleBtn.addEventListener('click', () => {\n        const hidden = password.type === 'password';\n        password.type = hidden ? 'text' : 'password';\n        toggleIcon.classList.toggle('bi-eye', !hidden);\n        toggleIcon.classList.toggle('bi-eye-slash', hidden);\n        toggleBtn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n    });\n\n    // ----- Валидация -----\n    const fields = { email, password };\n    const errorEls = { email: emailError, password: passwordError };\n\n    const validators = {\n        email() {\n            const v = email.value.trim();\n            if (!v) return 'Введите email.';\n            if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return 'Введите корректный email.';\n            return '';\n        },\n        password() {\n            if (!password.value) return 'Введите пароль.';\n            if (password.value.length < 6) return 'Пароль должен содержать минимум 6 символов.';\n            return '';\n        }\n    };\n\n    function setFieldState(input, errorEl, message) {\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const msg = validators[name]();\n        setFieldState(fields[name], errorEls[name], msg);\n        return !msg;\n    }\n\n    ['email', 'password'].forEach(name => {\n        const input = fields[name];\n        input.addEventListener('blur', () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    function showError(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n\n        const okEmail = validateField('email');\n        const okPass  = validateField('password');\n        if (!okEmail || !okPass) {\n            (!okEmail ? email : password).focus();\n            return;\n        }\n\n        submitBtn.disabled = true;\n        submitIcon.classList.add('d-none');\n        submitSpinner.classList.remove('d-none');\n        submitText.textContent = 'Проверяем…';\n\n        try {\n            const res = await window.db_requests.employeesLogin({\n                email: email.value.trim(),\n                password: password.value,\n            });\n            window.app.states.data.user = res.data;\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/'), 400);\n        } catch (error) {\n            showError(error.message || 'Не удалось войти');\n            submitBtn.disabled = false;\n            submitSpinner.classList.add('d-none');\n            submitIcon.classList.remove('d-none');\n            submitText.textContent = 'Войти';\n        }\n    });\n})();\n</script>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_title: b_title,
b_content: b_content,
b_extra_js: b_extra_js,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["base.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
var tasks = [];
tasks.push(
function(callback) {
env.getTemplate("navbar.html", false, "base.html", false, function(t_2,t_1) {
if(t_2) { cb(t_2); return; }
callback(null,t_1);});
});
tasks.push(
function(template, callback){
template.render(context.getVariables(), frame, function(t_4,t_3) {
if(t_4) { cb(t_4); return; }
callback(null,t_3);});
});
tasks.push(
function(result, callback){
output += result;
callback(null);
});
env.waterfall(tasks, function(){
output += "\n<main class=\"container py-4\">\n    ";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_6,t_5) {
if(t_6) { cb(t_6); return; }
output += t_5;
output += "\n</main>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 7;
var output = "";
try {
var frame = frame.push(true);
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["dev_tools/dev_panel.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["home.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "home.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div class=\"row g-4\">\n\n    ";
output += "\n    <div class=\"col-12\">\n        <div class=\"card border-0 shadow-sm\">\n            <div class=\"card-body p-4\">\n                <div class=\"d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3\">\n                    <div>\n                        <h1 class=\"h3 mb-1\">Привет, ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"first_name") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"username"), env.opts.autoescape);
output += "</h1>\n                    </div>\n                    <a id=\"about\" href=\"#/about\">\n                        about\n                    </a>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    \n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["navbar.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<nav class=\"navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top px-3 px-lg-4\">\n    <div class=\"container-fluid px-3 px-lg-4\">\n\n        <!-- ЛОГО -->\n        <a class=\"navbar-brand fw-bold d-flex align-items-center gap-2 me-auto me-lg-0\" href=\"#/\">\n            <span class=\"d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3\"\n                  style=\"width:32px;height:32px;\">\n                <i class=\"bi bi-kanban\"></i>\n            </span>\n            <span>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"appName"), env.opts.autoescape);
output += "</span>\n        </a>\n        <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\"\n                data-bs-target=\"#navMain\" aria-controls=\"navMain\"\n                aria-expanded=\"false\" aria-label=\"Показать меню\">\n            <span class=\"navbar-toggler-icon\"></span>\n        </button>\n        \n    </div>\n        \n\n        <!-- СВОРАЧИВАЕМАЯ ЧАСТЬ -->\n        <div class=\"collapse navbar-collapse\" id=\"navMain\">\n            <div class=\"d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center\n                        gap-2 ms-lg-3 mt-3 mt-lg-0\">\n\n                <!-- ==================== АВТОРИЗОВАН ==================== -->\n                <div class=\"d-flex flex-row justify-content-end align-items-center gap-2\" id=\"userBlock\">\n\n                    <!-- Тема -->\n                    <button type=\"button\"\n                            class=\"btn btn-outline-secondary border-0\"\n                            id=\"themeToggle\" aria-label=\"Переключить тему\">\n                        <i class=\"bi bi-moon-stars\" id=\"themeIcon\"></i>\n                    </button>\n\n                    <!-- Профиль -->\n                    <div class=\"dropdown\">\n                        <button class=\"btn p-0 border-0 d-flex align-items-center gap-2\"\n                                type=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"\n                                aria-label=\"Профиль\">\n                            <span id=\"avatar\"\n                                  class=\"avatar-circle bg-primary bg-opacity-25 text-primary fw-bold rounded-circle\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"initial"), env.opts.autoescape);
output += "</span>\n                        </button>\n\n                        <ul class=\"dropdown-menu dropdown-menu-end shadow rounded-4 p-2 dropdown-profile\"\n                            style=\"width:min(240px, calc(100vw - 1rem));\">\n                            <li class=\"px-3 py-2\">\n                                <div id=\"username\" class=\"fw-semibold text-truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"first_name") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"username"), env.opts.autoescape);
output += "</div>\n                                <div id=\"email\" class=\"text-body-secondary small text-truncate\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"email") || "—", env.opts.autoescape);
output += "</div>\n                            </li>\n                            <li><hr class=\"dropdown-divider\"></li>\n                            <li>\n                                <a id=\"account\" class=\"dropdown-item rounded-3\" href=\"#/profile\">\n                                    <i class=\"bi bi-person me-2\"></i>Профиль\n                                </a>\n                            </li>\n                            <li><hr class=\"dropdown-divider\"></li>\n                            <li>\n                                <a class=\"dropdown-item rounded-3 text-danger\" href=\"#/login\" data-logout>\n                                    <i id=\"logout\" class=\"bi bi-box-arrow-right me-2\"></i>Выйти\n                                </a>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n\n            </div>\n        </div>\n</nav>\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
root: root
};

})();
})();

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["profile.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "profile.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})});
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_content(env, context, frame, runtime, cb) {
var lineno = 2;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<div style=\"max-width:900px;margin:0 auto;\">\n\n    <!-- Шапка профиля -->\n    <div class=\"card border-0 shadow-sm rounded-4 mb-4\">\n        <div class=\"card-body p-4\">\n\n            <div class=\"d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-4\">\n\n                <!-- Аватар -->\n                <div class=\"d-flex align-items-center justify-content-center\n                            bg-primary bg-opacity-25 text-primary fw-bold rounded-circle flex-shrink-0\"\n                     style=\"width:96px;height:96px;font-size:2rem;\">\n                    ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"initials"), env.opts.autoescape);
output += "\n                </div>\n\n                <!-- Имя, email -->\n                <div class=\"flex-grow-1 text-center text-sm-start\">\n                    <h1 class=\"h4 fw-bold mb-1\">\n                        ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"first_name") || runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "user")),"username"), env.opts.autoescape);
output += "\n                    </h1>\n                    <p class=\"text-body-secondary mb-0\">\n                        <i class=\"bi bi-envelope me-1\"></i>";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"email") || "email не указан", env.opts.autoescape);
output += "\n                    </p>\n                </div>\n\n                <!-- Дата регистрации + кнопку выйти -->\n                <div class=\"d-flex flex-column justify-content-between align-items-center align-items-sm-end gap-2 flex-shrink-0 align-self-stretch\">\n\n                    <div class=\"text-body-secondary small text-center text-sm-end\">\n                        <i class=\"bi bi-calendar3 me-1\"></i>\n                        Дата регистрации\n                        <div class=\"badge text-bg-secondary rounded-pill mt-1\">\n                            ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"date_joined_label") || "—", env.opts.autoescape);
output += "\n                        </div>\n                    </div>\n\n                    <form method=\"post\" action=\"/logout/\" class=\"m-0\">\n                        <button type=\"submit\" class=\"btn btn-outline-danger btn-sm\">\n                            <i class=\"bi bi-box-arrow-right me-1\"></i>Выйти\n                        </button>\n                    </form>\n\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- Основная инфа -->\n    <div class=\"row g-4\">\n        <div class=\"col-12\">\n            <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n                <div class=\"card-body p-4\">\n                    <h2 class=\"h6 text-body-secondary text-uppercase mb-3\">Основная информация</h2>\n\n                    <dl class=\"row mb-0\">\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Имя пользователя</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"username") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Имя</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"first_name") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Фамилия</dt>\n                        <dd class=\"col-sm-8\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"last_name") || "—", env.opts.autoescape);
output += "</dd>\n\n                        <dt class=\"col-sm-4 text-body-secondary fw-normal\">Email</dt>\n                        <dd class=\"col-sm-8 mb-0\">";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"email") || "—", env.opts.autoescape);
output += "</dd>\n                    </dl>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
return {
b_content: b_content,
root: root
};

})();
})();



  function getEnv() {
    if (env) return env;
    env = new nunjucks.Environment(null, { autoescape: true });
    for (var key in templates) {
      if (Object.prototype.hasOwnProperty.call(templates, key)) {
        env.templates[key] = templates[key];
      }
    }
    return env;
  }

  global.renderPage = function (name, context) {
    return getEnv().render(name, context || {});
  };
})(window);
