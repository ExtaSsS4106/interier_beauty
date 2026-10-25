/* Минимальный генератор XLSX (Office Open XML) без внешних зависимостей.

   Почему свой: отчёт должен открываться в Excel/LibreOffice на любой машине,
   а ставить npm-пакет ради одной таблицы накладно. Файл — это zip-архив
   с XML-частями, поэтому здесь:

     1) CRC32 + сборка zip-контейнера (сжатие zlib.deflateRaw);
     2) разметка книги: [Content_Types].xml, _rels/.rels, xl/workbook.xml,
        xl/_rels/workbook.xml.rels, xl/styles.xml и по одному sheetN.xml;
     3) стили: жирная шапка на синем фоне, рамки, деньги и проценты.

   `unzip()` — зеркальная функция для тестов: достаёт части из буфера. */

'use strict';

const zlib = require('zlib');

/* ------------------------------- Стили --------------------------------- */
// Индексы в <cellXfs> — порядок обязан совпадать с buildStylesXml().
const STYLES = {
    default: 0,
    header: 1,     // жирный белый текст на синем фоне, рамка
    text: 2,       // обычный текст с рамкой
    money: 3,      // #,##0.## ₽
    int: 4,        // #,##0
    bold: 5,       // акцентный текст (жирный)
    section: 6,    // заголовок раздела (заливка)
    note: 7,       // сноска серым курсивом
    pct: 8,        // 0%
    boldMoney: 9,  // итог: деньги жирным на заливке
    boldInt: 10,   // итог: количество жирным на заливке
    boldPct: 11,   // итог: процент жирным на заливке
};

const STYLES_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="#,##0.##&quot; ₽&quot;"/></numFmts>
<fonts count="4">
<font><sz val="11"/><color rgb="FF1F2937"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FF1F2937"/><name val="Calibri"/><family val="2"/></font>
<font><i/><sz val="10"/><color rgb="FF6C757D"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="4">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF0D6EFD"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFEAF1FF"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color rgb="FFD9DEE7"/></left><right style="thin"><color rgb="FFD9DEE7"/></right><top style="thin"><color rgb="FFD9DEE7"/></top><bottom style="thin"><color rgb="FFD9DEE7"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="12">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="3" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
<xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="10" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1"/>
<xf numFmtId="164" fontId="2" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="3" fontId="2" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="10" fontId="2" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

/* ------------------------------ Утилиты -------------------------------- */

