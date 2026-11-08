import express, { type RequestHandler } from 'express';
import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import { publicationGaps, reviewFingerprint } from '../lib/caseReportReview';
import { compileCaseReport } from '../lib/compileCaseReport';
import { toPublishedCaseLaw, type AdminCaseRecord } from '../data/caseIngestion';
import { type AdminAuthConfig, sameOrigin, sessionCookie, sessionHash, sessionToken, verifyAdminPassword } from './adminAuth';
import { PostgresCaseRepository, PublishingError } from './caseRepository';

const strings = z.array(z.string());
const recordSchema = z.object({
  id: z.string().regex(/^ingested-[a-zA-Z0-9-]+$/),
  status: z.enum(['Draft', 'Under Review', 'Approved', 'Published', 'Rejected']),
  title: z.string(), citation: z.string(), court: z.enum(['Supreme Court of Nigeria', 'Court of Appeal', 'Federal High Court', 'National Industrial Court', 'State High Court']), year: z.number().int(),
  createdAt: z.string(), updatedAt: z.string(), judicialDivision: z.string(), dateDelivered: z.string(), suitNumber: z.string(),
  presidingJudges: strings, appearances: z.object({ appellant: z.string(), respondent: z.string() }),
  areaOfLaw: z.string(), subject: z.string(), proceduralHistory: z.string(), factsSummary: z.string(),
  issuesForDetermination: strings, decisionSummary: z.string(), principles: strings, authorities: strings, statutes: strings,
  practiceNotes: strings, fullJudgmentText: z.string(), warnings: strings, duplicateCandidates: strings,
  ratios: z.array(z.object({ heading: z.string(), exactText: z.string(), attribution: z.string(), sourcePage: z.string(), sourceParagraph: z.string() })),
  sourceDocument: z.object({ fileName: z.string(), fileType: z.string(), size: z.number(), storageKey: z.string().min(1).max(200) }),
  auditLog: z.array(z.object({ at: z.string(), action: z.string(), status: z.string(), snapshotKey: z.string().optional() })),
  sourceExtraction: z.object({ text: z.string(), sha256: z.string(), textSha256: z.string(), pages: z.number(), incomplete: z.boolean() }).optional(),
  leadingJudgmentHeading: z.string().optional(), duplicateResolution: z.string().optional(), principleSources: strings.optional(),
  preparedReportText: z.string().optional(),
  validation: z.object({ fingerprint: z.string(), errors: strings, checkedAt: z.string(), evidence: z.array(z.any()) }).passthrough().optional(),
  review: z.object({ reviewer: z.string(), source: z.boolean(), metadata: z.boolean(), ratios: z.boolean(), principles: z.boolean() }).optional(),
});
const versionSchema = z.number().int().nonnegative();
const asyncRoute = (handler: RequestHandler): RequestHandler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

