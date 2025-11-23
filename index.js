const express = require('express');
const cors = require('cors');
const Joi = require('joi');

// Simple in-memory store fallback so the app can run without Postgres.
// If you have a Postgres DB and want to use it, we can add that later.

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

function generateCode(len = 6){
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let out = '';
	for (let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)];
	return out;
}

const createSchema = Joi.object({
	target: Joi.string().uri({ scheme: [/https?/] }).required(),
	code: Joi.string().alphanum().min(6).max(8).optional().allow(null,'')
});

const store = new Map(); // code -> { code, target, total_clicks, last_clicked, created_at }

app.get('/healthz', (req, res) => res.json({ ok: true, version: '1.0' }));

app.post('/api/links', async (req, res) => {
	const { error, value } = createSchema.validate(req.body || {});
	if (error) return res.status(400).json({ error: error.details[0].message });
	let { target, code } = value;

	if (!code) {
		for (let i = 0; i < 6; i++){
			const tryCode = generateCode(6);
			if (!store.has(tryCode)) { code = tryCode; break; }
		}
		if (!code) return res.status(500).json({ error: 'failed to generate unique code' });
	}

	if (!/^[A-Za-z0-9]{6,8}$/.test(code)) return res.status(400).json({ error: 'code must be alphanumeric 6-8 chars' });
	if (store.has(code)) return res.status(409).json({ error: 'code already exists' });

	const now = new Date();
	const obj = { code, target, total_clicks: 0, last_clicked: null, created_at: now.toISOString() };
	store.set(code, obj);
	res.status(201).json(obj);
});

app.get('/api/links', async (req, res) => {
	const arr = Array.from(store.values()).sort((a,b)=> new Date(b.created_at) - new Date(a.created_at));
	res.json(arr);
});

app.get('/api/links/:code', async (req, res) => {
	const { code } = req.params;
	const obj = store.get(code);
	if (!obj) return res.status(404).json({ error: 'not found' });
	res.json(obj);
});

app.delete('/api/links/:code', async (req, res) => {
	const { code } = req.params;
	const existed = store.delete(code);
	if (!existed) return res.status(404).json({ error: 'not found' });
	res.json({ ok: true });
});

app.get('/:code', async (req, res) => {
	const { code } = req.params;
	if (!/^[A-Za-z0-9]{1,8}$/.test(code)) return res.status(404).send('Not found');
	const obj = store.get(code);
	if (!obj) return res.status(404).send('Not found');
	obj.total_clicks = (obj.total_clicks || 0) + 1;
	obj.last_clicked = new Date().toISOString();
	return res.redirect(302, obj.target);
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));