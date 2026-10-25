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

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["appointments.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "appointments.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})});
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
output += "\n<div class=\"d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3\">\n    <div>\n        <h1 class=\"h4 mb-1\">Записи клиентов</h1>\n        <div class=\"text-body-secondary small\" id=\"apptCount\">Загружаем…</div>\n    </div>\n    <button type=\"button\" class=\"btn btn-primary\" id=\"addBtn\">\n        <i class=\"bi bi-calendar-plus me-1\"></i>Записать клиента\n    </button>\n</div>\n\n<div class=\"card border-0 shadow-sm rounded-4\">\n    <div class=\"card-body p-3 p-md-4\">\n\n        <!-- Фильтры -->\n        <div class=\"row g-2 mb-3\">\n            <div class=\"col-12 col-md-4\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"search\">Поиск</label>\n                <input type=\"search\" class=\"form-control\" id=\"search\" placeholder=\"Фамилия клиента\">\n            </div>\n            <div class=\"col-6 col-md-2\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"filterDate\">Дата</label>\n                <input type=\"date\" class=\"form-control\" id=\"filterDate\">\n            </div>\n            <div class=\"col-6 col-md-2\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"filterMaster\">Мастер</label>\n                <select class=\"form-select\" id=\"filterMaster\">\n                    <option value=\"\">Все мастера</option>\n                </select>\n            </div>\n            <div class=\"col-6 col-md-2\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"filterStatus\">Статус</label>\n                <select class=\"form-select\" id=\"filterStatus\">\n                    <option value=\"\">Все статусы</option>\n                    <option value=\"new\">Записана</option>\n                    <option value=\"done\">Оказана</option>\n                    <option value=\"cancelled\">Отменена</option>\n                </select>\n            </div>\n            <div class=\"col-6 col-md-2 d-flex align-items-end\">\n                <button type=\"button\" class=\"btn btn-outline-secondary w-100\" id=\"resetFilters\"\n                        aria-label=\"Сбросить фильтры\"><i class=\"bi bi-arrow-counterclockwise\"></i> Сброс</button>\n            </div>\n        </div>\n\n        <div class=\"table-responsive\">\n            <table class=\"table align-middle mb-0\">\n                <thead class=\"table-light\">\n                    <tr>\n                        <th scope=\"col\">Дата</th>\n                        <th scope=\"col\">Время</th>\n                        <th scope=\"col\">Клиент</th>\n                        <th scope=\"col\">Мастер</th>\n                        <th scope=\"col\">Услуга</th>\n                        <th scope=\"col\" class=\"text-end\">Стоимость</th>\n                        <th scope=\"col\">Статус</th>\n                        <th scope=\"col\" class=\"text-end\">Действия</th>\n                    </tr>\n                </thead>\n                <tbody id=\"rows\"></tbody>\n            </table>\n        </div>\n        <div id=\"empty\" class=\"text-body-secondary text-center py-4 d-none\">Записей по фильтрам нет</div>\n\n        <div class=\"d-flex justify-content-between align-items-center mt-3 small text-body-secondary\">\n            <span id=\"filteredInfo\"></span>\n            <span id=\"filteredSum\"></span>\n        </div>\n    </div>\n</div>\n\n<!-- Модалка создания/редактирования записи -->\n<div class=\"modal fade\" id=\"apptModal\" tabindex=\"-1\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <div class=\"modal-content rounded-4\">\n            <form id=\"apptForm\" novalidate>\n                <div class=\"modal-header border-0 pb-0\">\n                    <h5 class=\"modal-title fs-6 fw-semibold\" id=\"apptModalTitle\">Новая запись</h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>\n                </div>\n                <div class=\"modal-body\">\n                    <div class=\"alert alert-danger d-none py-2 small mb-3\" id=\"modalAlert\" role=\"alert\">\n                        <div id=\"modalError\"></div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"client\" class=\"form-label\">Клиент</label>\n                        <select class=\"form-select\" id=\"client\" required>\n                            <option value=\"\">— выберите клиента —</option>\n                        </select>\n                        <div class=\"invalid-feedback\" id=\"clientError\">Выберите клиента.</div>\n                        <div class=\"form-text\">\n                            Нет нужного клиента? <a href=\"#/clients\">Зарегистрируйте его</a>.\n                        </div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"employee\" class=\"form-label\">Мастер</label>\n                        <select class=\"form-select\" id=\"employee\" required>\n                            <option value=\"\">— выберите мастера —</option>\n                        </select>\n                        <div class=\"invalid-feedback\" id=\"employeeError\">Выберите мастера.</div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"service\" class=\"form-label\">Услуга</label>\n                        <select class=\"form-select\" id=\"service\" required>\n                            <option value=\"\">— выберите услугу —</option>\n                        </select>\n                        <div class=\"invalid-feedback\" id=\"serviceError\">Выберите услугу.</div>\n                        <div class=\"form-text\">Стоимость посещения: <b id=\"costPreview\">—</b></div>\n                    </div>\n\n                    <div class=\"row g-3 mb-1\">\n                        <div class=\"col-6\">\n                            <label for=\"date\" class=\"form-label\">Дата</label>\n                            <input type=\"date\" class=\"form-control\" id=\"date\" required>\n                            <div class=\"invalid-feedback\" id=\"dateError\">Укажите дату.</div>\n                        </div>\n                        <div class=\"col-6\">\n                            <label for=\"time\" class=\"form-label\">Время</label>\n                            <input type=\"time\" class=\"form-control\" id=\"time\" step=\"300\" required>\n                            <div class=\"invalid-feedback\" id=\"timeError\">Укажите время.</div>\n                        </div>\n                    </div>\n\n                    <div class=\"mt-3\">\n                        <label for=\"status\" class=\"form-label\">Статус</label>\n                        <select class=\"form-select\" id=\"status\">\n                            <option value=\"new\">Записана</option>\n                            <option value=\"done\">Оказана</option>\n                            <option value=\"cancelled\">Отменена</option>\n                        </select>\n                        <div class=\"invalid-feedback\" id=\"statusError\">Недопустимый статус.</div>\n                    </div>\n\n                    <div class=\"alert alert-warning d-none py-2 small mt-3 mb-0\" id=\"freeHint\" role=\"status\">\n                        <i class=\"bi bi-info-circle me-1\"></i><span id=\"freeHintText\"></span>\n                    </div>\n                </div>\n                <div class=\"modal-footer border-0 pt-0\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" data-bs-dismiss=\"modal\">Отмена</button>\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\" id=\"saveBtn\">Сохранить</button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 152;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const $ = (id) => document.getElementById(id);\n    if (!$('rows')) return;\n\n    const ui = window.ui;\n    const api = window.db_requests.appointments;\n    const STATUS_LABELS = { new: 'Записана', done: 'Оказана', cancelled: 'Отменена' };\n\n    let rows = [];        // все записи (с вложенными client/employee/service)\n    let clients = [];\n    let masters = [];\n    let services = [];\n    let editingId = null;\n\n    /* --------------------------- Валидация --------------------------- */\n    const fields = {\n        client_id: {\n            input: $('client'), error: $('clientError'),\n            check: (v) => (v ? '' : 'Выберите клиента.'),\n        },\n        employee_id: {\n            input: $('employee'), error: $('employeeError'),\n            check: (v) => (v ? '' : 'Выберите мастера.'),\n        },\n        service_id: {\n            input: $('service'), error: $('serviceError'),\n            check: (v) => (v ? '' : 'Выберите услугу.'),\n        },\n        date: {\n            input: $('date'), error: $('dateError'),\n            check: (v) => (/^\\d{4}-\\d{2}-\\d{2}$/.test(v) ? '' : 'Укажите дату.'),\n        },\n        time: {\n            input: $('time'), error: $('timeError'),\n            check: (v) => (/^\\d{2}:\\d{2}(:\\d{2})?$/.test(v) ? '' : 'Укажите время.'),\n        },\n        status: {\n            input: $('status'), error: $('statusError'),\n            check: (v) => (['new', 'done', 'cancelled'].includes(v) ? '' : 'Недопустимый статус.'),\n        },\n    };\n    const validate = ui.bindValidation(fields);\n\n    /* -------------------------- Загрузка ---------------------------- */\n    async function load() {\n        try {\n            const [appts, clientList, masterList, serviceList] = await Promise.all([\n                api.list(),\n                window.db_requests.clients.list(),\n                window.db_requests.employees.list(),\n                window.db_requests.services.list(),\n            ]);\n            rows = appts;\n            clients = clientList;\n            masters = masterList;\n            services = serviceList;\n            fillSelects();\n            render();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось загрузить записи', 'danger');\n        }\n    }\n\n    function fillSelects() {\n        const options = (items, label) => items.map(\n            (r) => `<option value=\"${r.id}\">${ui.esc(label(r))}</option>`,\n        ).join('');\n\n        $('client').innerHTML = '<option value=\"\">— выберите клиента —</option>'\n            + options(clients, (r) => `${r.last_name} ${r.first_name} · ${r.number}`);\n        $('employee').innerHTML = '<option value=\"\">— выберите мастера —</option>'\n            + options(masters, (r) => `${r.last_name} ${r.first_name}`);\n        $('service').innerHTML = '<option value=\"\">— выберите услугу —</option>'\n            + options(services, (r) => `${r.title} — ${ui.money(r.price)}`);\n\n        const current = $('filterMaster').value;\n        $('filterMaster').innerHTML = '<option value=\"\">Все мастера</option>'\n            + options(masters, (r) => `${r.last_name} ${r.first_name}`);\n        $('filterMaster').value = current;\n\n        // сохраняем выбранное значение формы при перезагрузке\n        if (editingId) {\n            const row = rows.find((r) => r.id === editingId);\n            if (row) {\n                $('client').value = row.client_id;\n                $('employee').value = row.employee_id;\n                $('service').value = row.service_id;\n            }\n        }\n        updateCost();\n    }\n\n    /* ------------------------- Фильтры/таблица ------------------------ */\n    function filtered() {\n        const q = $('search').value.trim().toLowerCase();\n        const date = $('filterDate').value;\n        const master = $('filterMaster').value;\n        const status = $('filterStatus').value;\n\n        const list = rows.filter((r) => {\n            if (date && r.date !== date) return false;\n            if (master && String(r.employee_id) !== master) return false;\n            if (status && r.status !== status) return false;\n            if (q) {\n                const name = r.client ? `${r.client.last_name} ${r.client.first_name}` : '';\n                if (!name.toLowerCase().includes(q)) return false;\n            }\n            return true;\n        });\n\n        return list.sort((a, b) => String(a.date).localeCompare(String(b.date))\n            || String(a.time).localeCompare(String(b.time)));\n    }\n\n    function render() {\n        const list = filtered();\n        const sum = list.reduce((total, r) => total + Number((r.service && r.service.price) || 0), 0);\n        const active = list.filter((r) => r.status !== 'cancelled').length;\n\n        $('apptCount').textContent = `Всего записей: ${rows.length}`;\n        $('filteredInfo').textContent = `Показано: ${list.length} (не отменено: ${active})`;\n        $('filteredSum').textContent = `Стоимость отфильтрованных: ${ui.money(sum)}`;\n\n        $('rows').innerHTML = list.map((r) => {\n            const client = r.client || {};\n            const master = r.employee || {};\n            const service = r.service || {};\n            const status = STATUS_LABELS[r.status] ? r.status : 'new';\n            return `\n            <tr>\n                <td class=\"text-nowrap\">${ui.fmtDate(r.date)}</td>\n                <td class=\"text-nowrap\">${ui.fmtTime(r.time)}</td>\n                <td class=\"fw-semibold\">${ui.esc(client.last_name || '')} ${ui.esc(client.first_name || '')}</td>\n                <td class=\"text-nowrap\">${ui.esc(master.last_name || '')} ${ui.esc(master.first_name || '')}</td>\n                <td>${ui.esc(service.title || '—')}</td>\n                <td class=\"text-end text-nowrap\">${ui.money(service.price || 0)}</td>\n                <td>\n                    <select class=\"form-select form-select-sm w-auto\" data-status=\"${r.id}\"\n                            aria-label=\"Статус записи\">\n                        ${Object.entries(STATUS_LABELS).map(([value, label]) => `\n                            <option value=\"${value}\"${value === status ? ' selected' : ''}>${label}</option>`).join('')}\n                    </select>\n                </td>\n                <td class=\"text-end text-nowrap\">\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-secondary me-1\" data-edit=\"${r.id}\"\n                            aria-label=\"Редактировать\"><i class=\"bi bi-pencil\"></i></button>\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-danger\" data-del=\"${r.id}\"\n                            aria-label=\"Удалить\"><i class=\"bi bi-trash\"></i></button>\n                </td>\n            </tr>`;\n        }).join('');\n\n        $('empty').classList.toggle('d-none', list.length > 0);\n    }\n\n    /* ------------------------- Расчёт стоимости ----------------------- */\n    function updateCost() {\n        const service = services.find((s) => String(s.id) === $('service').value);\n        $('costPreview').textContent = service ? ui.money(service.price) : '—';\n        updateFreeHint();\n    }\n\n    // Подсказка о занятости мастера (точную проверку выполняет main-процесс)\n    function updateFreeHint() {\n        const hint = $('freeHint');\n        const employeeId = $('employee').value;\n        const date = $('date').value;\n        const time = $('time').value;\n        if (!employeeId || !date || !time) {\n            hint.classList.add('d-none');\n            return;\n        }\n        const conflict = rows.find((r) => String(r.employee_id) === employeeId\n            && r.date === date\n            && ui.fmtTime(r.time) === ui.fmtTime(time)\n            && r.status !== 'cancelled'\n            && String(r.id) !== String(editingId));\n\n        if (conflict) {\n            const client = conflict.client || {};\n            $('freeHintText').textContent = `Мастер уже занят: ${client.last_name || ''} ${client.first_name || ''}`.trim();\n            hint.classList.remove('d-none');\n            hint.classList.replace('alert-warning', 'alert-danger');\n        } else {\n            $('freeHintText').textContent = 'Слот свободен.';\n            hint.classList.remove('d-none');\n            hint.classList.replace('alert-danger', 'alert-warning');\n        }\n    }\n\n    /* -------------------------- Модалка/форма ------------------------- */\n    function openModal(row) {\n        editingId = row ? row.id : null;\n        $('apptModalTitle').textContent = row ? 'Редактировать запись' : 'Новая запись';\n\n        $('client').value = row ? row.client_id : '';\n        $('employee').value = row ? row.employee_id : '';\n        $('service').value = row ? row.service_id : '';\n        $('date').value = row ? row.date : new Date().toISOString().slice(0, 10);\n        $('time').value = row ? ui.fmtTime(row.time) : '';\n        $('status').value = row ? row.status : 'new';\n\n        Object.values(fields).forEach((f) => f.input.classList.remove('is-invalid', 'is-valid'));\n        showError('');\n        updateCost();\n        window.bootstrap.Modal.getOrCreateInstance($('apptModal')).show();\n        setTimeout(() => $('client').focus(), 300);\n    }\n\n    function showError(message) {\n        $('modalError').textContent = message || '';\n        $('modalAlert').classList.toggle('d-none', !message);\n    }\n\n    $('addBtn').addEventListener('click', () => openModal(null));\n    ['search', 'filterDate'].forEach((id) => $(id).addEventListener('input', render));\n    ['filterMaster', 'filterStatus'].forEach((id) => $(id).addEventListener('change', render));\n    $('resetFilters').addEventListener('click', () => {\n        $('search').value = '';\n        $('filterDate').value = '';\n        $('filterMaster').value = '';\n        $('filterStatus').value = '';\n        render();\n    });\n\n    ['service'].forEach((id) => $(id).addEventListener('change', updateCost));\n    ['employee', 'date', 'time'].forEach((id) => $(id).addEventListener('change', updateFreeHint));\n\n    /* ------------------------- Действия в таблице ---------------------- */\n    $('rows').addEventListener('click', async (event) => {\n        const editBtn = event.target.closest('[data-edit]');\n        if (editBtn) {\n            const row = rows.find((r) => String(r.id) === editBtn.dataset.edit);\n            if (row) openModal(row);\n            return;\n        }\n        const delBtn = event.target.closest('[data-del]');\n        if (!delBtn) return;\n        const row = rows.find((r) => String(r.id) === delBtn.dataset.del);\n        if (!row) return;\n\n        const client = row.client || {};\n        const confirmed = await ui.confirm({\n            title: 'Удалить запись?',\n            text: `${ui.fmtDate(row.date)} ${ui.fmtTime(row.time)} — ${client.last_name || ''} ${client.first_name || ''}`.trim(),\n        });\n        if (!confirmed) return;\n        try {\n            await api.remove(row.id);\n            ui.toast('Запись удалена', 'success');\n            await load();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось удалить', 'danger');\n        }\n    });\n\n    // Смена статуса прямо в таблице\n    $('rows').addEventListener('change', async (event) => {\n        const select = event.target.closest('[data-status]');\n        if (!select) return;\n        const row = rows.find((r) => String(r.id) === select.dataset.status);\n        if (!row) return;\n\n        try {\n            await api.update({\n                id: row.id,\n                date: row.date,\n                time: row.time,\n                client_id: row.client_id,\n                employee_id: row.employee_id,\n                service_id: row.service_id,\n                status: select.value,\n            });\n            ui.toast(`Статус: ${STATUS_LABELS[select.value]}`, 'success');\n            await load();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось изменить статус', 'danger');\n            await load();   // возвращаем прежнее значение\n        }\n    });\n\n    /* ----------------------------- Сохранение ------------------------- */\n    $('apptForm').addEventListener('submit', async (event) => {\n        event.preventDefault();\n        showError('');\n        if (!validate()) return;\n\n        const payload = {\n            id: editingId,\n            client_id: $('client').value,\n            employee_id: $('employee').value,\n            service_id: $('service').value,\n            date: $('date').value,\n            time: $('time').value,\n            status: $('status').value,\n        };\n\n        try {\n            await ui.withBusy($('saveBtn'), async () => {\n                if (editingId) await api.update(payload);\n                else await api.create(payload);\n            }, 'Сохраняем…');\n\n            window.bootstrap.Modal.getOrCreateInstance($('apptModal')).hide();\n            ui.toast(editingId ? 'Запись обновлена' : 'Клиент записан', 'success');\n            await load();\n        } catch (error) {\n            // здесь же ловится «Мастер занят…» из main-процесса\n            showError(error.message || 'Не удалось сохранить запись');\n        }\n    });\n\n    load();\n})();\n</script>\n";
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
output += "\n<script>\n(() => {\n    const form = document.getElementById('loginForm');\n    if (!form) return; // DOM ещё не готов (скрипт пересоздаётся при рендере)\n\n    const email         = document.getElementById('email');\n    const password      = document.getElementById('password');\n    const emailError    = document.getElementById('emailError');\n    const passwordError = document.getElementById('passwordError');\n\n    const toggleBtn     = document.getElementById('togglePassword');\n    const toggleIcon    = document.getElementById('toggleIcon');\n\n    const submitBtn     = document.getElementById('submitBtn');\n    const submitSpinner = document.getElementById('submitSpinner');\n    const submitIcon    = document.getElementById('submitIcon');\n    const submitText    = document.getElementById('submitText');\n\n    const successAlert  = document.getElementById('successAlert');\n    const nonFieldAlert = document.getElementById('nonFieldAlert');\n    const nonFieldText  = document.getElementById('nonFieldText');\n\n    // ----- Показать/скрыть пароль -----\n    toggleBtn.addEventListener('click', () => {\n        const hidden = password.type === 'password';\n        password.type = hidden ? 'text' : 'password';\n        toggleIcon.classList.toggle('bi-eye', !hidden);\n        toggleIcon.classList.toggle('bi-eye-slash', hidden);\n        toggleBtn.setAttribute('aria-label', hidden ? 'Скрыть пароль' : 'Показать пароль');\n    });\n\n    // ----- Валидация -----\n    const fields = { email, password };\n    const errorEls = { email: emailError, password: passwordError };\n\n    const validators = {\n        email() {\n            const v = email.value.trim();\n            if (!v) return 'Введите email.';\n            if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v)) return 'Введите корректный email.';\n            return '';\n        },\n        password() {\n            if (!password.value) return 'Введите пароль.';\n            if (password.value.length < 6) return 'Пароль должен содержать минимум 6 символов.';\n            return '';\n        }\n    };\n\n    function setFieldState(input, errorEl, message) {\n        if (message) {\n            input.classList.add('is-invalid');\n            input.classList.remove('is-valid');\n            errorEl.textContent = message;\n        } else {\n            input.classList.remove('is-invalid');\n            input.classList.add('is-valid');\n        }\n    }\n\n    function validateField(name) {\n        const msg = validators[name]();\n        setFieldState(fields[name], errorEls[name], msg);\n        return !msg;\n    }\n\n    ['email', 'password'].forEach(name => {\n        const input = fields[name];\n        input.addEventListener('blur', () => validateField(name));\n        input.addEventListener('input', () => {\n            if (input.classList.contains('is-invalid')) validateField(name);\n        });\n    });\n\n    function showError(msg) {\n        nonFieldText.textContent = msg;\n        nonFieldAlert.classList.remove('d-none');\n        nonFieldAlert.classList.add('d-flex');\n    }\n\n    // ----- Отправка -----\n    form.addEventListener('submit', async (e) => {\n        e.preventDefault();\n\n        nonFieldAlert.classList.add('d-none');\n        nonFieldAlert.classList.remove('d-flex');\n\n        const okEmail = validateField('email');\n        const okPass  = validateField('password');\n        if (!okEmail || !okPass) {\n            (!okEmail ? email : password).focus();\n            return;\n        }\n\n        submitBtn.disabled = true;\n        submitIcon.classList.add('d-none');\n        submitSpinner.classList.remove('d-none');\n        submitText.textContent = 'Проверяем…';\n\n        try {\n            const res = await window.db_requests.employeesLogin({\n                email: email.value.trim(),\n                password: password.value,\n            });\n            await window.authStorage.save(res.data);\n            window.app.states.data.user = res.data;\n            successAlert.classList.remove('d-none');\n            successAlert.classList.add('d-flex');\n            setTimeout(() => window.navigate('/'), 400);\n        } catch (error) {\n            showError(error.message || 'Не удалось войти');\n            submitBtn.disabled = false;\n            submitSpinner.classList.add('d-none');\n            submitIcon.classList.remove('d-none');\n            submitText.textContent = 'Войти';\n        }\n    });\n})();\n</script>\n";
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
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_8,t_7) {
if(t_8) { cb(t_8); return; }
output += t_7;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})});
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
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 4;
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

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["clients.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "clients.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})});
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
output += "\n<div class=\"d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3\">\n    <div>\n        <h1 class=\"h4 mb-1\">Клиенты</h1>\n        <div class=\"text-body-secondary small\" id=\"clientsCount\">Загружаем…</div>\n    </div>\n    <button type=\"button\" class=\"btn btn-primary\" id=\"addBtn\">\n        <i class=\"bi bi-person-plus me-1\"></i>Добавить клиента\n    </button>\n</div>\n\n<div class=\"card border-0 shadow-sm rounded-4\">\n    <div class=\"card-body p-3 p-md-4\">\n\n        <!-- Поиск и сортировка -->\n        <div class=\"row g-2 mb-3\">\n            <div class=\"col-12 col-md-8\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"search\">Поиск</label>\n                <input type=\"search\" class=\"form-control\" id=\"search\"\n                       placeholder=\"Имя, телефон или email\">\n            </div>\n            <div class=\"col-12 col-md-4\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"sort\">Сортировка</label>\n                <select class=\"form-select\" id=\"sort\">\n                    <option value=\"name_asc\">Фамилия: А → Я</option>\n                    <option value=\"name_desc\">Фамилия: Я → А</option>\n                    <option value=\"appointments\">Больше всего записей</option>\n                </select>\n            </div>\n        </div>\n\n        <div class=\"table-responsive\">\n            <table class=\"table align-middle mb-0\">\n                <thead class=\"table-light\">\n                    <tr>\n                        <th scope=\"col\">Клиент</th>\n                        <th scope=\"col\">Телефон</th>\n                        <th scope=\"col\">Email</th>\n                        <th scope=\"col\" class=\"text-end\">Записей</th>\n                        <th scope=\"col\" class=\"text-end\">Действия</th>\n                    </tr>\n                </thead>\n                <tbody id=\"rows\"></tbody>\n            </table>\n        </div>\n        <div id=\"empty\" class=\"text-body-secondary text-center py-4 d-none\">Ничего не найдено</div>\n    </div>\n</div>\n\n<!-- Модалка добавления/редактирования -->\n<div class=\"modal fade\" id=\"clientModal\" tabindex=\"-1\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <div class=\"modal-content rounded-4\">\n            <form id=\"clientForm\" novalidate>\n                <div class=\"modal-header border-0 pb-0\">\n                    <h5 class=\"modal-title fs-6 fw-semibold\" id=\"clientModalTitle\">Новый клиент</h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>\n                </div>\n                <div class=\"modal-body\">\n                    <div class=\"alert alert-danger d-none py-2 small mb-3\" id=\"modalAlert\" role=\"alert\">\n                        <div id=\"modalError\"></div>\n                    </div>\n\n                    <div class=\"row g-3 mb-3\">\n                        <div class=\"col-12 col-sm-6\">\n                            <label for=\"firstName\" class=\"form-label\">Имя</label>\n                            <input type=\"text\" class=\"form-control\" id=\"firstName\" maxlength=\"255\"\n                                   placeholder=\"Анна\" required>\n                            <div class=\"invalid-feedback\" id=\"firstNameError\">Введите имя.</div>\n                        </div>\n                        <div class=\"col-12 col-sm-6\">\n                            <label for=\"lastName\" class=\"form-label\">Фамилия</label>\n                            <input type=\"text\" class=\"form-control\" id=\"lastName\" maxlength=\"255\"\n                                   placeholder=\"Иванова\" required>\n                            <div class=\"invalid-feedback\" id=\"lastNameError\">Введите фамилию.</div>\n                        </div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"number\" class=\"form-label\">Телефон</label>\n                        <input type=\"tel\" class=\"form-control\" id=\"number\" maxlength=\"20\"\n                               placeholder=\"+7 (900) 123-45-67\" required>\n                        <div class=\"invalid-feedback\" id=\"numberError\">Введите телефон.</div>\n                    </div>\n\n                    <div class=\"mb-1\">\n                        <label for=\"clientEmail\" class=\"form-label\">Email</label>\n                        <input type=\"email\" class=\"form-control\" id=\"clientEmail\" maxlength=\"255\"\n                               placeholder=\"name@example.com\" required>\n                        <div class=\"invalid-feedback\" id=\"clientEmailError\">Введите корректный email.</div>\n                    </div>\n                </div>\n                <div class=\"modal-footer border-0 pt-0\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" data-bs-dismiss=\"modal\">Отмена</button>\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\" id=\"saveBtn\">Сохранить</button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 104;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const $ = (id) => document.getElementById(id);\n    if (!$('rows')) return;                       // страница ещё не отрисована\n\n    const ui = window.ui;\n    const api = window.db_requests.clients;\n\n    let rows = [];\n    let editingId = null;\n\n    /* ------------------------- Валидация полей ------------------------- */\n    const fields = {\n        first_name: {\n            input: $('firstName'), error: $('firstNameError'),\n            check: (v) => (v.trim() ? '' : 'Введите имя.'),\n        },\n        last_name: {\n            input: $('lastName'), error: $('lastNameError'),\n            check: (v) => (v.trim() ? '' : 'Введите фамилию.'),\n        },\n        number: {\n            input: $('number'), error: $('numberError'),\n            check: (v) => {\n                const s = v.trim();\n                if (!s) return 'Введите телефон.';\n                if (!/^\\+?[0-9()\\- ]{5,20}$/.test(s)) return 'Телефон: цифры, +, -, скобки и пробелы.';\n                if (s.replace(/\\D/g, '').length < 5) return 'В телефоне не меньше 5 цифр.';\n                return '';\n            },\n        },\n        email: {\n            input: $('clientEmail'), error: $('clientEmailError'),\n            check: (v) => {\n                const s = v.trim();\n                if (!s) return 'Введите email.';\n                return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s) ? '' : 'Введите корректный email.';\n            },\n        },\n    };\n    const validate = ui.bindValidation(fields);\n\n    /* ---------------------------- Загрузка ---------------------------- */\n    async function load() {\n        try {\n            rows = await api.list();\n            render();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось загрузить клиентов', 'danger');\n        }\n    }\n\n    function filtered() {\n        const q = $('search').value.trim().toLowerCase();\n        const list = rows.filter((r) => !q\n            || [r.first_name, r.last_name, r.number, r.email].join(' ').toLowerCase().includes(q));\n\n        const sort = $('sort').value;\n        const byName = (a, b) => `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`, 'ru');\n        if (sort === 'name_asc') list.sort(byName);\n        else if (sort === 'name_desc') list.sort((a, b) => byName(b, a));\n        else if (sort === 'appointments') {\n            list.sort((a, b) => (b.appointments_count || 0) - (a.appointments_count || 0) || byName(a, b));\n        }\n        return list;\n    }\n\n    function render() {\n        const list = filtered();\n        $('clientsCount').textContent = `Всего клиентов: ${rows.length}`;\n        $('rows').innerHTML = list.map((r) => `\n            <tr>\n                <td>\n                    <div class=\"fw-semibold\">${ui.esc(r.last_name)} ${ui.esc(r.first_name)}</div>\n                </td>\n                <td class=\"text-nowrap\">${ui.esc(r.number)}</td>\n                <td class=\"text-break\">${ui.esc(r.email)}</td>\n                <td class=\"text-end\">\n                    <span class=\"badge text-bg-light rounded-pill\">${ui.num(r.appointments_count || 0)}</span>\n                </td>\n                <td class=\"text-end text-nowrap\">\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-secondary me-1\" data-edit=\"${r.id}\"\n                            aria-label=\"Редактировать\"><i class=\"bi bi-pencil\"></i></button>\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-danger\" data-del=\"${r.id}\"\n                            aria-label=\"Удалить\"><i class=\"bi bi-trash\"></i></button>\n                </td>\n            </tr>`).join('');\n        $('empty').classList.toggle('d-none', list.length > 0);\n    }\n\n    /* ------------------------- Модалка и форма ------------------------- */\n    function openModal(row) {\n        editingId = row ? row.id : null;\n        $('clientModalTitle').textContent = row ? 'Редактировать клиента' : 'Новый клиент';\n        $('firstName').value = row ? row.first_name : '';\n        $('lastName').value = row ? row.last_name : '';\n        $('number').value = row ? row.number : '';\n        $('clientEmail').value = row ? row.email : '';\n        Object.values(fields).forEach((f) => {\n            f.input.classList.remove('is-invalid', 'is-valid');\n        });\n        showError('');\n        window.bootstrap.Modal.getOrCreateInstance($('clientModal')).show();\n        setTimeout(() => $('firstName').focus(), 300);\n    }\n\n    function showError(message) {\n        $('modalError').textContent = message || '';\n        $('modalAlert').classList.toggle('d-none', !message);\n    }\n\n    $('addBtn').addEventListener('click', () => openModal(null));\n    $('search').addEventListener('input', render);\n    $('sort').addEventListener('change', render);\n\n    $('rows').addEventListener('click', async (event) => {\n        const editBtn = event.target.closest('[data-edit]');\n        if (editBtn) {\n            const row = rows.find((r) => String(r.id) === editBtn.dataset.edit);\n            if (row) openModal(row);\n            return;\n        }\n        const delBtn = event.target.closest('[data-del]');\n        if (!delBtn) return;\n        const row = rows.find((r) => String(r.id) === delBtn.dataset.del);\n        if (!row) return;\n\n        const confirmed = await ui.confirm({\n            title: 'Удалить клиента?',\n            text: `${row.last_name} ${row.first_name} (${row.number}) будет удалён(а) из базы.`,\n        });\n        if (!confirmed) return;\n        try {\n            await api.remove(row.id);\n            ui.toast('Клиент удалён', 'success');\n            await load();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось удалить', 'danger');\n        }\n    });\n\n    $('clientForm').addEventListener('submit', async (event) => {\n        event.preventDefault();\n        showError('');\n        if (!validate()) return;\n\n        const payload = {\n            id: editingId,\n            first_name: fields.first_name.input.value.trim(),\n            last_name: fields.last_name.input.value.trim(),\n            number: fields.number.input.value.trim(),\n            email: fields.email.input.value.trim(),\n        };\n\n        try {\n            await ui.withBusy($('saveBtn'), async () => {\n                if (editingId) await api.update(payload);\n                else await api.create(payload);\n            }, 'Сохраняем…');\n\n            window.bootstrap.Modal.getOrCreateInstance($('clientModal')).hide();\n            ui.toast(editingId ? 'Клиент обновлён' : 'Клиент добавлен', 'success');\n            await load();\n        } catch (error) {\n            showError(error.message || 'Не удалось сохранить');\n        }\n    });\n\n    load();\n})();\n</script>\n";
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
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})});
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
output += "\n    <div class=\"col-12\">\n        <div class=\"card border-0 shadow-sm rounded-4\">\n            <div class=\"card-body p-4\">\n                <div class=\"d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3\">\n                    <div>\n                        <h1 class=\"h3 mb-1\">Здравствуйте, ";
output += runtime.suppressValue(runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"first_name") || runtime.memberLookup((runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"user")),"username") || "гость", env.opts.autoescape);
output += "</h1>\n                        <div class=\"text-body-secondary small mb-0\">\n                            Салон красоты · управление записью, клиентами и выручкой\n                        </div>\n                    </div>\n                    <div class=\"d-flex flex-wrap gap-2\">\n                        <a class=\"btn btn-primary\" href=\"#/appointments\">\n                            <i class=\"bi bi-calendar-plus me-1\"></i>Записать клиента\n                        </a>\n                        <a class=\"btn btn-outline-secondary\" href=\"#/reports\">\n                            <i class=\"bi bi-bar-chart-line me-1\"></i>Отчёт\n                        </a>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    ";
output += "\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"d-flex align-items-center gap-2 text-body-secondary small mb-1\">\n                    <i class=\"bi bi-people\"></i>Клиенты\n                </div>\n                <div class=\"h4 mb-0\" id=\"statClients\">—</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"d-flex align-items-center gap-2 text-body-secondary small mb-1\">\n                    <i class=\"bi bi-person-badge\"></i>Мастера\n                </div>\n                <div class=\"h4 mb-0\" id=\"statMasters\">—</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"d-flex align-items-center gap-2 text-body-secondary small mb-1\">\n                    <i class=\"bi bi-scissors\"></i>Услуги\n                </div>\n                <div class=\"h4 mb-0\" id=\"statServices\">—</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"d-flex align-items-center gap-2 text-body-secondary small mb-1\">\n                    <i class=\"bi bi-cash-stack\"></i>Выручка за месяц\n                </div>\n                <div class=\"h4 mb-0 text-success\" id=\"statRevenue\">—</div>\n            </div>\n        </div>\n    </div>\n\n    ";
output += "\n    <div class=\"col-12\">\n        <div class=\"card border-0 shadow-sm rounded-4\">\n            <div class=\"card-body p-3 p-md-4\">\n                <div class=\"d-flex justify-content-between align-items-center mb-3\">\n                    <h2 class=\"h6 text-body-secondary text-uppercase mb-0\">Записи на сегодня</h2>\n                    <span class=\"badge text-bg-light rounded-pill\" id=\"todayCount\">—</span>\n                </div>\n                <div id=\"todayEmpty\" class=\"text-body-secondary small d-none\">\n                    На сегодня записей нет.\n                </div>\n                <div class=\"table-responsive\">\n                    <table class=\"table align-middle mb-0\">\n                        <thead class=\"table-light\">\n                            <tr>\n                                <th scope=\"col\">Время</th>\n                                <th scope=\"col\">Клиент</th>\n                                <th scope=\"col\">Мастер</th>\n                                <th scope=\"col\">Услуга</th>\n                                <th scope=\"col\" class=\"text-end\">Стоимость</th>\n                                <th scope=\"col\">Статус</th>\n                            </tr>\n                        </thead>\n                        <tbody id=\"todayRows\"></tbody>\n                    </table>\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 104;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const $ = (id) => document.getElementById(id);\n    if (!$('statClients')) return;\n\n    const ui = window.ui;\n    const STATUS_LABELS = { new: 'Записана', done: 'Оказана', cancelled: 'Отменена' };\n    const STATUS_BADGES = { new: 'text-bg-primary', done: 'text-bg-success', cancelled: 'text-bg-secondary' };\n\n    async function load() {\n        try {\n            const dash = await window.db_requests.reports.dashboard();\n\n            $('statClients').textContent = ui.num(dash.clients);\n            $('statMasters').textContent = ui.num(dash.employees);\n            $('statServices').textContent = ui.num(dash.services);\n            $('statRevenue').textContent = ui.money(dash.month.revenue);\n\n            const list = dash.todayAppointments || [];\n            $('todayCount').textContent = `${list.length} ${plural(list.length, 'запись', 'записи', 'записей')}`;\n            $('todayEmpty').classList.toggle('d-none', list.length > 0);\n            $('todayRows').innerHTML = list.map((r) => {\n                const client = r.client || {};\n                const master = r.employee || {};\n                const service = r.service || {};\n                const status = STATUS_LABELS[r.status] ? r.status : 'new';\n                return `\n                <tr>\n                    <td class=\"fw-semibold text-nowrap\">${ui.fmtTime(r.time)}</td>\n                    <td>${ui.esc(client.last_name || '')} ${ui.esc(client.first_name || '')}</td>\n                    <td class=\"text-nowrap\">${ui.esc(master.last_name || '')} ${ui.esc(master.first_name || '')}</td>\n                    <td>${ui.esc(service.title || '—')}</td>\n                    <td class=\"text-end text-nowrap\">${ui.money(service.price || 0)}</td>\n                    <td><span class=\"badge rounded-pill ${STATUS_BADGES[status]}\">${STATUS_LABELS[status]}</span></td>\n                </tr>`;\n            }).join('');\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось загрузить сводку', 'danger');\n        }\n    }\n\n    function plural(n, one, few, many) {\n        const mod10 = n % 10;\n        const mod100 = n % 100;\n        if (mod10 === 1 && mod100 !== 11) return one;\n        if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;\n        return many;\n    }\n\n    load();\n})();\n</script>\n";
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

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["masters.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "masters.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})});
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
output += "\n<div class=\"d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3\">\n    <div>\n        <h1 class=\"h4 mb-1\">Мастера и сотрудники</h1>\n        <div class=\"text-body-secondary small\" id=\"mastersCount\">Загружаем…</div>\n    </div>\n    <button type=\"button\" class=\"btn btn-primary\" id=\"addBtn\">\n        <i class=\"bi bi-person-plus me-1\"></i>Зарегистрировать мастера\n    </button>\n</div>\n\n<div class=\"card border-0 shadow-sm rounded-4\">\n    <div class=\"card-body p-3 p-md-4\">\n\n        <div class=\"row g-2 mb-3\">\n            <div class=\"col-12 col-md-8\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"search\">Поиск</label>\n                <input type=\"search\" class=\"form-control\" id=\"search\" placeholder=\"Имя или email\">\n            </div>\n            <div class=\"col-12 col-md-4\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"roleFilter\">Фильтр по роли</label>\n                <select class=\"form-select\" id=\"roleFilter\">\n                    <option value=\"\">Все роли</option>\n                    <option value=\"master\">Мастер</option>\n                    <option value=\"admin\">Администратор</option>\n                    <option value=\"user\">Пользователь</option>\n                </select>\n            </div>\n        </div>\n\n        <div class=\"table-responsive\">\n            <table class=\"table align-middle mb-0\">\n                <thead class=\"table-light\">\n                    <tr>\n                        <th scope=\"col\">Сотрудник</th>\n                        <th scope=\"col\">Email</th>\n                        <th scope=\"col\">Роль</th>\n                        <th scope=\"col\" class=\"text-end\">Записей</th>\n                        <th scope=\"col\" class=\"text-end\">Действия</th>\n                    </tr>\n                </thead>\n                <tbody id=\"rows\"></tbody>\n            </table>\n        </div>\n        <div id=\"empty\" class=\"text-body-secondary text-center py-4 d-none\">Ничего не найдено</div>\n    </div>\n</div>\n\n<!-- Модалка регистрации / редактирования -->\n<div class=\"modal fade\" id=\"masterModal\" tabindex=\"-1\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <div class=\"modal-content rounded-4\">\n            <form id=\"masterForm\" novalidate>\n                <div class=\"modal-header border-0 pb-0\">\n                    <h5 class=\"modal-title fs-6 fw-semibold\" id=\"masterModalTitle\">Новый сотрудник</h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>\n                </div>\n                <div class=\"modal-body\">\n                    <div class=\"alert alert-danger d-none py-2 small mb-3\" id=\"modalAlert\" role=\"alert\">\n                        <div id=\"modalError\"></div>\n                    </div>\n\n                    <div class=\"row g-3 mb-3\">\n                        <div class=\"col-12 col-sm-6\">\n                            <label for=\"firstName\" class=\"form-label\">Имя</label>\n                            <input type=\"text\" class=\"form-control\" id=\"firstName\" maxlength=\"255\" required>\n                            <div class=\"invalid-feedback\" id=\"firstNameError\">Введите имя.</div>\n                        </div>\n                        <div class=\"col-12 col-sm-6\">\n                            <label for=\"lastName\" class=\"form-label\">Фамилия</label>\n                            <input type=\"text\" class=\"form-control\" id=\"lastName\" maxlength=\"255\" required>\n                            <div class=\"invalid-feedback\" id=\"lastNameError\">Введите фамилию.</div>\n                        </div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"masterEmail\" class=\"form-label\">Email</label>\n                        <input type=\"email\" class=\"form-control\" id=\"masterEmail\" maxlength=\"255\"\n                               placeholder=\"name@example.com\" required>\n                        <div class=\"invalid-feedback\" id=\"masterEmailError\">Введите корректный email.</div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"role\" class=\"form-label\">Роль</label>\n                        <select class=\"form-select\" id=\"role\" required>\n                            <option value=\"master\">Мастер</option>\n                            <option value=\"admin\">Администратор</option>\n                            <option value=\"user\">Пользователь</option>\n                        </select>\n                        <div class=\"invalid-feedback\" id=\"roleError\">Выберите роль.</div>\n                    </div>\n\n                    <div class=\"mb-1\">\n                        <label for=\"password\" class=\"form-label\">Пароль</label>\n                        <input type=\"password\" class=\"form-control\" id=\"password\" minlength=\"6\"\n                               autocomplete=\"new-password\">\n                        <div class=\"invalid-feedback\" id=\"passwordError\">Минимум 6 символов, буквы и цифры.</div>\n                        <div class=\"form-text\" id=\"passwordHint\">Минимум 6 символов, буквы и цифры.</div>\n                    </div>\n                </div>\n                <div class=\"modal-footer border-0 pt-0\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" data-bs-dismiss=\"modal\">Отмена</button>\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\" id=\"saveBtn\">Сохранить</button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 112;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const $ = (id) => document.getElementById(id);\n    if (!$('rows')) return;\n\n    const ui = window.ui;\n    const api = window.db_requests.employees;\n    const ROLE_LABELS = { master: 'Мастер', admin: 'Администратор', user: 'Пользователь' };\n\n    let rows = [];\n    let editingId = null;\n\n    const fields = {\n        first_name: {\n            input: $('firstName'), error: $('firstNameError'),\n            check: (v) => (v.trim() ? '' : 'Введите имя.'),\n        },\n        last_name: {\n            input: $('lastName'), error: $('lastNameError'),\n            check: (v) => (v.trim() ? '' : 'Введите фамилию.'),\n        },\n        email: {\n            input: $('masterEmail'), error: $('masterEmailError'),\n            check: (v) => {\n                const s = v.trim();\n                if (!s) return 'Введите email.';\n                return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s) ? '' : 'Введите корректный email.';\n            },\n        },\n        role: {\n            input: $('role'), error: $('roleError'),\n            check: (v) => (['master', 'admin', 'user'].includes(v) ? '' : 'Выберите роль.'),\n        },\n        password: {\n            input: $('password'), error: $('passwordError'),\n            check: (v) => {\n                const s = v.trim();\n                if (!editingId && !s) return 'Введите пароль.';\n                if (!s) return '';                       // при редактировании пусто = не менять\n                if (s.length < 6) return 'Минимум 6 символов.';\n                if (!/[a-zA-Zа-яА-ЯёЁ]/.test(s) || !/\\d/.test(s)) return 'Нужны буквы и цифры.';\n                return '';\n            },\n        },\n    };\n    const validate = ui.bindValidation(fields);\n\n    async function load() {\n        try {\n            rows = await api.list();\n            render();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось загрузить сотрудников', 'danger');\n        }\n    }\n\n    function filtered() {\n        const q = $('search').value.trim().toLowerCase();\n        const role = $('roleFilter').value;\n        return rows.filter((r) => {\n            if (role && r.role !== role) return false;\n            return !q || [r.first_name, r.last_name, r.email].join(' ').toLowerCase().includes(q);\n        });\n    }\n\n    function render() {\n        const list = filtered();\n        $('mastersCount').textContent = `Всего сотрудников: ${rows.length}`;\n        $('rows').innerHTML = list.map((r) => `\n            <tr>\n                <td class=\"fw-semibold\">${ui.esc(r.last_name)} ${ui.esc(r.first_name)}</td>\n                <td class=\"text-break\">${ui.esc(r.email)}</td>\n                <td><span class=\"badge text-bg-secondary rounded-pill\">${ui.esc(ROLE_LABELS[r.role] || r.role)}</span></td>\n                <td class=\"text-end\">\n                    <span class=\"badge text-bg-light rounded-pill\">${ui.num(r.appointments_count || 0)}</span>\n                </td>\n                <td class=\"text-end text-nowrap\">\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-secondary me-1\" data-edit=\"${r.id}\"\n                            aria-label=\"Редактировать\"><i class=\"bi bi-pencil\"></i></button>\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-danger\" data-del=\"${r.id}\"\n                            aria-label=\"Удалить\"><i class=\"bi bi-trash\"></i></button>\n                </td>\n            </tr>`).join('');\n        $('empty').classList.toggle('d-none', list.length > 0);\n    }\n\n    function openModal(row) {\n        editingId = row ? row.id : null;\n        $('masterModalTitle').textContent = row ? 'Редактировать сотрудника' : 'Новый сотрудник';\n        $('firstName').value = row ? row.first_name : '';\n        $('lastName').value = row ? row.last_name : '';\n        $('masterEmail').value = row ? row.email : '';\n        $('role').value = row && ROLE_LABELS[row.role] ? row.role : 'master';\n        $('password').value = '';\n        $('passwordHint').textContent = row\n            ? 'Оставьте поле пустым, чтобы не менять пароль.'\n            : 'Минимум 6 символов, буквы и цифры.';\n        Object.values(fields).forEach((f) => f.input.classList.remove('is-invalid', 'is-valid'));\n        showError('');\n        window.bootstrap.Modal.getOrCreateInstance($('masterModal')).show();\n        setTimeout(() => $('firstName').focus(), 300);\n    }\n\n    function showError(message) {\n        $('modalError').textContent = message || '';\n        $('modalAlert').classList.toggle('d-none', !message);\n    }\n\n    $('addBtn').addEventListener('click', () => openModal(null));\n    $('search').addEventListener('input', render);\n    $('roleFilter').addEventListener('change', render);\n\n    $('rows').addEventListener('click', async (event) => {\n        const editBtn = event.target.closest('[data-edit]');\n        if (editBtn) {\n            const row = rows.find((r) => String(r.id) === editBtn.dataset.edit);\n            if (row) openModal(row);\n            return;\n        }\n        const delBtn = event.target.closest('[data-del]');\n        if (!delBtn) return;\n        const row = rows.find((r) => String(r.id) === delBtn.dataset.del);\n        if (!row) return;\n\n        const confirmed = await ui.confirm({\n            title: 'Удалить сотрудника?',\n            text: `${row.last_name} ${row.first_name} будет удалён(а) из базы.`,\n        });\n        if (!confirmed) return;\n        try {\n            await api.remove(row.id);\n            ui.toast('Сотрудник удалён', 'success');\n            await load();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось удалить', 'danger');\n        }\n    });\n\n    $('masterForm').addEventListener('submit', async (event) => {\n        event.preventDefault();\n        showError('');\n        if (!validate()) return;\n\n        const payload = {\n            id: editingId,\n            first_name: fields.first_name.input.value.trim(),\n            last_name: fields.last_name.input.value.trim(),\n            email: fields.email.input.value.trim(),\n            role: fields.role.input.value,\n            password: fields.password.input.value,\n        };\n\n        try {\n            await ui.withBusy($('saveBtn'), async () => {\n                if (editingId) await api.update(payload);\n                else await api.create(payload);\n            }, 'Сохраняем…');\n\n            window.bootstrap.Modal.getOrCreateInstance($('masterModal')).hide();\n            ui.toast(editingId ? 'Данные обновлены' : 'Мастер зарегистрирован', 'success');\n            await load();\n        } catch (error) {\n            showError(error.message || 'Не удалось сохранить');\n        }\n    });\n\n    load();\n})();\n</script>\n";
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

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["navbar.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
output += "<nav class=\"navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top px-3 px-lg-4\">\n    <div class=\"container-fluid px-3 px-lg-4\">\n\n        <!-- ЛОГО -->\n        <a class=\"navbar-brand fw-bold d-flex align-items-center gap-2 me-auto me-lg-0\" href=\"#/\">\n            <span class=\"d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-3\"\n                  style=\"width:32px;height:32px;\">\n                <i class=\"bi bi-kanban\"></i>\n            </span>\n            <span>";
output += runtime.suppressValue(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"appName"), env.opts.autoescape);
output += "</span>\n        </a>\n        <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\"\n                data-bs-target=\"#navMain\" aria-controls=\"navMain\"\n                aria-expanded=\"false\" aria-label=\"Показать меню\">\n            <span class=\"navbar-toggler-icon\"></span>\n        </button>\n        \n    </div>\n        \n\n        <!-- СВОРАЧИВАЕМАЯ ЧАСТЬ -->\n        <div class=\"collapse navbar-collapse\" id=\"navMain\">\n            <div class=\"d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center\n                        gap-2 ms-lg-3 mt-3 mt-lg-0\">\n\n                <!-- Разделы задания №14 -->\n                <ul class=\"navbar-nav me-lg-3 mb-2 mb-lg-0\">\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"path") == "/") {
output += " active";
;
}
output += "\" href=\"#/\">\n                            <i class=\"bi bi-house-door me-1\"></i>Главная\n                        </a>\n                    </li>\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"path") == "/appointments") {
output += " active";
;
}
output += "\" href=\"#/appointments\">\n                            <i class=\"bi bi-calendar-check me-1\"></i>Записи\n                        </a>\n                    </li>\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"path") == "/clients") {
output += " active";
;
}
output += "\" href=\"#/clients\">\n                            <i class=\"bi bi-people me-1\"></i>Клиенты\n                        </a>\n                    </li>\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"path") == "/masters") {
output += " active";
;
}
output += "\" href=\"#/masters\">\n                            <i class=\"bi bi-person-badge me-1\"></i>Мастера\n                        </a>\n                    </li>\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"path") == "/services") {
output += " active";
;
}
output += "\" href=\"#/services\">\n                            <i class=\"bi bi-scissors me-1\"></i>Услуги\n                        </a>\n                    </li>\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link";
if(runtime.memberLookup((runtime.contextOrFrameLookup(context, frame, "data")),"path") == "/reports") {
output += " active";
;
}
output += "\" href=\"#/reports\">\n                            <i class=\"bi bi-bar-chart-line me-1\"></i>Отчёты\n                        </a>\n                    </li>\n                </ul>\n\n                <!-- ==================== АВТОРИЗОВАН ==================== -->\n                <div class=\"d-flex flex-row justify-content-end align-items-center gap-2\" id=\"userBlock\">\n\n                    <!-- Тема -->\n                    <button type=\"button\"\n                            class=\"btn btn-outline-secondary border-0\"\n                            id=\"themeToggle\" aria-label=\"Переключить тему\">\n                        <i class=\"bi bi-moon-stars\" id=\"themeIcon\"></i>\n                    </button>\n\n                    <!-- Профиль -->\n                    <div class=\"dropdown\">\n                        <button class=\"btn p-0 border-0 d-flex align-items-center gap-2\"\n                                type=\"button\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\"\n                                aria-label=\"Профиль\">\n                            <span id=\"avatar\"\n                                  class=\"avatar-circle bg-primary bg-opacity-25 text-primary fw-bold rounded-circle\">";
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

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["reports.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "reports.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})});
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
output += "\n<style>\n    @media print {\n        nav, #toastHost, .no-print { display: none !important; }\n        main.container { padding: 0 !important; }\n        .card { box-shadow: none !important; border: 1px solid #dee2e6 !important; }\n        body { background: #fff !important; }\n    }\n</style>\n\n<div class=\"d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3 no-print\">\n    <div>\n        <h1 class=\"h4 mb-1\">Отчёт об оказанных услугах</h1>\n        <div class=\"text-body-secondary small\" id=\"periodLabel\">Загружаем…</div>\n    </div>\n    <div class=\"d-flex gap-2\">\n        <button type=\"button\" class=\"btn btn-outline-secondary\" id=\"printBtn\">\n            <i class=\"bi bi-printer me-1\"></i>Печать\n        </button>\n        <button type=\"button\" class=\"btn btn-primary\" id=\"buildBtn\">\n            <i class=\"bi bi-bar-chart-line me-1\"></i>Сформировать\n        </button>\n    </div>\n</div>\n\n<!-- Период -->\n<div class=\"card border-0 shadow-sm rounded-4 mb-4 no-print\">\n    <div class=\"card-body p-3 p-md-4\">\n        <div class=\"row g-3 align-items-end\">\n            <div class=\"col-6 col-md-3\">\n                <label for=\"dateFrom\" class=\"form-label small text-body-secondary mb-1\">Период с</label>\n                <input type=\"date\" class=\"form-control\" id=\"dateFrom\">\n            </div>\n            <div class=\"col-6 col-md-3\">\n                <label for=\"dateTo\" class=\"form-label small text-body-secondary mb-1\">по</label>\n                <input type=\"date\" class=\"form-control\" id=\"dateTo\">\n            </div>\n            <div class=\"col-12 col-md-6\">\n                <div class=\"d-flex flex-wrap gap-2\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" id=\"thisMonth\">Текущий месяц</button>\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" id=\"lastMonth\">Прошлый месяц</button>\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" id=\"allTime\">Всё время</button>\n                </div>\n            </div>\n        </div>\n        <div class=\"alert alert-danger d-none py-2 small mt-3 mb-0\" id=\"reportError\" role=\"alert\">\n            <div id=\"reportErrorText\"></div>\n        </div>\n    </div>\n</div>\n\n<!-- KPI -->\n<div class=\"row g-3 mb-4\">\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"text-body-secondary small\">Записей за период</div>\n                <div class=\"h3 mb-0\" id=\"kpiTotal\">—</div>\n                <div class=\"small text-body-secondary\" id=\"kpiStatuses\">—</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"text-body-secondary small\">Оказано услуг</div>\n                <div class=\"h3 mb-0\" id=\"kpiDone\">—</div>\n                <div class=\"small text-body-secondary\">статус «Оказана»</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"text-body-secondary small\">Выручка</div>\n                <div class=\"h3 mb-0 text-success\" id=\"kpiRevenue\">—</div>\n                <div class=\"small text-body-secondary\" id=\"kpiPlanned\">—</div>\n            </div>\n        </div>\n    </div>\n    <div class=\"col-6 col-lg-3\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3\">\n                <div class=\"text-body-secondary small\">Средний чек</div>\n                <div class=\"h3 mb-0\" id=\"kpiAvg\">—</div>\n                <div class=\"small text-body-secondary\">на одну оказанную услугу</div>\n            </div>\n        </div>\n    </div>\n</div>\n\n<div class=\"row g-4\">\n    <!-- По услугам -->\n    <div class=\"col-12 col-lg-6\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3 p-md-4\">\n                <h2 class=\"h6 text-body-secondary text-uppercase mb-3\">Услуги</h2>\n                <div class=\"table-responsive\">\n                    <table class=\"table align-middle mb-0\">\n                        <thead class=\"table-light\">\n                            <tr>\n                                <th scope=\"col\">Услуга</th>\n                                <th scope=\"col\" class=\"text-end\">Кол-во</th>\n                                <th scope=\"col\" class=\"text-end\">Выручка</th>\n                                <th scope=\"col\" class=\"text-end\">Доля</th>\n                            </tr>\n                        </thead>\n                        <tbody id=\"serviceRows\"></tbody>\n                    </table>\n                </div>\n                <div id=\"serviceEmpty\" class=\"text-body-secondary small text-center py-3 d-none\">\n                    За период услуг не оказано\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- По мастерам -->\n    <div class=\"col-12 col-lg-6\">\n        <div class=\"card border-0 shadow-sm rounded-4 h-100\">\n            <div class=\"card-body p-3 p-md-4\">\n                <h2 class=\"h6 text-body-secondary text-uppercase mb-3\">Мастера</h2>\n                <div class=\"table-responsive\">\n                    <table class=\"table align-middle mb-0\">\n                        <thead class=\"table-light\">\n                            <tr>\n                                <th scope=\"col\">Мастер</th>\n                                <th scope=\"col\" class=\"text-end\">Услуг</th>\n                                <th scope=\"col\" class=\"text-end\">Выручка</th>\n                            </tr>\n                        </thead>\n                        <tbody id=\"masterRows\"></tbody>\n                    </table>\n                </div>\n                <div id=\"masterEmpty\" class=\"text-body-secondary small text-center py-3 d-none\">\n                    За период нет данных\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <!-- По клиентам -->\n    <div class=\"col-12\">\n        <div class=\"card border-0 shadow-sm rounded-4\">\n            <div class=\"card-body p-3 p-md-4\">\n                <h2 class=\"h6 text-body-secondary text-uppercase mb-3\">Клиенты</h2>\n                <div class=\"table-responsive\">\n                    <table class=\"table align-middle mb-0\">\n                        <thead class=\"table-light\">\n                            <tr>\n                                <th scope=\"col\">Клиент</th>\n                                <th scope=\"col\" class=\"text-end\">Оказано услуг</th>\n                                <th scope=\"col\" class=\"text-end\">Сумма</th>\n                            </tr>\n                        </thead>\n                        <tbody id=\"clientRows\"></tbody>\n                    </table>\n                </div>\n                <div id=\"clientEmpty\" class=\"text-body-secondary small text-center py-3 d-none\">\n                    За период нет данных\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 169;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const $ = (id) => document.getElementById(id);\n    if (!$('buildBtn')) return;\n\n    const ui = window.ui;\n    const api = window.db_requests.reports;\n    let lastReport = null;\n\n    function setPeriod(from, to) {\n        $('dateFrom').value = from || '';\n        $('dateTo').value = to || '';\n    }\n\n    function thisMonthRange() {\n        const now = new Date();\n        const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();\n        return {\n            from: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`,\n            to: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`,\n        };\n    }\n\n    function lastMonthRange() {\n        const now = new Date();\n        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);\n        const last = new Date(prev.getFullYear(), prev.getMonth() + 1, 0).getDate();\n        return {\n            from: `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-01`,\n            to: `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(last).padStart(2, '0')}`,\n        };\n    }\n\n    function showError(message) {\n        $('reportErrorText').textContent = message || '';\n        $('reportError').classList.toggle('d-none', !message);\n    }\n\n    function percent(value, total) {\n        return total ? `${Math.round((value / total) * 100)}%` : '0%';\n    }\n\n    function render(report) {\n        lastReport = report;\n\n        const period = report.from || report.to\n            ? `Период: ${report.from ? ui.fmtDate(report.from) : '…'} — ${report.to ? ui.fmtDate(report.to) : '…'}`\n            : 'Период: всё время';\n        $('periodLabel').textContent = period;\n\n        $('kpiTotal').textContent = ui.num(report.total);\n        $('kpiStatuses').textContent = `записана: ${report.statuses.new} · оказана: ${report.statuses.done} · отменена: ${report.statuses.cancelled}`;\n        $('kpiDone').textContent = ui.num(report.done);\n        $('kpiRevenue').textContent = ui.money(report.revenue);\n        $('kpiPlanned').textContent = `план (без отменённых): ${ui.money(report.planned)}`;\n        $('kpiAvg').textContent = ui.money(report.avgCheck);\n\n        $('serviceRows').innerHTML = report.services.map((s) => `\n            <tr>\n                <td>${ui.esc(s.title)}</td>\n                <td class=\"text-end\">${ui.num(s.count)}</td>\n                <td class=\"text-end text-nowrap\">${ui.money(s.revenue)}</td>\n                <td class=\"text-end\">${percent(s.revenue, report.revenue)}</td>\n            </tr>`).join('');\n        $('serviceEmpty').classList.toggle('d-none', report.services.length > 0);\n\n        $('masterRows').innerHTML = report.masters.map((m) => `\n            <tr>\n                <td>${ui.esc(m.name)}</td>\n                <td class=\"text-end\">${ui.num(m.count)}</td>\n                <td class=\"text-end text-nowrap\">${ui.money(m.revenue)}</td>\n            </tr>`).join('');\n        $('masterEmpty').classList.toggle('d-none', report.masters.length > 0);\n\n        $('clientRows').innerHTML = report.clients.map((c) => `\n            <tr>\n                <td>${ui.esc(c.name)}</td>\n                <td class=\"text-end\">${ui.num(c.count)}</td>\n                <td class=\"text-end text-nowrap\">${ui.money(c.spent)}</td>\n            </tr>`).join('');\n        $('clientEmpty').classList.toggle('d-none', report.clients.length > 0);\n    }\n\n    async function build() {\n        showError('');\n        const from = $('dateFrom').value;\n        const to = $('dateTo').value;\n        if (from && to && from > to) {\n            showError('Начальная дата позже конечной.');\n            return;\n        }\n\n        try {\n            await ui.withBusy($('buildBtn'), async () => {\n                render(await api.summary({ from, to }));\n            }, 'Считаем…');\n        } catch (error) {\n            showError(error.message || 'Не удалось построить отчёт');\n        }\n    }\n\n    $('buildBtn').addEventListener('click', build);\n    $('printBtn').addEventListener('click', () => window.print());\n    $('thisMonth').addEventListener('click', () => { const r = thisMonthRange(); setPeriod(r.from, r.to); build(); });\n    $('lastMonth').addEventListener('click', () => { const r = lastMonthRange(); setPeriod(r.from, r.to); build(); });\n    $('allTime').addEventListener('click', () => { setPeriod('', ''); build(); });\n\n    const month = thisMonthRange();\n    setPeriod(month.from, month.to);\n    build();\n})();\n</script>\n";
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