export function createPublishingRouter({ repository, auth }: { repository: PostgresCaseRepository | null; auth: AdminAuthConfig | null }) {
  const router = express.Router();
  router.use((_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/cases', asyncRoute(async (_req, res) => {
    if (!repository) throw new PublishingError(503, 'The shared case library has not been configured.');
    const cases = (await repository.list(true)).filter(({ record }) => !publicationGaps(record).length).map(({ record }) => toPublishedCaseLaw(record));
    res.json({ cases });
  }));
  router.get('/cases/:id', asyncRoute(async (req, res) => {
    if (!repository) throw new PublishingError(503, 'The shared case library has not been configured.');
    const item = await repository.get(req.params.id);
    if (!item || item.record.status !== 'Published' || publicationGaps(item.record).length) throw new PublishingError(404, 'Published case not found.');
    res.json({ case: toPublishedCaseLaw(item.record) });
  }));
  router.use('/admin', asyncRoute(async (req, res, next) => {
    if (!repository || !auth) return res.status(503).json({ error: 'Shared storage and admin credentials must be configured before using administration.' });
    if (!['GET', 'HEAD'].includes(req.method) && !sameOrigin(req, auth)) return res.status(403).json({ error: 'This action must be made from the LAWPEX admin site.' });
    if (req.path === '/session' && req.method === 'POST') return next();
    if (!/^[a-f0-9]{64}$/.test(sessionToken(req)) || !await repository.hasSession(sessionHash(sessionToken(req), auth))) return res.status(401).json({ error: 'Sign in to LAWPEX Administration.' });
    next();
  }));
  router.post('/admin/session', asyncRoute(async (req, res) => {
    const credentials = z.object({ email: z.string().max(254), password: z.string().max(1024) }).safeParse(req.body);
    const ip = process.env.VERCEL ? req.get('x-vercel-forwarded-for') || req.ip : req.ip;
    if (!await repository!.allowLogin(sessionHash(`login:${ip}`, auth!))) return res.status(429).json({ error: 'Too many sign-in attempts. Try again in 15 minutes.' });
    if (!credentials.success || !await verifyAdminPassword(credentials.data.password, auth!.passwordHash) || credentials.data.email.toLowerCase() !== auth!.email.toLowerCase()) return res.status(401).json({ error: 'Email or password is incorrect.' });
    const token = randomBytes(32).toString('hex');
    await repository!.createSession(sessionHash(token, auth!), new Date(Date.now() + 8 * 60 * 60 * 1000));
    res.setHeader('Set-Cookie', sessionCookie(token, auth!));
    res.json({ email: auth!.email });
  }));
  router.get('/admin/session', (_req, res) => res.json({ email: auth!.email }));
  router.delete('/admin/session', asyncRoute(async (req, res) => {
    await repository!.deleteSession(sessionHash(sessionToken(req), auth!));
    res.setHeader('Set-Cookie', sessionCookie('', auth!, 0));
    res.json({ ok: true });
  }));
  router.get('/admin/cases', asyncRoute(async (_req, res) => res.json({ records: await repository!.list() })));
  router.put('/admin/cases/:id', asyncRoute(async (req, res) => {
    const parsed = recordSchema.safeParse(req.body?.record);
    const version = versionSchema.safeParse(req.body?.version);
    if (!parsed.success || !version.success || parsed.data.id !== req.params.id) throw new PublishingError(400, 'Invalid case record or revision.');
    // Preserve property order: existing review fingerprints include JSON order.
    let record = req.body.record as AdminCaseRecord;
    const previous = await repository!.get(record.id);
    if ((previous?.version ?? 0) !== version.data) throw new PublishingError(409, 'This case changed in another session. Export your edits, then reload the workspace.');
    if (['Approved', 'Published'].includes(record.status)) {
      const desiredStatus = record.status;
      const expectedPrevious = desiredStatus === 'Approved' ? ['Under Review', 'Approved'] : ['Approved', 'Published'];
      if (!previous || !expectedPrevious.includes(previous.record.status)) throw new PublishingError(422, 'Review and approve the case before publication.');
      const gaps = publicationGaps(record);
      if (gaps.length) throw new PublishingError(422, `Publication blocked: ${gaps.join(', ')}.`);
      const source = await repository!.getSource(record.sourceDocument.storageKey);
      if (!source || createHash('sha256').update(source.data).digest('hex') !== record.sourceExtraction?.sha256 || createHash('sha256').update(record.sourceExtraction.text).digest('hex') !== record.sourceExtraction.textSha256) throw new PublishingError(422, 'The preserved source must match the verified extraction.');
      const checked = await compileCaseReport(record);
      if (checked.validation?.errors.length || !checked.preparedReportText || reviewFingerprint(checked) !== reviewFingerprint(record)) throw new PublishingError(422, 'The report must pass source verification before publication.');
      record = { ...checked, review: record.review, status: desiredStatus, auditLog: record.auditLog };
    }
    const savedVersion = await repository!.save(record, version.data);
    res.json({ version: savedVersion });
  }));
  router.delete('/admin/cases/:id', asyncRoute(async (req, res) => {
    const version = versionSchema.safeParse(req.body?.version);
    if (!version.success) throw new PublishingError(400, 'A revision is required to remove a case.');
    await repository!.remove(req.params.id, version.data);
    res.json({ ok: true });
  }));
  router.put('/admin/sources/:key', express.raw({ type: () => true, limit: '64mb' }), asyncRoute(async (req, res) => {
    if (!Buffer.isBuffer(req.body) || !req.body.length || req.params.key.length > 200) throw new PublishingError(400, 'A source document is required.');
    await repository!.saveSource(req.params.key, req.body, req.get('content-type') || 'application/octet-stream');
    res.json({ ok: true });
  }));
  router.get('/admin/sources/:key', asyncRoute(async (req, res) => {
    const source = await repository!.getSource(req.params.key);
    if (!source) throw new PublishingError(404, 'Source document not found.');
    res.type('application/octet-stream').set('X-Content-Type-Options', 'nosniff').send(source.data);
  }));
  router.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    if (!error.status) console.error('Case publishing failed:', error.message);
    res.status(error.status || 503).json({ error: error.status ? error.message : 'The shared library is unavailable. Your edits have not been published. Please retry.' });
  });
  return router;
}
