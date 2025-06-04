// ===========================
// server.js (백엔드 - Puppeteer)
// ===========================
import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/fb-video', async (req, res) => {
    const adId = req.query.id;
    if (!adId) {
        return res.status(400).json({ error: 'Missing ad ID' });
    }

    const targetUrl = `https://www.facebook.com/ads/library/?id=${adId}`;
    console.log('▶️ Opening URL:', targetUrl);

    try {
        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // 페이지 안정화를 위해 스크롤 & 타임아웃
        await page.waitForTimeout(2000);
        await page.evaluate(() => window.scrollBy(0, 800));
        await page.waitForTimeout(3000);

        // "재생" 버튼 클릭 시도
        const playBtn = await page.waitForSelector('div[aria-label="재생"], div[aria-label="Play"]', { timeout: 15000 });
        await playBtn.click();
        await page.waitForTimeout(5000);

        // HTML 내 비디오 URL 추출
        const content = await page.content();
        const match = content.match(/"playable_url":"(https:\\u002F\\u002Fvideo[^\"]+)/);

        await browser.close();

        if (match) {
            const url = match[1].replace(/\\u002F/g, '/');
            return res.json({ videoUrl: decodeURIComponent(url) });
        } else {
            return res.json({ videoUrl: null });
        }
    } catch (err) {
        console.error('puppeteer error:', err);
        return res.status(500).json({ error: 'Puppeteer failed' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Proxy with puppeteer ready on http://0.0.0.0:${PORT}`);
});
