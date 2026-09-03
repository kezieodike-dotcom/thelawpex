const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const encoder = new TextEncoder();

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const crcTable = Array.from({ length: 256 }, (_, value) => {
  let crc = value;
  for (let bit = 0; bit < 8; bit += 1) {
    crc = (crc & 1) !== 0 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

const crc32 = (bytes: Uint8Array): number => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const writeUint16 = (view: DataView, offset: number, value: number): void =>
  view.setUint16(offset, value, true);
const writeUint32 = (view: DataView, offset: number, value: number): void =>
  view.setUint32(offset, value >>> 0, true);

interface ZipEntry {
  name: Uint8Array;
  data: Uint8Array;
  crc: number;
  offset: number;
}

function makeZip(files: Array<{ name: string; content: string }>): Uint8Array {
  const entries: ZipEntry[] = files.map((file) => ({
    name: encoder.encode(file.name),
    data: encoder.encode(file.content),
    crc: 0,
    offset: 0,
  }));
  entries.forEach((entry) => {
    entry.crc = crc32(entry.data);
  });

  const localSize = entries.reduce((total, entry) => total + 30 + entry.name.length + entry.data.length, 0);
  const centralSize = entries.reduce((total, entry) => total + 46 + entry.name.length, 0);
  const output = new Uint8Array(localSize + centralSize + 22);
  const view = new DataView(output.buffer);
  let cursor = 0;

  for (const entry of entries) {
    entry.offset = cursor;
    writeUint32(view, cursor, 0x04034b50);
    writeUint16(view, cursor + 4, 20);
    writeUint16(view, cursor + 6, 0x0800);
    writeUint16(view, cursor + 8, 0);
    writeUint32(view, cursor + 14, entry.crc);
    writeUint32(view, cursor + 18, entry.data.length);
    writeUint32(view, cursor + 22, entry.data.length);
    writeUint16(view, cursor + 26, entry.name.length);
    output.set(entry.name, cursor + 30);
    output.set(entry.data, cursor + 30 + entry.name.length);
    cursor += 30 + entry.name.length + entry.data.length;
  }

  const centralOffset = cursor;
  for (const entry of entries) {
    writeUint32(view, cursor, 0x02014b50);
    writeUint16(view, cursor + 4, 20);
    writeUint16(view, cursor + 6, 20);
    writeUint16(view, cursor + 8, 0x0800);
    writeUint16(view, cursor + 10, 0);
    writeUint32(view, cursor + 16, entry.crc);
    writeUint32(view, cursor + 20, entry.data.length);
    writeUint32(view, cursor + 24, entry.data.length);
    writeUint16(view, cursor + 28, entry.name.length);
    writeUint32(view, cursor + 42, entry.offset);
    output.set(entry.name, cursor + 46);
    cursor += 46 + entry.name.length;
  }

  writeUint32(view, cursor, 0x06054b50);
  writeUint16(view, cursor + 8, entries.length);
  writeUint16(view, cursor + 10, entries.length);
  writeUint32(view, cursor + 12, centralSize);
  writeUint32(view, cursor + 16, centralOffset);
  return output;
}

const paragraphXml = (line: string, index: number): string => {
  const text = escapeXml(line || ' ');
  const isTitle = index === 0;
  return `<w:p><w:pPr>${isTitle ? '<w:jc w:val="center"/><w:spacing w:after="320"/>' : '<w:spacing w:after="120" w:line="360" w:lineRule="auto"/>'}</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="${isTitle ? 28 : 24}"/>${isTitle ? '<w:b/>' : ''}</w:rPr><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;
};

export function createDraftDocxBlob(title: string, draftText: string): Blob {
  const body = [title.trim() || 'LAWPEX Legal Draft', ...draftText.replace(/\r\n/g, '\n').split('\n')]
    .map(paragraphXml)
    .join('');
  const created = new Date().toISOString();
  const files = [
    {
      name: '[Content_Types].xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
    },
    {
      name: '_rels/.rels',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
    },
    {
      name: 'docProps/core.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${escapeXml(title)}</dc:title><dc:creator>LAWPEX Ai Draft Wizard</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${created}</dcterms:created></cp:coreProperties>`,
    },
    {
      name: 'word/document.xml',
      content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`,
    },
  ];

  return new Blob([makeZip(files) as BlobPart], { type: DOCX_MIME });
}

export function downloadDraftDocx(title: string, draftText: string): void {
  const blob = createDraftDocxBlob(title, draftText);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = title.replace(/[^a-z0-9 ._-]+/gi, '').trim() || 'LAWPEX legal draft';
  link.href = url;
  link.download = `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
