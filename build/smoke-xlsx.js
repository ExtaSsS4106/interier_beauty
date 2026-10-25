/* Юнит-тесты генератора Excel (electron/modules/xlsx.js) + склейка
   с booking.exportSheets(): отчёт должен собраться в валидный .xlsx
   с шапкой, деньгами, процентами и итогами. */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const xlsx = require('../electron/modules/xlsx.js');
const booking = require('../electron/modules/booking.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed += 1;
        console.log(`ok   ${name}`);
    } catch (error) {
        failed += 1;
        console.log(`FAIL ${name}: ${error.message}`);
    }
}

/* ------------------------------ Фикстуры ------------------------------- */

const rows = [
    {
        id: 1, date: '2026-10-01', time: '10:00', status: 'done',
        client: { id: 1, first_name: 'Анна', last_name: 'Иванова' },
        employee: { id: 1, first_name: 'Мария', last_name: 'Петрова' },
        service: { id: 1, title: 'Стрижка & окрашивание', price: 1500 },
    },
    {
        id: 2, date: '2026-10-05', time: '12:30', status: 'done',
        client: { id: 2, first_name: 'Ольга', last_name: 'Сидорова' },
        employee: { id: 1, first_name: 'Мария', last_name: 'Петрова' },
        service: { id: 2, title: 'Маникюр <класс>', price: 2200 },
    },
    {
        id: 3, date: '2026-10-07', time: '15:00', status: 'cancelled',
        client: { id: 1, first_name: 'Анна', last_name: 'Иванова' },
        employee: { id: 2, first_name: 'Ирина', last_name: 'Кузнецова' },
        service: { id: 1, title: 'Стрижка & окрашивание', price: 1500 },
    },
];

const report = booking.buildReport(rows, {});
const filtered = booking.filterRows(rows, {});

/* ---------------------------- Базовые проверки -------------------------- */

test('toXlsx: буфер начинается с сигнатуры zip (PK)', () => {
    const buffer = xlsx.toXlsx([{ name: 'Лист1', rows: [['привет']] }]);
    assert.ok(Buffer.isBuffer(buffer), 'должен быть Buffer');
    assert.strictEqual(buffer.toString('latin1', 0, 2), 'PK');
    assert.ok(buffer.length > 300, 'архив слишком мал');
});

test('unzip: все обязательные части книги на месте', () => {
    const parts = xlsx.unzip(xlsx.toXlsx([{ name: 'Лист1', rows: [['а']] }]));
    for (const name of [
        '[Content_Types].xml',
        '_rels/.rels',
        'xl/workbook.xml',
        'xl/_rels/workbook.xml.rels',
        'xl/styles.xml',
        'xl/worksheets/sheet1.xml',
    ]) {
        assert.ok(parts.has(name), `нет части ${name}`);
        assert.ok(parts.get(name).length > 0, `часть ${name} пуста`);
    }
});

test('toXlsx: имена листов попадают в workbook.xml', () => {
    const buffer = xlsx.toXlsx([
        { name: 'Сводка', rows: [] },
        { name: 'Услуги', rows: [] },
    ]);
    const workbook = xlsx.unzip(buffer).get('xl/workbook.xml').toString('utf8');
    assert.ok(workbook.includes('name="Сводка"'));
    assert.ok(workbook.includes('name="Услуги"'));
    assert.ok(workbook.includes('r:id="rId1"') && workbook.includes('r:id="rId2"'));

    const rels = xlsx.unzip(buffer).get('xl/_rels/workbook.xml.rels').toString('utf8');
    assert.ok(rels.includes('worksheets/sheet1.xml'));
    assert.ok(rels.includes('styles.xml'));
});

test('safeSheetName: обрезает длину и убирает запрещённые знаки', () => {
    assert.strictEqual(xlsx.safeSheetName('a/b:c*d?e'), 'a b c d e');
    assert.strictEqual(xlsx.safeSheetName('x'.repeat(60)).length, 31);
    assert.strictEqual(xlsx.safeSheetName(''), 'Лист');

    const used = new Set();
    assert.strictEqual(xlsx.safeSheetName('Отчёт', used), 'Отчёт');
    assert.strictEqual(xlsx.safeSheetName('Отчёт', used), 'Отчёт 2');
    assert.strictEqual(xlsx.safeSheetName('Отчёт', used), 'Отчёт 3');
});

test('escapeXml: экранирует спецсимволы и выкидывает управляющие', () => {
    assert.strictEqual(
        xlsx.escapeXml('<b> & " \''),
        '&lt;b&gt; &amp; &quot; &apos;',
    );
    assert.ok(!xlsx.escapeXml('строка\u0000с\u0007мусором').includes('\u0000'));
});

test('colName: 0 → A, 25 → Z, 26 → AA', () => {
    assert.strictEqual(xlsx.colName(0), 'A');
    assert.strictEqual(xlsx.colName(25), 'Z');
    assert.strictEqual(xlsx.colName(26), 'AA');
    assert.strictEqual(xlsx.colName(27), 'AB');
});

/* ------------------------------- Содержимое ---------------------------- */

