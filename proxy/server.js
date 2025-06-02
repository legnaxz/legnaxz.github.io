// server.js (puppeteer 기반)
import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

app.get('/fb-video', async (req, res) => {
    const adId = req.query.id;
    const targetUrl = `https://www.facebook.com/ads/library/?id=${adId}`;

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(targetUrl, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });

        const html = await page.content();

        const match = html.match(/"playable_url":"(https:\/\/video[^"]+)"/);

        await browser.close();

        if (match) {
            const url = match[1].replace(/\\u0025/g, '%').replace(/\\\//g, '/');
            return res.json({ videoUrl: decodeURIComponent(url) });
        } else {
            return res.json({ videoUrl: null });
        }
    } catch (err) {
        console.error('puppeteer error:', err);
        return res.status(500).json({ error: 'Puppeteer failed to fetch' });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('✅ Proxy with puppeteer ready on http://0.0.0.0:3000');
});