function escapeXml(value) {
    return String(value === null || value === undefined ? '' : value)
        // символы, запрещённые в XML 1.0 (иначе Excel ругается на файл)
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/** 0 → A, 25 → Z, 26 → AA */
function colName(index) {
    let n = index + 1;
    let name = '';
    while (n > 0) {
        const rem = (n - 1) % 26;
        name = String.fromCharCode(65 + rem) + name;
        n = Math.floor((n - 1) / 26);
    }
    return name;
}

/** Имя листа: ≤31 символ, без запрещённых знаков, без дублей. */
function safeSheetName(name, used = new Set()) {
    let base = String(name || 'Лист')
        .replace(/[*?:\\/[\]]/g, ' ')
        .trim()
        .slice(0, 31) || 'Лист';
    let candidate = base;
    let suffix = 2;
    while (used.has(candidate.toLowerCase())) {
        const tail = ` ${suffix}`;
        candidate = base.slice(0, 31 - tail.length) + tail;
        suffix += 1;
    }
    used.add(candidate.toLowerCase());
    return candidate;
}

function styleIndex(style) {
    return Object.prototype.hasOwnProperty.call(STYLES, style) ? STYLES[style] : STYLES.default;
}

function cellXml(ref, style, value) {
    const s = styleIndex(style);
    if (value === null || value === undefined) return '';
    if (typeof value === 'number' && Number.isFinite(value)) {
        return `<c r="${ref}" s="${s}"><v>${value}</v></c>`;
    }
    return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function styleFor(value, explicit) {
    if (explicit) return explicit;
    if (typeof value === 'number') return Number.isInteger(value) ? 'int' : 'money';
    return 'text';
}

/* ------------------------------ Лист книги ----------------------------- */

function buildSheetXml(sheet) {
    const used = new Set();
    const body = [];
    let r = 0;

    if (Array.isArray(sheet.header) && sheet.header.length) {
        r += 1;
        const cells = sheet.header
            .map((title, i) => cellXml(`${colName(i)}${r}`, 'header', title))
            .join('');
        body.push(`<row r="${r}" ht="20" customHeight="1">${cells}</row>`);
        sheet.header.forEach((_, i) => used.add(colName(i)));
    }

    for (const row of sheet.rows || []) {
        r += 1;
        const cells = [];
        (row || []).forEach((raw, i) => {
            const spec = raw && typeof raw === 'object' && 'value' in raw ? raw : { value: raw };
            const xml = cellXml(`${colName(i)}${r}`, styleFor(spec.value, spec.style), spec.value);
            if (xml) cells.push(xml);
            used.add(colName(i));
        });
        body.push(`<row r="${r}">${cells.join('')}</row>`);
    }

    // Ширины колонок: берём переданные или считаем по содержимому (~байты/2)
    const widths = [];
    const maxCols = Math.max(
        (sheet.header || []).length,
        ...(sheet.rows || []).map((row) => (row || []).length),
        1,
    );
    for (let i = 0; i < maxCols; i += 1) {
        const declared = Array.isArray(sheet.widths) ? sheet.widths[i] : null;
        if (declared) { widths.push(declared); continue; }
        let len = (sheet.header || [])[i] ? String(sheet.header[i]).length : 8;
        for (const row of sheet.rows || []) {
            const raw = (row || [])[i];
            const value = raw && typeof raw === 'object' && 'value' in raw ? raw.value : raw;
            if (value === null || value === undefined) continue;
            len = Math.max(len, Math.min(48, String(value).length + 2));
        }
        widths.push(Math.min(52, Math.max(8, len)));
    }

    const cols = widths
        .map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w.toFixed(2)}" customWidth="1"/>`)
        .join('');

    const freeze = sheet.header && sheet.header.length
        ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
        : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>';

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${freeze}<cols>${cols}</cols><sheetData>${body.join('')}</sheetData></worksheet>`;
}

/* ---------------------------- Сборка книги ----------------------------- */

function toXlsx(sheets) {
    const list = Array.isArray(sheets) && sheets.length ? sheets : [{ name: 'Отчёт', rows: [] }];
    const used = new Set();
    const named = list.map((sheet, i) => ({
        name: safeSheetName(sheet.name || `Лист ${i + 1}`, used),
        xml: buildSheetXml(sheet),
    }));

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${
    named.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')
}</Types>`;

    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

    const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><workbookPr/><sheets>${
    named.map((sheet, i) => `<sheet name="${escapeXml(sheet.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')
}</sheets></workbook>`;

    const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${
    named.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')
}<Relationship Id="rId${named.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

    const entries = [
        { name: '[Content_Types].xml', data: Buffer.from(contentTypes, 'utf8') },
        { name: '_rels/.rels', data: Buffer.from(rootRels, 'utf8') },
        { name: 'xl/workbook.xml', data: Buffer.from(workbook, 'utf8') },
        { name: 'xl/_rels/workbook.xml.rels', data: Buffer.from(workbookRels, 'utf8') },
        { name: 'xl/styles.xml', data: Buffer.from(STYLES_XML, 'utf8') },
        ...named.map((sheet, i) => ({
            name: `xl/worksheets/sheet${i + 1}.xml`,
            data: Buffer.from(sheet.xml, 'utf8'),
        })),
    ];

    return buildZip(entries);
}

/* ------------------------------- Zip ----------------------------------- */

let crcTable = null;

function crc32(buffer) {
    if (!crcTable) {
        crcTable = new Int32Array(256);
        for (let n = 0; n < 256; n += 1) {
            let c = n;
            for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
            crcTable[n] = c;
        }
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buffer.length; i += 1) {
        crc = crcTable[(crc ^ buffer[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function buildZip(entries) {
    const locals = [];
    const centrals = [];
    let offset = 0;

    for (const entry of entries) {
        const nameBuf = Buffer.from(entry.name, 'utf8');
        const raw = entry.data;
        const crc = crc32(raw);
        const packed = zlib.deflateRawSync(raw);
        const useStore = packed.length >= raw.length;
        const data = useStore ? raw : packed;
        const method = useStore ? 0 : 8;

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034B50, 0);   // сигнатура локальной записи
        local.writeUInt16LE(20, 4);           // версия
        local.writeUInt16LE(0x0800, 6);       // флаг: имя файла в UTF-8
        local.writeUInt16LE(method, 8);
        local.writeUInt16LE(0, 10);           // время
        local.writeUInt16LE(0x5933, 12);      // дата: 2024-01-01
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(data.length, 18);
        local.writeUInt32LE(raw.length, 22);
        local.writeUInt16LE(nameBuf.length, 26);
        local.writeUInt16LE(0, 28);

        locals.push(local, nameBuf, data);

        const central = Buffer.alloc(46);
        central.writeUInt32LE(0x02014B50, 0); // сигнатура центральной записи
        central.writeUInt16LE(20, 4);
        central.writeUInt16LE(20, 6);
        central.writeUInt16LE(0x0800, 8);
        central.writeUInt16LE(method, 10);
        central.writeUInt16LE(0, 12);
        central.writeUInt16LE(0x5933, 14);
        central.writeUInt32LE(crc, 16);
        central.writeUInt32LE(data.length, 20);
        central.writeUInt32LE(raw.length, 24);
        central.writeUInt16LE(nameBuf.length, 28);
        central.writeUInt16LE(0, 30);         // комментарий
        central.writeUInt16LE(0, 32);         // диск
        central.writeUInt16LE(0, 34);         // внутр. атрибуты
        central.writeUInt32LE(0, 36);         // внеш. атрибуты
        central.writeUInt32LE(offset, 42);    // смещение локальной записи
        centrals.push(central, nameBuf);

        offset += local.length + nameBuf.length + data.length;
    }

    const centralBuf = Buffer.concat(centrals);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054B50, 0);
    eocd.writeUInt16LE(0, 4);
    eocd.writeUInt16LE(0, 6);
    eocd.writeUInt16LE(entries.length, 8);
    eocd.writeUInt16LE(entries.length, 10);
    eocd.writeUInt32LE(centralBuf.length, 12);
    eocd.writeUInt32LE(offset, 16);
    eocd.writeUInt16LE(0, 20);

    return Buffer.concat([...locals, centralBuf, eocd]);
}

/** Разбор zip (для тестов и проверки записанного файла). */
function unzip(buffer) {
    let eocd = -1;
    for (let i = buffer.length - 22; i >= 0; i -= 1) {
        if (buffer.readUInt32LE(i) === 0x06054B50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('не найден конец каталога zip');

    const count = buffer.readUInt16LE(eocd + 10);
    let pos = buffer.readUInt32LE(eocd + 16);
    const out = new Map();

    for (let i = 0; i < count; i += 1) {
        if (buffer.readUInt32LE(pos) !== 0x02014B50) throw new Error('повреждённая центральная запись');
        const method = buffer.readUInt16LE(pos + 10);
        const packedSize = buffer.readUInt32LE(pos + 20);
        const nameLen = buffer.readUInt16LE(pos + 28);
        const extraLen = buffer.readUInt16LE(pos + 30);
        const commentLen = buffer.readUInt16LE(pos + 32);
        const localOffset = buffer.readUInt32LE(pos + 42);
        const name = buffer.toString('utf8', pos + 46, pos + 46 + nameLen);

        const localNameLen = buffer.readUInt16LE(localOffset + 26);
        const localExtraLen = buffer.readUInt16LE(localOffset + 28);
        const dataStart = localOffset + 30 + localNameLen + localExtraLen;
        const packed = buffer.subarray(dataStart, dataStart + packedSize);
        out.set(name, method === 0 ? Buffer.from(packed) : zlib.inflateRawSync(packed));

        pos += 46 + nameLen + extraLen + commentLen;
    }
    return out;
}

module.exports = { toXlsx, unzip, STYLES, colName, escapeXml, safeSheetName };
