import fastify from 'fastify';
const app = fastify(); app.get('/api/sillytavern-memorykit/health', async ()=>({ok:true}));
app.listen({port:5111,host:'127.0.0.1'});