(function() {(window.nunjucksPrecompiled = window.nunjucksPrecompiled || {})["services.html"] = (function() {
function root(env, context, frame, runtime, cb) {
var lineno = 0;
var colno = 0;
var output = "";
try {
var parentTemplate = null;
env.getTemplate("base.html", true, "services.html", false, function(t_3,t_2) {
if(t_3) { cb(t_3); return; }
parentTemplate = t_2
for(var t_1 in parentTemplate.blocks) {
context.addBlock(t_1, parentTemplate.blocks[t_1]);
}
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("content"))(env, context, frame, runtime, function(t_5,t_4) {
if(t_5) { cb(t_5); return; }
output += t_4;
output += "\n\n";
(parentTemplate ? function(e, c, f, r, cb) { cb(""); } : context.getBlock("extra_js"))(env, context, frame, runtime, function(t_7,t_6) {
if(t_7) { cb(t_7); return; }
output += t_6;
output += "\n";
if(parentTemplate) {
parentTemplate.rootRenderFunc(env, context, frame, runtime, cb);
} else {
cb(null, output);
}
})})});
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
output += "\n<div class=\"d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3\">\n    <div>\n        <h1 class=\"h4 mb-1\">Справочник услуг</h1>\n        <div class=\"text-body-secondary small\" id=\"servicesCount\">Загружаем…</div>\n    </div>\n    <button type=\"button\" class=\"btn btn-primary\" id=\"addBtn\">\n        <i class=\"bi bi-plus-lg me-1\"></i>Добавить услугу\n    </button>\n</div>\n\n<div class=\"card border-0 shadow-sm rounded-4\">\n    <div class=\"card-body p-3 p-md-4\">\n\n        <!-- Поиск и фильтр по цене -->\n        <div class=\"row g-2 mb-3\">\n            <div class=\"col-12 col-md-5\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"search\">Поиск по названию</label>\n                <input type=\"search\" class=\"form-control\" id=\"search\" placeholder=\"Стрижка, маникюр…\">\n            </div>\n            <div class=\"col-6 col-md-3\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"priceMin\">Цена от</label>\n                <input type=\"number\" class=\"form-control\" id=\"priceMin\" min=\"0\" step=\"1\" placeholder=\"0\">\n            </div>\n            <div class=\"col-6 col-md-3\">\n                <label class=\"form-label small text-body-secondary mb-1\" for=\"priceMax\">Цена до</label>\n                <input type=\"number\" class=\"form-control\" id=\"priceMax\" min=\"0\" step=\"1\" placeholder=\"10000\">\n            </div>\n            <div class=\"col-12 col-md-1 d-flex align-items-end\">\n                <button type=\"button\" class=\"btn btn-outline-secondary w-100\" id=\"resetFilters\"\n                        aria-label=\"Сбросить фильтры\"><i class=\"bi bi-arrow-counterclockwise\"></i></button>\n            </div>\n        </div>\n\n        <div class=\"table-responsive\">\n            <table class=\"table align-middle mb-0\">\n                <thead class=\"table-light\">\n                    <tr>\n                        <th scope=\"col\">Услуга</th>\n                        <th scope=\"col\" class=\"text-end\">Цена</th>\n                        <th scope=\"col\">Описание</th>\n                        <th scope=\"col\" class=\"text-end\">Действия</th>\n                    </tr>\n                </thead>\n                <tbody id=\"rows\"></tbody>\n            </table>\n        </div>\n        <div id=\"empty\" class=\"text-body-secondary text-center py-4 d-none\">Ничего не найдено</div>\n    </div>\n</div>\n\n<!-- Модалка добавления/редактирования услуги -->\n<div class=\"modal fade\" id=\"serviceModal\" tabindex=\"-1\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <div class=\"modal-content rounded-4\">\n            <form id=\"serviceForm\" novalidate>\n                <div class=\"modal-header border-0 pb-0\">\n                    <h5 class=\"modal-title fs-6 fw-semibold\" id=\"serviceModalTitle\">Новая услуга</h5>\n                    <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Закрыть\"></button>\n                </div>\n                <div class=\"modal-body\">\n                    <div class=\"alert alert-danger d-none py-2 small mb-3\" id=\"modalAlert\" role=\"alert\">\n                        <div id=\"modalError\"></div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"title\" class=\"form-label\">Название</label>\n                        <input type=\"text\" class=\"form-control\" id=\"title\" maxlength=\"255\"\n                               placeholder=\"Женская стрижка\" required>\n                        <div class=\"invalid-feedback\" id=\"titleError\">Введите название услуги.</div>\n                    </div>\n\n                    <div class=\"mb-3\">\n                        <label for=\"price\" class=\"form-label\">Цена, ₽</label>\n                        <input type=\"number\" class=\"form-control\" id=\"price\" min=\"0\" step=\"1\"\n                               placeholder=\"1500\" required>\n                        <div class=\"invalid-feedback\" id=\"priceError\">Цена — число не меньше нуля.</div>\n                    </div>\n\n                    <div class=\"mb-1\">\n                        <label for=\"description\" class=\"form-label\">Описание</label>\n                        <textarea class=\"form-control\" id=\"description\" rows=\"3\" maxlength=\"2000\"\n                                  placeholder=\"Опционально\"></textarea>\n                        <div class=\"invalid-feedback\" id=\"descriptionError\">Максимум 2000 символов.</div>\n                    </div>\n                </div>\n                <div class=\"modal-footer border-0 pt-0\">\n                    <button type=\"button\" class=\"btn btn-outline-secondary btn-sm\" data-bs-dismiss=\"modal\">Отмена</button>\n                    <button type=\"submit\" class=\"btn btn-primary btn-sm\" id=\"saveBtn\">Сохранить</button>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n";
cb(null, output);
;
} catch (e) {
  cb(runtime.handleError(e, lineno, colno));
}
}
function b_extra_js(env, context, frame, runtime, cb) {
var lineno = 98;
var colno = 3;
var output = "";
try {
var frame = frame.push(true);
output += "\n<script>\n(() => {\n    const $ = (id) => document.getElementById(id);\n    if (!$('rows')) return;\n\n    const ui = window.ui;\n    const api = window.db_requests.services;\n\n    let rows = [];\n    let editingId = null;\n\n    const fields = {\n        title: {\n            input: $('title'), error: $('titleError'),\n            check: (v) => (v.trim() ? '' : 'Введите название услуги.'),\n        },\n        price: {\n            input: $('price'), error: $('priceError'),\n            check: (v) => {\n                const s = v.trim();\n                if (!s) return 'Введите цену.';\n                if (!/^\\d+(\\.\\d{1,2})?$/.test(s)) return 'Цена — число не меньше нуля.';\n                if (Number(s) < 0) return 'Цена не может быть отрицательной.';\n                return '';\n            },\n        },\n        description: {\n            input: $('description'), error: $('descriptionError'),\n            check: (v) => (v.length <= 2000 ? '' : 'Максимум 2000 символов.'),\n        },\n    };\n    const validate = ui.bindValidation(fields);\n\n    async function load() {\n        try {\n            rows = await api.list();\n            render();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось загрузить услуги', 'danger');\n        }\n    }\n\n    function filtered() {\n        const q = $('search').value.trim().toLowerCase();\n        const min = $('priceMin').value === '' ? null : Number($('priceMin').value);\n        const max = $('priceMax').value === '' ? null : Number($('priceMax').value);\n\n        return rows\n            .filter((r) => {\n                if (q && !String(r.title).toLowerCase().includes(q)) return false;\n                if (min !== null && Number(r.price) < min) return false;\n                if (max !== null && Number(r.price) > max) return false;\n                return true;\n            })\n            .sort((a, b) => String(a.title).localeCompare(String(b.title), 'ru'));\n    }\n\n    function render() {\n        const list = filtered();\n        const total = rows.reduce((sum, r) => sum + Number(r.price || 0), 0);\n        $('servicesCount').textContent = `Услуг: ${rows.length} · суммарный прайс: ${ui.money(total)}`;\n        $('rows').innerHTML = list.map((r) => `\n            <tr>\n                <td class=\"fw-semibold\">${ui.esc(r.title)}</td>\n                <td class=\"text-end text-nowrap\">${ui.money(r.price)}</td>\n                <td class=\"text-body-secondary\">${ui.esc(r.description || '—')}</td>\n                <td class=\"text-end text-nowrap\">\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-secondary me-1\" data-edit=\"${r.id}\"\n                            aria-label=\"Редактировать\"><i class=\"bi bi-pencil\"></i></button>\n                    <button type=\"button\" class=\"btn btn-sm btn-outline-danger\" data-del=\"${r.id}\"\n                            aria-label=\"Удалить\"><i class=\"bi bi-trash\"></i></button>\n                </td>\n            </tr>`).join('');\n        $('empty').classList.toggle('d-none', list.length > 0);\n    }\n\n    function openModal(row) {\n        editingId = row ? row.id : null;\n        $('serviceModalTitle').textContent = row ? 'Редактировать услугу' : 'Новая услуга';\n        $('title').value = row ? row.title : '';\n        $('price').value = row ? row.price : '';\n        $('description').value = row && row.description ? row.description : '';\n        Object.values(fields).forEach((f) => f.input.classList.remove('is-invalid', 'is-valid'));\n        showError('');\n        window.bootstrap.Modal.getOrCreateInstance($('serviceModal')).show();\n        setTimeout(() => $('title').focus(), 300);\n    }\n\n    function showError(message) {\n        $('modalError').textContent = message || '';\n        $('modalAlert').classList.toggle('d-none', !message);\n    }\n\n    $('addBtn').addEventListener('click', () => openModal(null));\n    ['search', 'priceMin', 'priceMax'].forEach((id) => $(id).addEventListener('input', render));\n    $('resetFilters').addEventListener('click', () => {\n        $('search').value = '';\n        $('priceMin').value = '';\n        $('priceMax').value = '';\n        render();\n    });\n\n    $('rows').addEventListener('click', async (event) => {\n        const editBtn = event.target.closest('[data-edit]');\n        if (editBtn) {\n            const row = rows.find((r) => String(r.id) === editBtn.dataset.edit);\n            if (row) openModal(row);\n            return;\n        }\n        const delBtn = event.target.closest('[data-del]');\n        if (!delBtn) return;\n        const row = rows.find((r) => String(r.id) === delBtn.dataset.del);\n        if (!row) return;\n\n        const confirmed = await ui.confirm({\n            title: 'Удалить услугу?',\n            text: `«${row.title}» будет удалена из справочника.`,\n        });\n        if (!confirmed) return;\n        try {\n            await api.remove(row.id);\n            ui.toast('Услуга удалена', 'success');\n            await load();\n        } catch (error) {\n            ui.toast(error.message || 'Не удалось удалить', 'danger');\n        }\n    });\n\n    $('serviceForm').addEventListener('submit', async (event) => {\n        event.preventDefault();\n        showError('');\n        if (!validate()) return;\n\n        const payload = {\n            id: editingId,\n            title: fields.title.input.value.trim(),\n            price: fields.price.input.value.trim(),\n            description: fields.description.input.value.trim(),\n        };\n\n        try {\n            await ui.withBusy($('saveBtn'), async () => {\n                if (editingId) await api.update(payload);\n                else await api.create(payload);\n            }, 'Сохраняем…');\n\n            window.bootstrap.Modal.getOrCreateInstance($('serviceModal')).hide();\n            ui.toast(editingId ? 'Услуга обновлена' : 'Услуга добавлена', 'success');\n            await load();\n        } catch (error) {\n            showError(error.message || 'Не удалось сохранить');\n        }\n    });\n\n    load();\n})();\n</script>\n";
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
