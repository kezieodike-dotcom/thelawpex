import assert from 'node:assert/strict';
import test from 'node:test';
import { once } from 'node:events';
import { createApiApp } from '../server';

test('draft API routes agreement briefs and documents to agreement drafting, preserving court compatibility', async (t) => {
  const oldKey = process.env.GEMINI_API_KEY;
  process.env.GEMINI_API_KEY = 'test-key-no-live-requests';
  const originalFetch = globalThis.fetch;
  const providerRequests: any[] = [];
  let emptyOutput = false;
  t.mock.method(globalThis, 'fetch', async (input: any, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    assert.match(url, /^https:\/\/generativelanguage\.googleapis\.com\//, 'No real provider requests allowed');
    const body = input instanceof Request ? await input.text() : String(init?.body);
    providerRequests.push(JSON.parse(body));
    return Response.json({
      candidates: [{ content: { role: 'model', parts: [{ text: emptyOutput ? '' : 'WORKING DRAFT\nSupplied particulars only.' }] }, finishReason: 'STOP', index: 0 }],
      modelVersion: 'test-model', usageMetadata: { promptTokenCount: 1, candidatesTokenCount: 1, totalTokenCount: 2 },
    });
  });
  const server = createApiApp({ repository: null, auth: null }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const post = async (fields: Record<string, string>, attachment?: File) => {
    const body = new FormData();
    Object.entries(fields).forEach(([key, value]) => body.set(key, value));
    if (attachment) body.append('documents', attachment);
    return originalFetch(`http://127.0.0.1:${address.port}/api/ai/draft-wizard`, { method: 'POST', body });
  };
  try {
    let response = await post({ draftType: 'agreement', facts: ' ', instructions: 'Draft terms.' });
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /nature of the agreement/);
    response = await post({ draftType: 'unknown', facts: 'A transaction.', instructions: 'Draft.' });
    assert.equal(response.status, 400);
    response = await post({ draftType: 'agreement', facts: 'A transaction.', instructions: 'Draft.' }, new File([], 'empty.txt'));
    assert.equal(response.status, 400);
    assert.equal(providerRequests.length, 0);

    response = await post({
      draftType: 'agreement', agreementTitle: 'Deed of Assignment',
      agreementParties: 'Ada: assignor; Chidi: assignee', facts: 'A sale of land in Rivers State.',
      instructions: 'Include the agreed completion conditions.',
    }, new File(['Title particulars from counsel.'], 'title.txt'));
    assert.equal(response.status, 200);
    let result = await response.json();
    assert.equal(result.documentTitle, 'Deed of Assignment');
    assert.equal(result.documentCount, 1);
    assert.equal(result.draftText, 'WORKING DRAFT\nSupplied particulars only.');
    assert.match(result.notice, /execution/);
    const request = providerRequests.at(-1);
    assert.match(request.contents[0].parts[0].text, /PARTIES AND THEIR ROLES: Ada: assignor; Chidi: assignee/);
    assert.match(request.contents[0].parts[0].text, /Title particulars from counsel/);
    assert.match(request.systemInstruction.parts[0].text, /Do not add court headings/);

    response = await post({ draftType: 'agreement', facts: 'A services arrangement.', instructions: 'Draft services terms.' }, new File(['%PDF-test'], 'terms.pdf', { type: 'application/pdf' }));
    assert.equal(response.status, 200);
    result = await response.json();
    assert.equal(result.documentTitle, 'LAWPEX Legal Agreement');
    assert.equal(providerRequests.at(-1).contents[0].parts[1].inlineData.mimeType, 'application/pdf');

    response = await post({ matterTitle: 'Eviction', facts: 'The locks were changed.', instructions: 'Draft originating process.', court: 'High Court of Rivers State' });
    assert.equal(response.status, 200);
    result = await response.json();
    assert.equal(result.documentTitle, 'Eviction');
    assert.match(providerRequests.at(-1).contents[0].parts[0].text, /CASE SCENARIO AND ISSUES/);
    assert.match(result.notice, /filing/);

    emptyOutput = true;
    response = await post({ draftType: 'agreement', facts: 'A transaction.', instructions: 'Draft terms.' });
    assert.equal(response.status, 502);
    assert.match((await response.json()).error, /empty document/);
  } finally {
    if (oldKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = oldKey;
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