test('sheet: шапка — inlineStr, числа — <v>, стили по индексу', () => {
    const parts = xlsx.unzip(xlsx.toXlsx([{
        name: 'Данные',
        header: ['Услуга', 'Выручка'],
        rows: [
            ['Стрижка', { value: 1500, style: 'money' }],
            ['Маникюр', { value: 2200, style: 'money' }],
            [null, { value: 0.5, style: 'pct' }],
        ],
    }]));
    const xml = parts.get('xl/worksheets/sheet1.xml').toString('utf8');

    assert.ok(xml.includes('<c r="A1" s="1" t="inlineStr"><is><t xml:space="preserve">Услуга</t></is></c>'),
        'нет шапки A1');
    assert.ok(xml.includes('<c r="B2" s="3"><v>1500</v></c>'), 'нет денежной ячейки B2');
    assert.ok(xml.includes('<c r="B3" s="3"><v>2200</v></c>'), 'нет денежной ячейки B3');
    assert.ok(xml.includes('<c r="B4" s="8"><v>0.5</v></c>'), 'нет процента B4');
    assert.ok(!xml.includes('r="A4"'), 'ячейка null не должна записываться');
    assert.ok(xml.includes('state="frozen"'), 'первая строка не закреплена');
    assert.ok(xml.includes('<col min="1" max="1"'), 'нет ширины колонки');
});

test('sheet: пустой лист не ломает разметку', () => {
    const parts = xlsx.unzip(xlsx.toXlsx([{ name: 'Пусто', rows: [] }]));
    const xml = parts.get('xl/worksheets/sheet1.xml').toString('utf8');
    assert.ok(xml.includes('<sheetData></sheetData>'));
    assert.ok(!xml.includes('undefined'), 'undefined не должен просочиться в XML');
});

test('sheet: итоговый стиль boldMoney описан в styles.xml', () => {
    const parts = xlsx.unzip(xlsx.toXlsx([{ name: 'X', rows: [[{ value: 100, style: 'boldMoney' }]] }]));
    const styles = parts.get('xl/styles.xml').toString('utf8');
    assert.ok(styles.includes('<cellXfs count="12">'), 'количество стилей не совпадает');
    assert.ok(parts.get('xl/worksheets/sheet1.xml').toString('utf8').includes('s="9"'));
});

/* ------------------------ Сквозной тест: отчёт → файл -------------------- */

test('отчёт собирается в xlsx: разделы, итоги, суммы', () => {
    const sheets = booking.exportSheets(report, filtered, {});
    assert.deepStrictEqual(
        sheets.map((s) => s.name),
        ['Сводка', 'Услуги', 'Мастера', 'Клиенты', 'Записи'],
        'не тот набор листов',
    );

    const parts = xlsx.unzip(xlsx.toXlsx(sheets));
    const serviceSheet = parts.get('xl/worksheets/sheet2.xml').toString('utf8');
    assert.ok(serviceSheet.includes('Стрижка &amp; окрашивание'), 'нет услуги');
    assert.ok(serviceSheet.includes('<v>1500</v>'), 'нет выручки по стрижке');
    assert.ok(serviceSheet.includes('<v>3700</v>'), 'нет итоговой выручки (1500 + 2200)');

    const summarySheet = parts.get('xl/worksheets/sheet1.xml').toString('utf8');
    assert.ok(summarySheet.includes('Выручка (только оказанные)'));
    assert.ok(summarySheet.includes('<v>3700</v>'));

    const rowsSheet = parts.get('xl/worksheets/sheet5.xml').toString('utf8');
    assert.ok(rowsSheet.includes('Оказана') && rowsSheet.includes('Отменена'),
        'нет подписей статусов');
    assert.ok(rowsSheet.includes('01.10.2026'), 'дата не отформатирована');
});

test('один лист вместо пяти: разделы идут подряд с заголовками', () => {
    const sheets = booking.exportSheets(report, filtered, { layout: 'single' });
    assert.strictEqual(sheets.length, 1);
    assert.strictEqual(sheets[0].name, 'Отчёт');

    const xml = xlsx.unzip(xlsx.toXlsx(sheets)).get('xl/worksheets/sheet1.xml').toString('utf8');
    assert.ok(xml.includes('Сводка') && xml.includes('Услуги') && xml.includes('Записи'),
        'разделы не попали на общий лист');
});

test('фильтр разделов: только сводка → один лист', () => {
    const sheets = booking.exportSheets(report, filtered, { sections: ['summary'] });
    assert.strictEqual(sheets.length, 1);
    assert.strictEqual(sheets[0].name, 'Сводка');
});

test('записанный файл читается обратно (round-trip через fs)', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ib-xlsx-'));
    const file = path.join(dir, booking.defaultReportName({ from: '2026-10-01', to: '2026-10-31' }));
    try {
        fs.writeFileSync(file, xlsx.toXlsx(booking.exportSheets(report, filtered, {})));
        const parts = xlsx.unzip(fs.readFileSync(file));
        assert.ok(parts.has('xl/workbook.xml'));
        assert.strictEqual(parts.size, 10, 'неожиданное число частей');
        assert.ok(fs.statSync(file).size > 500, 'файл подозрительно мал');
    } finally {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

console.log(`\nsmoke-xlsx: ${passed} ok, ${failed} failed`);
if (failed) process.exitCode = 1;
