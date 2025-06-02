// proxy/server.js
const express = require('express');
const { fetch } = require('undici'); // ← node-fetch 대신 이걸 사용
const cheerio = require('cheerio');

const app = express();

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/fb-video', async (req, res) => {
    const id = req.query.id;
    const targetUrl = `https://www.facebook.com/ads/library/?id=${id}`;

    try {
        const html = await fetch(targetUrl).then(res => res.text());
        const match = html.match(/"playable_url":"(https:\/\/video[^"]+)"/);

        if (match) {
            const url = match[1]
                .replace(/\\u0025/g, '%')
                .replace(/\\\//g, '/');
            return res.json({ videoUrl: decodeURIComponent(url) });
        } else {
            return res.json({ videoUrl: null });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch Facebook ad page' });
    }
});

app.listen(3000, () => {
    console.log('✅ Proxy listening on http://localhost:3000');
});