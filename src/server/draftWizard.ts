import { inflateRawSync } from 'node:zlib';

export interface UploadedSupportingDocument {
  fieldName: string;
  filename: string;
  contentType: string;
  data: Buffer;
}

export interface ParsedDraftWizardForm {
  fields: Record<string, string>;
  files: UploadedSupportingDocument[];
}

const readQuotedValue = (header: string, key: string): string =>
  header.match(new RegExp(`${key}="([^"]*)"`, 'i'))?.[1] ?? '';

export function parseMultipartForm(body: Buffer, contentType: string): ParsedDraftWizardForm {
  const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)?.slice(1).find(Boolean);
  if (!boundary) throw new Error('The upload request is missing its multipart boundary.');

  const delimiter = Buffer.from(`--${boundary}`);
  const fields: Record<string, string> = {};
  const files: UploadedSupportingDocument[] = [];
  let cursor = body.indexOf(delimiter);

  while (cursor >= 0) {
    const partStart = cursor + delimiter.length;
    const next = body.indexOf(delimiter, partStart);
    if (next < 0) break;
    let part = body.subarray(partStart, next);
    if (part.subarray(0, 2).toString() === '\r\n') part = part.subarray(2);
    if (part.subarray(part.length - 2).toString() === '\r\n') part = part.subarray(0, part.length - 2);
    const headerEnd = part.indexOf(Buffer.from('\r\n\r\n'));
    if (headerEnd > 0) {
      const header = part.subarray(0, headerEnd).toString('utf8');
      const data = part.subarray(headerEnd + 4);
      const fieldName = readQuotedValue(header, 'name');
      const filename = readQuotedValue(header, 'filename');
      if (fieldName && filename) {
        const fileType = header.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim() ?? 'application/octet-stream';
        files.push({ fieldName, filename, contentType: fileType, data: Buffer.from(data) });
      } else if (fieldName) {
        fields[fieldName] = data.toString('utf8');
      }
    }
    cursor = next;
  }

  return { fields, files };
}

function unzipEntry(buffer: Buffer, targetName: string): Buffer | null {
  const endSignature = 0x06054b50;
  let endOffset = -1;
  for (let index = buffer.length - 22; index >= Math.max(0, buffer.length - 65_557); index -= 1) {
    if (buffer.readUInt32LE(index) === endSignature) {
      endOffset = index;
      break;
    }
  }
  if (endOffset < 0) return null;

  let cursor = buffer.readUInt32LE(endOffset + 16);
  const entries = buffer.readUInt16LE(endOffset + 10);
  for (let index = 0; index < entries && cursor + 46 <= buffer.length; index += 1) {
    if (buffer.readUInt32LE(cursor) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const localOffset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.subarray(cursor + 46, cursor + 46 + nameLength).toString('utf8');
    if (name === targetName) {
      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize);
      if (method === 0) return Buffer.from(compressed);
      if (method === 8) return inflateRawSync(compressed);
      return null;
    }
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return null;
}

const decodeEntities = (text: string): string =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)));

export function extractSupportingDocumentText(file: UploadedSupportingDocument): string {
  const extension = file.filename.split('.').pop()?.toLowerCase();
  if (extension === 'txt' || extension === 'md') return file.data.toString('utf8');
  if (extension !== 'docx') return '';

  const documentXml = unzipEntry(file.data, 'word/document.xml');
  if (!documentXml) throw new Error(`${file.filename} could not be read as a DOCX document.`);
  return decodeEntities(
    documentXml
      .toString('utf8')
      .replace(/<w:tab\s*\/>/g, '\t')
      .replace(/<w:br\s*\/>/g, '\n')
      .replace(/<\/w:p>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}
