/* Общее для всех IPC-обработчиков:
   - guard() — единый формат ответа { ok, data | error } + проверка прав;
   - хелперы запросов к моделям (include записей, поиск записи по id и т.д.). */

const booking = require('../booking.js');
const { currentSession, requirePermission, getDbModels } = require('../state.js');

// Renderer всегда получает { ok, data | error }: падение запроса к БД
// превращается в понятное сообщение, а не в необработанный reject.
// action: 'раздел.действие' → проверка прав по роли, 'session' → нужен
// только вход в систему, null → без проверки. Renderer всегда получает
// { ok, data | error }, а «Недостаточно прав» уходит обычной ошибкой.
const guard = (action, handler) => async (_event, payload) => {
    try {
        if (action === 'session') currentSession();
        else if (action) requirePermission(action);
        return { ok: true, data: await handler(payload) };
    } catch (error) {
        console.error('[db api]', error);
        return { ok: false, error: booking.humanizeError(error) };
    }
};

const models = () => getDbModels();

const toJson = (row) => (row && typeof row.toJSON === 'function' ? row.toJSON() : row);

const appointmentInclude = (m) => [
    { model: m.clients, as: 'client', attributes: ['id', 'first_name', 'last_name', 'number'] },
    { model: m.employees, as: 'employee', attributes: ['id', 'first_name', 'last_name'] },
    { model: m.services, as: 'service', attributes: ['id', 'title', 'price'] },
];

async function ensure(model, id, title) {
    const pk = Number(id);
    if (!Number.isInteger(pk) || pk <= 0) throw new Error(`Некорректный идентификатор: ${title}`);
    const row = await model.findByPk(pk);
    if (!row) throw new Error(`${title} не найден`);
    return row;
}

// Сколько записей опираются на справочную запись (клиент/мастер/услуга).
const usedByAppointments = async (m, field, id) =>
    m.appointments.count({ where: { [field]: Number(id) } });

/** Счётчик записей по каждому client_id / employee_id. */
async function appointmentCounts(m, field) {
    try {
        const { fn, col } = m.appointments.sequelize;
        const rows = await m.appointments.findAll({
            attributes: [field, [fn('COUNT', col('id')), 'cnt']],
            group: [field],
        });
        return new Map(rows.map((r) => [Number(r.get(field)), Number(r.get('cnt'))]));
    } catch (error) {
        console.warn('[appointments count]', error.message);
        return new Map();
    }
}

module.exports = {
    guard,
    models,
    toJson,
    appointmentInclude,
    ensure,
    usedByAppointments,
    appointmentCounts,
};
