process.env.LAWPEX_APP = 'admin';
const { startServer } = await import('../server');
await startServer();
